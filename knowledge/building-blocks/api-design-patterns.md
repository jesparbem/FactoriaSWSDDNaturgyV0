# Building Block · Diseño de APIs
**Consumido por:** `@architect`, `@backend`

## Estilo por defecto
- **REST** para APIs internas y públicas estándar.
- **GraphQL** solo si hay BFF con clientes muy diversos consultando subsets de datos.
- **gRPC** entre microservicios internos con contratos fuertes y volumen alto.
- Webhooks para integraciones event-driven con terceros.

## Convenciones REST
- Recursos en plural (`/clientes`, no `/cliente`).
- Verbos HTTP correctos: `GET`/`POST`/`PUT`/`PATCH`/`DELETE`.
- `PATCH` para parciales, `PUT` para reemplazo total.
- Acciones no-CRUD como sub-recursos: `POST /pedidos/123/cancelar`.
- Versionado vía path: `/api/v1/...` (no header).

## Paginación
- Cursor-based para listas grandes o que cambian: `?cursor=abc&limit=50`.
- Offset solo para listas pequeñas y estables.
- Devolver `next_cursor` y `total` (si calculable barato).

## Errores
Contrato estándar:
```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "El campo email no es válido",
    "details": { "field": "email" },
    "trace_id": "abc123"
  }
}
```
- Códigos HTTP correctos: 4xx cliente, 5xx servidor.
- `code` interno estable (no se cambia entre versiones).
- `trace_id` propagado a App Insights para soporte.

## Validación
- DTOs tipados en el borde.
- Validación con biblioteca estándar (Zod / FluentValidation / pydantic).
- Rechazar campos desconocidos (strict mode).

## Rate limiting
- Obligatorio en endpoints públicos.
- Burst + sostenido.
- Headers estándar: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`.

## Documentación
- OpenAPI generado desde código (no escrito a mano).
- Servido en `/api/docs` en entornos no productivos.
- Ejemplos request/response en cada endpoint.

## Anti-patrones
- Endpoints "god" (`/api/do?action=...`).
- IDs internos expuestos sin protección IDOR.
- Errores que filtran stack traces a cliente.
- Tokens en query string.
- `GET` con efectos secundarios.
