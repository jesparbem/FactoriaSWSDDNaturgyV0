#!/usr/bin/env bash
###############################################################################
# FactorIA 2.0 · Deploy a Azure Container Apps
#
# Pensado para Cloud Shell (portal.azure.com → icono terminal arriba derecha).
# Cloud Shell viene con `az` ya autenticado, así evitamos los problemas de
# Conditional Access que bloquean `az login` desde máquinas locales.
#
# Uso:
#   bash deploy-azure.sh
#
# Idempotente: si un recurso ya existe, lo reutiliza.
###############################################################################

set -euo pipefail

# === Variables ===============================================================
SUBSCRIPTION="57154994-67f1-440e-85c5-7ae0db8549f8"
RG="rg-sandbox-lab-factoria"
LOCATION="westeurope"
PROJECT="factoria2"
ENV_TAG="sandbox"

ACR_NAME="acrfactoria2sandbox"          # 5-50 chars, alphanumeric, NO guiones
LOG_WS="log-${PROJECT}-${ENV_TAG}"
CAE_NAME="cae-${PROJECT}-${ENV_TAG}"
IDENTITY_NAME="id-${PROJECT}-${ENV_TAG}"
APP_NAME="ca-${PROJECT}-${ENV_TAG}"
IMAGE_TAG="v2.0"
REPO_URL="https://github.com/jesparbem/FactoriaSWSDDNaturgyV0.git"

# Colores para logs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

say() { echo -e "${CYAN}▶ $*${NC}"; }
ok()  { echo -e "${GREEN}✓ $*${NC}"; }
warn(){ echo -e "${YELLOW}⚠ $*${NC}"; }
err() { echo -e "${RED}✗ $*${NC}"; }

# === 0. Contexto =============================================================
say "0. Configurando contexto Azure..."
az account set --subscription "$SUBSCRIPTION"
az account show --query "{user:user.name, sub:name, id:id}" -o table

say "Verificando RG $RG..."
if ! az group show --name "$RG" --query name -o tsv >/dev/null 2>&1; then
  err "Resource Group $RG no encontrado o sin acceso"
  exit 1
fi
ok "RG accesible"

# === 1. Clonar repo si no estamos ya dentro ==================================
if [ ! -f "webapp/Dockerfile" ]; then
  say "1. Clonando repo..."
  if [ ! -d "FactoriaSWSDDNaturgyV0" ]; then
    git clone "$REPO_URL"
  fi
  cd FactoriaSWSDDNaturgyV0
  ok "Repo clonado en $(pwd)"
else
  ok "Ya estamos dentro del repo en $(pwd)"
fi

# === 2. ACR ==================================================================
say "2. Container Registry $ACR_NAME..."
if az acr show --name "$ACR_NAME" --query name -o tsv >/dev/null 2>&1; then
  ok "ACR ya existe"
else
  az acr create \
    --name "$ACR_NAME" \
    --resource-group "$RG" \
    --sku Basic \
    --location "$LOCATION" \
    --admin-enabled true \
    --output none
  ok "ACR creado (con admin habilitado para auth desde Container App)"
fi
# Asegurar admin enabled (también si el ACR ya existía)
az acr update --name "$ACR_NAME" --admin-enabled true --output none 2>/dev/null || true
ACR_USERNAME=$(az acr credential show --name "$ACR_NAME" --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name "$ACR_NAME" --query "passwords[0].value" -o tsv)

# === 3. Log Analytics Workspace ==============================================
say "3. Log Analytics Workspace $LOG_WS..."
if az monitor log-analytics workspace show --resource-group "$RG" --workspace-name "$LOG_WS" --query name -o tsv >/dev/null 2>&1; then
  ok "Workspace ya existe"
else
  az monitor log-analytics workspace create \
    --resource-group "$RG" \
    --workspace-name "$LOG_WS" \
    --location "$LOCATION" \
    --output none
  ok "Workspace creado"
fi
LOG_ID=$(az monitor log-analytics workspace show \
  --resource-group "$RG" --workspace-name "$LOG_WS" --query customerId -o tsv)
LOG_KEY=$(az monitor log-analytics workspace get-shared-keys \
  --resource-group "$RG" --workspace-name "$LOG_WS" --query primarySharedKey -o tsv)

# === 4. Container Apps Environment ==========================================
say "4. Container Apps Environment $CAE_NAME (este es el paso lento, ~3-5 min)..."
# Asegurar provider
az provider register --namespace Microsoft.App --wait --output none 2>/dev/null || true
az provider register --namespace Microsoft.OperationalInsights --wait --output none 2>/dev/null || true

if az containerapp env show --name "$CAE_NAME" --resource-group "$RG" --query name -o tsv >/dev/null 2>&1; then
  ok "Environment ya existe"
else
  az containerapp env create \
    --name "$CAE_NAME" \
    --resource-group "$RG" \
    --location "$LOCATION" \
    --logs-workspace-id "$LOG_ID" \
    --logs-workspace-key "$LOG_KEY" \
    --output none
  ok "Environment creado"
fi

# === 5-6. Auth ACR vía admin credentials (más fiable en sandbox) ===========
# En lugar de Managed Identity + role assignment (que falla por propagación
# lenta de Graph o por falta de permisos), usamos admin del ACR.
# Para producción real usar Managed Identity + AcrPull explícito.
ok "Saltando Managed Identity · usaremos admin del ACR (sandbox)"

# === 7. Build de la imagen (en cloud, sin Docker local) =====================
say "7. Construyendo imagen en ACR (az acr build)... ~3-5 min"
cd webapp
az acr build \
  --registry "$ACR_NAME" \
  --image "factoria2:${IMAGE_TAG}" \
  --image "factoria2:latest" \
  --file Dockerfile \
  .
cd ..
ok "Imagen ${ACR_NAME}.azurecr.io/factoria2:${IMAGE_TAG} construida"

# === 8. Crear / actualizar Container App ====================================
say "8. Container App $APP_NAME..."
IMAGE="${ACR_NAME}.azurecr.io/factoria2:${IMAGE_TAG}"

if az containerapp show --name "$APP_NAME" --resource-group "$RG" --query name -o tsv >/dev/null 2>&1; then
  say "  Actualizando con nueva imagen..."
  az containerapp update \
    --name "$APP_NAME" \
    --resource-group "$RG" \
    --image "$IMAGE" \
    --output none
  ok "App actualizada (nueva revisión creada)"
else
  say "  Creando por primera vez..."
  az containerapp create \
    --name "$APP_NAME" \
    --resource-group "$RG" \
    --environment "$CAE_NAME" \
    --image "$IMAGE" \
    --target-port 3000 \
    --ingress external \
    --min-replicas 0 \
    --max-replicas 3 \
    --cpu 0.5 \
    --memory 1Gi \
    --registry-server "${ACR_NAME}.azurecr.io" \
    --registry-username "$ACR_USERNAME" \
    --registry-password "$ACR_PASSWORD" \
    --env-vars "NODE_ENV=production" "NEXT_TELEMETRY_DISABLED=1" "PORT=3000" \
    --output none
  ok "Container App creada"
fi

# === 9. Obtener URL pública =================================================
URL=$(az containerapp show \
  --name "$APP_NAME" \
  --resource-group "$RG" \
  --query properties.configuration.ingress.fqdn -o tsv)

echo ""
echo "=============================================================="
ok "🎉 DEPLOY COMPLETADO"
echo "=============================================================="
echo ""
echo -e "${CYAN}URL pública:${NC}"
echo -e "  ${GREEN}https://${URL}${NC}"
echo ""
echo -e "${CYAN}Endpoints útiles:${NC}"
echo "  https://${URL}/           (UI)"
echo "  https://${URL}/health     (liveness)"
echo "  https://${URL}/api/swarm  (API dinámica)"
echo ""

# === 10. Smoke test =========================================================
say "10. Smoke test (esperando 30s a que la app arranque)..."
sleep 30

echo ""
echo -n "/health → "
if curl -sf "https://${URL}/health" >/dev/null; then
  ok "OK"
  curl -s "https://${URL}/health" | head -c 200
  echo ""
else
  warn "todavía no responde — puede tardar 1-2 min más"
fi

echo ""
echo -n "/ → "
if curl -sf "https://${URL}/" -o /dev/null; then
  ok "HTTP 200"
else
  warn "todavía no responde"
fi

echo ""
echo "=============================================================="
echo -e "${CYAN}Logs en vivo (Ctrl+C para salir):${NC}"
echo "  az containerapp logs show --name $APP_NAME -g $RG --follow"
echo ""
echo -e "${CYAN}Rollback (a revisión anterior):${NC}"
echo "  az containerapp revision list --name $APP_NAME -g $RG -o table"
echo "  az containerapp ingress traffic set --name $APP_NAME -g $RG --revision-weight <prev>=100 <new>=0"
echo "=============================================================="
