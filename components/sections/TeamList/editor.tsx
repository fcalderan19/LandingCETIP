import type { SectionEditorMeta } from "@/lib/sections-types";

export const TeamListEditor: SectionEditorMeta = {
  label: "Listado del equipo",
  description:
    "Renderiza el listado de profesionales desde la colección 'Equipo'. Editá los items en /admin/professionals.",
  icon: "Users",
  fieldGroups: [
    {
      name: "header",
      label: "Encabezado",
      fields: [
        { name: "eyebrow", kind: "text", label: "Eyebrow" },
        { name: "title", kind: "text", label: "Título" },
      ],
    },
  ],
};
