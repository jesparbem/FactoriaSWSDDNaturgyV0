# Target · Docker + SSH VPS
**Cuándo se usa:** Apps self-hosted en servidores Naturgy on-premise o VPS dedicados. Caso típico: aplicaciones legacy migradas a contenedores pero aún en infra propia.

## Prerrequisitos
- Servidor Linux (Ubuntu 22.04+ recomendado) con SSH habilitado.
- Docker + Docker Compose instalados.
- Usuario `deploy` con permisos sudo limitados a Docker.
- Firewall configurado: 22 (SSH desde bastión), 443 (HTTPS), 80 (redirect).
- Nginx o Traefik como reverse proxy + certificados Let's Encrypt.

## Variables
```
SSH_HOST=app01.intranet.naturgy.com
SSH_USER=deploy
SSH_KEY=~/.ssh/id_ed25519_app01
APP_DIR=/opt/apps/{nombre}
IMAGE_TAG=$(git rev-parse --short HEAD)
REGISTRY=acrnaturgy.azurecr.io  # o ghcr.io/naturgy
```

## Build + push al registry

```bash
docker build -t ${REGISTRY}/${APP_NAME}:${IMAGE_TAG} .
docker push ${REGISTRY}/${APP_NAME}:${IMAGE_TAG}
```

## Estructura en el servidor

```
/opt/apps/{nombre}/
├── docker-compose.yml      ← versionado en repo
├── .env                    ← solo en servidor, NO en repo
├── nginx/
│   └── default.conf
└── data/                   ← volúmenes persistentes
    ├── postgres/
    └── uploads/
```

## docker-compose.yml ejemplo

```yaml
version: '3.9'

services:
  app:
    image: ${REGISTRY}/${APP_NAME}:${IMAGE_TAG}
    restart: unless-stopped
    env_file: .env
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      app:
        condition: service_healthy
```

## Deploy preview (no aplica directo)

Sin slots nativos. Opciones para "preview":

1. **Servidor de staging dedicado** (`stage.app.intranet.naturgy.com`) con mismo compose pero `.env.staging`.
2. **Branch deploys** con docker-compose extendido (`docker-compose.preview.yml`) en puerto distinto.

Preview = deploy en el servidor de staging y health check antes de tocar prod.

## Deploy a producción (manual y trazable)

```bash
# Pull de la nueva imagen
ssh -i $SSH_KEY ${SSH_USER}@${SSH_HOST} \
  "cd ${APP_DIR} && docker pull ${REGISTRY}/${APP_NAME}:${IMAGE_TAG}"

# Actualizar tag en compose (vía env var o sed cuidadoso)
ssh -i $SSH_KEY ${SSH_USER}@${SSH_HOST} \
  "cd ${APP_DIR} && IMAGE_TAG=${IMAGE_TAG} docker compose up -d app --wait"

# Verificar
ssh -i $SSH_KEY ${SSH_USER}@${SSH_HOST} \
  "cd ${APP_DIR} && docker compose ps && curl -fsS http://localhost:3000/health"
```

## Health check post-deploy

```bash
sleep 15  # dar tiempo a healthcheck del compose
curl -fsS https://app.intranet.naturgy.com/health
curl -fsS https://app.intranet.naturgy.com/health/ready
```

## Rollback

```bash
# Asume que tienes guardada la tag previa
PREV_TAG=$(ssh -i $SSH_KEY ${SSH_USER}@${SSH_HOST} \
  "cat ${APP_DIR}/.previous-tag 2>/dev/null || echo 'unknown'")

ssh -i $SSH_KEY ${SSH_USER}@${SSH_HOST} \
  "cd ${APP_DIR} && IMAGE_TAG=${PREV_TAG} docker compose up -d app --wait"
```

Tiempo de rollback: **30-60 segundos** (depende del peso de la imagen).

> Tip: guardar `IMAGE_TAG` actual a `.previous-tag` ANTES de actualizar, así rollback es 1 comando.

## Secretos

- `.env` en el servidor con permisos `600`, owner `deploy:deploy`.
- NUNCA `.env` en el repo (ya está en `.gitignore`).
- Rotación: documentada en `SECRETS.md`.
- Idealmente integración con Vault interno Naturgy si está disponible.

## Observabilidad

- Logs: `docker compose logs --tail 200 -f app` (acceso vía SSH).
- Centralizados: Filebeat/Promtail → Loki/ELK corporativo.
- Métricas: cAdvisor + Prometheus si hay stack monitorización.
- Alertas: integrar con sistema de alertas Naturgy (Splunk, etc.).

## Anti-patrones

- ❌ `docker run` manual en lugar de compose.
- ❌ `.env` versionado en git.
- ❌ Sin healthchecks en compose → reinicios sin detección.
- ❌ Volúmenes en `/tmp` → datos perdidos al reiniciar.
- ❌ Servidor sin updates automáticos de seguridad.
- ❌ Acceso SSH con password (solo claves).
- ❌ Sin backups automáticos de `data/postgres/`.
