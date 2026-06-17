import type { SectionEditorMeta } from "@/lib/sections-types";

export const HeroSliderEditor: SectionEditorMeta = {
  label: "Hero Slider",
  description: "Carrusel principal con autoplay. Ideal para la home.",
  icon: "Slideshow",
  fieldGroups: [
    {
      name: "general",
      label: "General",
      fields: [
        { name: "intervalMs", kind: "number", label: "Intervalo (ms)" },
      ],
    },
    {
      name: "slides",
      label: "Slides",
      fields: [
        {
          name: "slides",
          kind: "array",
          label: "Slides",
          itemFields: [
            { name: "eyebrow", kind: "text", label: "Eyebrow" },
            { name: "title", kind: "text", label: "Título" },
            { name: "desc", kind: "textarea", label: "Descripción" },
            { name: "image", kind: "image", label: "Imagen de fondo" },
            { name: "ctaLabel", kind: "text", label: "Texto del botón" },
            { name: "ctaHref", kind: "link", label: "Link del botón" },
            {
              name: "accent",
              kind: "select",
              label: "Color de acento",
              options: [
                { value: "celeste", label: "Celeste" },
                { value: "coral", label: "Coral" },
                { value: "naranja", label: "Naranja" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
