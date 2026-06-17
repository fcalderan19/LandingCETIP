import { getJobOpenings } from "@/lib/collections";
import { IconCheck } from "@/components/Icons";
import type { JobOpeningsListProps } from "./schema";

export default async function JobOpeningsListRender({
  eyebrow,
  title,
  intro,
}: JobOpeningsListProps) {
  const items = await getJobOpenings();
  if (items.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-[var(--color-petroleo-50)]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center reveal max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase text-[var(--color-coral-600)]">
            {eyebrow}
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-[var(--color-petroleo)]">
            {title}
          </h2>
          <p className="mt-3 text-[var(--color-petroleo)]/75">{intro}</p>
        </div>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((b) => (
            <article
              key={b.id}
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
                  <p className="text-xs text-[var(--color-petroleo)]/60 mt-0.5">
                    {b.area}
                  </p>
                </div>
              </div>

              {b.descripcion && (
                <p className="text-sm text-[var(--color-petroleo)]/75 mt-3">
                  {b.descripcion}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-[var(--color-celeste)]/15 text-[var(--color-celeste-600)]">
                  {b.modalidad}
                </span>
                {b.jornada && (
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-[var(--color-naranja)]/15 text-[var(--color-naranja-600)]">
                    {b.jornada}
                  </span>
                )}
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
