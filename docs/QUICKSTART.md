# Quickstart · Naturgy Builder · Factoría SDD

## 1. Arranque
```bash
cd "Factoria SDD"
claude
```
Claude lee `CLAUDE.md` automáticamente y carga la Factoría completa (17 SKILLs + 5 playbooks).

## 2. Describe tu intent
La Factoría detecta qué hacer según cómo lo pidas:

| Lo que dices | Lo que dispara |
|---|---|
| "Quiero construir una app que…" | `@architect` → entrevista 4 fases → `BLUEPRINT.md` |
| "Constrúyelo ya" | `@architect` modo express + playbook `prototipo-rapido` |
| "Audita este proyecto" | playbook `auditoria-360` (5 auditores en paralelo) |
| "Migra esta app legacy" | playbook `migracion-legacy` |
| "Está caído / SEV-1" | playbook `incidente-produccion` |
| "Llévalo a producción" | playbook `feature-empresarial` (todos los gates) |

## 3. Los 17 SKILLs en una línea

**Construcción:** `@architect` `@frontend` `@backend` `@data` `@ux`
**Calidad:** `@qa` `@review` `@reality` `@perf`
**Auditoría:** `@cyber` `@legal` `@a11y`
**Operación:** `@devops` `@deploy` `@incident`
**Coordinación:** `@orchestrator` `@self-improve`

## 4. Playbooks (recetas listas)
- [prototipo-rapido](../playbooks/prototipo-rapido.md) — PoC < 4h
- [feature-empresarial](../playbooks/feature-empresarial.md) — Producción con todos los gates
- [auditoria-360](../playbooks/auditoria-360.md) — Due diligence técnica
- [migracion-legacy](../playbooks/migracion-legacy.md) — Modernización con tests de equivalencia
- [incidente-produccion](../playbooks/incidente-produccion.md) — SEV-1/2 + post-mortem

## 5. Principios operativos
- **Reality Check obligatorio** — ningún SKILL marca tarea como "hecha" sin prueba (output, diff, test, screenshot).
- **Auto-mejora cíclica** — al cerrar proyecto, `@self-improve` analiza KPIs y propone diffs a los SKILLs.
- **Local-first** — todo corre en máquina del usuario; cero datos a nube salvo deploy explícito.
- **Blameless** — los post-mortems hablan del sistema, no de personas.

## 6. Estructura del repo
```
Factoria SDD/
├── CLAUDE.md                    ← Punto de entrada (lo lee Claude al arrancar)
├── .context/
│   └── requirements/            ← RC-000-vision, PROCESO-iteracion
├── .skills/                     ← 17 SKILLs + _base/{RULES,TEMPLATE}
├── playbooks/                   ← 5 recetas multi-agente
├── docs/                        ← este QUICKSTART y otros
└── old Delete/                  ← Snapshots antiguos (revisable, eliminable)
```

## 7. Documentación de referencia
- Visión: [`.context/requirements/RC-000-vision.md`](../.context/requirements/RC-000-vision.md)
- Proceso de iteración: [`.context/requirements/PROCESO-iteracion.md`](../.context/requirements/PROCESO-iteracion.md)
- Reglas comunes: [`.skills/_base/RULES.md`](../.skills/_base/RULES.md)
- Plantilla de SKILL: [`.skills/_base/SKILL-TEMPLATE.md`](../.skills/_base/SKILL-TEMPLATE.md)
