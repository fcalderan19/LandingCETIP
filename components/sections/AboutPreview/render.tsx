import type { AboutPreviewProps } from "./schema";

export default function AboutPreviewRender({
  eyebrow,
  title,
  body,
  ctaLabel,
  ctaHref,
  image,
  imageAlt,
}: AboutPreviewProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-2 gap-12 items-center">
        <div className="reveal order-2 md:order-1">
          <span className="text-xs font-semibold uppercase text-[var(--color-celeste-600)]">
            {eyebrow}
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-[var(--color-petroleo)]">
            {title}
          </h2>
          <p className="mt-4 text-[var(--color-petroleo)]/80 leading-relaxed">
            {body}
          </p>
          <a
            href={ctaHref}
            className="mt-6 inline-flex items-center gap-1 bg-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-700)] text-white font-semibold px-5 py-3 rounded-full transition-transform hover:translate-x-1"
          >
            {ctaLabel}
          </a>
        </div>
        <div className="reveal order-1 md:order-2">
          <div className="relative aspect-[5/4] rounded-3xl overflow-hidden shadow-xl group">
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
