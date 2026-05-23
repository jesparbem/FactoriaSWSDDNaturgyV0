# Playbook · Prototipo Rápido
**Caso de uso:** Demos internas, hackathons, PoCs, validación de idea.
**Duración objetivo:** < 4 horas desde idea hasta demo local.
**Salida:** App funcionando en sandbox/local. NO producción.

## Trigger
Usuario dice "constrúyelo ya", "PoC", "demo rápida", "prototipo", "validar idea".

## DAG de agentes

```
@architect (express, 4 fases en una pasada)
   ↓
@frontend  ╲   (paralelo, sin dependencias)
@backend   ╱
   ↓
@qa (smoke tests, no exhaustivos)
   ↓
@reality (valida que arranca y responde)
   ↓
@deploy (modo local/sandbox)
```

## SKILLs invocados
| SKILL | Modo | Tiempo objetivo |
|---|---|---|
| `@architect` | express (sin entrevista, defaults) | 10 min |
| `@frontend` | scaffolding + 3 pantallas máx | 60 min |
| `@backend` | endpoints CRUD básicos + mock auth | 60 min |
| `@qa` | smoke tests, sin coverage objetivo | 20 min |
| `@reality` | "arranca y responde" | 5 min |
| `@deploy` | localhost / docker-compose | 15 min |

## SKILLs explícitamente **omitidos**
- `@cyber` — se anota como deuda para promover a producción.
- `@legal` — idem.
- `@a11y` — idem (se hace si la demo es con stakeholders externos).
- `@perf` — irrelevante en PoC.

## Artefactos esperados
- `BLUEPRINT-EXPRESS.md` (versión reducida, 6 secciones en vez de 16).
- Repo con app funcionando en `localhost:3000` o similar.
- `DEUDA-POC.md` listando qué falta antes de poder ir a producción.

## Criterio de éxito
1. La app arranca con un comando.
2. El flujo principal funciona end-to-end (puede tener mocks).
3. `@reality` confirma con screenshot/curl que responde.
4. `DEUDA-POC.md` tiene al menos los hallazgos de seguridad/compliance pendientes.

## Cuándo NO usar este playbook
- Si va a tocar datos reales de clientes Naturgy → usa `feature-empresarial`.
- Si va a estar accesible más allá de la máquina del autor → usa `feature-empresarial`.
- Si la demo es ante regulador → usa `feature-empresarial`.
