"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-server";
import { fail, ok, revalidate, runAction, type ActionResult } from "@/lib/actions";
import { SITE_SETTINGS_TAG } from "@/lib/site-settings";

const SocialsSchema = z
  .record(z.string(), z.string())
  .refine(
    (v) => typeof v.instagram === "string" && typeof v.facebook === "string",
    { message: "Faltan claves instagram/facebook" },
  );

const SiteSettingsInput = z.object({
  name: z.string().min(1).max(80),
  fullName: z.string().min(1).max(200),
  tagline: z.string().min(1).max(280),
  description: z.string().min(1).max(800),
  address: z.string().min(1).max(300),
  phoneDisplay: z.string().min(1).max(80),
  phoneTel: z.string().min(1).max(80),
  whatsappNumber: z.string().min(1).max(40),
  whatsappMessage: z.string().min(1).max(400),
  email: z.string().email().max(200),
  hours: z.string().min(1).max(200),
  socials: SocialsSchema,
  mapsEmbed: z.string().min(1).max(1000),
});

export async function getSiteSettingsForEdit() {
  return runAction(async () => {
    await requireAdmin();
    const row = await db.siteSettings.findUnique({ where: { id: 1 } });
    if (!row) return fail("NOT_FOUND", "Falta seed de SiteSettings");
    return ok(row);
  });
}

export async function updateSiteSettings(
  input: unknown,
): Promise<ActionResult> {
  return runAction(async () => {
    await requireAdmin();
    const parsed = SiteSettingsInput.safeParse(input);
    if (!parsed.success) {
      return fail(
        "VALIDATION",
        "Datos inválidos",
        parsed.error.flatten().fieldErrors,
      );
    }
    await db.siteSettings.upsert({
      where: { id: 1 },
      create: { id: 1, ...parsed.data },
      update: parsed.data,
    });
    revalidate(SITE_SETTINGS_TAG);
    return ok(undefined);
  });
}
