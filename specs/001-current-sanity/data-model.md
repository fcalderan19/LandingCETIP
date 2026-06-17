# Data model 001 — Schemas Sanity vigentes

Documenta lo que existe en `sanity/schemas/`. Esta es la fuente para mapear
contenido a la nueva DB en la spec 002.

## Singletons (un único documento por tipo)

| Schema | Title | Campos clave |
|---|---|---|
| `siteSettings` | ⚙ Configuración del sitio | nombre, dirección, teléfono, email, WhatsApp, redes, mapsEmbed |
| `homePage` | 🏠 Página de Inicio | `heroSlides[]`, bloques servicios/about/promo |
| `quienesSomosPage` | 👥 Quiénes Somos | hero, misión/visión/valores, equipo eyebrow |
| `nuestroEspacioPage` | 🏛 Nuestro Espacio | hero, galería, descripción instalaciones |
| `programasOverviewPage` | 📚 Overview programas | hero, cards de cada programa |
| `programaCETPage` | 📚 CET | hero, descripción, modalidades |
| `programaConsultoriosPage` | 📚 Consultorios | hero, especialidades |
| `programaTalleresPage` | 📚 Talleres | hero, descripción intro |
| `programaEvaluacionesPage` | 📚 Evaluaciones | hero, tipos de evaluación |
| `admisionPage` | 📝 Admisión | hero, descripción, info de proceso |
| `rrhhPage` | 💼 RR.HH. | hero, copys del form, intro búsquedas |
| `contactoPage` | 📞 Contacto | hero, info de contacto adicional |

## Colecciones (múltiples documentos)

### `profesional`
```ts
{ nombre, rol, disciplina, descripcion, foto, orden }
```
Query: ordenado por `orden asc, nombre asc`.

### `taller`
```ts
{ titulo, dia, horario, destinatarios, descripcion, visible, orden }
```
Solo se sirven los `visible == true`.

### `busqueda`
```ts
{ titulo, area, modalidad, jornada, descripcion, activa, orden }
```
Solo se sirven las `activa == true`.

## Ejemplo detallado: `homePage.heroSlides[]`

Cada slide tiene:
- `eyebrow: string`
- `titulo: string` (required)
- `descripcion: text(rows: 2)`
- `imagen: image` (con hotspot, required)
- `ctaLabel: string`
- `ctaHref: string`
- `accent: "celeste" | "coral" | "naranja"`

Este shape es el que la spec 002 debe poder representar en la nueva DB.

## Tags de revalidación actuales

Mapeados en `app/api/revalidate/route.ts`:

```ts
const tagMap = {
  profesional: "equipo",
  taller: "talleres",
  busqueda: "busquedas"
};
```

Singletons **no tienen tag** → editarlos no revalida nada.

## Mapeo Sanity → Postgres (anticipo para spec 002)

| Sanity | Postgres (002) |
|---|---|
| Singleton `homePage` con array `heroSlides` | Page("home") con Section(type="hero_slider") cuyo `data` JSONB contiene los slides |
| Colección `profesional` | Tabla `professional` con columnas tipadas |
| Colección `taller` | Tabla `workshop` |
| Colección `busqueda` | Tabla `job_opening` |
| `siteSettings` | Tabla `site_settings` (una fila) |
| Imágenes en Sanity assets | URLs en Vercel Blob (migración manual) |
