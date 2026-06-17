"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import type { SectionEditorMeta } from "@/lib/sections-types";
import SectionCard from "./SectionCard";
import SectionPalette from "./SectionPalette";
import Inspector from "./Inspector";
import {
  addSection,
  deleteSection,
  reorderSections,
  toggleSection,
  updateSection,
} from "@/app/admin/_actions/sections";

export type EditorSection = {
  id: string;
  type: string;
  data: Record<string, unknown>;
  enabled: boolean;
  order: number;
};

export type EditorCatalogItem = {
  type: string;
  label: string;
  description?: string;
  editor: SectionEditorMeta;
  defaults: Record<string, unknown>;
};

type Props = {
  pageId: string;
  pageTitle: string;
  pageSlug: string;
  initialSections: EditorSection[];
  catalog: EditorCatalogItem[];
};

export default function PageEditor({
  pageId,
  pageTitle,
  pageSlug,
  initialSections,
  catalog,
}: Props) {
  const [sections, setSections] = useState<EditorSection[]>(initialSections);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<
    | { kind: "ok"; message: string }
    | { kind: "error"; message: string; fieldErrors?: Record<string, string[]> }
    | null
  >(null);
  const [previewVersion, setPreviewVersion] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const catalogByType = useMemo(() => {
    const map = new Map<string, EditorCatalogItem>();
    for (const c of catalog) map.set(c.type, c);
    return map;
  }, [catalog]);

  const selected = sections.find((s) => s.id === selectedId) ?? null;
  const selectedEditor = selected ? catalogByType.get(selected.type)?.editor : null;

  const previewPath = pageSlug === "home" ? "/" : `/${pageSlug}`;
  const previewSrc = `${previewPath}?_v=${previewVersion}`;

  // Auto-dismiss the OK toast after 2 s.
  useEffect(() => {
    if (feedback?.kind !== "ok") return;
    const t = setTimeout(() => setFeedback(null), 2000);
    return () => clearTimeout(t);
  }, [feedback]);

  function bumpPreview() {
    setPreviewVersion((v) => v + 1);
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(sections, oldIndex, newIndex);
    setSections(next);
    startTransition(async () => {
      const res = await reorderSections({
        pageId,
        orderedIds: next.map((s) => s.id),
      });
      if (!res.ok) {
        setFeedback({ kind: "error", message: `No se pudo guardar el orden (${res.error})` });
        setSections(sections);
      } else {
        setFeedback({ kind: "ok", message: "Orden actualizado" });
        bumpPreview();
      }
    });
  }

  function onAdd(type: string) {
    const entry = catalogByType.get(type);
    if (!entry) return;
    startTransition(async () => {
      const res = await addSection({ pageId, type });
      if (!res.ok) {
        setFeedback({ kind: "error", message: `No se pudo agregar (${res.error})` });
        return;
      }
      // Best-effort: el server action devuelve { id }, agregamos con los defaults
      // del schema. La data exacta se refrescará al refetch si difiere.
      const created = res.data as { id: string };
      setSections((prev) => [
        ...prev,
        {
          id: created.id,
          type,
          data: entry.defaults,
          enabled: true,
          order: prev.length,
        },
      ]);
      setSelectedId(created.id);
      bumpPreview();
      setFeedback({ kind: "ok", message: "Sección agregada" });
    });
  }

  function onToggle(id: string) {
    const s = sections.find((x) => x.id === id);
    if (!s) return;
    const enabled = !s.enabled;
    setSections((prev) =>
      prev.map((x) => (x.id === id ? { ...x, enabled } : x)),
    );
    startTransition(async () => {
      const res = await toggleSection(id, enabled);
      if (!res.ok) {
        setFeedback({ kind: "error", message: `No se pudo actualizar (${res.error})` });
      } else {
        bumpPreview();
      }
    });
  }

  function onDelete(id: string) {
    if (!confirm("¿Eliminar esta sección?")) return;
    const prev = sections;
    setSections((p) => p.filter((s) => s.id !== id));
    if (selectedId === id) setSelectedId(null);
    startTransition(async () => {
      const res = await deleteSection(id);
      if (!res.ok) {
        setFeedback({ kind: "error", message: `No se pudo eliminar (${res.error})` });
        setSections(prev);
      } else {
        setFeedback({ kind: "ok", message: "Sección eliminada" });
        bumpPreview();
      }
    });
  }

  function onSave(data: Record<string, unknown>) {
    if (!selected) return;
    const id = selected.id;
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, data } : s)));
    startTransition(async () => {
      const res = await updateSection(id, data);
      if (!res.ok) {
        setFeedback({
          kind: "error",
          message: `No se pudo guardar (${res.error})`,
          fieldErrors: res.fieldErrors,
        });
      } else {
        setFeedback({ kind: "ok", message: "Guardado" });
        bumpPreview();
      }
    });
  }

  return (
    <div>
      <header className="px-6 pt-4 pb-2 bg-white border-b border-[var(--color-petroleo-100)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">{pageTitle}</h1>
            <p className="text-xs text-[var(--color-petroleo)]/60">
              /{pageSlug === "home" ? "" : pageSlug} · {sections.length} secciones
            </p>
          </div>
          <div className="flex items-center gap-3">
            {feedback && (
              <span
                className={`text-xs px-3 py-1.5 rounded-full ${
                  feedback.kind === "ok"
                    ? "bg-[var(--color-verde)]/15 text-[var(--color-verde-600)]"
                    : "bg-[var(--color-coral)]/15 text-[var(--color-coral-600)]"
                }`}
              >
                {pending ? "Guardando…" : feedback.message}
              </span>
            )}
            <button
              type="button"
              onClick={bumpPreview}
              className="text-xs font-semibold text-[var(--color-celeste-600)] hover:underline"
            >
              ↻ Refrescar preview
            </button>
            <a
              href={previewPath}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[var(--color-celeste-600)] hover:underline"
            >
              Abrir en pestaña ↗
            </a>
          </div>
        </div>
        {/* Paleta como barra horizontal */}
        <SectionPalette
          items={catalog.map((c) => ({
            type: c.type,
            label: c.label,
            description: c.description,
          }))}
          onAdd={onAdd}
          disabled={pending}
        />
      </header>

      <div
        className="grid bg-[var(--color-petroleo-50)]"
        style={{
          gridTemplateColumns: selected
            ? "240px 1fr 440px"
            : "240px 1fr",
          minHeight: "calc(100vh - 140px)",
        }}
      >
        {/* COLUMNA 1 — Lista de secciones (sortable) */}
        <aside className="border-r border-[var(--color-petroleo-100)] bg-white overflow-y-auto max-h-[calc(100vh-140px)]">
          <div className="p-3">
            <h3 className="text-xs font-bold uppercase text-[var(--color-petroleo)]/70 mb-2">
              Secciones — arrastrá ⋮⋮ para reordenar
            </h3>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
            >
              <SortableContext
                items={sections.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <ul className="space-y-2">
                  {sections.map((s) => {
                    const entry = catalogByType.get(s.type);
                    return (
                      <SectionCard
                        key={s.id}
                        id={s.id}
                        label={entry?.label ?? s.type}
                        type={s.type}
                        enabled={s.enabled}
                        selected={s.id === selectedId}
                        onSelect={() => setSelectedId(s.id)}
                        onToggle={() => onToggle(s.id)}
                        onDelete={() => onDelete(s.id)}
                      />
                    );
                  })}
                </ul>
              </SortableContext>
            </DndContext>
            {sections.length === 0 && (
              <p className="text-xs text-[var(--color-petroleo)]/60 italic mt-2">
                Sin secciones. Usá los chips de arriba para agregar la primera.
              </p>
            )}
          </div>
        </aside>

        {/* COLUMNA 2 — Iframe live preview */}
        <section className="bg-[var(--color-petroleo-100)] p-3 overflow-hidden">
          <div className="bg-white h-full rounded-xl shadow-inner overflow-hidden flex flex-col">
            <div className="px-3 py-1.5 text-[10px] uppercase tracking-wide font-bold text-[var(--color-petroleo)]/60 border-b border-[var(--color-petroleo-100)] flex items-center justify-between">
              <span>Preview en vivo</span>
              <span className="text-[9px] text-[var(--color-petroleo)]/40">
                Se actualiza al guardar
              </span>
            </div>
            <iframe
              ref={iframeRef}
              key={previewVersion}
              src={previewSrc}
              title="Preview"
              className="flex-1 w-full border-0 min-h-[600px]"
              sandbox="allow-same-origin allow-scripts allow-forms"
            />
          </div>
        </section>

        {/* COLUMNA 3 — Inspector (solo cuando hay seleccionada) */}
        {selected && selectedEditor && (
          <aside className="border-l border-[var(--color-petroleo-100)] bg-white overflow-y-auto overflow-x-hidden max-h-[calc(100vh-140px)] min-w-0">
            <div className="p-3">
              <Inspector
                sectionId={selected.id}
                type={selected.type}
                editor={selectedEditor}
                initialData={selected.data}
                saving={pending}
                errors={feedback?.kind === "error" ? feedback.fieldErrors : undefined}
                onSave={onSave}
              />
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="mt-3 text-xs text-[var(--color-petroleo)]/60 hover:underline"
              >
                ← Volver al preview
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
