# Factoría SDD · Webapp

Interfaz web de la plataforma agéntica Naturgy. Built with **Next.js 14 (App Router) + TypeScript + Tailwind CSS**.

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
| `/procesos` | **Procesos de Negocio** — 3 vías de extracción de specs (extracción / vibe coding / proceso detallado), OpenSpec YAML, dictado por voz |
| `/builder` | **Builder · Enjambre** — diagrama ADAI→GitHub→AKS→AI Foundry · pods en vivo · stream JSON · guardarrailes |
| `/modulos` | **Módulos** — catálogo filtrable por fase SDLC con PO, Domain Owner, agentes activos y coste |
| `/agentes` | **Agentes IA** — los 17 SKILLs con KPIs, sub-agentes, coste por llamada y duración media |
| `/prototyping` | **Rapid Prototyping (Vibe Coding)** — generación rápida de prototipos + flujo de promoción a módulo productivo |
| `/costes` | **Costes** — timeline 7 días, por agente, por módulo, cuotas Azure AI Foundry por equipo |
| `/mejora` | **Auto-mejora** — sugerencias de mejora detectadas por @self-improve con feedback y votación |

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
