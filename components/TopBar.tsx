import { getSiteSettings, waLinkFor } from "@/lib/site-settings";
import {
  IconClock,
  IconFacebook,
  IconInstagram,
  IconMail,
  IconMapPin,
  IconPhone,
  IconWhatsapp,
} from "./Icons";

export default async function TopBar() {
  const s = await getSiteSettings();
  return (
    <div className="bg-[var(--color-petroleo)] text-white text-sm">
      <div className="mx-auto max-w-7xl px-4 py-2 flex flex-wrap items-center justify-between gap-y-2 gap-x-6">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <span className="inline-flex items-center gap-2">
            <IconMapPin className="text-[var(--color-celeste)]" /> {s.address}
          </span>
          <a
            href={`tel:${s.phoneTel}`}
            className="inline-flex items-center gap-2 hover:text-[var(--color-celeste)]"
          >
            <IconPhone className="text-[var(--color-celeste)]" /> {s.phoneDisplay}
          </a>
          <span className="hidden md:inline-flex items-center gap-2">
            <IconClock className="text-[var(--color-celeste)]" /> {s.hours}
          </span>
          <a
            href={`mailto:${s.email}`}
            className="hidden md:inline-flex items-center gap-2 hover:text-[var(--color-celeste)]"
          >
            <IconMail className="text-[var(--color-celeste)]" /> {s.email}
          </a>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={waLinkFor(s.whatsappNumber, s.whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[var(--color-verde)] hover:bg-[var(--color-verde-600)] text-white px-3 py-1.5 rounded-full text-xs font-semibold hover:-translate-y-0.5 hover:shadow-md"
          >
            <IconWhatsapp /> WhatsApp
          </a>
          <a
            href={s.socials.instagram}
            aria-label="Instagram"
            className="hover:text-[var(--color-celeste)] hover:scale-110"
          >
            <IconInstagram />
          </a>
          <a
            href={s.socials.facebook}
            aria-label="Facebook"
            className="hover:text-[var(--color-celeste)] hover:scale-110"
          >
            <IconFacebook />
          </a>
        </div>
      </div>
    </div>
  );
}
