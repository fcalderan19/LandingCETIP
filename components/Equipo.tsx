"use client";
import { useMemo, useState } from "react";

type Pro = { nombre: string; rol: string; disciplina: Disciplina; foto: string };
type Disciplina = "Todos" | "Psicología" | "Fonoaudiología" | "Terapia Ocupacional" | "Psicopedagogía";

const disciplinas: Disciplina[] = ["Todos", "Psicología", "Fonoaudiología", "Terapia Ocupacional", "Psicopedagogía"];

const equipo: Pro[] = [
  { nombre: "Lic. María González", rol: "Coordinadora — Psicóloga", disciplina: "Psicología", foto: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=70" },
  { nombre: "Lic. Juan Pérez", rol: "Fonoaudiólogo", disciplina: "Fonoaudiología", foto: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=70" },
  { nombre: "Lic. Camila Ríos", rol: "Terapeuta Ocupacional", disciplina: "Terapia Ocupacional", foto: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=70" },
  { nombre: "Lic. Sofía Méndez", rol: "Psicopedagoga", disciplina: "Psicopedagogía", foto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=70" },
  { nombre: "Lic. Diego Torres", rol: "Psicólogo Infantil", disciplina: "Psicología", foto: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=70" },
  { nombre: "Lic. Paula Bravo", rol: "Fonoaudióloga", disciplina: "Fonoaudiología", foto: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=70" }
];

export default function Equipo() {
  const [filtro, setFiltro] = useState<Disciplina>("Todos");
  const lista = useMemo(() => (filtro === "Todos" ? equipo : equipo.filter((p) => p.disciplina === filtro)), [filtro]);

  return (
    <section id="equipo" className="py-16 md:py-24 bg-[var(--color-petroleo-50)]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center reveal">
          <span className="text-xs font-semibold uppercase text-[var(--color-celeste-600)]">Nuestro equipo</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-[var(--color-petroleo)]">
            Profesionales formados, comprometidos y cercanos
          </h2>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {disciplinas.map((d) => (
            <button
              key={d}
              onClick={() => setFiltro(d)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 hover:-translate-y-0.5 ${
                filtro === d
                  ? "bg-[var(--color-petroleo)] text-white border-[var(--color-petroleo)] shadow-md"
                  : "bg-white text-[var(--color-petroleo)] border-[var(--color-petroleo-100)] hover:border-[var(--color-celeste)] hover:shadow"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lista.map((p) => (
            <article key={p.nombre} className="group reveal bg-white rounded-2xl overflow-hidden shadow-sm border border-[var(--color-petroleo-100)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[var(--color-celeste)]">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={p.foto} alt={p.nombre} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-[var(--color-petroleo)] transition-colors group-hover:text-[var(--color-celeste-600)]">{p.nombre}</h3>
                <p className="text-sm text-[var(--color-petroleo)]/70 mt-1">{p.rol}</p>
                <span className="inline-block mt-3 text-xs font-medium px-2 py-1 rounded-full bg-[var(--color-celeste)]/15 text-[var(--color-celeste-600)] transition-colors group-hover:bg-[var(--color-celeste)] group-hover:text-white">
                  {p.disciplina}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
