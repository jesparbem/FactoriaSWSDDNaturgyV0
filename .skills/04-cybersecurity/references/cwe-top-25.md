# CWE Top 25 · 2025
**Consumido por:** `@cyber` (sub-agente CodeSecurityAgent)

CWE = Common Weakness Enumeration. Más granular que OWASP. Esta lista es la priorización oficial 2025.

| CWE | Nombre | OWASP | CVSS típico |
|---|---|---|---|
| CWE-79 | XSS (Cross-Site Scripting) | A03 | 6.1 |
| CWE-787 | Out-of-bounds Write | — | 8.0 |
| CWE-89 | SQL Injection | A03 | 9.8 |
| CWE-352 | CSRF | A01 | 8.0 |
| CWE-22 | Path Traversal | A01 | 7.5 |
| CWE-125 | Out-of-bounds Read | — | 7.5 |
| CWE-78 | OS Command Injection | A03 | 9.8 |
| CWE-416 | Use After Free | — | 7.0 |
| CWE-862 | Missing Authorization | A01 | 8.0 |
| CWE-434 | Unrestricted Upload of File with Dangerous Type | A01 | 9.8 |
| CWE-94 | Improper Control of Generation of Code (Code Injection) | A03 | 9.0 |
| CWE-20 | Improper Input Validation | múltiples | 7.5 |
| CWE-77 | Command Injection | A03 | 9.8 |
| CWE-287 | Improper Authentication | A07 | 8.0 |
| CWE-269 | Improper Privilege Management | A01 | 8.0 |
| CWE-502 | Deserialization of Untrusted Data | A08 | 9.8 |
| CWE-200 | Exposure of Sensitive Information | A02 | 7.5 |
| CWE-863 | Incorrect Authorization | A01 | 7.5 |
| CWE-918 | SSRF | A10 | 8.0 |
| CWE-119 | Improper Restriction of Operations within Memory Buffer | — | 7.5 |
| CWE-476 | NULL Pointer Dereference | — | 5.5 |
| CWE-798 | Use of Hard-coded Credentials | A07 | 9.8 |
| CWE-190 | Integer Overflow or Wraparound | — | 7.0 |
| CWE-400 | Uncontrolled Resource Consumption | — | 7.5 |
| CWE-306 | Missing Authentication for Critical Function | A07 | 9.8 |

## Cómo usa `@cyber` esta lista
1. Al detectar un hallazgo, el sub-agente intenta clasificarlo en un CWE.
2. El CVSS base de esta tabla es el punto de partida; se ajusta según contexto (entorno, autenticación necesaria, etc.) usando `cvss-rubric.json`.
3. Cada hallazgo en el `SECURITY-AUDIT-{fecha}.md` lleva el CWE como tag.

## Prioridad cruzada CWE × Naturgy
Los CWE marcados con prioridad ALTA para Naturgy (sector regulado, datos personales):
- **CWE-798** (hard-coded credentials) → Critical siempre.
- **CWE-89, CWE-78, CWE-77, CWE-94, CWE-434, CWE-306** → Critical en cualquier app con auth.
- **CWE-200, CWE-862, CWE-863** → Critical si toca datos personales (RGPD).
- **CWE-502** → Critical si hay deserialización de input.
