import type { SchemaTypeDefinition } from "sanity";

export const busqueda: SchemaTypeDefinition = {
  name: "busqueda",
  title: "Búsqueda activa (RR.HH.)",
  type: "document",
  fields: [
    { name: "titulo", title: "Título del puesto", type: "string", validation: (r) => r.required() },
    {
      name: "area",
      title: "Área",
      type: "string",
      options: {
        list: [
          "Centro Educativo Terapéutico",
          "Tratamiento en Consultorios Externos",
          "Talleres",
          "Evaluaciones Diagnósticas",
          "Administración",
          "Otra"
        ]
      },
      validation: (r) => r.required()
    },
    {
      name: "modalidad",
      title: "Modalidad",
      type: "string",
      options: { list: ["Presencial", "Híbrido", "Remoto"] },
      initialValue: "Presencial"
    },
    { name: "jornada", title: "Jornada (ej: Mañana / Tarde / Jornada completa)", type: "string" },
    { name: "descripcion", title: "Descripción", type: "text", rows: 3 },
    { name: "activa", title: "Activa (visible en el sitio)", type: "boolean", initialValue: true },
    { name: "orden", title: "Orden de aparición (opcional)", type: "number" }
  ],
  orderings: [
    { title: "Orden manual", name: "ordenAsc", by: [{ field: "orden", direction: "asc" }] }
  ],
  preview: {
    select: { title: "titulo", subtitle: "area" }
  }
};
