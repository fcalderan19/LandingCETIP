import { getSiteSettings } from "@/lib/site-settings";
import { IconFacebook, IconInstagram } from "./Icons";

export default async function Footer() {
  const s = await getSiteSettings();
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
          <p className="mt-4 text-sm text-white/70">{s.tagline}</p>
          <div className="mt-4 flex gap-3">
            <a href={s.socials.instagram} aria-label="Instagram" className="hover:text-[var(--color-celeste)] hover:translate-x-1 inline-block">
              <IconInstagram />
            </a>
            <a href={s.socials.facebook} aria-label="Facebook" className="hover:text-[var(--color-celeste)] hover:translate-x-1 inline-block">
              <IconFacebook />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Institución</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><a href="/quienes-somos" className="hover:text-[var(--color-celeste)] hover:translate-x-1 inline-block">Quiénes Somos</a></li>
            <li><a href="/nuestro-espacio" className="hover:text-[var(--color-celeste)] hover:translate-x-1 inline-block">Nuestro Espacio</a></li>
            <li><a href="/admision" className="hover:text-[var(--color-celeste)] hover:translate-x-1 inline-block">Formulario de Admisión</a></li>
            <li><a href="/rrhh" className="hover:text-[var(--color-celeste)] hover:translate-x-1 inline-block">RR.HH.</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Programas</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><a href="/programas-terapeuticos/cet" className="hover:text-[var(--color-celeste)] hover:translate-x-1 inline-block">Centro Educativo Terapéutico</a></li>
            <li><a href="/programas-terapeuticos/consultorios" className="hover:text-[var(--color-celeste)] hover:translate-x-1 inline-block">Tratamiento en Consultorios Externos</a></li>
            <li><a href="/programas-terapeuticos/talleres" className="hover:text-[var(--color-celeste)] hover:translate-x-1 inline-block">Talleres</a></li>
            <li><a href="/programas-terapeuticos/evaluaciones-diagnosticas" className="hover:text-[var(--color-celeste)] hover:translate-x-1 inline-block">Evaluaciones Diagnósticas</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Contacto</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li>{s.address}</li>
            <li><a href={`tel:${s.phoneTel}`} className="hover:text-[var(--color-celeste)] hover:translate-x-1 inline-block">{s.phoneDisplay}</a></li>
            <li><a href={`mailto:${s.email}`} className="hover:text-[var(--color-celeste)] hover:translate-x-1 inline-block">{s.email}</a></li>
            <li>{s.hours}</li>
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
