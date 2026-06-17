"use client";
import { useState } from "react";
import { IconClose } from "@/components/Icons";
import type { EspacioProps } from "./schema";

export default function EspacioRender({
  eyebrow,
  title,
  intro,
  fotos,
}: EspacioProps) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <section id="espacio" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center reveal">
          <span className="text-xs font-semibold uppercase text-[var(--color-celeste-600)]">
            {eyebrow}
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-[var(--color-petroleo)]">
            {title}
          </h2>
          <p className="mt-3 text-[var(--color-petroleo)]/75 max-w-2xl mx-auto">
            {intro}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 grid-rows-[200px_200px] md:grid-rows-[260px_260px] gap-3 reveal">
          {fotos.map((f, i) => (
            <button
              key={i}
              onClick={() => setLightbox(i)}
              className={`relative overflow-hidden rounded-2xl group shadow-sm hover:shadow-xl transition-shadow ${f.tall ? "row-span-2" : ""}`}
            >
              <img
                src={f.src}
                alt={f.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <span className="absolute inset-0 bg-[var(--color-petroleo)]/0 group-hover:bg-[var(--color-petroleo)]/30 transition-colors duration-300" />
              <span className="sr-only">Ampliar imagen</span>
            </button>
          ))}
        </div>
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/80 grid place-items-center p-4 anim-fade"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            className="absolute top-4 right-4 text-white hover:rotate-90 transition-transform"
            aria-label="Cerrar"
          >
            <IconClose width={28} height={28} />
          </button>
          <img
            src={fotos[lightbox].src}
            alt={fotos[lightbox].alt}
            className="max-h-[85vh] max-w-[95vw] rounded-xl shadow-2xl anim-pop"
          />
        </div>
      )}
    </section>
  );
}
