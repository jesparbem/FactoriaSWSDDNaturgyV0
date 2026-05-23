# Arquetipo · Automatización / ETL
**Cuándo aplica:** Pipeline de datos sin interfaz (o con UI mínima de monitorización), procesos batch o streaming.

## Características típicas
- Sin UI o con UI de operación únicamente.
- Inputs: ficheros (FTP/SFTP/S3), APIs, BD, colas.
- Outputs: warehouse, BD, ficheros, mails, APIs.
- Programación: cron / event-driven / manual.
- Volumen alto, latencia secundaria.
- Reprocesabilidad (idempotencia) crítica.

## Stack por defecto
| Capa | Tecnología recomendada | Alternativa |
|---|---|---|
| Orquestación | Azure Data Factory (managed) | Airflow / Dagster · Prefect |
| Cómputo | Python (pandas/polars) + Azure Functions | Databricks (si vol. masivo) |
| Lenguaje | Python 3.11+ con type hints | — |
| Storage intermedio | Azure Blob Storage (parquet) | — |
| Warehouse destino | Synapse / Fabric | Snowflake |
| Monitorización | App Insights + alertas | — |

## 5 decisiones típicas que `@architect` debe forzar
1. **¿Batch o streaming?** Batch por defecto. Streaming solo si negocio exige latencia < 5 min.
2. **¿Formato intermedio?** Parquet > CSV > JSON. Nunca Excel como capa intermedia.
3. **¿Idempotencia?** Obligatoria — ejecutar dos veces = mismo resultado.
4. **¿Particionado?** Sí, casi siempre por fecha (yyyy/mm/dd).
5. **¿Manejo de errores?** Reintentos + DLQ + alerta operativa con SLA de respuesta.

## Riesgos Naturgy específicos
- **Datos personales en lotes** → pseudonimización en la primera etapa, no más tarde.
- **Dependencias externas** (FTP de partners, APIs reguladas) → siempre con fallback y aviso.
- **Coste cloud** → cuidado con DataFactory pipelines mal optimizados; monitorización de coste obligatoria.
- **Cumplimiento ENS** → si toca sistemas con calificación, los pipelines también.

## Ejemplos de proyectos de esta tipología
- Conciliación de facturas con CNMC.
- Carga nocturna de lecturas de contadores.
- Generación de informes regulatorios mensuales.
- Migración de datos legacy a warehouse.

## Playbook recomendado
`playbooks/feature-empresarial.md` con `@data` protagonista y `@frontend` ausente o mínimo.
