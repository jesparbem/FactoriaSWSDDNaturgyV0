# BLUEPRINT · {NOMBRE_PROYECTO}
**Versión:** 1.0 | **Fecha:** {FECHA} | **Autor:** {AUTOR} | **Arquetipo:** {ARQUETIPO}

> Esqueleto generado por `@architect`. Rellenable. Las 16 secciones son **obligatorias** — si una no aplica, justifica por qué.

---

## 1. Project Overview
- **Visión** (1 párrafo): qué problema resuelve y para quién.
- **Objetivos medibles** (3-5 KPIs de negocio).
- **Audiencia objetivo**: interna / externa / mixta. Volumen estimado.
- **Restricciones** (legales, presupuesto, plazo).
- **Fuera de scope**: qué NO va a hacer este proyecto.

## 2. Tech Stack
Tabla con cada tecnología elegida + razón + alternativa descartada.

| Capa | Tecnología | Razón | Alternativa descartada |
|---|---|---|---|
| Frontend | | | |
| Backend | | | |
| BD | | | |
| Auth | | | |
| Hosting | | | |

> Si hay incompatibilidades, ver `knowledge/stack-compatibility.md`.

## 3. Directory Structure
```
proyecto/
├── ...
```
Árbol esperado. Cada carpeta de primer nivel con 1 línea de propósito.

## 4. Data Model
- Entidades principales (3-7 máx).
- Relaciones (diagrama o texto).
- SQL/DDL de creación de tablas críticas.
- Datos personales → marcar con 🔒 y justificar base legal (consulta `@legal`).

## 5. API Design
- Endpoints principales con verbo + ruta + propósito + auth requerida.
- Contrato de errores (ver `knowledge/building-blocks/api-design-patterns.md`).
- Paginación, rate limiting, versionado.

## 6. Frontend Architecture
- Mapa de rutas/páginas.
- Componentes principales (jerarquía).
- Estado: qué vive en URL, qué en server, qué en cliente (ver `knowledge/building-blocks/state-management.md`).

## 7. Design System
- Tokens base (colores Naturgy, tipografía, espaciado).
- Componentes primitivos (Button, Input, Modal…).
- Tema oscuro (sí/no).
- Validación a cargo de `@ux`.

## 8. Auth & Authorization
- IdP elegido (ver `knowledge/building-blocks/auth-patterns.md`).
- Roles y permisos.
- 2FA: obligatorio / opcional / no aplica.
- Idle timeout + hard logout.

## 9. **Build Order** (plan de batalla)
**Esta sección es OBLIGATORIA y MANDATORIA.** Es la secuencia exacta que `@orchestrator` ejecuta. Sin ambigüedad.

Ejemplo:
1. Setup entorno (.env, repo, CI vacío).
2. Modelo de datos + migraciones iniciales.
3. Auth + middleware de sesión.
4. Endpoints CRUD core.
5. Tests de backend.
6. Frontend: layout + diseño base.
7. Frontend: features clave.
8. Tests e2e de flujos críticos.
9. CI/CD operativo + preview.
10. Auditorías (`@cyber` + `@legal` + `@a11y` + `@perf`).
11. Deploy a producción.

## 10. Environment Setup
- Versiones requeridas (Node 20, .NET 8, Python 3.11…).
- Variables de entorno (`.env.example` documentado, ver §11).
- Comandos `setup`, `dev`, `build`, `test`, `lint`.

## 11. Dependencies
Tabla con cada paquete y por qué.

| Paquete | Versión | Propósito |
|---|---|---|
| | | |

## 12. Deployment
- Hosting elegido (ver `knowledge/building-blocks/deployment-patterns.md` y `.skills/09-deploy/references/stack-to-hosting.md`).
- Pipeline CI/CD (stages, gates).
- Estrategia de release (blue-green / canary / rolling).
- Rollback documentado.

## 13. Testing
- Pirámide aplicada (ver `knowledge/building-blocks/testing-patterns.md`).
- Herramientas por capa.
- Cobertura objetivo (% líneas / % ramas).
- Tests de aceptación de negocio.

## 14. Skills to Use
Lista los SKILLs de la Factoría que intervienen y para qué (consulta `knowledge/skills-registry.md`).
Ejemplo:
- `@architect` → Secciones 1-3, 9, 16.
- `@backend` → Secciones 4, 5, 8.
- `@frontend` → Secciones 6, 7.
- `@cyber` → Sección 11 + auditoría completa.

## 15. CLAUDE.md (destino)
Contenido del `CLAUDE.md` que se copia al repo del proyecto destino para que otra instancia de Claude Code lo construya autónomamente. Usa `templates/PROJECT-CLAUDE-TEMPLATE.md` como base.

## 16. Rules
Restricciones no negociables del proyecto. Ejemplos:
- Sin secretos en código.
- WCAG 2.2 AA obligatorio.
- Compliance GDPR (si datos personales).
- Sin deploys en viernes.
- Reality check obligatorio entre handoffs.

---

## Estado de aprobación
- [ ] `@reality` confirma 16/16 secciones con contenido sustantivo.
- [ ] Usuario aprueba versión final.
- [ ] BLUEPRINT firmado y guardado en raíz del proyecto.
