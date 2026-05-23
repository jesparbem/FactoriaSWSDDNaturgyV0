# Playbook · Feature Empresarial
**Caso de uso:** Funcionalidad productiva en sistema crítico Naturgy.
**Duración objetivo:** Días o semanas, según scope.
**Salida:** Feature desplegada con auditoría completa, accesible y monitorizada.

## Trigger
Usuario describe una funcionalidad para uso real (interno o externo) que toca datos, integra con sistemas existentes, o necesita estar en producción.

## DAG de agentes

```
@architect (4 fases completas: Discovery → Deep Dive → Architecture → Generate)
   ↓
@ux (diseño + brand Naturgy)
   ↓
@frontend ╲
@backend  ├─ (paralelo)
@data     ╱
   ↓
@review (revisión técnica)
   ↓
@qa + @reality (paralelo: tests + evidencias)
   ↓
@a11y ╲
@perf  ├─ (paralelo: blocking gates)
@cyber │
@legal ╱
   ↓
@devops (CI/CD + observabilidad)
   ↓
@deploy (con rollback automático)
   ↓
@self-improve (retrospectiva)
```

## SKILLs invocados (todos)
| SKILL | Rol | Bloqueante para deploy |
|---|---|---|
| `@architect` | BLUEPRINT completo (16 secciones) | sí |
| `@ux` | Mockups, brand Naturgy, accesibilidad de diseño | no |
| `@frontend` | UI productiva con tests | sí |
| `@backend` | APIs, BD, auth, integraciones | sí |
| `@data` | Si hay ETL, dashboards o análisis | si aplica |
| `@review` | Revisión código, bloqueantes técnicos | sí |
| `@qa` | Tests unit + e2e, cobertura objetivo | sí |
| `@reality` | Valida cada handoff | sí |
| `@a11y` | WCAG 2.2 AA, sin violaciones nivel A | sí |
| `@perf` | Core Web Vitals + p95 API en presupuesto | sí |
| `@cyber` | 5 subagentes, sin Critical/High abiertos | sí |
| `@legal` | Compliance GDPR/CNMC/ENS sin Critical | sí |
| `@devops` | CI/CD + secretos + observabilidad | sí |
| `@deploy` | Despliegue con rollback | — |
| `@self-improve` | Retrospectiva + KPIs vs proyecto anterior | no |

## Artefactos esperados
- `BLUEPRINT.md` (16 secciones).
- `CODE-REVIEW-{fecha}.md`, `SECURITY-AUDIT-{fecha}.md`, `COMPLIANCE-AUDIT-{fecha}.md`, `A11Y-REPORT-{fecha}.md`, `PERF-REPORT-{fecha}.md`.
- Tests con cobertura ≥ objetivo del BLUEPRINT.
- CI/CD operativo, observabilidad básica (logs + métricas + alertas).
- Documentación de operación (`README-OPS.md` o runbook).
- `RETRO-{fecha}.md` al cerrar.

## Criterio de éxito (gates de despliegue a producción)
1. **`@cyber`** sin Critical/High abiertos.
2. **`@legal`** sin Critical abiertos.
3. **`@a11y`** sin violaciones nivel A.
4. **`@perf`** dentro de presupuestos definidos en BLUEPRINT.
5. **`@qa`** cobertura ≥ objetivo + tests verdes en CI.
6. **`@reality`** PASS en todos los handoffs.
7. Rollback probado en staging.

## Cuándo NO usar este playbook
- Si es un PoC para validar idea → usa `prototipo-rapido`.
- Si es respuesta a incidente urgente → usa `incidente-produccion`.
