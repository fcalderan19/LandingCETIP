import type { SectionEditorMeta } from "@/lib/sections-types";

const colorOptions = [
  { value: "celeste", label: "Celeste" },
  { value: "coral", label: "Coral" },
  { value: "naranja", label: "Naranja" },
];

const iconOptions = [
  { value: "users", label: "Usuarios" },
  { value: "brain", label: "Cerebro" },
  { value: "music", label: "Música" },
  { value: "book", label: "Libro" },
];

export const ServiceGridEditor: SectionEditorMeta = {
  label: "Service Grid",
  description: "Grilla de servicios/programas con íconos.",
  icon: "Grid",
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
      name: "items",
      label: "Servicios",
      fields: [
        {
          name: "items",
          kind: "array",
          label: "Items",
          itemFields: [
            { name: "title", kind: "text", label: "Título" },
            { name: "desc", kind: "textarea", label: "Descripción" },
            { name: "href", kind: "link", label: "Link" },
            { name: "color", kind: "select", label: "Color", options: colorOptions },
            { name: "icon", kind: "select", label: "Ícono", options: iconOptions },
          ],
        },
      ],
    },
  ],
};
