# Building Block · Stacks de Frontend
**Consumido por:** `@architect`, `@frontend`, `@ux`

## Matriz de decisión

| Caso | Stack recomendado | Justificación |
|---|---|---|
| App pública con SEO | Next.js (App Router) | SSR/ISR + Core Web Vitals + ecosistema |
| App pública sin SEO | Next.js o Remix | Igual de válido |
| App interna corporativa | Next.js (App Router) | Estandarización, mismo stack en todo |
| App muy interactiva (canvas, dashboards) | Vite + React (SPA) | Sin overhead SSR innecesario |
| Marketing / contenido | Next.js + Sanity / Strapi | SSG + CMS |
| Móvil | React Native + Expo | Reaprovechar conocimiento React |
| PWA | Next.js + service worker | Misma base que web |

## Por qué Next.js es el default
- App Router maduro (estable desde 14).
- SSR/ISR/SSG en un único framework.
- Streaming, server components, server actions.
- Despliegue Vercel/Azure/Docker indiferente.
- Comunidad y soporte LTS.

## Cuándo NO usar Next.js
- Hay equipo experto en Remix y prefiere su modelo de datos → OK Remix.
- App puramente interna sin SEO ni SSR útil → Vite + React es más simple.
- Stack Naturgy del equipo es Angular o Vue legacy → mantener (no migrar sin caso de negocio).

## Estructura recomendada (Next.js App Router)
```
src/
├── app/
│   ├── (public)/        ← rutas públicas
│   ├── (auth)/          ← tras login
│   ├── api/             ← route handlers
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/              ← primitives (button, input)
│   └── features/        ← composición por feature
├── lib/
│   ├── api/             ← clientes
│   └── utils/
└── styles/
```

## Reglas
- **TypeScript estricto** por defecto.
- **Server Components** salvo necesidad explícita de cliente.
- **`use client`** solo en hojas, no en raíces.
- **No CSS-in-JS** para estilos estáticos (penaliza rendimiento).
- **Imágenes** con `next/image` siempre (lazy + dimensiones).
- **Fonts** con `next/font` (no `<link>` a Google directo).

## Anti-patrones
- `useEffect` para fetch de datos (usar Server Component o `cache` de Next).
- `getServerSideProps` en App Router (pertenece a Pages Router).
- Estado global para datos del servidor (usar Server Components o React Query).
- Bundle > 300KB inicial sin code-splitting.
