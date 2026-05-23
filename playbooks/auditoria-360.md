# Playbook · Auditoría 360
**Caso de uso:** Auditar un proyecto heredado (no construido por la Factoría) o validar uno existente antes de cambios mayores.
**Duración objetivo:** 1-3 días según tamaño del repo.
**Salida:** Informe consolidado con hallazgos priorizados de 5 ángulos.

## Trigger
Usuario dice "audita", "revisa lo que hay", "diagnóstico", "due diligence técnica", "estado de salud del proyecto".

## DAG de agentes

```
@architect (lee repo, reconstruye BLUEPRINT inverso)
   ↓
   ├─ @cyber       ╲
   ├─ @legal        │
   ├─ @a11y         ├─ (5 auditorías 100% paralelas)
   ├─ @perf         │
   └─ @review       ╱
       ↓
@orchestrator (consolida en informe único)
   ↓
@reality (valida que cada hallazgo tiene evidencia)
   ↓
Usuario (decide siguientes pasos)
```

## SKILLs invocados
| SKILL | Output |
|---|---|
| `@architect` | `BLUEPRINT-INVERSO.md` — qué hace el sistema, stack, dependencias |
| `@cyber` | `SECURITY-AUDIT-{fecha}.md` — 5 subagentes paralelos |
| `@legal` | `COMPLIANCE-AUDIT-{fecha}.md` — GDPR/CNMC/ENS |
| `@a11y` | `A11Y-REPORT-{fecha}.md` — WCAG 2.2 AA |
| `@perf` | `PERF-REPORT-{fecha}.md` — benchmarks contra presupuestos sugeridos |
| `@review` | `CODE-REVIEW-{fecha}.md` — deuda técnica, smells, complejidad |
| `@orchestrator` | `AUDIT-360-{fecha}.md` — consolidado |
| `@reality` | Valida que cada Critical/High tenga `path:line` o PoC |

## Artefacto final consolidado
`AUDIT-360-{fecha}.md` — estructura:
- Resumen ejecutivo (1 página, semáforos por área)
- Top-10 hallazgos cross-disciplina priorizados
- Detalle por área (links a cada informe individual)
- Roadmap propuesto (Critical → 1 semana, High → 1 mes, resto → backlog)
- Estimación de esfuerzo de remediación

## Criterio de éxito
1. Cada uno de los 5 auditores ha emitido su informe.
2. `@reality` PASS en cada Critical/High (todos con evidencia).
3. Consolidado tiene roadmap accionable.
4. Usuario puede tomar decisión informada de "seguir", "remediar antes", o "reescribir".

## Cuándo NO usar este playbook
- Si solo te interesa un ángulo (ej: solo seguridad) → invoca el SKILL directamente.
- Si el proyecto es trivial (< 1000 líneas) → un `@review` suele bastar.
