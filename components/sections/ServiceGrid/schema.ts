import { z } from "zod";

export const ServiceItemSchema = z.object({
  href: z.string().min(1),
  color: z.enum(["celeste", "coral", "naranja"]),
  icon: z.enum(["users", "brain", "music", "book"]),
  title: z.string().min(1).max(120),
  desc: z.string().max(280),
});

export const ServiceGridSchema = z.object({
  eyebrow: z.string().max(80).default("Programas terapéuticos"),
  title: z.string().min(1).max(160).default("Nuestras líneas de trabajo"),
  intro: z
    .string()
    .max(400)
    .default(
      "Cuatro programas articulados, y un equipo interdisciplinario para acompañar cada etapa.",
    ),
  items: z.array(ServiceItemSchema).min(1).max(8),
});

export type ServiceItem = z.infer<typeof ServiceItemSchema>;
export type ServiceGridProps = z.infer<typeof ServiceGridSchema>;

export const ServiceGridDefaults: ServiceGridProps = {
  eyebrow: "Programas terapéuticos",
  title: "Nuestras líneas de trabajo",
  intro:
    "Cuatro programas articulados, y un equipo interdisciplinario para acompañar cada etapa.",
  items: [
    {
      href: "/programas-terapeuticos/cet",
      color: "celeste",
      icon: "users",
      title: "Centro Educativo Terapéutico",
      desc: "Programa integral con jornada simple o completa.",
    },
    {
      href: "/programas-terapeuticos/consultorios",
      color: "coral",
      icon: "brain",
      title: "Tratamiento en Consultorios Externos",
      desc: "Atención individual con profesionales especializados.",
    },
    {
      href: "/programas-terapeuticos/talleres",
      color: "naranja",
      icon: "music",
      title: "Talleres",
      desc: "Espacios grupales para fortalecer habilidades y vínculos.",
    },
    {
      href: "/programas-terapeuticos/evaluaciones-diagnosticas",
      color: "celeste",
      icon: "book",
      title: "Evaluaciones Diagnósticas",
      desc: "Procesos diagnósticos interdisciplinarios con informe escrito.",
    },
  ],
};
