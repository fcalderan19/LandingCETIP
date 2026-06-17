import { getSiteSettings, waLinkFor } from "@/lib/site-settings";
import { IconWhatsapp } from "./Icons";

export default async function FloatingWhatsapp() {
  const s = await getSiteSettings();
  return (
    <a
      href={waLinkFor(s.whatsappNumber, s.whatsappMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Abrir chat de WhatsApp"
      className="pulse-wa fixed bottom-5 right-5 z-50 bg-[var(--color-verde)] hover:bg-[var(--color-verde-600)] text-white rounded-full w-14 h-14 grid place-items-center shadow-xl"
    >
      <IconWhatsapp width={28} height={28} />
    </a>
  );
}
