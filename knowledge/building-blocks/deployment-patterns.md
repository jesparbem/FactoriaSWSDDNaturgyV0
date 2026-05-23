# Building Block · Patrones de Despliegue
**Consumido por:** `@architect`, `@devops`, `@deploy`

## Hostings preferidos en Naturgy

| Caso | Hosting | Notas |
|---|---|---|
| Web app stateless | Azure App Service | Default seguro |
| Contenedores con autoscaling | Azure Container Apps | Si la app va dockerizada |
| Microservicios complejos | AKS (Azure Kubernetes Service) | Solo si se justifica complejidad |
| Frontend estático puro | Azure Static Web Apps | O Front Door + Blob |
| Workers / batch | Azure Functions | Plan Premium si necesidad de always-on |
| Casos no-Naturgy / demos | Vercel · Railway · Docker+SSH | Solo proyectos pequeños/externos |

## Estrategia de release
- **Blue-green** por defecto en App Service (slots).
- **Canary** en Container Apps / AKS para apps de alto impacto.
- **Rolling** solo si las dos anteriores no aplican.
- **Big bang** = NO (salvo first deploy).

## CI/CD
- Pipelines en GitHub Actions o Azure DevOps según convenio del equipo.
- Stages obligatorios: `build` → `test` → `audit (cyber/legal/a11y/perf)` → `deploy preview` → `deploy prod`.
- Imagen Docker reproducible (lockfiles, base versionada, multi-stage).
- Tags semánticos (`v1.2.3`) + SHA del commit.

## Secretos
- Azure Key Vault como fuente única de verdad.
- Referencias en App Service / Container Apps vía Managed Identity (no copia en variables).
- Rotación documentada en `SECRETS.md`.

## Observabilidad mínima en producción
- **Logs estructurados** (JSON) → App Insights.
- **Métricas**: 4 golden signals (latency, traffic, errors, saturation).
- **Alertas**: al menos 1 por flujo de negocio crítico.
- **Health endpoint** (`/health` y `/health/ready`).
- **Correlation IDs** propagados entre servicios.

## Rollback
- Probado en staging antes de cada release significativo.
- Comando documentado en `ROLLBACK.md`.
- Tiempo objetivo de rollback: < 5 minutos.

## Reglas no negociables (ver `.skills/09-deploy/references/hard-rules.md`)
- Sin preview verde, no producción.
- Sin auditorías en verde (cyber + legal + a11y + perf), no producción.
- Sin tests verdes en CI, no producción.
- Sin rollback armado, no producción.
- Sin observabilidad mínima, no producción.
