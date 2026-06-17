# Spec 001 — Estado actual: LandingCETIP con Sanity CMS

## Objetivo

Documentar **el estado actual** del sitio LandingCETIP tal como está al 2026-06-10:
una landing institucional en Next.js 15 con un CMS Sanity parcialmente integrado.
Esta spec es **descriptiva, no prescriptiva** — sirve como baseline antes de la
migración planteada en `../002-admin-builder/`.

### Usuario
- **Visitante final**: padres, profesionales y postulantes que navegan secciones
  informativas y completan formularios (admisión, contacto, RR.HH.).
- **Editor de contenido (rol declarado pero no funcional)**: equipo CETIP que
  debería editar copys vía Sanity Studio. Hoy no puede porque la conexión entre
  schemas y frontend está incompleta (ver "Brechas").

### Éxito (como está hoy)
- Sitio público navegable y deployado en Vercel ✓
- Formularios con endpoints `/api/*` que loguean a consola ✓
- Sanity Studio se levanta en `/studio` con 12 singletons + 3 colecciones ✓
- Webhook `/api/revalidate` con firma HMAC funcional ✓

## Tech Stack

- **Next.js** 15.5.18 (App Router, RSC)
- **React** 19.2.6
- **TypeScript** 5.7
- **Tailwind CSS** 4 (sin config JS — tokens en `app/globals.css`)
- **Sanity** 5.26 (singletons + colecciones, Presentation Tool con preview iframe)
- **next-sanity** 13 (cliente + webhook parser)
- **styled-components** 6.4 (uso puntual)
- **Node** ≥ 22.12

## Commands

```bash
npm run dev            # Next dev (puerto 3000)
npm run build          # Build de producción
npm start              # Servir build
npm run lint           # next lint
npm run studio:dev     # Sanity Studio en dev
npm run studio:build   # Build del studio
npm run studio:deploy  # Deploy del studio a sanity.io
```

## Project Structure

```
app/
  layout.tsx                    Root layout (fonts, JSON-LD, floats globales)
  page.tsx                      Home (composición estática de secciones)
  globals.css                   Tokens de color, utilidades Tailwind v4
  api/
    contact/route.ts            POST formulario contacto (console.log)
    admision/route.ts           POST formulario admisión (console.log)
    rrhh/route.ts               POST formulario RR.HH. multipart con CV
    revalidate/route.ts         Webhook Sanity → revalidateTag
  admision/page.tsx
  contacto/page.tsx
  nuestro-espacio/page.tsx
  quienes-somos/page.tsx
  rrhh/page.tsx
  programas-terapeuticos/
    page.tsx
    cet/page.tsx
    consultorios/page.tsx
    talleres/page.tsx
    evaluaciones-diagnosticas/page.tsx

components/                     20 componentes (Hero, Equipo, Footer, etc.)
  HeroSlider.tsx                ⚠ slides HARDCODEADOS — no lee Sanity
  Equipo.tsx + EquipoClient.tsx
  ServiceGrid.tsx, FeaturedStrip.tsx, AboutPreview.tsx
  ...

lib/
  site.ts                       Datos institucionales (single source of truth)
  nav.ts                        Estructura del menú

sanity/
  env.ts                        projectId / dataset / apiVersion
  structure.ts                  Structure builder (singletons + colecciones)
  lib/client.ts                 Cliente Sanity (con stega habilitado)
  lib/queries.ts                Queries GROQ (solo 3 colecciones)
  lib/image.ts                  imageUrl builder
  schemas/                      12 schemas singleton + 3 colección

sanity.config.ts                Config raíz (Studio + Presentation + Vision)
sanity.cli.ts                   CLI deploy config
```

## Code Style

TypeScript estricto, componentes funcionales, sin `class`. Tailwind utility-first
con tokens CSS variables. Ejemplo representativo:

```tsx
// components/HeroSlider.tsx (fragmento)
type Slide = {
  eyebrow: string;
  title: string;
  accent: "celeste" | "coral" | "naranja";
  ...
};

const slides: Slide[] = [
  { eyebrow: "Centro Educativo Terapéutico", title: "...", accent: "celeste", ... },
  ...
];

export default function HeroSlider() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 6500);
    return () => clearInterval(t);
  }, []);
  return <section className="...">...</section>;
}
```

**Convenciones observadas:**
- Componentes: PascalCase, un archivo por componente.
- Imports con alias `@/`.
- Server Components por defecto; `"use client"` solo cuando hay estado/efectos.
- Datos institucionales globales en `lib/site.ts`.
- Colores via CSS variables `var(--color-*)`.

## Testing Strategy

**No hay tests.** No existe Jest, Vitest, Playwright ni configuración de testing.
Validación manual en dev (`npm run dev`) y revisión en preview de Vercel.

## Boundaries (estado de hecho, no aspiracional)

- **Always**: deploy a Vercel desde `main`; lint pasa antes del push.
- **Ask first**: cambios en schemas de Sanity (afectan al editor); cambios en
  `lib/site.ts` (afectan toda la UI).
- **Never**: subir `.env.local`; commits con `SANITY_API_TOKEN` o secrets.

## Brechas detectadas (importantes para la spec 002)

1. **Frontend no consume Sanity en home**. `HeroSlider.tsx`, `ServiceGrid.tsx`,
   `FeaturedStrip.tsx`, `AboutPreview.tsx` tienen contenido **hardcodeado**, no
   ejecutan queries GROQ. Editar el singleton `homePage` en Studio **no se ve**.
2. **Solo 3 colecciones queryeadas**: `lib/queries.ts` solo cubre `profesional`,
   `taller`, `busqueda`. Los 12 singletons no tienen queries asociadas.
3. **`/api/revalidate` solo conoce tags de colecciones** (`equipo`, `talleres`,
   `busquedas`). Singletons no disparan revalidación.
4. **Sin tests, sin CI gates** más allá del build de Vercel.
5. **Imágenes mixtas**: parte en `/public`, parte vía Unsplash CDN, parte en Sanity.
6. **Formularios sin destino productivo**: solo `console.log`, no envían email
   ni persisten.

## Variables de entorno usadas

| Variable | Origen | Uso |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `.env.local` / Vercel | Cliente Sanity |
| `NEXT_PUBLIC_SANITY_DATASET` | idem | Cliente Sanity (default `production`) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | idem | Versión GROQ |
| `SANITY_API_READ_TOKEN` | server only | Drafts y preview |
| `SANITY_REVALIDATE_SECRET` | server only | Verifica firma webhook |
| `SANITY_STUDIO_PREVIEW_URL` | sanity.cli | URL del sitio para iframe preview |

## Success Criteria (verificables hoy)

- [ ] `npm run build` termina sin errores
- [ ] `/` renderiza Hero, Servicios, About y Featured
- [ ] `/studio` carga (si las env vars de Sanity están seteadas)
- [ ] Webhook Sanity → `/api/revalidate` devuelve `200 { ok: true }` con firma válida
- [ ] Formularios `/contacto`, `/admision`, `/rrhh` envían POST sin error

## Open Questions (resueltas por la decisión de migrar)

Las preguntas pendientes — cómo poblar singletons en frontend, qué hacer con la
inconsistencia de imágenes, dónde mandar los formularios — quedan resueltas
implícitamente por la decisión de descontinuar Sanity y construir el admin
propio (spec 002).
