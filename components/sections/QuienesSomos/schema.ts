import { z } from "zod";

export const PilarSchema = z.object({
  t: z.string().min(1).max(60),
  d: z.string().min(1).max(280),
});

export const QuienesSomosSchema = z.object({
  eyebrow: z.string().max(80).default("Quiénes somos"),
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(800),
  pilares: z.array(PilarSchema).min(1).max(6),
  image: z.string().min(1),
  imageAlt: z.string().max(160).default(""),
});

export type Pilar = z.infer<typeof PilarSchema>;
export type QuienesSomosProps = z.infer<typeof QuienesSomosSchema>;

export const QuienesSomosDefaults: QuienesSomosProps = {
  eyebrow: "Quiénes somos",
  title: "Un espacio integral pensado para cada trayectoria.",
  body: "En CETIP creemos en una intervención humana, respetuosa y basada en evidencia. Nuestro equipo interdisciplinario trabaja en conjunto con familias, escuelas y profesionales derivantes para acompañar procesos de aprendizaje, autonomía y bienestar.",
  pilares: [
    { t: "Misión", d: "Promover el desarrollo integral de cada persona." },
    { t: "Visión", d: "Ser referentes en abordaje educativo-terapéutico." },
    { t: "Enfoque", d: "Centrado en la persona, su familia y su contexto." },
  ],
  image: "/img/taller-arte.jpg",
  imageAlt: "Taller de arte en CETIP",
};
