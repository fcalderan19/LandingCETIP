import {
  IconBook,
  IconBrain,
  IconMusic,
  IconUsers,
} from "@/components/Icons";
import type { ServiceGridProps, ServiceItem } from "./schema";

const iconMap = {
  users: IconUsers,
  brain: IconBrain,
  music: IconMusic,
  book: IconBook,
} as const;

const accents: Record<
  ServiceItem["color"],
  { ring: string; text: string; bg: string }
> = {
  celeste: {
    ring: "hover:border-[var(--color-celeste)]",
    text: "text-[var(--color-celeste-600)]",
    bg: "bg-[var(--color-celeste)]/10",
  },
  coral: {
    ring: "hover:border-[var(--color-coral)]",
    text: "text-[var(--color-coral-600)]",
    bg: "bg-[var(--color-coral)]/10",
  },
  naranja: {
    ring: "hover:border-[var(--color-naranja)]",
    text: "text-[var(--color-naranja-600)]",
    bg: "bg-[var(--color-naranja)]/10",
  },
};

export default function ServiceGridRender({
  eyebrow,
  title,
  intro,
  items,
}: ServiceGridProps) {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center reveal">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-celeste-600)]">
            {eyebrow}
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-[var(--color-petroleo)]">
            {title}
          </h2>
          <p className="mt-3 text-[var(--color-petroleo)]/75 max-w-2xl mx-auto">
            {intro}
          </p>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => {
            const a = accents[item.color];
            const Icon = iconMap[item.icon];
            return (
              <a
                key={i}
                href={item.href}
                className={`group reveal block rounded-2xl bg-white border border-[var(--color-petroleo-100)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${a.ring}`}
              >
                <div
                  className={`h-14 w-14 rounded-2xl grid place-items-center ${a.bg} ${a.text} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <Icon width={28} height={28} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[var(--color-petroleo)] leading-tight transition-colors group-hover:text-[var(--color-celeste-600)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--color-petroleo)]/75">
                  {item.desc}
                </p>
                <span
                  className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold ${a.text} transition-transform duration-300 group-hover:translate-x-1`}
                >
                  Ver más →
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
