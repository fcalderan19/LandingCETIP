"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-server";
import { fail, ok, revalidate, runAction, type ActionResult } from "@/lib/actions";
import { pageTag } from "@/lib/content";
import { getSection } from "@/lib/sections";

const AddSectionInput = z.object({
  pageId: z.string().min(1),
  type: z.string().min(1),
  atIndex: z.number().int().min(0).optional(),
  data: z.unknown().optional(),
});

const ReorderInput = z.object({
  pageId: z.string().min(1),
  orderedIds: z.array(z.string().min(1)).min(1),
});

async function pageSlug(pageId: string): Promise<string | null> {
  const p = await db.page.findUnique({
    where: { id: pageId },
    select: { slug: true },
  });
  return p?.slug ?? null;
}

export async function addSection(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  return runAction(async () => {
    await requireAdmin();
    const parsed = AddSectionInput.safeParse(input);
    if (!parsed.success) {
      return fail("VALIDATION", "Datos inválidos", parsed.error.flatten().fieldErrors);
    }
    const def = getSection(parsed.data.type);
    if (!def) return fail("VALIDATION", `Tipo de sección desconocido: ${parsed.data.type}`);

    const slug = await pageSlug(parsed.data.pageId);
    if (!slug) return fail("NOT_FOUND", "Página inexistente");

    const incoming = parsed.data.data ?? def.defaults;
    const validated = def.schema.safeParse(incoming);
    if (!validated.success) {
      return fail(
        "VALIDATION",
        "El contenido de la sección no cumple el schema",
        validated.error.flatten().fieldErrors,
      );
    }

    const result = await db.$transaction(async (tx) => {
      const existing = await tx.section.findMany({
        where: { pageId: parsed.data.pageId },
        orderBy: { order: "asc" },
        select: { id: true, order: true },
      });
      const at = Math.min(parsed.data.atIndex ?? existing.length, existing.length);
      // Bump orders >= at
      for (const s of existing) {
        if (s.order >= at) {
          await tx.section.update({ where: { id: s.id }, data: { order: s.order + 1 } });
        }
      }
      const created = await tx.section.create({
        data: {
          pageId: parsed.data.pageId,
          type: parsed.data.type,
          data: validated.data as object,
          order: at,
        },
        select: { id: true },
      });
      return created;
    });

    revalidate(pageTag(slug));
    return ok({ id: result.id });
  });
}

export async function updateSection(
  id: string,
  rawData: unknown,
): Promise<ActionResult> {
  return runAction(async () => {
    await requireAdmin();
    const section = await db.section.findUnique({
      where: { id },
      include: { page: { select: { slug: true } } },
    });
    if (!section) return fail("NOT_FOUND");

    const def = getSection(section.type);
    if (!def) return fail("INTERNAL", `Tipo no registrado: ${section.type}`);

    const validated = def.schema.safeParse(rawData);
    if (!validated.success) {
      return fail(
        "VALIDATION",
        "Datos inválidos",
        validated.error.flatten().fieldErrors,
      );
    }

    await db.section.update({
      where: { id },
      data: { data: validated.data as object },
    });
    revalidate(pageTag(section.page.slug));
    return ok(undefined);
  });
}

export async function reorderSections(input: unknown): Promise<ActionResult> {
  return runAction(async () => {
    await requireAdmin();
    const parsed = ReorderInput.safeParse(input);
    if (!parsed.success) {
      return fail("VALIDATION", "Datos inválidos", parsed.error.flatten().fieldErrors);
    }
    const slug = await pageSlug(parsed.data.pageId);
    if (!slug) return fail("NOT_FOUND", "Página inexistente");

    await db.$transaction(async (tx) => {
      // Two-phase update to dodge unique-ish ordering collisions on the index.
      // First push everything to negative ordinals, then write final positions.
      const sections = await tx.section.findMany({
        where: { pageId: parsed.data.pageId },
        select: { id: true },
      });
      const ids = new Set(sections.map((s) => s.id));
      for (const id of parsed.data.orderedIds) {
        if (!ids.has(id)) {
          throw new Error(`Section ${id} no pertenece a la página`);
        }
      }
      for (const s of sections) {
        await tx.section.update({ where: { id: s.id }, data: { order: -1 } });
      }
      for (let i = 0; i < parsed.data.orderedIds.length; i++) {
        await tx.section.update({
          where: { id: parsed.data.orderedIds[i] },
          data: { order: i },
        });
      }
    });

    revalidate(pageTag(slug));
    return ok(undefined);
  });
}

export async function toggleSection(
  id: string,
  enabled: boolean,
): Promise<ActionResult> {
  return runAction(async () => {
    await requireAdmin();
    const section = await db.section.findUnique({
      where: { id },
      include: { page: { select: { slug: true } } },
    });
    if (!section) return fail("NOT_FOUND");
    await db.section.update({ where: { id }, data: { enabled } });
    revalidate(pageTag(section.page.slug));
    return ok(undefined);
  });
}

export async function deleteSection(id: string): Promise<ActionResult> {
  return runAction(async () => {
    await requireAdmin();
    const section = await db.section.findUnique({
      where: { id },
      include: { page: { select: { slug: true } } },
    });
    if (!section) return fail("NOT_FOUND");

    await db.$transaction(async (tx) => {
      await tx.section.delete({ where: { id } });
      const remaining = await tx.section.findMany({
        where: { pageId: section.pageId },
        orderBy: { order: "asc" },
        select: { id: true },
      });
      for (let i = 0; i < remaining.length; i++) {
        await tx.section.update({
          where: { id: remaining[i].id },
          data: { order: i },
        });
      }
    });

    revalidate(pageTag(section.page.slug));
    return ok(undefined);
  });
}

