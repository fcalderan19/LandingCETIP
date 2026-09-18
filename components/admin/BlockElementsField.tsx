"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  IconH1,
  IconH2,
  IconH3,
  IconParagraph,
  IconQuote,
  IconButton,
  IconImage,
  IconVideo,
  IconDivider,
  IconSpacer,
  IconList,
  IconChevronUp,
  IconChevronDown,
  IconTrash,
  IconPlus,
  IconClose,
  IconSearch,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconUpload,
} from "./AdminIcons";
import type { ElementKind } from "@/components/sections/CustomBlock";
import { uploadMediaAsset } from "@/app/admin/_actions/media";

type BlockElement = {
  id: string;
  kind: ElementKind;
  text?: string;
  align?: "left" | "center" | "right";
  src?: string;
  alt?: string;
  caption?: string;
  href?: string;
  variant?: "primary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  items?: string[];
  ordered?: boolean;
  embedUrl?: string;
  cite?: string;
};

type CategoryKey = "text" | "media" | "action" | "layout";

const CATEGORY_LABEL: Record<CategoryKey, string> = {
  text: "Textos",
  media: "Imágenes y video",
  action: "Botones",
  layout: "Espacios y listas",
};

type PrimitiveDef = {
  kind: ElementKind;
  label: string;
  description: string;
  category: CategoryKey;
  Icon: (p: { size?: number }) => JSX.Element;
  createDefaults: () => Partial<BlockElement>;
};

const PRIMITIVES: PrimitiveDef[] = [
  {
    kind: "heading_1",
    label: "Título grande",
    description: "El título más importante del bloque.",
    category: "text",
    Icon: IconH1,
    createDefaults: () => ({ text: "Título grande", align: "left" }),
  },
  {
    kind: "heading_2",
    label: "Título",
    description: "Encabezado de sección.",
    category: "text",
    Icon: IconH2,
    createDefaults: () => ({ text: "Título", align: "left" }),
  },
  {
    kind: "heading_3",
    label: "Subtítulo",
    description: "Título más pequeño para subsecciones.",
    category: "text",
    Icon: IconH3,
    createDefaults: () => ({ text: "Subtítulo", align: "left" }),
  },
  {
    kind: "paragraph",
    label: "Párrafo",
    description: "Un bloque de texto normal.",
    category: "text",
    Icon: IconParagraph,
    createDefaults: () => ({
      text: "Escribí acá tu texto…",
      align: "left",
    }),
  },
  {
    kind: "quote",
    label: "Cita destacada",
    description: "Una frase importante con estilo de cita.",
    category: "text",
    Icon: IconQuote,
    createDefaults: () => ({ text: "Una frase que quieras destacar.", cite: "" }),
  },
  {
    kind: "image",
    label: "Imagen",
    description: "Subí una foto o pegá una URL.",
    category: "media",
    Icon: IconImage,
    createDefaults: () => ({ src: "", alt: "", align: "center" }),
  },
  {
    kind: "video",
    label: "Video",
    description: "Pegá un link de YouTube o Vimeo.",
    category: "media",
    Icon: IconVideo,
    createDefaults: () => ({ embedUrl: "" }),
  },
  {
    kind: "button",
    label: "Botón",
    description: "Un llamado a la acción con link.",
    category: "action",
    Icon: IconButton,
    createDefaults: () => ({
      text: "Hacé clic acá",
      href: "#",
      variant: "primary",
      align: "left",
    }),
  },
  {
    kind: "list",
    label: "Lista con viñetas",
    description: "Una lista de items uno debajo del otro.",
    category: "layout",
    Icon: IconList,
    createDefaults: () => ({
      items: ["Primer item", "Segundo item"],
      ordered: false,
      align: "left",
    }),
  },
  {
    kind: "divider",
    label: "Línea divisoria",
    description: "Una línea fina que separa contenido.",
    category: "layout",
    Icon: IconDivider,
    createDefaults: () => ({}),
  },
  {
    kind: "spacer",
    label: "Espacio en blanco",
    description: "Deja espacio vertical entre elementos.",
    category: "layout",
    Icon: IconSpacer,
    createDefaults: () => ({ size: "medium" }),
  },
];

function primitiveFor(kind: ElementKind): PrimitiveDef | undefined {
  return PRIMITIVES.find((p) => p.kind === kind);
}

function newId(): string {
  return "el_" + Math.random().toString(36).slice(2, 10);
}

/* --- Reusable primitive UI --- */

const inputCls =
  "block w-full min-w-0 rounded-lg border border-[var(--color-petroleo-100)] bg-white px-3 py-2 text-sm focus:border-[var(--color-celeste)] focus:ring-2 focus:ring-[var(--color-celeste)]/20 focus:outline-none";

function LabeledInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold text-[var(--color-petroleo)]/80 mb-1">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputCls}
      />
    </label>
  );
}

function LabeledTextarea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold text-[var(--color-petroleo)]/80 mb-1">
        {label}
      </span>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
    </label>
  );
}

function AlignPicker({
  value,
  onChange,
}: {
  value?: "left" | "center" | "right";
  onChange: (v: "left" | "center" | "right") => void;
}) {
  const opts: { v: "left" | "center" | "right"; Icon: typeof IconAlignLeft; label: string }[] =
    [
      { v: "left", Icon: IconAlignLeft, label: "Izquierda" },
      { v: "center", Icon: IconAlignCenter, label: "Centro" },
      { v: "right", Icon: IconAlignRight, label: "Derecha" },
    ];
  return (
    <div>
      <span className="block text-[11px] font-semibold text-[var(--color-petroleo)]/80 mb-1">
        Alineación
      </span>
      <div className="inline-flex rounded-lg border border-[var(--color-petroleo-100)] bg-white overflow-hidden">
        {opts.map(({ v, Icon, label }) => {
          const isOn = (value ?? "left") === v;
          return (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
              title={label}
              aria-label={label}
              aria-pressed={isOn}
              className={`px-2.5 py-1.5 border-r last:border-r-0 border-[var(--color-petroleo-100)] transition ${
                isOn
                  ? "bg-[var(--color-celeste)]/15 text-[var(--color-celeste-600)]"
                  : "text-[var(--color-petroleo)]/60 hover:text-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-50)]"
              }`}
            >
              <Icon size={14} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChipSelect<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T | undefined;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div>
      <span className="block text-[11px] font-semibold text-[var(--color-petroleo)]/80 mb-1">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const on = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              aria-pressed={on}
              className={`text-xs font-semibold px-3 py-1 rounded-full border transition ${
                on
                  ? "bg-[var(--color-celeste)] text-white border-[var(--color-celeste)]"
                  : "bg-white text-[var(--color-petroleo)]/70 border-[var(--color-petroleo-100)] hover:border-[var(--color-petroleo-200)]"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ImagePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleFile(file: File) {
    setErr(null);
    if (!file.type.startsWith("image/")) {
      setErr("El archivo debe ser una imagen.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setErr("Máximo 20 MB.");
      return;
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result ?? ""));
      r.onerror = () => reject(r.error ?? new Error("read failed"));
      r.readAsDataURL(file);
    });
    setUploading(true);
    try {
      const res = await uploadMediaAsset({
        filename: file.name,
        mime: file.type,
        size: file.size,
        data: dataUrl,
      });
      if (res.ok) onChange(res.data.url);
      else setErr(res.error ?? "No se pudo subir");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "No se pudo subir");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <span className="block text-[11px] font-semibold text-[var(--color-petroleo)]/80 mb-1">
        Imagen
      </span>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Pegá la URL o subí un archivo"
          className={inputCls}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-[var(--color-petroleo-100)] bg-white hover:bg-[var(--color-petroleo-50)] disabled:opacity-50"
        >
          <IconUpload size={13} />
          {uploading ? "Subiendo…" : "Subir"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
            e.target.value = "";
          }}
        />
      </div>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="mt-2 rounded-lg border border-[var(--color-petroleo-100)] max-h-32 max-w-full object-cover"
        />
      )}
      {err && (
        <p className="text-[10px] text-[var(--color-coral)] mt-1">{err}</p>
      )}
    </div>
  );
}

/* --- The picker modal --- */

function PrimitivePicker({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (kind: ElementKind) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    setQuery("");
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
    const q = query.trim().toLowerCase();
    const cats: Record<CategoryKey, PrimitiveDef[]> = {
      text: [],
      media: [],
      action: [],
      layout: [],
    };
    for (const p of PRIMITIVES) {
      if (
        q &&
        !p.label.toLowerCase().includes(q) &&
        !p.description.toLowerCase().includes(q)
      ) {
        continue;
      }
      cats[p.category].push(p);
    }
    return cats;
  }, [query]);

  if (!open) return null;

  const order: CategoryKey[] = ["text", "media", "action", "layout"];
  const totalShown = order.reduce((n, c) => n + grouped[c].length, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-8 bg-[var(--color-petroleo)]/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Elegir un elemento para agregar"
    >
      <div
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[var(--color-petroleo-100)] overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-[var(--color-petroleo-100)] bg-gradient-to-b from-white to-[var(--color-petroleo-50)]/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--color-celeste)]/12 text-[var(--color-celeste-600)] flex items-center justify-center">
              <IconPlus size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-[var(--color-petroleo)]">
                Agregar un elemento
              </h2>
              <p className="text-xs text-[var(--color-petroleo)]/60">
                Elegí qué tipo de contenido querés sumar al bloque.
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
              placeholder="Buscar (título, párrafo, botón, imagen…)"
              className="flex-1 text-sm outline-none bg-transparent placeholder:text-[var(--color-petroleo)]/40"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Limpiar"
                className="text-[var(--color-petroleo)]/40 hover:text-[var(--color-petroleo)]"
              >
                <IconClose size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {totalShown === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-full bg-[var(--color-petroleo-50)] flex items-center justify-center text-[var(--color-petroleo)]/40 mb-3">
                <IconSearch size={22} />
              </div>
              <p className="text-sm text-[var(--color-petroleo)]/60">
                No hay elementos que coincidan con “{query}”.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {order.map((cat) => {
                const list = grouped[cat];
                if (list.length === 0) return null;
                return (
                  <section key={cat}>
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-petroleo)]/50 mb-2 px-1">
                      {CATEGORY_LABEL[cat]}
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {list.map((p) => (
                        <li key={p.kind}>
                          <button
                            type="button"
                            onClick={() => onPick(p.kind)}
                            className="group w-full h-full text-left rounded-xl border border-[var(--color-petroleo-100)] bg-white hover:border-[var(--color-celeste)] hover:shadow-md hover:-translate-y-0.5 transition p-3 flex gap-3 items-start"
                          >
                            <div
                              aria-hidden="true"
                              className="shrink-0 w-11 h-11 rounded-lg bg-[var(--color-petroleo-50)] group-hover:bg-[var(--color-celeste)]/12 flex items-center justify-center text-[var(--color-petroleo)] group-hover:text-[var(--color-celeste-600)] transition"
                            >
                              <p.Icon size={20} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-sm text-[var(--color-petroleo)]">
                                {p.label}
                              </div>
                              <p className="text-xs text-[var(--color-petroleo)]/60 mt-0.5 line-clamp-2">
                                {p.description}
                              </p>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-5 py-2.5 border-t border-[var(--color-petroleo-100)] bg-[var(--color-petroleo-50)]/50 text-[10px] text-[var(--color-petroleo)]/60 text-center">
          Esc para cerrar
        </div>
      </div>
    </div>
  );
}

/* --- The per-element inline editor --- */

function ElementEditor({
  el,
  onChange,
}: {
  el: BlockElement;
  onChange: (next: BlockElement) => void;
}) {
  const patch = (p: Partial<BlockElement>) => onChange({ ...el, ...p });

  switch (el.kind) {
    case "heading_1":
    case "heading_2":
    case "heading_3":
      return (
        <div className="space-y-3">
          <LabeledInput
            label="Texto del título"
            value={el.text ?? ""}
            onChange={(v) => patch({ text: v })}
          />
          <AlignPicker
            value={el.align}
            onChange={(v) => patch({ align: v })}
          />
        </div>
      );
    case "paragraph":
      return (
        <div className="space-y-3">
          <LabeledTextarea
            label="Texto"
            value={el.text ?? ""}
            onChange={(v) => patch({ text: v })}
            rows={4}
          />
          <AlignPicker
            value={el.align}
            onChange={(v) => patch({ align: v })}
          />
        </div>
      );
    case "quote":
      return (
        <div className="space-y-3">
          <LabeledTextarea
            label="La cita"
            value={el.text ?? ""}
            onChange={(v) => patch({ text: v })}
          />
          <LabeledInput
            label="Autor / fuente (opcional)"
            value={el.cite ?? ""}
            onChange={(v) => patch({ cite: v })}
            placeholder="Ej. María López"
          />
        </div>
      );
    case "button":
      return (
        <div className="space-y-3">
          <LabeledInput
            label="Texto del botón"
            value={el.text ?? ""}
            onChange={(v) => patch({ text: v })}
          />
          <LabeledInput
            label="A dónde lleva (URL)"
            value={el.href ?? ""}
            onChange={(v) => patch({ href: v })}
            placeholder="https://…  o  /contacto"
          />
          <ChipSelect
            label="Estilo"
            value={el.variant ?? "primary"}
            onChange={(v) => patch({ variant: v })}
            options={[
              { value: "primary", label: "Sólido" },
              { value: "outline", label: "Con borde" },
              { value: "ghost", label: "Sólo texto" },
            ]}
          />
          <AlignPicker
            value={el.align}
            onChange={(v) => patch({ align: v })}
          />
        </div>
      );
    case "image":
      return (
        <div className="space-y-3">
          <ImagePicker
            value={el.src ?? ""}
            onChange={(v) => patch({ src: v })}
          />
          <LabeledInput
            label="Descripción para lectores (alt)"
            value={el.alt ?? ""}
            onChange={(v) => patch({ alt: v })}
            placeholder="Qué se ve en la imagen"
          />
          <LabeledInput
            label="Pie de foto (opcional)"
            value={el.caption ?? ""}
            onChange={(v) => patch({ caption: v })}
          />
          <AlignPicker
            value={el.align}
            onChange={(v) => patch({ align: v })}
          />
        </div>
      );
    case "video":
      return (
        <div className="space-y-3">
          <LabeledInput
            label="Link del video (YouTube o Vimeo)"
            value={el.embedUrl ?? ""}
            onChange={(v) => patch({ embedUrl: v })}
            placeholder="https://youtube.com/watch?v=…"
          />
        </div>
      );
    case "divider":
      return (
        <p className="text-xs text-[var(--color-petroleo)]/60 italic">
          Esta línea aparece automáticamente. No tiene opciones extra.
        </p>
      );
    case "spacer":
      return (
        <ChipSelect
          label="Tamaño del espacio"
          value={el.size ?? "medium"}
          onChange={(v) => patch({ size: v })}
          options={[
            { value: "small", label: "Chico" },
            { value: "medium", label: "Mediano" },
            { value: "large", label: "Grande" },
          ]}
        />
      );
    case "list": {
      const items = el.items ?? [];
      const setItems = (next: string[]) => patch({ items: next });
      return (
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-[var(--color-petroleo)]/80">
                Items de la lista
              </span>
              <button
                type="button"
                onClick={() => setItems([...items, ""])}
                className="text-[11px] font-semibold text-[var(--color-celeste-600)] hover:underline inline-flex items-center gap-1"
              >
                <IconPlus size={11} /> Agregar item
              </button>
            </div>
            <ul className="space-y-1.5">
              {items.map((it, i) => (
                <li key={i} className="flex gap-1.5">
                  <input
                    type="text"
                    value={it}
                    onChange={(e) => {
                      const copy = [...items];
                      copy[i] = e.target.value;
                      setItems(copy);
                    }}
                    className={inputCls}
                  />
                  <button
                    type="button"
                    onClick={() => setItems(items.filter((_, j) => j !== i))}
                    aria-label="Quitar item"
                    className="shrink-0 p-2 rounded text-[var(--color-petroleo)]/50 hover:text-[var(--color-coral)] hover:bg-[var(--color-coral)]/10"
                  >
                    <IconTrash size={13} />
                  </button>
                </li>
              ))}
              {items.length === 0 && (
                <li className="text-xs text-[var(--color-petroleo)]/50 italic">
                  Todavía no hay items.
                </li>
              )}
            </ul>
          </div>
          <ChipSelect
            label="Tipo de lista"
            value={el.ordered ? "ordered" : "bullets"}
            onChange={(v) => patch({ ordered: v === "ordered" })}
            options={[
              { value: "bullets", label: "Con viñetas" },
              { value: "ordered", label: "Numerada" },
            ]}
          />
        </div>
      );
    }
    default:
      return null;
  }
}

/* --- Element list item (collapsed row) --- */

function elementSummary(el: BlockElement): string {
  switch (el.kind) {
    case "heading_1":
    case "heading_2":
    case "heading_3":
    case "paragraph":
    case "quote":
      return (el.text ?? "").slice(0, 60) || "(sin texto)";
    case "button":
      return el.text || "(sin texto)";
    case "image":
      return el.alt || (el.src ? "Imagen" : "(sin imagen)");
    case "video":
      return el.embedUrl || "(sin link)";
    case "divider":
      return "Línea divisoria";
    case "spacer":
      return `Espacio ${el.size ?? "mediano"}`;
    case "list":
      return `${(el.items ?? []).filter(Boolean).length} items`;
    default:
      return "";
  }
}

/* --- Main field --- */

export default function BlockElementsField({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const elements: BlockElement[] = Array.isArray(value)
    ? (value as BlockElement[])
    : [];
  const [openId, setOpenId] = useState<string | null>(null);
  const [pickerAt, setPickerAt] = useState<number | null>(null);

  function commit(next: BlockElement[]) {
    onChange(next);
  }

  function add(kind: ElementKind, atIndex?: number) {
    const def = primitiveFor(kind);
    if (!def) return;
    const newEl: BlockElement = {
      id: newId(),
      kind,
      ...def.createDefaults(),
    };
    const insertAt =
      atIndex === undefined ? elements.length : Math.min(atIndex, elements.length);
    const next = [...elements];
    next.splice(insertAt, 0, newEl);
    commit(next);
    setOpenId(newEl.id);
    setPickerAt(null);
  }

  function move(id: string, dir: -1 | 1) {
    const i = elements.findIndex((e) => e.id === id);
    if (i < 0) return;
    const j = i + dir;
    if (j < 0 || j >= elements.length) return;
    const next = [...elements];
    [next[i], next[j]] = [next[j], next[i]];
    commit(next);
  }

  function remove(id: string) {
    commit(elements.filter((e) => e.id !== id));
    if (openId === id) setOpenId(null);
  }

  function updateOne(id: string, next: BlockElement) {
    commit(elements.map((e) => (e.id === id ? next : e)));
  }

  return (
    <div className="min-w-0 w-full">
      <div className="space-y-1">
        <InsertRow onClick={() => setPickerAt(0)} label="Agregar arriba" />
        {elements.map((el, idx) => {
          const def = primitiveFor(el.kind);
          const Icon = def?.Icon;
          const isOpen = openId === el.id;
          return (
            <div key={el.id}>
              <div
                className={`rounded-xl border bg-white ${
                  isOpen
                    ? "border-[var(--color-celeste)] ring-2 ring-[var(--color-celeste)]/20 shadow-sm"
                    : "border-[var(--color-petroleo-100)]"
                }`}
              >
                <div className="group flex items-center gap-1.5 p-2">
                  <span
                    aria-hidden="true"
                    className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                      isOpen
                        ? "bg-[var(--color-celeste)]/15 text-[var(--color-celeste-600)]"
                        : "bg-[var(--color-petroleo-50)] text-[var(--color-petroleo)]/70"
                    }`}
                  >
                    {Icon ? <Icon size={16} /> : null}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : el.id)}
                    className="flex-1 text-left min-w-0"
                  >
                    <div className="text-[11px] uppercase font-bold tracking-wide text-[var(--color-petroleo)]/50">
                      {def?.label ?? el.kind}
                    </div>
                    <div className="text-sm font-semibold text-[var(--color-petroleo)] truncate">
                      {elementSummary(el)}
                    </div>
                  </button>
                  <div className="flex items-center gap-0.5 shrink-0 opacity-60 group-hover:opacity-100 focus-within:opacity-100 transition">
                    <button
                      type="button"
                      onClick={() => move(el.id, -1)}
                      disabled={idx === 0}
                      aria-label="Subir"
                      title="Subir"
                      className="p-1 rounded text-[var(--color-petroleo)]/60 hover:text-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-50)] disabled:opacity-25"
                    >
                      <IconChevronUp size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(el.id, 1)}
                      disabled={idx === elements.length - 1}
                      aria-label="Bajar"
                      title="Bajar"
                      className="p-1 rounded text-[var(--color-petroleo)]/60 hover:text-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-50)] disabled:opacity-25"
                    >
                      <IconChevronDown size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(el.id)}
                      aria-label="Eliminar"
                      title="Eliminar"
                      className="p-1 rounded text-[var(--color-petroleo)]/60 hover:text-[var(--color-coral)] hover:bg-[var(--color-coral)]/10"
                    >
                      <IconTrash size={13} />
                    </button>
                  </div>
                </div>
                {isOpen && (
                  <div className="border-t border-[var(--color-petroleo-100)] p-3">
                    <ElementEditor
                      el={el}
                      onChange={(next) => updateOne(el.id, next)}
                    />
                  </div>
                )}
              </div>
              <InsertRow
                onClick={() => setPickerAt(idx + 1)}
                label="Insertar aquí"
              />
            </div>
          );
        })}
        {elements.length === 0 && (
          <div className="rounded-xl border border-dashed border-[var(--color-petroleo-100)] bg-[var(--color-petroleo-50)]/40 p-6 text-center">
            <p className="text-sm text-[var(--color-petroleo)]/70 mb-3">
              Este bloque todavía está vacío.
            </p>
            <button
              type="button"
              onClick={() => setPickerAt(0)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[var(--color-celeste)] text-white hover:bg-[var(--color-celeste-600)]"
            >
              <IconPlus size={13} /> Agregar el primer elemento
            </button>
          </div>
        )}
      </div>

      <div className="mt-3">
        <button
          type="button"
          onClick={() => setPickerAt(elements.length)}
          className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border-2 border-dashed border-[var(--color-petroleo-100)] text-[var(--color-petroleo)]/70 hover:border-[var(--color-celeste)] hover:text-[var(--color-celeste-600)] hover:bg-[var(--color-celeste)]/5 transition"
        >
          <IconPlus size={13} /> Agregar elemento
        </button>
      </div>

      <PrimitivePicker
        open={pickerAt !== null}
        onClose={() => setPickerAt(null)}
        onPick={(k) => add(k, pickerAt ?? undefined)}
      />
    </div>
  );
}

function InsertRow({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="group w-full flex items-center gap-2 py-1"
    >
      <span className="flex-1 h-px bg-transparent group-hover:bg-[var(--color-celeste)]/40 group-focus:bg-[var(--color-celeste)]/40 transition-colors" />
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-dashed border-[var(--color-petroleo-100)] bg-white text-[var(--color-petroleo)]/30 group-hover:border-[var(--color-celeste)] group-hover:bg-[var(--color-celeste)] group-hover:text-white group-hover:border-solid transition">
        <IconPlus size={10} />
      </span>
      <span className="flex-1 h-px bg-transparent group-hover:bg-[var(--color-celeste)]/40 group-focus:bg-[var(--color-celeste)]/40 transition-colors" />
    </button>
  );
}
