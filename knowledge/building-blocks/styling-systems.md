# Building Block · Sistemas de Estilo
**Consumido por:** `@architect`, `@frontend`, `@ux`

## Default Naturgy: Tailwind CSS + tokens corporativos

### Por qué Tailwind
- Utility-first → menos CSS huérfano, dead code eliminado en build.
- Tokens centralizados en `tailwind.config.ts`.
- Compatible con cualquier framework.
- Bundle CSS final < 30 KB en apps normales.

### Tokens Naturgy (esqueleto)
```ts
// tailwind.config.ts (resumen)
{
  theme: {
    colors: {
      naturgy: {
        primary: '#FF671B',     // Naranja corporativo
        secondary: '#0066B3',   // Azul
        neutral: { /* escala 50-950 */ },
        success: '#0E8746',
        warning: '#FFB300',
        danger: '#D72631',
      },
    },
    fontFamily: {
      sans: ['NaturgyFont', 'system-ui', 'sans-serif'],
    },
    spacing: { /* 4px base */ },
  }
}
```

> Validar paleta exacta con `@ux` y Brand Guardian Naturgy antes de cerrar.

## Cuándo usar CSS Modules
- Componentes muy específicos con animaciones complejas.
- Sustitución de Tailwind en zonas concretas que no se prestan a utility-first.
- **Nunca para layout estándar** (usa Tailwind).

## Cuándo NO usar CSS-in-JS
- Para estilos estáticos. Penaliza rendimiento (CSS en JS bundle).
- Excepción: estilos dinámicos que dependen de props con valores no enumerables (ej: color que viene de API). Y aun así, considerar variables CSS.

## Sistema de componentes
- Primitivas accesibles: **Radix UI** (headless) o **shadcn/ui** (Radix + Tailwind pre-styled).
- Composición por encima de configuración.
- Cada componente expone props tipadas, no acepta `style` arbitrario.
- Variantes con `cva` (class-variance-authority) o `tv` (tailwind-variants).

## Dark mode
- Tokens semánticos (`bg-surface`, no `bg-white`).
- `prefers-color-scheme` + toggle manual.
- Persistencia en localStorage.

## Accesibilidad (delegada a `@a11y`)
- Contraste mínimo WCAG AA: 4.5:1 texto normal, 3:1 grande.
- Focus visible siempre.
- `prefers-reduced-motion` respetado.

## Anti-patrones
- Tailwind + Bootstrap mezclados.
- Estilos inline con `style={{...}}` para temas (usar tokens).
- Colores hex hardcoded en componentes.
- Múltiples sistemas de iconos a la vez.
