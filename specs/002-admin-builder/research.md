# Research 002 — Decisiones técnicas

Cada decisión registra: **opción elegida**, **alternativas evaluadas**,
**razón** y **trade-offs**.

## D1 — Publicación: DB + ISR (`revalidateTag`)

**Elegida**: contenido en Neon Postgres, sitio público con `unstable_cache` +
`revalidateTag("page:<slug>")` al publicar.

**Alternativas**:
- *Deploy hook a Vercel cada publicación* — descartado: 1–2 min de latencia y
  cuota de build.
- *Commit JSON a git con GitHub App* — descartado: complejidad de permisos y
  ruido en historial.

**Trade-off**: el sitio público depende de Postgres en runtime (cold path).
Mitigado con cache y Neon serverless driver.

## D2 — DB: Neon Postgres

**Elegida**: Neon vía Vercel Marketplace.

**Alternativas**:
- *Supabase* — descartado: solapa con NextAuth/Blob que ya tenemos.
- *Vercel Postgres directo* — corre sobre Neon de todos modos.
- *SQLite + Turso* — descartado: ecosistema Prisma menos pulido y dudas de
  consistencia para escrituras desde el admin.

**Trade-off**: dependencia de Neon (vendor); mitigado por compatibilidad
Postgres estándar — moverse a otro provider es un cambio de connection string.

## D3 — ORM: Prisma

**Elegida**: Prisma 5.

**Alternativas**:
- *Drizzle* — más liviano y SQL-first; descartado por curva de adopción del equipo.
- *Kysely* — buena ergonomía pero migrations menos batteries-included.

**Trade-off**: bundle size mayor; aceptable para una app server-heavy.

## D4 — Auth: NextAuth v5 con magic-link (Resend)

**Elegida**: Auth.js v5 con `EmailProvider` apuntando a Resend.

**Alternativas**:
- *Clerk* — descartado por costo y over-engineering para 3 usuarios.
- *Lucia* — librería sólida pero menos integrada con RSC/middleware de Next 15.
- *Password tradicional* — más fricción para el equipo CETIP, riesgo de
  reuso/leak de contraseñas.

**Trade-off**: emails pueden caer en spam (R6). Dominio verificado mitiga.

## D5 — Drag-and-drop: `@dnd-kit`

**Elegida**: `@dnd-kit/core` + `@dnd-kit/sortable`.

**Alternativas**:
- *react-beautiful-dnd* — abandonado, sin soporte React 19.
- *react-dnd* — más bajo nivel; más boilerplate.
- *framer-motion `Reorder`* — válido pero menos control sobre handles/overlays.

**Trade-off**: ninguno significativo. Cumple ARIA y soporte teclado.

## D6 — Storage de imágenes: Vercel Blob

**Elegida**: Vercel Blob con uploads firmados desde el cliente.

**Alternativas**:
- *Cloudinary* — feature-rich (transforms) pero plan free limitado.
- *S3 + CloudFront propio* — más control, más operativa.
- *UploadThing* — opción razonable; descartado por concentrar todo en Vercel.

**Trade-off**: sin transformaciones automáticas; resolvemos con `next/image`.

## D7 — Validación: Zod

**Elegida**: Zod compartido entre schema de sección, server action y editor.

**Alternativas**:
- *Valibot* — más liviano pero ecosistema menor.
- *Yup* — declinante, peor inferencia TS.

**Trade-off**: bundle ligeramente mayor; vale por DX.

## D8 — Modelo de contenido: secciones tipadas

**Elegida**: una página = lista ordenada de `Section { type, data: JSONB, order }`.
Cada `type` referencia una entrada del registry con su `schema` Zod.

**Alternativas**:
- *Bloques anidados estilo Notion/Editor.js* — descartado, complejidad excesiva
  para el caso de uso.
- *Documentos por página con campos fijos* (como Sanity hoy) — rígido para
  "agregar secciones nuevas" que es un requirement explícito.

**Trade-off**: `data` JSONB no tiene constraints SQL → toda la integridad la da
Zod en server actions. Asumido.

## D9 — Cómo dibujamos el editor

**Elegida**: WYSIWYG **parcial** — paleta lateral con tipos, canvas central con
cards (no preview pixel-perfect), formularios por sección al hacer click.
Botón "Ver en sitio" abre `/` en tab nueva.

**Alternativas**:
- *Preview iframe lado a lado* (estilo Sanity Presentation Tool) — más vistoso
  pero requiere coordinar draftMode + state sync; **anotado para v2**.
- *Edición inline sobre el sitio real* — máximo deseo pero ingenio para v1.

**Trade-off**: editor menos visual que Sanity. Compensado con drag-and-drop real
y campos claros. Si en producción se reclama preview live → v2 con iframe.

## D10 — Migración de datos

**Elegida**: script one-shot `scripts/migrate-from-sanity.ts` ejecutado en F6.
Lee dataset export tar.gz (T7 de spec 001), mapea según `data-model.md`,
inserta en Postgres. Imágenes: descarga + re-upload a Blob.

**Alternativas**:
- *Manual via admin* — descartado, 12 singletons + colecciones es mucho trabajo.

**Trade-off**: el script es código de un solo uso. Aceptable; vive en `scripts/`.

## Decisiones diferidas (v2)

- Historial / undo a nivel de página.
- Preview iframe live.
- Multi-idioma.
- Roles más granulares.
- Comments / review workflow.
