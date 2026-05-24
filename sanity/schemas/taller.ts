import type { SchemaTypeDefinition } from "sanity";

export const taller: SchemaTypeDefinition = {
  name: "taller",
  title: "Taller",
  type: "document",
  fields: [
    { name: "titulo", title: "Título", type: "string", validation: (r) => r.required() },
    { name: "dia", title: "Día", type: "string", validation: (r) => r.required() },
    { name: "horario", title: "Horario (ej: 17:00–18:30)", type: "string", validation: (r) => r.required() },
    { name: "destinatarios", title: "Destinatarios", type: "string", validation: (r) => r.required() },
    { name: "descripcion", title: "Descripción", type: "text", rows: 3 },
    { name: "visible", title: "Visible en el sitio", type: "boolean", initialValue: true },
    { name: "orden", title: "Orden de aparición (opcional)", type: "number" }
  ],
  orderings: [
    { title: "Orden manual", name: "ordenAsc", by: [{ field: "orden", direction: "asc" }] }
  ],
  preview: {
    select: { title: "titulo", subtitle: "destinatarios" }
  }
};
