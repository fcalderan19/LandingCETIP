import type { SectionEditorMeta } from "@/lib/sections-types";

export const CustomBlockEditor: SectionEditorMeta = {
  label: "Bloque personalizado",
  description:
    "Armá tu propio bloque combinando títulos, párrafos, botones, imágenes y más — sin escribir código.",
  icon: "Blocks",
  fieldGroups: [
    {
      name: "layout",
      label: "Diseño",
      description: "Ancho, fondo y espacios generales del bloque.",
      fields: [
        {
          name: "container",
          kind: "select",
          label: "Ancho del contenido",
          options: [
            { value: "narrow", label: "Angosto (ideal para texto)" },
            { value: "medium", label: "Medio (recomendado)" },
            { value: "wide", label: "Ancho" },
            { value: "full", label: "Sin límite" },
          ],
        },
        {
          name: "background",
          kind: "select",
          label: "Color de fondo",
          options: [
            { value: "white", label: "Blanco" },
            { value: "cream", label: "Crema suave" },
            { value: "petroleo", label: "Petróleo (oscuro)" },
            { value: "celeste", label: "Celeste" },
            { value: "custom", label: "Personalizado…" },
          ],
        },
        {
          name: "backgroundColor",
          kind: "color",
          label: "Color personalizado (opcional)",
          description:
            'Se usa solo si elegiste "Personalizado" arriba.',
        },
        {
          name: "spacing",
          kind: "select",
          label: "Espacio vertical",
          options: [
            { value: "small", label: "Compacto" },
            { value: "medium", label: "Normal" },
            { value: "large", label: "Generoso" },
          ],
        },
      ],
    },
    {
      name: "content",
      label: "Contenido",
      description:
        'Usá "+ Agregar elemento" para sumar bloques (títulos, párrafos, botones, imágenes, listas y más).',
      fields: [
        {
          name: "elements",
          kind: "block_elements",
          label: "Elementos del bloque",
        },
      ],
    },
  ],
};
