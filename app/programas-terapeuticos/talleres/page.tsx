import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "Talleres | CETIP" };

const talleres = [
  { titulo: "Habilidades sociales", dia: "Martes", hora: "17:00–18:30", destinatarios: "Adolescentes", desc: "Espacio grupal para desarrollar comunicación, vínculos y resolución de conflictos." },
  { titulo: "Arte y expresión", dia: "Miércoles", hora: "16:00–17:30", destinatarios: "Niños 8–12", desc: "Exploración creativa a través de pintura, collage y modelado." },
  { titulo: "Autonomía e independencia", dia: "Jueves", hora: "18:00–19:30", destinatarios: "Adultos jóvenes", desc: "Trabajo sobre habilidades para la vida diaria y la inserción laboral." },
  { titulo: "Música y movimiento", dia: "Viernes", hora: "16:00–17:00", destinatarios: "Niños 4–7", desc: "Estimulación musical, ritmo y juego corporal." }
];

export default function Page() {
  return (
    <>
      <PageHero
        title="Talleres"
        subtitle="Espacios grupales para fortalecer habilidades, vínculos y autonomía."
        image="https://images.unsplash.com/photo-1530021232320-687d8e3dba54?auto=format&fit=crop&w=1600&q=70"
        crumbs={[
          { href: "/programas-terapeuticos", label: "Programas Terapéuticos" },
          { href: "/programas-terapeuticos/talleres", label: "Talleres" }
        ]}
      />
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid sm:grid-cols-2 gap-6">
            {talleres.map((t) => (
              <article
                key={t.titulo}
                className="group reveal rounded-2xl bg-white border border-[var(--color-petroleo-100)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[var(--color-naranja)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-[var(--color-petroleo)] text-lg">{t.titulo}</h3>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-[var(--color-naranja)]/15 text-[var(--color-naranja-600)] whitespace-nowrap">
                    {t.destinatarios}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-petroleo)]/75 mt-2">{t.desc}</p>
                <p className="text-sm text-[var(--color-petroleo)]/70 mt-3">
                  <strong className="text-[var(--color-petroleo)]">{t.dia}</strong> · {t.hora}
                </p>
                <a
                  href={`/contacto?motivo=Talleres&taller=${encodeURIComponent(t.titulo)}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-naranja-600)] transition-transform group-hover:translate-x-1"
                >
                  Inscribirme →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
