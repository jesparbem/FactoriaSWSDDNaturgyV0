# Playbook · Incidente en Producción
**Caso de uso:** Caída total o degradación grave en producción de una app de la Factoría.
**Duración objetivo:** Minutos hasta estabilizar; 24-72h hasta post-mortem.
**Salida:** Servicio restaurado + post-mortem blameless + acciones preventivas.

## Trigger
- Alerta de monitorización (auto).
- Usuario dice "está caído", "no responde", "rollback", "incidente", "SEV-1/2".
- `@deploy` reporta rollback fallido.

## DAG de agentes

### Fase 1 · Estabilización (minutos)
```
@incident (declara severidad, abre timeline)
   ↓
¿Rollback resuelve?
   ├─ Sí → @devops (rollback) → @reality (confirma estabilidad) → cierre fase 1
   └─ No → @code-reviewer (hotfix mínimo)
            ↓
            @reality (valida fix en preview)
            ↓
            @devops (deploy hotfix)
            ↓
            @perf (latencia/throughput vuelve a baseline)
```

### Fase 2 · Post-mortem (24-72h después)
```
@incident (reconstruye timeline desde logs)
   ↓
@cyber (si la causa raíz fue de seguridad)
   ↓
@incident (escribe POSTMORTEM-{id}.md blameless)
   ↓
@self-improve (extrae lecciones, propone acciones preventivas)
   ↓
Usuario aprueba acciones preventivas (con owners + deadlines)
```

## SKILLs invocados
| SKILL | Rol en el incidente |
|---|---|
| `@incident` | Comandante, abre/cierra incidente, escribe post-mortem |
| `@devops` | Ejecuta rollback o deploy de hotfix |
| `@code-reviewer` | Genera hotfix mínimo (si rollback no resuelve) |
| `@reality` | Valida fix antes de aplicar a producción |
| `@perf` | Confirma que la estabilización es real (no parcial) |
| `@cyber` | Si la causa fue ataque o vulnerabilidad explotada |
| `@self-improve` | Lecciones, actualiza runbook, propone acciones preventivas |

## Reglas de oro durante el incidente
1. **Estabilizar > investigar.** Rollback primero si es posible.
2. **Comunicación cada 15 minutos** mientras dure SEV-1/SEV-2.
3. **Una decisión, un responsable.** No micro-debate durante la caída.
4. **`@reality` valida cada fix antes de prod**, incluso bajo presión.
5. **Sin culpables** — el sistema permitió el incidente, no una persona.

## Artefactos esperados
- `INCIDENT-{id}-{fecha}.md` — timeline en vivo.
- `POSTMORTEM-{id}.md` — análisis blameless con causa raíz + acciones.
- `RUNBOOK-{tipo-incidente}.md` actualizado en `.context/runbooks/`.
- `RETRO-INCIDENTE-{id}.md` opcional en `.context/iterations/`.

## Criterio de éxito
**Fase 1 (estabilización):**
1. Servicio operativo (métricas de vuelta a baseline).
2. `@reality` confirma con monitor screenshot / output real.
3. Timeline cerrado con MTTR registrado.

**Fase 2 (post-mortem):**
1. Causa raíz identificada (técnica + organizativa).
2. Acciones preventivas con owner + deadline.
3. Runbook actualizado si el patrón puede repetirse.
4. Lenguaje blameless (auto-validado por `@incident`).

## Cuándo NO usar este playbook
- Si es un bug detectado en pre-producción → flujo normal de `@qa` + `@review`.
- Si es degradación cosmética sin afectar negocio → ticket de backlog, no incidente.
