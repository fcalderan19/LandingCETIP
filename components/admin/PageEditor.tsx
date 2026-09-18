"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
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
import SectionPicker from "./SectionPicker";
import Inspector from "./Inspector";
import Link from "next/link";
import {
  IconPlus,
  IconUndo,
  IconRefresh,
  IconExternal,
  IconPublish,
  IconDraft,
  IconArrowLeft,
  SectionIcon,
} from "./AdminIcons";
import { updatePage } from "@/app/admin/_actions/pages";
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
  icon?: string;
  editor: SectionEditorMeta;
  defaults: Record<string, unknown>;
};

type Props = {
  pageId: string;
  pageTitle: string;
  pageSlug: string;
  initialPublished: boolean;
  initialSections: EditorSection[];
  catalog: EditorCatalogItem[];
};

type HistoryEntry = {
  label: string;
  undo: () => Promise<void>;
};

const HISTORY_LIMIT = 20;

export default function PageEditor({
  pageId,
  pageTitle,
  pageSlug,
  initialPublished,
  initialSections,
  catalog,
}: Props) {
  const [sections, setSections] = useState<EditorSection[]>(initialSections);
  const [published, setPublished] = useState<boolean>(initialPublished);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<
    | { kind: "ok"; message: string }
    | { kind: "error"; message: string; fieldErrors?: Record<string, string[]> }
    | null
  >(null);
  const [previewVersion, setPreviewVersion] = useState(0);
  const [pickerAt, setPickerAt] = useState<number | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const historyRef = useRef<HistoryEntry[]>([]);
  const [historyLen, setHistoryLen] = useState(0);

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

  // Auto-collapse the main admin sidebar while editing a block.
  useEffect(() => {
    const html = document.documentElement;
    if (selectedId) html.setAttribute("data-admin-editing", "1");
    else html.removeAttribute("data-admin-editing");
    return () => html.removeAttribute("data-admin-editing");
  }, [selectedId]);

  // Highlight the currently-edited block inside the preview iframe.
  // The iframe is same-origin, so we can inject styles and toggle a class
  // directly on the wrapper we rendered around each section.
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let cleanupFns: Array<() => void> = [];

    function paint() {
      const doc = iframe?.contentDocument;
      if (!doc) return;

      // Ensure the highlight stylesheet is injected once per document.
      const STYLE_ID = "admin-preview-highlight-style";
      if (!doc.getElementById(STYLE_ID)) {
        const style = doc.createElement("style");
        style.id = STYLE_ID;
        style.textContent = `
          .admin-anchor-section {
            position: relative;
            transition: outline-color .18s ease, box-shadow .18s ease;
            outline: 2px solid transparent;
            outline-offset: -2px;
          }
          .admin-anchor-section.admin-hover:not(.admin-editing) {
            outline-color: rgba(0, 174, 239, 0.45);
            cursor: pointer;
          }
          .admin-anchor-section.admin-editing {
            outline: 3px solid #00aeef;
            outline-offset: -3px;
            box-shadow: 0 0 0 6px rgba(0, 174, 239, 0.18);
          }
          .admin-anchor-section.admin-editing::before {
            content: attr(data-section-label);
            position: absolute;
            top: 0;
            left: 0;
            z-index: 40;
            background: #00aeef;
            color: white;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.03em;
            text-transform: uppercase;
            padding: 4px 10px;
            border-bottom-right-radius: 8px;
            pointer-events: none;
            font-family: system-ui, -apple-system, sans-serif;
          }
        `;
        doc.head.appendChild(style);
      }

      // Clear any previous highlight/hover state.
      doc
        .querySelectorAll(".admin-anchor-section")
        .forEach((el) => el.classList.remove("admin-editing"));

      // Block ALL interactive navigation inside the preview: clicks on
      // links, buttons and form submissions never actually navigate away.
      // Instead we select the containing section so the editor stays put.
      const rootHandler = (e: Event) => {
        const target = e.target as HTMLElement;
        const section = target.closest<HTMLElement>(
          ".admin-anchor-section[data-section-id]",
        );
        // Prevent navigation / submission unconditionally.
        if (target.closest("a, button, [role='button'], input[type='submit']")) {
          e.preventDefault();
          e.stopPropagation();
        }
        if (section) {
          const id = section.getAttribute("data-section-id");
          if (id) setSelectedId(id);
        }
      };
      const submitHandler = (e: Event) => e.preventDefault();
      doc.addEventListener("click", rootHandler, true);
      doc.addEventListener("submit", submitHandler, true);
      cleanupFns.push(() => {
        doc.removeEventListener("click", rootHandler, true);
        doc.removeEventListener("submit", submitHandler, true);
      });

      // Hover state per section for visual feedback.
      const anchors = doc.querySelectorAll<HTMLElement>(
        ".admin-anchor-section[data-section-id]",
      );
      anchors.forEach((el) => {
        const onEnter = () => el.classList.add("admin-hover");
        const onLeave = () => el.classList.remove("admin-hover");
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
        cleanupFns.push(() => {
          el.removeEventListener("mouseenter", onEnter);
          el.removeEventListener("mouseleave", onLeave);
        });
      });

      // Apply the highlight to the current selection (if any).
      if (selectedId) {
        const el = doc.querySelector<HTMLElement>(
          `.admin-anchor-section[data-section-id="${selectedId}"]`,
        );
        if (el) {
          el.classList.add("admin-editing");
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }

    // Run once now, then again on every iframe navigation/load.
    paint();
    const onLoad = () => paint();
    iframe.addEventListener("load", onLoad);
    cleanupFns.push(() => iframe.removeEventListener("load", onLoad));

    return () => {
      const fns = cleanupFns;
      cleanupFns = [];
      fns.forEach((fn) => fn());
    };
  }, [selectedId, previewVersion, sections.length]);

  const previewPath = pageSlug === "home" ? "/" : `/${pageSlug}`;
  const previewSrc = `${previewPath}?_v=${previewVersion}`;

  useEffect(() => {
    if (feedback?.kind !== "ok") return;
    const t = setTimeout(() => setFeedback(null), 2000);
    return () => clearTimeout(t);
  }, [feedback]);

  const bumpPreview = useCallback(() => {
    setPreviewVersion((v) => v + 1);
  }, []);

  const pushHistory = useCallback((entry: HistoryEntry) => {
    const next = [...historyRef.current, entry].slice(-HISTORY_LIMIT);
    historyRef.current = next;
    setHistoryLen(next.length);
  }, []);

  const popHistory = useCallback((): HistoryEntry | null => {
    const stack = historyRef.current;
    if (stack.length === 0) return null;
    const entry = stack[stack.length - 1];
    const next = stack.slice(0, -1);
    historyRef.current = next;
    setHistoryLen(next.length);
    return entry;
  }, []);

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    reorderTo(arrayMove(sections, oldIndex, newIndex), sections, "Reordenado");
  }

  function reorderTo(next: EditorSection[], prev: EditorSection[], label: string) {
    setSections(next);
    startTransition(async () => {
      const res = await reorderSections({
        pageId,
        orderedIds: next.map((s) => s.id),
      });
      if (!res.ok) {
        setFeedback({ kind: "error", message: `No se pudo guardar el orden (${res.error})` });
        setSections(prev);
        return;
      }
      setFeedback({ kind: "ok", message: label });
      bumpPreview();
      pushHistory({
        label,
        undo: async () => {
          setSections(prev);
          const undoRes = await reorderSections({
            pageId,
            orderedIds: prev.map((s) => s.id),
          });
          if (undoRes.ok) bumpPreview();
        },
      });
    });
  }

  function onMoveUp(id: string) {
    const idx = sections.findIndex((s) => s.id === id);
    if (idx <= 0) return;
    reorderTo(arrayMove(sections, idx, idx - 1), sections, "Sección subida");
  }

  function onMoveDown(id: string) {
    const idx = sections.findIndex((s) => s.id === id);
    if (idx < 0 || idx >= sections.length - 1) return;
    reorderTo(arrayMove(sections, idx, idx + 1), sections, "Sección bajada");
  }

  function onAdd(type: string, atIndex?: number) {
    const entry = catalogByType.get(type);
    if (!entry) return;
    setPickerAt(null);
    startTransition(async () => {
      const res = await addSection({ pageId, type, atIndex });
      if (!res.ok) {
        setFeedback({ kind: "error", message: `No se pudo agregar (${res.error})` });
        return;
      }
      const created = res.data as { id: string };
      const insertAt = atIndex ?? sections.length;
      const newSection: EditorSection = {
        id: created.id,
        type,
        data: entry.defaults,
        enabled: true,
        order: insertAt,
      };
      setSections((prev) => {
        const copy = [...prev];
        copy.splice(insertAt, 0, newSection);
        return copy;
      });
      setSelectedId(created.id);
      bumpPreview();
      setFeedback({ kind: "ok", message: "Sección agregada" });
      pushHistory({
        label: "Agregar sección",
        undo: async () => {
          setSections((prev) => prev.filter((s) => s.id !== created.id));
          if (selectedId === created.id) setSelectedId(null);
          const undoRes = await deleteSection(created.id);
          if (undoRes.ok) bumpPreview();
        },
      });
    });
  }

  function onToggle(id: string) {
    const s = sections.find((x) => x.id === id);
    if (!s) return;
    const enabled = !s.enabled;
    const prevEnabled = s.enabled;
    setSections((prev) =>
      prev.map((x) => (x.id === id ? { ...x, enabled } : x)),
    );
    startTransition(async () => {
      const res = await toggleSection(id, enabled);
      if (!res.ok) {
        setFeedback({ kind: "error", message: `No se pudo actualizar (${res.error})` });
        return;
      }
      bumpPreview();
      pushHistory({
        label: enabled ? "Mostrar sección" : "Ocultar sección",
        undo: async () => {
          setSections((prev) =>
            prev.map((x) => (x.id === id ? { ...x, enabled: prevEnabled } : x)),
          );
          const undoRes = await toggleSection(id, prevEnabled);
          if (undoRes.ok) bumpPreview();
        },
      });
    });
  }

  function onDelete(id: string) {
    if (!confirm("¿Eliminar esta sección? Podés deshacer inmediatamente después.")) return;
    const prev = sections;
    const removed = prev.find((s) => s.id === id);
    if (!removed) return;
    const removedIndex = prev.findIndex((s) => s.id === id);
    setSections((p) => p.filter((s) => s.id !== id));
    if (selectedId === id) setSelectedId(null);
    startTransition(async () => {
      const res = await deleteSection(id);
      if (!res.ok) {
        setFeedback({ kind: "error", message: `No se pudo eliminar (${res.error})` });
        setSections(prev);
        return;
      }
      setFeedback({ kind: "ok", message: "Sección eliminada" });
      bumpPreview();
      pushHistory({
        label: "Eliminar sección",
        undo: async () => {
          const undoRes = await addSection({
            pageId,
            type: removed.type,
            atIndex: removedIndex,
            data: removed.data,
          });
          if (undoRes.ok) {
            const created = undoRes.data as { id: string };
            const restored: EditorSection = { ...removed, id: created.id };
            setSections((p) => {
              const copy = [...p];
              copy.splice(Math.min(removedIndex, copy.length), 0, restored);
              return copy;
            });
            bumpPreview();
          }
        },
      });
    });
  }

  function onSave(data: Record<string, unknown>) {
    if (!selected) return;
    const id = selected.id;
    const prevData = selected.data;
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, data } : s)));
    startTransition(async () => {
      const res = await updateSection(id, data);
      if (!res.ok) {
        setFeedback({
          kind: "error",
          message: `No se pudo guardar (${res.error})`,
          fieldErrors: res.fieldErrors,
        });
        return;
      }
      setFeedback({ kind: "ok", message: "Guardado" });
      bumpPreview();
      pushHistory({
        label: "Editar sección",
        undo: async () => {
          setSections((prev) => prev.map((s) => (s.id === id ? { ...s, data: prevData } : s)));
          const undoRes = await updateSection(id, prevData);
          if (undoRes.ok) bumpPreview();
        },
      });
    });
  }

  function onTogglePublish() {
    const next = !published;
    setPublished(next);
    startTransition(async () => {
      const res = await updatePage(pageId, { published: next });
      if (!res.ok) {
        setFeedback({
          kind: "error",
          message: `No se pudo ${next ? "publicar" : "pasar a borrador"} (${res.error})`,
        });
        setPublished(!next);
        return;
      }
      setFeedback({
        kind: "ok",
        message: next ? "Página publicada" : "Pasada a borrador",
      });
      bumpPreview();
    });
  }

  function onUndo() {
    const entry = popHistory();
    if (!entry) return;
    startTransition(async () => {
      try {
        await entry.undo();
        setFeedback({ kind: "ok", message: `Deshecho: ${entry.label}` });
      } catch (err) {
        setFeedback({
          kind: "error",
          message: `No se pudo deshacer (${err instanceof Error ? err.message : "error"})`,
        });
      }
    });
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="shrink-0 px-5 py-3 bg-white border-b border-[var(--color-petroleo-100)] shadow-sm">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="min-w-0 flex items-center gap-2.5">
            <Link
              href="/admin/pages"
              aria-label="Volver a la lista de páginas"
              title="Volver a la lista de páginas"
              className="shrink-0 w-8 h-8 rounded-lg text-[var(--color-petroleo)]/70 hover:text-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-50)] flex items-center justify-center transition"
            >
              <IconArrowLeft size={16} />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-[var(--color-petroleo)] truncate">
                  {pageTitle}
                </h1>
                <span
                  className={`shrink-0 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                    published
                      ? "bg-[var(--color-verde)]/12 text-[var(--color-verde-600)]"
                      : "bg-[var(--color-naranja)]/15 text-[var(--color-naranja-600)]"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      published
                        ? "bg-[var(--color-verde-600)]"
                        : "bg-[var(--color-naranja-600)]"
                    }`}
                  />
                  {published ? "Publicada" : "Borrador"}
                </span>
              </div>
              <p className="text-[11px] text-[var(--color-petroleo)]/60 flex items-center gap-1.5">
                <span className="font-mono">/{pageSlug === "home" ? "" : pageSlug}</span>
                <span className="text-[var(--color-petroleo)]/30">·</span>
                <span>{sections.length} {sections.length === 1 ? "sección" : "secciones"}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {feedback && (
              <span
                role="status"
                className={`text-xs font-medium px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 ${
                  feedback.kind === "ok"
                    ? "bg-[var(--color-verde)]/12 text-[var(--color-verde-600)]"
                    : "bg-[var(--color-coral)]/12 text-[var(--color-coral-600)]"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    feedback.kind === "ok"
                      ? "bg-[var(--color-verde-600)]"
                      : "bg-[var(--color-coral-600)]"
                  } ${pending ? "animate-pulse" : ""}`}
                />
                {pending ? "Guardando…" : feedback.message}
              </span>
            )}
            <button
              type="button"
              onClick={onUndo}
              disabled={historyLen === 0 || pending}
              title={historyLen === 0 ? "Nada para deshacer" : "Deshacer último cambio"}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[var(--color-petroleo-100)] bg-white text-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-50)] disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <IconUndo size={14} />
              <span>Deshacer</span>
              {historyLen > 0 && (
                <span className="ml-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--color-petroleo-50)] text-[var(--color-petroleo)]/70">
                  {historyLen}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={bumpPreview}
              title="Refrescar preview"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[var(--color-petroleo-100)] bg-white text-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-50)] transition"
            >
              <IconRefresh size={14} />
            </button>
            <a
              href={previewPath}
              target="_blank"
              rel="noopener noreferrer"
              title="Abrir la página en una nueva pestaña"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[var(--color-petroleo-100)] bg-white text-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-50)] transition"
            >
              <IconExternal size={14} />
            </a>
            <button
              type="button"
              onClick={onTogglePublish}
              disabled={pending}
              title={published ? "Pasar a borrador (ocultar del sitio público)" : "Publicar (visible en el sitio)"}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition disabled:opacity-50 ${
                published
                  ? "bg-white border-[var(--color-petroleo-100)] text-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-50)]"
                  : "bg-[var(--color-verde)] hover:bg-[var(--color-verde-600)] border-transparent text-white shadow-sm"
              }`}
            >
              {published ? <IconDraft size={14} /> : <IconPublish size={14} />}
              <span>{published ? "Pasar a borrador" : "Publicar"}</span>
            </button>
            <button
              type="button"
              onClick={() => setPickerAt(sections.length)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-[var(--color-celeste)] text-white hover:bg-[var(--color-celeste-600)] shadow-sm transition"
            >
              <IconPlus size={14} />
              <span>Agregar bloque</span>
            </button>
          </div>
        </div>
      </header>

      <div
        className="flex-1 min-h-0 grid bg-[var(--color-petroleo-50)]"
        style={{
          gridTemplateColumns: selected
            ? "72px 1fr 400px"
            : "300px 1fr",
        }}
      >
        {/* COLUMNA 1 — Lista de secciones. Se contrae a rail de íconos
             cuando el inspector está abierto para dar más espacio al preview. */}
        <aside className="border-r border-[var(--color-petroleo-100)] bg-white overflow-y-auto min-h-0">
          <div className={selected ? "p-1.5" : "p-3"}>
            {!selected && (
              <h3 className="text-xs font-bold uppercase text-[var(--color-petroleo)]/70 mb-2">
                Secciones
              </h3>
            )}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
            >
              <SortableContext
                items={sections.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                {selected ? (
                  /* Rail compacto — solo íconos con tooltip */
                  <ul className="space-y-1">
                    {sections.map((s) => {
                      const entry = catalogByType.get(s.type);
                      const isActive = s.id === selectedId;
                      return (
                        <li key={s.id}>
                          <button
                            type="button"
                            onClick={() => setSelectedId(s.id)}
                            title={entry?.label ?? s.type}
                            aria-label={entry?.label ?? s.type}
                            className={`group w-full flex flex-col items-center justify-center py-2 rounded-lg transition ${
                              isActive
                                ? "bg-[var(--color-celeste)]/12 text-[var(--color-celeste-600)] ring-2 ring-[var(--color-celeste)]/30"
                                : "text-[var(--color-petroleo)]/70 hover:bg-[var(--color-petroleo-50)] hover:text-[var(--color-petroleo)]"
                            } ${s.enabled ? "" : "opacity-50"}`}
                          >
                            <SectionIcon name={entry?.icon} size={18} />
                            <span className="mt-1 text-[9px] font-bold uppercase tracking-wide text-current/80 max-w-[56px] truncate">
                              {(entry?.label ?? s.type).split(" ")[0]}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                    <li>
                      <button
                        type="button"
                        onClick={() => setPickerAt(sections.length)}
                        title="Agregar bloque"
                        aria-label="Agregar bloque"
                        className="w-full flex items-center justify-center py-2 rounded-lg border-2 border-dashed border-[var(--color-petroleo-100)] text-[var(--color-petroleo)]/60 hover:border-[var(--color-celeste)] hover:text-[var(--color-celeste-600)] hover:bg-[var(--color-celeste)]/5 transition"
                      >
                        <IconPlus size={16} />
                      </button>
                    </li>
                  </ul>
                ) : (
                  <ul className="space-y-1">
                    <InsertGap onClick={() => setPickerAt(0)} disabled={pending} />
                    {sections.map((s, idx) => {
                      const entry = catalogByType.get(s.type);
                      return (
                        <Fragment key={s.id}>
                          <SectionCard
                            id={s.id}
                            label={entry?.label ?? s.type}
                            type={s.type}
                            iconName={entry?.icon}
                            enabled={s.enabled}
                            selected={s.id === selectedId}
                            canMoveUp={idx > 0}
                            canMoveDown={idx < sections.length - 1}
                            onSelect={() => setSelectedId(s.id)}
                            onToggle={() => onToggle(s.id)}
                            onDelete={() => onDelete(s.id)}
                            onMoveUp={() => onMoveUp(s.id)}
                            onMoveDown={() => onMoveDown(s.id)}
                          />
                          <InsertGap onClick={() => setPickerAt(idx + 1)} disabled={pending} />
                        </Fragment>
                      );
                    })}
                  </ul>
                )}
              </SortableContext>
            </DndContext>
            {sections.length === 0 && (
              <p className="text-xs text-[var(--color-petroleo)]/60 italic mt-2">
                Sin secciones. Tocá "+ Agregar bloque" arriba o el "+" entre líneas.
              </p>
            )}
          </div>
        </aside>

        {/* COLUMNA 2 — Iframe live preview */}
        <section className="bg-[var(--color-petroleo-100)] p-3 overflow-hidden">
          <div className="bg-white h-full rounded-xl shadow-inner overflow-hidden flex flex-col">
            <div className="px-3 py-1.5 text-[10px] uppercase tracking-wide font-bold text-[var(--color-petroleo)]/60 border-b border-[var(--color-petroleo-100)] flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-celeste)] animate-pulse" />
                Preview en vivo
              </span>
              <span className="text-[9px] text-[var(--color-petroleo)]/50 font-medium normal-case tracking-normal">
                Los links están desactivados — hacé clic en un bloque para editarlo
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

        {/* COLUMNA 3 — Inspector */}
        {selected && selectedEditor && (
          <aside className="border-l border-[var(--color-petroleo-100)] bg-white overflow-y-auto overflow-x-hidden min-h-0 min-w-0">
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

      <SectionPicker
        open={pickerAt !== null}
        items={catalog.map((c) => ({
          type: c.type,
          label: c.label,
          description: c.description,
          icon: c.icon,
        }))}
        onPick={(type) => onAdd(type, pickerAt ?? undefined)}
        onClose={() => setPickerAt(null)}
      />
    </div>
  );
}

function InsertGap({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <li className="list-none">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label="Insertar sección aquí"
        className="group w-full flex items-center gap-2 py-1 disabled:opacity-20 disabled:cursor-not-allowed"
      >
        <span className="flex-1 h-px bg-transparent group-hover:bg-[var(--color-celeste)]/40 group-focus:bg-[var(--color-celeste)]/40 transition-colors" />
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-dashed border-[var(--color-petroleo-100)] bg-white text-[var(--color-petroleo)]/30 text-sm font-bold group-hover:border-[var(--color-celeste)] group-hover:bg-[var(--color-celeste)] group-hover:text-white group-hover:border-solid group-hover:scale-110 group-focus:border-[var(--color-celeste)] group-focus:bg-[var(--color-celeste)] group-focus:text-white transition">
          <IconPlus size={12} />
        </span>
        <span className="flex-1 h-px bg-transparent group-hover:bg-[var(--color-celeste)]/40 group-focus:bg-[var(--color-celeste)]/40 transition-colors" />
      </button>
    </li>
  );
}
