import { waLink } from "@/lib/site";
import { IconWhatsapp } from "./Icons";

export default function FloatingWhatsapp() {
  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Abrir chat de WhatsApp"
      className="pulse-wa fixed bottom-5 right-5 z-50 bg-[var(--color-verde)] hover:bg-[var(--color-verde-600)] text-white rounded-full w-14 h-14 grid place-items-center shadow-xl"
    >
      <IconWhatsapp width={28} height={28} />
    </a>
  );
}
