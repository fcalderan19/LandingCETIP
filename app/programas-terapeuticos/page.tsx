import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { IconBook, IconBrain, IconMusic, IconUsers } from "@/components/Icons";

export const metadata: Metadata = { title: "Programas Terapéuticos | CETIP" };

const services = [
  {
    href: "/programas-terapeuticos/cet",
    color: "celeste",
    icon: IconUsers,
    title: "Centro Educativo Terapéutico",
    desc: "Programa integral con jornada simple o completa. Proyecto Individual de Intervención para cada concurrente.",
    bullets: ["4 a 25 años", "Equipo interdisciplinario", "Articulación con escuela y familia"]
  },
  {
    href: "/programas-terapeuticos/consultorios",
    color: "coral",
    icon: IconBrain,
    title: "Tratamiento en Consultorios Externos",
    desc: "Atención individual con profesionales especializados en distintas disciplinas terapéuticas.",
    bullets: ["Psicología · TO · Fonoaudiología", "Psicopedagogía · Musicoterapia", "Obras sociales y prepagas"]
  },
  {
    href: "/programas-terapeuticos/talleres",
    color: "naranja",
    icon: IconMusic,
    title: "Talleres",
    desc: "Espacios grupales para fortalecer habilidades sociales, vínculos, autonomía y expresión.",
    bullets: ["Niños y adolescentes", "Adultos jóvenes", "Cupos limitados"]
  },
  {
    href: "/programas-terapeuticos/evaluaciones-diagnosticas",
    color: "celeste",
    icon: IconBook,
    title: "Evaluaciones Diagnósticas",
    desc: "Procesos diagnósticos interdisciplinarios con devolución e informe escrito.",
    bullets: ["3 a 6 encuentros", "Todas las edades", "Orientación terapéutica"]
  }
] as const;

const colors: Record<string, { bar: string; ring: string; text: string }> = {
  celeste: { bar: "bg-[var(--color-celeste)]", ring: "hover:border-[var(--color-celeste)]", text: "text-[var(--color-celeste-600)]" },
  coral: { bar: "bg-[var(--color-coral)]", ring: "hover:border-[var(--color-coral)]", text: "text-[var(--color-coral-600)]" },
  naranja: { bar: "bg-[var(--color-naranja)]", ring: "hover:border-[var(--color-naranja)]", text: "text-[var(--color-naranja-600)]" }
};

export default function Page() {
  return (
    <>
      <PageHero
        title="Programas Terapéuticos"
        subtitle="Cuatro líneas de trabajo articuladas para acompañar cada etapa."
        crumbs={[{ href: "/programas-terapeuticos", label: "Programas Terapéuticos" }]}
      />
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map(({ href, color, icon: Icon, title, desc, bullets }) => {
            const c = colors[color];
            return (
              <a
                key={href}
                href={href}
                className={`group reveal flex flex-col rounded-3xl bg-white border border-[var(--color-petroleo-100)] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${c.ring} overflow-hidden`}
              >
                <div className={`h-2 w-full ${c.bar}`} />
                <div className="p-6 flex flex-col grow">
                  <div className={`h-14 w-14 rounded-2xl grid place-items-center ${c.bar} text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <Icon width={28} height={28} />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-[var(--color-petroleo)] leading-tight">{title}</h3>
                  <p className="mt-2 text-sm text-[var(--color-petroleo)]/75">{desc}</p>
                  <ul className="mt-4 space-y-1 text-sm text-[var(--color-petroleo)]/80">
                    {bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${c.bar}`} />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <span className={`mt-6 inline-flex items-center gap-1 text-sm font-semibold ${c.text} transition-transform duration-300 group-hover:translate-x-1`}>
                    Ver más →
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </>
  );
}
