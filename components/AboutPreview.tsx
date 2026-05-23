import Link from "next/link";

export default function AboutPreview() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-2 gap-12 items-center">
        <div className="reveal order-2 md:order-1">
          <span className="text-xs font-semibold uppercase text-[var(--color-celeste-600)]">Quiénes somos</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-[var(--color-petroleo)]">
            Especialistas en abordaje educativo-terapéutico
          </h2>
          <p className="mt-4 text-[var(--color-petroleo)]/80 leading-relaxed">
            En CETIP creemos en una intervención humana, respetuosa y basada en evidencia. Nuestro
            equipo interdisciplinario trabaja en conjunto con familias, escuelas y profesionales
            derivantes para acompañar procesos de aprendizaje, autonomía y bienestar.
          </p>
          <Link
            href="/quienes-somos"
            className="mt-6 inline-flex items-center gap-1 bg-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-700)] text-white font-semibold px-5 py-3 rounded-full transition-transform hover:translate-x-1"
          >
            Conocer más →
          </Link>
        </div>
        <div className="reveal order-1 md:order-2">
          <div className="relative aspect-[5/4] rounded-3xl overflow-hidden shadow-xl group">
            <img
              src="/img/actividad-huerta.jpg"
              alt="Actividad de huerta con concurrente y profesional"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
