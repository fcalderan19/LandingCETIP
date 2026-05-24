import type { SchemaTypeDefinition } from "sanity";

export const nuestroEspacioPage: SchemaTypeDefinition = {
  name: "nuestroEspacioPage",
  title: "Página Nuestro Espacio",
  type: "document",
  fields: [
    { name: "heroSubtitle", title: "Subtítulo del hero", type: "string" },
    { name: "eyebrow", title: "Eyebrow", type: "string" },
    { name: "titulo", title: "Título de la sección", type: "string" },
    { name: "intro", title: "Texto introductorio", type: "text", rows: 3 },
    {
      name: "galeria",
      title: "Galería de fotos",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "imagen", title: "Foto", type: "image", options: { hotspot: true }, validation: (r) => r.required() },
          { name: "alt", title: "Descripción (alt)", type: "string" },
          {
            name: "size",
            title: "Tamaño",
            type: "string",
            options: { list: ["normal", "alto"] },
            initialValue: "normal",
            description: "'alto' ocupa el doble de altura en la masonry"
          }
        ],
        preview: { select: { title: "alt", media: "imagen" } }
      }]
    }
  ],
  preview: { prepare: () => ({ title: "Página Nuestro Espacio" }) }
};
