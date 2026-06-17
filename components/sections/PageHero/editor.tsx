import type { SectionEditorMeta } from "@/lib/sections-types";

export const PageHeroEditor: SectionEditorMeta = {
  label: "Page Hero",
  description: "Hero compacto para páginas internas con breadcrumb opcional.",
  icon: "Hero",
  fieldGroups: [
    {
      name: "content",
      label: "Contenido",
      fields: [
        { name: "title", kind: "text", label: "Título" },
        { name: "subtitle", kind: "textarea", label: "Subtítulo" },
        { name: "image", kind: "image", label: "Imagen de fondo" },
        {
          name: "crumbs",
          kind: "array",
          label: "Breadcrumbs",
          itemFields: [
            { name: "label", kind: "text", label: "Texto" },
            { name: "href", kind: "link", label: "Link" },
          ],
        },
      ],
    },
  ],
};
