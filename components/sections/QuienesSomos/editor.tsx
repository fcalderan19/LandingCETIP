import type { SectionEditorMeta } from "@/lib/sections-types";

export const QuienesSomosEditor: SectionEditorMeta = {
  label: "Quiénes Somos",
  description: "Bloque texto + grid de pilares + imagen lateral.",
  icon: "Info",
  fieldGroups: [
    {
      name: "content",
      label: "Contenido",
      fields: [
        { name: "eyebrow", kind: "text", label: "Eyebrow" },
        { name: "title", kind: "text", label: "Título" },
        { name: "body", kind: "textarea", label: "Texto" },
        { name: "image", kind: "image", label: "Imagen" },
        { name: "imageAlt", kind: "text", label: "Alt de la imagen" },
      ],
    },
    {
      name: "pilares",
      label: "Pilares",
      fields: [
        {
          name: "pilares",
          kind: "array",
          label: "Pilares",
          itemFields: [
            { name: "t", kind: "text", label: "Título" },
            { name: "d", kind: "textarea", label: "Descripción" },
          ],
        },
      ],
    },
  ],
};
