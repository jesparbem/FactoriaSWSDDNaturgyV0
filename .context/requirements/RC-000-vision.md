# Naturgy Builder · Factoría de Software con Auto-mejora

**Versión:** 1.0 | **Fecha:** 2026-05-23  
**Equipo:** Factoría IA & Data · Naturgy  
**Estado:** 🟡 Especificación inicial

---

## 1. Visión

Una **factoría de software autónoma** que corre en local con Claude Code CLI.
Recibe un proceso de negocio, lo traduce en especificaciones, las construye
con agentes especializados, lo audita, lo despliega y **se mejora a sí misma**
con cada proyecto que completa.

```
          ┌─────────────────────────────────────────────────────────────┐
          │                                                             │
    ①     │  PROCESO DE NEGOCIO                                         │
          │  Usuario describe su idea (SDD · voz/texto · español)       │
          │  ↓                                                          │
          │  Entrevista guiada → Iteración hasta spec completa          │
          │                                                             │
    ②     │  CLAUDE CLI + CONTEXTO                                      │
          │  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
          │  │ .context/ │  │ .skills/ │  │  hooks/  │                  │
          │  │ requisitos│  │ agentes  │  │  MCP     │                  │
          │  └──────┬───┘  └──────┬───┘  └────┬─────┘                  │
          │         └──────┬──────┘────────────┘                        │
          │                ▼                                            │
          │  ┌──────────────────────────────────────────────┐           │
          │  │  11 SKILLS ESPECIALIZADOS                     │           │
          │  │  Architect · Front · Back · Cyber · UX · QA  │           │
          │  │  DevOps · Data · Deploy · Orchestrator        │           │
          │  │  + Self-Improve (meta-agente)                 │           │
          │  └──────────────────────────────────────────────┘           │
          │                ▼                                            │
    ③     │  DOS CAMINOS DE SALIDA                                      │
          │                                                             │
          │  A) Prototipo Rápido          B) Desarrollo Completo        │
          │     Mini contexts                Spec full → Build           │
          │     Local / Sandbox              → Audit → Deploy            │
          │     App Beta                     → GitHub → Producción       │
          │                                                             │
    ♻️     │  AUTO-MEJORA                                                │
          │  Cada proyecto cierra con retrospectiva que actualiza        │
          │  los SKILLS, templates y contextos para el siguiente        │
          │                                                             │
          └─────────────────────────────────────────────────────────────┘
```

---

## 2. Fuentes de Inspiración Integradas

### agency-agents (msitarzewski · 98k ⭐ · MIT)
- 144 agentes en 12 divisiones.
- Formato: un `.md` por agente con identidad, misión, reglas, entregables y métricas.
- Integración directa con Claude Code via `~/.claude/agents/`.
- **Lo que tomamos:** El patrón de SKILL.md por agente, el concepto de divisiones
  especializadas, y el Agents Orchestrator para coordinación multi-agente.

### Trifecta Perfecta (Hainrixz via tododeia.com · MIT)
- 3 herramientas encadenadas: The Architect → Cyber Neo → All Deploy.
- **The Architect:** Meta-agente con CLAUDE.md propio. Entrevista en 4 fases
  (Discovery → Deep Dive → Architecture → Generate) → BLUEPRINT.md de 16 secciones.
- **Cyber Neo:** 5 subagentes en paralelo para auditoría de seguridad.
- **All Deploy:** Detección de stack → hosting → preview → producción con rollback.
- **Lo que tomamos:** El flujo de 3 fases (diseña → blinda → publica), el patrón
  de meta-agente con CLAUDE.md propio, y los 5 subagentes paralelos de seguridad.

### Diagrama del usuario (Naturgy Builder)
- Flujo en 3 fases: ① Proceso Negocio → ② Claude CLI con contexto → ③ Salida.
- SKILLS de agentes: Front, Back, Arquitectura, Cyber, UX, DevOps.
- Conexiones: MCP, Hooks, SDD/OpenSpec.
- Dos caminos: Prototipo Rápido (sandbox/local) o Desarrollo Completo (GitHub/producción).
- Subida a GitHub como paso de publicación.

---

## 3. Las 3 Fases del Builder

### FASE 1 · Proceso de Negocio → Especificaciones

**Inspirado en:** The Architect (4 fases) + nuestro PROCESO-iteracion.md

El usuario describe su idea en español natural (SDD — Speech-Driven Development).
El ArchitectAgent lo entrevista en 4 fases y genera un BLUEPRINT.md:

```
① DISCOVERY    — ¿Qué quieres construir? ¿Para quién? ¿Qué problema resuelve?
② DEEP DIVE    — Funcionalidades clave, integraciones, restricciones
③ ARCHITECTURE — Stack, BD, rutas, componentes, seguridad
④ GENERATE     — BLUEPRINT.md con 16 secciones listo para construir
```

**Atajo rápido:** Si el usuario tiene prisa, dice "Constrúyelo ya" y el agente
genera el blueprint con valores razonables sin entrevista completa.

**Iteración:** El usuario puede refinar el blueprint con prompts adicionales.
Cada iteración queda registrada en `.context/iterations/`.

### FASE 2 · Construcción con Agentes Especializados

**Inspirado en:** agency-agents (divisiones) + nuestros SKILLS

Claude CLI lee el BLUEPRINT.md y el Orchestrator distribuye el trabajo:

```
Orchestrator → detecta tipo de tarea → activa SKILLS relevantes
    ├── ArchitectAgent   → valida y refina la arquitectura
    ├── FrontendAgent    → React/Next.js/Vue, componentes, UI
    ├── BackendAgent     → APIs, BD, auth, integración
    ├── UXAgent          → diseño, accesibilidad, brand Naturgy
    ├── DataAgent        → análisis, transformaciones, Excel
    └── [agentes paralelos si no hay dependencias]
```

**Código generado** se guarda en la carpeta del proyecto (sandbox o local).

### FASE 3 · Auditoría + Deploy + Auto-mejora

**Inspirado en:** Cyber Neo (5 subagentes) + All Deploy (6 fases)

```
QAAgent       → revisa código generado, genera tests
CyberAgent    → 5 auditorías paralelas (secretos, deps, infra, supply chain, config)
DevOpsAgent   → CI/CD, Docker, GitHub Actions
DeployAgent   → detecta stack → elige hosting → preview → producción
SelfImprove   → retrospectiva → actualiza SKILLS y templates
```

---

## 4. Los 17 SKILLS del Constructor

| # | Skill | Agente | Dominio |
|---|-------|--------|---------|
| 01 | architect | ArchitectAgent | Diseño, blueprint, ADRs, entrevista de specs |
| 02 | frontend | FrontendAgent | React, Next.js, UI, componentes, CSS |
| 03 | backend | BackendAgent | APIs, BD, auth, spawn CLI, streaming |
| 04 | cybersecurity | CyberAgent | STRIDE, 5 subagentes paralelos, compliance |
| 05 | ux | UXAgent | Diseño UI, brand Naturgy |
| 06 | qa | QAAgent | Tests, criterios aceptación |
| 07 | devops | DevOpsAgent | CI/CD, Docker, GitHub Actions, infra |
| 08 | data | DataAgent | Excel, CSV, análisis, gráficas |
| 09 | deploy | DeployAgent | Detección stack, hosting, preview, producción |
| 10 | orchestrator | OrchestratorAgent | Coordina multi-agente, detecta SKILL adecuado |
| 11 | self-improve | SelfImproveAgent | Retrospectiva, actualiza SKILLS y templates |
| 12 | legal-compliance | LegalComplianceAgent | GDPR/CNMC/ENS/ISO 27001, marco regulatorio |
| 13 | code-reviewer | CodeReviewerAgent | Smells, complejidad, deuda técnica |
| 14 | a11y-auditor | A11yAuditorAgent | WCAG 2.2 AA, Ley 11/2023 |
| 15 | incident-response | IncidentResponseAgent | SEV, rollback, post-mortem blameless |
| 16 | reality-checker | RealityCheckerAgent | Anti-alucinación: prueba antes de "hecho" |
| 17 | performance | PerformanceAgent | Core Web Vitals, p95 latencia, presupuestos |

**Nuevos en v1.1** (12–17): incorporados desde agency-agents para cubrir compliance regulatorio Naturgy (12), revisión técnica granular (13), accesibilidad legal (14), operación productiva (15), anti-alucinación LLM (16) y rendimiento medible (17).

---

## 5. Requisitos Clave del Constructor

### RC-01 · Ejecución Local con Claude Code CLI
- Claude Code corre en la máquina del usuario o servidor Naturgy.
- Sin datos en la nube salvo deploy explícito a producción.
- HOME aislado por usuario y por proyecto.

### RC-02 · SKILLS como Ficheros MD Editables
- Cada agente tiene un `SKILL.md` en `.skills/[dominio]/`.
- Claude Code los lee como contexto al iniciar cada tarea.
- Editable sin código — se versiona con git.

### RC-03 · Requisitos en Carpeta de Contexto
- `.context/requirements/` con ficheros MD.
- Proceso de refinamiento iterativo en 7 pasos.
- El CLI los lee en cada sesión para mantener coherencia.

### RC-04 · Dos Caminos de Salida (del diagrama)
- **Prototipo Rápido:** Mini contexto → local/sandbox → app beta.
- **Desarrollo Completo:** Spec full → build → audit → deploy → GitHub.

### RC-05 · Hooks y MCP
- Hooks para eventos del pipeline (pre-build, post-audit, pre-deploy).
- MCP (Model Context Protocol) para conectar herramientas externas.

### RC-06 · Auto-mejora (Self-Improving Factory)
- Al cerrar cada proyecto, SelfImproveAgent:
  1. Analiza qué SKILLS funcionaron bien/mal.
  2. Propone mejoras concretas a los SKILL.md.
  3. Registra las lecciones en `.context/iterations/`.
  4. Actualiza las templates para el siguiente proyecto.
- La factoría mejora con cada uso sin intervención humana.

### RC-07 · Flujo Trifecta Integrado
- Diseñar (ArchitectAgent) → Construir (Front/Back/Data) →
  Blindar (CyberAgent) → Testear (QAAgent) → Publicar (DeployAgent).
- Cada fase alimenta a la siguiente con artefactos concretos.

### RC-08 · Base Reutilizable para Nuevos Casos
- La estructura de carpetas, SKILLS y proceso sirve como plantilla
  base para cualquier nuevo proyecto/caso de uso que llegue.
- `naturgy-builder` es el repo semilla — se clona y se adapta.

---

## 6. Stack Técnico

```
CLI:          Claude Code (última versión estable)
Ejecución:    Local en máquina usuario o servidor corporativo
Contexto:     .context/ (requisitos MD) + .skills/ (agentes MD)
Integración:  Hooks (eventos) + MCP (herramientas externas)
Code Gen:     Next.js / React / FastAPI / Python (según blueprint)
Audit:        5 subagentes (secretos, deps, infra, supply chain, config)
Deploy:       Vercel / Railway / Docker+SSH / Azure (según stack)
VCS:          Git + GitHub (subida automática o manual)
Auto-mejora:  SelfImproveAgent + retrospectivas automáticas
```

---

## 7. Estructura del Repo

```
naturgy-builder/
├── README.md                          ← Resumen + 17 SKILLs + 5 playbooks
├── CLAUDE.md                          ← Punto de entrada del CLI
├── .context/
│   ├── requirements/
│   │   ├── RC-000-vision.md           ← Este documento
│   │   └── PROCESO-iteracion.md       ← Ciclo de refinamiento
│   ├── decisions/                     ← ADRs
│   └── iterations/                    ← Logs de sesiones
├── .skills/
│   ├── 01-architect/SKILL.md
│   ├── 02-frontend/SKILL.md
│   ├── 03-backend/SKILL.md
│   ├── 04-cybersecurity/
│   │   ├── SKILL.md
│   │   └── references/                ← Nuevo v1.2 (Cyber Neo)
│   │       ├── owasp-top-10.md
│   │       ├── cwe-top-25.md
│   │       ├── secrets-patterns.md
│   │       ├── cvss-rubric.json
│   │       ├── report-template.md
│   │       └── scope-tiering.md
│   ├── 05-ux/SKILL.md
│   ├── 06-qa/SKILL.md
│   ├── 07-devops/SKILL.md
│   ├── 08-data/SKILL.md
│   ├── 09-deploy/
│   │   ├── SKILL.md
│   │   └── references/                ← Nuevo v1.2 (All Deploy)
│   │       ├── hard-rules.md
│   │       ├── stack-to-hosting.md
│   │       ├── preview-health-check.md
│   │       └── targets/{6 hostings}.md
│   ├── 10-orchestrator/SKILL.md
│   ├── 11-self-improve/SKILL.md
│   ├── 12-legal-compliance/SKILL.md   ← v1.1
│   ├── 13-code-reviewer/SKILL.md      ← v1.1
│   ├── 14-a11y-auditor/SKILL.md       ← v1.1
│   ├── 15-incident-response/SKILL.md  ← v1.1
│   ├── 16-reality-checker/SKILL.md    ← v1.1
│   ├── 17-performance/SKILL.md        ← v1.1
│   └── _base/                         ← Reglas comunes a todos
│       ├── RULES.md
│       └── SKILL-TEMPLATE.md          ← Plantilla 7-bloques
├── knowledge/                         ← Nuevo v1.2: base de conocimiento
│   ├── archetypes/                    ← 6 arquetipos Naturgy
│   │   ├── app-interna-corporativa.md
│   │   ├── dashboard-bi.md
│   │   ├── integracion-sap.md
│   │   ├── portal-cliente.md
│   │   ├── automatizacion-etl.md
│   │   └── app-movil-corporativa.md
│   ├── building-blocks/               ← 8 patrones transversales
│   │   ├── auth-patterns.md
│   │   ├── database-patterns.md
│   │   ├── deployment-patterns.md
│   │   ├── api-design-patterns.md
│   │   ├── frontend-stacks.md
│   │   ├── testing-patterns.md
│   │   ├── styling-systems.md
│   │   └── state-management.md
│   ├── stack-compatibility.md         ← Matriz tech stack
│   └── skills-registry.md             ← Sección BLUEPRINT → SKILL
├── templates/                         ← Nuevo v1.2: plantillas canónicas
│   ├── BLUEPRINT-TEMPLATE.md          ← 16 secciones incl. Build Order
│   ├── RETROSPECTIVE-TEMPLATE.md
│   └── PROJECT-CLAUDE-TEMPLATE.md     ← Cascada de instancias
├── playbooks/                         ← v1.1: recetas multi-agente
│   ├── prototipo-rapido.md
│   ├── feature-empresarial.md
│   ├── auditoria-360.md
│   ├── migracion-legacy.md
│   └── incidente-produccion.md
├── hooks/                             ← Pendiente
├── mcp/                               ← Pendiente
└── docs/
    └── QUICKSTART.md                  ← Guía de arranque rápido
```
