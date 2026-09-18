"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactElement } from "react";
import {
  IconHome,
  IconPages,
  IconSettings,
  IconMedia,
  IconSitemap,
  IconInbox,
  IconLogout,
  IconPanelLeft,
  IconPanelLeftClose,
} from "./AdminIcons";

type NavItem = {
  href: string;
  label: string;
  Icon: (p: { size?: number }) => ReactElement;
  matches: (path: string) => boolean;
};

const PRIMARY_NAV: NavItem[] = [
  {
    href: "/admin",
    label: "Inicio",
    Icon: IconHome,
    matches: (p) => p === "/admin" || p === "/admin/",
  },
  {
    href: "/admin/pages",
    label: "Páginas",
    Icon: IconPages,
    matches: (p) => p.startsWith("/admin/pages"),
  },
  {
    href: "/admin/mapa",
    label: "Mapa del sitio",
    Icon: IconSitemap,
    matches: (p) => p.startsWith("/admin/mapa"),
  },
  {
    href: "/admin/mensajes",
    label: "Buzón",
    Icon: IconInbox,
    matches: (p) => p.startsWith("/admin/mensajes"),
  },
];

const SECONDARY_NAV: NavItem[] = [
  {
    href: "/admin/media",
    label: "Media",
    Icon: IconMedia,
    matches: (p) => p.startsWith("/admin/media"),
  },
  {
    href: "/admin/settings",
    label: "Configuración",
    Icon: IconSettings,
    matches: (p) => p.startsWith("/admin/settings"),
  },
];

const STORAGE_KEY = "cetip-admin-sidebar-collapsed";

export default function AdminSidebar({
  user,
  signOutAction,
}: {
  user: { email: string };
  signOutAction: () => Promise<void>;
}) {
  const pathname = usePathname() ?? "";
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [autoCollapsed, setAutoCollapsed] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "1") setCollapsed(true);
    } catch {
      // ignore
    }
    // Watch <html data-admin-editing> so we can auto-collapse while editing.
    const el = document.documentElement;
    const sync = () =>
      setAutoCollapsed(el.getAttribute("data-admin-editing") === "1");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(el, {
      attributes: true,
      attributeFilter: ["data-admin-editing"],
    });
    return () => observer.disconnect();
  }, []);

  // The effective collapsed state combines the user preference with the
  // "editing a block" auto-collapse. User pref is what we persist.
  const effectiveCollapsed = collapsed || autoCollapsed;

  useEffect(() => {
    if (!mounted) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
    } catch {
      // ignore
    }
  }, [collapsed, mounted]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--admin-sidebar-width",
      effectiveCollapsed ? "72px" : "232px",
    );
  }, [effectiveCollapsed]);

  const width = effectiveCollapsed ? "72px" : "232px";

  return (
    <aside
      className="admin-sidebar fixed top-0 left-0 h-screen flex flex-col bg-[var(--color-petroleo)] text-white z-40 transition-[width] duration-200"
      style={{ width }}
      aria-label="Navegación principal del admin"
    >
      {/* Header: logo + collapse button (all dark, matches the rest) */}
      <div
        className={`shrink-0 flex items-center gap-1.5 border-b border-white/10 ${
          effectiveCollapsed ? "flex-col justify-center px-2 py-3" : "justify-between pl-3 pr-2 py-3"
        }`}
      >
        <Link
          href="/admin"
          aria-label="Ir al inicio del admin"
          className={`flex items-center ${effectiveCollapsed ? "" : "min-w-0 flex-1"}`}
        >
          <Image
            src="/img/cetip-logo-dark.png"
            alt="CETIP"
            width={effectiveCollapsed ? 40 : 130}
            height={effectiveCollapsed ? 40 : 40}
            priority
            className={
              effectiveCollapsed
                ? "h-9 w-9 object-contain"
                : "h-10 w-auto object-contain"
            }
          />
        </Link>
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={effectiveCollapsed ? "Expandir barra lateral" : "Contraer barra lateral"}
          title={effectiveCollapsed ? "Expandir" : "Contraer"}
          className={`shrink-0 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition ${
            effectiveCollapsed ? "w-9 h-9 mt-2" : "w-8 h-8"
          }`}
        >
          {effectiveCollapsed ? (
            <IconPanelLeft size={16} />
          ) : (
            <IconPanelLeftClose size={16} />
          )}
        </button>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <NavGroup
          items={PRIMARY_NAV}
          pathname={pathname}
          collapsed={effectiveCollapsed}
          heading="Principal"
        />
        <div className="mt-3 pt-3 border-t border-white/10">
          <NavGroup
            items={SECONDARY_NAV}
            pathname={pathname}
            collapsed={effectiveCollapsed}
            heading="Recursos"
          />
        </div>
      </nav>

      {/* Bottom: user */}
      <div className="shrink-0 border-t border-white/10">
        <div
          className={`p-3 ${effectiveCollapsed ? "flex justify-center" : ""}`}
        >
          {effectiveCollapsed ? (
            <UserAvatar email={user.email} />
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <UserAvatar email={user.email} />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-white/90 truncate">
                    {user.email.split("@")[0]}
                  </div>
                  <div className="text-[10px] text-white/50 truncate">
                    {user.email}
                  </div>
                </div>
              </div>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="w-full inline-flex items-center gap-2 text-[11px] font-semibold text-white/70 hover:text-white hover:bg-white/5 px-2.5 py-1.5 rounded-lg transition"
                >
                  <IconLogout size={13} />
                  <span>Cerrar sesión</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

function NavGroup({
  items,
  pathname,
  collapsed,
  heading,
}: {
  items: NavItem[];
  pathname: string;
  collapsed: boolean;
  heading: string;
}) {
  return (
    <div>
      {!collapsed && (
        <h4 className="px-3 mb-1.5 text-[10px] uppercase tracking-wider font-bold text-white/40">
          {heading}
        </h4>
      )}
      <ul className="space-y-0.5">
        {items.map((item) => {
          const active = item.matches(pathname);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                title={collapsed ? item.label : undefined}
                aria-current={active ? "page" : undefined}
                className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  active
                    ? "bg-white/12 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                } ${collapsed ? "justify-center" : ""}`}
              >
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-[var(--color-celeste)]"
                  />
                )}
                <item.Icon size={17} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function UserAvatar({ email }: { email: string }) {
  const initial = (email.trim()[0] ?? "?").toUpperCase();
  return (
    <div
      aria-hidden="true"
      className="shrink-0 w-8 h-8 rounded-full bg-[var(--color-celeste)]/25 text-white font-bold text-xs flex items-center justify-center border border-white/15"
    >
      {initial}
    </div>
  );
}
