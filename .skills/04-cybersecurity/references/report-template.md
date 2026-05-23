# Security Audit Report · {PROJECT_NAME}
**Fecha:** {AUDIT_DATE} | **Auditor:** `@cyber` v{CYBER_VERSION} | **Commit:** `{COMMIT_SHA}`

---

## Executive Summary

**Risk Score:** {RISK_SCORE}/100
**Estado para deploy:** {STATUS}  *(BLOQUEADO si Critical/High > 0)*

| Severidad | Conteo |
|---|---|
| Critical | {CRITICAL_COUNT} |
| High | {HIGH_COUNT} |
| Medium | {MEDIUM_COUNT} |
| Low | {LOW_COUNT} |
| Info | {INFO_COUNT} |

### Top 3 acciones prioritarias
1. {TOP_ACTION_1}
2. {TOP_ACTION_2}
3. {TOP_ACTION_3}

---

## Findings (detalle por hallazgo)

### [CN-001] {FINDING_TITLE_1}
- **Severity:** {SEVERITY} (CVSS {CVSS_SCORE})
- **CWE:** {CWE_ID} — {CWE_NAME}
- **OWASP:** {OWASP_CATEGORY}
- **Location:** `{FILE_PATH}:{LINE_NUMBER}`
- **Sub-agente:** {SUB_AGENT}

**Descripción:**
{DESCRIPTION}

**Evidence:**
```{LANG}
{EVIDENCE_SNIPPET}
```

**Remediation:**
{REMEDIATION_TEXT}

```{LANG}
// Antes (vulnerable)
{VULNERABLE_CODE}

// Después (seguro)
{SECURE_CODE}
```

**Reality Check:** PoC o test que demuestra explotabilidad → `{POC_PATH}`

---

### [CN-002] ...
(repetir bloque por cada hallazgo)

---

## Dependency Vulnerabilities

| Paquete | Versión actual | CVE | CVSS | Severidad | Fix |
|---|---|---|---|---|---|
| {PACKAGE} | {CURRENT_VERSION} | {CVE_ID} | {CVE_CVSS} | {CVE_SEVERITY} | actualizar a {FIXED_VERSION} |

---

## Supply Chain Assessment

| Check | Resultado |
|---|---|
| Lock files presentes | {LOCKFILES_PRESENT} |
| Lock files íntegros | {LOCKFILES_INTEGRITY} |
| Scripts de ciclo de vida | {LIFECYCLE_SCRIPTS_REVIEW} |
| Typosquatting detectado | {TYPOSQUATTING_FOUND} |
| Dependency confusion | {DEP_CONFUSION_FOUND} |

---

## Configuración / Infraestructura

| Check | Resultado |
|---|---|
| CORS estricto | {CORS_OK} |
| CSP presente | {CSP_OK} |
| HSTS | {HSTS_OK} |
| X-Frame-Options | {XFO_OK} |
| Cookies HttpOnly + Secure | {COOKIES_OK} |
| Headers verbosos (Server, X-Powered-By) | {VERBOSE_HEADERS} |
| Docker user no-root | {DOCKER_USER_OK} |
| Docker secrets en layers | {DOCKER_SECRETS_OK} |

---

## STRIDE por feature nueva

| Feature | S | T | R | I | D | E |
|---|---|---|---|---|---|---|
| {FEATURE_1} | {STATUS} | {STATUS} | {STATUS} | {STATUS} | {STATUS} | {STATUS} |

Leyenda: ✓ cubierto · ⚠ parcial · ✗ no analizado

---

## Scan Metadata

- **Archivos escaneados:** {FILES_SCANNED}
- **Líneas analizadas:** {LINES_ANALYZED}
- **Cobertura:** {COVERAGE_PCT}%
- **Scope tier aplicado:** {SCOPE_TIER}  *(small / medium / large — ver `scope-tiering.md`)*
- **Duración:** {SCAN_DURATION_MIN} min
- **Hallazgos deduplicados:** {DEDUPED_COUNT}

---

## Anexo — Reglas Sagradas Aplicadas

- ✓ Sin secretos en código (regla R2 de RULES.md)
- ✓ Audit completo de OWASP Top 10
- ✓ STRIDE en features nuevas
- ✓ Bloqueo de deploy si Critical/High > 0
- ✓ Reality Check requerido en cada Critical/High

---

## Approval Gates (para `@deploy`)

| Gate | Estado |
|---|---|
| Critical = 0 | {GATE_CRITICAL} |
| High = 0 | {GATE_HIGH} |
| Secretos detectados | {GATE_SECRETS} |
| Dependencias Critical | {GATE_DEPS} |

**Resultado global:** {OVERALL_GATE_STATUS}
