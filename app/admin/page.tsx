import Link from "next/link";
import { listPages } from "@/app/admin/_actions/pages";
import AdminContainer from "@/components/admin/AdminContainer";
import {
  IconPages,
  IconPlus,
  IconEdit,
  IconExternal,
  IconSettings,
  IconMedia,
} from "@/components/admin/AdminIcons";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const result = await listPages();
  const pages = result.ok ? result.data : [];

  const home = pages.find((p) => p.slug === "home");
  const totalSections = pages.reduce((n, p) => n + p.sectionsCount, 0);
  const publishedCount = pages.filter((p) => p.published).length;
  const recent = pages.slice(0, 5);

  return (
    <AdminContainer>
      <header className="flex items-start justify-between gap-4 flex-col sm:flex-row">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-petroleo)]/50 mb-1">
            Panel
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--color-petroleo)] tracking-tight">
            ¡Hola! Bienvenido/a
          </h1>
          <p className="text-sm text-[var(--color-petroleo)]/70 mt-1 max-w-xl">
            Desde acá administrás todo el contenido del sitio. Elegí una página
            para editarla o creá una nueva.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {home && (
            <Link
              href={`/admin/pages/${home.id}`}
              className="inline-flex items-center gap-1.5 bg-[var(--color-celeste)] hover:bg-[var(--color-celeste-600)] text-white font-semibold px-4 py-2.5 rounded-lg text-sm shadow-sm transition"
            >
              <IconEdit size={16} />
              <span>Editar inicio</span>
            </Link>
          )}
          <Link
            href="/admin/pages/new"
            className="inline-flex items-center gap-1.5 bg-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-700)] text-white font-semibold px-4 py-2.5 rounded-lg text-sm shadow-sm transition"
          >
            <IconPlus size={16} />
            <span>Nueva página</span>
          </Link>
        </div>
      </header>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard
          icon={<IconPages size={18} />}
          label="Páginas"
          value={pages.length}
          hint={`${publishedCount} publicadas`}
        />
        <StatCard
          icon={<IconEdit size={18} />}
          label="Secciones"
          value={totalSections}
          hint="En total, en todas las páginas"
        />
        <StatCard
          icon={<IconMedia size={18} />}
          label="Media"
          value="Ver"
          hint="Biblioteca de imágenes"
          href="/admin/media"
        />
      </div>

      {/* Recent */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-petroleo)]/60">
            Últimas páginas editadas
          </h2>
          <Link
            href="/admin/pages"
            className="text-xs font-semibold text-[var(--color-celeste-600)] hover:underline inline-flex items-center gap-1"
          >
            Ver todas <IconExternal size={11} />
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--color-petroleo-100)] bg-white p-8 text-center">
            <p className="text-sm text-[var(--color-petroleo)]/60">
              Todavía no hay páginas.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recent.map((p) => {
              const publicHref = p.slug === "home" ? "/" : `/${p.slug}`;
              return (
                <li key={p.id}>
                  <Link
                    href={`/admin/pages/${p.id}`}
                    className="group flex items-center gap-3 rounded-xl border border-[var(--color-petroleo-100)] bg-white hover:border-[var(--color-celeste)] hover:shadow-md transition p-3.5"
                  >
                    <div
                      aria-hidden="true"
                      className="shrink-0 w-11 h-11 rounded-lg bg-[var(--color-petroleo-50)] group-hover:bg-[var(--color-celeste)]/12 text-[var(--color-petroleo)] group-hover:text-[var(--color-celeste-600)] flex items-center justify-center font-bold text-base transition"
                    >
                      {p.title.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm text-[var(--color-petroleo)] group-hover:text-[var(--color-celeste-600)] truncate">
                          {p.title}
                        </h3>
                        <span
                          className={`shrink-0 text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${
                            p.published
                              ? "bg-[var(--color-verde)]/12 text-[var(--color-verde-600)]"
                              : "bg-[var(--color-petroleo-50)] text-[var(--color-petroleo)]/60"
                          }`}
                        >
                          {p.published ? "Publicada" : "Borrador"}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--color-petroleo)]/55 font-mono truncate mt-0.5">
                        {publicHref}
                      </p>
                      <p className="text-[11px] text-[var(--color-petroleo)]/60 mt-1">
                        {p.sectionsCount}{" "}
                        {p.sectionsCount === 1 ? "sección" : "secciones"} ·
                        Actualizada{" "}
                        {new Date(p.updatedAt).toLocaleDateString("es-AR")}
                      </p>
                    </div>
                    <IconEdit
                      size={16}
                      className="text-[var(--color-petroleo)]/30 group-hover:text-[var(--color-celeste-600)] transition"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Shortcuts */}
      <section className="mt-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-petroleo)]/60 mb-3">
          Accesos rápidos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <ShortcutCard
            href="/admin/pages"
            title="Todas las páginas"
            body="Ver, editar, crear o eliminar páginas del sitio."
            icon={<IconPages size={20} />}
          />
          <ShortcutCard
            href="/admin/media"
            title="Biblioteca de imágenes"
            body="Subí, buscá y organizá las imágenes que usás en los bloques."
            icon={<IconMedia size={20} />}
          />
          <ShortcutCard
            href="/admin/settings"
            title="Configuración del sitio"
            body="Datos institucionales, contacto, redes y textos globales."
            icon={<IconSettings size={20} />}
          />
        </div>
      </section>
    </AdminContainer>
  );
}

function StatCard({
  icon,
  label,
  value,
  hint,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  hint: string;
  href?: string;
}) {
  const body = (
    <div className="rounded-xl border border-[var(--color-petroleo-100)] bg-white hover:shadow-sm transition p-4 flex items-start gap-3">
      <div className="shrink-0 w-10 h-10 rounded-lg bg-[var(--color-celeste)]/12 text-[var(--color-celeste-600)] flex items-center justify-center">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wider font-bold text-[var(--color-petroleo)]/50">
          {label}
        </div>
        <div className="text-2xl font-extrabold text-[var(--color-petroleo)] leading-tight">
          {value}
        </div>
        <div className="text-[11px] text-[var(--color-petroleo)]/60 mt-0.5">
          {hint}
        </div>
      </div>
    </div>
  );
  if (href) {
    return (
      <Link href={href} className="block">
        {body}
      </Link>
    );
  }
  return body;
}

function ShortcutCard({
  href,
  title,
  body,
  icon,
}: {
  href: string;
  title: string;
  body: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-[var(--color-petroleo-100)] bg-white hover:border-[var(--color-celeste)] hover:shadow-md hover:-translate-y-0.5 transition p-4 block"
    >
      <div className="w-10 h-10 rounded-lg bg-[var(--color-petroleo-50)] group-hover:bg-[var(--color-celeste)]/12 text-[var(--color-petroleo)]/70 group-hover:text-[var(--color-celeste-600)] flex items-center justify-center mb-3 transition">
        {icon}
      </div>
      <h3 className="font-semibold text-sm text-[var(--color-petroleo)] group-hover:text-[var(--color-celeste-600)] transition">
        {title}
      </h3>
      <p className="text-xs text-[var(--color-petroleo)]/65 mt-1 leading-relaxed">
        {body}
      </p>
    </Link>
  );
}
