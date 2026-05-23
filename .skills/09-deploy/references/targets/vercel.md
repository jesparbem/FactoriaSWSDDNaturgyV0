# Target · Vercel
**Cuándo se usa:** Proyectos no-internos o donde el equipo justifique frente al usuario (open source, demos, prototipos públicos). NO el default Naturgy para apps productivas internas.

## Cuándo SÍ usar Vercel (en contexto Naturgy)
- Demo pública / landing temporal.
- Proyecto OSS publicado bajo cuenta corporativa OSS.
- PoC ante stakeholder externo donde Azure es overhead.

## Cuándo NO usar Vercel (regla por defecto)
- Cualquier app productiva interna → Azure (App Service / Container Apps / AKS).
- Apps que manejen datos personales de clientes Naturgy.
- Apps con compliance ENS o que toquen infra corporativa.

## Prerrequisitos
- Cuenta Vercel (org Naturgy o personal de demo).
- `vercel` CLI: `npm i -g vercel`.
- Autenticación: `vercel login`.

## Deploy preview

Vercel hace preview automático en cada push a una branch que no sea `main`. Para deploy manual:

```bash
# Preview (devuelve URL temporal)
vercel
# ⇒ https://mi-app-git-feature-x-{org}.vercel.app
```

## Health check

```bash
PREVIEW_URL=$(vercel ls --token $VERCEL_TOKEN | grep mi-app | head -1 | awk '{print $2}')
curl -fsS "${PREVIEW_URL}/health"
```

## Promoción a producción

```bash
# Promover el último deploy a producción
vercel --prod

# O alias el preview URL a producción
vercel alias ${PREVIEW_URL} mi-app.vercel.app
```

## Rollback

```bash
# Listar deploys
vercel ls

# Promover un deploy anterior
vercel promote {URL_DEPLOY_ANTERIOR}
```

Tiempo de rollback: **< 30 segundos**.

## Variables de entorno

```bash
# Por entorno
vercel env add DATABASE_URL production
vercel env add DATABASE_URL preview
vercel env add DATABASE_URL development

# Pull a local
vercel env pull .env.local
```

## Configuración (`vercel.json`)

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm ci",
  "regions": ["fra1", "cdg1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Content-Security-Policy", "value": "default-src 'self'" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000" }
      ]
    }
  ]
}
```

## Observabilidad

- Vercel Analytics (gratis hasta cierto tráfico).
- Vercel Logs (búsqueda en runtime logs).
- Para apps Naturgy: re-emitir logs a App Insights vía Vercel Log Drains.

## Anti-patrones

- ❌ Datos personales Naturgy en proyectos hosteados en Vercel.
- ❌ Conexión directa a BD corporativas desde Vercel sin VPN/Private Link.
- ❌ Vercel para apps productivas internas (Azure es el default).
- ❌ Sin Vercel Log Drains si la app es algo más que demo.
