import { z } from "zod";

export const JobOpeningsListSchema = z.object({
  eyebrow: z.string().max(80).default("Búsquedas activas"),
  title: z
    .string()
    .min(1)
    .max(200)
    .default("Nos encontramos en búsqueda de:"),
  intro: z
    .string()
    .max(400)
    .default(
      "Si alguna de estas posiciones te interesa, completá el formulario más abajo indicándola en el campo de área.",
    ),
});

export type JobOpeningsListProps = z.infer<typeof JobOpeningsListSchema>;

export const JobOpeningsListDefaults: JobOpeningsListProps = {
  eyebrow: "Búsquedas activas",
  title: "Nos encontramos en búsqueda de:",
  intro:
    "Si alguna de estas posiciones te interesa, completá el formulario más abajo indicándola en el campo de área.",
};
