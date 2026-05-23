# Scope Tiering · Adapta profundidad al tamaño del proyecto
**Consumido por:** `@cyber` (también aplicable a `@a11y`, `@perf`)

Inspirado en Cyber Neo. La idea: no escanear de la misma forma un PoC de 200 archivos que una app productiva de 50.000. Adaptar profundidad sin perder cobertura efectiva.

## 3 Tiers

### Tier 1 · Small (< 1.000 archivos)
**Estrategia:** Full scan
- Todos los sub-agentes en cada archivo.
- Sin priorización — el proyecto cabe entero.
- Coverage objetivo: 100%.
- Tiempo esperado: < 10 min.

**Cuándo aplica:** PoCs, prototipos, microservicios pequeños, scripts.

### Tier 2 · Medium (1.000 - 10.000 archivos)
**Estrategia:** Targeted scan
- Sub-agentes corren sobre **directorios críticos**:
  - `src/`, `app/`, `pages/`, `lib/` (código de negocio)
  - `auth/`, `security/`, `crypto/` (zonas sensibles)
  - `api/`, `routes/`, `controllers/` (puntos de entrada)
  - `config/`, `infra/`, `iac/`, `.github/`, `.gitlab-ci/` (config)
  - `package.json`, `pyproject.toml`, etc. (deps)
- **Excluidos por defecto** (rebajar prioridad, no eliminar):
  - `node_modules/`, `.venv/`, `vendor/` (deps ya escaneadas vía lockfiles)
  - `dist/`, `build/`, `out/` (artefactos)
  - `__tests__/`, `tests/` (revisar superficialmente)
- Coverage objetivo: > 85%.
- Tiempo esperado: 10-30 min.

**Cuándo aplica:** Apps productivas medianas, monorepos pequeños.

### Tier 3 · Large (> 10.000 archivos)
**Estrategia:** Critical-path scan
- Identifica **entry points**:
  - Endpoints HTTP/gRPC.
  - Consumidores de cola/topic.
  - Funciones serverless.
  - Workers programados.
- Sigue el grafo de llamadas desde cada entry point hasta profundidad N.
- Solo audita el código alcanzable desde entrada externa.
- Sub-agentes priorizan:
  - SecretsScanner: SIEMPRE full (rápido, alto valor).
  - DependencyAuditor: SIEMPRE full (lockfiles bastan).
  - CodeSecurityAgent: critical-path.
  - InfraReviewer: SIEMPRE full (suele ser poco código).
  - SupplyChainChecker: SIEMPRE full.
- Coverage objetivo: > 70% del código alcanzable.
- Tiempo esperado: 30-90 min.

**Cuándo aplica:** Monorepos grandes, sistemas legacy enormes, plataformas.

## Detección automática del tier

```
file_count = count_files(project_root, exclude=[".git/"])

if file_count < 1000:
    tier = "small"
elif file_count < 10000:
    tier = "medium"
else:
    tier = "large"

return tier
```

## Lo que NO cambia entre tiers
- Las reglas sagradas (sin secretos en código, etc.).
- El threshold de bloqueo de deploy (Critical/High > 0 = bloqueo).
- La obligación de `@reality` validar Critical/High con PoC.
- La estructura del informe `SECURITY-AUDIT-{fecha}.md`.

## Lo que SÍ cambia
- Profundidad de análisis estático.
- Tiempo total del scan.
- % de cobertura reportado en `Scan Metadata`.
- Granularidad de los hallazgos (Tier 3 puede agrupar hallazgos similares).

## Reporting transparente
El informe SIEMPRE declara:
- Tier aplicado.
- Por qué (cuenta de archivos).
- Coverage logrado.
- Lo que se excluyó deliberadamente.

Esto permite al usuario decidir si solicitar un escaneo más profundo.
