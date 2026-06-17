"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  id: string;
  label: string;
  type: string;
  enabled: boolean;
  selected: boolean;
  onSelect: () => void;
  onToggle: () => void;
  onDelete: () => void;
};

export default function SectionCard({
  id,
  label,
  type,
  enabled,
  selected,
  onSelect,
  onToggle,
  onDelete,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 rounded-xl bg-white border p-3 ${
        selected
          ? "border-[var(--color-celeste)] ring-2 ring-[var(--color-celeste)]/30"
          : "border-[var(--color-petroleo-100)]"
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        type="button"
        aria-label="Arrastrar para reordenar"
        className="cursor-grab text-[var(--color-petroleo)]/40 hover:text-[var(--color-petroleo)] px-1 select-none"
      >
        ⋮⋮
      </button>
      <button
        type="button"
        onClick={onSelect}
        className="flex-1 text-left"
      >
        <div className={`font-semibold text-sm ${enabled ? "" : "line-through opacity-60"}`}>
          {label}
        </div>
        <div className="text-[10px] uppercase tracking-wide text-[var(--color-petroleo)]/50">
          {type}
        </div>
      </button>
      <button
        type="button"
        onClick={onToggle}
        title={enabled ? "Ocultar" : "Mostrar"}
        className="text-xs px-2 py-1 rounded hover:bg-[var(--color-petroleo-50)]"
      >
        {enabled ? "👁" : "🚫"}
      </button>
      <button
        type="button"
        onClick={onDelete}
        title="Eliminar"
        className="text-xs px-2 py-1 rounded hover:bg-[var(--color-petroleo-50)] text-[var(--color-coral)]"
      >
        ✕
      </button>
    </li>
  );
}
