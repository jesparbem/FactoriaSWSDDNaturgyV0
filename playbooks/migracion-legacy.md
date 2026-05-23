# Playbook · Migración Legacy
**Caso de uso:** Modernizar una aplicación interna heredada (típicamente: app de escritorio, VB/Access, PHP antiguo, .NET Framework, Java EE…).
**Duración objetivo:** Semanas a meses según complejidad.
**Salida:** Aplicación equivalente en stack moderno, con tests, y plan de cutover.

## Trigger
Usuario dice "migrar", "modernizar", "sustituir aplicación X", "sacar de Access/Excel", "pasar a web".

## DAG de agentes

```
@architect (estudia legacy, propone arquitectura destino)
   ↓
@review (análisis exhaustivo del legacy: qué hace, qué casos cubre)
   ↓
@data (si hay BD legacy: extrae esquema, datos, dependencias)
   ↓
@backend ╲
@frontend ├─ (reconstrucción paralela)
@data     ╱
   ↓
@qa + @reality (tests de equivalencia: igual input → igual output)
   ↓
@cyber + @legal (auditoría completa, suele encontrar mucha deuda)
   ↓
@a11y (legacy raramente cumple WCAG, oportunidad de fix)
   ↓
@perf (comparativa vs legacy: debe ser ≥ rendimiento)
   ↓
@devops (CI/CD desde cero, observabilidad nueva)
   ↓
@deploy (con rollback al legacy, NO se apaga hasta validación)
```

## Particularidades de este playbook
1. **`@review` lee primero el código legacy**, no el nuevo. Su misión es entender qué hace realmente (a menudo no coincide con la documentación).
2. **Tests de equivalencia**: `@qa` define casos donde "legacy" y "nuevo" reciben mismo input → outputs deben coincidir. `@reality` valida que la comparación es real, no inventada.
3. **Migración de datos en `@data`**: estrategia ETL + plan de rollback si los datos quedan corruptos.
4. **Coexistencia temporal**: legacy y nuevo conviven hasta que `@perf` y `@qa` validan el nuevo en producción shadow durante N días.
5. **Cutover**: el legacy NO se apaga hasta confirmar estabilidad. Documentado en `CUTOVER-PLAN.md`.

## Artefactos específicos del playbook
- `LEGACY-ANALYSIS.md` — qué hace el sistema actual (caso por caso).
- `EQUIVALENCE-TESTS.md` — casos de equivalencia legacy ↔ nuevo.
- `DATA-MIGRATION-PLAN.md` — estrategia ETL, validaciones, rollback.
- `CUTOVER-PLAN.md` — pasos de switchover, criterios de "go", contingencia.
- `SHADOW-RUN-{fecha}.md` — resultados de operación en paralelo.

## Criterio de éxito
1. `EQUIVALENCE-TESTS.md` con > 95% de paridad funcional.
2. `@perf` confirma que el nuevo es ≥ rendimiento que el legacy.
3. Shadow run de ≥ 1 semana sin discrepancias críticas.
4. `@cyber` + `@legal` + `@a11y` sin Critical/High (el legacy probablemente los tenía).
5. Plan de cutover validado por stakeholder de negocio.

## Cuándo NO usar este playbook
- Si el legacy se puede tirar y empezar de cero sin equivalencia → usa `feature-empresarial`.
- Si solo se quiere mover de hosting (no rehacer) → no es migración, es `@devops` puro.
