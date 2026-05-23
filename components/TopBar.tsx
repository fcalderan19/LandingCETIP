import { site, waLink } from "@/lib/site";
import {
  IconClock,
  IconFacebook,
  IconInstagram,
  IconMail,
  IconMapPin,
  IconPhone,
  IconWhatsapp
} from "./Icons";

export default function TopBar() {
  return (
    <div className="bg-[var(--color-petroleo)] text-white text-sm">
      <div className="mx-auto max-w-7xl px-4 py-2 flex flex-wrap items-center justify-between gap-y-2 gap-x-6">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <span className="inline-flex items-center gap-2">
            <IconMapPin className="text-[var(--color-celeste)]" /> {site.address}
          </span>
          <a href={`tel:${site.phoneTel}`} className="inline-flex items-center gap-2 hover:text-[var(--color-celeste)]">
            <IconPhone className="text-[var(--color-celeste)]" /> {site.phoneDisplay}
          </a>
          <span className="hidden md:inline-flex items-center gap-2">
            <IconClock className="text-[var(--color-celeste)]" /> {site.hours}
          </span>
          <a href={`mailto:${site.email}`} className="hidden md:inline-flex items-center gap-2 hover:text-[var(--color-celeste)]">
            <IconMail className="text-[var(--color-celeste)]" /> {site.email}
          </a>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[var(--color-verde)] hover:bg-[var(--color-verde-600)] text-white px-3 py-1.5 rounded-full text-xs font-semibold"
          >
            <IconWhatsapp /> WhatsApp
          </a>
          <a href={site.socials.instagram} aria-label="Instagram" className="hover:text-[var(--color-celeste)]">
            <IconInstagram />
          </a>
          <a href={site.socials.facebook} aria-label="Facebook" className="hover:text-[var(--color-celeste)]">
            <IconFacebook />
          </a>
        </div>
      </div>
    </div>
  );
}
