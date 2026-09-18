"use client";
import { useEffect, useState } from "react";
import type { SectionEditorMeta } from "@/lib/sections-types";
import FieldRenderer from "./fields/FieldRenderer";
import { SectionIcon, IconChevronDown } from "./AdminIcons";

type Props = {
  sectionId: string;
  type: string;
  editor: SectionEditorMeta;
  initialData: Record<string, unknown>;
  saving: boolean;
  errors?: Record<string, string[]>;
  onSave: (data: Record<string, unknown>) => void;
};

export default function Inspector({
  sectionId,
  type,
  editor,
  initialData,
  saving,
  errors,
  onSave,
}: Props) {
  const [data, setData] = useState<Record<string, unknown>>(initialData);
  // Cada grupo abierto/cerrado por separado. Default: todos abiertos.
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () => new Set(editor.fieldGroups.map((g) => g.name)),
  );

  useEffect(() => {
    setData(initialData);
    setOpenGroups(new Set(editor.fieldGroups.map((g) => g.name)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId]);

  const setField = (name: string, value: unknown) =>
    setData((prev) => ({ ...prev, [name]: value }));

  function toggleGroup(name: string) {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  return (
    <aside className="sticky top-0 min-w-0 w-full overflow-x-hidden">
      <div className="bg-white min-w-0 w-full">
        <header className="px-4 pt-4 pb-3 border-b border-[var(--color-petroleo-100)] bg-gradient-to-b from-white to-[var(--color-petroleo-50)]/40">
          <div className="text-[10px] uppercase font-bold text-[var(--color-petroleo)]/60 tracking-wider mb-1.5">
            Editando bloque
          </div>
          <div className="flex items-start gap-2.5">
            <span
              aria-hidden="true"
              className="shrink-0 w-10 h-10 rounded-lg bg-[var(--color-celeste)]/12 text-[var(--color-celeste-600)] flex items-center justify-center"
            >
              <SectionIcon name={editor.icon} size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-[var(--color-petroleo)] leading-tight">
                {editor.label}
              </h3>
              <div className="text-[10px] mt-0.5 text-[var(--color-petroleo)]/45 font-mono truncate">
                {type} · {sectionId.slice(0, 8)}
              </div>
            </div>
          </div>
          {editor.description && (
            <p className="text-xs text-[var(--color-petroleo)]/70 mt-2 leading-relaxed">
              {editor.description}
            </p>
          )}
        </header>

        <div className="px-4 py-3 space-y-3">
          {editor.fieldGroups.map((group) => {
            const isOpen = openGroups.has(group.name);
            return (
              <fieldset
                key={group.name}
                className="border border-[var(--color-petroleo-100)] rounded-lg overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleGroup(group.name)}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-[var(--color-petroleo-50)]/70 hover:bg-[var(--color-petroleo-100)] transition"
                  aria-expanded={isOpen}
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-petroleo)]/70">
                    {group.label}
                  </span>
                  <span
                    className={`text-[var(--color-petroleo)]/50 transition-transform ${isOpen ? "" : "-rotate-90"}`}
                    aria-hidden="true"
                  >
                    <IconChevronDown size={14} />
                  </span>
                </button>
                {isOpen && (
                  <div className="p-3 space-y-3 min-w-0 overflow-hidden">
                    {group.description && (
                      <p className="text-[11px] text-[var(--color-petroleo)]/60">
                        {group.description}
                      </p>
                    )}
                    {group.fields.map((field) => (
                      <FieldRenderer
                        key={field.name}
                        field={field}
                        value={data[field.name]}
                        onChange={(v) => setField(field.name, v)}
                      />
                    ))}
                  </div>
                )}
              </fieldset>
            );
          })}
        </div>

        {errors && Object.keys(errors).length > 0 && (
          <div className="mx-4 mb-3 rounded-lg bg-[var(--color-coral)]/10 text-[var(--color-coral-600)] p-3 text-xs">
            <strong>Errores:</strong>
            <ul className="mt-1 space-y-0.5">
              {Object.entries(errors).map(([k, msgs]) => (
                <li key={k}>
                  <code>{k}</code>: {msgs.join(", ")}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="sticky bottom-0 px-4 py-3 bg-white border-t border-[var(--color-petroleo-100)] shadow-[0_-4px_12px_-8px_rgba(0,0,0,0.1)]">
          <button
            type="button"
            disabled={saving}
            onClick={() => onSave(data)}
            className="w-full bg-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-700)] disabled:opacity-60 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition"
          >
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </aside>
  );
}
