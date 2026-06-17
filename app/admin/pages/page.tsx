import Link from "next/link";
import { listPages } from "@/app/admin/_actions/pages";
import AdminContainer from "@/components/admin/AdminContainer";

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
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Páginas</h1>
          <p className="text-sm text-[var(--color-petroleo)]/70">
            {pages.length} {pages.length === 1 ? "página" : "páginas"} —
            editá copys, secciones, orden y SEO.
          </p>
        </div>
        <Link
          href="/admin/pages/new"
          className="bg-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-700)] text-white font-semibold px-4 py-2 rounded-full text-sm"
        >
          + Nueva página
        </Link>
      </header>

      <ul className="mt-6 divide-y divide-[var(--color-petroleo-100)]">
        {pages.map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between py-3 gap-4"
          >
            <div className="min-w-0">
              <Link
                href={`/admin/pages/${p.id}`}
                className="font-semibold hover:text-[var(--color-celeste-600)]"
              >
                {p.title}
              </Link>
              <p className="text-xs text-[var(--color-petroleo)]/60 truncate">
                /{p.slug} · {p.sectionsCount} secciones ·{" "}
                {p.published ? "publicada" : "borrador"}
              </p>
            </div>
            <span className="text-xs text-[var(--color-petroleo)]/60 shrink-0">
              {new Date(p.updatedAt).toLocaleDateString("es-AR")}
            </span>
          </li>
        ))}
      </ul>

      {pages.length === 0 && (
        <p className="mt-8 text-sm text-[var(--color-petroleo)]/60">
          Todavía no hay páginas. Corré <code>npm run db:seed</code> para
          poblar el set base.
        </p>
      )}
    </AdminContainer>
  );
}
