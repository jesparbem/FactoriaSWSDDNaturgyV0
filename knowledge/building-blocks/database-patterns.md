# Building Block · Patrones de Base de Datos
**Consumido por:** `@architect`, `@backend`, `@data`, `@cyber`

## Matriz de selección

| Caso | BD recomendada | Justificación |
|---|---|---|
| App interna Naturgy estándar | SQL Server | Alineado corporativo, licencias existentes |
| App nueva con flexibilidad | PostgreSQL (Azure Database for PostgreSQL) | Open source, extensible (pgvector, PostGIS) |
| Volumen masivo / analítica | Synapse / Fabric (warehouse) | Optimizada para OLAP |
| Datos no estructurados / IoT | Cosmos DB | Multi-modelo, latencia global |
| Caché | Redis (Azure Cache for Redis) | Estándar de mercado |
| Búsqueda | Azure AI Search | Integrado en stack |

## Migraciones
- **Versionadas siempre** (Flyway / EF Core Migrations / Alembic).
- **Reversibles** — toda `up` tiene `down`.
- **Sin `ALTER` manual en producción.**
- En despliegue: migración primero (idempotente), luego app.

## Modelado
- Claves: UUID v7 por defecto (ordenable, sin colisiones), `bigint` autoincremental solo en sistemas legacy.
- Soft delete con `deleted_at`, no `is_deleted`.
- `created_at` + `updated_at` en toda tabla operativa.
- Audit log en tabla aparte (no triggers complejos en producción).

## Performance
- Índices: solo los que justifica el plan de ejecución. No "por si acaso".
- Evitar N+1 a toda costa (delegar a `@perf` la detección).
- Pool de conexiones dimensionado al hosting (App Service ≈ 30, Container Apps ≈ scale).
- Read replicas si la lectura supera 5× la escritura.

## Reglas no negociables
- **Sin secretos de conexión en código.** Variables de entorno + secret manager.
- **Cifrado en reposo** (TDE en SQL Server / Azure-managed en PG).
- **Backup + restore probado.** Si no se ha restaurado nunca, no existe.
- **Acceso a producción auditable** (usuarios nominales, no genéricos).

## Anti-patrones
- Mismo usuario de BD para app y para migraciones.
- Strings concatenados en queries (SQLi). Usar parametrización siempre.
- `SELECT *` en producción.
- BD compartida entre apps independientes.
