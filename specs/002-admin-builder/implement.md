# Implement 002 — Log vivo de implementación

Log de progreso real (en orden cronológico inverso, último arriba). Cada entrada
referencia tareas de `tasks.md` y commits.

## Bloqueadores activos

- **F0.B** — Requiere que el usuario provisione Neon Postgres en Vercel
  Marketplace y setee:
  - `DATABASE_URL`
  - `BLOB_READ_WRITE_TOKEN`
  - `AUTH_SECRET` (`openssl rand -hex 32`)
  - `RESEND_API_KEY`
  - `REVALIDATE_SECRET` (`openssl rand -hex 32`)
  - `AUTH_URL=https://<dominio>`

  Mientras tanto se puede progresar en F0.1, F0.3, F0.4, F1.1 (offline).
  Migrate/seed quedan pendientes hasta tener `DATABASE_URL`.

## Sesión 1 — 2026-06-10 (en curso)

### Decisiones tomadas en sesión
- Mantener `legacy-peer-deps` durante toda la migración (se quita en F7).
- Auth.js v5 vía paquete `next-auth@beta` + `@auth/prisma-adapter`.
- Vitest jsdom para componentes; node para Prisma.

### Hecho

- **F0.1** Deps instaladas. Nota: **Prisma bajó a v6** (la v7 mete `url` en `prisma.config.ts` con driver adapter — complejidad innecesaria por ahora). **Vitest bajó a v3** + `@vitejs/plugin-react@5` (v6 incompatible con vite resuelto por vitest 4).
- **F0.2** `.env.example` creado. `.env*.local` ya estaba en `.gitignore`.
- **F0.3** `prisma/schema.prisma` con datasource Postgres + generator; `lib/db.ts` con singleton; scripts npm `db:*`, `test`, `test:e2e`, `postinstall: prisma generate`.
- **F0.4** `vitest.config.ts` jsdom + alias `@`; `playwright.config.ts` con `webServer`; smoke tests verdes (`vitest run` OK).
- **F1.1** Schema Prisma completo con Page/Section/MediaAsset/SiteSettings/Professional/Workshop/JobOpening/User/Account/Session/VerificationToken/AllowedEmail. `prisma validate` OK.
- **F1.2** `prisma/seed.ts` con SiteSettings desde `lib/site.ts`, 11 Pages base (una por ruta pública), 1 AllowedEmail. `tsc --noEmit` limpio.

### Riesgo encontrado

- **Node v20.19.0** local; `package.json` declara `engines.node >=22.12`. Algunos paquetes Sanity y Prisma loggean warning. Vercel corre Node 22 → no afecta prod, pero `npm run dev` puede ser inestable. **Acción**: usar `nvm use 22` o aceptar warnings hasta F7 (decom Sanity).

### Bloqueado

- **F0.B** (provisión Neon + env vars) — sin esto no se puede correr `prisma migrate dev` ni `db:seed`. Todo lo que sigue (F2 sí se puede arrancar offline; F3+ necesita DB).

### F2 — Registry de secciones (home)

- **F2.1** `components/sections/HeroSlider/` con `schema.ts` (Zod) + `render.tsx` (props tipadas, "use client") + `editor.tsx` (metadata) + `index.ts`. `components/HeroSlider.tsx` queda como wrapper que aplica `HeroSliderDefaults` — visual idéntico, sin cambios en `app/page.tsx`.
- **F2.2** Mismo patrón para `ServiceGrid`, `AboutPreview`, `FeaturedStrip`. ServiceGrid usa un `iconMap` interno (icons como string enum en el schema) para evitar pasar componentes en JSON.
- **F2.3** `lib/sections-types.ts` con tipos `FieldDef / FieldGroup / SectionEditorMeta / SectionDef`. `lib/sections.ts` con `registry` tipado vía `satisfies Record<string, SectionDef>`. Expone `getSection(type)` y `listSectionTypes()`.
- **F2.5** `tests/sections.test.ts` — 11 tests verdes (shape consistente + `defaults` validan contra el `schema` de cada entry).

**Verificaciones**:
- `npx tsc --noEmit` limpio.
- `npx vitest run` → 12 tests passed.
- `npm run build` → 16 rutas estáticas; mismo output que pre-refactor.

### Decisiones tomadas en F2

- **Icons → string enum + iconMap interno**. No serializamos componentes React. Si se quiere agregar un ícono nuevo, hay que tocar código (acceptable v1).
- **Wrapper de compat** (`components/HeroSlider.tsx` etc.) en vez de actualizar `app/page.tsx` ya. F3 elimina los wrappers cuando los `page.tsx` lean de DB.
- **`SectionDef.render: ComponentType<any>`**. Mantener el genérico exacto rompía contravariance en el `satisfies`. Compromiso aceptado — la validación real ya la hace `schema.parse()` en runtime antes de pasar las props.

### F2.4 — Secciones de páginas internas

- 5 secciones presentacionales refactorizadas con el mismo patrón: `PageHero`, `QuienesSomos`, `Espacio`, `Contacto`, `RRHH`.
- **Decisión**: `Equipo` y `BusquedasActivas` quedan fuera de F2.4 porque no encajan en el modelo "section.data JSONB" — renderizan colecciones. Se reintroducen en F3.4 como `team_list` / `job_openings_list`.

### F3 — Render público desde DB (con fallback)

- **F3.1** `lib/content.ts` con `getPageBySlug(slug)` cacheado (`unstable_cache` + tag `page:<slug>`) + `parseSectionData(type, data)` que valida JSONB contra el schema del registry. Si la sección no parsea, se loggea y se skipea (no rompe la página).
- **F3.2** `<PageRenderer slug fallback>` (Server Component async): intenta DB, si la DB está caída o no hay secciones, renderiza `fallback`. Cada `app/**/page.tsx` público pasó a ser un wrapper:
  ```tsx
  <PageRenderer slug="quienes-somos" fallback={<>... composición actual ...</>} />
  ```
  Resultado: el sitio sigue idéntico hoy (DB vacía → fallback) y cuando admin pueble la página, el contenido viene de DB sin tocar código.
- **F3.3** `lib/site-settings.ts` con `getSiteSettings()` cacheado (tag `site-settings`) y `waLinkFor(number, message)`. `TopBar`, `Footer`, `FloatingWhatsapp` reescritos como Server Components async que leen de DB con fallback a `lib/site.ts`. `Header` no se toca — solo usa `lib/nav.ts`.
- **F3.4** Patrón "collection-as-section":
  - `lib/collections.ts` con `getProfessionals` / `getJobOpenings` / `getWorkshops` (cacheados, con fallback a arrays hardcodeados de `Equipo.tsx` y `BusquedasActivas.tsx`).
  - Section types `team_list` y `job_openings_list` cuyo schema solo guarda settings (eyebrow/title/intro); el `render.tsx` es async y lee la colección de DB.
  - Wrappers de compat: `components/Equipo.tsx` y `components/BusquedasActivas.tsx` quedan como thin wrappers.

### Verificaciones F2.4 + F3

- `npx tsc --noEmit` ✓
- `npx vitest run` → **26 tests passed** (todos los `defaults` de los 11 section types validan contra su schema).
- `npm run build` → 16 rutas estáticas, sin errores. Los wrappers de Sanity en `Equipo`/`BusquedasActivas` quedaron reemplazados por los renderers DB-backed (con fallback a Unsplash si DB vacía).

### Estado del registry (11 section types)

`hero_slider`, `service_grid`, `about_preview`, `featured_strip`, `page_hero`, `quienes_somos`, `espacio`, `contacto`, `rrhh`, `team_list`, `job_openings_list`.

### Tags de revalidación definidos

- `page:<slug>` — por página.
- `site-settings` — TopBar/Footer/FloatingWhatsapp.
- `professionals`, `workshops`, `job-openings` — colecciones.

### F4 — Server actions CRUD

- **F4.1** `lib/auth-server.ts` (`requireAdmin()` con `AuthError`) + `lib/actions.ts` (`ActionResult<T>`, `ok/fail`, `runAction`, `revalidate(...tags)`).
- **F4.2** `app/admin/_actions/pages.ts` — list/create/update/delete. No permite borrar `slug="home"`. Maneja `P2002` (slug duplicado) como `CONFLICT`. Slug validado con regex.
- **F4.3** `app/admin/_actions/sections.ts` — add (con orden insertable), update (validado por `registry[type].schema`), reorder (two-phase con ordinales negativos para evitar colisiones), toggle, delete (compacta orden tras borrar). `listSectionCatalog()` para la paleta.
- **F4.4** `app/admin/_actions/media.ts` — `uploadMediaAsset` recibe data URL base64 + sube a Vercel Blob + persiste `MediaAsset`. Cap 20 MB. `updateAssetAlt`, `deleteAsset` (con best-effort blob delete), `listMediaAssets`.
- **F4.5** `_actions/settings.ts` (`updateSiteSettings` valida + revalida `site-settings`), `_actions/collections.ts` (CRUD para Professional/Workshop/JobOpening, cada uno revalida su tag).
- **F4.6** `/api/revalidate` reescrito: `POST {tags: string[]}` con header `x-revalidate-secret`. Whitelist de prefijos de tags conocidos. Devuelve `{accepted, rejected}`.

### F5 — Auth + Admin shell

- **F5.1** `auth.ts` raíz con NextAuth v5 + `PrismaAdapter(db)` + provider `Resend` (magic-link). Sign-in **whitelist** vía `AllowedEmail` table. Session callback inyecta `id` y `role`. `app/api/auth/[...nextauth]/route.ts` reexporta handlers. `middleware.ts` protege `/admin/*` (excepto `/admin/login`).
- **F5.2** `components/admin/AdminShell.tsx` (server) con sidebar (Páginas/Media/Equipo/Talleres/Búsquedas/Configuración) + topbar con email + logout (Server Action). `PageDesktopOnlyHint` para mobile. `app/admin/layout.tsx` valida sesión y deja pasar `/admin/login` sin shell.
- **F5.3** `app/admin/page.tsx` — dashboard server-rendered que llama `listPages()`, muestra tabla con slug/secciones/updatedAt y botón "Nueva página".
- `app/admin/login/page.tsx` — formulario magic-link que dispara `signIn("resend", ...)` por Server Action.

### Verificaciones F4+F5

- `tsc --noEmit` ✓
- `npm run build` con `AUTH_SECRET=dev-only-build-secret` y `SKIP_ENV_VALIDATION=1` → verde. Rutas nuevas detectadas correctamente:
  - `ƒ /admin`
  - `ƒ /admin/login`
  - `ƒ /api/auth/[...nextauth]`
  - `ƒ /api/revalidate` (refactor)
  - `ƒ Middleware` (34 kB)
- Todas las páginas públicas siguen siendo `○ Static` con fallback.

### Decisiones tomadas en F4/F5

- **Whitelist de auth via tabla `AllowedEmail`** en vez de env var. Permite al equipo agregar emails sin redeploy (vía `prisma studio` mientras no haya UI de users, futuro F+).
- **Session strategy: "database"** (sessions persistidas en Postgres). Más simple para multi-instance Vercel y para invalidar manualmente.
- **`uploadMediaAsset` por data URL** en vez de `requestUploadUrl + clientPut` directo. Más simple para empezar; pierde el "stream directo a Blob desde el browser" pero gana implementación trivial. Anotado para optimizar en v2.
- **Two-phase reorder** (ordinales `-1` intermedios) — evita problemas si el índice se vuelve `UNIQUE` en el futuro.
- **`/api/revalidate` con whitelist de tags** — protección contra invalidación arbitraria.
- **AdminShell desktop-first** — banner en mobile que recomienda escritorio.

### F5.4–F5.7 — Admin UI completo

- **F5.4** Editor `/admin/pages/[id]`:
  - `components/admin/fields/FieldRenderer.tsx` — render dinámico por `field.kind` (`text`, `textarea`, `number`, `boolean`, `select`, `image`, `link`, `color`, `array`). `ArrayField` con add/remove + reorder ↑↓ y caso especial para arrays de strings.
  - `components/admin/SectionCard.tsx` — card sortable con drag handle, toggle visibilidad, delete.
  - `components/admin/SectionPalette.tsx` — catálogo de tipos con click para agregar.
  - `components/admin/Inspector.tsx` — form generado desde `editor.fieldGroups` + botón guardar.
  - `components/admin/PageEditor.tsx` (client) — orquesta DndContext/SortableContext de `@dnd-kit`, estado optimista, errores inline, feedback toast.
  - `app/admin/pages/[id]/page.tsx` (server) — carga page + sections, pasa catalog completo (con editor metadata) al cliente.
- **F5.4b** `app/admin/pages/new/page.tsx` — form simple con Server Action `createPage`. Slug validado por regex en el cliente y en la action.
- **F5.5** `components/admin/MediaLibrary.tsx` — upload multi-archivo (data URL → server action → Vercel Blob), grid de assets, edit alt on-blur, copy URL al clipboard, delete con confirm. `app/admin/media/page.tsx` lo monta.
- **F5.6** `components/admin/SettingsForm.tsx` — form completo de `SiteSettings` con errores por campo + revalidación del tag `site-settings`.
- **F5.7** `components/admin/CollectionAdmin.tsx` — componente genérico (drives) para los 3 CRUDs: lista editable inline + form de creación + delete con confirm. Tres páginas (`professionals`, `workshops`, `job-openings`) lo instancian con sus `ColumnDef[]` y bindings a las server actions.

### Decisiones tomadas en F5.4–F5.7

- **Add section sin id real**: agregar dispara la action y muestra "recargá para ver". Optimistic full sync requiere devolver el row creado completo; simplificable después pero no bloqueante.
- **Array reorder con ↑↓** dentro del Inspector en vez de dnd anidado. Más simple, accesible por teclado nativo.
- **ImageField sin picker modal**: input de URL + preview. El usuario sube en `/admin/media`, copia URL, pega acá. v2 puede meter el picker modal sin cambiar el contrato.
- **CollectionAdmin genérico** (~200 LOC) ahorra ~600 LOC vs 3 forms separados. Pierde control fino sobre validation messages por campo — aceptable.
- **`fotoAssetId` como texto libre** en el CRUD de professionals. v2: dropdown con MediaAsset autocomplete.
- **Bug encontrado y resuelto**: `"use server"` files NO pueden exportar funciones síncronas. Saqué `listSectionCatalog` de `_actions/sections.ts` (no se usaba al final — el server component pasa el catalog directo al cliente).

### Estado final del admin

9 rutas funcionales (todas detrás del middleware de auth):
| Ruta | Función |
|---|---|
| `/admin/login` | Magic-link (Resend) |
| `/admin` | Dashboard con lista de páginas |
| `/admin/pages/new` | Crear página |
| `/admin/pages/[id]` | **Editor con drag-and-drop** |
| `/admin/media` | Media library (upload Vercel Blob) |
| `/admin/settings` | Datos institucionales |
| `/admin/professionals` | CRUD equipo |
| `/admin/workshops` | CRUD talleres |
| `/admin/job-openings` | CRUD búsquedas |

### Verificación final

- `tsc --noEmit` ✓
- `vitest run` → 26 tests passed
- `npm run build` → 25 rutas (16 públicas + 9 admin) + middleware 34 kB. Editor pesa 19.7 kB (con dnd-kit).

### Pendiente para llegar a producción

- **F0.B** (provisión Neon + envs + `db:migrate && db:seed`) — bloqueador del usuario.
- **F5.8** E2E Playwright (opcional para v1).
- **F6** Smoke test post-cutover.
- **F7** Decomisionar Sanity (`npm uninstall sanity @sanity/* next-sanity`, borrar `sanity/`, `sanity.config.ts`, `sanity.cli.ts`, env vars `SANITY_*`). Recomendado solo después de validar que el admin funciona en prod.
