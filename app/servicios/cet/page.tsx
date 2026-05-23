import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { IconCheck } from "@/components/Icons";

export const metadata: Metadata = { title: "CET — Centro Educativo Terapéutico | CETIP" };

const datos = [
  ["Edades", "4 a 25 años"],
  ["Modalidad", "Jornada simple / completa"],
  ["Frecuencia", "Según PII"],
  ["Cobertura", "Obras sociales y prepagas"]
];

const features = [
  "Proyecto Individual de Intervención (PII) para cada concurrente",
  "Articulación con escuela, familia y prestadores externos",
  "Espacios individuales y grupales",
  "Trabajo interdisciplinario semanal",
  "Talleres expresivos, deportivos y de habilidades sociales"
];

export default function Page() {
  return (
    <>
      <PageHero
        title="CET — Centro Educativo Terapéutico"
        subtitle="Programa integral con jornada simple o completa para niños, adolescentes y jóvenes."
        image="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=70"
        crumbs={[
          { href: "/servicios", label: "Servicios" },
          { href: "/servicios/cet", label: "CET" }
        ]}
      />
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 reveal">
            <h2 className="text-3xl font-bold text-[var(--color-petroleo)]">Acompañamiento integral</h2>
            <p className="mt-4 text-[var(--color-petroleo)]/80 leading-relaxed">
              El CET es un dispositivo educativo y terapéutico orientado a personas con discapacidad
              y/o trastornos del desarrollo. Construimos un proyecto a medida con cada familia,
              centrado en el bienestar, la autonomía y la inclusión.
            </p>

            <ul className="mt-6 space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3 transition-colors hover:text-[var(--color-celeste-600)]">
                  <span className="text-[var(--color-celeste)] mt-0.5"><IconCheck /></span>
                  <span className="text-[var(--color-petroleo)]">{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/contacto?motivo=CET"
              className="mt-8 inline-flex items-center gap-1 bg-[var(--color-celeste)] hover:bg-[var(--color-celeste-600)] text-white font-semibold px-6 py-3 rounded-full transition-all hover:translate-x-1 hover:shadow-lg"
            >
              Solicitar info →
            </Link>
          </div>

          <aside className="lg:col-span-2 reveal">
            <div className="rounded-3xl bg-[var(--color-celeste)] text-white p-6 shadow-lg">
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
