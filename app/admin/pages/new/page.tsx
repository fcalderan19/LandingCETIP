import { redirect } from "next/navigation";
import Link from "next/link";
import AdminContainer from "@/components/admin/AdminContainer";
import { createPage } from "@/app/admin/_actions/pages";

export const dynamic = "force-dynamic";

async function action(formData: FormData) {
  "use server";
  const slug = String(formData.get("slug") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const res = await createPage({ slug, title });
  if (!res.ok) {
    redirect(
      `/admin/pages/new?error=${encodeURIComponent(res.message ?? res.error)}`,
    );
  }
  redirect(`/admin/pages/${res.data.id}`);
}

export default async function NewPageRoute({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <AdminContainer>
    <section className="max-w-lg">
      <Link
        href="/admin"
        className="text-xs text-[var(--color-celeste-600)] hover:underline"
      >
        ← Volver
      </Link>
      <h1 className="text-2xl font-bold mt-2">Nueva página</h1>
      <p className="text-sm text-[var(--color-petroleo)]/70 mt-1">
        Creá una página vacía y después agregale secciones desde el editor.
      </p>

      <form action={action} className="mt-6 grid gap-3">
        <label className="grid gap-1">
          <span className="text-xs font-semibold">Título</span>
          <input
            name="title"
            required
            placeholder="Quiénes Somos"
            className="rounded-lg border border-[var(--color-petroleo-100)] bg-white px-3 py-2.5"
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-semibold">Slug</span>
          <input
            name="slug"
            required
            placeholder="quienes-somos"
            pattern="[a-z0-9](?:[a-z0-9-/]*[a-z0-9])?"
            className="rounded-lg border border-[var(--color-petroleo-100)] bg-white px-3 py-2.5 font-mono text-sm"
          />
          <span className="text-[10px] text-[var(--color-petroleo)]/60">
            Sólo minúsculas, números, guiones y barras. Esta página se servirá
            en <code>/&lt;slug&gt;</code>.
          </span>
        </label>

        {error && (
          <p className="text-sm text-[var(--color-coral)] bg-[var(--color-coral)]/10 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="bg-[var(--color-petroleo)] hover:bg-[var(--color-petroleo-700)] text-white font-semibold px-4 py-2.5 rounded-full w-fit"
        >
          Crear
        </button>
      </form>
    </section>
    </AdminContainer>
  );
}
