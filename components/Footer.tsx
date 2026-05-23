import Link from "next/link";
import { site } from "@/lib/site";
import { IconFacebook, IconInstagram } from "./Icons";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-petroleo)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-xl p-2 inline-flex">
              <img src="/img/cetip-logo.png" alt="CETIP" className="h-10 w-auto" />
            </div>
            <div className="text-xs text-white/70 max-w-[160px] leading-tight">
              Centro Educativo Terapéutico y de Investigación Psiconeurológica
            </div>
          </div>
          <p className="mt-4 text-sm text-white/70">{site.tagline}</p>
          <div className="mt-4 flex gap-3">
            <a href={site.socials.instagram} aria-label="Instagram" className="hover:text-[var(--color-celeste)] hover:translate-x-1 inline-block"><IconInstagram /></a>
            <a href={site.socials.facebook} aria-label="Facebook" className="hover:text-[var(--color-celeste)] hover:translate-x-1 inline-block"><IconFacebook /></a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Institución</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link href="/quienes-somos" className="hover:text-[var(--color-celeste)] hover:translate-x-1 inline-block">Quiénes Somos</Link></li>
            <li><Link href="/nuestro-espacio" className="hover:text-[var(--color-celeste)] hover:translate-x-1 inline-block">Nuestro Espacio</Link></li>
            <li><Link href="/admision" className="hover:text-[var(--color-celeste)] hover:translate-x-1 inline-block">Formulario de Admisión</Link></li>
            <li><Link href="/rrhh" className="hover:text-[var(--color-celeste)] hover:translate-x-1 inline-block">RR.HH.</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Programas</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link href="/programas-terapeuticos/cet" className="hover:text-[var(--color-celeste)] hover:translate-x-1 inline-block">CET</Link></li>
            <li><Link href="/programas-terapeuticos/consultorios" className="hover:text-[var(--color-celeste)] hover:translate-x-1 inline-block">Consultorios Externos</Link></li>
            <li><Link href="/programas-terapeuticos/talleres" className="hover:text-[var(--color-celeste)] hover:translate-x-1 inline-block">Talleres</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Contacto</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li>{site.address}</li>
            <li><a href={`tel:${site.phoneTel}`} className="hover:text-[var(--color-celeste)] hover:translate-x-1 inline-block">{site.phoneDisplay}</a></li>
            <li><a href={`mailto:${site.email}`} className="hover:text-[var(--color-celeste)] hover:translate-x-1 inline-block">{site.email}</a></li>
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
