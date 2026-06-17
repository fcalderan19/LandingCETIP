"use client";
import { useState } from "react";
import type { FieldDef } from "@/lib/sections-types";

type Props = {
  field: FieldDef;
  value: unknown;
  onChange: (next: unknown) => void;
  path?: string;
};

const inputCls =
  "block w-full max-w-full min-w-0 box-border rounded-lg border border-[var(--color-petroleo-100)] bg-white px-3 py-2 text-sm focus:border-[var(--color-celeste)] focus:ring-2 focus:ring-[var(--color-celeste)]/20 focus:outline-none";

export default function FieldRenderer({ field, value, onChange, path }: Props) {
  const id = path ?? field.name;
  switch (field.kind) {
    case "text":
    case "link":
    case "color":
      return (
        <label className="block">
          <span className="block text-xs font-semibold mb-1">{field.label}</span>
          <input
            id={id}
            type={field.kind === "color" ? "color" : "text"}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            className={inputCls}
          />
        </label>
      );
    case "textarea":
      return (
        <label className="block">
          <span className="block text-xs font-semibold mb-1">{field.label}</span>
          <textarea
            id={id}
            rows={3}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            className={inputCls}
          />
        </label>
      );
    case "number":
      return (
        <label className="block">
          <span className="block text-xs font-semibold mb-1">{field.label}</span>
          <input
            id={id}
            type="number"
            value={typeof value === "number" ? value : ""}
            onChange={(e) => {
              const v = e.target.value;
              onChange(v === "" ? undefined : Number(v));
            }}
            className={inputCls}
          />
        </label>
      );
    case "boolean":
      return (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            id={id}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span className="text-sm">{field.label}</span>
        </label>
      );
    case "select":
      return (
        <label className="block">
          <span className="block text-xs font-semibold mb-1">{field.label}</span>
          <select
            id={id}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            className={inputCls}
          >
            <option value="">— Elegí —</option>
            {field.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      );
    case "image":
      return <ImageField field={field} value={value} onChange={onChange} id={id} />;
    case "array":
      return <ArrayField field={field} value={value} onChange={onChange} path={id} />;
    default:
      return <p className="text-xs text-[var(--color-coral)]">Tipo de campo no soportado: {field.kind}</p>;
  }
}

function ImageField({
  field,
  value,
  onChange,
  id,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (next: unknown) => void;
  id: string;
}) {
  const src = typeof value === "string" ? value : "";
  return (
    <div className="min-w-0 w-full overflow-hidden">
      <span className="block text-xs font-semibold mb-1">{field.label}</span>
      <input
        id={id}
        type="text"
        value={src}
        onChange={(e) => onChange(e.target.value)}
        placeholder="URL de la imagen o /img/archivo.jpg"
        className={inputCls}
      />
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          className="mt-2 rounded-lg border border-[var(--color-petroleo-100)] max-h-32 max-w-full object-cover"
        />
      )}
      <p className="text-[10px] text-[var(--color-petroleo)]/60 mt-1">
        Subí imágenes en <a href="/admin/media" className="underline">Media</a> y pegá la URL acá.
      </p>
    </div>
  );
}

function previewFor(itemFields: FieldDef[], item: Record<string, unknown>): string {
  // Toma el primer text/textarea no vacío como preview.
  const preferred = ["title", "titulo", "label", "eyebrow", "name", "nombre"];
  for (const key of preferred) {
    const v = item[key];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  for (const f of itemFields) {
    if (f.kind === "text" || f.kind === "textarea") {
      const v = item[f.name];
      if (typeof v === "string" && v.trim()) return v.trim();
    }
  }
  return "";
}

function ArrayField({
  field,
  value,
  onChange,
  path,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (next: unknown) => void;
  path: string;
}) {
  const items: unknown[] = Array.isArray(value) ? value : [];
  const itemFields = field.itemFields ?? [];
  // Default: collapsed. New items get auto-expanded.
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  function setAt(i: number, next: unknown) {
    const copy = [...items];
    copy[i] = next;
    onChange(copy);
  }
  function add() {
    const emptyItem: Record<string, unknown> = {};
    for (const f of itemFields) {
      emptyItem[f.name] =
        f.kind === "boolean" ? false : f.kind === "number" ? 0 : f.kind === "array" ? [] : "";
    }
    const newIndex = items.length;
    onChange([...items, emptyItem]);
    setExpanded((prev) => {
      const next = new Set(prev);
      next.add(newIndex);
      return next;
    });
  }
  function remove(i: number) {
    const copy = [...items];
    copy.splice(i, 1);
    onChange(copy);
    // Reindex expanded.
    setExpanded((prev) => {
      const next = new Set<number>();
      for (const idx of prev) {
        if (idx < i) next.add(idx);
        else if (idx > i) next.add(idx - 1);
      }
      return next;
    });
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const copy = [...items];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    onChange(copy);
    setExpanded((prev) => {
      const next = new Set<number>();
      for (const idx of prev) {
        if (idx === i) next.add(j);
        else if (idx === j) next.add(i);
        else next.add(idx);
      }
      return next;
    });
  }

  const allExpanded = items.length > 0 && expanded.size === items.length;
  function toggleAll() {
    if (allExpanded) setExpanded(new Set());
    else setExpanded(new Set(items.map((_, i) => i)));
  }

  return (
    <div className="min-w-0 w-full overflow-hidden">
      <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
        <span className="text-xs font-semibold truncate min-w-0">{field.label}</span>
        <div className="flex items-center gap-2 shrink-0">
          {items.length > 1 && (
            <button
              type="button"
              onClick={toggleAll}
              className="text-[10px] text-[var(--color-petroleo)]/60 hover:text-[var(--color-petroleo)] hover:underline whitespace-nowrap"
            >
              {allExpanded ? "Plegar" : "Expandir"}
            </button>
          )}
          <button
            type="button"
            onClick={add}
            className="text-xs font-semibold px-2 py-1 rounded-full bg-[var(--color-petroleo)] text-white hover:bg-[var(--color-petroleo-700)] whitespace-nowrap"
          >
            + Agregar
          </button>
        </div>
      </div>
      <ul className="space-y-2 min-w-0">
        {items.map((item, i) => {
          const itemObj = (typeof item === "object" && item !== null ? item : {}) as Record<string, unknown>;
          const isStringItem = itemFields.length === 1 && itemFields[0].name === "value";
          const isOpen = expanded.has(i);
          const preview = isStringItem
            ? typeof item === "string"
              ? item
              : ""
            : previewFor(itemFields, itemObj);

          return (
            <li
              key={i}
              className="rounded-xl border border-[var(--color-petroleo-100)] bg-[var(--color-petroleo-50)] overflow-hidden min-w-0"
            >
              <div className="flex items-center gap-2 px-3 py-2 min-w-0">
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="flex-1 flex items-center gap-2 text-left min-w-0 overflow-hidden"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`text-xs transition-transform shrink-0 ${isOpen ? "rotate-90" : ""}`}
                    aria-hidden="true"
                  >
                    ▶
                  </span>
                  <span className="text-[10px] uppercase font-bold text-[var(--color-petroleo)]/60 shrink-0">
                    #{i + 1}
                  </span>
                  <span className="text-xs font-semibold truncate min-w-0 flex-1 block">
                    {preview || <span className="italic text-[var(--color-petroleo)]/40">(sin título)</span>}
                  </span>
                </button>
                <div className="flex gap-1 shrink-0">
                  <button type="button" onClick={() => move(i, -1)} className="text-xs px-1.5 py-0.5 rounded hover:bg-white disabled:opacity-30" disabled={i === 0} aria-label="Subir">↑</button>
                  <button type="button" onClick={() => move(i, 1)} className="text-xs px-1.5 py-0.5 rounded hover:bg-white disabled:opacity-30" disabled={i === items.length - 1} aria-label="Bajar">↓</button>
                  <button type="button" onClick={() => remove(i)} className="text-xs px-1.5 py-0.5 rounded text-[var(--color-coral)] hover:bg-white" aria-label="Eliminar">✕</button>
                </div>
              </div>
              {isOpen && (
                <div className="border-t border-[var(--color-petroleo-100)] bg-white p-3 min-w-0 overflow-hidden">
                  {isStringItem ? (
                    <input
                      type="text"
                      value={typeof item === "string" ? item : ""}
                      onChange={(e) => setAt(i, e.target.value)}
                      className={inputCls}
                      placeholder={itemFields[0].label}
                    />
                  ) : (
                    <div className="grid gap-2 min-w-0">
                      {itemFields.map((sub) => (
                        <FieldRenderer
                          key={sub.name}
                          field={sub}
                          value={itemObj[sub.name]}
                          onChange={(v) => setAt(i, { ...itemObj, [sub.name]: v })}
                          path={`${path}[${i}].${sub.name}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
        {items.length === 0 && (
          <li className="text-xs text-[var(--color-petroleo)]/60 italic py-2">
            Vacío — usá "+ Agregar" para sumar el primer item.
          </li>
        )}
      </ul>
    </div>
  );
}
