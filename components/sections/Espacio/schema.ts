import { z } from "zod";

export const EspacioFotoSchema = z.object({
  src: z.string().min(1),
  alt: z.string().max(200),
  tall: z.boolean().default(false),
});

export const EspacioSchema = z.object({
  eyebrow: z.string().max(80).default("Nuestro espacio"),
  title: z.string().min(1).max(200),
  intro: z.string().max(400),
  fotos: z.array(EspacioFotoSchema).min(1).max(20),
});

export type EspacioFoto = z.infer<typeof EspacioFotoSchema>;
export type EspacioProps = z.infer<typeof EspacioSchema>;

export const EspacioDefaults: EspacioProps = {
  eyebrow: "Nuestro espacio",
  title: "Instalaciones pensadas para acompañar",
  intro:
    "Espacios cálidos, accesibles y equipados para el trabajo individual y grupal.",
  fotos: [
    {
      src: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=70",
      alt: "Sala de reuniones luminosa",
      tall: true,
    },
    {
      src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=70",
      alt: "Aula con material didáctico",
      tall: false,
    },
    {
      src: "https://images.unsplash.com/photo-1564769662533-4f00a87b4056?auto=format&fit=crop&w=600&q=70",
      alt: "Consultorio terapéutico",
      tall: false,
    },
    {
      src: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=600&q=70",
      alt: "Espacio común",
      tall: true,
    },
    {
      src: "https://images.unsplash.com/photo-1581090700227-1e8e9b9e2d7e?auto=format&fit=crop&w=600&q=70",
      alt: "Sala de juegos",
      tall: false,
    },
    {
      src: "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=600&q=70",
      alt: "Recepción",
      tall: false,
    },
  ],
};
