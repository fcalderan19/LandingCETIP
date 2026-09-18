import Link from "next/link";
import { listPages } from "@/app/admin/_actions/pages";
import AdminContainer from "@/components/admin/AdminContainer";
import { IconPlus, IconEdit, IconExternal } from "@/components/admin/AdminIcons";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const result = await listPages();
  if (!result.ok) {
    return (
      <AdminContainer>
        <h1 className="text-2xl font-bold">Páginas</h1>
        <p className="mt-3 text-sm text-[var(--color-coral)]">
          Error: {result.error}
          {result.message ? ` — ${result.message}` : ""}
        </p>
      </AdminContainer>
    );
  }

  const pages = result.data;
  return (
    <AdminContainer>
      <header className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-petroleo)]">
            Páginas
          </h1>
          <p className="text-sm text-[var(--color-petroleo)]/70 mt-1">
            {pages.length} {pages.length === 1 ? "página" : "páginas"} — editá
            copys, secciones, orden y SEO.
          </p>
        </div>
        <Link
          href="/admin/pages/new"
          className="inline-flex items-center gap-1.5 bg-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-700)] text-white font-semibold px-4 py-2.5 rounded-lg text-sm shadow-sm transition"
        >
          <IconPlus size={16} />
          <span>Nueva página</span>
        </Link>
      </header>

      {pages.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-[var(--color-petroleo-100)] bg-white p-8 text-center">
          <p className="text-sm text-[var(--color-petroleo)]/60">
            Todavía no hay páginas. Corré{" "}
            <code className="px-1.5 py-0.5 rounded bg-[var(--color-petroleo-50)] text-[var(--color-petroleo)]">
              npm run db:seed
            </code>{" "}
            para poblar el set base.
          </p>
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {pages.map((p) => {
            const publicHref = p.slug === "home" ? "/" : `/${p.slug}`;
            const status = p.published ? "publicada" : "borrador";
            return (
              <li key={p.id}>
                <div className="group relative h-full rounded-xl border border-[var(--color-petroleo-100)] bg-white hover:border-[var(--color-celeste)] hover:shadow-md transition overflow-hidden">
                  <Link
                    href={`/admin/pages/${p.id}`}
                    className="block p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        aria-hidden="true"
                        className="shrink-0 w-11 h-11 rounded-lg bg-[var(--color-petroleo-50)] group-hover:bg-[var(--color-celeste)]/12 text-[var(--color-petroleo)] group-hover:text-[var(--color-celeste-600)] flex items-center justify-center font-bold text-base transition"
                      >
                        {p.title.slice(0, 1).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="font-semibold text-[15px] text-[var(--color-petroleo)] group-hover:text-[var(--color-celeste-600)] transition truncate">
                          {p.title}
                        </h2>
                        <p className="text-[11px] text-[var(--color-petroleo)]/60 font-mono truncate mt-0.5">
                          {publicHref}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                          p.published
                            ? "bg-[var(--color-verde)]/12 text-[var(--color-verde-600)]"
                            : "bg-[var(--color-petroleo-50)] text-[var(--color-petroleo)]/60"
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-3 text-[11px] text-[var(--color-petroleo)]/60">
                      <span className="inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-celeste)]" />
                        {p.sectionsCount}{" "}
                        {p.sectionsCount === 1 ? "sección" : "secciones"}
                      </span>
                      <span className="text-[var(--color-petroleo)]/30">·</span>
                      <span>
                        Actualizada{" "}
                        {new Date(p.updatedAt).toLocaleDateString("es-AR")}
                      </span>
                    </div>
                  </Link>
                  <div className="px-4 pb-3 flex gap-2">
                    <Link
                      href={`/admin/pages/${p.id}`}
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-[var(--color-petroleo-100)] bg-white text-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-50)] transition"
                    >
                      <IconEdit size={12} />
                      <span>Editar</span>
                    </Link>
                    <a
                      href={publicHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-[var(--color-petroleo-100)] bg-white text-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-50)] transition"
                    >
                      <IconExternal size={12} />
                      <span>Ver</span>
                    </a>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </AdminContainer>
  );
}
