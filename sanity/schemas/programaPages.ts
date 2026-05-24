import type { SchemaTypeDefinition } from "sanity";

type Color = "celeste" | "coral" | "naranja";

const baseFields = (color: Color) => ([
  { name: "heroTitulo", title: "Título del hero", type: "string" as const, validation: (r: any) => r.required() },
  { name: "heroSubtitle", title: "Subtítulo del hero", type: "string" as const },
  { name: "heroImagen", title: "Imagen de fondo del hero", type: "image" as const, options: { hotspot: true } },
  { name: "color", title: "Color de acento", type: "string" as const, options: { list: ["celeste", "coral", "naranja"] }, initialValue: color },
  { name: "titulo", title: "Título de la sección", type: "string" as const },
  { name: "descripcion", title: "Descripción / párrafo intro", type: "text" as const, rows: 4 },
  {
    name: "features",
    title: "Lista de features (puntos)",
    type: "array" as const,
    of: [{ type: "string" as const }]
  },
  {
    name: "datosClave",
    title: "Datos clave (sidebar)",
    type: "array" as const,
    of: [{
      type: "object" as const,
      fields: [
        { name: "label", title: "Etiqueta", type: "string" as const, validation: (r: any) => r.required() },
        { name: "valor", title: "Valor", type: "string" as const, validation: (r: any) => r.required() }
      ],
      preview: { select: { title: "label", subtitle: "valor" } }
    }]
  },
  { name: "ctaLabel", title: "Texto del CTA", type: "string" as const },
  { name: "ctaHref", title: "Link del CTA", type: "string" as const }
]);

export const programasOverviewPage: SchemaTypeDefinition = {
  name: "programasOverviewPage",
  title: "Programas — Overview",
  type: "document",
  fields: [{ name: "heroSubtitle", title: "Subtítulo del hero", type: "string" }],
  preview: { prepare: () => ({ title: "Programas — Overview" }) }
};

export const programaCETPage: SchemaTypeDefinition = {
  name: "programaCETPage",
  title: "Programa CET",
  type: "document",
  fields: baseFields("celeste"),
  preview: { prepare: () => ({ title: "Programa CET" }) }
};

export const programaConsultoriosPage: SchemaTypeDefinition = {
  name: "programaConsultoriosPage",
  title: "Programa Consultorios",
  type: "document",
  fields: [
    ...baseFields("coral"),
    {
      name: "especialidades",
      title: "Especialidades (grid de íconos)",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "label", title: "Nombre de la especialidad", type: "string", validation: (r: any) => r.required() },
          {
            name: "icono",
            title: "Ícono",
            type: "string",
            options: {
              list: [
                { title: "Cerebro (Psicología)", value: "IconBrain" },
                { title: "Mano (TO)", value: "IconHand" },
                { title: "Habla (Fonoaudiología)", value: "IconSpeech" },
                { title: "Libro (Psicopedagogía)", value: "IconBook" },
                { title: "Música (Musicoterapia)", value: "IconMusic" },
                { title: "Corazón", value: "IconHeart" }
              ]
            }
          }
        ],
        preview: { select: { title: "label" } }
      }]
    }
  ],
  preview: { prepare: () => ({ title: "Programa Consultorios" }) }
};

export const programaTalleresPage: SchemaTypeDefinition = {
  name: "programaTalleresPage",
  title: "Programa Talleres",
  type: "document",
  fields: [
    { name: "heroSubtitle", title: "Subtítulo del hero", type: "string" },
    { name: "heroImagen", title: "Imagen de fondo del hero", type: "image", options: { hotspot: true } }
  ],
  preview: { prepare: () => ({ title: "Programa Talleres" }) }
};

export const programaEvaluacionesPage: SchemaTypeDefinition = {
  name: "programaEvaluacionesPage",
  title: "Programa Evaluaciones",
  type: "document",
  fields: baseFields("coral"),
  preview: { prepare: () => ({ title: "Programa Evaluaciones" }) }
};
