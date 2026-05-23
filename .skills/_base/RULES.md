# Reglas Comunes a Todos los SKILLs
**v1.0** | Aplican a los 17 agentes de la Factoría.

## R1 · Idioma y tono
- Conversación con el usuario: **español** por defecto.
- Código, identificadores, nombres de archivo: **inglés** (camelCase / kebab-case según convención del stack).
- Tono: profesional Naturgy. Cercano pero sin coloquialismos. Sin emojis salvo que el usuario los use.

## R2 · Secretos y datos sensibles
- **NUNCA** se exponen secretos en código, logs, mensajes de commit o respuestas al usuario.
- `.env` y similares **siempre** en `.gitignore`.
- Si el usuario pega un secreto en chat, el agente avisa y pide rotarlo.
- Datos personales (clientes Naturgy, empleados): tratamiento conforme GDPR — pseudonimizar en ejemplos.

## R3 · Branding Naturgy
- Colores corporativos y guía de estilo: respetar identidad visual Naturgy en UIs generadas.
- No usar logos sin permiso explícito.
- Lenguaje claro y profesional en textos UI (sin jerga interna).

## R4 · Compliance regulatorio
- Sector energía regulado → atención a CNMC, MITECO, REE/Enagás según aplique.
- Aplicaciones internas → ENS (Esquema Nacional de Seguridad) cuando toque sector público.
- ISO 27001 e ISO 27701 como marco de referencia.
- Accesibilidad WCAG 2.2 AA obligatoria en cualquier UI (Ley 11/2023).

## R5 · Sources of truth
- `.context/requirements/` → requisitos vigentes del proyecto actual.
- `BLUEPRINT.md` → contrato de arquitectura del proyecto en curso.
- `.skills/` → comportamiento de los agentes.
- `playbooks/` → recetas de orquestación reutilizables.
- Si hay conflicto, manda `BLUEPRINT.md` para el proyecto y `.context/requirements/` para la Factoría.

## R6 · Reality Check obligatorio
- Antes de marcar cualquier tarea como "hecha", el agente entrega **prueba** (ver `.skills/16-reality-checker/SKILL.md`):
  - Output de comando ejecutado.
  - Diff que demuestra el cambio.
  - Salida de tests verde.
  - Screenshot (si es UI).
- "Lo he hecho" sin prueba = "lo he propuesto".

## R7 · KPIs y retrospectiva
- Cada agente reporta sus métricas (§6 de su SKILL.md) al cerrar una invocación.
- `SelfImproveAgent` agrega y compara contra el último proyecto.
- Si un KPI empeora, se flagea en `RETRO-{fecha}.md`.

## R8 · Handoffs explícitos
- Ningún agente cierra sin declarar:
  - Qué entrega (artefactos concretos con paths).
  - A quién pasa el testigo (SKILL siguiente o usuario).
  - Qué hooks dispara.

## R9 · No modificar SKILLs aprobados sin confirmación
- Cambios en `.skills/*/SKILL.md` requieren aprobación explícita del usuario.
- Excepción: el `SelfImproveAgent` puede proponer diffs en `RETRO-*.md` pero **no aplicarlos** hasta confirmación.

## R10 · Ejecución local-first
- Todo corre en máquina del usuario o servidor Naturgy.
- Cero datos a nube salvo deploy explícito.
- HOME y `.context/` aislados por usuario y por proyecto.
