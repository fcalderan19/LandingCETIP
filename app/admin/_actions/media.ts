"use server";

import { z } from "zod";
import { put, del } from "@vercel/blob";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-server";
import { fail, ok, runAction, type ActionResult } from "@/lib/actions";

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
]);

const ALLOWED_EXT = /\.(jpe?g|png|webp|avif|gif|svg)$/i;

const UploadInput = z.object({
  filename: z
    .string()
    .min(1)
    .max(240)
    .regex(ALLOWED_EXT, { message: "Extensión no permitida" }),
  mime: z.string().refine((m) => ALLOWED_MIME.has(m), {
    message: "Mime type no permitido — solo imágenes",
  }),
  size: z.number().int().min(1).max(20 * 1024 * 1024), // 20 MB cap
  data: z.string().min(1), // base64 (data:...;base64,XXX)
  width: z.number().int().min(1).max(20000).optional(),
  height: z.number().int().min(1).max(20000).optional(),
  alt: z.string().max(200).optional(),
});

function safePathname(filename: string): string {
  const ts = Date.now();
  const cleaned = filename
    .toLowerCase()
    .replace(/[^\w.\-]+/g, "_")
    .slice(0, 100);
  return `media/${ts}-${cleaned}`;
}

function decodeDataUrl(dataUrl: string): Buffer | null {
  const idx = dataUrl.indexOf(",");
  if (idx === -1) return null;
  try {
    return Buffer.from(dataUrl.slice(idx + 1), "base64");
  } catch {
    return null;
  }
}

export async function uploadMediaAsset(
  input: unknown,
): Promise<
  ActionResult<{
    id: string;
    url: string;
    alt: string | null;
  }>
> {
  return runAction(async () => {
    const admin = await requireAdmin();
    const parsed = UploadInput.safeParse(input);
    if (!parsed.success) {
      return fail("VALIDATION", "Datos inválidos", parsed.error.flatten().fieldErrors);
    }

    const bytes = decodeDataUrl(parsed.data.data);
    if (!bytes) return fail("VALIDATION", "data inválida (esperado data URL)");

    const pathname = safePathname(parsed.data.filename);
    const uploaded = await put(pathname, bytes, {
      access: "public",
      contentType: parsed.data.mime,
    });

    const asset = await db.mediaAsset.create({
      data: {
        url: uploaded.url,
        pathname,
        size: parsed.data.size,
        mime: parsed.data.mime,
        width: parsed.data.width,
        height: parsed.data.height,
        alt: parsed.data.alt,
        uploadedBy: admin.id,
      },
      select: { id: true, url: true, alt: true },
    });

    return ok(asset);
  });
}

export async function updateAssetAlt(
  id: string,
  alt: string,
): Promise<ActionResult> {
  return runAction(async () => {
    await requireAdmin();
    const a = await db.mediaAsset.findUnique({ where: { id } });
    if (!a) return fail("NOT_FOUND");
    await db.mediaAsset.update({ where: { id }, data: { alt } });
    return ok(undefined);
  });
}

export async function deleteAsset(id: string): Promise<ActionResult> {
  return runAction(async () => {
    await requireAdmin();
    const asset = await db.mediaAsset.findUnique({ where: { id } });
    if (!asset) return fail("NOT_FOUND");

    // Best-effort blob delete; fall through if it 404s.
    try {
      await del(asset.url);
    } catch (err) {
      console.warn("[media] blob delete failed:", err);
    }
    await db.mediaAsset.delete({ where: { id } });
    return ok(undefined);
  });
}

export async function listMediaAssets(): Promise<
  ActionResult<
    Array<{
      id: string;
      url: string;
      alt: string | null;
      mime: string;
      size: number;
      width: number | null;
      height: number | null;
      createdAt: Date;
    }>
  >
> {
  return runAction(async () => {
    await requireAdmin();
    const rows = await db.mediaAsset.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return ok(
      rows.map((r) => ({
        id: r.id,
        url: r.url,
        alt: r.alt,
        mime: r.mime,
        size: r.size,
        width: r.width,
        height: r.height,
        createdAt: r.createdAt,
      })),
    );
  });
}
