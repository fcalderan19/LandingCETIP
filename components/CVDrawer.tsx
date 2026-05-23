"use client";
import { FormEvent, useEffect, useState } from "react";
import { IconClose } from "./Icons";

export default function CVDrawer() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    try {
      const fd = new FormData(e.currentTarget);
      const res = await fetch("/api/rrhh", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      setState("ok");
      (e.target as HTMLFormElement).reset();
    } catch {
      setState("error");
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Cargá tu CV"
        className="fixed top-1/2 right-0 z-40 bg-[var(--color-coral)] hover:bg-[var(--color-coral-600)] text-white font-semibold tracking-wider px-3 py-4 rounded-l-xl shadow-lg hover:shadow-2xl hover:pr-5 transition-all duration-300"
        style={{ writingMode: "vertical-rl", transform: "translateY(-50%) rotate(180deg)" }}
      >
        Cargá tu CV
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 anim-fade" onClick={() => setOpen(false)} />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Cargá tu CV"
            className="absolute right-0 top-0 h-full w-full sm:w-[460px] bg-white shadow-2xl flex flex-col anim-slide-right"
          >
            <header className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-petroleo-100)]">
              <h2 className="font-bold text-[var(--color-petroleo)]">Cargá tu CV</h2>
              <button onClick={() => setOpen(false)} aria-label="Cerrar"><IconClose /></button>
            </header>
            <form onSubmit={onSubmit} encType="multipart/form-data" className="p-5 grid gap-3 overflow-y-auto">
              <Field name="nombre" label="Nombre y apellido" />
              <Field name="email" label="Email" type="email" />
              <Field name="telefono" label="Teléfono" type="tel" />
              <Field name="profesion" label="Profesión / título" />
              <div>
                <label className="block text-sm font-medium text-[var(--color-petroleo)] mb-1">CV (PDF)</label>
                <input name="cv" type="file" accept="application/pdf" required className="block w-full text-sm" />
              </div>
              <button
                disabled={state === "loading"}
                className="bg-[var(--color-coral)] hover:bg-[var(--color-coral-600)] disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-full mt-2"
              >
                {state === "loading" ? "Enviando…" : "Enviar"}
              </button>
              {state === "ok" && <p className="text-sm text-[var(--color-verde-600)] font-medium">¡Gracias! Recibimos tu CV.</p>}
              {state === "error" && <p className="text-sm text-[var(--color-coral)] font-medium">Error al enviar. Probá de nuevo.</p>}
            </form>
          </aside>
        </div>
      )}
    </>
  );
}

function Field({ name, label, type = "text" }: { name: string; label: string; type?: string }) {
  return (
    <div>
      <label htmlFor={`drw-${name}`} className="block text-sm font-medium text-[var(--color-petroleo)] mb-1">{label}</label>
      <input id={`drw-${name}`} name={name} type={type} required className="w-full rounded-xl border border-[var(--color-petroleo-100)] bg-white px-3 py-2.5 transition-all focus:border-[var(--color-coral)] focus:ring-2 focus:ring-[var(--color-coral)]/20 focus:outline-none" />
    </div>
  );
}
