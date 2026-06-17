"use server";

import { z } from "zod";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-server";
import { fail, ok, revalidate, runAction, type ActionResult } from "@/lib/actions";
import { pageTag } from "@/lib/content";

const slugRegex = /^[a-z0-9](?:[a-z0-9-/]*[a-z0-9])?$/;

const CreatePageInput = z.object({
  slug: z.string().min(1).max(120).regex(slugRegex, {
    message:
      "Solo minúsculas, números, guiones y barras. No puede empezar/terminar con guión.",
  }),
  title: z.string().min(1).max(160),
});

const UpdatePageInput = z.object({
  title: z.string().min(1).max(160).optional(),
  seoTitle: z.string().max(160).nullable().optional(),
  seoDescription: z.string().max(400).nullable().optional(),
  published: z.boolean().optional(),
});

type PageListItem = {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  sectionsCount: number;
  updatedAt: Date;
};

export async function listPages(): Promise<ActionResult<PageListItem[]>> {
  return runAction(async () => {
    await requireAdmin();
    const rows = await db.page.findMany({
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { sections: true } } },
    });
    return ok(
      rows.map((r) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        published: r.published,
        sectionsCount: r._count.sections,
        updatedAt: r.updatedAt,
      })),
    );
  });
}

export async function createPage(
  input: unknown,
): Promise<ActionResult<{ id: string; slug: string }>> {
  return runAction(async () => {
    await requireAdmin();
    const parsed = CreatePageInput.safeParse(input);
    if (!parsed.success) {
      return fail(
        "VALIDATION",
        "Datos inválidos",
        parsed.error.flatten().fieldErrors,
      );
    }
    try {
      const created = await db.page.create({
        data: { slug: parsed.data.slug, title: parsed.data.title },
        select: { id: true, slug: true },
      });
      revalidate(pageTag(created.slug));
      return ok(created);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        return fail("CONFLICT", "Ya existe una página con ese slug");
      }
      throw err;
    }
  });
}

export async function updatePage(
  id: string,
  input: unknown,
): Promise<ActionResult<{ id: string; slug: string }>> {
  return runAction(async () => {
    await requireAdmin();
    const parsed = UpdatePageInput.safeParse(input);
    if (!parsed.success) {
      return fail(
        "VALIDATION",
        "Datos inválidos",
        parsed.error.flatten().fieldErrors,
      );
    }
    const existing = await db.page.findUnique({ where: { id } });
    if (!existing) return fail("NOT_FOUND");
    const updated = await db.page.update({
      where: { id },
      data: parsed.data,
      select: { id: true, slug: true },
    });
    revalidate(pageTag(updated.slug));
    return ok(updated);
  });
}

export async function deletePage(id: string): Promise<ActionResult> {
  return runAction(async () => {
    await requireAdmin();
    const existing = await db.page.findUnique({ where: { id } });
    if (!existing) return fail("NOT_FOUND");
    if (existing.slug === "home") {
      return fail("CONFLICT", "No se puede borrar la página de inicio");
    }
    await db.page.delete({ where: { id } });
    revalidate(pageTag(existing.slug));
    return ok(undefined);
  });
}
