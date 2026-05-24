"use client";
import { FormEvent, useState } from "react";

type State = "idle" | "loading" | "ok" | "error";

const programas = [
  "Centro Educativo Terapéutico",
  "Tratamiento en Consultorios Externos",
  "Talleres",
  "Evaluaciones Diagnósticas",
  "A definir con el equipo"
];

const tratamientoActual = ["Sí", "No"];

export default function AdmisionForm() {
  const [state, setState] = useState<State>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    try {
      const fd = new FormData(e.currentTarget);
      const data = Object.fromEntries(fd.entries());
      const res = await fetch("/api/admision", {
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
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4">
        <form
          onSubmit={onSubmit}
          className="reveal bg-white rounded-3xl shadow-sm border border-[var(--color-petroleo-100)] p-6 md:p-10 grid gap-6"
        >
          <Block title="Datos de quien solicita tratamiento" color="celeste">
            <Grid2>
              <Field name="paciente_nombre" label="Nombre y apellido" required />
              <Field name="paciente_dni" label="DNI" required />
              <Field name="paciente_nacimiento" label="Fecha de nacimiento" type="date" required />
              <Field name="paciente_escolaridad" label="Escolaridad" />
            </Grid2>
          </Block>

          <Block title="Datos del responsable / familiar" color="coral">
            <Grid2>
              <Field name="responsable_nombre" label="Nombre y apellido" required />
              <Field name="responsable_vinculo" label="Vínculo con el solicitante" required />
              <Field name="responsable_telefono" label="Teléfono" type="tel" required />
              <Field name="responsable_email" label="Email" type="email" required />
            </Grid2>
            <Field name="responsable_direccion" label="Dirección" />
          </Block>

          <Block title="Cobertura y derivación" color="naranja">
            <Grid2>
              <Field name="obra_social" label="Obra social / prepaga" />
              <Field name="derivante" label="Profesional derivante" />
              <Select name="programa" label="Programa de interés" options={programas} required />
            </Grid2>
          </Block>

          <Block title="Perfil de Desarrollo y Salud" color="celeste">
            <Field name="diagnostico" label="Diagnóstico clínico (si lo tiene)" />

            <div>
              <label className="block text-sm font-medium text-[var(--color-petroleo)] mb-1">
                ¿Se encuentra bajo algún tratamiento terapéutico actualmente?
              </label>
              <div className="flex gap-4">
                {tratamientoActual.map((opt) => (
                  <label key={opt} className="inline-flex items-center gap-2 text-sm text-[var(--color-petroleo)] cursor-pointer">
                    <input type="radio" name="tratamiento_actual" value={opt} className="accent-[var(--color-celeste)]" />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-petroleo)] mb-1">
                Si la respuesta es sí, indicá cuál
              </label>
              <input
                name="tratamiento_detalle"
                className="w-full rounded-xl border border-[var(--color-petroleo-100)] bg-white px-3 py-2.5 transition-all focus:border-[var(--color-celeste)] focus:ring-2 focus:ring-[var(--color-celeste)]/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-petroleo)] mb-1">
                Breve descripción de los aspectos conductuales del consultante
              </label>
              <textarea
                name="aspectos_conductuales"
                rows={4}
                className="w-full rounded-xl border border-[var(--color-petroleo-100)] bg-white px-3 py-2.5 transition-all focus:border-[var(--color-celeste)] focus:ring-2 focus:ring-[var(--color-celeste)]/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-petroleo)] mb-1">
                Información adicional que considere pertinente mencionar
              </label>
              <textarea
                name="info_adicional"
                rows={3}
                className="w-full rounded-xl border border-[var(--color-petroleo-100)] bg-white px-3 py-2.5 transition-all focus:border-[var(--color-celeste)] focus:ring-2 focus:ring-[var(--color-celeste)]/20 focus:outline-none"
              />
            </div>
          </Block>

          <p className="text-xs text-[var(--color-petroleo)]/60">
            Los datos serán utilizados exclusivamente para evaluar la admisión y no se compartirán con terceros.
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              disabled={state === "loading"}
              className="bg-[var(--color-coral)] hover:bg-[var(--color-coral-600)] disabled:opacity-60 text-white font-semibold px-7 py-3 rounded-full hover:-translate-y-0.5 hover:shadow-xl"
            >
              {state === "loading" ? "Enviando…" : "Enviar solicitud de admisión"}
            </button>
            {state === "ok" && (
              <span className="text-sm text-[var(--color-verde-600)] font-medium">
                ¡Gracias! Recibimos tu solicitud. Nos comunicaremos a la brevedad.
              </span>
            )}
            {state === "error" && (
              <span className="text-sm text-[var(--color-coral)] font-medium">
                Hubo un error. Probá nuevamente.
              </span>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

const ringColor: Record<string, string> = {
  celeste: "bg-[var(--color-celeste)]",
  coral: "bg-[var(--color-coral)]",
  naranja: "bg-[var(--color-naranja)]"
};

function Block({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <fieldset className="grid gap-4">
      <legend className="flex items-center gap-2 text-[var(--color-petroleo)] font-semibold text-lg">
        <span className={`inline-block h-2.5 w-2.5 rounded-full ${ringColor[color]}`} />
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-4">{children}</div>;
}

function Field({ name, label, type = "text", required }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-[var(--color-petroleo)] mb-1">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-[var(--color-petroleo-100)] bg-white px-3 py-2.5 transition-all focus:border-[var(--color-celeste)] focus:ring-2 focus:ring-[var(--color-celeste)]/20 focus:outline-none"
      />
    </div>
  );
}

function Select({ name, label, options, required }: { name: string; label: string; options: string[]; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-[var(--color-petroleo)] mb-1">{label}</label>
      <select
        id={name}
        name={name}
        required={required}
        className="w-full rounded-xl border border-[var(--color-petroleo-100)] bg-white px-3 py-2.5 transition-all focus:border-[var(--color-celeste)] focus:ring-2 focus:ring-[var(--color-celeste)]/20 focus:outline-none"
      >
        <option value="">Seleccioná una opción</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
