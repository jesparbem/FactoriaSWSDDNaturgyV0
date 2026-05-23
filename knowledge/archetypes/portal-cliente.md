# Arquetipo · Portal de Cliente
**Cuándo aplica:** App pública o semipública para clientes Naturgy (residencial, B2B, partners).

## Características típicas
- Audiencia: miles a millones de usuarios externos.
- Auth: usuario/contraseña + 2FA + idealmente federación social/bancaria.
- Datos personales = tratamiento RGPD estricto.
- Multi-idioma (mínimo ES/EN/PT/IT según mercado).
- WCAG 2.2 AA mandatorio (Ley 11/2023).
- SEO si es público.

## Stack por defecto
| Capa | Tecnología recomendada | Alternativa |
|---|---|---|
| Frontend | Next.js (App Router, SSR) + TypeScript | Remix |
| UI | Tailwind + sistema de diseño Naturgy | — |
| Backend | .NET 8 / FastAPI con BFF dedicado | — |
| BD | PostgreSQL (managed) | SQL Server si justificado |
| Auth | Identity Provider corporativo (B2C) | Auth0 si urgencia |
| Caché | Redis + CDN (Front Door / Cloudflare) | — |
| Hosting | Azure App Service + Front Door | Vercel para SSR puro |
| Observabilidad | App Insights + Real User Monitoring | — |

## 5 decisiones típicas que `@architect` debe forzar
1. **¿SSR, ISR o SPA?** SSR/ISR siempre (SEO + Core Web Vitals). SPA solo en zonas tras login muy interactivas.
2. **¿IdP propio o gestionado?** Gestionado (Azure AD B2C u homólogo); construir auth propio = NO.
3. **¿2FA obligatorio?** Sí para operaciones críticas (pago, cambio titularidad); opcional para login normal.
4. **¿Consentimiento granular?** Sí — checkboxes separados por finalidad, no genérico.
5. **¿Modo invitado?** Solo si el caso de negocio lo justifica; añade complejidad de carrito/persistencia.

## Riesgos Naturgy específicos
- **RGPD**: consulta a `@legal` obligatoria antes de cerrar modelo de datos.
- **Accesibilidad**: `@a11y` con cobertura WCAG AA (no AAA salvo segmentos críticos).
- **Reputacional**: cualquier filtración o caída visible → escala a `@incident` con SEV alta.
- **PCI-DSS si hay pagos**: scope reducido (preferir redirect a pasarela; no almacenar PAN).

## Ejemplos de proyectos de esta tipología
- Área cliente: facturas, consumos, pagos, comunicaciones.
- Captación de leads: formularios + comparador de tarifas.
- Soporte: chat + ticketing + base de conocimiento.

## Playbook recomendado
`playbooks/feature-empresarial.md` con todos los gates activos (`@cyber`, `@legal`, `@a11y`, `@perf`).
