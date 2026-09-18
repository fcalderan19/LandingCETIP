"use client";

import { useState, useTransition, type ReactElement } from "react";
import { updateSiteSettings } from "@/app/admin/_actions/settings";
import type {
  HeaderConfigShape,
  FooterConfigShape,
} from "@/lib/site-settings";
import {
  IconInfo,
  IconMail,
  IconUsers,
  IconPanelLeft,
  IconBlocks,
} from "./AdminIcons";

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
  headerConfig: HeaderConfigShape;
  footerConfig: FooterConfigShape;
};

type TabId = "general" | "contacto" | "redes" | "header" | "footer";

const TABS: { id: TabId; label: string; hint: string; Icon: (p: { size?: number }) => ReactElement }[] = [
  { id: "general", label: "General", hint: "Nombre, tagline y descripción.", Icon: IconInfo },
  { id: "contacto", label: "Contacto", hint: "Teléfono, email, dirección y horarios.", Icon: IconMail },
  { id: "redes", label: "Redes sociales", hint: "Instagram, Facebook y otros perfiles.", Icon: IconUsers },
  { id: "header", label: "Encabezado", hint: "Qué se muestra en la barra superior y el botón principal.", Icon: IconPanelLeft },
  { id: "footer", label: "Pie de página", hint: "Bloques del footer y textos legales.", Icon: IconBlocks },
];

const inputCls =
  "w-full rounded-lg border border-[var(--color-petroleo-100)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-celeste)]/40 focus:border-[var(--color-celeste)]";

export default function SettingsForm({ initial }: { initial: Settings }) {
  const [data, setData] = useState<Settings>(initial);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]> | undefined>();
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState<TabId>("general");

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) =>
    setData((prev) => ({ ...prev, [k]: v }));
  const setHeader = <K extends keyof HeaderConfigShape>(k: K, v: HeaderConfigShape[K]) =>
    setData((prev) => ({ ...prev, headerConfig: { ...prev.headerConfig, [k]: v } }));
  const setFooter = <K extends keyof FooterConfigShape>(k: K, v: FooterConfigShape[K]) =>
    setData((prev) => ({ ...prev, footerConfig: { ...prev.footerConfig, [k]: v } }));

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

  const active = TABS.find((t) => t.id === tab)!;

  return (
    <section className="max-w-5xl">
      <header className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Configuración del sitio</h1>
          <p className="text-sm text-[var(--color-petroleo)]/70 mt-1">
            Datos institucionales y qué mostrar en el encabezado y pie de página.
          </p>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="bg-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-700)] disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-full text-sm shrink-0"
        >
          {pending ? "Guardando…" : "Guardar cambios"}
        </button>
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

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
        {/* Tabs sidebar */}
        <nav aria-label="Secciones de configuración" className="md:sticky md:top-4 self-start">
          <ul className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            {TABS.map((t) => {
              const isActive = t.id === tab;
              return (
                <li key={t.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setTab(t.id)}
                    aria-current={isActive ? "page" : undefined}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-left transition ${
                      isActive
                        ? "bg-[var(--color-petroleo)] text-white"
                        : "text-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-100)]/40"
                    }`}
                  >
                    <t.Icon size={16} />
                    <span>{t.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Panel */}
        <div className="min-w-0">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[var(--color-petroleo)]">{active.label}</h2>
            <p className="text-xs text-[var(--color-petroleo)]/70">{active.hint}</p>
          </div>

          <div className="rounded-xl border border-[var(--color-petroleo-100)] bg-white p-5">
            {tab === "general" && (
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Nombre corto" v={data.name} on={(v) => set("name", v)} err={errors?.name} />
                <Field label="Nombre completo" v={data.fullName} on={(v) => set("fullName", v)} err={errors?.fullName} />
                <Field label="Tagline" v={data.tagline} on={(v) => set("tagline", v)} err={errors?.tagline} colSpan />
                <Field label="Descripción" v={data.description} on={(v) => set("description", v)} err={errors?.description} colSpan textarea />
              </div>
            )}

            {tab === "contacto" && (
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Email" v={data.email} on={(v) => set("email", v)} err={errors?.email} />
                <Field label="Dirección" v={data.address} on={(v) => set("address", v)} err={errors?.address} />
                <Field label="Teléfono (mostrar)" v={data.phoneDisplay} on={(v) => set("phoneDisplay", v)} err={errors?.phoneDisplay} />
                <Field label="Teléfono (tel:)" v={data.phoneTel} on={(v) => set("phoneTel", v)} err={errors?.phoneTel} />
                <Field label="WhatsApp número" v={data.whatsappNumber} on={(v) => set("whatsappNumber", v)} err={errors?.whatsappNumber} />
                <Field label="WhatsApp mensaje default" v={data.whatsappMessage} on={(v) => set("whatsappMessage", v)} err={errors?.whatsappMessage} />
                <Field label="Horarios" v={data.hours} on={(v) => set("hours", v)} err={errors?.hours} colSpan />
                <Field label="Google Maps embed URL" v={data.mapsEmbed} on={(v) => set("mapsEmbed", v)} err={errors?.mapsEmbed} colSpan textarea />
              </div>
            )}

            {tab === "redes" && (
              <div className="grid md:grid-cols-2 gap-4">
                <Field
                  label="Instagram URL"
                  v={data.socials.instagram ?? ""}
                  on={(v) => set("socials", { ...data.socials, instagram: v })}
                />
                <Field
                  label="Facebook URL"
                  v={data.socials.facebook ?? ""}
                  on={(v) => set("socials", { ...data.socials, facebook: v })}
                />
                <p className="md:col-span-2 text-xs text-[var(--color-petroleo)]/60">
                  Se muestran en el TopBar y el footer siempre que estén habilitados en las respectivas pestañas.
                </p>
              </div>
            )}

            {tab === "header" && (
              <div className="space-y-6">
                <FieldGroup title="Barra superior (TopBar)" hint="Qué datos se muestran arriba del encabezado.">
                  <Toggle label="Mostrar barra superior" v={data.headerConfig.showTopBar} on={(v) => setHeader("showTopBar", v)} />
                  <Toggle label="Dirección" v={data.headerConfig.showAddress} on={(v) => setHeader("showAddress", v)} />
                  <Toggle label="Teléfono" v={data.headerConfig.showPhone} on={(v) => setHeader("showPhone", v)} />
                  <Toggle label="Horarios" v={data.headerConfig.showHours} on={(v) => setHeader("showHours", v)} />
                  <Toggle label="Email" v={data.headerConfig.showEmail} on={(v) => setHeader("showEmail", v)} />
                  <Toggle label="WhatsApp" v={data.headerConfig.showWhatsapp} on={(v) => setHeader("showWhatsapp", v)} />
                  <Toggle label="Redes sociales" v={data.headerConfig.showSocials} on={(v) => setHeader("showSocials", v)} />
                </FieldGroup>

                <FieldGroup title="Botón principal (CTA)" hint="Aparece a la derecha del menú principal.">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Field
                      label="Texto del botón"
                      v={data.headerConfig.ctaLabel}
                      on={(v) => setHeader("ctaLabel", v)}
                    />
                    <Field
                      label="Enlace del botón"
                      v={data.headerConfig.ctaHref}
                      on={(v) => setHeader("ctaHref", v)}
                    />
                  </div>
                </FieldGroup>
              </div>
            )}

            {tab === "footer" && (
              <div className="space-y-6">
                <FieldGroup title="Bloques visibles" hint="Qué columnas mostrar en el pie de página.">
                  <Toggle label="Descripción de la institución" v={data.footerConfig.showDescription} on={(v) => setFooter("showDescription", v)} />
                  <Toggle label="Información de contacto" v={data.footerConfig.showContactInfo} on={(v) => setFooter("showContactInfo", v)} />
                  <Toggle label="Redes sociales" v={data.footerConfig.showSocials} on={(v) => setFooter("showSocials", v)} />
                </FieldGroup>

                <FieldGroup title="Textos legales">
                  <Field
                    label="Copyright"
                    v={data.footerConfig.copyright}
                    on={(v) => setFooter("copyright", v)}
                    colSpan
                  />
                  <Field
                    label="Nota adicional"
                    v={data.footerConfig.extraNote}
                    on={(v) => setFooter("extraNote", v)}
                    colSpan
                    textarea
                  />
                </FieldGroup>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function FieldGroup({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-3">
        <h3 className="text-sm font-bold text-[var(--color-petroleo)]">{title}</h3>
        {hint && <p className="text-xs text-[var(--color-petroleo)]/60">{hint}</p>}
      </div>
      <div className="grid md:grid-cols-2 gap-3">{children}</div>
    </div>
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
      <span className="block text-xs font-semibold mb-1 text-[var(--color-petroleo)]">{label}</span>
      {textarea ? (
        <textarea rows={2} value={v} onChange={(e) => on(e.target.value)} className={inputCls} />
      ) : (
        <input type="text" value={v} onChange={(e) => on(e.target.value)} className={inputCls} />
      )}
      {err && <span className="text-[10px] text-[var(--color-coral)]">{err.join(", ")}</span>}
    </label>
  );
}

function Toggle({
  label,
  v,
  on,
}: {
  label: string;
  v: boolean;
  on: (next: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-lg border border-[var(--color-petroleo-100)] bg-white px-3 py-2 cursor-pointer hover:border-[var(--color-celeste)] transition">
      <span className="text-sm text-[var(--color-petroleo)]">{label}</span>
      <span
        role="switch"
        aria-checked={v}
        onClick={() => on(!v)}
        className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition ${
          v ? "bg-[var(--color-celeste)]" : "bg-[var(--color-petroleo-100)]"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${
            v ? "left-4" : "left-0.5"
          }`}
        />
        <input
          type="checkbox"
          className="sr-only"
          checked={v}
          onChange={(e) => on(e.target.checked)}
        />
      </span>
    </label>
  );
}
