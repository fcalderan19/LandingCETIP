import { z } from "zod";
import { site } from "@/lib/site";

export const ContactoSchema = z.object({
  eyebrow: z.string().max(80).default("Contacto"),
  title: z.string().min(1).max(160).default("Cómo encontrarnos"),
  address: z.string().min(1).max(300),
  phoneDisplay: z.string().min(1).max(80),
  phoneTel: z.string().min(1).max(80),
  email: z.string().min(1).max(200),
  hours: z.string().min(1).max(200),
  whatsappCtaLabel: z
    .string()
    .min(1)
    .max(80)
    .default("Escribinos por WhatsApp"),
  mapsEmbed: z.string().min(1).max(1000),
});

export type ContactoProps = z.infer<typeof ContactoSchema>;

export const ContactoDefaults: ContactoProps = {
  eyebrow: "Contacto",
  title: "Cómo encontrarnos",
  address: site.address,
  phoneDisplay: site.phoneDisplay,
  phoneTel: site.phoneTel,
  email: site.email,
  hours: site.hours,
  whatsappCtaLabel: "Escribinos por WhatsApp",
  mapsEmbed: site.mapsEmbed,
};
