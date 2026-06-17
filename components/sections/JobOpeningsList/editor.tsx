import type { SectionEditorMeta } from "@/lib/sections-types";

export const JobOpeningsListEditor: SectionEditorMeta = {
  label: "Búsquedas activas",
  description:
    "Lista de búsquedas activas. Items se editan en /admin/job-openings.",
  icon: "Briefcase",
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
  ],
};
