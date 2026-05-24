import { IconCheck } from "./Icons";

type Busqueda = {
  titulo: string;
  area: string;
  modalidad: string;
  jornada: string;
  descripcion?: string;
};

const busquedas: Busqueda[] = [
  {
    titulo: "Fonoaudióloga/o",
    area: "Consultorios Externos",
    modalidad: "Presencial",
    jornada: "Tarde",
    descripcion: "Para sumarse al equipo de tratamientos individuales con niños y adolescentes."
  },
  {
    titulo: "Orientador/a de Sala",
    area: "Centro Educativo Terapéutico",
    modalidad: "Presencial",
    jornada: "Jornada completa",
    descripcion: "Acompañamiento educativo-terapéutico en sala con adolescentes y adultos jóvenes."
  },
  {
    titulo: "Psicólogo/a Infantil",
    area: "Consultorios Externos",
    modalidad: "Presencial",
    jornada: "Mañana",
    descripcion: "Atención clínica individual a niños de 6 a 12 años. Experiencia en TEA deseable."
  }
];

export default function BusquedasActivas() {
  if (busquedas.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-[var(--color-petroleo-50)]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center reveal max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase text-[var(--color-coral-600)]">Búsquedas activas</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-[var(--color-petroleo)]">
            Nos encontramos en búsqueda de:
          </h2>
          <p className="mt-3 text-[var(--color-petroleo)]/75">
            Si alguna de estas posiciones te interesa, completá el formulario más abajo indicándola en el campo de área.
          </p>
        </div>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {busquedas.map((b) => (
            <article
              key={b.titulo}
              className="group reveal rounded-2xl bg-white border border-[var(--color-petroleo-100)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[var(--color-coral)]"
            >
              <div className="flex items-start gap-3">
                <span className="mt-1 h-9 w-9 grid place-items-center rounded-xl bg-[var(--color-coral)]/10 text-[var(--color-coral)]">
                  <IconCheck />
                </span>
                <div className="grow">
                  <h3 className="font-semibold text-[var(--color-petroleo)] leading-tight">
                    {b.titulo}
                  </h3>
                  <p className="text-xs text-[var(--color-petroleo)]/60 mt-0.5">{b.area}</p>
                </div>
              </div>

              {b.descripcion && (
                <p className="text-sm text-[var(--color-petroleo)]/75 mt-3">{b.descripcion}</p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-[var(--color-celeste)]/15 text-[var(--color-celeste-600)]">
                  {b.modalidad}
                </span>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-[var(--color-naranja)]/15 text-[var(--color-naranja-600)]">
                  {b.jornada}
                </span>
              </div>

              <a
                href={`#rrhh-form?area=${encodeURIComponent(b.titulo)}`}
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-coral-600)] transition-transform group-hover:translate-x-1"
              >
                Postularme →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
