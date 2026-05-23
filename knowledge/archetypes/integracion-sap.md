# Arquetipo · Integración SAP / Sistemas Corporativos
**Cuándo aplica:** Conectar una nueva aplicación con SAP (ERP, S/4HANA, SuccessFactors), Oracle, AD o cualquier sistema maestro Naturgy.

## Características típicas
- Datos maestros viven en SAP/Oracle, NO se replican.
- Consumo vía APIs (OData, REST) o cola de mensajes.
- Volumen variable: desde decenas/día (tickets) a miles/min (lecturas).
- SLA estricto de la app consumidora si SAP cae.
- Auditoría de acciones obligatoria.

## Stack por defecto
| Capa | Tecnología recomendada | Alternativa |
|---|---|---|
| Gateway / BFF | FastAPI (Python) o .NET | Express si JS |
| Cola | Azure Service Bus | RabbitMQ · Kafka (si flujo masivo) |
| Caché | Redis (Azure Cache for Redis) | — |
| Cliente SAP | librería oficial o conector REST/OData | RFC vía PyRFC si necesario |
| Auth (app→SAP) | OAuth2 service-to-service / SAP BTP destination | — |
| Observabilidad | App Insights + correlation ids | — |

## 5 decisiones típicas que `@architect` debe forzar
1. **¿Síncrono o asíncrono?** Asíncrono por defecto vía cola; síncrono solo para consultas puntuales y rápidas.
2. **¿Circuit breaker?** Sí siempre — SAP cae y nuestra app no debe arrastrarlo.
3. **¿Caché de respuestas?** Sí para datos maestros poco volátiles (clientes, materiales, organigrama).
4. **¿Idempotencia?** Cualquier operación que escriba en SAP debe ser idempotente (cliente_id + operación + hash).
5. **¿Reintentos?** Exponential backoff con jitter; tope máx 5 intentos; envío a DLQ tras fallo definitivo.

## Riesgos Naturgy específicos
- **Bloqueo masivo a SAP** si la integración hace polling agresivo → throttling obligatorio.
- **Datos personales en payloads** → pseudonimizar logs/trazas; nunca log del payload completo en producción.
- **Dependencia operativa** → si SAP cae los fines de semana (ventana de mantenimiento), la app debe degradar a modo solo-lectura.

## Ejemplos de proyectos de esta tipología
- Portal de proveedores que consume datos SAP MM.
- App de aprobaciones que escribe en SAP HR vía SuccessFactors.
- Conector entre IoT de campo y SAP PM (mantenimiento).

## Playbook recomendado
`playbooks/feature-empresarial.md` con `@backend` (sub-agente IntegrationsExpert) protagonista + `@cyber` muy estricto.
