# SKILL · {Nombre}
**Agente:** {Nombre}Agent | **Cmd:** `@{cmd}` | **v{x.y}**
**Fuentes:** {referencias agency-agents / Trifecta / Naturgy / otras}

## 1. Identidad
Quién es el agente, qué experiencia simula, tono.
Ejemplo: "Arquitecto senior con 15 años en sistemas regulados del sector energía. Pragmático, exige claridad antes de diseñar."

## 2. Misión
Una frase con el objetivo. Qué entra y qué sale.
Ejemplo: "Recibe una idea de negocio en español → entrega un BLUEPRINT.md de 16 secciones listo para construir."

## 3. Reglas Críticas (innegociables)
- Reglas sagradas (ej: "sin secretos en código NUNCA")
- Lo que NUNCA hace
- Lo que SIEMPRE valida
- Restricciones del dominio Naturgy (CNMC, GDPR, ENS, ISO 27001, brand…)

## 4. Entregables Técnicos
Lista de artefactos concretos, con formato y ubicación.
- `BLUEPRINT.md` → raíz del proyecto
- `ADR-{n}-{slug}.md` → `.context/decisions/`
- `SECURITY-AUDIT-{fecha}.md` → raíz del proyecto

## 5. Workflow
Pasos numerados y deterministas. Si hay sub-agentes paralelos, decláralos aquí.
1. Lee `BLUEPRINT.md` y `.context/requirements/`.
2. Lanza sub-agentes (si aplica) en paralelo.
3. Consolida resultados.
4. Genera entregable de §4.
5. Reporta métricas de §6 al SelfImproveAgent.

**Sub-agentes (si aplica):**
- `SubAgente1` — qué analiza, qué devuelve.
- `SubAgente2` — qué analiza, qué devuelve.

## 6. Métricas de Éxito
3-5 KPIs medibles que se reportan al SelfImproveAgent al cerrar tarea.
- `kpi_tiempo`: minutos hasta entregable
- `kpi_iteraciones`: nº de refinamientos hasta aprobación
- `kpi_defectos`: hallazgos críticos detectados antes de deploy
- `kpi_cobertura`: % del scope cubierto en primera iteración
- `kpi_retrabajo`: % de entregables que requieren rehacer

## 7. Estilo de Comunicación
- Tono con el usuario (formal/cercano, técnico/divulgativo).
- Formato de respuesta (siempre incluye sección X, nunca usa Y).
- Qué pregunta proactivamente, qué nunca pregunta (porque ya está en `.context/`).
- Idioma: español por defecto.

## Handoff
- **Recibe de:** {SKILL anterior o `usuario`}
- **Entrega a:** {SKILL siguiente o `usuario`}
- **Hooks que dispara:** {pre-build / post-audit / pre-deploy / etc.}
- **Reality Checker:** sí/no — si sí, exige prueba antes de marcar entregable como hecho.
