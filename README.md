# CETIP — Landing Page

Landing institucional para **CETIP — Centro Educativo Terapéutico**, construida con Next.js 15 (App Router), React 19 y Tailwind CSS v4.

## Stack
- Next.js 15 (App Router, RSC)
- React 19
- Tailwind CSS v4 (sin config JS — tokens en `app/globals.css`)
- TypeScript

## Instalación

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

Build de producción:

```bash
npm run build
npm start
```

## Estructura

```
app/
  layout.tsx          # Layout raíz, fuentes, schema.org, floats
  page.tsx            # Composición de secciones
  globals.css         # Tokens de color + utilidades
  api/
    contact/route.ts  # POST formulario contacto
    rrhh/route.ts     # POST formulario RRHH (multipart con CV)
components/
  TopBar, Header, Hero, QuienesSomos, Equipo, Espacio,
  Servicios, ContactoForm, RRHH, Contacto, Footer,
  FloatingWhatsapp, CVDrawer, RevealObserver, Icons
lib/
  site.ts             # Datos institucionales (single source of truth)
```

## Personalización

### Datos del negocio
Editar **`lib/site.ts`** — nombre, dirección, teléfono, WhatsApp, email, horarios, redes y el embed de Google Maps. Todo el sitio lee desde ahí.

### Paleta de colores
Editar tokens en **`app/globals.css`** dentro del bloque `@theme`. La paleta del spec ya está cargada:

- `--color-petroleo` `#233841` — primario
- `--color-verde` `#4ab748` — WhatsApp, "Enviar CV"
- `--color-coral` `#ef3867` — destacados, CTA "Contactanos"
- `--color-naranja` `#f79321` — Talleres
- `--color-celeste` `#2bace3` — links, Consultorios

Cada servicio (CET / Consultorios / Talleres) usa un color distinto para diferenciarse visualmente.

### Equipo
Lista en `components/Equipo.tsx` (`const equipo = [...]`). Cambiar fotos, nombres, roles y disciplinas. El filtro por disciplina se genera automáticamente.

### Galería de instalaciones
Array `fotos` en `components/Espacio.tsx`. Soporta lightbox al hacer click.

### Talleres y consultorios
Arrays `talleres` y `consultorios` en `components/Servicios.tsx`.

### Imágenes
Actualmente usa placeholders de Unsplash (`images.unsplash.com`). Reemplazar las URLs por imágenes propias (idealmente en `/public`) cuando estén disponibles. El dominio Unsplash ya está habilitado en `next.config.mjs`.

### Formularios
Los handlers `/api/contact` y `/api/rrhh` solo loguean a consola. Para producción, integrar con:
- Email transaccional (Resend, SendGrid, etc.)
- Webhook/CRM
- Almacenamiento del CV en S3 / Drive / etc.

## Accesibilidad

- HTML semántico, `lang="es-AR"`
- Skip link a contenido principal
- `aria-label` en botones de íconos
- Focus visible
- Contrastes según WCAG AA en los colores de la paleta

## SEO

- Metadata API de Next.js
- Open Graph
- JSON-LD `EducationalOrganization` + `LocalBusiness` en `layout.tsx`

## Notas

- El botón flotante de WhatsApp y la pestaña lateral "Cargá tu CV" son globales (en `layout.tsx`).
- Animaciones de scroll vía `IntersectionObserver` (clase `.reveal` → `.is-visible`).
