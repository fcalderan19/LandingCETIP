"use client";
import { useEffect, useState } from "react";
import type { SectionEditorMeta } from "@/lib/sections-types";
import FieldRenderer from "./fields/FieldRenderer";

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
        <header className="px-4 pt-4 pb-3 border-b border-[var(--color-petroleo-100)]">
          <div className="text-[10px] uppercase font-bold text-[var(--color-petroleo)]/60">
            Editando
          </div>
          <h3 className="text-lg font-bold">{editor.label}</h3>
          {editor.description && (
            <p className="text-xs text-[var(--color-petroleo)]/70 mt-1">
              {editor.description}
            </p>
          )}
          <div className="text-[10px] mt-1 text-[var(--color-petroleo)]/40">
            {type} · {sectionId.slice(0, 8)}
          </div>
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
                  className="w-full flex items-center justify-between px-3 py-2 bg-[var(--color-petroleo-50)] hover:bg-[var(--color-petroleo-100)] transition"
                  aria-expanded={isOpen}
                >
                  <span className="text-xs font-bold uppercase text-[var(--color-petroleo)]/70">
                    {group.label}
                  </span>
                  <span
                    className={`text-xs transition-transform ${isOpen ? "rotate-90" : ""}`}
                    aria-hidden="true"
                  >
                    ▶
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

        <div className="sticky bottom-0 px-4 py-3 bg-white border-t border-[var(--color-petroleo-100)]">
          <button
            type="button"
            disabled={saving}
            onClick={() => onSave(data)}
            className="w-full bg-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-700)] disabled:opacity-60 text-white font-semibold px-4 py-2.5 rounded-full"
          >
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </aside>
  );
}
