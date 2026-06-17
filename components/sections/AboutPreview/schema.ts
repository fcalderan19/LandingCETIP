import { z } from "zod";

export const AboutPreviewSchema = z.object({
  eyebrow: z.string().max(80).default("Quiénes somos"),
  title: z.string().min(1).max(160),
  body: z.string().min(1).max(800),
  ctaLabel: z.string().min(1).max(80).default("Conocer más →"),
  ctaHref: z.string().min(1).max(500).default("/quienes-somos"),
  image: z.string().min(1),
  imageAlt: z.string().max(160).default(""),
});

export type AboutPreviewProps = z.infer<typeof AboutPreviewSchema>;

export const AboutPreviewDefaults: AboutPreviewProps = {
  eyebrow: "Quiénes somos",
  title: "Especialistas en abordaje educativo-terapéutico",
  body: "En CETIP creemos en una intervención humana, respetuosa y basada en evidencia. Nuestro equipo interdisciplinario trabaja en conjunto con familias, escuelas y profesionales derivantes para acompañar procesos de aprendizaje, autonomía y bienestar.",
  ctaLabel: "Conocer más →",
  ctaHref: "/quienes-somos",
  image: "/img/actividad-huerta.jpg",
  imageAlt: "Actividad de huerta con concurrente y profesional",
};
