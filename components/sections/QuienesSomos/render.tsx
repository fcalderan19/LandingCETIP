import type { QuienesSomosProps } from "./schema";

export default function QuienesSomosRender({
  eyebrow,
  title,
  body,
  pilares,
  image,
  imageAlt,
}: QuienesSomosProps) {
  return (
    <section id="quienes-somos" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-2 gap-12 items-center">
        <div className="reveal order-2 md:order-1">
          <span className="text-xs font-semibold tracking-wide uppercase text-[var(--color-celeste-600)]">
            {eyebrow}
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-[var(--color-petroleo)]">
            {title}
          </h2>
          <p className="mt-4 text-[var(--color-petroleo)]/80 leading-relaxed">
            {body}
          </p>
          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            {pilares.map((b) => (
              <div
                key={b.t}
                className="rounded-2xl border border-[var(--color-petroleo-100)] bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[var(--color-coral)]"
              >
                <div className="font-semibold text-[var(--color-coral)]">
                  {b.t}
                </div>
                <p className="text-sm text-[var(--color-petroleo)]/80 mt-1">
                  {b.d}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="reveal order-1 md:order-2">
          <div className="aspect-[5/4] rounded-3xl overflow-hidden shadow-xl group">
            <img
              src={image}
              alt={imageAlt}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
