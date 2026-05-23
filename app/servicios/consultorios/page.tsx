import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { IconBook, IconBrain, IconHand, IconHeart, IconMusic, IconSpeech } from "@/components/Icons";

export const metadata: Metadata = { title: "Consultorios Externos | CETIP" };

const especialidades = [
  { icon: IconBrain, label: "Psicología" },
  { icon: IconHand, label: "Terapia Ocupacional" },
  { icon: IconSpeech, label: "Fonoaudiología" },
  { icon: IconBook, label: "Psicopedagogía" },
  { icon: IconMusic, label: "Musicoterapia" },
  { icon: IconHeart, label: "Acompañamiento familiar" }
];

export default function Page() {
  return (
    <>
      <PageHero
        title="Consultorios Externos"
        subtitle="Atención individual con profesionales especializados en distintas disciplinas."
        image="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1600&q=70"
        crumbs={[
          { href: "/servicios", label: "Servicios" },
          { href: "/servicios/consultorios", label: "Consultorios" }
        ]}
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center reveal max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-[var(--color-petroleo)]">Especialidades</h2>
            <p className="mt-3 text-[var(--color-petroleo)]/75">
              Reservá un turno con el equipo. Atendemos por obra social y particular.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
            {especialidades.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="group reveal rounded-2xl border border-[var(--color-petroleo-100)] p-6 flex flex-col items-center text-center bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[var(--color-coral)]"
              >
                <span className="h-14 w-14 rounded-2xl grid place-items-center bg-[var(--color-coral)]/10 text-[var(--color-coral)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Icon width={28} height={28} />
                </span>
                <span className="mt-3 font-semibold text-[var(--color-petroleo)]">{label}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 reveal">
            <Link
              href="/contacto?motivo=Consultorios"
              className="inline-flex items-center gap-1 bg-[var(--color-coral)] hover:bg-[var(--color-coral-600)] text-white font-semibold px-6 py-3 rounded-full transition-all hover:translate-x-1 hover:shadow-lg"
            >
              Reservar turno →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
