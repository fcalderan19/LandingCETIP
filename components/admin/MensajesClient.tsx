"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type {
  SubmissionListItem,
  ActiveKind,
} from "@/app/admin/_actions/submissions";
import {
  markSubmissionRead,
  archiveSubmission,
  deleteSubmission,
} from "@/app/admin/_actions/submissions";
import {
  IconInbox,
  IconMailOpen,
  IconArchive,
  IconTrash,
  IconExternal,
  IconMail,
  IconEye,
} from "./AdminIcons";

type Props = {
  initialItems: SubmissionListItem[];
  activeKinds: ActiveKind[];
  totalUnread: number;
  currentKind: string;
  showArchived: boolean;
};

export default function MensajesClient({
  initialItems,
  activeKinds,
  totalUnread,
  currentKind,
  showArchived,
}: Props) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialItems[0]?.id ?? null,
  );
  const [pending, startTransition] = useTransition();

  const selected = items.find((i) => i.id === selectedId) ?? null;

  function setKind(kind: string) {
    const params = new URLSearchParams();
    if (kind !== "todos") params.set("kind", kind);
    if (showArchived) params.set("archived", "1");
    router.push(`/admin/mensajes${params.toString() ? "?" + params.toString() : ""}`);
  }

  function toggleArchivedView() {
    const params = new URLSearchParams();
    if (currentKind !== "todos") params.set("kind", currentKind);
    if (!showArchived) params.set("archived", "1");
    router.push(`/admin/mensajes${params.toString() ? "?" + params.toString() : ""}`);
  }

  async function toggleRead(id: string, next: boolean) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, read: next } : i)));
    startTransition(async () => {
      await markSubmissionRead(id, next);
      router.refresh();
    });
  }

  async function archive(id: string, next: boolean) {
    startTransition(async () => {
      const res = await archiveSubmission(id, next);
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id || showArchived));
        if (selectedId === id) setSelectedId(null);
        router.refresh();
      }
    });
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar este mensaje? No se puede deshacer.")) return;
    startTransition(async () => {
      const res = await deleteSubmission(id);
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
        if (selectedId === id) setSelectedId(null);
        router.refresh();
      }
    });
  }

  function openItem(id: string) {
    setSelectedId(id);
    const it = items.find((i) => i.id === id);
    if (it && !it.read) void toggleRead(id, true);
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="shrink-0 px-5 py-3 bg-white border-b border-[var(--color-petroleo-100)] shadow-sm flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-base font-bold text-[var(--color-petroleo)] inline-flex items-center gap-2">
            <IconInbox size={17} />
            Buzón de mensajes
          </h1>
          <p className="text-[11px] text-[var(--color-petroleo)]/60">
            {items.length} {items.length === 1 ? "mensaje" : "mensajes"}
            {totalUnread > 0 && ` · ${totalUnread} sin leer`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleArchivedView}
            className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-[var(--color-petroleo-100)] bg-white text-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-50)] text-xs font-semibold"
          >
            <IconArchive size={13} />
            <span>{showArchived ? "Ver bandeja" : "Ver archivados"}</span>
          </button>
        </div>
      </header>

      <div className="flex-1 min-h-0 grid" style={{ gridTemplateColumns: "260px 1fr 480px" }}>
        {/* Kind filters */}
        <aside className="border-r border-[var(--color-petroleo-100)] bg-white overflow-y-auto p-2">
          <h3 className="px-2 mb-2 text-[10px] uppercase tracking-wider font-bold text-[var(--color-petroleo)]/60">
            Origen
          </h3>
          <ul className="space-y-0.5">
            <KindRow
              label="Todos los mensajes"
              active={currentKind === "todos"}
              count={activeKinds.reduce((n, k) => n + k.count, 0)}
              unread={totalUnread}
              onClick={() => setKind("todos")}
            />
            {activeKinds.map((k) => (
              <KindRow
                key={k.kind}
                label={k.label}
                sub={k.pageSlugs.length > 0 ? `en ${k.pageSlugs.map(s => "/" + s).join(", ")}` : "sin página publicada"}
                active={currentKind === k.kind}
                count={k.count}
                unread={k.unread}
                onClick={() => setKind(k.kind)}
              />
            ))}
          </ul>
          <p className="mt-4 px-2 text-[10px] text-[var(--color-petroleo)]/50 leading-relaxed">
            Los orígenes se detectan automáticamente cuando publicás un bloque
            de formulario en una página.
          </p>
        </aside>

        {/* List */}
        <section className="bg-[var(--color-petroleo-50)] overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-white border border-[var(--color-petroleo-100)] flex items-center justify-center text-[var(--color-petroleo)]/40 mb-3">
                <IconInbox size={24} />
              </div>
              <p className="text-sm text-[var(--color-petroleo)]/60">
                {showArchived ? "No hay mensajes archivados." : "Todavía no hay mensajes."}
              </p>
            </div>
          ) : (
            <ul>
              {items.map((it) => {
                const isSelected = it.id === selectedId;
                return (
                  <li key={it.id}>
                    <button
                      type="button"
                      onClick={() => openItem(it.id)}
                      className={`w-full text-left px-4 py-3 border-b border-[var(--color-petroleo-100)]/60 transition ${
                        isSelected
                          ? "bg-white"
                          : "hover:bg-white/70"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          aria-hidden="true"
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            it.read
                              ? "bg-transparent"
                              : "bg-[var(--color-celeste)]"
                          }`}
                        />
                        <span className="text-[9px] uppercase font-bold tracking-wider text-[var(--color-petroleo)]/50">
                          {kindLabel(it.kind)}
                        </span>
                        <span className="ml-auto text-[10px] text-[var(--color-petroleo)]/60">
                          {formatDate(it.createdAt)}
                        </span>
                      </div>
                      <div className={`text-sm truncate ${it.read ? "font-medium text-[var(--color-petroleo)]/80" : "font-bold text-[var(--color-petroleo)]"}`}>
                        {it.name || it.email || "(sin nombre)"}
                      </div>
                      <div className="text-xs text-[var(--color-petroleo)]/60 truncate">
                        {it.subject || it.message?.slice(0, 90) || "(sin asunto)"}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Detail */}
        <aside className="border-l border-[var(--color-petroleo-100)] bg-white overflow-y-auto">
          {selected ? (
            <DetailPane
              item={selected}
              onToggleRead={(read) => toggleRead(selected.id, read)}
              onArchive={(a) => archive(selected.id, a)}
              onDelete={() => remove(selected.id)}
              pending={pending}
            />
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm text-[var(--color-petroleo)]/60">
                Elegí un mensaje de la lista para verlo.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function KindRow({
  label,
  sub,
  count,
  unread,
  active,
  onClick,
}: {
  label: string;
  sub?: string;
  count: number;
  unread: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={`w-full text-left px-3 py-2 rounded-lg transition ${
          active
            ? "bg-[var(--color-petroleo)] text-white"
            : "hover:bg-[var(--color-petroleo-50)]"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className={`text-xs font-semibold truncate ${active ? "text-white" : "text-[var(--color-petroleo)]"}`}>
            {label}
          </span>
          {unread > 0 ? (
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                active
                  ? "bg-white text-[var(--color-petroleo)]"
                  : "bg-[var(--color-celeste)] text-white"
              }`}
            >
              {unread}
            </span>
          ) : (
            <span className={`text-[10px] ${active ? "text-white/60" : "text-[var(--color-petroleo)]/50"}`}>
              {count}
            </span>
          )}
        </div>
        {sub && (
          <div className={`text-[10px] mt-0.5 truncate font-mono ${active ? "text-white/70" : "text-[var(--color-petroleo)]/55"}`}>
            {sub}
          </div>
        )}
      </button>
    </li>
  );
}

function DetailPane({
  item,
  onToggleRead,
  onArchive,
  onDelete,
  pending,
}: {
  item: SubmissionListItem;
  onToggleRead: (read: boolean) => void;
  onArchive: (a: boolean) => void;
  onDelete: () => void;
  pending: boolean;
}) {
  const attachments = Array.isArray(item.attachments)
    ? (item.attachments as Array<{ url: string; filename: string; size: number; mime: string }>)
    : [];
  return (
    <div className="p-5">
      <div className="mb-4">
        <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-petroleo)]/50">
          {kindLabel(item.kind)}
          {item.pageSlug && <span className="font-mono"> · /{item.pageSlug}</span>}
        </div>
        <h2 className="text-lg font-bold text-[var(--color-petroleo)] mt-1">
          {item.subject || item.name || "(sin asunto)"}
        </h2>
        <div className="mt-2 text-xs text-[var(--color-petroleo)]/70">
          {new Date(item.createdAt).toLocaleString("es-AR")}
        </div>
      </div>

      <div className="rounded-xl border border-[var(--color-petroleo-100)] p-3 mb-4 bg-[var(--color-petroleo-50)]/50 space-y-1 text-xs">
        {item.name && (
          <Row label="Nombre" value={item.name} />
        )}
        {item.email && (
          <Row label="Email" value={item.email} href={`mailto:${item.email}`} />
        )}
        {item.phone && (
          <Row label="Teléfono" value={item.phone} href={`tel:${item.phone}`} />
        )}
      </div>

      {item.message && (
        <div className="mb-4">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-petroleo)]/50 mb-1">
            Mensaje
          </div>
          <div className="rounded-xl border border-[var(--color-petroleo-100)] p-3 text-sm whitespace-pre-wrap text-[var(--color-petroleo)]/90">
            {item.message}
          </div>
        </div>
      )}

      {attachments.length > 0 && (
        <div className="mb-4">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-petroleo)]/50 mb-1">
            Adjuntos
          </div>
          <ul className="space-y-1.5">
            {attachments.map((a, i) => (
              <li key={i} className="flex items-center gap-2 text-xs">
                <span className="flex-1 truncate">{a.filename}</span>
                <span className="text-[10px] text-[var(--color-petroleo)]/50 shrink-0">
                  {formatBytes(a.size)}
                </span>
                {a.url ? (
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-celeste-600)] hover:underline"
                  >
                    <IconExternal size={11} /> Abrir
                  </a>
                ) : (
                  <span className="text-[10px] text-[var(--color-coral)]">
                    (no subido)
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-3 border-t border-[var(--color-petroleo-100)]">
        {item.email && (
          <a
            href={`mailto:${item.email}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[var(--color-celeste)] hover:bg-[var(--color-celeste-600)] text-white"
          >
            <IconMail size={13} /> Responder
          </a>
        )}
        <button
          type="button"
          onClick={() => onToggleRead(!item.read)}
          disabled={pending}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[var(--color-petroleo-100)] bg-white text-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-50)]"
        >
          {item.read ? <IconMail size={13} /> : <IconMailOpen size={13} />}
          <span>{item.read ? "Marcar sin leer" : "Marcar leído"}</span>
        </button>
        <button
          type="button"
          onClick={() => onArchive(!item.archived)}
          disabled={pending}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[var(--color-petroleo-100)] bg-white text-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-50)]"
        >
          <IconArchive size={13} />
          <span>{item.archived ? "Desarchivar" : "Archivar"}</span>
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={pending}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-[var(--color-coral)] hover:bg-[var(--color-coral)]/10 ml-auto"
        >
          <IconTrash size={13} />
          <span>Eliminar</span>
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-[var(--color-petroleo)]/60 shrink-0">{label}</span>
      {href ? (
        <a
          href={href}
          className="font-medium text-[var(--color-petroleo)] hover:text-[var(--color-celeste-600)] hover:underline truncate"
        >
          {value}
        </a>
      ) : (
        <span className="font-medium text-[var(--color-petroleo)] truncate">{value}</span>
      )}
    </div>
  );
}

function kindLabel(k: string): string {
  return (
    ({
      contacto: "Contacto",
      admision: "Admisión",
      rrhh: "RR.HH.",
      otro: "Otro",
    } as Record<string, string>)[k] ?? k
  );
}

function formatDate(d: Date | string): string {
  const date = new Date(d);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) {
    return date.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
  });
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
