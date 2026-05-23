"use client";
import { useState } from "react";
import { IconClose } from "./Icons";

const fotos = [
  { src: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=70", alt: "Sala de reuniones luminosa", h: "row-span-2" },
  { src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=70", alt: "Aula con material didáctico", h: "" },
  { src: "https://images.unsplash.com/photo-1564769662533-4f00a87b4056?auto=format&fit=crop&w=600&q=70", alt: "Consultorio terapéutico", h: "" },
  { src: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=600&q=70", alt: "Espacio común", h: "row-span-2" },
  { src: "https://images.unsplash.com/photo-1581090700227-1e8e9b9e2d7e?auto=format&fit=crop&w=600&q=70", alt: "Sala de juegos", h: "" },
  { src: "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=600&q=70", alt: "Recepción", h: "" }
];

export default function Espacio() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <section id="espacio" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center reveal">
          <span className="text-xs font-semibold uppercase text-[var(--color-celeste-600)]">Nuestro espacio</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-[var(--color-petroleo)]">Instalaciones pensadas para acompañar</h2>
          <p className="mt-3 text-[var(--color-petroleo)]/75 max-w-2xl mx-auto">
            Espacios cálidos, accesibles y equipados para el trabajo individual y grupal.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 grid-rows-[200px_200px] md:grid-rows-[260px_260px] gap-3 reveal">
          {fotos.map((f, i) => (
            <button
              key={i}
              onClick={() => setLightbox(i)}
              className={`relative overflow-hidden rounded-2xl group ${f.h}`}
            >
              <img src={f.src} alt={f.alt} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition" />
              <span className="sr-only">Ampliar imagen</span>
            </button>
          ))}
        </div>
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/80 grid place-items-center p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <button className="absolute top-4 right-4 text-white" aria-label="Cerrar">
            <IconClose width={28} height={28} />
          </button>
          <img src={fotos[lightbox].src} alt={fotos[lightbox].alt} className="max-h-[85vh] max-w-[95vw] rounded-xl shadow-2xl" />
        </div>
      )}
    </section>
  );
}
