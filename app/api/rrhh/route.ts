import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { recordSubmission } from "@/lib/submissions";

const ALLOWED_CV_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const MAX_CV_BYTES = 10 * 1024 * 1024;

function safeName(name: string): string {
  return name.toLowerCase().replace(/[^\w.\-]+/g, "_").slice(0, 100);
}

export async function POST(req: Request) {
  const fd = await req.formData().catch(() => null);
  if (!fd) return NextResponse.json({ ok: false }, { status: 400 });

  const fields: Record<string, string> = {};
  const attachments: Array<{
    url: string;
    filename: string;
    size: number;
    mime: string;
  }> = [];

  for (const [k, v] of fd.entries()) {
    if (v instanceof File) {
      if (v.size === 0) continue;
      if (v.size > MAX_CV_BYTES) {
        return NextResponse.json(
          { ok: false, error: "El archivo supera 10 MB." },
          { status: 400 },
        );
      }
      if (!ALLOWED_CV_MIME.has(v.type)) {
        return NextResponse.json(
          { ok: false, error: "Formato no permitido (usá PDF o DOC/DOCX)." },
          { status: 400 },
        );
      }
      const pathname = `cv/${Date.now()}-${safeName(v.name)}`;
      try {
        const bytes = Buffer.from(await v.arrayBuffer());
        const uploaded = await put(pathname, bytes, {
          access: "public",
          contentType: v.type,
        });
        attachments.push({
          url: uploaded.url,
          filename: v.name,
          size: v.size,
          mime: v.type,
        });
      } catch (err) {
        // Blob not configured (dev) — record submission but flag it.
        console.warn("[rrhh] blob upload failed, recording metadata only:", err);
        attachments.push({
          url: "",
          filename: v.name,
          size: v.size,
          mime: v.type,
        });
      }
    } else {
      fields[k] = String(v).slice(0, 8000);
    }
  }

  const ua = req.headers.get("user-agent") ?? undefined;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    undefined;

  const saved = await recordSubmission({
    kind: "rrhh",
    pageSlug: "rrhh",
    name: fields.name ?? fields.nombre,
    email: fields.email,
    phone: fields.phone ?? fields.telefono,
    subject: fields.subject ?? fields.puesto ?? fields.area,
    message: fields.message ?? fields.mensaje ?? fields.comentarios,
    attachments,
    meta: { ua, ip, fields },
  });
  if (!saved.ok) return NextResponse.json({ ok: false }, { status: 500 });
  return NextResponse.json({ ok: true });
}
