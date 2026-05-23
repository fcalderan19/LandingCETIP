import { IconBook, IconBrain, IconHand, IconHeart, IconMusic, IconSpeech, IconUsers } from "./Icons";

const consultorios = [
  { icon: IconBrain, label: "Psicología" },
  { icon: IconHand, label: "Terapia Ocupacional" },
  { icon: IconSpeech, label: "Fonoaudiología" },
  { icon: IconBook, label: "Psicopedagogía" },
  { icon: IconMusic, label: "Musicoterapia" },
  { icon: IconHeart, label: "Acompañamiento familiar" }
];

const talleres = [
  { titulo: "Habilidades sociales", dia: "Martes", hora: "17:00–18:30", destinatarios: "Adolescentes" },
  { titulo: "Arte y expresión", dia: "Miércoles", hora: "16:00–17:30", destinatarios: "Niños 8–12" },
  { titulo: "Autonomía e independencia", dia: "Jueves", hora: "18:00–19:30", destinatarios: "Adultos jóvenes" }
];

export default function Servicios() {
  return (
    <section id="servicios" className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center reveal">
          <span className="text-xs font-semibold uppercase text-[var(--color-celeste-600)]">Servicios</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-[var(--color-petroleo)]">
            Programas y prestaciones
          </h2>
          <p className="mt-3 text-[var(--color-petroleo)]/75 max-w-2xl mx-auto">
            Tres líneas de trabajo articuladas para acompañar cada etapa.
          </p>
        </div>

        {/* CET */}
        <div id="cet" className="mt-12 reveal">
          <article className="rounded-3xl overflow-hidden border border-[var(--color-petroleo-100)] shadow-sm grid md:grid-cols-5">
            <div className="md:col-span-2 bg-[var(--color-celeste)] text-white p-8 md:p-10 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 text-xs font-semibold w-fit">
                <IconUsers /> Centro Educativo Terapéutico
              </div>
              <h3 className="mt-3 text-2xl md:text-3xl font-bold">CET</h3>
              <p className="mt-2 text-white/90">
                Programa integral para niños, adolescentes y jóvenes, con jornada simple o completa.
                Trabajo educativo y terapéutico personalizado.
              </p>
              <a href="#contacto" className="mt-6 inline-flex w-fit bg-white text-[var(--color-celeste-600)] font-semibold px-5 py-2.5 rounded-full hover:bg-white/90">
                Solicitar info
              </a>
            </div>
            <div className="md:col-span-3 p-8 md:p-10 bg-white">
              <ul className="grid sm:grid-cols-2 gap-4 text-sm">
                <li><strong>Edades:</strong> 4 a 25 años</li>
                <li><strong>Modalidad:</strong> Jornada simple / completa</li>
                <li><strong>Frecuencia:</strong> A definir según PII</li>
                <li><strong>Cobertura:</strong> Obras sociales y prepagas</li>
              </ul>
              <p className="mt-4 text-[var(--color-petroleo)]/80 text-sm">
                Equipo interdisciplinario que diseña un Proyecto Individual de Intervención (PII)
                para cada concurrente, articulando con escuela, familia y prestadores externos.
              </p>
            </div>
          </article>
        </div>

        {/* Consultorios */}
        <div id="consultorios" className="mt-10 reveal">
          <article className="rounded-3xl overflow-hidden border border-[var(--color-petroleo-100)] shadow-sm grid md:grid-cols-5">
            <div className="md:col-span-2 bg-[var(--color-coral)] text-white p-8 md:p-10 flex flex-col justify-center order-1 md:order-2">
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 text-xs font-semibold w-fit">
                Consultorios Externos
              </div>
              <h3 className="mt-3 text-2xl md:text-3xl font-bold">Atención individual</h3>
              <p className="mt-2 text-white/90">
                Reservá un turno con profesionales especializados en distintas disciplinas.
              </p>
              <a href="#contacto" className="mt-6 inline-flex w-fit bg-white text-[var(--color-coral-600)] font-semibold px-5 py-2.5 rounded-full hover:bg-white/90">
                Reservar turno
              </a>
            </div>
            <div className="md:col-span-3 p-8 md:p-10 bg-white order-2 md:order-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {consultorios.map(({ icon: Icon, label }) => (
                  <div key={label} className="rounded-xl border border-[var(--color-petroleo-100)] p-4 flex flex-col items-center text-center hover:border-[var(--color-coral)] transition">
                    <span className="text-[var(--color-coral)]"><Icon width={26} height={26} /></span>
                    <span className="mt-2 text-sm font-medium text-[var(--color-petroleo)]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>

        {/* Talleres */}
        <div id="talleres" className="mt-10 reveal">
          <article className="rounded-3xl overflow-hidden border border-[var(--color-petroleo-100)] shadow-sm grid md:grid-cols-5">
            <div className="md:col-span-2 bg-[var(--color-naranja)] text-white p-8 md:p-10 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 text-xs font-semibold w-fit">
                Talleres
              </div>
              <h3 className="mt-3 text-2xl md:text-3xl font-bold">Espacios grupales</h3>
              <p className="mt-2 text-white/90">
                Propuestas grupales para fortalecer habilidades, vínculos y autonomía.
              </p>
              <a href="#contacto" className="mt-6 inline-flex w-fit bg-white text-[var(--color-naranja-600)] font-semibold px-5 py-2.5 rounded-full hover:bg-white/90">
                Inscribirme
              </a>
            </div>
            <div className="md:col-span-3 p-8 md:p-10 bg-white grid sm:grid-cols-3 gap-4">
              {talleres.map((t) => (
                <div key={t.titulo} className="rounded-xl border border-[var(--color-petroleo-100)] p-4 hover:border-[var(--color-naranja)] transition">
                  <h4 className="font-semibold text-[var(--color-petroleo)]">{t.titulo}</h4>
                  <p className="text-xs text-[var(--color-petroleo)]/70 mt-1">{t.dia} · {t.hora}</p>
                  <span className="inline-block mt-3 text-xs font-medium px-2 py-1 rounded-full bg-[var(--color-naranja)]/15 text-[var(--color-naranja-600)]">
                    {t.destinatarios}
                  </span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
