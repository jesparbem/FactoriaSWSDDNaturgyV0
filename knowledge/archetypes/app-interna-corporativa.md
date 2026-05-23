# Arquetipo · App Interna Corporativa
**Cuándo aplica:** Herramienta de uso interno Naturgy (empleados, equipos operativos, back-office).

## Características típicas
- Audiencia: 50–5.000 usuarios internos.
- Auth federada con Azure AD / Entra ID (no auth propia).
- Datos sensibles internos, no clientes finales.
- Despliegue en infra Naturgy (Azure App Service, AKS) o, excepcionalmente, sandbox.
- Ciclo de release: mensual o quincenal.

## Stack por defecto
| Capa | Tecnología recomendada | Alternativa |
|---|---|---|
| Frontend | Next.js (App Router) + TypeScript | Remix |
| UI | Tailwind + componentes Naturgy | Radix UI |
| Backend | .NET 8 (Web API) o FastAPI | Express si el equipo es JS-first |
| BD | SQL Server (corporativo) | PostgreSQL |
| Auth | Azure AD vía MSAL / OIDC | — |
| Hosting | Azure App Service | Azure Container Apps |
| Observabilidad | Application Insights | — |

## 5 decisiones típicas que `@architect` debe forzar
1. **¿SQL Server o PostgreSQL?** Por defecto SQL Server (alineado con corporativo); PG solo si hay justificación técnica.
2. **¿SSR o SPA?** SSR (Next.js App Router) por defecto, salvo app puramente dashboard.
3. **¿Roles vs grupos AD?** Grupos AD existentes > roles propios.
4. **¿Multi-tenant interno?** Casi siempre no; un único tenant Naturgy.
5. **¿Auditoría de acciones?** Sí, log estructurado de cambios críticos (delete, approve…).

## Riesgos Naturgy específicos
- **Datos de empleados** → tratamiento conforme RGPD interno + ENS.
- **Integraciones con SAP/SuccessFactors/AD** → no replicar datos maestros; consumir vía API.
- **Sesiones largas** → política corporativa: idle timeout 30 min, hard logout 8h.

## Ejemplos de proyectos de esta tipología
- Portal de aprobaciones de compras.
- Gestor de cambios de turno operativo.
- Workflow de validación de facturas.

## Playbook recomendado
`playbooks/feature-empresarial.md` con gates de `@legal` y `@cyber` obligatorios.
