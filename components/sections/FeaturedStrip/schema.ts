import { z } from "zod";

export const FeaturedCardSchema = z.object({
  href: z.string().min(1),
  image: z.string().min(1),
  accent: z.enum(["coral", "celeste", "naranja", "petroleo"]),
  blobSide: z.enum(["right-bottom", "left-top"]).default("right-bottom"),
  eyebrow: z.string().max(80),
  title: z.string().min(1).max(160),
  desc: z.string().max(400),
  ctaLabel: z.string().min(1).max(80),
});

export const FeaturedStripSchema = z.object({
  cards: z.array(FeaturedCardSchema).min(1).max(4),
});

export type FeaturedCard = z.infer<typeof FeaturedCardSchema>;
export type FeaturedStripProps = z.infer<typeof FeaturedStripSchema>;

export const FeaturedStripDefaults: FeaturedStripProps = {
  cards: [
    {
      href: "/rrhh",
      image: "/img/taller-arte.jpg",
      accent: "coral",
      blobSide: "right-bottom",
      eyebrow: "Sumate al equipo",
      title: "¿Sos profesional? Cargá tu CV",
      desc: "Buscamos profesionales con vocación y formación sólida para integrar nuestros equipos.",
      ctaLabel: "Ir a RR.HH. →",
    },
    {
      href: "/nuestro-espacio",
      image: "/img/actividad-huerta.jpg",
      accent: "celeste",
      blobSide: "left-top",
      eyebrow: "Visita virtual",
      title: "Conocé nuestras instalaciones",
      desc: "Espacios cálidos, accesibles y equipados para el trabajo individual y grupal.",
      ctaLabel: "Ver galería →",
    },
  ],
};
