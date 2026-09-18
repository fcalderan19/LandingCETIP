"use server";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-server";
import { fail, ok, runAction, type ActionResult } from "@/lib/actions";

export type SubmissionListItem = {
  id: string;
  kind: string;
  pageSlug: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string | null;
  attachments: unknown;
  read: boolean;
  archived: boolean;
  createdAt: Date;
};

export type ActiveKind = {
  kind: string;
  label: string;
  pageSlugs: string[];
  count: number;
  unread: number;
};

const KIND_LABEL: Record<string, string> = {
  contacto: "Formulario de Contacto",
  admision: "Formulario de Admisión",
  rrhh: "Postulaciones RR.HH.",
  otro: "Otros",
};

// Section types that create a public form on the page.
const FORM_SECTION_TYPES: Record<string, string> = {
  contacto: "contacto",
  rrhh: "rrhh",
};

export async function listSubmissions(
  filters?: { kind?: string; showArchived?: boolean },
): Promise<ActionResult<{
  items: SubmissionListItem[];
  activeKinds: ActiveKind[];
  totalUnread: number;
}>> {
  return runAction(async () => {
    await requireAdmin();

    // Detect which forms are actually published (auto-discovery).
    const pages = await db.page.findMany({
      where: { published: true },
      include: {
        sections: {
          where: { enabled: true },
          select: { type: true },
        },
      },
    });

    const activeMap = new Map<string, ActiveKind>();
    for (const p of pages) {
      for (const s of p.sections) {
        const kind = FORM_SECTION_TYPES[s.type];
        if (!kind) continue;
        if (!activeMap.has(kind)) {
          activeMap.set(kind, {
            kind,
            label: KIND_LABEL[kind] ?? kind,
            pageSlugs: [],
            count: 0,
            unread: 0,
          });
        }
        activeMap.get(kind)!.pageSlugs.push(p.slug);
      }
    }
    // Always include admision (its form is a hardcoded API even when block
    // model is a custom_block) and "otro" so nothing is lost.
    if (!activeMap.has("admision")) {
      activeMap.set("admision", {
        kind: "admision",
        label: KIND_LABEL.admision,
        pageSlugs: ["admision"],
        count: 0,
        unread: 0,
      });
    }

    // Fill in counts and unread per kind (based on ALL rows, not filtered).
    const grouped = await db.submission.groupBy({
      by: ["kind", "read", "archived"],
      _count: { _all: true },
    });
    for (const g of grouped) {
      if (g.archived && !filters?.showArchived) continue;
      let entry = activeMap.get(g.kind);
      if (!entry) {
        entry = {
          kind: g.kind,
          label: KIND_LABEL[g.kind] ?? g.kind,
          pageSlugs: [],
          count: 0,
          unread: 0,
        };
        activeMap.set(g.kind, entry);
      }
      entry.count += g._count._all;
      if (!g.read) entry.unread += g._count._all;
    }

    const activeKinds = Array.from(activeMap.values()).sort(
      (a, b) => b.unread - a.unread || a.label.localeCompare(b.label),
    );
    const totalUnread = activeKinds.reduce((n, k) => n + k.unread, 0);

    const rows = await db.submission.findMany({
      where: {
        ...(filters?.kind ? { kind: filters.kind } : {}),
        ...(filters?.showArchived ? {} : { archived: false }),
      },
      orderBy: { createdAt: "desc" },
      take: 500,
    });

    return ok({
      items: rows.map((r) => ({
        id: r.id,
        kind: r.kind,
        pageSlug: r.pageSlug,
        name: r.name,
        email: r.email,
        phone: r.phone,
        subject: r.subject,
        message: r.message,
        attachments: r.attachments,
        read: r.read,
        archived: r.archived,
        createdAt: r.createdAt,
      })),
      activeKinds,
      totalUnread,
    });
  });
}

export async function markSubmissionRead(
  id: string,
  read: boolean,
): Promise<ActionResult> {
  return runAction(async () => {
    await requireAdmin();
    const row = await db.submission.findUnique({ where: { id } });
    if (!row) return fail("NOT_FOUND");
    await db.submission.update({ where: { id }, data: { read } });
    return ok(undefined);
  });
}

export async function archiveSubmission(
  id: string,
  archived: boolean,
): Promise<ActionResult> {
  return runAction(async () => {
    await requireAdmin();
    const row = await db.submission.findUnique({ where: { id } });
    if (!row) return fail("NOT_FOUND");
    await db.submission.update({ where: { id }, data: { archived } });
    return ok(undefined);
  });
}

export async function deleteSubmission(id: string): Promise<ActionResult> {
  return runAction(async () => {
    await requireAdmin();
    const row = await db.submission.findUnique({ where: { id } });
    if (!row) return fail("NOT_FOUND");
    await db.submission.delete({ where: { id } });
    return ok(undefined);
  });
}
