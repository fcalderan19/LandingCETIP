"use client";
import { useState } from "react";
import { IconChevronDown, IconClose, IconMenu } from "./Icons";

const nav = [
  { href: "#inicio", label: "Inicio" },
  { href: "#quienes-somos", label: "Quiénes Somos" },
  { href: "#equipo", label: "Nuestro Equipo" },
  { href: "#espacio", label: "Nuestro Espacio" },
  {
    href: "#servicios",
    label: "Servicios",
    children: [
      { href: "#cet", label: "CET" },
      { href: "#consultorios", label: "Consultorios Externos" },
      { href: "#talleres", label: "Talleres" }
    ]
  },
  { href: "#rrhh", label: "RRHH" },
  { href: "#contacto", label: "Contacto" }
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[var(--color-petroleo-100)]">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <a href="#inicio" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-[var(--color-petroleo)] text-white grid place-items-center font-bold">
            C
          </div>
          <div className="leading-tight">
            <div className="font-bold text-[var(--color-petroleo)]">CETIP</div>
            <div className="text-[11px] text-[var(--color-petroleo)]/70">Centro Educativo Terapéutico</div>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((item) =>
            item.children ? (
              <div key={item.href} className="relative" onMouseEnter={() => setDrop(true)} onMouseLeave={() => setDrop(false)}>
                <button className="px-3 py-2 text-sm font-medium text-[var(--color-petroleo)] hover:text-[var(--color-celeste)] inline-flex items-center gap-1">
                  {item.label} <IconChevronDown width={14} height={14} />
                </button>
                {drop && (
                  <div className="absolute left-0 top-full mt-1 w-56 bg-white rounded-xl shadow-lg border border-[var(--color-petroleo-100)] py-2">
                    {item.children.map((c) => (
                      <a key={c.href} href={c.href} className="block px-4 py-2 text-sm hover:bg-[var(--color-petroleo-50)]">
                        {c.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <a key={item.href} href={item.href} className="px-3 py-2 text-sm font-medium text-[var(--color-petroleo)] hover:text-[var(--color-celeste)]">
                {item.label}
              </a>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#contacto"
            className="hidden sm:inline-flex bg-[var(--color-coral)] hover:bg-[var(--color-coral-600)] text-white font-semibold px-4 py-2 rounded-full text-sm"
          >
            Contactanos
          </a>
          <button
            className="lg:hidden p-2 text-[var(--color-petroleo)]"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menú"
            aria-expanded={open}
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-[var(--color-petroleo-100)] bg-white">
          <nav className="mx-auto max-w-7xl px-4 py-3 flex flex-col">
            {nav.map((item) => (
              <div key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 font-medium text-[var(--color-petroleo)]"
                >
                  {item.label}
                </a>
                {item.children && (
                  <div className="pl-4 pb-2">
                    {item.children.map((c) => (
                      <a key={c.href} href={c.href} onClick={() => setOpen(false)} className="block py-1 text-sm text-[var(--color-petroleo)]/80">
                        {c.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
