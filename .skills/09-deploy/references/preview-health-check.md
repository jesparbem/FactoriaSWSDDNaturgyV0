# Preview Health Check · Patrón obligatorio antes de promover a producción
**Consumido por:** `@deploy` (fase 3: PREVIEW + fase 4: CONFIRM)

Nunca se promueve a producción sin un preview verde. El "verde" se demuestra con `curl` real al endpoint de health, no con suposición.

## Flujo de health check

```
1. Deploy a entorno preview (slot, URL temporal, etc.)
2. Espera de propagación (max 60s, con backoff)
3. curl GET {preview_url}/health      → debe responder 2xx
4. curl GET {preview_url}/health/ready → debe responder 2xx
5. (Opcional) curl GET endpoint crítico → smoke test funcional
6. Mostrar URL preview al usuario + resultado de cada check
7. Ventana de escape de 5 segundos (ver abajo)
8. Confirmación explícita del usuario para promover
```

## Endpoints requeridos

Cada app desplegada DEBE exponer:

### `/health` (liveness)
- Responde 200 si el proceso está vivo.
- No verifica dependencias externas.
- Latencia esperada: < 50 ms.

```http
GET /health → 200 OK
Content-Type: application/json
{"status": "ok"}
```

### `/health/ready` (readiness)
- Responde 200 solo si está listo para servir tráfico.
- VERIFICA dependencias externas (BD, cola, IdP) con timeout corto.
- 503 si alguna dep no responde.

```http
GET /health/ready → 200 OK
{"status": "ready", "checks": {"db": "ok", "redis": "ok"}}
```

## Smoke test funcional (opcional pero recomendado)

Antes de promover, ejecutar 1-3 requests representativos del happy path:

```bash
# Ejemplo: app de facturación
curl -X POST https://preview.app.naturgy.com/api/auth/login \
     -d '{"user":"smoke@test","password":"$SMOKE_PWD"}'
# → 200 OK + token

curl https://preview.app.naturgy.com/api/facturas?limit=1 \
     -H "Authorization: Bearer $TOKEN"
# → 200 OK + array
```

Las credenciales del smoke test viven en el secret manager bajo `SMOKE_*`, NO en código.

## Ventana de escape (5 segundos)

Justo antes de promover a producción, `@deploy` muestra:

```
✓ Preview desplegado: https://preview-{sha}.app.naturgy.com
✓ /health → 200
✓ /health/ready → 200
✓ Smoke test 1/3 → OK
✓ Smoke test 2/3 → OK
✓ Smoke test 3/3 → OK
✓ Rollback armado: cd app && az webapp deployment slot swap -g rg --slot staging --target-slot production
✓ Diff vs producción: +127 -42 líneas (24 archivos)

Promoción a producción en 5 segundos...
[5] [4] [3] [2] [1] [GO]

Escribe "wait" para abortar.
```

Durante esos 5 segundos, si el usuario escribe `wait|para|cancela|stop|abort`, `@deploy` aborta. El preview queda armado pero no se promueve.

Si transcurren los 5 segundos sin input, procede.

**Modo estricto:** Si el usuario lo prefiere, `@deploy` puede pedir confirmación explícita (`yes`/`go`) en vez de ventana de escape. Configurable.

## Reglas de promoción

- **NUNCA promover si /health o /health/ready devuelven no-2xx.**
- **NUNCA promover si smoke test falla.**
- **NUNCA promover si el usuario ya pidió wait.**
- **SIEMPRE registrar en `DEPLOY-LOG-{fecha}.md`** cada check con timestamp y resultado.

## Tras la promoción

Una vez promovido a producción:
```
✓ Promoción completada a https://app.naturgy.com
Esperando 30s para verificar estabilidad...
✓ /health → 200 (después de switch)
✓ p95 latencia: 142ms (baseline 138ms) — dentro de tolerancia
✓ Error rate: 0.02% (baseline 0.01%) — dentro de tolerancia

Deploy estable.
Si algo falla en próximos 10 min, comando de rollback:
  az webapp deployment slot swap -g rg --slot production --target-slot staging
```

## Si el health check falla post-promoción

`@deploy` ejecuta rollback automático sin esperar confirmación:
1. Detecta que `/health/ready` empieza a fallar.
2. Comando rollback (preparado en R10).
3. Notifica al usuario y a `@incident`.
4. Genera `INCIDENT-{id}.md` automáticamente.

Esto es la única excepción a "no actúo sin confirmación": la **estabilidad ante caída ya conocida** justifica rollback automático.
