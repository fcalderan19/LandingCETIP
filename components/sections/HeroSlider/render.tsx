"use client";
import { useEffect, useState } from "react";
import { waLink } from "@/lib/site";
import { IconWhatsapp } from "@/components/Icons";
import type { HeroSliderProps, HeroSlide } from "./schema";

const accentBg: Record<HeroSlide["accent"], string> = {
  celeste: "bg-[var(--color-celeste)]",
  coral: "bg-[var(--color-coral)]",
  naranja: "bg-[var(--color-naranja)]",
};

export default function HeroSliderRender({
  slides,
  intervalMs = 6500,
}: HeroSliderProps) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), intervalMs);
    return () => clearInterval(t);
  }, [slides.length, intervalMs]);

  return (
    <section className="relative isolate overflow-hidden h-[560px] md:h-[640px]">
      {slides.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-700 ${idx === i ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <img src={s.image} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-petroleo)]/85 via-[var(--color-petroleo)]/55 to-transparent" />
          <div className="relative z-10 mx-auto max-w-7xl h-full px-4 flex items-center">
            <div className="text-white max-w-2xl">
              <span className={`inline-block ${accentBg[s.accent]} text-white text-xs font-semibold uppercase px-3 py-1 rounded-full`}>
                {s.eyebrow}
              </span>
              <h1 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight">{s.title}</h1>
              <p className="mt-4 text-white/90 text-lg max-w-xl">{s.desc}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={s.ctaHref} className="bg-white text-[var(--color-petroleo)] font-semibold px-5 py-3 rounded-full hover:bg-white/90">
                  {s.ctaLabel}
                </a>
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[var(--color-verde)] hover:bg-[var(--color-verde-600)] text-white font-semibold px-5 py-3 rounded-full">
                  <IconWhatsapp /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            aria-label={`Ir al slide ${idx + 1}`}
            onClick={() => setI(idx)}
            className={`h-2.5 rounded-full transition-all ${idx === i ? "w-8 bg-white" : "w-2.5 bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  );
}
