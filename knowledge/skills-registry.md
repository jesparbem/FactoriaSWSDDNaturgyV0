# Skills Registry · Mapeo Sección BLUEPRINT ↔ SKILL responsable
**Consumido por:** `@orchestrator` (para generar el DAG dinámicamente desde el BLUEPRINT)

## Tabla

| # | Sección del BLUEPRINT | SKILL responsable | SKILLs colaterales |
|---|---|---|---|
| 1 | Project Overview | `@architect` | — |
| 2 | Tech Stack | `@architect` | (consulta `knowledge/stack-compatibility.md`) |
| 3 | Directory Structure | `@architect` | `@frontend` + `@backend` (validan factibilidad) |
| 4 | Data Model | `@backend` | `@data` + `@legal` |
| 5 | API Design | `@backend` | `@cyber` |
| 6 | Frontend Architecture | `@frontend` | `@ux` + `@a11y` |
| 7 | Design System | `@ux` | `@frontend` + `@a11y` |
| 8 | Auth & Authorization | `@backend` | `@cyber` |
| 9 | **Build Order** | `@architect` (define) → `@orchestrator` (ejecuta) | todos |
| 10 | Environment Setup | `@devops` | `@backend` |
| 11 | Dependencies | `@backend` + `@frontend` | `@cyber` (vulns) |
| 12 | Deployment | `@deploy` | `@devops` |
| 13 | Testing | `@qa` | `@perf` |
| 14 | Skills to Use | `@orchestrator` | — |
| 15 | CLAUDE.md (destino) | `@architect` | (usa `templates/PROJECT-CLAUDE-TEMPLATE.md`) |
| 16 | Rules | `@architect` | `@cyber` + `@legal` + `@a11y` |

## Reglas de uso por el `@orchestrator`

1. Al recibir un BLUEPRINT validado, recorre las 16 secciones y activa el **SKILL responsable** de cada una.
2. Los **SKILLs colaterales** se invocan tras el responsable, en paralelo si no hay dependencias.
3. Cada sección queda con un estado: `pending` / `in-progress` / `done` / `blocked`.
4. Si `@reality` rechaza el output de una sección → vuelve al responsable, no avanza.
5. Sección 9 (Build Order) es **el plan de batalla** — su orden es el que el orchestrator respeta para construir.

## SKILLs transversales (no aparecen en secciones)
- `@reality` — invocado automáticamente entre handoffs.
- `@self-improve` — invocado al cierre del proyecto.
- `@incident` — invocado solo cuando hay incidente productivo.

## Ejemplo de invocación
```
BLUEPRINT.md sección 5 "API Design" →
  @orchestrator activa @backend.APIDesigner →
  @backend genera endpoints + DTOs + tests →
  @reality valida con `curl` real →
  PASS → @cyber audita endpoints →
  done.
```
