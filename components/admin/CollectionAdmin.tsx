"use client";

import { useState, useTransition } from "react";

type FieldKind = "text" | "textarea" | "number" | "boolean";
export type ColumnDef = {
  name: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
};

type Item = { id: string } & Record<string, unknown>;

type ActionFn<T> = (input: T) => Promise<{ ok: true; data: unknown } | { ok: false; error: string; message?: string }>;
type UpdateFn = (id: string, input: unknown) => Promise<{ ok: true; data: unknown } | { ok: false; error: string; message?: string }>;
type DeleteFn = (id: string) => Promise<{ ok: true; data: unknown } | { ok: false; error: string; message?: string }>;

type Props = {
  title: string;
  description?: string;
  columns: ColumnDef[];
  items: Item[];
  empty: Record<string, unknown>;
  onCreate: ActionFn<unknown>;
  onUpdate: UpdateFn;
  onDelete: DeleteFn;
};

const inputCls =
  "w-full rounded border border-[var(--color-petroleo-100)] bg-white px-2 py-1.5 text-sm";

export default function CollectionAdmin({
  title,
  description,
  columns,
  items: initial,
  empty,
  onCreate,
  onUpdate,
  onDelete,
}: Props) {
  const [items, setItems] = useState<Item[]>(initial);
  const [draft, setDraft] = useState<Record<string, unknown>>(empty);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function setDraftField(name: string, value: unknown) {
    setDraft((prev) => ({ ...prev, [name]: value }));
  }

  function create() {
    startTransition(async () => {
      const res = await onCreate(draft);
      if (!res.ok) {
        setFeedback(`Error: ${res.message ?? res.error}`);
        return;
      }
      const created = (res.data as { id: string }) ?? null;
      if (created) setItems((prev) => [{ id: created.id, ...draft }, ...prev]);
      setDraft(empty);
      setFeedback("Creado");
    });
  }

  function patchItem(id: string, name: string, value: unknown) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [name]: value } : it)),
    );
  }

  function save(id: string) {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...payload } = item;
    startTransition(async () => {
      const res = await onUpdate(id, payload);
      setFeedback(res.ok ? "Guardado" : `Error: ${res.message ?? res.error}`);
    });
  }

  function remove(id: string) {
    if (!confirm("¿Eliminar?")) return;
    const prev = items;
    setItems((p) => p.filter((i) => i.id !== id));
    startTransition(async () => {
      const res = await onDelete(id);
      if (!res.ok) {
        setItems(prev);
        setFeedback(`Error: ${res.message ?? res.error}`);
      }
    });
  }

  return (
    <section>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="text-sm text-[var(--color-petroleo)]/70">{description}</p>}
      </header>

      {feedback && (
        <div
          className={`mb-4 rounded-lg px-3 py-2 text-sm ${
            feedback.startsWith("Error")
              ? "bg-[var(--color-coral)]/10 text-[var(--color-coral-600)]"
              : "bg-[var(--color-verde)]/10 text-[var(--color-verde-600)]"
          }`}
        >
          {feedback}
        </div>
      )}

      <div className="rounded-2xl border border-[var(--color-petroleo-100)] bg-[var(--color-petroleo-50)] p-4 mb-6">
        <h2 className="text-xs font-bold uppercase mb-2">Nuevo</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {columns.map((c) => (
            <Cell
              key={c.name}
              col={c}
              value={draft[c.name]}
              onChange={(v) => setDraftField(c.name, v)}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={create}
          disabled={pending}
          className="mt-3 bg-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-700)] disabled:opacity-60 text-white font-semibold px-4 py-2 rounded-full text-sm"
        >
          + Crear
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-[var(--color-petroleo)]/60 italic">Sin items todavía.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((it) => (
            <li
              key={it.id}
              className="rounded-xl border border-[var(--color-petroleo-100)] bg-white p-4"
            >
              <div className="grid md:grid-cols-2 gap-3">
                {columns.map((c) => (
                  <Cell
                    key={c.name}
                    col={c}
                    value={it[c.name]}
                    onChange={(v) => patchItem(it.id, c.name, v)}
                  />
                ))}
              </div>
              <div className="flex items-center justify-end gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => save(it.id)}
                  disabled={pending}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[var(--color-petroleo)] text-white hover:bg-[var(--color-petroleo-700)]"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => remove(it.id)}
                  className="text-xs px-3 py-1.5 rounded-full text-[var(--color-coral)] hover:bg-[var(--color-coral)]/10"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Cell({
  col,
  value,
  onChange,
}: {
  col: ColumnDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  if (col.kind === "boolean") {
    return (
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
        />
        {col.label}
      </label>
    );
  }
  return (
    <label className="block">
      <span className="block text-[10px] font-bold uppercase text-[var(--color-petroleo)]/60 mb-0.5">
        {col.label}
      </span>
      {col.kind === "textarea" ? (
        <textarea
          rows={2}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        />
      ) : col.kind === "number" ? (
        <input
          type="number"
          value={typeof value === "number" ? value : ""}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
          className={inputCls}
        />
      ) : (
        <input
          type="text"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        />
      )}
    </label>
  );
}
