# Data model 002 — Prisma schema

Postgres en Neon. ORM Prisma. Toda la persistencia (auth, contenido, media) en
la misma DB.

## Entidades

### `Page`
Una página pública del sitio.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | `cuid` PK | |
| `slug` | `text UNIQUE` | `"home"`, `"quienes-somos"`, etc. Para `/` usar `"home"`. |
| `title` | `text` | Nombre interno para el admin |
| `seoTitle` | `text?` | `<title>` |
| `seoDescription` | `text?` | meta description |
| `published` | `boolean` | default `true` |
| `createdAt` / `updatedAt` | `timestamptz` | |

Relación: `sections Section[]`.

### `Section`
Una sección dentro de una página. El renderer del sitio público mapea
`type → registry[type].render(data)`.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | `cuid` PK | |
| `pageId` | `fk Page` | `onDelete: Cascade` |
| `type` | `text` | clave del registry (`"hero_slider"`, `"service_grid"`, ...) |
| `data` | `jsonb` | props tipados según `schema.ts` de cada sección |
| `order` | `int` | usado para sortear; reordenar = actualizar este campo |
| `enabled` | `boolean` | default `true` — ocultar sin borrar |
| `createdAt` / `updatedAt` | `timestamptz` | |

Index compuesto: `(pageId, order)`.

### `MediaAsset`
Imágenes subidas via admin a Vercel Blob.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | `cuid` PK | |
| `url` | `text` | URL pública de Blob |
| `pathname` | `text` | key en Blob (para delete) |
| `width` / `height` | `int?` | |
| `size` | `int` | bytes |
| `mime` | `text` | |
| `alt` | `text?` | accesibilidad |
| `uploadedBy` | `fk User?` | |
| `createdAt` | `timestamptz` | |

### `SiteSettings`
Singleton (fila única, `id = 1`).

| Campo | Tipo | Notas |
|---|---|---|
| `id` | `int PK` | always `1` (CHECK constraint) |
| `name` | `text` | "CETIP" |
| `fullName` | `text` | |
| `tagline` | `text` | |
| `description` | `text` | |
| `address` | `text` | |
| `phoneDisplay` | `text` | |
| `phoneTel` | `text` | E.164 |
| `whatsappNumber` | `text` | |
| `whatsappMessage` | `text` | |
| `email` | `text` | |
| `hours` | `text` | |
| `socials` | `jsonb` | `{ instagram, facebook, ... }` |
| `mapsEmbed` | `text` | |

### `Professional` (ex `profesional` de Sanity)

| Campo | Tipo |
|---|---|
| `id` | cuid PK |
| `nombre` | text |
| `rol` | text |
| `disciplina` | text |
| `descripcion` | text? |
| `fotoAssetId` | fk MediaAsset? |
| `orden` | int |
| `visible` | boolean |

### `Workshop` (ex `taller`)

| Campo | Tipo |
|---|---|
| `id` | cuid PK |
| `titulo` | text |
| `dia` | text |
| `horario` | text |
| `destinatarios` | text |
| `descripcion` | text |
| `visible` | boolean |
| `orden` | int |

### `JobOpening` (ex `busqueda`)

| Campo | Tipo |
|---|---|
| `id` | cuid PK |
| `titulo` | text |
| `area` | text |
| `modalidad` | text |
| `jornada` | text |
| `descripcion` | text |
| `activa` | boolean |
| `orden` | int |

### Auth tables (NextAuth/Auth.js)

`User`, `Account`, `Session`, `VerificationToken` — schema estándar del adaptor
Prisma de Auth.js. `User.role` = `"admin"` (enum sigue siendo `text` por simplicidad).

Whitelist de emails permitidos: tabla `AllowedEmail { email PK }`. Sign-in
rechaza si el email no está en la whitelist.

## Prisma schema (esqueleto)

```prisma
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql"; url = env("DATABASE_URL") }

model Page {
  id              String     @id @default(cuid())
  slug            String     @unique
  title           String
  seoTitle        String?
  seoDescription  String?
  published       Boolean    @default(true)
  sections        Section[]
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
}

model Section {
  id        String   @id @default(cuid())
  pageId    String
  page      Page     @relation(fields: [pageId], references: [id], onDelete: Cascade)
  type      String
  data      Json
  order     Int
  enabled   Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@index([pageId, order])
}

model MediaAsset {
  id          String   @id @default(cuid())
  url         String
  pathname    String
  width       Int?
  height      Int?
  size        Int
  mime        String
  alt         String?
  uploadedBy  String?
  uploader    User?    @relation(fields: [uploadedBy], references: [id])
  createdAt   DateTime @default(now())
}

model SiteSettings {
  id              Int    @id @default(1)
  name            String
  fullName        String
  tagline         String
  description     String
  address         String
  phoneDisplay    String
  phoneTel        String
  whatsappNumber  String
  whatsappMessage String
  email           String
  hours           String
  socials         Json
  mapsEmbed       String
}

// (Professional, Workshop, JobOpening, User, Account, Session, VerificationToken, AllowedEmail)
```

## Invariantes

- Una `Page` con `slug = "home"` siempre existe (semilla obligatoria).
- `SiteSettings` siempre tiene exactamente una fila.
- `Section.data` debe pasar `registry[type].schema.parse(data)` en cada server
  action — la base no lo enforza.
- Index `(pageId, order)` no es `UNIQUE`: dos secciones pueden tener mismo `order`
  transitoriamente durante un reorder; se resuelve en la transacción de la action.

## Tags de revalidación

| Tag | Disparado por |
|---|---|
| `page:<slug>` | Cualquier mutación sobre `Page` o sus `Section` |
| `site-settings` | Mutación de `SiteSettings` |
| `professionals` | CRUD de `Professional` |
| `workshops` | CRUD de `Workshop` |
| `job-openings` | CRUD de `JobOpening` |
