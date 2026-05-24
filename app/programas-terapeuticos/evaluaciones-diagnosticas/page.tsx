import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { IconCheck } from "@/components/Icons";

export const metadata: Metadata = { title: "Evaluaciones Diagnósticas | CETIP" };

const incluye = [
  "Entrevista de admisión con la familia",
  "Evaluación interdisciplinaria personalizada",
  "Aplicación de escalas y pruebas estandarizadas",
  "Devolución diagnóstica con informe escrito",
  "Orientación terapéutica y sugerencias de tratamiento"
];

const datos = [
  ["Modalidad", "Presencial"],
  ["Duración estimada", "3 a 6 encuentros"],
  ["Edades", "Niños, adolescentes y adultos"],
  ["Cobertura", "Obras sociales y particular"]
];

export default function Page() {
  return (
    <>
      <PageHero
        title="Evaluaciones Diagnósticas"
        subtitle="Procesos diagnósticos interdisciplinarios para orientar la intervención terapéutica."
        image="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1600&q=70"
        crumbs={[
          { href: "/programas-terapeuticos", label: "Programas Terapéuticos" },
          { href: "/programas-terapeuticos/evaluaciones-diagnosticas", label: "Evaluaciones Diagnósticas" }
        ]}
      />
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 reveal">
            <h2 className="text-3xl font-bold text-[var(--color-petroleo)]">¿Qué incluye el proceso?</h2>
            <p className="mt-4 text-[var(--color-petroleo)]/80 leading-relaxed">
              Las evaluaciones diagnósticas en CETIP se realizan en un marco de respeto, escucha
              activa y rigurosidad clínica. Cada proceso se diseña en función del motivo de
              consulta y permite arribar a un diagnóstico claro y a un plan de intervención
              ajustado a cada persona.
            </p>

            <ul className="mt-6 space-y-3">
              {incluye.map((f) => (
                <li key={f} className="flex items-start gap-3 transition-colors hover:text-[var(--color-coral-600)]">
                  <span className="text-[var(--color-coral)] mt-0.5"><IconCheck /></span>
                  <span className="text-[var(--color-petroleo)]">{f}</span>
                </li>
              ))}
            </ul>

            <a
              href="/admision?programa=Evaluaciones%20Diagn%C3%B3sticas"
              className="mt-8 inline-flex items-center gap-1 bg-[var(--color-coral)] hover:bg-[var(--color-coral-600)] text-white font-semibold px-6 py-3 rounded-full transition-all hover:translate-x-1 hover:shadow-lg"
            >
              Solicitar evaluación →
            </a>
          </div>

          <aside className="lg:col-span-2 reveal">
            <div className="rounded-3xl bg-[var(--color-coral)] text-white p-6 shadow-lg">
              <h3 className="text-xl font-semibold">Datos clave</h3>
              <dl className="mt-4 space-y-3">
                {datos.map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 border-b border-white/20 pb-2">
                    <dt className="text-sm text-white/80">{k}</dt>
                    <dd className="font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
