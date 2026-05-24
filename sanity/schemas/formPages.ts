import type { SchemaTypeDefinition } from "sanity";

export const admisionPage: SchemaTypeDefinition = {
  name: "admisionPage",
  title: "Página Admisión",
  type: "document",
  fields: [
    { name: "heroSubtitle", title: "Subtítulo del hero", type: "string" },
    {
      name: "programaOptions",
      title: "Opciones del select 'Programa de interés'",
      type: "array",
      of: [{ type: "string" }]
    }
  ],
  preview: { prepare: () => ({ title: "Página Admisión" }) }
};

export const rrhhPage: SchemaTypeDefinition = {
  name: "rrhhPage",
  title: "Página RR.HH.",
  type: "document",
  fields: [
    { name: "heroSubtitle", title: "Subtítulo del hero", type: "string" },
    { name: "heroImagen", title: "Imagen de fondo del hero", type: "image", options: { hotspot: true } },
    { name: "intro", title: "Texto introductorio del form", type: "text", rows: 3 },
    {
      name: "beneficios",
      title: "Beneficios (puntos al costado del form)",
      type: "array",
      of: [{ type: "string" }]
    },
    {
      name: "areaOptions",
      title: "Opciones del select 'Área'",
      type: "array",
      of: [{ type: "string" }]
    }
  ],
  preview: { prepare: () => ({ title: "Página RR.HH." }) }
};

export const contactoPage: SchemaTypeDefinition = {
  name: "contactoPage",
  title: "Página Contacto",
  type: "document",
  fields: [
    { name: "heroSubtitle", title: "Subtítulo del hero", type: "string" },
    { name: "infoTitulo", title: "Título 'Cómo encontrarnos'", type: "string" },
    { name: "formTitulo", title: "Título del form de consulta", type: "string" },
    { name: "formIntro", title: "Texto sobre el form", type: "string" },
    {
      name: "motivoOptions",
      title: "Opciones del select 'Motivo de consulta'",
      type: "array",
      of: [{ type: "string" }]
    }
  ],
  preview: { prepare: () => ({ title: "Página Contacto" }) }
};
