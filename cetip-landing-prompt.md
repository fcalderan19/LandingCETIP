# Prompt para Landing Page de CETIP

Diseñá y desarrollá una landing page institucional moderna, accesible y responsive para **CETIP — Centro Educativo Terapéutico**. El sitio es informativo + captación de leads (familias, profesionales que buscan trabajo, derivaciones). Tono: cálido, profesional, humano, inclusivo. Idioma: español (Argentina).

---

## Paleta de colores (estricta — no agregar otros tonos)

| Color | HEX | Uso |
|---|---|---|
| Azul petróleo | `#233841` | Primario / textos / header / footer |
| Verde | `#4ab748` | CTAs positivos (WhatsApp, "Enviar CV") |
| Rosa/Coral | `#ef3867` | Destacados, badges, alertas suaves |
| Naranja | `#f79321` | Botones secundarios, iconos talleres |
| Celeste | `#2bace3` | Links, iconos servicios, hover |
| Blanco | `#ffffff` | Fondos, contraste |

Usar `#233841` como base de identidad. Los 4 colores acento se asignan uno por sección de servicio (CET, Consultorios, Talleres, RRHH) para diferenciarlas visualmente con coherencia. Tipografía sans-serif legible (Inter, Poppins o similar). Bordes redondeados suaves (12–16px), sombras sutiles, mucho aire blanco.

---

## Estructura — secciones en este orden exacto

### 1) Top bar (info clave SIEMPRE visible arriba)
Inspirado en desirsalud.com.ar
- Dirección, teléfono y horarios
- Icono WhatsApp + botón directo (verde `#4ab748`)
- Email de contacto
- Iconos a redes sociales (Instagram, Facebook)

### 2) Header / Nav sticky
- Logo CETIP a la izquierda
- Menú: Inicio · Quiénes Somos · Nuestro Equipo · Nuestro Espacio · Servicios (dropdown: CET, Consultorios Externos, Talleres) · RRHH · Contacto
- Botón CTA destacado a la derecha: "Contactanos" (`#ef3867`)

### 3) Hero
- Imagen cálida (institución, espacios, actividades — placeholders)
- Titular fuerte: propuesta de valor de CETIP en 1 línea
- Subtítulo: 1 oración explicando qué hacen y para quién
- 2 CTAs: "Conocer servicios" (primario) + "WhatsApp" (verde)
- Debajo del hero: 3 bullets con info clave (estilo cetre.com.ar):
  - "Atendemos por obra social"
  - "+X años de experiencia"
  - "Equipo interdisciplinario"

### 4) Quiénes Somos
- Texto institucional (misión, visión, enfoque terapéutico)
- Imagen al costado
- Inspiración: https://desirsalud.com.ar/quienes-somos/

### 5) Nuestro Equipo
- Grid de tarjetas con foto, nombre, rol y especialidad de cada profesional
- Filtro o tabs por disciplina (psicología, fonoaudiología, TO, etc.)

### 6) Nuestro Espacio (Instalaciones)
- Galería tipo masonry/carrusel con fotos de aulas, consultorios, espacios comunes
- Lightbox al hacer click
- Opcional: tour virtual o video embed

### 7) Servicios — sección madre con 3 sub-bloques bien diferenciados
Inspiración en aedin.org → "Programas Terapéuticos" como cards claras

**7.1) CET — Centro Educativo Terapéutico**
- Descripción, edades, modalidad (jornada simple/completa)
- CTA: "Solicitar info"

**7.2) Consultorios Externos**
- Listado de especialidades (psicología, TO, fonoaudiología, psicopedagogía, musicoterapia, etc.) en grid con icono por cada una
- CTA: "Reservar turno"

**7.3) Talleres**
- Cards de talleres disponibles con día/horario/destinatarios
- CTA: "Inscribirme"

### 8) Formulario de contacto / derivación
Inspirado en cetre.com.ar/servicios — formulario claro embebido
- Campos: nombre, email, teléfono, motivo de consulta (select: CET / Consultorios / Talleres / Otro), mensaje
- Validación inline, mensaje de éxito
- Aviso de privacidad

### 9) RRHH — "Sumate al equipo"
Inspiración: desirsalud.com.ar/r-r-h-h/ y aedin.org "Cargá tu CV"
- Texto invitando a profesionales a postularse
- Formulario con: nombre, email, teléfono, profesión/título, experiencia (textarea), upload de CV (PDF)
- Mensaje de confirmación

### 10) Contacto
- Mapa embebido de Google Maps con ubicación
- Datos: dirección, teléfono, email, horarios
- Botón grande de WhatsApp

### 11) Footer
- Logo + tagline corto
- Mapa del sitio (columnas)
- Datos de contacto
- Redes sociales
- Política de privacidad · Términos
- Copyright

---

## Elementos flotantes (CLAVE — siempre visibles)

Inspiración: aedin.org + apredis.com.ar

**Botón flotante WhatsApp** (esquina inferior derecha)
- Verde `#4ab748`, icono WhatsApp, pulsa suavemente
- Abre chat directo al número de CETIP con mensaje pre-cargado
- Visible en TODAS las secciones, en mobile y desktop

**Botón/pestaña lateral "Cargá tu CV"** (lado derecho de la pantalla, vertical)
- Color `#ef3867`, texto rotado 90°
- Al hacer click abre un drawer/modal con el formulario de CV
- Visible en todo momento

---

## Requisitos técnicos

- Stack: Next.js 15 (App Router) + Tailwind CSS + shadcn/ui (o HTML/CSS/JS si es estático)
- Mobile-first, totalmente responsive (mobile, tablet, desktop)
- Accesibilidad WCAG AA: contraste, labels, navegación por teclado, alt en imágenes
- SEO: meta tags, Open Graph, schema.org `LocalBusiness` / `EducationalOrganization`
- Performance: lazy-load de imágenes, fonts optimizadas
- Animaciones sutiles al hacer scroll (fade-in, no excesivas)
- Formularios funcionales (mock submit a `/api/contact` y `/api/rrhh`)

---

## Referencias visuales

- Estructura general y cards de servicios → https://www.aedin.org/
- Info de contacto visible arriba + carrusel hero → https://desirsalud.com.ar/
- Página de equipo / RRHH limpia → https://desirsalud.com.ar/r-r-h-h/
- Formulario simple por servicio → https://www.cetre.com.ar/servicios
- Botones flotantes WhatsApp + CV lateral → https://apredis.com.ar/

---

**Entregable:** código completo + assets placeholder + README con instrucciones de personalización.
