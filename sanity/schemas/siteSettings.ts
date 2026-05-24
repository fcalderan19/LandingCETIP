import type { SchemaTypeDefinition } from "sanity";

export const siteSettings: SchemaTypeDefinition = {
  name: "siteSettings",
  title: "Configuración del sitio",
  type: "document",
  groups: [
    { name: "general", title: "General" },
    { name: "contacto", title: "Contacto" },
    { name: "redes", title: "Redes sociales" }
  ],
  fields: [
    { name: "nombre", title: "Nombre del sitio", type: "string", group: "general", validation: (r) => r.required() },
    { name: "tagline", title: "Tagline corto (footer)", type: "string", group: "general" },
    { name: "descripcion", title: "Descripción (meta)", type: "text", rows: 2, group: "general" },
    { name: "logo", title: "Logo", type: "image", group: "general", options: { hotspot: true } },

    { name: "direccion", title: "Dirección", type: "string", group: "contacto" },
    { name: "telefonoDisplay", title: "Teléfono (visible)", type: "string", group: "contacto" },
    { name: "telefonoLink", title: "Teléfono (link tel:)", type: "string", description: "Formato +5491144445555", group: "contacto" },
    { name: "whatsapp", title: "Número de WhatsApp (sin + ni espacios)", type: "string", group: "contacto" },
    { name: "whatsappMensaje", title: "Mensaje pre-cargado de WhatsApp", type: "string", group: "contacto" },
    { name: "email", title: "Email de contacto", type: "string", group: "contacto" },
    { name: "horarios", title: "Horarios", type: "string", group: "contacto" },
    { name: "googleMapsEmbed", title: "URL del Google Maps embed", type: "url", description: "El src del iframe de Google Maps", group: "contacto" },

    { name: "instagram", title: "Instagram URL", type: "url", group: "redes" },
    { name: "facebook", title: "Facebook URL", type: "url", group: "redes" }
  ],
  preview: { prepare: () => ({ title: "Configuración del sitio" }) }
};
