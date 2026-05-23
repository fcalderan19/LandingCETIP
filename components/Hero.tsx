import { waLink } from "@/lib/site";
import { IconCheck, IconWhatsapp } from "./Icons";

export default function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[var(--color-petroleo-50)] via-white to-white" />
      <div className="mx-auto max-w-7xl px-4 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div className="reveal">
          <span className="inline-block bg-[var(--color-celeste)]/15 text-[var(--color-celeste-600)] font-semibold text-xs px-3 py-1 rounded-full">
            Equipo interdisciplinario · Atención centrada en la persona
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight text-[var(--color-petroleo)]">
            Acompañamos cada trayectoria con un{" "}
            <span className="text-[var(--color-coral)]">enfoque cálido</span> y profesional.
          </h1>
          <p className="mt-4 text-lg text-[var(--color-petroleo)]/80 max-w-xl">
            En CETIP brindamos atención educativo-terapéutica para niños, adolescentes y adultos,
            integrando consultorios externos, programas CET y talleres.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#servicios" className="bg-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-700)] text-white font-semibold px-5 py-3 rounded-full">
              Conocer servicios
            </a>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[var(--color-verde)] hover:bg-[var(--color-verde-600)] text-white font-semibold px-5 py-3 rounded-full"
            >
              <IconWhatsapp /> WhatsApp
            </a>
          </div>

          <ul className="mt-8 grid sm:grid-cols-3 gap-3">
            {[
              "Atendemos por obra social",
              "+20 años de experiencia",
              "Equipo interdisciplinario"
            ].map((t) => (
              <li key={t} className="flex items-start gap-2 bg-white border border-[var(--color-petroleo-100)] rounded-xl p-3 text-sm font-medium text-[var(--color-petroleo)] shadow-sm">
                <span className="text-[var(--color-verde)] mt-0.5"><IconCheck /></span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="reveal relative">
          <div className="aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-xl bg-[var(--color-petroleo-100)] relative">
            <img
              src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=900&q=70"
              alt="Profesional acompañando a un niño en una actividad educativa"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden md:block bg-white rounded-2xl shadow-lg p-4 border border-[var(--color-petroleo-100)] max-w-[220px]">
            <div className="text-xs uppercase font-semibold text-[var(--color-celeste-600)]">Atención</div>
            <div className="text-sm text-[var(--color-petroleo)] font-medium">Lun a Vie 8 a 19 hs</div>
          </div>
          <div className="absolute -top-4 -right-4 hidden md:block bg-[var(--color-coral)] text-white rounded-2xl shadow-lg p-4 max-w-[200px]">
            <div className="text-xs uppercase font-semibold opacity-80">Nuevo</div>
            <div className="text-sm font-medium">Talleres 2026 abiertos</div>
          </div>
        </div>
      </div>
    </section>
  );
}
