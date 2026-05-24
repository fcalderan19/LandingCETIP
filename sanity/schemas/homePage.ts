import type { SchemaTypeDefinition } from "sanity";

export const homePage: SchemaTypeDefinition = {
  name: "homePage",
  title: "Página de Inicio",
  type: "document",
  groups: [
    { name: "slides", title: "Carrusel hero" },
    { name: "servicios", title: "Sección servicios" },
    { name: "about", title: "About preview" },
    { name: "promo", title: "Cards promo" }
  ],
  fields: [
    {
      name: "heroSlides",
      title: "Slides del carrusel",
      type: "array",
      group: "slides",
      of: [{
        type: "object",
        fields: [
          { name: "eyebrow", title: "Eyebrow (texto corto arriba)", type: "string" },
          { name: "titulo", title: "Título", type: "string", validation: (r) => r.required() },
          { name: "descripcion", title: "Descripción", type: "text", rows: 2 },
          { name: "imagen", title: "Imagen de fondo", type: "image", options: { hotspot: true }, validation: (r) => r.required() },
          { name: "ctaLabel", title: "Texto del botón CTA", type: "string" },
          { name: "ctaHref", title: "Link del CTA", type: "string", description: "Ej: /programas-terapeuticos" },
          {
            name: "accent",
            title: "Color de acento",
            type: "string",
            options: { list: ["celeste", "coral", "naranja"] }
          }
        ],
        preview: { select: { title: "titulo", subtitle: "eyebrow", media: "imagen" } }
      }]
    },
    { name: "servEyebrow", title: "Eyebrow", type: "string", group: "servicios" },
    { name: "servTitulo", title: "Título", type: "string", group: "servicios" },
    { name: "servDescripcion", title: "Descripción", type: "text", rows: 2, group: "servicios" },
    { name: "aboutEyebrow", title: "Eyebrow", type: "string", group: "about" },
    { name: "aboutTitulo", title: "Título", type: "string", group: "about" },
    { name: "aboutTexto", title: "Texto", type: "text", rows: 4, group: "about" },
    { name: "aboutCtaLabel", title: "Texto del botón", type: "string", group: "about" },
    { name: "aboutImagen", title: "Imagen", type: "image", options: { hotspot: true }, group: "about" },
    {
      name: "promoCards",
      title: "Cards promo (RR.HH., Espacio, etc.)",
      type: "array",
      group: "promo",
      of: [{
        type: "object",
        fields: [
          { name: "eyebrow", title: "Eyebrow", type: "string" },
          { name: "titulo", title: "Título", type: "string", validation: (r) => r.required() },
          { name: "descripcion", title: "Descripción", type: "text", rows: 2 },
          { name: "ctaLabel", title: "Botón", type: "string" },
          { name: "href", title: "Link", type: "string" },
          { name: "imagen", title: "Imagen de fondo", type: "image", options: { hotspot: true } },
          { name: "accent", title: "Color overlay", type: "string", options: { list: ["coral", "celeste", "naranja", "petroleo"] } }
        ],
        preview: { select: { title: "titulo", subtitle: "eyebrow", media: "imagen" } }
      }]
    }
  ],
  preview: { prepare: () => ({ title: "Página de Inicio" }) }
};
