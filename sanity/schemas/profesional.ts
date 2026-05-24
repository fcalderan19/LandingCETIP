import type { SchemaTypeDefinition } from "sanity";

export const profesional: SchemaTypeDefinition = {
  name: "profesional",
  title: "Equipo — Profesional",
  type: "document",
  fields: [
    { name: "nombre", title: "Nombre y apellido", type: "string", validation: (r) => r.required() },
    { name: "rol", title: "Rol / cargo", type: "string", validation: (r) => r.required() },
    {
      name: "disciplina",
      title: "Disciplina",
      type: "string",
      options: {
        list: [
          "Psicología",
          "Fonoaudiología",
          "Terapia Ocupacional",
          "Psicopedagogía",
          "Musicoterapia",
          "Coordinación",
          "Otra"
        ]
      },
      validation: (r) => r.required()
    },
    {
      name: "foto",
      title: "Foto",
      type: "image",
      options: { hotspot: true }
    },
    { name: "descripcion", title: "Descripción breve (opcional)", type: "text", rows: 3 },
    { name: "orden", title: "Orden de aparición (opcional)", type: "number" }
  ],
  orderings: [
    { title: "Orden manual", name: "ordenAsc", by: [{ field: "orden", direction: "asc" }] },
    { title: "Nombre A→Z", name: "nombreAsc", by: [{ field: "nombre", direction: "asc" }] }
  ],
  preview: {
    select: { title: "nombre", subtitle: "rol", media: "foto" }
  }
};
