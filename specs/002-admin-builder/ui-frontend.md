# UI / Frontend 002 — Admin builder

## Mapa de rutas

### Público (no cambia visualmente)
| Ruta | Cambio |
|---|---|
| `/` | Render desde `getPageBySlug("home")` |
| `/quienes-somos`, `/nuestro-espacio`, `/programas-terapeuticos[/*]`, `/admision`, `/contacto`, `/rrhh` | idem con su slug |

Estrategia: cada `page.tsx` queda como un wrapper mínimo que llama a `<PageRenderer slug="..." />`. El componente busca la `Page` por slug + tag `page:<slug>` y mapea sections al registry.

### Admin (nuevas rutas, `/admin/*`)

```
/admin                       Dashboard: lista de páginas + accesos a settings/media
/admin/pages/[id]            Editor de página (drag-and-drop)
/admin/pages/new             Crear página
/admin/media                 Biblioteca de imágenes
/admin/settings              Form de SiteSettings
/admin/professionals         CRUD equipo
/admin/workshops             CRUD talleres
/admin/job-openings          CRUD búsquedas
/admin/login                 Magic-link form
```

Todas las rutas `/admin/*` están detrás de un middleware que redirige a
`/admin/login` si no hay sesión válida con `role = "admin"`.

## Layout del admin

```
┌─────────────────────────────────────────────────────────┐
│ TopBar admin  [CETIP Admin]   user@email · cerrar sesión│
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│ Sidebar  │   Contenido de la ruta                       │
│  · Páginas│                                              │
│  · Media │                                              │
│  · Equipo│                                              │
│  · Talleres                                             │
│  · Búsquedas                                            │
│  · Settings                                             │
│          │                                              │
└──────────┴──────────────────────────────────────────────┘
```

## Editor de página (`/admin/pages/[id]`)

**Layout**: 3 columnas

```
┌────────────┬─────────────────────────┬───────────────┐
│ Paleta     │ Canvas (drag-and-drop)  │ Inspector     │
│ (catálogo) │                         │ (form de la   │
│            │  [Hero Slider]      ⋮   │  sección      │
│ Hero       │  ─────────────────      │  seleccionada)│
│ ServiceGrd │  [Service Grid]     ⋮   │               │
│ About      │  ─────────────────      │  Campos Zod   │
│ Featured   │  [About Preview]    ⋮   │  con validac. │
│ PageHero   │  ─────────────────      │               │
│ ...        │  [+ Agregar sección]    │  [Guardar]    │
│            │                         │               │
└────────────┴─────────────────────────┴───────────────┘
```

### Componentes nuevos

- `AdminShell.tsx` — sidebar + topbar.
- `PageEditor.tsx` (client) — orquesta DndContext + SortableContext de
  `@dnd-kit`. Estado local optimista; en `onDragEnd` llama `reorderSections`.
- `SectionPalette.tsx` — lista de `registry[type]` arrastrable; al soltar en
  canvas dispara `addSection`.
- `SectionCard.tsx` — chip representando una sección en el canvas. Click → abre
  Inspector.
- `Inspector.tsx` — form generado dinámicamente desde `schema.ts` de la sección.
- `fields/` — un componente por tipo de campo:
  - `TextField`, `TextareaField`, `NumberField`, `SelectField`
  - `ImageField` — abre `MediaPicker`
  - `ArrayField` — para `heroSlides[]`, `cards[]`, etc.
  - `ColorField`, `LinkField` (URL interna o externa)
- `MediaPicker.tsx` — modal con `MediaAsset`s + drop zone.

### Sección "renderable" vs "editable"

Cada tipo en `components/sections/<Type>/` tiene:

```
schema.ts    Zod schema + defaults
render.tsx   Server Component que recibe props parseadas
editor.tsx   Client Component — meta del editor (label, icon, fieldGroups)
index.ts     re-export consolidado
```

`lib/sections.ts`:
```ts
import * as HeroSlider from "@/components/sections/HeroSlider";
import * as ServiceGrid from "@/components/sections/ServiceGrid";
// ...
export const registry = {
  hero_slider: HeroSlider,
  service_grid: ServiceGrid,
  // ...
} as const;
```

## Drag and drop — comportamiento

- **Reordenar** dentro del canvas: SortableContext de `@dnd-kit/sortable`.
  Animaciones nativas de la librería. Soporta teclado (flechas + Space para
  agarrar/soltar).
- **Agregar desde paleta**: drag-and-drop cross-container o, alternativamente,
  botón "Agregar" en cada slot (más accesible — implementar ambos).
- **Persistencia**: optimistic update en cliente, `reorderSections` en server.
  Si falla, revertir y mostrar toast.

## Estados visuales

| Estado | UI |
|---|---|
| Cargando página | Skeleton de 3 cards |
| Sin secciones | Empty state con CTA "Agregar primera sección" |
| Sección con error de validación | Card con borde rojo + tooltip de errores |
| Guardando | Botón "Guardar" → spinner; canvas no bloquea |
| Sin permisos | Redirect a `/admin/login` |
| Conflicto (otro editor cambió la página) | Banner: "Hay cambios nuevos, refrescar" |

## Media library

- Grid responsive de thumbnails.
- Hover: nombre, peso, dimensiones.
- Drag-and-drop upload (varios archivos a la vez).
- Click → modal de detalle con campo `alt` editable.
- Filtro por mime / búsqueda por nombre.
- Borrar requiere confirmación; bloquea borrado si el asset está usado en alguna
  sección (`grep` en `Section.data` con query SQL `jsonb`).

## Settings

Form simple con campos del modelo `SiteSettings`. Sin drag-and-drop. Cada save
revalida `site-settings`.

## Accesibilidad del admin

- Foco visible en todos los controles.
- Drag-and-drop con teclado (`@dnd-kit` lo soporta nativo).
- `aria-live` para feedback de "Guardado" / "Error".
- Modales con focus trap.
- Etiquetas claras, no solo placeholder.

## Theming

Admin usa los mismos tokens de `globals.css`. Variantes neutras (gris) para
no distraer del contenido. No hay dark mode en v1.

## Mobile

El admin es **desktop-first**. En mobile se muestra una pantalla con mensaje
"Usá un escritorio para editar". El sitio público sí es responsive (no cambia).
