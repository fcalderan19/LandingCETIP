import type { SectionEditorMeta } from "@/lib/sections-types";

export const AboutPreviewEditor: SectionEditorMeta = {
  label: "About Preview",
  description: "Bloque de texto + imagen lateral.",
  icon: "Article",
  fieldGroups: [
    {
      name: "content",
      label: "Contenido",
      fields: [
        { name: "eyebrow", kind: "text", label: "Eyebrow" },
        { name: "title", kind: "text", label: "Título" },
        { name: "body", kind: "textarea", label: "Texto" },
        { name: "ctaLabel", kind: "text", label: "Texto del botón" },
        { name: "ctaHref", kind: "link", label: "Link del botón" },
        { name: "image", kind: "image", label: "Imagen" },
        { name: "imageAlt", kind: "text", label: "Alt de la imagen" },
      ],
    },
  ],
};
