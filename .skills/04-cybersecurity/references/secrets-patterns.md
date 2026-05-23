# Secrets Patterns · Regex Library
**Consumido por:** `@cyber` (sub-agente SecretsScanner)

Patrones regex para detectar credenciales hardcoded en código, configs y commits. Inspirado en gitleaks/trufflehog + adaptado a stack Naturgy.

> **Nota:** los patrones son orientativos. Producen falsos positivos. El scanner debe combinar regex + entropía + contexto.

## Cloud · AWS

| Tipo | Regex |
|---|---|
| AWS Access Key ID | `AKIA[0-9A-Z]{16}` |
| AWS Secret Access Key | `(?i)aws.{0,20}?['\"][0-9a-zA-Z\/+]{40}['\"]` |
| AWS Session Token | `(?i)aws.{0,20}?session.{0,20}?['\"][A-Za-z0-9\/+=]{16,}['\"]` |
| AWS MWS Key | `amzn\\.mws\\.[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}` |

## Cloud · Azure

| Tipo | Regex |
|---|---|
| Azure Storage Connection | `DefaultEndpointsProtocol=https?;AccountName=[a-z0-9]+;AccountKey=[A-Za-z0-9+\/=]{88}` |
| Azure SAS Token | `\\?sv=\\d{4}-\\d{2}-\\d{2}&ss=[a-z]+&srt=[a-z]+&sp=[a-z]+&se=\\d{4}-\\d{2}-\\d{2}T[\\d:Z]+&sig=` |
| Azure Subscription Key | `(?i)(subscription[_-]?key|ocp-apim-subscription-key)['\"]?\\s*[:=]\\s*['\"][a-f0-9]{32}['\"]` |
| Azure Client Secret | `(?i)client[_-]?secret['\"]?\\s*[:=]\\s*['\"][A-Za-z0-9~_.-]{34,}['\"]` |

## Cloud · GCP

| Tipo | Regex |
|---|---|
| GCP API Key | `AIza[0-9A-Za-z\\-_]{35}` |
| GCP Service Account JSON | `"type":\\s*"service_account"` |
| GCP OAuth Token | `ya29\\.[0-9A-Za-z\\-_]+` |

## VCS · GitHub / GitLab

| Tipo | Regex |
|---|---|
| GitHub Personal Token | `ghp_[A-Za-z0-9]{36}` |
| GitHub OAuth Token | `gho_[A-Za-z0-9]{36}` |
| GitHub App Token | `ghs_[A-Za-z0-9]{36}` |
| GitHub Refresh Token | `ghr_[A-Za-z0-9]{36}` |
| GitLab Personal Token | `glpat-[A-Za-z0-9\\-_]{20}` |

## Comunicación

| Tipo | Regex |
|---|---|
| Slack Token | `xox[baprs]-[0-9]{10,13}-[0-9]{10,13}-[A-Za-z0-9]{24,32}` |
| Slack Webhook | `https:\\/\\/hooks\\.slack\\.com\\/services\\/T[A-Z0-9]+\\/B[A-Z0-9]+\\/[A-Za-z0-9]+` |
| Discord Bot | `[MN][A-Za-z\\d]{23}\\.[\\w-]{6}\\.[\\w-]{27}` |
| Telegram Bot | `\\d{8,10}:[A-Za-z0-9_-]{35}` |

## Pagos

| Tipo | Regex |
|---|---|
| Stripe Secret (live) | `sk_live_[0-9a-zA-Z]{24,99}` |
| Stripe Secret (test) | `sk_test_[0-9a-zA-Z]{24,99}` |
| Stripe Restricted | `rk_(live|test)_[0-9a-zA-Z]{24,99}` |
| PayPal Client Secret | `(?i)paypal.{0,20}?(secret\|client_secret).{0,20}?['\"][A-Za-z0-9_-]{30,}['\"]` |

## Bases de datos

| Tipo | Regex |
|---|---|
| PostgreSQL URL | `postgres(?:ql)?:\\/\\/[^\\s:@]+:[^\\s:@]+@[^\\s\\/]+\\/\\w+` |
| MySQL URL | `mysql:\\/\\/[^\\s:@]+:[^\\s:@]+@[^\\s\\/]+\\/\\w+` |
| MongoDB URI | `mongodb(\\+srv)?:\\/\\/[^\\s:@]+:[^\\s:@]+@[^\\s\\/]+` |
| Redis URL | `redis(s)?:\\/\\/(?::[^\\s:@]+@)?[^\\s\\/]+` |
| SQL Server | `Server=.+?;.*?(Password\|Pwd)=[^;\"]+` |

## Claves y certificados

| Tipo | Regex |
|---|---|
| Private Key (PEM) | `-----BEGIN ((RSA\|EC\|DSA\|OPENSSH\|PGP) )?PRIVATE KEY-----` |
| Generic API Key | `(?i)(api[_-]?key\|apikey)['\"]?\\s*[:=]\\s*['\"][A-Za-z0-9_-]{32,}['\"]` |
| JWT (no es secreto, pero indicar exposición) | `eyJ[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+` |

## Genéricos

| Tipo | Regex |
|---|---|
| Password en config | `(?i)(password\|passwd\|pwd)['\"]?\\s*[:=]\\s*['\"][^'\"]{8,}['\"]` |
| Bearer Token | `(?i)bearer\\s+[A-Za-z0-9._~+/-]+=*` |
| Basic Auth en URL | `https?:\\/\\/[^\\s:@]+:[^\\s:@]+@` |

## Naturgy-specific (orientativo, ajustar)

| Tipo | Regex |
|---|---|
| Naturgy Internal Service Token | `(?i)naturgy[_-]?token['\"]?\\s*[:=]\\s*['\"][A-Za-z0-9_-]{32,}['\"]` |
| SAP Service Account password | `(?i)sap.{0,20}?(user\|pass\|pwd)['\"]?\\s*[:=]\\s*['\"][^'\"]{6,}['\"]` |

## Heurísticas adicionales (no solo regex)
- **Entropía Shannon > 4.5** en strings de longitud ≥ 20 → posible secreto aunque no matchee regex.
- **Allowlist**: archivos `*.example`, `*.sample`, `docs/`, `tests/__fixtures__/` se ignoran.
- **Contexto**: si el match está en un comentario inmediatamente seguido por "example", "fake", "dummy", reducir severidad.
- **Git history**: escanear no solo HEAD sino últimos 50 commits para detectar secretos ya rotados pero no purgados.

## Severidad por defecto
- Cloud cred (AWS/Azure/GCP) → **Critical**
- VCS token (GitHub/GitLab) → **Critical**
- Stripe live → **Critical**
- Stripe test → **High**
- DB URL con password real → **Critical** si live, **High** si dev
- Private key → **Critical**
- Genéricos (api_key, password) → **High** (revisar contexto)
- JWT → **Info** (no es secreto pero indica exposición de sesión)
