# Target · Azure Container Apps
**Cuándo se usa:** Contenedores con autoscaling, APIs/workers con tráfico variable, microservicios pequeños. Más simple que AKS, más flexible que App Service.

## Prerrequisitos
- `az` CLI con extensión: `az extension add --name containerapp --upgrade`
- Container Registry: Azure Container Registry (ACR) o GHCR.
- Container Apps Environment: `cae-{proyecto}-{entorno}`.

## Variables
```
APP_NAME=ca-{servicio}-{entorno}
RG=rg-{proyecto}-{entorno}
ENV_NAME=cae-{proyecto}-{entorno}
ACR=acr{proyecto}{entorno}
LOCATION=westeurope
IMAGE_TAG=$(git rev-parse --short HEAD)
```

## Build + push

```bash
# Login al registry
az acr login --name $ACR

# Build + push (puede hacerlo el pipeline)
docker build -t ${ACR}.azurecr.io/${APP_NAME}:${IMAGE_TAG} .
docker push ${ACR}.azurecr.io/${APP_NAME}:${IMAGE_TAG}
```

## Crear / actualizar Container App

```bash
# Primera vez: crear
az containerapp create \
  --name $APP_NAME --resource-group $RG --environment $ENV_NAME \
  --image ${ACR}.azurecr.io/${APP_NAME}:${IMAGE_TAG} \
  --target-port 3000 --ingress external \
  --min-replicas 1 --max-replicas 10 \
  --cpu 0.5 --memory 1Gi \
  --registry-server ${ACR}.azurecr.io \
  --user-assigned $MANAGED_IDENTITY_ID
```

## Deploy nueva revisión (preview por defecto)

Container Apps soporta revisiones nativamente. Cada update crea una revisión, opcionalmente con tráfico al 0%.

```bash
# Crear nueva revisión SIN enviarle tráfico
az containerapp update \
  --name $APP_NAME --resource-group $RG \
  --image ${ACR}.azurecr.io/${APP_NAME}:${IMAGE_TAG} \
  --revision-suffix $IMAGE_TAG

# Ver revisiones
az containerapp revision list --name $APP_NAME --resource-group $RG --query "[].{name:name, traffic:trafficWeight}"
```

## Health check de la nueva revisión

```bash
NEW_REV=$(az containerapp revision list --name $APP_NAME -g $RG --query "[?properties.active].name | [-1]" -o tsv)
REV_URL=$(az containerapp revision show --name $APP_NAME -g $RG --revision $NEW_REV --query "properties.fqdn" -o tsv)

curl -fsS "https://${REV_URL}/health"
curl -fsS "https://${REV_URL}/health/ready"
```

## Promoción (cambio de tráfico)

```bash
# 100% a la nueva, 0% a la anterior
OLD_REV=$(az containerapp revision list --name $APP_NAME -g $RG --query "[?properties.trafficWeight==\`100\`].name | [0]" -o tsv)
az containerapp ingress traffic set --name $APP_NAME --resource-group $RG \
  --revision-weight ${NEW_REV}=100 ${OLD_REV}=0
```

### Canary

```bash
# 10% a la nueva (canary)
az containerapp ingress traffic set --name $APP_NAME --resource-group $RG \
  --revision-weight ${NEW_REV}=10 ${OLD_REV}=90
# observar métricas 30 min
# si todo OK:
az containerapp ingress traffic set --name $APP_NAME --resource-group $RG \
  --revision-weight ${NEW_REV}=100 ${OLD_REV}=0
```

## Rollback inmediato

```bash
az containerapp ingress traffic set --name $APP_NAME --resource-group $RG \
  --revision-weight ${OLD_REV}=100 ${NEW_REV}=0
```

Tiempo de rollback: **< 10 segundos** (solo cambio de routing).

## Secretos

```bash
# Crear secret en la app
az containerapp secret set --name $APP_NAME --resource-group $RG \
  --secrets db-url=keyvaultref:https://kv-naturgy.vault.azure.net/secrets/db-url,identityref:$MANAGED_IDENTITY_ID

# Usar como env var
az containerapp update --name $APP_NAME --resource-group $RG \
  --set-env-vars DATABASE_URL=secretref:db-url
```

## Escalado

```bash
# Min/Max replicas
az containerapp update --name $APP_NAME --resource-group $RG \
  --min-replicas 2 --max-replicas 20

# Por HTTP requests
az containerapp update --name $APP_NAME --resource-group $RG \
  --scale-rule-name http-rule --scale-rule-type http \
  --scale-rule-http-concurrency 30
```

## Anti-patrones

- ❌ Container Apps para apps stateful con almacenamiento local.
- ❌ Min-replicas = 0 en producción (cold starts).
- ❌ Registry sin Managed Identity (passwords de ACR en variables).
- ❌ No usar revisiones (perder rollback instantáneo).
