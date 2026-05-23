# Building Block · Gestión de Estado
**Consumido por:** `@architect`, `@frontend`

## Principio guía: el estado más local posible

```
Estado del servidor   →   React Query / SWR / Server Components
Estado de URL         →   useSearchParams, no estado interno
Estado UI local       →   useState, useReducer
Estado UI compartido  →   Context (poco, hojas cercanas)
Estado UI global      →   Zustand (si Context no llega)
Redux                 →   Solo si lo tienes ya o el equipo lo domina y justifica
```

## Reglas

1. **Si el dato viene del servidor → no es estado UI.** Usa Server Components (Next.js App Router) o React Query/SWR. No lo metas en Redux/Zustand.
2. **Si el estado describe la vista de URL** (filtros, página, búsqueda) → vive en la URL (`searchParams`). Compartible, indexable, navegable atrás.
3. **Si solo lo usa un componente → `useState`.** No promueva a global "por si acaso".
4. **Si 2-3 componentes hermanos lo comparten → levantar a padre.** Context solo si la prop drilling es real.
5. **Si es global de verdad** (tema, usuario actual, carrito) → Zustand. Pequeño, sin boilerplate.

## Tabla de decisión rápida

| Caso | Solución |
|---|---|
| Lista de productos del servidor | React Query con cache |
| Filtros aplicados a la lista | `?filtro=X&orden=Y` en URL |
| Modal abierto/cerrado | `useState` en el componente que la abre |
| Tema oscuro/claro | Zustand + localStorage |
| Usuario autenticado | Context provider en root + Zustand |
| Carrito de compra | Zustand persistido |
| Formulario | React Hook Form (no estado manual) |

## Anti-patrones
- Redux para todo, incluso para `isModalOpen`.
- Cargar todos los datos del servidor en un store global y filtrar en cliente.
- Dos fuentes de verdad (estado local + global del mismo dato).
- `useEffect` para sincronizar dos `useState` (señal de que sobra uno).
- Reducer con 50 acciones para un solo componente.

## React Server Components (Next.js App Router)
Reducen drásticamente la necesidad de estado en cliente:
- Datos del servidor → fetch en el componente servidor, sin estado cliente.
- Cliente solo para interactividad real (form, modal, dropdown).
- `useState` solo en componentes con `'use client'`.

## Formularios
- **React Hook Form** + Zod / Yup para validación.
- No mantener cada input en `useState` por separado.
- Validación en cliente Y servidor (defensa en profundidad).
