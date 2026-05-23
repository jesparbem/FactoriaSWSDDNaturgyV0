# Factoría SDD · Naturgy Builder

**Versión:** v1.2 · **Estado:** especificación con knowledge base

Sistema multi-agente que transforma ideas de negocio en aplicaciones funcionales, ejecutado localmente con Claude Code CLI. Diseña, construye, audita, despliega y se mejora a sí mismo con cada proyecto.

## Estructura

```
Factoria SDD/
├── CLAUDE.md                    Punto de entrada (lo lee Claude al arrancar)
├── .context/requirements/       Visión, requisitos, proceso de iteración
├── .skills/                     17 SKILLs especializados + base común
│   ├── 04-cybersecurity/references/   OWASP + CWE + secrets + CVSS + tiering
│   └── 09-deploy/references/          Hard rules + targets de hosting
├── knowledge/                   Base de conocimiento reutilizable (v1.2)
│   ├── archetypes/                    6 arquetipos Naturgy
│   ├── building-blocks/               8 patrones transversales
│   ├── stack-compatibility.md
│   └── skills-registry.md
├── templates/                   Plantillas canónicas (v1.2)
│   ├── BLUEPRINT-TEMPLATE.md          16 secciones incl. Build Order
│   ├── RETROSPECTIVE-TEMPLATE.md
│   └── PROJECT-CLAUDE-TEMPLATE.md     Para cascada de instancias
├── playbooks/                   5 recetas multi-agente reutilizables
└── docs/                        QUICKSTART y documentación
```

## Arranque rápido

```bash
cd "Factoria SDD"
claude
```

Claude lee `CLAUDE.md` automáticamente y carga toda la Factoría. Describe tu idea en español y la Factoría detecta qué agentes activar.

## Los 17 SKILLs

| # | Comando | Dominio |
|---|---|---|
| 01 | `@architect` | Diseño, blueprint, ADRs |
| 02 | `@frontend` | React, Next.js, UI |
| 03 | `@backend` | APIs, BD, auth, integraciones |
| 04 | `@cyber` | Auditoría seguridad (5 subagentes paralelos) |
| 05 | `@ux` | Diseño UI, brand Naturgy |
| 06 | `@qa` | Tests unit + integración + e2e |
| 07 | `@devops` | CI/CD, Docker, observabilidad |
| 08 | `@data` | ETL, dashboards, Excel |
| 09 | `@deploy` | Hosting, preview, producción con rollback |
| 10 | `@orchestrator` | Coordina multi-agente |
| 11 | `@self-improve` | Retrospectiva, mejora continua |
| 12 | `@legal` | GDPR, CNMC, ENS, ISO 27001 |
| 13 | `@review` | Code review (smells, complejidad) |
| 14 | `@a11y` | WCAG 2.2 AA, Ley 11/2023 |
| 15 | `@incident` | SEV-1/2, rollback, post-mortem |
| 16 | `@reality` | Anti-alucinación: exige prueba antes de "hecho" |
| 17 | `@perf` | Core Web Vitals, p95 latencia |

## Playbooks

Recetas multi-agente en `playbooks/`:

- `prototipo-rapido.md` — PoC en < 4h
- `feature-empresarial.md` — Producción con todos los gates
- `auditoria-360.md` — Due diligence técnica
- `migracion-legacy.md` — Modernización con tests de equivalencia
- `incidente-produccion.md` — SEV-1/2 + post-mortem blameless

## Más información

- Visión completa: [`.context/requirements/RC-000-vision.md`](.context/requirements/RC-000-vision.md)
- Proceso de iteración: [`.context/requirements/PROCESO-iteracion.md`](.context/requirements/PROCESO-iteracion.md)
- Reglas comunes: [`.skills/_base/RULES.md`](.skills/_base/RULES.md)
- Guía rápida: [`docs/QUICKSTART.md`](docs/QUICKSTART.md)
