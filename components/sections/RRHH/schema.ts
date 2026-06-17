import { z } from "zod";

export const RRHHSchema = z.object({
  eyebrow: z.string().max(80).default("Postulate"),
  title: z.string().min(1).max(160).default("Cargá tu CV"),
  body: z.string().min(1).max(800),
  bullets: z.array(z.string().min(1).max(160)).max(8).default([]),
  areas: z.array(z.string().min(1).max(160)).min(1).max(20),
});

export type RRHHProps = z.infer<typeof RRHHSchema>;

export const RRHHDefaults: RRHHProps = {
  eyebrow: "Postulate",
  title: "Cargá tu CV",
  body: "Buscamos profesionales con vocación, formación sólida y trabajo en equipo. Si te interesa sumarte a CETIP, dejanos tus datos y tu CV. Nos pondremos en contacto cuando haya una búsqueda compatible.",
  bullets: [
    "Capacitación interna continua",
    "Trabajo interdisciplinario",
    "Ambiente cálido y colaborativo",
  ],
  areas: [
    "Centro Educativo Terapéutico",
    "Tratamiento en Consultorios Externos",
    "Talleres",
    "Evaluaciones Diagnósticas",
    "Administración",
    "Otra",
  ],
};
