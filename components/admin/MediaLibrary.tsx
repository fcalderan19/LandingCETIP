"use client";

import { useRef, useState, useTransition } from "react";
import {
  deleteAsset,
  listMediaAssets,
  updateAssetAlt,
  uploadMediaAsset,
} from "@/app/admin/_actions/media";

type Asset = {
  id: string;
  url: string;
  alt: string | null;
  mime: string;
  size: number;
  width: number | null;
  height: number | null;
};

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function imageDimensions(dataUrl: string): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}

export default function MediaLibrary({ initial }: { initial: Asset[] }) {
  const [assets, setAssets] = useState<Asset[]>(initial);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  async function refresh() {
    const r = await listMediaAssets();
    if (r.ok) setAssets(r.data);
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setFeedback(null);
    try {
      for (const file of Array.from(files)) {
        const dataUrl = await fileToDataUrl(file);
        const dim = await imageDimensions(dataUrl);
        const res = await uploadMediaAsset({
          filename: file.name,
          mime: file.type || "application/octet-stream",
          size: file.size,
          data: dataUrl,
          width: dim?.width,
          height: dim?.height,
        });
        if (!res.ok) {
          setFeedback(`Error subiendo ${file.name}: ${res.message ?? res.error}`);
          break;
        }
      }
      await refresh();
      setFeedback("Subida completada");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function onDelete(id: string) {
    if (!confirm("¿Eliminar este asset?")) return;
    startTransition(async () => {
      const res = await deleteAsset(id);
      if (!res.ok) {
        setFeedback(`No se pudo eliminar (${res.error})`);
        return;
      }
      setAssets((prev) => prev.filter((a) => a.id !== id));
    });
  }

  function onChangeAlt(id: string, alt: string) {
    setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, alt } : a)));
  }

  function onSaveAlt(id: string, alt: string) {
    startTransition(async () => {
      const res = await updateAssetAlt(id, alt);
      if (!res.ok) setFeedback(`No se pudo guardar alt (${res.error})`);
    });
  }

  return (
    <section>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Media</h1>
          <p className="text-sm text-[var(--color-petroleo)]/70">
            Subí imágenes para usarlas en las secciones.
          </p>
        </div>
        <label className="bg-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-700)] text-white font-semibold px-4 py-2 rounded-full text-sm cursor-pointer">
          {uploading ? "Subiendo…" : "+ Subir imágenes"}
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            disabled={uploading}
          />
        </label>
      </header>

      {feedback && (
        <div className="mb-4 rounded-lg bg-[var(--color-celeste)]/10 text-[var(--color-celeste-600)] px-3 py-2 text-sm">
          {feedback}
        </div>
      )}

      {assets.length === 0 ? (
        <p className="text-sm text-[var(--color-petroleo)]/60 italic">
          Sin assets todavía. Subí la primera imagen para arrancar.
        </p>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {assets.map((a) => (
            <li
              key={a.id}
              className="rounded-xl border border-[var(--color-petroleo-100)] bg-white overflow-hidden"
            >
              <div className="aspect-[4/3] bg-[var(--color-petroleo-50)] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.url} alt={a.alt ?? ""} className="w-full h-full object-cover" />
              </div>
              <div className="p-3 space-y-2">
                <input
                  type="text"
                  value={a.alt ?? ""}
                  placeholder="Alt text"
                  onChange={(e) => onChangeAlt(a.id, e.target.value)}
                  onBlur={(e) => onSaveAlt(a.id, e.target.value)}
                  className="w-full text-xs rounded border border-[var(--color-petroleo-100)] px-2 py-1"
                />
                <div className="flex items-center justify-between text-[10px] text-[var(--color-petroleo)]/60">
                  <span>{a.width && a.height ? `${a.width}×${a.height}` : "—"}</span>
                  <span>{Math.round(a.size / 1024)} KB</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(a.url)}
                    className="text-[10px] text-[var(--color-celeste-600)] hover:underline"
                  >
                    Copiar URL
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => onDelete(a.id)}
                    className="text-[10px] text-[var(--color-coral)] hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
