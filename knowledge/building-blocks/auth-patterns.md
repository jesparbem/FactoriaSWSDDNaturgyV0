# Building Block · Patrones de Autenticación
**Consumido por:** `@architect`, `@backend`, `@frontend`, `@cyber`

## Matriz de decisión

| Caso | Patrón recomendado | NO usar |
|---|---|---|
| App interna Naturgy | Azure AD / Entra ID vía OIDC (MSAL) | Auth propio |
| App cliente B2C | Azure AD B2C / IdP gestionado | Auth0 SaaS sin contrato |
| API entre servicios internos | Client credentials OAuth2 | Tokens estáticos |
| Integración con SAP/SuccessFactors | OAuth2 service-to-service vía SAP BTP destinations | Usuario técnico con password |
| App móvil corporativa | MSAL + biometría como factor secundario | Solo password |
| API pública con partners | OAuth2 + mTLS opcional + rate limiting | API keys eternas |

## Patrones por flujo

**1. Authorization Code Flow + PKCE** (apps SPA / móvil)
- Estándar para cualquier app que no pueda guardar `client_secret`.
- Token en memoria, refresh token solo si necesario.

**2. Client Credentials** (server-to-server)
- Para microservicios que se hablan sin usuario.
- Rotación de secret obligatoria, almacenado en secret manager.

**3. On-Behalf-Of (OBO)** (BFF que llama APIs en nombre del usuario)
- Cuando el BFF necesita actuar contra otra API con el contexto del usuario.

## Reglas no negociables
- **2FA obligatorio** para operaciones críticas (cambio de datos personales, pagos, aprobaciones).
- **Refresh tokens** rotativos, no eternos.
- **Idle timeout** 30 min apps internas, configurable apps cliente.
- **Hard logout** tras 8h apps internas.
- **Cualquier auth propio = NO** sin justificación escrita + aprobación.

## Anti-patrones (detectables por `@cyber`)
- JWT firmado con clave en código.
- Refresh tokens en localStorage.
- Sesiones sin invalidación al cambiar password.
- Verificación de permisos solo en frontend.
- Login + redirect open (open redirector).

## Referencias
- OWASP Top 10 2025 — A07: Identification and Authentication Failures.
- NIST 800-63B (Digital Identity Guidelines).
