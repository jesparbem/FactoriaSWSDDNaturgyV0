# Stack → Hosting · Tabla de detección automática
**Consumido por:** `@deploy` (fase 1: DETECT)

`@deploy` inspecciona el proyecto, detecta el stack y propone el hosting óptimo. El usuario aprueba o sobreescribe.

## Detección por fingerprint

| Fingerprint en el repo | Stack detectado | Hosting recomendado | Alternativa |
|---|---|---|---|
| `next.config.js` o `next.config.ts` | Next.js | **Azure App Service** (Naturgy default) | Vercel |
| `vite.config.{js,ts}` + framework SPA | Vite + React/Vue/Svelte (SPA) | **Azure Static Web Apps** | Cloudflare Pages |
| `astro.config.{mjs,ts}` | Astro | **Azure Static Web Apps** | Vercel |
| `remix.config.{js,ts}` | Remix | **Azure App Service** | Vercel |
| `nuxt.config.{js,ts}` | Nuxt | **Azure App Service** | Vercel |
| `svelte.config.{js,ts}` + adapter | SvelteKit | **Azure App Service** | Vercel |
| `pyproject.toml` con FastAPI/Flask | API Python | **Azure Container Apps** | Railway |
| `pyproject.toml` con celery/temporal | Workers Python | **Azure Container Apps** (background) | — |
| `package.json` con `express` / `fastify` / `nestjs` | API Node | **Azure App Service** | Railway |
| `*.csproj` + .NET 8 | .NET API | **Azure App Service** | Container Apps |
| `pom.xml` o `build.gradle` con Spring Boot | Java Spring | **Azure App Service** | AKS |
| `Dockerfile` + `docker-compose.yml` multi-servicio | Multi-servicio dockerizado | **AKS** | Docker + SSH VPS |
| `Dockerfile` único stateless | Cualquier contenedor | **Azure Container Apps** | Docker + SSH |
| `serverless.yml` o `azure-functions/host.json` | Functions | **Azure Functions** | — |
| `helm/` o `kustomize/` | App Kubernetes-native | **AKS** | — |
| Solo HTML/CSS/JS estáticos | Sitio estático | **Azure Static Web Apps** | Front Door + Blob |
| `airflow/`, `dagster/`, `prefect/` | Orquestador ETL | **Azure Container Apps** | AKS |

## Prioridad de fingerprints

Si el proyecto tiene varios indicadores, se aplica este orden:

1. **`Dockerfile` multi-stage + compose** → AKS / Container Apps prevalece sobre detección de framework.
2. **`helm/` o `kustomize/`** → AKS prevalece sobre todo.
3. **`serverless.yml`** → Functions prevalece.
4. **Framework explícito** (next.config, etc.) → el del framework.

## Casos no-Naturgy (proyectos abiertos, OSS, hackathon)

Para proyectos que no requieren infra corporativa, alternativas válidas:

| Caso | Hosting |
|---|---|
| Next.js / Astro | Vercel |
| API Python/Node | Railway · Fly.io · Render |
| App full-stack pequeña | Render · Railway |
| Demo / webhook temporal | cloudflared tunnel |

## Reglas de elección

1. **Por defecto Azure** (alineado con corporativo Naturgy).
2. **App Service > Container Apps > AKS**, en orden de preferencia (menos a más complejidad).
3. **Static Web Apps** para frontend puro sin SSR pesado.
4. **AKS solo si**: multi-servicio + necesidad de orquestación fina + equipo capacitado.
5. **Vercel** OK para proyectos no-internos o donde el equipo lo justifique frente al usuario.

## Anti-patrones que `@deploy` debe rechazar

- **Levantar AKS para un único contenedor** → propone Container Apps.
- **Static Web Apps con SSR pesado** → propone App Service o Container Apps.
- **Functions para latencia constante < 1s** → cold starts arruinan UX, propone App Service.
- **App Service con > 10 microservicios independientes** → propone AKS / Container Apps.

## Output esperado

`@deploy` genera al final de la fase DETECT:
```
Stack detectado: Next.js 14 (App Router)
Hosting propuesto: Azure App Service (Linux, Node 20)
Alternativa: Vercel (si proyecto no requiere infra Naturgy)
Razón: detectado next.config.ts + dependencias React 18 + Next 14
Confirma o sobreescribe.
```
