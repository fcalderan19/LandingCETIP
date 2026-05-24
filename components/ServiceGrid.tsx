import { IconBook, IconBrain, IconMusic, IconUsers } from "./Icons";

const items = [
  {
    href: "/programas-terapeuticos/cet",
    color: "celeste",
    icon: IconUsers,
    title: "Centro Educativo Terapéutico",
    desc: "Programa integral con jornada simple o completa."
  },
  {
    href: "/programas-terapeuticos/consultorios",
    color: "coral",
    icon: IconBrain,
    title: "Tratamiento en Consultorios Externos",
    desc: "Atención individual con profesionales especializados."
  },
  {
    href: "/programas-terapeuticos/talleres",
    color: "naranja",
    icon: IconMusic,
    title: "Talleres",
    desc: "Espacios grupales para fortalecer habilidades y vínculos."
  },
  {
    href: "/programas-terapeuticos/evaluaciones-diagnosticas",
    color: "celeste",
    icon: IconBook,
    title: "Evaluaciones Diagnósticas",
    desc: "Procesos diagnósticos interdisciplinarios con informe escrito."
  }
] as const;

const accents: Record<string, { ring: string; text: string; bg: string }> = {
  celeste: { ring: "hover:border-[var(--color-celeste)]", text: "text-[var(--color-celeste-600)]", bg: "bg-[var(--color-celeste)]/10" },
  coral: { ring: "hover:border-[var(--color-coral)]", text: "text-[var(--color-coral-600)]", bg: "bg-[var(--color-coral)]/10" },
  naranja: { ring: "hover:border-[var(--color-naranja)]", text: "text-[var(--color-naranja-600)]", bg: "bg-[var(--color-naranja)]/10" }
};

export default function ServiceGrid() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center reveal">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-celeste-600)]">Programas terapéuticos</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-[var(--color-petroleo)]">Nuestras líneas de trabajo</h2>
          <p className="mt-3 text-[var(--color-petroleo)]/75 max-w-2xl mx-auto">
            Cuatro programas articulados, y un equipo interdisciplinario para acompañar cada etapa.
          </p>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(({ href, color, icon: Icon, title, desc }, i) => {
            const a = accents[color];
            return (
              <a
                key={i}
                href={href}
                className={`group reveal block rounded-2xl bg-white border border-[var(--color-petroleo-100)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${a.ring}`}
              >
                <div className={`h-14 w-14 rounded-2xl grid place-items-center ${a.bg} ${a.text} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <Icon width={28} height={28} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[var(--color-petroleo)] leading-tight transition-colors group-hover:text-[var(--color-celeste-600)]">{title}</h3>
                <p className="mt-2 text-sm text-[var(--color-petroleo)]/75">{desc}</p>
                <span className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold ${a.text} transition-transform duration-300 group-hover:translate-x-1`}>
                  Ver más →
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
