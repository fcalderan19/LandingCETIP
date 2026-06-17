# UI / Frontend 001 — Estado actual

## Rutas

| Ruta | Archivo | Estado | Lee Sanity? |
|---|---|---|---|
| `/` | `app/page.tsx` | OK | ❌ todo hardcodeado |
| `/quienes-somos` | `app/quienes-somos/page.tsx` | OK | ❌ |
| `/nuestro-espacio` | `app/nuestro-espacio/page.tsx` | OK | ❌ |
| `/programas-terapeuticos` | idem `page.tsx` | OK | ❌ |
| `/programas-terapeuticos/cet` | idem | OK | ❌ |
| `/programas-terapeuticos/consultorios` | idem | OK | ❌ |
| `/programas-terapeuticos/talleres` | idem | OK | parcial — `taller[]` |
| `/programas-terapeuticos/evaluaciones-diagnosticas` | idem | OK | ❌ |
| `/admision` | idem | OK | ❌ |
| `/contacto` | idem | OK | ❌ |
| `/rrhh` | idem | parcial — `busqueda[]` | parcial |
| `/studio/*` | montado por Sanity | OK | n/a |

## Componentes globales (en `layout.tsx`)

- `TopBar` — banner superior (datos de `lib/site.ts`)
- `Header` — nav principal (datos de `lib/nav.ts`)
- `Footer`
- `FloatingWhatsapp` — botón flotante
- `RevealObserver` — IntersectionObserver para animaciones `.reveal → .is-visible`

## Componentes por sección de home

| Componente | Contenido | Fuente |
|---|---|---|
| `HeroSlider` | 3 slides con autoplay (6.5s) | hardcoded en el componente |
| `ServiceGrid` | cards de servicios | hardcoded |
| `AboutPreview` | bloque About con imagen | hardcoded |
| `FeaturedStrip` | tira destacada | hardcoded |

## Sistema de diseño

### Tokens (en `app/globals.css` → `@theme`)
```css
--color-petroleo: #233841;  /* primario */
--color-verde:    #4ab748;  /* WhatsApp, "Enviar CV" */
--color-coral:    #ef3867;  /* destacados, CTA */
--color-naranja:  #f79321;  /* Talleres */
--color-celeste:  #2bace3;  /* links, Consultorios */
```

### Tipografía
- Inter 400/500/600/700/800 (Google Fonts via `<link>` en layout)

### Patrones
- Utility classes Tailwind v4
- `var(--color-*)` para colores temáticos
- `aria-label` en botones con icono
- Skip link `#main` para accesibilidad

## Animaciones

- **Reveal on scroll**: `.reveal` recibe `.is-visible` cuando entra en viewport
  (vía `RevealObserver` con IntersectionObserver).
- **Hero autoplay**: setInterval 6500ms.

## Accesibilidad

- HTML semántico, `lang="es-AR"`.
- JSON-LD `EducationalOrganization` + `LocalBusiness` en `layout.tsx`.
- Open Graph en metadata.
- Contraste WCAG AA en la paleta documentada.

## Lo que un editor **no puede** cambiar hoy desde Studio

Aunque exista el singleton correspondiente:

- Slides del hero de home (HARDCODED)
- Cards de servicios (HARDCODED)
- Texto del bloque About (HARDCODED)
- Tira "Featured" (HARDCODED)
- Cualquier copy de las páginas internas excepto colecciones `taller` y `busqueda`

Este es el problema central que motiva la spec 002.
