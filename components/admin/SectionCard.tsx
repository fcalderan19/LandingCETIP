"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  SectionIcon,
  IconChevronUp,
  IconChevronDown,
  IconDrag,
  IconEye,
  IconEyeOff,
  IconTrash,
} from "./AdminIcons";

type Props = {
  id: string;
  label: string;
  type: string;
  iconName?: string;
  enabled: boolean;
  selected: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onSelect: () => void;
  onToggle: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
};

export default function SectionCard({
  id,
  label,
  type,
  iconName,
  enabled,
  selected,
  canMoveUp,
  canMoveDown,
  onSelect,
  onToggle,
  onDelete,
  onMoveUp,
  onMoveDown,
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
      className={`group relative flex items-stretch gap-1 rounded-xl bg-white border transition ${
        selected
          ? "border-[var(--color-celeste)] ring-2 ring-[var(--color-celeste)]/25 shadow-sm"
          : "border-[var(--color-petroleo-100)] hover:border-[var(--color-petroleo-200)] hover:shadow-sm"
      } ${enabled ? "" : "opacity-70"}`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        type="button"
        aria-label="Arrastrar para reordenar"
        title="Arrastrar"
        className="shrink-0 flex items-center justify-center px-1.5 cursor-grab text-[var(--color-petroleo)]/30 hover:text-[var(--color-petroleo)] rounded-l-xl hover:bg-[var(--color-petroleo-50)] select-none"
      >
        <IconDrag size={16} />
      </button>

      {/* Body */}
      <button
        type="button"
        onClick={onSelect}
        className="flex-1 flex items-center gap-2.5 py-2.5 pr-2 text-left min-w-0"
      >
        <span
          aria-hidden="true"
          className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition ${
            selected
              ? "bg-[var(--color-celeste)]/15 text-[var(--color-celeste-600)]"
              : "bg-[var(--color-petroleo-50)] text-[var(--color-petroleo)]/70 group-hover:text-[var(--color-petroleo)]"
          }`}
        >
          <SectionIcon name={iconName} size={18} />
        </span>
        <span className="min-w-0 flex-1">
          <span
            className={`block font-semibold text-sm truncate ${
              enabled ? "text-[var(--color-petroleo)]" : "line-through text-[var(--color-petroleo)]/50"
            }`}
          >
            {label}
          </span>
          <span className="block text-[10px] uppercase tracking-wide text-[var(--color-petroleo)]/45 truncate">
            {type}
          </span>
        </span>
      </button>

      {/* Controls */}
      <div className="shrink-0 flex items-center gap-0 pr-1">
        <div className="flex flex-col opacity-60 group-hover:opacity-100 focus-within:opacity-100 transition">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            aria-label="Subir"
            title="Subir"
            className="p-0.5 rounded text-[var(--color-petroleo)]/60 hover:text-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-50)] disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-[var(--color-petroleo)]/60"
          >
            <IconChevronUp size={12} />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            aria-label="Bajar"
            title="Bajar"
            className="p-0.5 rounded text-[var(--color-petroleo)]/60 hover:text-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-50)] disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-[var(--color-petroleo)]/60"
          >
            <IconChevronDown size={12} />
          </button>
        </div>
        <div className="flex items-center opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition">
          <button
            type="button"
            onClick={onToggle}
            title={enabled ? "Ocultar" : "Mostrar"}
            aria-label={enabled ? "Ocultar" : "Mostrar"}
            className="p-1 rounded text-[var(--color-petroleo)]/60 hover:text-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-50)]"
          >
            {enabled ? <IconEye size={14} /> : <IconEyeOff size={14} />}
          </button>
          <button
            type="button"
            onClick={onDelete}
            title="Eliminar"
            aria-label="Eliminar"
            className="p-1 rounded text-[var(--color-petroleo)]/60 hover:text-[var(--color-coral)] hover:bg-[var(--color-coral)]/10"
          >
            <IconTrash size={14} />
          </button>
        </div>
      </div>
    </li>
  );
}
