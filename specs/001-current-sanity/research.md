# Research 001 — Decisiones técnicas heredadas

## Por qué Sanity (en su momento)

- Studio embebido en el mismo repo → un solo deploy.
- Presentation Tool con preview iframe → editor ve cambios sin guardar.
- Stega → editores pueden hacer click sobre el texto en el preview para editarlo.
- Free tier suficiente para volumen del sitio.

## Por qué fracasó en la práctica

- **Adopción incompleta**: schemas creados pero queries no implementadas en
  componentes de home. El editor edita "al vacío".
- **Curva de aprendizaje GROQ**: el equipo no escribió las queries de los
  12 singletons; quedó pendiente.
- **Fricción de imágenes**: subir a Sanity vs mantener `/public` generó una
  política mixta confusa.
- **Token management**: `SANITY_API_READ_TOKEN` para drafts requiere rotación
  manual; no hay proceso definido.

## Alternativas que se evaluaron implícitamente

| Opción | Por qué se descartó entonces |
|---|---|
| MDX + Git | Editor no-técnico no puede usar git. |
| Headless CMS SaaS (Contentful, Strapi Cloud) | Costo y vendor lock-in. |
| Admin propio con DB | Tiempo de implementación percibido como alto. |

La opción 3 es la que retomamos en la spec 002 con un alcance acotado.

## Detalles técnicos a recordar

### Stega
Habilitado en `sanity/lib/client.ts` (commit `80bf70e`). Inserta caracteres
zero-width tipo `​` en strings. **Importante**: si en la migración 002 se
hace `.trim()` o comparación de strings, hay que correr el sanitizer de
`@sanity/client/stega`.

### Visual Editing
`@sanity/visual-editing` 5.3 con `presentationTool({ previewUrl: ... })`.
Requiere `draftMode().enable()` en `/api/preview` o equivalente — **no** lo veo
implementado en `app/api/`, así que el preview podría no estar resolviendo
drafts correctamente. Confirmar antes de descontinuar.

### Webhook signing
`parseBody` de `next-sanity/webhook` valida HMAC con `SANITY_REVALIDATE_SECRET`.
El patrón es reusable: la spec 002 lo replicará con un secret propio.

## Referencias

- Repo actual: rama `main`
- Schemas: `sanity/schemas/`
- Queries activas: `sanity/lib/queries.ts`
