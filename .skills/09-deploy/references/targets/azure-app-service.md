# Target · Azure App Service
**Cuándo se usa:** Default Naturgy para web apps stateless (Next.js, Node, .NET, Python). Slots para blue-green.

## Prerrequisitos
- Suscripción Azure activa.
- `az` CLI instalado y autenticado: `az login`.
- Grupo de recursos: `rg-{proyecto}-{entorno}`.
- App Service Plan: Linux, B2/S1 mínimo en producción.
- Para HTTPS custom: certificado en Key Vault.

## Variables a configurar
```
APP_NAME=app-{proyecto}-{entorno}
RG=rg-{proyecto}-{entorno}
PLAN=plan-{proyecto}-{entorno}
LOCATION=westeurope
RUNTIME="NODE:20-lts"   # o DOTNETCORE:8.0, PYTHON:3.11, etc.
```

## Deploy preview (slot "staging")

```bash
# 1. Confirmar slot staging existe
az webapp deployment slot list -n $APP_NAME -g $RG --query "[].name"

# Si no existe:
az webapp deployment slot create -n $APP_NAME -g $RG --slot staging

# 2. Build local (o en CI)
# Next.js
npm ci && npm run build
# .NET
dotnet publish -c Release -o ./publish
# Python
pip install -r requirements.txt

# 3. Deploy al slot
# Vía zip (rápido)
zip -r app.zip . -x "node_modules/*" ".next/cache/*" ".git/*"
az webapp deploy --resource-group $RG --name $APP_NAME --slot staging \
  --src-path app.zip --type zip

# Vía contenedor (recomendado para .NET / Python)
az webapp deployment source config-zip --resource-group $RG --name $APP_NAME --slot staging --src publish.zip
```

## Health check pre-promoción

```bash
PREVIEW_URL="https://${APP_NAME}-staging.azurewebsites.net"
curl -fsS "${PREVIEW_URL}/health" && echo "OK" || { echo "FAIL"; exit 1; }
curl -fsS "${PREVIEW_URL}/health/ready" && echo "READY" || { echo "NOT READY"; exit 1; }
```

## Promoción a producción (slot swap)

```bash
# Swap atómico staging ↔ production
az webapp deployment slot swap \
  --resource-group $RG \
  --name $APP_NAME \
  --slot staging \
  --target-slot production
```

## Rollback inmediato

```bash
# Swap inverso — segundos
az webapp deployment slot swap \
  --resource-group $RG \
  --name $APP_NAME \
  --slot production \
  --target-slot staging
```

Tiempo de rollback típico: **< 60 segundos**.

## Settings y secretos

```bash
# Settings públicos
az webapp config appsettings set --resource-group $RG --name $APP_NAME --slot staging \
  --settings NODE_ENV=production LOG_LEVEL=info

# Secretos vía Key Vault references (recomendado)
az webapp config appsettings set --resource-group $RG --name $APP_NAME --slot staging \
  --settings DATABASE_URL='@Microsoft.KeyVault(SecretUri=https://kv-naturgy.vault.azure.net/secrets/db-url)'
```

> Managed Identity obligatoria para acceso a Key Vault. NUNCA secret manager con SP key.

## Observabilidad

```bash
# Habilitar App Insights
az monitor app-insights component create --app ai-$APP_NAME --location $LOCATION --resource-group $RG
APPINSIGHTS_KEY=$(az monitor app-insights component show --app ai-$APP_NAME --resource-group $RG --query instrumentationKey -o tsv)
az webapp config appsettings set --resource-group $RG --name $APP_NAME \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY=$APPINSIGHTS_KEY
```

## Sticky settings (importante)

Algunos settings DEBEN ser sticky al slot (no se mueven en swap):
- `NODE_ENV` o `ASPNETCORE_ENVIRONMENT`
- `APPINSIGHTS_INSTRUMENTATIONKEY` (si distinto entre prod/staging)
- URLs externas (BD distinta entre prod/staging)

```bash
az webapp config appsettings set --resource-group $RG --name $APP_NAME --slot staging \
  --slot-settings NODE_ENV=staging
```

## Anti-patrones

- ❌ Deploy directo a producción sin slot.
- ❌ Sticky settings con secretos productivos (que el slot staging vea prod).
- ❌ App Service Plan F1 (Free) en producción — no soporta SSL custom ni slots.
- ❌ Logs a stdout sin App Insights — perderás trazabilidad.
