# Proceso de Iteración de la Factoría
**v1.0** | Cómo se refinan los requisitos y las specs a lo largo del proyecto.

## Principio
La Factoría no entrega "a la primera". Cada artefacto (BLUEPRINT, SKILL, código) pasa por un ciclo de refinamiento controlado. La iteración se registra en `.context/iterations/` para alimentar la auto-mejora.

## El ciclo en 7 pasos

### 1. Capturar
- El usuario describe su intent en español natural (voz o texto).
- El `@architect` o el `@orchestrator` clasifica el tipo de petición.
- Se crea un `ITERATION-{id}-{fecha}.md` en `.context/iterations/`.

### 2. Entender
- Si la petición es ambigua, se hacen preguntas (máx 3 por turno).
- Si está clara, se salta al paso 3.
- Las respuestas se anotan en el `ITERATION-*`.

### 3. Proponer
- El agente correspondiente genera un primer borrador del entregable.
- El borrador es **explícito sobre lo asumido por defecto**.
- Se marca como `DRAFT-v0`.

### 4. Validar con prueba
- `@reality` exige evidencia del borrador (BLUEPRINT coherente, código que arranca, tests que pasan…).
- Si falla → vuelve al paso 3 con feedback concreto.
- Si pasa → siguiente paso.

### 5. Refinar con usuario
- Se presenta al usuario el borrador validado.
- El usuario puede:
  - **Aprobar** → se marca `APPROVED-v{n}` y avanza.
  - **Pedir cambios** → se anotan en el `ITERATION-*`, se vuelve al paso 3.
  - **Cambiar de dirección** → se cierra esta iteración, se abre una nueva.

### 6. Aplicar
- El entregable aprobado se aplica (commit, deploy, doc publicada).
- `@reality` valida el cambio final (no solo el borrador).
- Hooks correspondientes se disparan (`post-build`, `pre-deploy`…).

### 7. Registrar lecciones
- Al cerrar la iteración:
  - KPIs del agente se reportan a `@self-improve`.
  - El `ITERATION-*` se cierra y se enlaza desde un índice.
  - Si la iteración requirió > N reintentos, se flagea para análisis.

## Límite duro
- **Máximo 3 iteraciones** de un mismo entregable sin escalada al usuario.
- Si tras la 3ª no hay aprobación → el agente para, resume el bloqueo y pide redirección.

## Persistencia
Todos los `ITERATION-*` viven en `.context/iterations/` con:
- Timestamp de inicio/cierre.
- SKILL responsable.
- Versiones del entregable (`DRAFT-v0`, `DRAFT-v1`, `APPROVED-v2`).
- Veredicto de `@reality` por versión.
- Feedback del usuario en cada vuelta.

Esto es la materia prima del `@self-improve` para mejorar SKILLs entre proyectos.
