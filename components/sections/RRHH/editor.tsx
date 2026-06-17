import type { SectionEditorMeta } from "@/lib/sections-types";

export const RRHHEditor: SectionEditorMeta = {
  label: "RR.HH. — Formulario CV",
  description: "Bloque texto + formulario de carga de CV (multipart/form-data).",
  icon: "Form",
  fieldGroups: [
    {
      name: "content",
      label: "Contenido",
      fields: [
        { name: "eyebrow", kind: "text", label: "Eyebrow" },
        { name: "title", kind: "text", label: "Título" },
        { name: "body", kind: "textarea", label: "Texto" },
        {
          name: "bullets",
          kind: "array",
          label: "Beneficios / bullets",
          itemFields: [{ name: "value", kind: "text", label: "Texto" }],
        },
      ],
    },
    {
      name: "form",
      label: "Formulario",
      fields: [
        {
          name: "areas",
          kind: "array",
          label: "Áreas del select",
          itemFields: [{ name: "value", kind: "text", label: "Área" }],
        },
      ],
    },
  ],
};
