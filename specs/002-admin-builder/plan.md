# Plan 002 — Migración Sanity → Admin propio

## Estrategia general

**Migración en fases con feature flag** para poder revertir cualquier fase sin
romper producción. Cutover atómico al final.

```
F0 Setup ─→ F1 DB+Schema ─→ F2 Registry de secciones ─→ F3 Render desde DB
                                                              │
F7 Decom Sanity ←─ F6 Cutover ←─ F5 Auth+Admin UI ←─ F4 Server actions CRUD
```

Cada fase tiene un **checkpoint verificable** antes de pasar a la siguiente.

## Fases

### F0 — Setup (1 sesión)
- Instalar deps: `prisma @prisma/client neondatabase/serverless @auth/core @auth/prisma-adapter @vercel/blob @dnd-kit/core @dnd-kit/sortable zod resend vitest @playwright/test`.
- Crear `prisma/schema.prisma` vacío + `lib/db.ts`.
- Provisionar Neon Postgres en Vercel Marketplace. Setear `DATABASE_URL` en Vercel + `.env.local`.
- Setear `BLOB_READ_WRITE_TOKEN`, `AUTH_SECRET`, `RESEND_API_KEY`.
- **Checkpoint**: `npx prisma db push` contra Neon devuelve OK.

### F1 — DB + schema (1 sesión)
- Implementar modelos `Page`, `Section`, `MediaAsset`, `SiteSettings`,
  `Professional`, `Workshop`, `JobOpening`, `User`, `Session`, `VerificationToken`
  (ver `data-model.md`).
- `prisma migrate dev --name init`.
- Script `scripts/migrate-from-sanity.ts` que lea el dataset exportado en
  T7 de la spec 001 y popule la DB.
- **Checkpoint**: `npm run db:studio` muestra todas las tablas con datos seeded.

### F2 — Registry de secciones (1-2 sesiones)
- Por cada componente actual (`HeroSlider`, `ServiceGrid`, `AboutPreview`,
  `FeaturedStrip`, `PageHero`, `QuienesSomos`, `Equipo`, `Espacio`, `Contacto`,
  `RRHH`, `BusquedasActivas`):
  - Crear carpeta `components/sections/<Name>/`.
  - Mover el JSX renderable a `render.tsx`.
  - Extraer props hardcoded a `schema.ts` (Zod) y tomarlos como argumento.
  - Mantener el comportamiento visual idéntico.
- `lib/sections.ts` exporta un `registry: Record<string, { schema, render, editor, label, icon }>`.
- **Checkpoint**: `/` sigue viéndose igual (test visual manual) pero ahora los
  componentes reciben props en vez de hardcodear.

### F3 — Render público desde DB (1 sesión)
- Crear `lib/content.ts` con `getPageBySlug(slug)` que devuelve `{ sections: Section[] }`.
- Modificar `app/page.tsx` y demás rutas para mapear sections → `registry[type].render`.
- Cada query usa `unstable_cache` con tag `page:<slug>`.
- **Checkpoint**: el sitio público sirve contenido desde Neon y `revalidateTag`
  fuerza refresh. Sanity sigue disponible en paralelo pero no se consulta.

### F4 — Server actions CRUD (2 sesiones)
- `app/admin/_actions/pages.ts`: create, rename, delete.
- `app/admin/_actions/sections.ts`: add, update, reorder, delete.
- `app/admin/_actions/media.ts`: upload firmado a Vercel Blob, list, delete.
- Cada action: `revalidateTag("page:<slug>")` al final.
- **Checkpoint**: tests Vitest verdes contra Postgres test instance.

### F5 — Auth + Admin UI (3 sesiones)
- NextAuth v5 con Email provider (Resend). Tabla `User` con whitelist por email.
- Middleware protege `/admin/*`.
- UI:
  - `/admin` — lista de páginas + botón "nueva página".
  - `/admin/pages/[id]` — canvas con `@dnd-kit` (sortable) + paleta lateral.
  - `/admin/media` — grid de imágenes, drag-to-upload.
  - `/admin/settings` — formulario `SiteSettings`.
- **Checkpoint**: e2e Playwright de los 3 flujos críticos pasa.

### F6 — Cutover (1 sesión)
- Re-run de `scripts/migrate-from-sanity.ts` con dataset fresco para capturar
  cambios de último momento.
- Deploy a producción con flag `USE_DB_CONTENT=true`.
- Smoke test manual de cada ruta pública.
- **Checkpoint**: S1–S5 (success criteria) verificados en prod por 24 h.

### F7 — Decomisionar Sanity (1 sesión)
- Borrar `sanity/`, `sanity.config.ts`, `sanity.cli.ts`, `app/studio/`, env vars `SANITY_*`.
- `npm uninstall sanity @sanity/* next-sanity`.
- Quitar `legacy-peer-deps` si ya no es necesario.
- Actualizar README.
- **Checkpoint**: `grep -r "sanity" .` solo devuelve historial git / specs / changelog.

## Riesgos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| R1 — Boundary RSC/Client en editor mal cortado | Media | Alta | Separar `render.tsx` (server) de `editor.tsx` (client) por sección desde F2 |
| R2 — `revalidateTag` no se llama en alguna action | Media | Media | Helper `withRevalidation(slug, fn)` que envuelve cada action |
| R3 — Imágenes Sanity rotas en cutover | Baja | Alta | Migrar assets como parte de `scripts/migrate-from-sanity.ts`: descarga → sube a Blob → reemplaza URL |
| R4 — Cold start lento con Prisma | Media | Media | Neon serverless driver (no TCP), `prisma.$connect()` lazy |
| R5 — Drag-and-drop accesible (a11y) | Media | Baja | `@dnd-kit` ya cumple ARIA; tests manuales con teclado |
| R6 — Magic-link emails atrapados por spam | Alta | Media | Dominio verificado en Resend; fallback "reenviar" |

## Lo que **NO** se cambia en esta migración

- Componentes públicos visuales (mismo CSS, misma estructura).
- Endpoints `/api/contact`, `/api/admision`, `/api/rrhh` (siguen con `console.log`).
- Tailwind v4 tokens.
- Rutas públicas existentes.

## Checkpoints horizontales (cualquier momento)

- Build de Vercel verde.
- Lighthouse de `/` no baja de su valor pre-migración.
- 0 errores en Sentry/logs.

## Estimación

| Fase | Esfuerzo (sesiones de ~3h) |
|---|---|
| F0 | 1 |
| F1 | 1 |
| F2 | 2 |
| F3 | 1 |
| F4 | 2 |
| F5 | 3 |
| F6 | 1 |
| F7 | 1 |
| **Total** | **~12 sesiones** (≈ 36 h netas) |

Rango realista calendario: **2–3 semanas** asumiendo iteración part-time + reviews.
