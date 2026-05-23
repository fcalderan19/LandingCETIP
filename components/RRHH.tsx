"use client";
import { FormEvent, useState } from "react";

export default function RRHH() {
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");

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
    <section id="rrhh" className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-2 gap-12 items-start">
        <div className="reveal">
          <span className="text-xs font-semibold uppercase text-[var(--color-celeste-600)]">RRHH</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-[var(--color-petroleo)]">
            Sumate al equipo
          </h2>
          <p className="mt-4 text-[var(--color-petroleo)]/80">
            Buscamos profesionales con vocación, formación sólida y trabajo en equipo. Si te interesa
            sumarte a CETIP, dejanos tus datos y tu CV. Nos pondremos en contacto cuando haya una
            búsqueda compatible.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-[var(--color-petroleo)]/80">
            <li>• Capacitación interna continua</li>
            <li>• Trabajo interdisciplinario</li>
            <li>• Ambiente cálido y colaborativo</li>
          </ul>
        </div>

        <form
          onSubmit={onSubmit}
          encType="multipart/form-data"
          className="reveal bg-[var(--color-petroleo-50)] rounded-3xl p-6 md:p-8 grid gap-4 border border-[var(--color-petroleo-100)]"
        >
          <Input name="nombre" label="Nombre y apellido" required />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input name="email" label="Email" type="email" required />
            <Input name="telefono" label="Teléfono" type="tel" required />
          </div>
          <Input name="profesion" label="Profesión / título" required />
          <div>
            <label className="block text-sm font-medium text-[var(--color-petroleo)] mb-1">Experiencia</label>
            <textarea name="experiencia" rows={4} required className="w-full rounded-xl border border-[var(--color-petroleo-100)] bg-white px-3 py-2.5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-petroleo)] mb-1">CV (PDF)</label>
            <input name="cv" type="file" accept="application/pdf" required className="block w-full text-sm" />
          </div>
          <button
            disabled={state === "loading"}
            className="bg-[var(--color-verde)] hover:bg-[var(--color-verde-600)] disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-full w-fit"
          >
            {state === "loading" ? "Enviando…" : "Enviar CV"}
          </button>
          {state === "ok" && <p className="text-sm text-[var(--color-verde-600)] font-medium">¡Gracias! Recibimos tu postulación.</p>}
          {state === "error" && <p className="text-sm text-[var(--color-coral)] font-medium">No pudimos enviar. Intentá nuevamente.</p>}
        </form>
      </div>
    </section>
  );
}

function Input({ name, label, type = "text", required }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-[var(--color-petroleo)] mb-1">{label}</label>
      <input id={name} name={name} type={type} required={required} className="w-full rounded-xl border border-[var(--color-petroleo-100)] bg-white px-3 py-2.5" />
    </div>
  );
}
