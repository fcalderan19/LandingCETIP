"use client";
import { FormEvent, useState } from "react";

type State = "idle" | "loading" | "ok" | "error";

export default function ContactoForm() {
  const [state, setState] = useState<State>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;
    const errs: Record<string, string> = {};
    if (!data.nombre?.trim()) errs.nombre = "Ingresá tu nombre";
    if (!/^\S+@\S+\.\S+$/.test(data.email || "")) errs.email = "Email inválido";
    if (!data.telefono?.trim()) errs.telefono = "Ingresá un teléfono";
    if (!data.motivo) errs.motivo = "Elegí un motivo";
    if (!data.mensaje?.trim()) errs.mensaje = "Contanos brevemente";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setState("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error();
      setState("ok");
      (e.target as HTMLFormElement).reset();
    } catch {
      setState("error");
    }
  }

  return (
    <section id="contacto-form" className="py-16 md:py-24 bg-[var(--color-petroleo-50)]">
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-center reveal">
          <span className="text-xs font-semibold uppercase text-[var(--color-celeste-600)]">Consulta o derivación</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-[var(--color-petroleo)]">Escribinos</h2>
          <p className="mt-3 text-[var(--color-petroleo)]/75">
            Completá el formulario y te responderemos a la brevedad.
          </p>
        </div>

        <form onSubmit={onSubmit} noValidate className="reveal mt-8 bg-white rounded-3xl shadow-sm border border-[var(--color-petroleo-100)] p-6 md:p-8 grid gap-4">
          <Field label="Nombre y apellido" name="nombre" error={errors.nombre} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Email" name="email" type="email" error={errors.email} />
            <Field label="Teléfono" name="telefono" type="tel" error={errors.telefono} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-petroleo)] mb-1">Motivo de consulta</label>
            <select name="motivo" className="w-full rounded-xl border border-[var(--color-petroleo-100)] bg-white px-3 py-2.5">
              <option value="">Seleccioná una opción</option>
              <option>CET</option>
              <option>Consultorios</option>
              <option>Talleres</option>
              <option>Otro</option>
            </select>
            {errors.motivo && <p className="text-xs text-[var(--color-coral)] mt-1">{errors.motivo}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-petroleo)] mb-1">Mensaje</label>
            <textarea name="mensaje" rows={5} className="w-full rounded-xl border border-[var(--color-petroleo-100)] bg-white px-3 py-2.5" />
            {errors.mensaje && <p className="text-xs text-[var(--color-coral)] mt-1">{errors.mensaje}</p>}
          </div>

          <p className="text-xs text-[var(--color-petroleo)]/60">
            Tus datos serán tratados conforme a nuestra política de privacidad y no se compartirán con terceros.
          </p>

          <div className="flex items-center gap-3">
            <button
              disabled={state === "loading"}
              className="bg-[var(--color-coral)] hover:bg-[var(--color-coral-600)] disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-full"
            >
              {state === "loading" ? "Enviando…" : "Enviar consulta"}
            </button>
            {state === "ok" && <span className="text-sm text-[var(--color-verde-600)] font-medium">¡Recibimos tu mensaje! Te respondemos pronto.</span>}
            {state === "error" && <span className="text-sm text-[var(--color-coral)] font-medium">Hubo un error. Probá nuevamente.</span>}
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text", error }: { label: string; name: string; type?: string; error?: string }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-[var(--color-petroleo)] mb-1">{label}</label>
      <input id={name} name={name} type={type} className="w-full rounded-xl border border-[var(--color-petroleo-100)] bg-white px-3 py-2.5" />
      {error && <p className="text-xs text-[var(--color-coral)] mt-1">{error}</p>}
    </div>
  );
}
