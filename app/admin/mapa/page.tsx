import { db } from "@/lib/db";
import SitemapGraph, {
  type GraphEdge,
  type GraphNode,
} from "@/components/admin/SitemapGraph";
import { registry } from "@/lib/sections";

export const dynamic = "force-dynamic";

type LinkHit = {
  href: string;
  label: string;
  sourceSectionType: string;
  sourceSectionId: string;
};

// Walks a JSON-ish tree collecting {href/label} pairs. Handles arrays,
// nested objects and the CustomBlock's `elements[]` shape (kind + href/text).
function extractLinks(data: unknown, sectionType: string, sectionId: string): LinkHit[] {
  const hits: LinkHit[] = [];

  function pushIfLink(hrefValue: unknown, labelValue: unknown) {
    if (typeof hrefValue !== "string") return;
    const href = hrefValue.trim();
    if (!href || href === "#") return;
    if (href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) return;
    const label =
      typeof labelValue === "string" && labelValue.trim().length > 0
        ? labelValue.trim()
        : "(sin etiqueta)";
    hits.push({ href, label, sourceSectionType: sectionType, sourceSectionId: sectionId });
  }

  function walk(node: unknown) {
    if (!node) return;
    if (Array.isArray(node)) {
      for (const item of node) walk(item);
      return;
    }
    if (typeof node !== "object") return;
    const obj = node as Record<string, unknown>;

    // Common shapes
    if ("href" in obj) {
      // Label heuristics: prefer label > text > title > ctaLabel > name
      const label =
        obj.label ??
        obj.text ??
        obj.title ??
        obj.ctaLabel ??
        obj.name ??
        undefined;
      pushIfLink(obj.href, label);
    }
    if ("ctaHref" in obj) {
      pushIfLink(obj.ctaHref, obj.ctaLabel ?? obj.title ?? obj.text);
    }

    for (const value of Object.values(obj)) walk(value);
  }

  walk(data);
  return hits;
}

// Normalize an href into a site slug (or null if external / non-matchable).
function hrefToSlug(href: string, slugs: Set<string>): string | null {
  try {
    if (href.startsWith("http://") || href.startsWith("https://")) {
      const url = new URL(href);
      if (!url.hostname.endsWith("localhost") && url.hostname !== "cetip.com.ar") {
        return null; // external — skip
      }
      href = url.pathname + url.search + url.hash;
    }
    if (!href.startsWith("/")) return null;
    const clean = href.split("?")[0].split("#")[0];
    const slug = clean === "/" ? "home" : clean.replace(/^\//, "").replace(/\/$/, "");
    return slugs.has(slug) ? slug : null;
  } catch {
    return null;
  }
}

async function loadGraph(): Promise<{
  nodes: GraphNode[];
  edges: GraphEdge[];
  ok: boolean;
  error?: string;
}> {
  try {
    const pages = await db.page.findMany({
      include: {
        sections: {
          where: { enabled: true },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { slug: "asc" },
    });

    const slugSet = new Set(pages.map((p) => p.slug));

    const nodes: GraphNode[] = pages.map((p) => ({
      slug: p.slug,
      title: p.title,
      published: p.published,
      sectionsCount: p.sections.length,
    }));

    type EdgeGroup = {
      key: string;
      from: string;
      to: string;
      links: {
        label: string;
        via: string;
      }[];
    };
    const edgeMap = new Map<string, EdgeGroup>();

    for (const p of pages) {
      for (const s of p.sections) {
        const hits = extractLinks(s.data, s.type, s.id);
        for (const hit of hits) {
          const targetSlug = hrefToSlug(hit.href, slugSet);
          if (!targetSlug) continue;
          if (targetSlug === p.slug) continue; // skip self-loops
          const key = `${p.slug}→${targetSlug}`;
          if (!edgeMap.has(key)) {
            edgeMap.set(key, {
              key,
              from: p.slug,
              to: targetSlug,
              links: [],
            });
          }
          const def = registry[s.type as keyof typeof registry];
          const sectionLabel = def?.editor.label ?? s.type;
          edgeMap.get(key)!.links.push({
            label: hit.label,
            via: sectionLabel,
          });
        }
      }
    }

    const edges: GraphEdge[] = Array.from(edgeMap.values()).map((e) => ({
      from: e.from,
      to: e.to,
      links: e.links,
    }));

    return { ok: true, nodes, edges };
  } catch (err) {
    return {
      ok: false,
      nodes: [],
      edges: [],
      error: err instanceof Error ? err.message : "Error desconocido",
    };
  }
}

export default async function MapaPage() {
  const graph = await loadGraph();

  if (!graph.ok) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Mapa del sitio</h1>
        <p className="mt-3 text-sm text-[var(--color-coral)]">
          No pudimos cargar el mapa: {graph.error}
        </p>
      </div>
    );
  }

  return <SitemapGraph nodes={graph.nodes} edges={graph.edges} />;
}
