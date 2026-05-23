"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav } from "@/lib/nav";
import { IconChevronDown, IconClose, IconMenu } from "./Icons";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(false);
  const [mobileSubOpen, setMobileSubOpen] = useState<string | null>(null);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[var(--color-petroleo-100)]">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-[var(--color-petroleo)] text-white grid place-items-center font-bold">C</div>
          <div className="leading-tight">
            <div className="font-bold text-[var(--color-petroleo)]">CETIP</div>
            <div className="text-[11px] text-[var(--color-petroleo)]/70">Centro Educativo Terapéutico</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((item) =>
            item.children ? (
              <div key={item.href} className="relative" onMouseEnter={() => setDrop(true)} onMouseLeave={() => setDrop(false)}>
                <Link
                  href={item.href}
                  data-active={isActive(item.href) || undefined}
                  className={`nav-link px-3 py-2 text-sm font-medium inline-flex items-center gap-1 ${
                    isActive(item.href) ? "text-[var(--color-celeste-600)]" : "text-[var(--color-petroleo)] hover:text-[var(--color-celeste)]"
                  }`}
                >
                  {item.label}{" "}
                  <IconChevronDown width={14} height={14} className={`transition-transform duration-300 ${drop ? "rotate-180" : ""}`} />
                </Link>
                {drop && (
                  <div className="absolute left-0 top-full pt-2 w-64 anim-pop">
                    <div className="bg-white rounded-xl shadow-xl border border-[var(--color-petroleo-100)] py-2 overflow-hidden">
                      {item.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          className="group flex items-center justify-between px-4 py-2.5 text-sm text-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-50)] hover:text-[var(--color-celeste-600)] transition-colors"
                        >
                          <span>{c.label}</span>
                          <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[var(--color-celeste)]">→</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                data-active={isActive(item.href) || undefined}
                className={`nav-link px-3 py-2 text-sm font-medium ${
                  isActive(item.href) ? "text-[var(--color-celeste-600)]" : "text-[var(--color-petroleo)] hover:text-[var(--color-celeste)]"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contacto"
            className="hidden sm:inline-flex bg-[var(--color-coral)] hover:bg-[var(--color-coral-600)] text-white font-semibold px-4 py-2 rounded-full text-sm hover:-translate-y-0.5 hover:shadow-lg"
          >
            Contactanos
          </Link>
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
        <div className="lg:hidden border-t border-[var(--color-petroleo-100)] bg-white anim-pop">
          <nav className="mx-auto max-w-7xl px-4 py-3 flex flex-col">
            {nav.map((item) => (
              <div key={item.href}>
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-2 font-medium text-[var(--color-petroleo)]"
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <button
                      aria-label="Abrir submenú"
                      onClick={() => setMobileSubOpen((v) => (v === item.href ? null : item.href))}
                      className="p-2"
                    >
                      <IconChevronDown className={`transition-transform duration-300 ${mobileSubOpen === item.href ? "rotate-180" : ""}`} />
                    </button>
                  )}
                </div>
                {item.children && mobileSubOpen === item.href && (
                  <div className="pl-4 pb-2 anim-pop">
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        onClick={() => setOpen(false)}
                        className="block py-1.5 text-sm text-[var(--color-petroleo)]/80 hover:text-[var(--color-celeste-600)] hover:translate-x-1"
                      >
                        {c.label}
                      </Link>
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
