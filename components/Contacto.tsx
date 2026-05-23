import { site, waLink } from "@/lib/site";
import { IconClock, IconMail, IconMapPin, IconPhone, IconWhatsapp } from "./Icons";

export default function Contacto() {
  return (
    <section id="contacto" className="py-16 md:py-24 bg-[var(--color-petroleo-50)]">
      <div className="mx-auto max-w-7xl px-4 grid lg:grid-cols-2 gap-10 items-stretch">
        <div className="reveal">
          <span className="text-xs font-semibold uppercase text-[var(--color-celeste-600)]">Contacto</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-[var(--color-petroleo)]">Cómo encontrarnos</h2>
          <ul className="mt-6 space-y-4 text-[var(--color-petroleo)]">
            <li className="flex items-start gap-3"><IconMapPin className="text-[var(--color-celeste)] mt-0.5" /> {site.address}</li>
            <li className="flex items-start gap-3"><IconPhone className="text-[var(--color-celeste)] mt-0.5" /> <a href={`tel:${site.phoneTel}`} className="hover:underline">{site.phoneDisplay}</a></li>
            <li className="flex items-start gap-3"><IconMail className="text-[var(--color-celeste)] mt-0.5" /> <a href={`mailto:${site.email}`} className="hover:underline">{site.email}</a></li>
            <li className="flex items-start gap-3"><IconClock className="text-[var(--color-celeste)] mt-0.5" /> {site.hours}</li>
          </ul>
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 bg-[var(--color-verde)] hover:bg-[var(--color-verde-600)] text-white font-semibold px-6 py-3 rounded-full hover:-translate-y-0.5 hover:shadow-xl"
          >
            <IconWhatsapp /> Escribinos por WhatsApp
          </a>
        </div>
        <div className="reveal rounded-3xl overflow-hidden shadow-md border border-[var(--color-petroleo-100)] min-h-[360px]">
          <iframe
            title="Mapa CETIP"
            src={site.mapsEmbed}
            className="w-full h-full min-h-[360px] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
