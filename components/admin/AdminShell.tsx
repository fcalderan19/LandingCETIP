import Link from "next/link";
import { signOut } from "@/auth";
import type { ReactNode } from "react";

const NAV = [
  { href: "/admin", label: "Editor de inicio" },
  { href: "/admin/pages", label: "Páginas" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/professionals", label: "Equipo" },
  { href: "/admin/workshops", label: "Talleres" },
  { href: "/admin/job-openings", label: "Búsquedas" },
  { href: "/admin/settings", label: "Configuración" },
];

export default function AdminShell({
  user,
  children,
}: {
  user: { email: string };
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-petroleo-50)] text-[var(--color-petroleo)] flex flex-col">
      <header className="bg-[var(--color-petroleo)] text-white">
        <div className="px-4 py-2 flex items-center justify-between gap-4">
          <Link href="/admin" className="font-bold tracking-tight shrink-0">
            CETIP <span className="text-white/60 font-normal">· Admin</span>
          </Link>
          <nav aria-label="Admin" className="flex-1 min-w-0">
            <ul className="flex items-center gap-1 overflow-x-auto">
              {NAV.map((item) => (
                <li key={item.href} className="shrink-0">
                  <Link
                    href={item.href}
                    className="block px-3 py-1.5 rounded-full text-sm text-white/80 hover:bg-white/10 hover:text-white whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-3 text-sm shrink-0">
            <span className="text-white/70 hidden md:inline">{user.email}</span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <button
                type="submit"
                className="text-white/80 hover:text-white underline-offset-2 hover:underline"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-white admin-main">{children}</main>
    </div>
  );
}

export function PageDesktopOnlyHint() {
  return (
    <div className="lg:hidden mx-4 mt-4 rounded-xl bg-[var(--color-naranja)]/15 text-[var(--color-naranja-600)] px-4 py-3 text-sm">
      El admin está optimizado para pantallas grandes. Usá un escritorio para una
      mejor experiencia.
    </div>
  );
}
