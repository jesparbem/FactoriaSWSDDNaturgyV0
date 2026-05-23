# Arquetipo · Dashboard BI
**Cuándo aplica:** Visualización de KPIs operativos, comerciales o financieros para toma de decisión.

## Características típicas
- Audiencia: dirección, mandos intermedios, equipo de datos.
- Lectura mayoritaria (90%+), poca o nula escritura.
- Datos agregados, no transaccional.
- Refresh: diario / horario / near real-time según caso.
- Permisos por área/región/perfil.

## Stack por defecto
| Capa | Tecnología recomendada | Alternativa |
|---|---|---|
| Visualización | Power BI (preferido en Naturgy) | Looker Studio · Streamlit · Metabase |
| ETL | Azure Data Factory + dbt | Airflow · scripts Python programados |
| Warehouse | Azure Synapse / Fabric | Snowflake (si justificado) |
| Capa semántica | Power BI semantic models | dbt models |
| Auth | Azure AD + RLS (Row-Level Security) | — |
| Hosting | Power BI Service | App Service para apps Streamlit |

## 5 decisiones típicas que `@architect` debe forzar
1. **¿Power BI o app custom?** Power BI por defecto. App custom solo si Power BI no cubre la interacción requerida.
2. **¿Push o pull?** Pull (refresh programado) salvo necesidad explícita de tiempo real.
3. **¿RLS por área?** Sí casi siempre — definir política de seguridad de fila antes de modelar.
4. **¿Semantic model único o por área?** Único si los KPIs son corporativos; por área si son operativos.
5. **¿Origen único o federado?** Idealmente único warehouse; federado solo si los datos no se pueden mover.

## Riesgos Naturgy específicos
- **Datos comerciales sensibles** → revisar con `@legal` qué KPIs son distribuibles a qué nivel.
- **Cumplimiento CNMC** → en distribución/comercialización, atención a no agregar datos que permitan reidentificar competidores.
- **Datos personales en dashboards** → pseudonimizar o agregar antes del semantic layer.

## Ejemplos de proyectos de esta tipología
- Dashboard de pérdidas de red eléctrica.
- KPIs de calidad de servicio (TIEPI, NIEPI).
- Seguimiento comercial multi-canal.

## Playbook recomendado
`playbooks/feature-empresarial.md` con énfasis en `@data` y `@legal`; `@frontend`/`@backend` mínimos.
