import { getPageBySlug, parseSectionData } from "@/lib/content";
import { getSection } from "@/lib/sections";
import type { ReactNode } from "react";

type Props = {
  slug: string;
  /**
   * Renderizado cuando la página no existe en DB todavía (durante la migración)
   * o cuando no tiene secciones. Permite mantener el sitio operativo aunque
   * el admin aún no haya poblado la página.
   */
  fallback?: ReactNode;
};

export default async function PageRenderer({ slug, fallback = null }: Props) {
  let page;
  try {
    page = await getPageBySlug(slug);
  } catch (err) {
    // DB no disponible (env vars sin setear, Neon down, etc.) → fallback.
    console.warn(`[PageRenderer] DB unavailable for "${slug}":`, err);
    return <>{fallback}</>;
  }

  if (!page || page.sections.length === 0) return <>{fallback}</>;

  return (
    <>
      {page.sections.map((section) => {
        const def = getSection(section.type);
        if (!def) {
          console.warn(`[PageRenderer] unknown section type: ${section.type}`);
          return null;
        }
        const parsed = parseSectionData(section.type, section.data);
        if (!parsed.ok) {
          console.warn(
            `[PageRenderer] invalid data for ${section.type} (id=${section.id}): ${parsed.error}`,
          );
          return null;
        }
        const Render = def.render;
        // Anchor per-section so the admin can highlight & scroll the exact
        // block being edited. `data-*` attributes are inert on the public site.
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
            data-section-label={def.editor.label}
            className="admin-anchor-section"
          >
            <Render {...(parsed.data as object)} />
          </div>
        );
      })}
    </>
  );
}
