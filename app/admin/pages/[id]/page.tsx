import Link from "next/link";
import { db } from "@/lib/db";
import { registry } from "@/lib/sections";
import PageEditor, {
  type EditorCatalogItem,
  type EditorSection,
} from "@/components/admin/PageEditor";
import AdminContainer from "@/components/admin/AdminContainer";

export const dynamic = "force-dynamic";

async function loadPage(id: string) {
  try {
    const page = await db.page.findUnique({
      where: { id },
      include: { sections: { orderBy: { order: "asc" } } },
    });
    return { ok: true as const, page };
  } catch (err) {
    return {
      ok: false as const,
      error: err instanceof Error ? err.message : "DB no disponible",
    };
  }
}

export default async function PageEditorRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await loadPage(id);

  if (!res.ok) {
    return (
      <AdminContainer>
        <h1 className="text-2xl font-bold">Editor</h1>
        <p className="mt-3 text-sm text-[var(--color-coral)]">
          No pudimos cargar la página. ¿Configuraste `DATABASE_URL`?
        </p>
        <code className="block mt-2 text-xs text-[var(--color-petroleo)]/60">
          {res.error}
        </code>
        <Link
          href="/admin"
          className="mt-4 inline-block text-sm text-[var(--color-celeste-600)] hover:underline"
        >
          ← Volver al listado
        </Link>
      </AdminContainer>
    );
  }

  if (!res.page) {
    return (
      <AdminContainer>
        <h1 className="text-2xl font-bold">Página no encontrada</h1>
        <Link
          href="/admin"
          className="mt-4 inline-block text-sm text-[var(--color-celeste-600)] hover:underline"
        >
          ← Volver al listado
        </Link>
      </AdminContainer>
    );
  }

  const initialSections: EditorSection[] = res.page.sections.map((s) => ({
    id: s.id,
    type: s.type,
    data: (s.data ?? {}) as Record<string, unknown>,
    enabled: s.enabled,
    order: s.order,
  }));

  const catalog: EditorCatalogItem[] = Object.values(registry).map((def) => ({
    type: def.type,
    label: def.editor.label,
    description: def.editor.description,
    editor: def.editor,
    defaults: def.defaults as Record<string, unknown>,
  }));

  return (
    <PageEditor
      pageId={res.page.id}
      pageTitle={res.page.title}
      pageSlug={res.page.slug}
      initialSections={initialSections}
      catalog={catalog}
    />
  );
}
