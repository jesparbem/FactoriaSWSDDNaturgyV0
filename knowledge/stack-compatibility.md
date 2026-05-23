# Stack Compatibility Matrix
**Consumido por:** `@architect`

Tabla de combinaciones probadas (✓), no recomendadas (✗) o que requieren cuidado (~).

## Frontend × Backend
| Frontend ↓ \ Backend → | .NET 8 | FastAPI | Express/NestJS | Java Spring |
|---|---|---|---|---|
| Next.js (App Router) | ✓ | ✓ | ✓ | ✓ |
| Remix | ~ | ✓ | ✓ | ~ |
| Vite + React (SPA) | ✓ | ✓ | ✓ | ✓ |
| Vue (Nuxt) | ~ | ✓ | ✓ | ~ |

## Backend × Base de datos
| Backend ↓ \ BD → | SQL Server | PostgreSQL | Cosmos DB | Oracle (legacy) |
|---|---|---|---|---|
| .NET 8 (EF Core) | ✓ default | ✓ | ✓ | ✓ |
| FastAPI (SQLAlchemy/SQLModel) | ✓ | ✓ default | ~ | ✓ |
| Express/NestJS (Prisma) | ~ | ✓ default | ✗ Prisma no soporta bien | ✗ |
| Express/NestJS (Drizzle) | ~ | ✓ | ✗ | ✗ |
| Java Spring (JPA) | ✓ | ✓ | ~ | ✓ |

## Auth × Hosting
| Auth ↓ \ Hosting → | App Service | Container Apps | AKS | Vercel |
|---|---|---|---|---|
| Azure AD (MSAL) | ✓ | ✓ | ✓ | ~ (requiere config) |
| Azure AD B2C | ✓ | ✓ | ✓ | ✓ |
| Auth0 / Okta | ✓ | ✓ | ✓ | ✓ |
| NextAuth.js | ✓ | ✓ | ✓ | ✓ |
| Auth propio | ✗ Naturgy: prohibido sin aprobación | ✗ | ✗ | ✗ |

## Frontend × Estilos
| Frontend ↓ \ Estilos → | Tailwind | CSS Modules | styled-components |
|---|---|---|---|
| Next.js App Router | ✓ default | ✓ | ~ (RSC con problemas) |
| Remix | ✓ | ✓ | ~ |
| Vite + React | ✓ | ✓ | ✓ |

## ORM × BD
| ORM ↓ \ BD → | SQL Server | PostgreSQL | Cosmos | MongoDB |
|---|---|---|---|---|
| EF Core | ✓ | ✓ | ✓ | ✗ |
| Prisma | ~ (preview) | ✓ default | ✗ | ✓ |
| Drizzle | ~ | ✓ default | ✗ | ✗ |
| SQLAlchemy | ✓ | ✓ | ~ | ✗ |
| TypeORM | ✓ | ✓ | ✗ | ✓ |

## Reglas para resolver conflictos
1. Si una combinación es ✗, `@architect` debe proponer alternativa antes de cerrar BLUEPRINT.
2. Si es ~, documentar en ADR la razón de la elección y los riesgos.
3. Si todos los caminos llevan a ~, escalar al usuario.

## Lo que NO compatibilizamos en Naturgy
- Stacks sin LTS o sin comunidad activa (frameworks de < 1 año en producción).
- Tecnologías sin licencia clara o con licencias incompatibles con uso comercial.
- Bases de datos sin plan de backup gestionado.
- Hostings sin SLA empresarial para entornos productivos.
