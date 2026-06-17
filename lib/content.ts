import { unstable_cache } from "next/cache";
import { db } from "./db";
import { getSection } from "./sections";

export type RenderableSection = {
  id: string;
  type: string;
  data: unknown;
  enabled: boolean;
  order: number;
};

export type RenderablePage = {
  id: string;
  slug: string;
  title: string;
  seoTitle: string | null;
  seoDescription: string | null;
  published: boolean;
  sections: RenderableSection[];
};

export const pageTag = (slug: string) => `page:${slug}`;

async function loadPage(slug: string): Promise<RenderablePage | null> {
  const page = await db.page.findUnique({
    where: { slug },
    include: {
      sections: {
        where: { enabled: true },
        orderBy: { order: "asc" },
      },
    },
  });
  if (!page || !page.published) return null;

  return {
    id: page.id,
    slug: page.slug,
    title: page.title,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    published: page.published,
    sections: page.sections.map((s) => ({
      id: s.id,
      type: s.type,
      data: s.data,
      enabled: s.enabled,
      order: s.order,
    })),
  };
}

export function getPageBySlug(slug: string) {
  return unstable_cache(() => loadPage(slug), ["page", slug], {
    tags: [pageTag(slug)],
  })();
}

/**
 * Parse a section's stored JSON `data` against its registered schema.
 * Returns null if the section type is unknown or the data is invalid —
 * callers should skip the section instead of crashing the page.
 */
export function parseSectionData(
  type: string,
  data: unknown,
): { ok: true; data: unknown } | { ok: false; error: string } {
  const def = getSection(type);
  if (!def) return { ok: false, error: `unknown section type: ${type}` };
  const parsed = def.schema.safeParse(data);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; "),
    };
  }
  return { ok: true, data: parsed.data };
}
