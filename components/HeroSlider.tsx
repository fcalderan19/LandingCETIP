"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { waLink } from "@/lib/site";
import { IconWhatsapp } from "./Icons";

type Slide = {
  eyebrow: string;
  title: string;
  desc: string;
  ctaHref: string;
  ctaLabel: string;
  image: string;
  accent: "celeste" | "coral" | "naranja";
};

const slides: Slide[] = [
  {
    eyebrow: "Centro Educativo Terapéutico",
    title: "Acompañamos cada trayectoria con un enfoque cálido y profesional",
    desc: "Equipo interdisciplinario que diseña intervenciones personalizadas para niños, adolescentes y adultos.",
    ctaHref: "/programas-terapeuticos",
    ctaLabel: "Conocer servicios",
    image: "/img/actividad-huerta.jpg",
    accent: "celeste"
  },
  {
    eyebrow: "Talleres",
    title: "Espacios grupales para fortalecer habilidades y vínculos",
    desc: "Arte, expresión, autonomía, habilidades sociales y mucho más.",
    ctaHref: "/programas-terapeuticos/talleres",
    ctaLabel: "Ver talleres",
    image: "/img/taller-arte.jpg",
    accent: "naranja"
  },
  {
    eyebrow: "Consultorios Externos",
    title: "Atención individual con profesionales especializados",
    desc: "Psicología, fonoaudiología, terapia ocupacional, psicopedagogía, musicoterapia y más.",
    ctaHref: "/programas-terapeuticos/consultorios",
    ctaLabel: "Reservar turno",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1600&q=70",
    accent: "coral"
  }
];

const accentBg: Record<Slide["accent"], string> = {
  celeste: "bg-[var(--color-celeste)]",
  coral: "bg-[var(--color-coral)]",
  naranja: "bg-[var(--color-naranja)]"
};

export default function HeroSlider() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 6500);
    return () => clearInterval(t);
  }, []);

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
                <Link href={s.ctaHref} className="bg-white text-[var(--color-petroleo)] font-semibold px-5 py-3 rounded-full hover:bg-white/90">
                  {s.ctaLabel}
                </Link>
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
