# Contracts 002 — Server Actions y endpoints

Todo lo que muta contenido pasa por **Server Actions** (no API REST). Los
endpoints API solo existen para webhooks y uploads firmados.

## Convenciones

- Cada action vive en `app/admin/_actions/<recurso>.ts` con `"use server"`.
- Toda action protegida por `requireAdmin()` (helper que lee la sesión y
  rechaza si no es admin).
- Input validado con Zod.
- Output uniforme:
  ```ts
  type ActionResult<T = void> =
    | { ok: true; data: T }
    | { ok: false; error: string; fieldErrors?: Record<string, string[]> };
  ```
- Cada action que muta contenido público termina con `revalidateTag(...)`.

## `pages.ts`

### `createPage(input)`
```ts
input: { slug: string, title: string }
returns: { id, slug }
side-effects: revalidateTag(`page:${slug}`)
```

### `renamePage(id, input)`
```ts
input: { title?: string, seoTitle?: string, seoDescription?: string, published?: boolean }
```

### `deletePage(id)`
Borra la page (cascade borra sections). No permite borrar `slug = "home"`.

### `listPages()`
Read-only; no protegida por mutación pero sí por auth.

## `sections.ts`

### `addSection(pageId, input)`
```ts
input: { type: string, atIndex?: number, data?: unknown }
```
- Si `data` no se provee, usa el `defaults` del registry.
- Reasigna `order` en transacción.
- Revalida `page:<slug>`.

### `updateSection(id, input)`
```ts
input: { data: unknown }   // se valida con registry[section.type].schema
```

### `reorderSections(pageId, input)`
```ts
input: { orderedIds: string[] }
```
Transacción que actualiza `order` según el array recibido.

### `toggleSection(id, enabled)`

### `deleteSection(id)`

## `media.ts`

### `requestUploadUrl(input)`
```ts
input: { filename: string, mime: string, size: number }
returns: { uploadUrl: string, blobPath: string, assetId: string }
```
Crea un `MediaAsset` en estado "pending" y devuelve un URL firmado a Blob.
El cliente sube directo a Blob, después llama `confirmUpload(assetId, url)`.

### `confirmUpload(assetId, input)`
```ts
input: { url: string, width?: number, height?: number }
```

### `updateAssetAlt(id, alt)`
### `deleteAsset(id)`

## `settings.ts`

### `updateSiteSettings(input)`
```ts
input: Partial<SiteSettings>  // validado con SiteSettingsSchema
side-effects: revalidateTag('site-settings')
```

## `collections.ts` (professionals / workshops / jobOpenings)

CRUD estándar con shape:
```ts
list(filters?) → items[]
create(input)
update(id, input)
delete(id)
reorder(orderedIds: string[])
```

Cada `create`/`update`/`delete`/`reorder` revalida el tag correspondiente.

## Endpoints HTTP (mínimos)

### `POST /api/upload/sign`
Equivalente HTTP de `requestUploadUrl`; lo usa el editor cuando necesita un
fetch en cliente. Misma validación de sesión.

### `POST /api/revalidate` (se mantiene del proyecto actual, refactorizado)
- Header `x-revalidate-secret: <REVALIDATE_SECRET>` requerido.
- Body: `{ tags: string[] }`.
- Útil para revalidar manualmente desde scripts o cron.

### `GET /api/auth/[...nextauth]`
Estándar de Auth.js.

## Errores estandarizados

| Código | Significado |
|---|---|
| `UNAUTHORIZED` | Sin sesión |
| `FORBIDDEN` | Sesión sin rol admin |
| `NOT_FOUND` | Recurso no existe |
| `VALIDATION` | Falló Zod (incluye `fieldErrors`) |
| `CONFLICT` | Slug duplicado, etc. |
| `INTERNAL` | Cualquier otra cosa (loggeado en server) |

## Ejemplo de implementación de `updateSection`

```ts
"use server";
import { z } from "zod";
import { db } from "@/lib/db";
import { registry } from "@/lib/sections";
import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";

export async function updateSection(id: string, raw: unknown) {
  await requireAdmin();
  const section = await db.section.findUnique({
    where: { id },
    include: { page: { select: { slug: true } } },
  });
  if (!section) return { ok: false, error: "NOT_FOUND" } as const;

  const schema = registry[section.type]?.schema;
  if (!schema) return { ok: false, error: "INTERNAL" } as const;

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "VALIDATION",
      fieldErrors: parsed.error.flatten().fieldErrors,
    } as const;
  }

  await db.section.update({
    where: { id },
    data: { data: parsed.data },
  });
  revalidateTag(`page:${section.page.slug}`);
  return { ok: true, data: undefined } as const;
}
```
