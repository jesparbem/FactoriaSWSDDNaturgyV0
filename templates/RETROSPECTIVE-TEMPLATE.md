# Retrospectiva · {NOMBRE_PROYECTO}
**Fecha:** {FECHA} | **Duración total:** {DURACION} | **Versión Factoría:** v{VERSION_SKILLS}

> Generada por `@self-improve` al cierre del proyecto. Lenguaje blameless: el sistema permite que pasen cosas, no las personas.

---

## 1. Resumen ejecutivo (3 bullets)
- {Qué se construyó}
- {Cómo de bien fue, en una frase}
- {La lección principal}

## 2. Métricas del proyecto

| KPI | Objetivo | Real | Δ vs proyecto anterior |
|---|---|---|---|
| Duración total (h) | | | |
| Iteraciones del BLUEPRINT | | | |
| Defectos detectados antes de deploy | | | |
| Critical/High `@cyber` | | | |
| Critical `@legal` | | | |
| Violaciones nivel A `@a11y` | | | |
| Regresiones `@perf` | | | |
| Tareas devueltas por `@reality` | | | |
| Rollbacks ejecutados | | | |
| MTTR si hubo incidente | | | |
| Cobertura de tests final | | | |

## 3. Por SKILL

Para cada SKILL invocado en el proyecto, una tabla con sus KPIs declarados.

### `@architect`
| KPI | Valor | Comparativa |
|---|---|---|
| `kpi_secciones_completas` | / 16 | |
| `kpi_iteraciones_blueprint` | | |
| `kpi_modo_express` | sí/no | |

### `@backend` / `@frontend` / `@cyber` / ...
(Misma estructura por cada SKILL que intervino.)

## 4. Lo que funcionó
Lista concreta de cosas que merecen mantenerse en el siguiente proyecto.

## 5. Lo que falló
Lista concreta. Sin "se le olvidó a X". Sí "el sistema permitió que…".

## 6. Patrones repetidos
¿Hubo algún tipo de problema que se repitió? (Misma alucinación devuelta varias veces, mismo hallazgo `@cyber`, mismo defecto de UI…).

## 7. Diffs propuestos a SKILLs
Por cada SKILL con propuesta de cambio:

### `.skills/{N}-{nombre}/SKILL.md`
- **Cambio propuesto:** {qué}
- **Razón:** {por qué — incidente concreto, KPI en regresión…}
- **Impacto esperado:** {qué KPI mejora}

> Cada diff requiere aprobación explícita del usuario antes de aplicarse (regla R9 de `.skills/_base/RULES.md`).

## 8. Lecciones aplicables al siguiente proyecto
Bullets accionables, no abstractos. Ej:
- "Cuando hay integración con SAP, dedicar 30% más tiempo al sub-agente IntegrationsExpert" (no "tener cuidado con SAP").

## 9. Actualización de METRICS.md
Esta retro se añade al `METRICS.md` acumulativo de la Factoría para ver tendencias entre proyectos.

---

## Aprobaciones
- [ ] Usuario revisa retro completa.
- [ ] Usuario aprueba diffs propuestos uno a uno.
- [ ] Cambios aprobados se commitean a `.skills/`.
- [ ] `METRICS.md` actualizado.
