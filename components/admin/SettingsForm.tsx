"use client";

import { useState, useTransition } from "react";
import { updateSiteSettings } from "@/app/admin/_actions/settings";

type Settings = {
  name: string;
  fullName: string;
  tagline: string;
  description: string;
  address: string;
  phoneDisplay: string;
  phoneTel: string;
  whatsappNumber: string;
  whatsappMessage: string;
  email: string;
  hours: string;
  socials: Record<string, string>;
  mapsEmbed: string;
};

const inputCls =
  "w-full rounded-lg border border-[var(--color-petroleo-100)] bg-white px-3 py-2 text-sm";

export default function SettingsForm({ initial }: { initial: Settings }) {
  const [data, setData] = useState<Settings>(initial);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]> | undefined>();
  const [pending, startTransition] = useTransition();

  const set = (k: keyof Settings, v: unknown) =>
    setData((prev) => ({ ...prev, [k]: v as never }));

  function save() {
    startTransition(async () => {
      const res = await updateSiteSettings(data);
      if (!res.ok) {
        setFeedback(`Error: ${res.message ?? res.error}`);
        setErrors(res.fieldErrors);
      } else {
        setFeedback("Guardado");
        setErrors(undefined);
      }
    });
  }

  return (
    <section>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Configuración del sitio</h1>
        <p className="text-sm text-[var(--color-petroleo)]/70">
          Datos institucionales que aparecen en TopBar, Footer y secciones que
          los referencian.
        </p>
      </header>

      {feedback && (
        <div
          className={`mb-4 rounded-lg px-3 py-2 text-sm ${
            feedback.startsWith("Error")
              ? "bg-[var(--color-coral)]/10 text-[var(--color-coral-600)]"
              : "bg-[var(--color-verde)]/10 text-[var(--color-verde-600)]"
          }`}
        >
          {feedback}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Nombre corto" v={data.name} on={(v) => set("name", v)} err={errors?.name} />
        <Field label="Nombre completo" v={data.fullName} on={(v) => set("fullName", v)} err={errors?.fullName} />
        <Field label="Tagline" v={data.tagline} on={(v) => set("tagline", v)} err={errors?.tagline} />
        <Field label="Email" v={data.email} on={(v) => set("email", v)} err={errors?.email} />
        <Field label="Dirección" v={data.address} on={(v) => set("address", v)} err={errors?.address} colSpan />
        <Field label="Descripción" v={data.description} on={(v) => set("description", v)} err={errors?.description} colSpan textarea />
        <Field label="Teléfono (mostrar)" v={data.phoneDisplay} on={(v) => set("phoneDisplay", v)} err={errors?.phoneDisplay} />
        <Field label="Teléfono (tel:)" v={data.phoneTel} on={(v) => set("phoneTel", v)} err={errors?.phoneTel} />
        <Field label="WhatsApp número" v={data.whatsappNumber} on={(v) => set("whatsappNumber", v)} err={errors?.whatsappNumber} />
        <Field label="WhatsApp mensaje default" v={data.whatsappMessage} on={(v) => set("whatsappMessage", v)} err={errors?.whatsappMessage} />
        <Field label="Horarios" v={data.hours} on={(v) => set("hours", v)} err={errors?.hours} colSpan />
        <Field label="Instagram URL" v={data.socials.instagram ?? ""} on={(v) => set("socials", { ...data.socials, instagram: v })} />
        <Field label="Facebook URL" v={data.socials.facebook ?? ""} on={(v) => set("socials", { ...data.socials, facebook: v })} />
        <Field label="Google Maps embed URL" v={data.mapsEmbed} on={(v) => set("mapsEmbed", v)} err={errors?.mapsEmbed} colSpan textarea />
      </div>

      <button
        type="button"
        onClick={save}
        disabled={pending}
        className="mt-6 bg-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-700)] disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-full"
      >
        {pending ? "Guardando…" : "Guardar"}
      </button>
    </section>
  );
}

function Field({
  label,
  v,
  on,
  err,
  colSpan,
  textarea,
}: {
  label: string;
  v: string;
  on: (next: string) => void;
  err?: string[];
  colSpan?: boolean;
  textarea?: boolean;
}) {
  return (
    <label className={`block ${colSpan ? "md:col-span-2" : ""}`}>
      <span className="block text-xs font-semibold mb-1">{label}</span>
      {textarea ? (
        <textarea rows={2} value={v} onChange={(e) => on(e.target.value)} className={inputCls} />
      ) : (
        <input type="text" value={v} onChange={(e) => on(e.target.value)} className={inputCls} />
      )}
      {err && <span className="text-[10px] text-[var(--color-coral)]">{err.join(", ")}</span>}
    </label>
  );
}
