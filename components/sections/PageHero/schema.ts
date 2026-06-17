import { z } from "zod";

export const CrumbSchema = z.object({
  href: z.string().min(1),
  label: z.string().min(1).max(80),
});

export const PageHeroSchema = z.object({
  title: z.string().min(1).max(200),
  subtitle: z.string().max(400).optional(),
  image: z
    .string()
    .min(1)
    .default(
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=70",
    ),
  crumbs: z.array(CrumbSchema).max(6).default([]),
});

export type PageHeroProps = z.infer<typeof PageHeroSchema>;

export const PageHeroDefaults: PageHeroProps = {
  title: "Título de la página",
  subtitle: undefined,
  image:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=70",
  crumbs: [],
};
