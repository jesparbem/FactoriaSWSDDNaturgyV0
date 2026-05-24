# FactorIA 2.0 · Builder SW Naturgy

Interfaz web de la plataforma agéntica Naturgy. Built with **Next.js 14 (App Router) + TypeScript + Tailwind CSS**.

**Versión:** v2.0 · 18 agentes · 11 rutas + 1 API

## Arranque

```bash
cd webapp
npm install
npm run dev
```

App en `http://localhost:3030`.

## Páginas

| Ruta | Descripción |
|---|---|
| `/` | **Dashboard** — KPIs, módulos en construcción, actividad live, vista por rol |
| `/equipo` | **Equipo** — los 4 roles del modelo (Process / Domain / Product Owner + Technology Enabler) en 3 vistas: Matriz, Tarjetas e Interacciones |
| `/procesos` | **Procesos de Negocio** — 3 vías de extracción de specs (extracción / vibe coding / proceso detallado) + **canvas de aprobaciones** que trocea la spec en funcionalidades aprobables por cada rol |
| `/builder` | **Builder · Enjambre** — diagrama ADAI→GitHub→AKS→AI Foundry · pods en vivo con polling cada 3s · stream JSON · guardarrailes |
| `/modulos` | **Módulos** — catálogo filtrable por fase SDLC con PO, Domain Owner, agentes activos y coste |
| `/agentes` | **Agentes IA** — los 18 SKILLs con KPIs, sub-agentes, coste por llamada · botón **Editar SKILL** abre formulario completo de los 7 bloques con preview live |
| `/agentes/nuevo` | **Crear agente** — 2 modos: manual (SkillEditor con plantilla vacía) o asistido por `@skill-creator` (wizard conversacional de 5 preguntas con dictado por voz) |
| `/prototyping` | **Rapid Prototyping (Vibe Coding)** — generación rápida con preview navegable en móvil/tablet/desktop, mockups por arquetipo, flujo de promoción a módulo productivo |
| `/costes` | **Costes** — timeline 7 días, por agente, por módulo, cuotas Azure AI Foundry por equipo |
| `/mejora` | **Auto-mejora** — sugerencias detectadas por @self-improve con feedback, votación y aprobación humana |
| `/api/swarm` | **API dinámica** — devuelve eventos vivos del enjambre (pods, stream, summary) |

## Decisiones de diseño

- **Tokens Naturgy** (`tailwind.config.ts`): naranja `#FF671B` + azul `#0C355B`. Modo oscuro por defecto.
- **Componentes ligeros** sin shadcn como dep — solo Card, Button, Badge, Progress y Tabs propios.
- **Datos mock** en `lib/data.ts`. En producción provendrán de ADAI (PostgreSQL) + GitHub + AKS.
- **Build estático** (`output: static`): las 11 páginas se prerrenderan en build.
- **Reality-friendly**: cada componente importante tiene una pieza interactiva real (no es solo mockup visual).

## Estructura

```
webapp/
├── app/
│   ├── layout.tsx           Layout global (sidebar + topbar)
│   ├── globals.css          Tokens CSS + utilidades
│   ├── page.tsx             Dashboard
│   ├── procesos/page.tsx
│   ├── builder/page.tsx
│   ├── modulos/page.tsx
│   ├── agentes/page.tsx
│   ├── prototyping/page.tsx
│   ├── costes/page.tsx
│   └── mejora/page.tsx
├── components/
│   ├── layout/{Sidebar,Topbar}.tsx
│   └── ui/{Card,Button,Badge,Progress,Tabs}.tsx
├── lib/
│   ├── data.ts              Datos demo: 17 agentes, 7 módulos, 4 sugerencias…
│   └── utils.ts             cn, formatCurrency, formatNumber, relativeTime
├── package.json
└── tailwind.config.ts
```

## Pendiente / futuro

- Conexión real a ADAI vía API (hoy datos mock).
- Webhook desde GitHub para evento `spec.ready` que actualice el dashboard live.
- Integración con Azure AI Foundry para cuotas reales por equipo.
- Auth con Azure AD (B2B interno).
- Modo claro/oscuro persistido en localStorage.
- Dictado por voz real (Web Speech API + corrección con `@architect`).
