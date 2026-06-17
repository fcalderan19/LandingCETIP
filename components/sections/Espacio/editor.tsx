import type { SectionEditorMeta } from "@/lib/sections-types";

export const EspacioEditor: SectionEditorMeta = {
  label: "Galería de Espacio",
  description: "Galería con lightbox de fotos del espacio.",
  icon: "Gallery",
  fieldGroups: [
    {
      name: "header",
      label: "Encabezado",
      fields: [
        { name: "eyebrow", kind: "text", label: "Eyebrow" },
        { name: "title", kind: "text", label: "Título" },
        { name: "intro", kind: "textarea", label: "Intro" },
      ],
    },
    {
      name: "fotos",
      label: "Fotos",
      fields: [
        {
          name: "fotos",
          kind: "array",
          label: "Fotos",
          itemFields: [
            { name: "src", kind: "image", label: "Imagen" },
            { name: "alt", kind: "text", label: "Alt text" },
            { name: "tall", kind: "boolean", label: "Doble alto" },
          ],
        },
      ],
    },
  ],
};
