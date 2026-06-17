# Spec 002 — Admin builder propio con drag-and-drop

## Objetivo

Reemplazar Sanity por un **módulo admin embebido en el mismo Next.js**, que
permita al equipo CETIP:

1. **Editar copys** de todas las secciones existentes (lo que hoy está hardcodeado).
2. **Reordenar secciones de una página** con drag-and-drop.
3. **Agregar/quitar secciones** dentro de una página, eligiendo de un catálogo
   de tipos pre-construidos (Hero, ServiceGrid, AboutPreview, FeaturedStrip,
   PageHero, etc.).
4. **Subir imágenes** a Vercel Blob, sin pasar por un CDN externo.
5. **Publicar cambios sin redeploy**: contenido se sirve desde Postgres con
   ISR y `revalidateTag`.

### Usuario
- **Admin/Editor CETIP** (rol único). Autenticado con magic-link. ~3 personas.
- **Visitante final** — no percibe el admin; sigue viendo el sitio público
  normal con tiempos de respuesta iguales o mejores que hoy.

### Éxito (criterios verificables)
- El editor puede cambiar el texto del Hero de home en `/admin` y verlo en `/`
  en menos de **5 segundos** sin tocar código ni Vercel.
- El editor puede arrastrar la sección "AboutPreview" debajo de "FeaturedStrip"
  y persistir el nuevo orden.
- El editor puede agregar una sección nueva del tipo "PageHero" a una página
  cualquiera y verla publicada.
- TTFB del sitio público no empeora respecto al baseline (medido en Vercel
  Analytics: < 200ms p75).
- Lighthouse Performance ≥ 90 en mobile para `/` y `/quienes-somos`.

## Tech Stack

| Capa | Tecnología | Versión target |
|---|---|---|
| Framework | Next.js 15 App Router (mantenido) | 15.5+ |
| Mutaciones | Server Actions | nativo |
| DB | **Neon Postgres** (serverless) | — |
| ORM | Prisma | ^5 |
| Auth | NextAuth.js (Auth.js v5) — magic-link via Resend | ^5 beta |
| Storage de imágenes | Vercel Blob | ^0.x |
| Drag-and-drop | `@dnd-kit/core` + `@dnd-kit/sortable` | ^6 |
| Validación | Zod | ^3 |
| Tests | Vitest (unit) + Playwright (e2e crítico) | últimos |

**Fuera de scope (no se hace en esta spec):**
- Multi-tenant / multi-rol granular.
- Workflow de aprobación (draft → review → publish).
- Versionado/rollback de contenido (se anota en backlog).
- i18n.
- Reemplazar formularios `/api/*` (siguen como están).

## Commands

```bash
npm run dev                       # Next dev (incluye admin en /admin)
npm run build                     # Build de producción
npm test                          # Vitest
npm run test:e2e                  # Playwright (después de build)
npm run lint
npm run db:migrate                # prisma migrate dev
npm run db:studio                 # prisma studio
npm run db:seed                   # seed con contenido importado de Sanity
```

## Project Structure (delta sobre el estado actual)

```
app/
  (public)/                       group para rutas públicas existentes
    page.tsx                      → renderiza secciones desde DB
    [...slug]/page.tsx            → resolver dinámico de páginas
  admin/                          🆕 panel admin (protegido)
    layout.tsx                    auth gate + chrome
    page.tsx                      dashboard / listado de páginas
    pages/[id]/page.tsx           editor de una página (drag-and-drop)
    media/page.tsx                biblioteca de imágenes
    settings/page.tsx             siteSettings
  api/
    auth/[...nextauth]/route.ts   🆕
    revalidate/route.ts           se mantiene pero apunta a tags propios
    upload/route.ts               🆕 firma de upload a Vercel Blob

components/
  admin/                          🆕 UI del admin
    PageEditor.tsx                canvas con dnd
    SectionPalette.tsx            catálogo de tipos
    fields/                       inputs por tipo de campo
  sections/                       🆕 componentes "renderable" + "editable"
    HeroSlider/{render.tsx, schema.ts, editor.tsx}
    ServiceGrid/...
    ...                           (uno por tipo de sección)

lib/
  db.ts                           Prisma client singleton
  auth.ts                         NextAuth config
  blob.ts                         Helpers Vercel Blob
  sections.ts                     Registry de tipos de sección
  site.ts                         (legacy → migra a tabla site_settings)

prisma/
  schema.prisma                   🆕
  migrations/

scripts/
  migrate-from-sanity.ts          🆕 one-shot: dataset Sanity → Postgres
```

## Code Style

Componentes "renderable" son **Server Components**; el editor en `/admin/...`
es Client. Cada sección expone un objeto contrato:

```tsx
// components/sections/HeroSlider/schema.ts
import { z } from "zod";

export const HeroSliderSchema = z.object({
  slides: z.array(z.object({
    eyebrow: z.string().max(80).optional(),
    title: z.string().min(1).max(160),
    desc: z.string().max(280).optional(),
    image: z.string().url(),
    ctaLabel: z.string().max(40).optional(),
    ctaHref: z.string().max(200).optional(),
    accent: z.enum(["celeste", "coral", "naranja"]),
  })).min(1).max(6),
});

export type HeroSliderProps = z.infer<typeof HeroSliderSchema>;
```

```tsx
// components/sections/HeroSlider/render.tsx
import type { HeroSliderProps } from "./schema";
export default function HeroSlider({ slides }: HeroSliderProps) { /* ... */ }
```

**Convenciones nuevas:**
- Cada tipo de sección vive en su propia carpeta con `schema.ts`, `render.tsx`,
  `editor.tsx`. Esto da co-localización y un registry tipado en `lib/sections.ts`.
- Server Actions van en archivos con `"use server"` al principio, agrupadas por
  recurso (`app/admin/_actions/pages.ts`, `.../sections.ts`, etc.).
- Errores de validación se devuelven como `{ ok: false, fieldErrors }` y se
  muestran inline en el editor.

## Testing Strategy

- **Unit (Vitest)**: schemas Zod, registry de secciones, reducers del editor.
- **Integration (Vitest + Prisma test DB)**: server actions de CRUD sobre páginas
  y secciones.
- **E2E (Playwright)**: 3 flujos críticos
  1. login magic-link → editar copy de hero → verificar en `/`.
  2. drag-and-drop reordenar dos secciones → verificar persistencia.
  3. agregar sección nueva desde paleta → verificar render.
- **Coverage objetivo**: ≥ 70% en `lib/` y server actions. UI sin métrica fija.

## Boundaries

- **Always**:
  - Validar input con Zod en **toda** server action.
  - Llamar `revalidateTag("page:<slug>")` después de cada mutación que afecte
    contenido público.
  - Marcar el editor como client component con `"use client"`.
  - `prisma migrate dev` para cualquier cambio de schema.
- **Ask first**:
  - Sumar dependencias nuevas (más allá de las listadas en Tech Stack).
  - Cambios destructivos en el schema Prisma una vez seedeado.
  - Tocar componentes públicos existentes (riesgo de regresión visual).
  - Cualquier cosa que afecte SEO / metadata.
- **Never**:
  - Commitear `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `AUTH_SECRET`, etc.
  - Servir páginas públicas sin caching (cada request a DB sin tag = bug).
  - Mantener Sanity en paralelo "por si acaso" — se elimina al cerrar la migración.
  - Borrar la tabla `site_settings` sin un seed garantizado.

## Success Criteria (medibles)

| # | Criterio | Cómo se mide |
|---|---|---|
| S1 | Editor cambia copy del Hero y se ve en home | Test E2E + manual |
| S2 | Drag-and-drop persiste orden | Test E2E |
| S3 | Agregar sección publica nueva | Test E2E |
| S4 | TTFB p75 público ≤ baseline | Vercel Analytics 7 días post-deploy |
| S5 | Lighthouse Mobile Perf ≥ 90 en `/`, `/quienes-somos` | Lighthouse CI |
| S6 | 0 referencias a `sanity*` en código tras la migración | `grep -r "sanity\|@sanity" .` |
| S7 | Backup verificable de contenido (export DB nightly) | Cron Vercel + check manual |
| S8 | Sin downtime en el cutover | Smoke test post-deploy |

## Riesgos (resumen — detalle en `plan.md`)

- **R1**: drag-and-drop con RSC requiere boundary client cuidadoso (mitigación:
  separar `editor.tsx` cliente del `render.tsx` servidor).
- **R2**: revalidation lag si `revalidateTag` no se invoca en alguna ruta.
- **R3**: migración de imágenes de Sanity assets a Vercel Blob → posible 404 en
  URLs viejas si quedan referencias en caché. Mitigación: cutover atómico.
- **R4**: Server Actions + Prisma + RSC consumen RAM en cold start de Vercel
  serverless; vigilar size del bundle.

## Open Questions

- **Q1**: ¿NextAuth v5 (beta estable) o Lucia? — **Default propuesto: NextAuth v5**
  por integración nativa con Vercel y soporte de magic-link via Resend.
- **Q2**: ¿Necesitamos historial/undo a nivel de página? — Fuera de scope; se
  recomienda anotar en backlog.
- **Q3**: ¿Permitir secciones "globales" (compartidas entre páginas)? — No en v1;
  cada página tiene sus secciones embebidas.
- **Q4**: ¿Multi-idioma? — No en v1. El schema deja un campo `locale` opcional
  por si se activa después.
