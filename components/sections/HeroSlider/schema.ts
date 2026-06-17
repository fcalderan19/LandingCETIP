import { z } from "zod";

export const HeroSlideSchema = z.object({
  eyebrow: z.string().max(80),
  title: z.string().min(1).max(200),
  desc: z.string().max(400),
  ctaHref: z.string().min(1).max(500),
  ctaLabel: z.string().min(1).max(80),
  image: z.string().min(1),
  accent: z.enum(["celeste", "coral", "naranja"]),
});

export const HeroSliderSchema = z.object({
  slides: z.array(HeroSlideSchema).min(1).max(8),
  intervalMs: z.number().int().min(2000).max(20000).default(6500),
});

export type HeroSlide = z.infer<typeof HeroSlideSchema>;
export type HeroSliderProps = z.infer<typeof HeroSliderSchema>;

export const HeroSliderDefaults: HeroSliderProps = {
  intervalMs: 6500,
  slides: [
    {
      eyebrow: "Centro Educativo Terapéutico",
      title:
        "Acompañamos cada trayectoria con un enfoque cálido y profesional",
      desc: "Equipo interdisciplinario que diseña intervenciones personalizadas para niños, adolescentes y adultos.",
      ctaHref: "/programas-terapeuticos",
      ctaLabel: "Conocer servicios",
      image: "/img/actividad-huerta.jpg",
      accent: "celeste",
    },
    {
      eyebrow: "Talleres",
      title:
        "Espacios grupales para fortalecer habilidades y vínculos",
      desc: "Arte, expresión, autonomía, habilidades sociales y mucho más.",
      ctaHref: "/programas-terapeuticos/talleres",
      ctaLabel: "Ver talleres",
      image: "/img/taller-arte.jpg",
      accent: "naranja",
    },
    {
      eyebrow: "Consultorios Externos",
      title: "Atención individual con profesionales especializados",
      desc: "Psicología, fonoaudiología, terapia ocupacional, psicopedagogía, musicoterapia y más.",
      ctaHref: "/programas-terapeuticos/consultorios",
      ctaLabel: "Reservar turno",
      image:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1600&q=70",
      accent: "coral",
    },
  ],
};
