import type { SchemaTypeDefinition } from "sanity";

export const quienesSomosPage: SchemaTypeDefinition = {
  name: "quienesSomosPage",
  title: "Página Quiénes Somos",
  type: "document",
  fields: [
    { name: "heroSubtitle", title: "Subtítulo del hero", type: "string" },
    { name: "eyebrow", title: "Eyebrow de la sección", type: "string" },
    { name: "titulo", title: "Título principal", type: "string" },
    { name: "intro", title: "Texto introductorio", type: "text", rows: 5 },
    {
      name: "bloques",
      title: "Bloques (misión, visión, enfoque...)",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "titulo", title: "Título (Misión, Visión, etc.)", type: "string", validation: (r) => r.required() },
          { name: "texto", title: "Texto", type: "text", rows: 2 }
        ],
        preview: { select: { title: "titulo", subtitle: "texto" } }
      }]
    },
    { name: "imagen", title: "Imagen lateral", type: "image", options: { hotspot: true } }
  ],
  preview: { prepare: () => ({ title: "Página Quiénes Somos" }) }
};
