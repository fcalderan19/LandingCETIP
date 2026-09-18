import { z } from "zod";

export const ELEMENT_KINDS = [
  "heading_1",
  "heading_2",
  "heading_3",
  "paragraph",
  "quote",
  "button",
  "image",
  "video",
  "divider",
  "spacer",
  "list",
] as const;

export type ElementKind = (typeof ELEMENT_KINDS)[number];

export const ElementSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(ELEMENT_KINDS),
  text: z.string().max(4000).optional(),
  align: z.enum(["left", "center", "right"]).optional(),
  src: z.string().max(2000).optional(),
  alt: z.string().max(300).optional(),
  caption: z.string().max(300).optional(),
  href: z.string().max(1000).optional(),
  variant: z.enum(["primary", "outline", "ghost"]).optional(),
  size: z.enum(["small", "medium", "large"]).optional(),
  items: z.array(z.string().max(400)).max(50).optional(),
  ordered: z.boolean().optional(),
  embedUrl: z.string().max(1000).optional(),
  cite: z.string().max(200).optional(),
  backgroundColor: z.string().max(20).optional(),
});

export type CustomBlockElement = z.infer<typeof ElementSchema>;

export const CustomBlockSchema = z.object({
  container: z.enum(["narrow", "medium", "wide", "full"]).default("medium"),
  background: z
    .enum(["white", "cream", "petroleo", "celeste", "custom"])
    .default("white"),
  backgroundColor: z.string().max(20).optional(),
  spacing: z.enum(["small", "medium", "large"]).default("medium"),
  elements: z.array(ElementSchema).max(80).default([]),
});

export type CustomBlockProps = z.infer<typeof CustomBlockSchema>;

export const CustomBlockDefaults: CustomBlockProps = {
  container: "medium",
  background: "white",
  backgroundColor: undefined,
  spacing: "medium",
  elements: [
    {
      id: "welcome",
      kind: "heading_2",
      text: "Un título para arrancar",
      align: "left",
    },
    {
      id: "intro",
      kind: "paragraph",
      text: "Usá el botón “+ Agregar elemento” para sumar títulos, párrafos, imágenes, botones y más. Podés reordenarlos y borrarlos cuando quieras.",
      align: "left",
    },
  ],
};
