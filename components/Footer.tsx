import { site } from "@/lib/site";
import { IconFacebook, IconInstagram } from "./Icons";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-petroleo)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-white text-[var(--color-petroleo)] grid place-items-center font-bold">C</div>
            <div>
              <div className="font-bold">CETIP</div>
              <div className="text-xs text-white/70">Centro Educativo Terapéutico</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/70">{site.tagline}</p>
          <div className="mt-4 flex gap-3">
            <a href={site.socials.instagram} aria-label="Instagram" className="hover:text-[var(--color-celeste)]"><IconInstagram /></a>
            <a href={site.socials.facebook} aria-label="Facebook" className="hover:text-[var(--color-celeste)]"><IconFacebook /></a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Institución</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><a href="#quienes-somos" className="hover:text-[var(--color-celeste)]">Quiénes Somos</a></li>
            <li><a href="#equipo" className="hover:text-[var(--color-celeste)]">Nuestro Equipo</a></li>
            <li><a href="#espacio" className="hover:text-[var(--color-celeste)]">Nuestro Espacio</a></li>
            <li><a href="#rrhh" className="hover:text-[var(--color-celeste)]">RRHH</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Servicios</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><a href="#cet" className="hover:text-[var(--color-celeste)]">CET</a></li>
            <li><a href="#consultorios" className="hover:text-[var(--color-celeste)]">Consultorios Externos</a></li>
            <li><a href="#talleres" className="hover:text-[var(--color-celeste)]">Talleres</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Contacto</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li>{site.address}</li>
            <li><a href={`tel:${site.phoneTel}`} className="hover:text-[var(--color-celeste)]">{site.phoneDisplay}</a></li>
            <li><a href={`mailto:${site.email}`} className="hover:text-[var(--color-celeste)]">{site.email}</a></li>
            <li>{site.hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/60">
          <p>© {new Date().getFullYear()} CETIP. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Política de privacidad</a>
            <a href="#" className="hover:text-white">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
