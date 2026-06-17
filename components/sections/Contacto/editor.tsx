import type { SectionEditorMeta } from "@/lib/sections-types";

export const ContactoEditor: SectionEditorMeta = {
  label: "Contacto",
  description: "Datos de contacto + mapa embebido + CTA WhatsApp.",
  icon: "Mail",
  fieldGroups: [
    {
      name: "header",
      label: "Encabezado",
      fields: [
        { name: "eyebrow", kind: "text", label: "Eyebrow" },
        { name: "title", kind: "text", label: "Título" },
      ],
    },
    {
      name: "datos",
      label: "Datos",
      description:
        "Por default se toman de Configuración del sitio. Sobreescribir solo si esta página necesita datos distintos.",
      fields: [
        { name: "address", kind: "text", label: "Dirección" },
        { name: "phoneDisplay", kind: "text", label: "Teléfono (mostrar)" },
        { name: "phoneTel", kind: "text", label: "Teléfono (tel:)" },
        { name: "email", kind: "text", label: "Email" },
        { name: "hours", kind: "text", label: "Horarios" },
        {
          name: "whatsappCtaLabel",
          kind: "text",
          label: "Texto botón WhatsApp",
        },
        { name: "mapsEmbed", kind: "text", label: "URL embed de Maps" },
      ],
    },
  ],
};
