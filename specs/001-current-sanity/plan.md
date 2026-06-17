# Plan 001 — Estado actual

Esta spec es **descriptiva**; no hay un plan de implementación nuevo. El "plan"
es el historial git que llevó al estado actual y las decisiones que sobreviven
en producción.

## Línea de tiempo (commits relevantes)

1. Setup inicial Next.js 15 + Tailwind v4 + componentes estáticos.
2. `328a8d8` — Presentation Tool con preview iframe lado a lado.
3. `5be7e5a` — fix: mover `autoUpdates` a `deployment.autoUpdates`.
4. `e5474b1` — chore: `legacy-peer-deps` para que Vercel pueda instalar
   (React 19 + Sanity coexistiendo).
5. `8a4cd36` — feat(cms): 12 schemas singletons + structure builder.
6. `80bf70e` — feat(cms): habilita stega en client (metadatos para visual editing).

## Decisiones consolidadas (que la spec 002 debe respetar o reemplazar explícitamente)

| # | Decisión | Estado |
|---|---|---|
| D1 | Next.js 15 App Router + RSC | **Mantener** en 002 |
| D2 | Tailwind v4 con tokens en `globals.css` | **Mantener** |
| D3 | `lib/site.ts` como single source of truth de datos institucionales | **Migrar a DB** en 002 |
| D4 | Sanity como CMS | **Reemplazar** en 002 |
| D5 | Webhook `/api/revalidate` con firma HMAC | **Patrón a reusar** (cambia el origen) |
| D6 | Formularios solo loguean | **Sin cambios** en 002 (fuera de scope) |

## Riesgos vigentes

- **R1**: `legacy-peer-deps` puede ocultar incompatibilidades reales de versiones.
- **R2**: Stega habilitado inyecta caracteres invisibles en strings que se sirven
  al cliente; puede romper comparaciones `===` o slugs si no se sanitiza.
- **R3**: 12 singletons en Studio sin queries asociadas → editores creen que
  pueden editar pero no se refleja en el sitio.

## Checkpoints (auditoría rápida)

- [ ] `git log --oneline -20` revisado
- [ ] `package.json` vs `node_modules` coherente (`npm ci`)
- [ ] Build de Vercel verde en la rama `main`
- [ ] `/studio` accesible con cuenta admin
