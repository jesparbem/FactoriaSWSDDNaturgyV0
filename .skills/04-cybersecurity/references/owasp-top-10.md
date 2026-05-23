# OWASP Top 10 · 2025
**Consumido por:** `@cyber` (sub-agente CodeSecurityAgent)

## A01:2025 — Broken Access Control
**Qué es:** El usuario accede a recursos o realiza acciones fuera de sus permisos (IDOR, missing function-level auth).
**Detección:**
- Endpoints que reciben IDs pero no verifican propiedad.
- Verificación de permisos solo en frontend.
- Roles asignados sin validar en el backend.
**Mitigación:** Verificación de permisos en cada endpoint, en el servidor. Deny by default.

## A02:2025 — Cryptographic Failures
**Qué es:** Uso de crypto débil o ausencia donde se requiere.
**Detección:**
- MD5, SHA1 para passwords (debe ser argon2id / bcrypt / scrypt).
- TLS < 1.2 aceptado.
- Datos sensibles sin cifrar en tránsito o reposo.
**Mitigación:** Algoritmos modernos, TLS 1.2+ obligatorio, cifrado en reposo en BD.

## A03:2025 — Injection
**Qué es:** SQL, NoSQL, LDAP, OS command, ORM injection.
**Detección:** Strings concatenados en queries, `eval`/`exec` con input usuario, `child_process.exec` con strings.
**Mitigación:** Queries parametrizadas, prepared statements, ORMs con bindings, no `exec` con input.

## A04:2025 — Insecure Design
**Qué es:** Defectos de diseño (no de implementación).
**Detección:** Falta de threat modeling, ausencia de límites de negocio (ej: reset password sin throttling).
**Mitigación:** Threat modeling STRIDE por feature, design reviews.

## A05:2025 — Security Misconfiguration
**Qué es:** Defaults inseguros, headers ausentes, mensajes de error verbosos.
**Detección:**
- Falta CSP, HSTS, X-Frame-Options.
- CORS `*` en endpoints autenticados.
- Stack traces a cliente en producción.
- `.env` accesible vía web.
**Mitigación:** Hardening headers, CORS estricto, errores genéricos a cliente.

## A06:2025 — Vulnerable and Outdated Components
**Qué es:** Dependencias con CVEs conocidas.
**Detección:** Sub-agente `DependencyAuditor` con `npm audit`, `pip-audit`, OSV.
**Mitigación:** Actualizaciones regulares, lock files versionados, Dependabot.

## A07:2025 — Identification and Authentication Failures
**Qué es:** Brute force posible, sesiones débiles, recovery inseguro.
**Detección:**
- Login sin throttling.
- Sesiones sin invalidación al cambiar password.
- Tokens sin expiración.
**Mitigación:** Throttling + 2FA + rotación + invalidation.

## A08:2025 — Software and Data Integrity Failures
**Qué es:** CI/CD comprometido, deserialización insegura, paquetes sin verificar.
**Detección:** Sub-agente `SupplyChainChecker` (lockfiles, integridad, scripts maliciosos).
**Mitigación:** Lock files + checksum + provenance (SLSA).

## A09:2025 — Security Logging and Monitoring Failures
**Qué es:** Falta de logs / monitorización ante eventos críticos.
**Detección:**
- Login fallido no se loguea.
- Acceso a datos sensibles sin auditoría.
- Sin alertas configuradas.
**Mitigación:** Logs estructurados de eventos de seguridad, alertas en SIEM.

## A10:2025 — Server-Side Request Forgery (SSRF)
**Qué es:** El servidor hace requests a URLs controladas por el atacante (cloud metadata, intranet).
**Detección:** Endpoints que fetchean URLs con parámetro del usuario.
**Mitigación:** Allowlist de dominios, bloqueo a IPs internas (169.254.169.254, 10.x, etc.).

## Mapeo a sub-agentes `@cyber`
| OWASP | Sub-agente principal |
|---|---|
| A01, A07 | CodeSecurityAgent + AuthSpecialist (cross con `@backend`) |
| A02 | CodeSecurityAgent |
| A03 | CodeSecurityAgent |
| A04 | `@architect` durante threat modeling |
| A05 | ConfigAuditor + InfraReviewer |
| A06 | DependencyAuditor |
| A07 | CodeSecurityAgent |
| A08 | SupplyChainChecker |
| A09 | InfraReviewer + `@devops` |
| A10 | CodeSecurityAgent |
