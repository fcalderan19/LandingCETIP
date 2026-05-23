import Link from "next/link";

export default function FeaturedStrip() {
  return (
    <section className="py-16 md:py-20 bg-[var(--color-petroleo-50)]">
      <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-2 gap-6">
        <Link
          href="/rrhh"
          className="group reveal relative overflow-hidden rounded-3xl text-white p-8 md:p-10 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
        >
          <img src="/img/taller-arte.jpg" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-[var(--color-coral)]/85 mix-blend-multiply" />
          <div className="absolute -right-10 -bottom-10 w-52 h-52 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-125" />
          <div className="relative">
            <span className="inline-block bg-white/20 text-xs font-semibold uppercase px-3 py-1 rounded-full">Sumate al equipo</span>
            <h3 className="mt-3 text-2xl md:text-3xl font-bold">¿Sos profesional? Cargá tu CV</h3>
            <p className="mt-2 text-white/90 max-w-md">
              Buscamos profesionales con vocación y formación sólida para integrar nuestros equipos.
            </p>
            <span className="mt-5 inline-flex items-center gap-1 bg-white text-[var(--color-coral-600)] font-semibold px-5 py-2.5 rounded-full transition-transform duration-300 group-hover:translate-x-1">
              Ir a RR.HH. →
            </span>
          </div>
        </Link>

        <Link
          href="/nuestro-espacio"
          className="group reveal relative overflow-hidden rounded-3xl text-white p-8 md:p-10 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
        >
          <img src="/img/actividad-huerta.jpg" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-[var(--color-celeste)]/85 mix-blend-multiply" />
          <div className="absolute -left-10 -top-10 w-52 h-52 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-125" />
          <div className="relative">
            <span className="inline-block bg-white/20 text-xs font-semibold uppercase px-3 py-1 rounded-full">Visita virtual</span>
            <h3 className="mt-3 text-2xl md:text-3xl font-bold">Conocé nuestras instalaciones</h3>
            <p className="mt-2 text-white/90 max-w-md">
              Espacios cálidos, accesibles y equipados para el trabajo individual y grupal.
            </p>
            <span className="mt-5 inline-flex items-center gap-1 bg-white text-[var(--color-celeste-600)] font-semibold px-5 py-2.5 rounded-full transition-transform duration-300 group-hover:translate-x-1">
              Ver galería →
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
