import { z } from "zod";

export const HeaderConfigSchema = z.object({
  showTopBar: z.boolean().default(true),
  showAddress: z.boolean().default(true),
  showPhone: z.boolean().default(true),
  showHours: z.boolean().default(true),
  showEmail: z.boolean().default(true),
  showWhatsapp: z.boolean().default(true),
  showSocials: z.boolean().default(true),
  ctaLabel: z.string().max(60).default("Contactanos"),
  ctaHref: z.string().max(300).default("/contacto"),
});
export type HeaderConfig = z.infer<typeof HeaderConfigSchema>;

export const FooterConfigSchema = z.object({
  showDescription: z.boolean().default(true),
  showContactInfo: z.boolean().default(true),
  showSocials: z.boolean().default(true),
  copyright: z.string().max(240).default(""),
  extraNote: z.string().max(400).default(""),
});
export type FooterConfig = z.infer<typeof FooterConfigSchema>;
