# Building Block · Patrones de Testing
**Consumido por:** `@architect`, `@qa`, `@frontend`, `@backend`

## Pirámide

```
        ╱╲   E2E (5-10%)
       ╱  ╲  Integración (20-30%)
      ╱────╲ Unit (60-75%)
```

- **Unit**: funciones puras, hooks, validaciones, lógica de dominio.
- **Integración**: módulos contra dependencias reales (BD test, API mockeada).
- **E2E**: flujos críticos del usuario, no toda la app.

## Herramientas por stack

| Capa | Frontend | Backend |
|---|---|---|
| Unit | Vitest · Jest | Pytest · xUnit · Jest |
| Componentes | React Testing Library | — |
| Integración | MSW (mock service worker) | Test containers (PostgreSQL, Redis) |
| E2E | Playwright (preferido) | — |
| Contract | Pact (cliente↔servidor) | Pact |
| Mutation | Stryker / mutmut | Stryker / mutmut |
| Performance | k6 (delegar a `@perf`) | k6 / Locust |
| Accesibilidad | axe-core integrado en e2e | — |

## Reglas
- **Tests deterministas**: cero `sleep()`, cero red real, cero dependencias de hora del sistema.
- **Tests rápidos**: suite unit < 2 min, integración < 5 min como objetivos.
- **Tests con assertions**: tests sin assertion = no tests, se rechazan.
- **Caso feliz + 1 borde por test**: no escribir 1 test gigante con N casos.
- **Tests independientes**: orden no debe importar.
- **Flaky tests en cuarentena**, no se ignoran ni se borran a la ligera.

## Coverage
- Objetivo por defecto: 70-80% líneas, 60% ramas.
- 100% NUNCA es el objetivo — los últimos 5% suelen ser código de error trivial.
- Cobertura **se mide**, **no se exige a ciegas** (correlaciona con calidad, no es calidad).

## Contract testing (cuando aplica)
- Frontend define el "consumer pact".
- Backend lo verifica en CI.
- Bloquea merge si el backend rompe contrato.

## Anti-patrones
- Tests que usan la BD real de dev.
- Tests con `.skip` permanente sin issue asociado.
- Snapshots gigantes que nadie revisa.
- Mocks que mockean su propio mock.
- Cobertura 100% como objetivo de OKR (perversión).
