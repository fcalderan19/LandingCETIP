# Security review 002 — Admin builder

Auditoría al cierre del admin v1. Inventario de controles implementados, mitigaciones aplicadas y riesgos residuales aceptados.

## Modelo de amenazas

| Activo | Quién lo quiere | Cómo |
|---|---|---|
| Sesión admin | Atacante externo | OAuth phishing, robo de cookie, open redirect, CSRF |
| Contenido público | Atacante externo o admin comprometido | Escritura no autorizada en `Page`/`Section`/`SiteSettings` |
| Vercel Blob (CDN) | Phisher | Subir HTML para usar el dominio CDN como host de phishing |
| Endpoint `/api/revalidate` | Atacante | Invalidar caché masivamente como DoS suave |
| Datos públicos del sitio | Spammer | Flooding de `/api/contact`, `/api/rrhh`, `/api/admision` |
| Secrets en `.env` | Cualquiera con acceso al repo o al CI | Commit accidental, leak de logs |

## Controles implementados

### Autenticación
- **OAuth con Google** vía Auth.js v5. No hay passwords gestionados por la app.
- **Whitelist en DB** (`AllowedEmail` table). El callback `signIn` rechaza cualquier email que no esté presente. Sin sesión persistente para no-whitelisted users.
- **Session strategy `database`** — las sesiones se invalidan borrando la fila en `Session`. Más seguro que JWT para revocación inmediata.
- **Cookies `HttpOnly` + `Secure`** en prod (`__Secure-authjs.session-token`) — manejadas por Auth.js. Mitiga XSS-induced session theft.

### Autorización
- **Defense in depth, 3 capas**:
  1. `middleware.ts` — chequeo barato de cookie de sesión, redirige a `/admin/login` si falta.
  2. `app/admin/layout.tsx` — chequeo real de sesión vía `auth()` (consulta DB) + role check. Redirige si la cookie es inválida o expirada (pasa el middleware pero falla acá).
  3. `requireAdmin()` en **toda** server action (29 invocaciones verificadas con grep en los 5 archivos de `app/admin/_actions/`).
- **`role !== "admin"` rechazado** en layout y en `requireAdmin`. Anticipa futuras roles más granulares sin code change inmediato.

### Validación de input
- **Zod en toda server action** — schemas estrictos por colección, regex en `slug`, mime/extensión allowlist en uploads, caps de tamaño.
- **Schemas del contenido** parseados con `getSection(type).schema.parse(data)` antes de persistir → es imposible guardar `data` JSONB que rompa el render.

### Protección contra XSS
- **JSX auto-escape** — todo string que viene del CMS se renderiza como texto. No usamos `dangerouslySetInnerHTML` salvo en `app/layout.tsx` para el JSON-LD (input estático del código).
- **No HTML rich-text** en los campos del editor — el editor solo expone `text/textarea/number/select/image/link/array`, no rich-text WYSIWYG. Esto cierra el vector de XSS vía contenido editorial.
- **`iframe` para mapsEmbed** — único embed inline. El URL solo lo puede setear un admin autenticado vía `updateSiteSettings`. Threat model lo trata como input confiable; aun así el header `X-Frame-Options: SAMEORIGIN` mitiga clickjacking.

### Protección contra CSRF
- **Server Actions de Next 15 incluyen tokens CSRF automáticos** (action-id signed) — verificados por el runtime.
- **Auth.js** maneja CSRF en sus endpoints (`__Host-authjs.csrf-token`).
- **No hay endpoints HTTP custom** que muten estado salvo `/api/revalidate` (protegido por header secret).

### Open redirect
- **`safeCallbackUrl()`** en `lib/safe-redirect.ts` valida que `callbackUrl` sea path relativo same-origin. Rechaza `https://evil.com`, `//evil.com`, paths con CRLF/backslash.
- **Callback `redirect` en `auth.ts`** — defense-in-depth: Auth.js solo redirige a URLs same-origin.

### Upload de media
- **Mime allowlist explícita** (`image/jpeg|png|webp|avif|gif|svg+xml`).
- **Extensión allowlist por regex** (`.jpg|jpeg|png|webp|avif|gif|svg`).
- **Cap de 20 MB** por archivo.
- **Filename sanitizado** (`safePathname` quita chars no `\w.\-` y prefija con timestamp para evitar colisiones y path traversal).
- **Asset solo escribible por admin** — la action requiere `requireAdmin()`.

> Residual: un admin maligno *podría* subir un SVG con `<script>` embebido. Vercel Blob sirve con `Content-Type: image/svg+xml` y los browsers ejecutan JS en SVGs cargados directamente vía URL. Mitigación parcial: el sitio público nunca embebe SVGs como `<object>` o como página completa — solo como `<img src>` (no ejecuta scripts). Aún así, el admin comprometido podría compartir el URL del SVG como vector de phishing. Aceptado.

### Headers de seguridad (`next.config.mjs`)
| Header | Valor | Mitigación |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | Browser no adivina mime → no ejecuta `.txt` como JS |
| `X-Frame-Options` | `SAMEORIGIN` | Anti-clickjacking en `/admin/*` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | No leak full URL a third parties |
| `Permissions-Policy` | `camera=() microphone=() geolocation=() browsing-topics=()` | Apaga APIs powerful por default |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Force HTTPS dos años |
| `X-Powered-By` | (removed via `poweredByHeader: false`) | Menos fingerprinting |

### Webhooks
- **`/api/revalidate`** — comparación constant-time con `timingSafeEqual` (Node `crypto`). Whitelist de tag prefixes. Rechaza payloads sin `tags[]` no-vacío.

### SQL injection
- **Prisma** parametriza todas las queries. No usamos `db.$queryRaw` con interpolación de input usuario.

### Secrets management
- **`.env*.local` en `.gitignore`** — verificado.
- **`.env.example`** documenta las vars sin valores.
- **Vercel env vars** se inyectan en runtime; no hay path donde el cliente vea `DATABASE_URL`/`AUTH_SECRET`.
- **`SEED_ADMIN_EMAIL` con default hardcodeado** (mi email) — documentado, no es sensible.

### Logging
- **Errores en server**: `console.error("[scope]", err)` — incluye `err.message` y stack. **Riesgo**: errores de Prisma pueden incluir el connection string parcial.
  - **Mitigación**: en Vercel los logs son solo accesibles por owners del proyecto.
  - **Recomendación**: en F8 (futuro) sumar Sentry y filtrar `DATABASE_URL`/`AUTH_SECRET` en `beforeSend`.

## Riesgos residuales aceptados

| # | Riesgo | Por qué se acepta | Recomendación a futuro |
|---|---|---|---|
| R1 | **Sin rate limit en `/api/contact`, `/api/admision`, `/api/rrhh`** | Hoy solo `console.log`. Sin destino real, el spam no causa daño material. | Cuando se enchufe Resend/etc., poner Vercel Edge Config o Upstash rate-limit (10 req/min por IP). |
| R2 | **Sin captcha en formularios públicos** | Mismo motivo que R1. | Turnstile (Cloudflare) cuando los formularios envíen a un humano. |
| R3 | **Sin CSP** (`Content-Security-Policy`) | Tailwind v4 inyecta styles inline; configurar CSP con nonces requiere refactor non-trivial. | Sumar CSP con `report-only` primero para no romper, luego enforcing. |
| R4 | **Admin que sube SVG malicioso** | Admin es trusted. Vector limitado a phishing externo. | Strip SVG `<script>` en `uploadMediaAsset` con DOMPurify server-side, o convertir SVG a PNG al subir. |
| R5 | **Errores de Prisma pueden filtrar parte del connection string en logs** | Logs solo visibles a owners del Vercel project. | Sentry + scrubbing. |
| R6 | **Admin tiene control total** — no hay roles editor/reviewer | 3 admins de confianza, no se necesita workflow de aprobación. | Roles + audit log cuando el equipo crezca. |
| R7 | **No hay audit log de cambios** | v1 acepta que solo se sepa "alguien lo cambió" sin trazabilidad. | Tabla `AuditEvent { actorId, action, entity, before, after, at }` poblada en cada server action. |
| R8 | **No hay 2FA propio** | Se delega a Google (los admins deben tener 2FA en sus cuentas Google). | Documentar en onboarding: "Tu cuenta Google debe tener 2FA activado". |

## Cómo manejar acceso en el día a día

### Agregar admin
```bash
# Localmente, contra la DB de prod:
DATABASE_URL=<prod> npm run db:studio
# → tabla AllowedEmail → + Add record → email
```
O directo en SQL:
```sql
INSERT INTO "AllowedEmail" (email, "createdAt") VALUES ('nuevo@equipo.com', now());
```

### Revocar admin (immediato)
```sql
-- Borra el permiso futuro:
DELETE FROM "AllowedEmail" WHERE email = 'ex@equipo.com';
-- Y mata la sesión activa:
DELETE FROM "Session" WHERE "userId" = (SELECT id FROM "User" WHERE email = 'ex@equipo.com');
```

### Rotar `AUTH_SECRET`
Cambiarlo en Vercel + `.env.local` y redeploy. Todas las sesiones de DB se invalidan implícitamente al fallar la verificación de cookie firmada.

### Rotar `REVALIDATE_SECRET`
Cambiarlo en Vercel; ningún consumidor externo lo usa todavía.

### Sospecha de compromiso
1. `DELETE FROM "Session"` — log out global.
2. Rotar `AUTH_SECRET`.
3. Auditar últimas modificaciones: `SELECT id, slug, "updatedAt" FROM "Page" ORDER BY "updatedAt" DESC LIMIT 50` y equivalente para `Section`/`SiteSettings`.
4. Restaurar de backup si hubo cambios maliciosos.

## Checklist de despliegue seguro

Antes del primer deploy a producción:

- [ ] `AUTH_SECRET` único de prod (no reutilizar el de dev).
- [ ] `REVALIDATE_SECRET` único de prod.
- [ ] `AUTH_URL=https://cetip.com.ar` (sin trailing slash).
- [ ] Google OAuth credentials de prod tienen `https://cetip.com.ar/api/auth/callback/google` en redirect URIs.
- [ ] `AllowedEmail` poblada solo con emails reales del equipo.
- [ ] OAuth consent screen publicada (no "Testing") si hay más de 100 admins, o whitelisted en "Test users" si está en Testing.
- [ ] Vercel project tiene "Password protection" desactivado solo para producción (no querés bloquear el sitio público).
- [ ] Backup nightly de Neon configurado (`Neon → Settings → Branching` con auto-snapshots).
- [ ] Headers de seguridad activos (verificable con `curl -I https://cetip.com.ar/admin`).

## Verificación post-deploy

```bash
# Headers de seguridad presentes
curl -s -I https://cetip.com.ar | grep -E "X-Frame|X-Content|HSTS|Referrer|Permissions"

# Endpoint protegido
curl -s -o /dev/null -w "%{http_code}\n" https://cetip.com.ar/admin       # 307 redirect a /admin/login
curl -s -o /dev/null -w "%{http_code}\n" https://cetip.com.ar/api/revalidate -X POST  # 401

# Revalidate solo con secret correcto
curl -s https://cetip.com.ar/api/revalidate -X POST \
  -H "Content-Type: application/json" \
  -H "x-revalidate-secret: $REVALIDATE_SECRET" \
  -d '{"tags":["page:home"]}'
# → {"ok":true,"accepted":["page:home"],"rejected":[]}
```
