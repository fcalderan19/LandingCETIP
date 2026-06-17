"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-server";
import { fail, ok, revalidate, runAction, type ActionResult } from "@/lib/actions";
import {
  JOB_OPENINGS_TAG,
  PROFESSIONALS_TAG,
  WORKSHOPS_TAG,
} from "@/lib/collections";

// ---------- Professionals ----------

const emptyToUndef = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;
const emptyToNull = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? null : v;

const ProfessionalInput = z.object({
  nombre: z.string().min(1).max(160),
  rol: z.string().min(1).max(160),
  disciplina: z.string().min(1).max(120),
  descripcion: z.preprocess(emptyToUndef, z.string().max(800).optional()),
  fotoAssetId: z.preprocess(emptyToNull, z.string().nullable().optional()),
  orden: z.number().int().min(0).max(9999).default(0),
  visible: z.boolean().default(true),
});

export async function createProfessional(input: unknown): Promise<ActionResult<{ id: string }>> {
  return runAction(async () => {
    await requireAdmin();
    const parsed = ProfessionalInput.safeParse(input);
    if (!parsed.success) {
      return fail("VALIDATION", "Datos inválidos", parsed.error.flatten().fieldErrors);
    }
    const created = await db.professional.create({
      data: parsed.data,
      select: { id: true },
    });
    revalidate(PROFESSIONALS_TAG);
    return ok(created);
  });
}

export async function updateProfessional(id: string, input: unknown): Promise<ActionResult> {
  return runAction(async () => {
    await requireAdmin();
    const parsed = ProfessionalInput.partial().safeParse(input);
    if (!parsed.success) {
      return fail("VALIDATION", "Datos inválidos", parsed.error.flatten().fieldErrors);
    }
    const exists = await db.professional.findUnique({ where: { id } });
    if (!exists) return fail("NOT_FOUND");
    await db.professional.update({ where: { id }, data: parsed.data });
    revalidate(PROFESSIONALS_TAG);
    return ok(undefined);
  });
}

export async function deleteProfessional(id: string): Promise<ActionResult> {
  return runAction(async () => {
    await requireAdmin();
    const exists = await db.professional.findUnique({ where: { id } });
    if (!exists) return fail("NOT_FOUND");
    await db.professional.delete({ where: { id } });
    revalidate(PROFESSIONALS_TAG);
    return ok(undefined);
  });
}

// ---------- Workshops ----------

const WorkshopInput = z.object({
  titulo: z.string().min(1).max(160),
  dia: z.string().min(1).max(80),
  horario: z.string().min(1).max(80),
  destinatarios: z.string().min(1).max(200),
  descripcion: z.string().min(1).max(800),
  visible: z.boolean().default(true),
  orden: z.number().int().min(0).max(9999).default(0),
});

export async function createWorkshop(input: unknown): Promise<ActionResult<{ id: string }>> {
  return runAction(async () => {
    await requireAdmin();
    const parsed = WorkshopInput.safeParse(input);
    if (!parsed.success) {
      return fail("VALIDATION", "Datos inválidos", parsed.error.flatten().fieldErrors);
    }
    const created = await db.workshop.create({ data: parsed.data, select: { id: true } });
    revalidate(WORKSHOPS_TAG);
    return ok(created);
  });
}

export async function updateWorkshop(id: string, input: unknown): Promise<ActionResult> {
  return runAction(async () => {
    await requireAdmin();
    const parsed = WorkshopInput.partial().safeParse(input);
    if (!parsed.success) {
      return fail("VALIDATION", "Datos inválidos", parsed.error.flatten().fieldErrors);
    }
    const exists = await db.workshop.findUnique({ where: { id } });
    if (!exists) return fail("NOT_FOUND");
    await db.workshop.update({ where: { id }, data: parsed.data });
    revalidate(WORKSHOPS_TAG);
    return ok(undefined);
  });
}

export async function deleteWorkshop(id: string): Promise<ActionResult> {
  return runAction(async () => {
    await requireAdmin();
    const exists = await db.workshop.findUnique({ where: { id } });
    if (!exists) return fail("NOT_FOUND");
    await db.workshop.delete({ where: { id } });
    revalidate(WORKSHOPS_TAG);
    return ok(undefined);
  });
}

// ---------- Job openings ----------

const JobOpeningInput = z.object({
  titulo: z.string().min(1).max(160),
  area: z.string().min(1).max(200),
  modalidad: z.string().min(1).max(80),
  jornada: z.string().min(1).max(80),
  descripcion: z.string().min(1).max(800),
  activa: z.boolean().default(true),
  orden: z.number().int().min(0).max(9999).default(0),
});

export async function createJobOpening(input: unknown): Promise<ActionResult<{ id: string }>> {
  return runAction(async () => {
    await requireAdmin();
    const parsed = JobOpeningInput.safeParse(input);
    if (!parsed.success) {
      return fail("VALIDATION", "Datos inválidos", parsed.error.flatten().fieldErrors);
    }
    const created = await db.jobOpening.create({ data: parsed.data, select: { id: true } });
    revalidate(JOB_OPENINGS_TAG);
    return ok(created);
  });
}

export async function updateJobOpening(id: string, input: unknown): Promise<ActionResult> {
  return runAction(async () => {
    await requireAdmin();
    const parsed = JobOpeningInput.partial().safeParse(input);
    if (!parsed.success) {
      return fail("VALIDATION", "Datos inválidos", parsed.error.flatten().fieldErrors);
    }
    const exists = await db.jobOpening.findUnique({ where: { id } });
    if (!exists) return fail("NOT_FOUND");
    await db.jobOpening.update({ where: { id }, data: parsed.data });
    revalidate(JOB_OPENINGS_TAG);
    return ok(undefined);
  });
}

export async function deleteJobOpening(id: string): Promise<ActionResult> {
  return runAction(async () => {
    await requireAdmin();
    const exists = await db.jobOpening.findUnique({ where: { id } });
    if (!exists) return fail("NOT_FOUND");
    await db.jobOpening.delete({ where: { id } });
    revalidate(JOB_OPENINGS_TAG);
    return ok(undefined);
  });
}
