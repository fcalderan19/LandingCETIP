import { z } from "zod";

export const TeamListSchema = z.object({
  eyebrow: z.string().max(80).default("Nuestro equipo"),
  title: z
    .string()
    .min(1)
    .max(200)
    .default("Profesionales formados, comprometidos y cercanos"),
});

export type TeamListProps = z.infer<typeof TeamListSchema>;

export const TeamListDefaults: TeamListProps = {
  eyebrow: "Nuestro equipo",
  title: "Profesionales formados, comprometidos y cercanos",
};
