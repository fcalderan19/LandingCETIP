# Tasks 002 — Implementación del admin builder

Las tareas siguen el orden de fases del `plan.md`. Cada una tiene
**acceptance**, **verify** y **files** estimados. No avanzar a la siguiente
fase hasta cerrar todas las de la actual.

---

## F0 — Setup

- [ ] **T0.1 — Instalar dependencias**
  - Acceptance: `package.json` incluye Prisma, Auth.js v5, Vercel Blob, dnd-kit,
    Zod, Resend, Vitest, Playwright. `npm install` corre sin errores.
  - Verify: `npm ls prisma @auth/core @vercel/blob @dnd-kit/core zod`.
  - Files: `package.json`, `package-lock.json`.

- [ ] **T0.2 — Provisionar Neon + setear env vars**
  - Acceptance: `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `AUTH_SECRET`,
    `RESEND_API_KEY`, `REVALIDATE_SECRET` cargadas en Vercel y `.env.local`.
  - Verify: `psql $DATABASE_URL -c "select 1"` (o `prisma db push --preview-feature`).
  - Files: `.env.example`.

- [ ] **T0.3 — Configurar Prisma + cliente DB**
  - Acceptance: `prisma/schema.prisma` minimo con datasource; `lib/db.ts` exporta
    singleton compatible con Edge runtime.
  - Verify: `npx prisma validate` OK.
  - Files: `prisma/schema.prisma`, `lib/db.ts`.

- [ ] **T0.4 — Configurar Vitest + Playwright**
  - Acceptance: `npm test` corre 1 test trivial; `npm run test:e2e` levanta browser.
  - Verify: ambos comandos terminan en verde.
  - Files: `vitest.config.ts`, `playwright.config.ts`, `tests/smoke.test.ts`.

---

## F1 — DB + schema

- [ ] **T1.1 — Modelos completos en Prisma**
  - Acceptance: schema cubre todo lo de `data-model.md`.
  - Verify: `npx prisma migrate dev --name init`.
  - Files: `prisma/schema.prisma`, `prisma/migrations/*`.

- [ ] **T1.2 — Seed mínimo**
  - Acceptance: `npm run db:seed` crea `Page("home")` vacía, `SiteSettings` con
    valores de `lib/site.ts`, y 1 `AllowedEmail` con el email del fundador.
  - Verify: `prisma studio` muestra los registros.
  - Files: `prisma/seed.ts`, `package.json` script.

- [ ] **T1.3 — Script de migración Sanity → Postgres**
  - Acceptance: `tsx scripts/migrate-from-sanity.ts ./backup.tar.gz` puebla todas
    las tablas. Imágenes descargadas y re-subidas a Blob; URLs reemplazadas en
    el `data` JSON de cada Section.
  - Verify: contar registros en Postgres = contar en backup.
  - Files: `scripts/migrate-from-sanity.ts`.

---

## F2 — Registry de secciones

> Una task por componente. Patrón consistente. Hacer **en serie** para mantener
> la build verde entre cada commit.

- [ ] **T2.1 — Crear `components/sections/HeroSlider/`**
  - Acceptance: `schema.ts`, `render.tsx`, `editor.tsx`, `index.ts`. `render.tsx`
    recibe props parseadas; comportamiento visual idéntico a hoy.
  - Verify: `/` se ve igual antes/después (visual diff manual). Test unit del
    schema con fixtures.
  - Files: `components/sections/HeroSlider/*`, `components/HeroSlider.tsx`
    (eliminar al final).

- [ ] **T2.2 — Refactor de `ServiceGrid`, `AboutPreview`, `FeaturedStrip`** (idem T2.1)

- [ ] **T2.3 — Refactor de secciones de páginas internas** (`PageHero`,
  `QuienesSomos`, `Espacio`, `Equipo`, `Contacto`, `RRHH`, `BusquedasActivas`)

- [ ] **T2.4 — `lib/sections.ts` con registry tipado**
  - Acceptance: export `registry` con todos los tipos. Type-safe lookup.
  - Verify: tests de registry (todos cumplen `{ schema, render, editor, label }`).
  - Files: `lib/sections.ts`, `tests/sections.test.ts`.

---

## F3 — Render público desde DB

- [ ] **T3.1 — `lib/content.ts` con `getPageBySlug`**
  - Acceptance: usa `unstable_cache` + tag `page:<slug>`. Devuelve `{ page, sections }`.
  - Verify: test unit con DB de test.
  - Files: `lib/content.ts`.

- [ ] **T3.2 — `<PageRenderer slug>` y wrapper en cada `page.tsx` público**
  - Acceptance: home y todas las páginas usan el renderer.
  - Verify: el sitio sigue siendo navegable y los textos vienen de DB
    (cambiarlos en `prisma studio` se refleja tras `revalidateTag`).
  - Files: `components/PageRenderer.tsx`, todos los `app/**/page.tsx` públicos.

- [ ] **T3.3 — Migrar `SiteSettings` consumers**
  - Acceptance: `TopBar`, `Header`, `Footer`, `FloatingWhatsapp` leen de DB
    (cacheado con tag `site-settings`).
  - Verify: cambio en DB → refresh tras `revalidateTag`.
  - Files: componentes globales + `lib/site.ts` (queda como fallback o se borra).

---

## F4 — Server actions CRUD

- [ ] **T4.1 — Helper `requireAdmin()` + `withRevalidation()`**
  - Files: `lib/auth.ts`, `lib/actions.ts`.

- [ ] **T4.2 — `_actions/pages.ts` (create/rename/delete/list)**
  - Acceptance: cumple contratos de `contracts.md`. No permite borrar `slug="home"`.
  - Verify: tests Vitest contra DB de test.

- [ ] **T4.3 — `_actions/sections.ts` (add/update/reorder/toggle/delete)**
  - Acceptance: validan con `registry[type].schema`. Reorder en transacción.
  - Verify: tests, incluido caso de reorder concurrente.

- [ ] **T4.4 — `_actions/media.ts` + endpoint `/api/upload/sign`**
  - Acceptance: flujo `requestUploadUrl` → upload a Blob → `confirmUpload`.
  - Verify: test que sube una imagen pequeña.

- [ ] **T4.5 — `_actions/settings.ts` y `_actions/collections.ts`**

- [ ] **T4.6 — Refactor de `/api/revalidate`**
  - Acceptance: nuevo body `{ tags: string[] }` con secret propio.
  - Verify: curl con/sin secret válido.

---

## F5 — Auth + Admin UI

- [ ] **T5.1 — NextAuth v5 con Email provider (Resend)**
  - Acceptance: `/admin/login` envía magic-link. Sign-in solo si email está en
    `AllowedEmail`.
  - Verify: test e2e Playwright (con email captura por Resend test mode).
  - Files: `app/api/auth/[...nextauth]/route.ts`, `lib/auth.ts`, `middleware.ts`.

- [ ] **T5.2 — `AdminShell` + rutas vacías de `/admin/*`**
  - Acceptance: sidebar navega; cada ruta es placeholder pero protegida.
  - Files: `app/admin/layout.tsx`, `components/admin/AdminShell.tsx`.

- [ ] **T5.3 — Dashboard `/admin`**
  - Acceptance: lista páginas con CTA "Editar". Mostrar `updatedAt`.

- [ ] **T5.4 — Editor `/admin/pages/[id]`**
  - Acceptance: canvas con DndContext + SortableContext + paleta + inspector.
    Reorder → llama `reorderSections`. Click en card → abre Inspector.
  - Verify: e2e Playwright "drag and reorder".
  - Files: `app/admin/pages/[id]/page.tsx`, `components/admin/PageEditor.tsx`,
    `components/admin/SectionPalette.tsx`, `components/admin/Inspector.tsx`.

- [ ] **T5.5 — Fields dinámicos**
  - Acceptance: `TextField`, `TextareaField`, `NumberField`, `SelectField`,
    `ImageField`, `ArrayField`, `LinkField`, `ColorField`.
  - Verify: unit tests por field + lint.
  - Files: `components/admin/fields/*`.

- [ ] **T5.6 — Media library `/admin/media`**
  - Acceptance: grid + upload + edit alt + delete (bloqueado si en uso).
  - Verify: e2e "subir imagen y usarla en una sección".

- [ ] **T5.7 — `/admin/settings`, `/admin/professionals`, `/admin/workshops`,
  `/admin/job-openings`**
  - Acceptance: CRUDs estándar.

- [ ] **T5.8 — Tests E2E críticos**
  - Acceptance: 3 specs Playwright pasan en CI.
  - Verify: GitHub Actions verde.
  - Files: `tests/e2e/*`.

---

## F6 — Cutover

- [ ] **T6.1 — Pre-cutover: rerun script con dataset fresco**
- [ ] **T6.2 — Habilitar flag `USE_DB_CONTENT=true` en Vercel prod**
- [ ] **T6.3 — Smoke test manual de todas las rutas públicas**
  - Acceptance: ninguna ruta 500/404; textos coinciden con la versión Sanity.
- [ ] **T6.4 — Monitor 24 h**: Vercel Analytics, Sentry/logs.

---

## F7 — Decomisionar Sanity

- [ ] **T7.1 — Quitar deps**
  - Acceptance: `npm uninstall sanity @sanity/* next-sanity` ejecutado.
  - Verify: `grep -r "@sanity" package.json` vacío.

- [ ] **T7.2 — Borrar archivos**
  - Acceptance: `sanity/`, `sanity.config.ts`, `sanity.cli.ts` eliminados.
  - Verify: `git status` muestra deletions.

- [ ] **T7.3 — Quitar env vars `SANITY_*` de Vercel**

- [ ] **T7.4 — Limpiar `next.config.mjs`**
  - Acceptance: remoto Sanity de `images.remotePatterns` removido si ya no hace
    falta. `legacy-peer-deps` revisado.

- [ ] **T7.5 — Actualizar README**
  - Acceptance: refleja stack nuevo. Sección "Cómo editar contenido" apunta a `/admin`.

---

## Definition of Done (toda la feature)

- [ ] Todos los success criteria S1–S8 de `spec.md` cumplidos.
- [ ] Tests CI verdes.
- [ ] 0 referencias a Sanity en el código.
- [ ] Equipo CETIP entrenado en el admin (1 sesión de 30 min documentada).
- [ ] Backup automático nightly de Postgres configurado.
- [ ] Tag git `release-admin-v1` creado.
