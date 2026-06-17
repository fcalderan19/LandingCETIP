"use client";

type CatalogItem = { type: string; label: string; description?: string };

export default function SectionPalette({
  items,
  onAdd,
  disabled,
}: {
  items: CatalogItem[];
  onAdd: (type: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2">
      <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-[var(--color-petroleo)]/60 mr-1">
        Agregar:
      </span>
      {items.map((it) => (
        <button
          key={it.type}
          type="button"
          disabled={disabled}
          onClick={() => onAdd(it.type)}
          title={it.description}
          className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full border border-[var(--color-petroleo-100)] bg-white hover:bg-[var(--color-petroleo)] hover:text-white hover:border-[var(--color-petroleo)] transition disabled:opacity-50"
        >
          <span aria-hidden="true">+</span> {it.label}
        </button>
      ))}
    </div>
  );
}
