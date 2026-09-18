"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SectionIcon, IconSearch, IconClose } from "./AdminIcons";
import {
  categoryOf,
  CATEGORY_LABEL,
  CATEGORY_ORDER,
  type CategoryKey,
} from "@/lib/admin-categories";

export type PickerItem = {
  type: string;
  label: string;
  description?: string;
  icon?: string;
};

type Props = {
  open: boolean;
  items: PickerItem[];
  onPick: (type: string) => void;
  onClose: () => void;
};

export default function SectionPicker({ open, items, onPick, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<CategoryKey | "all">("all");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveCat("all");
    const t = setTimeout(() => inputRef.current?.focus(), 20);
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const grouped = useMemo(() => {
    const byCat = new Map<CategoryKey, PickerItem[]>();
    for (const it of items) {
      const cat = categoryOf(it.type);
      if (!byCat.has(cat)) byCat.set(cat, []);
      byCat.get(cat)!.push(it);
    }
    return byCat;
  }, [items]);

  const catsWithItems = CATEGORY_ORDER.filter((c) => grouped.has(c));

  const q = query.trim().toLowerCase();
  function matches(it: PickerItem) {
    if (activeCat !== "all" && categoryOf(it.type) !== activeCat) return false;
    if (!q) return true;
    return (
      it.label.toLowerCase().includes(q) ||
      it.type.toLowerCase().includes(q) ||
      (it.description ?? "").toLowerCase().includes(q)
    );
  }

  if (!open) return null;

  const total = items.length;
  const visibleGrouped = catsWithItems
    .map((c) => ({ cat: c, list: (grouped.get(c) ?? []).filter(matches) }))
    .filter((g) => g.list.length > 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-8 bg-[var(--color-petroleo)]/50 backdrop-blur-sm animate-[fadeIn_.12s_ease-out]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Elegir tipo de sección"
    >
      <div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[var(--color-petroleo-100)] overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--color-petroleo-100)] bg-gradient-to-b from-white to-[var(--color-petroleo-50)]/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--color-celeste)]/12 text-[var(--color-celeste-600)] flex items-center justify-center">
              <SectionIcon name="Grid" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-[var(--color-petroleo)]">
                Agregar sección
              </h2>
              <p className="text-xs text-[var(--color-petroleo)]/60">
                {total} bloques disponibles — elegí uno para insertar
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="w-8 h-8 rounded-lg text-[var(--color-petroleo)]/60 hover:text-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-50)] flex items-center justify-center"
            >
              <IconClose size={18} />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-[var(--color-petroleo-100)] bg-white px-3 py-2 focus-within:border-[var(--color-celeste)] focus-within:ring-2 focus-within:ring-[var(--color-celeste)]/20">
            <IconSearch size={16} className="text-[var(--color-petroleo)]/50" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, tipo o descripción…"
              className="flex-1 text-sm outline-none bg-transparent placeholder:text-[var(--color-petroleo)]/40"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-[var(--color-petroleo)]/40 hover:text-[var(--color-petroleo)]"
                aria-label="Limpiar búsqueda"
              >
                <IconClose size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 min-h-0 grid grid-cols-1 sm:grid-cols-[180px_1fr]">
          {/* Sidebar categorías */}
          <aside className="hidden sm:block border-r border-[var(--color-petroleo-100)] bg-[var(--color-petroleo-50)]/50 p-3 overflow-y-auto">
            <button
              type="button"
              onClick={() => setActiveCat("all")}
              className={`w-full text-left text-xs font-semibold px-3 py-2 rounded-lg mb-1 ${
                activeCat === "all"
                  ? "bg-white text-[var(--color-petroleo)] shadow-sm ring-1 ring-[var(--color-petroleo-100)]"
                  : "text-[var(--color-petroleo)]/70 hover:bg-white/70"
              }`}
            >
              Todos
              <span className="float-right text-[10px] text-[var(--color-petroleo)]/50">
                {total}
              </span>
            </button>
            {catsWithItems.map((cat) => {
              const count = grouped.get(cat)?.length ?? 0;
              const isActive = activeCat === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCat(cat)}
                  className={`w-full text-left text-xs font-semibold px-3 py-2 rounded-lg mb-1 ${
                    isActive
                      ? "bg-white text-[var(--color-petroleo)] shadow-sm ring-1 ring-[var(--color-petroleo-100)]"
                      : "text-[var(--color-petroleo)]/70 hover:bg-white/70"
                  }`}
                >
                  {CATEGORY_LABEL[cat]}
                  <span className="float-right text-[10px] text-[var(--color-petroleo)]/50">
                    {count}
                  </span>
                </button>
              );
            })}
          </aside>

          {/* Grilla */}
          <div className="p-4 overflow-y-auto">
            {visibleGrouped.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-12 h-12 rounded-full bg-[var(--color-petroleo-50)] flex items-center justify-center text-[var(--color-petroleo)]/40 mb-3">
                  <IconSearch size={22} />
                </div>
                <p className="text-sm text-[var(--color-petroleo)]/60">
                  No hay bloques que coincidan con “{query}”.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {visibleGrouped.map(({ cat, list }) => (
                  <section key={cat}>
                    {activeCat === "all" && (
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-petroleo)]/50 mb-2 px-1">
                        {CATEGORY_LABEL[cat]}
                      </h3>
                    )}
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {list.map((it) => (
                        <li key={it.type}>
                          <button
                            type="button"
                            onClick={() => onPick(it.type)}
                            className="group w-full h-full text-left rounded-xl border border-[var(--color-petroleo-100)] bg-white hover:border-[var(--color-celeste)] hover:shadow-md hover:-translate-y-0.5 transition p-3 flex gap-3 items-start"
                          >
                            <div
                              aria-hidden="true"
                              className="shrink-0 w-12 h-12 rounded-lg bg-[var(--color-petroleo-50)] group-hover:bg-[var(--color-celeste)]/12 flex items-center justify-center text-[var(--color-petroleo)] group-hover:text-[var(--color-celeste-600)] transition"
                            >
                              <SectionIcon name={it.icon} size={22} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-sm text-[var(--color-petroleo)] truncate">
                                {it.label}
                              </div>
                              {it.description && (
                                <p className="text-xs text-[var(--color-petroleo)]/60 mt-0.5 line-clamp-2">
                                  {it.description}
                                </p>
                              )}
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-5 py-2.5 border-t border-[var(--color-petroleo-100)] bg-[var(--color-petroleo-50)]/50 text-[10px] text-[var(--color-petroleo)]/60 flex items-center justify-between">
          <span>Esc para cerrar</span>
          <span>{visibleGrouped.reduce((n, g) => n + g.list.length, 0)} de {total}</span>
        </div>
      </div>
    </div>
  );
}
