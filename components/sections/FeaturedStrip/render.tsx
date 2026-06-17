import type { FeaturedCard, FeaturedStripProps } from "./schema";

const overlay: Record<FeaturedCard["accent"], string> = {
  coral: "bg-[var(--color-coral)]/85",
  celeste: "bg-[var(--color-celeste)]/85",
  naranja: "bg-[var(--color-naranja)]/85",
  petroleo: "bg-[var(--color-petroleo)]/85",
};

const ctaText: Record<FeaturedCard["accent"], string> = {
  coral: "text-[var(--color-coral-600)]",
  celeste: "text-[var(--color-celeste-600)]",
  naranja: "text-[var(--color-naranja-600)]",
  petroleo: "text-[var(--color-petroleo-700)]",
};

const blobPos: Record<FeaturedCard["blobSide"], string> = {
  "right-bottom": "-right-10 -bottom-10",
  "left-top": "-left-10 -top-10",
};

export default function FeaturedStripRender({ cards }: FeaturedStripProps) {
  return (
    <section className="py-16 md:py-20 bg-[var(--color-petroleo-50)]">
      <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-2 gap-6">
        {cards.map((c, i) => (
          <a
            key={i}
            href={c.href}
            className="group reveal relative overflow-hidden rounded-3xl text-white p-8 md:p-10 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <img
              src={c.image}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div
              className={`absolute inset-0 ${overlay[c.accent]} mix-blend-multiply`}
            />
            <div
              className={`absolute ${blobPos[c.blobSide]} w-52 h-52 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-125`}
            />
            <div className="relative">
              <span className="inline-block bg-white/20 text-xs font-semibold uppercase px-3 py-1 rounded-full">
                {c.eyebrow}
              </span>
              <h3 className="mt-3 text-2xl md:text-3xl font-bold">{c.title}</h3>
              <p className="mt-2 text-white/90 max-w-md">{c.desc}</p>
              <span
                className={`mt-5 inline-flex items-center gap-1 bg-white ${ctaText[c.accent]} font-semibold px-5 py-2.5 rounded-full transition-transform duration-300 group-hover:translate-x-1`}
              >
                {c.ctaLabel}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
