import type { SectionEditorMeta } from "@/lib/sections-types";

export const FeaturedStripEditor: SectionEditorMeta = {
  label: "Featured Strip",
  description: "Tira de 2-4 cards destacadas con overlay de color.",
  icon: "Cards",
  fieldGroups: [
    {
      name: "cards",
      label: "Cards",
      fields: [
        {
          name: "cards",
          kind: "array",
          label: "Cards",
          itemFields: [
            { name: "eyebrow", kind: "text", label: "Eyebrow" },
            { name: "title", kind: "text", label: "Título" },
            { name: "desc", kind: "textarea", label: "Descripción" },
            { name: "image", kind: "image", label: "Imagen de fondo" },
            { name: "ctaLabel", kind: "text", label: "Texto del botón" },
            { name: "href", kind: "link", label: "Link" },
            {
              name: "accent",
              kind: "select",
              label: "Color overlay",
              options: [
                { value: "coral", label: "Coral" },
                { value: "celeste", label: "Celeste" },
                { value: "naranja", label: "Naranja" },
                { value: "petroleo", label: "Petróleo" },
              ],
            },
            {
              name: "blobSide",
              kind: "select",
              label: "Decoración",
              options: [
                { value: "right-bottom", label: "Abajo-derecha" },
                { value: "left-top", label: "Arriba-izquierda" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
