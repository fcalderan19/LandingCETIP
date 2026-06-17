# Tasks 001 — Auditoría / cierre del estado actual

Estas tareas **no construyen nada nuevo** — son verificaciones para confirmar
qué quedó funcionando y qué se va a descontinuar en la spec 002.

## Verificación

- [ ] **T1 — Build limpio**
  - Acceptance: `npm ci && npm run build` termina sin errores.
  - Verify: salida del comando.
  - Files: ninguno modificado.

- [ ] **T2 — Inventario de queries activas**
  - Acceptance: documentar (en este archivo) qué páginas realmente ejecutan
    queries GROQ. Confirmar que solo `taller` (en talleres) y `busqueda` (en RRHH)
    se leen del CMS.
  - Verify: `grep -r "next-sanity\|sanityClient\|groq" app components`.
  - Files: ninguno modificado.

- [ ] **T3 — Webhook funcional**
  - Acceptance: editar un `profesional` en Studio → en logs de Vercel aparece
    `revalidated: equipo`.
  - Verify: prueba manual en preview deploy.

- [ ] **T4 — Preview Mode**
  - Acceptance: confirmar si `presentationTool` realmente muestra drafts. Buscar
    si existe ruta `app/api/draft-mode/enable/route.ts` o equivalente.
  - Verify: click en cualquier campo en el Studio → debe abrir el sitio con
    drafts visibles.

- [ ] **T5 — Variables de entorno en Vercel**
  - Acceptance: listar las env vars seteadas en Vercel para `production` y
    `preview`. Confirmar que coincidan con la tabla de `spec.md`.
  - Verify: `vercel env ls` o panel.

## Decisión de continuación

- [ ] **T6 — Confirmación de descontinuar Sanity**
  - Acceptance: stakeholder firma que se procede con la spec 002.
  - Verify: registro escrito (este checkbox).

- [ ] **T7 — Backup de contenido editado**
  - Acceptance: export completo del dataset (`npx sanity dataset export production backup.tar.gz`)
    guardado fuera del repo.
  - Verify: archivo existe y se puede importar a un sandbox.
  - Files: ninguno en el repo; archivo externo.

## Cierre

- [ ] **T8 — Tag git de baseline**
  - Acceptance: `git tag baseline-sanity` antes de empezar 002.
  - Verify: `git tag -l baseline-sanity`.

> Una vez completadas T1–T8, la spec 001 queda "frozen" y se trabaja exclusivamente
> contra la spec 002.
