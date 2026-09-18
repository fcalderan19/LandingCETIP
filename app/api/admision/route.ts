import { NextResponse } from "next/server";
import { z } from "zod";
import { recordSubmission } from "@/lib/submissions";

const Body = z
  .object({
    name: z.string().max(200).optional(),
    nombre: z.string().max(200).optional(),
    email: z.string().email().max(200).optional(),
    phone: z.string().max(60).optional(),
    telefono: z.string().max(60).optional(),
    subject: z.string().max(240).optional(),
    asunto: z.string().max(240).optional(),
    message: z.string().max(8000).optional(),
    mensaje: z.string().max(8000).optional(),
  })
  .passthrough();

export async function POST(req: Request) {
  const raw = await req.json().catch(() => null);
  if (!raw) return NextResponse.json({ ok: false }, { status: 400 });
  const parsed = Body.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const d = parsed.data as Record<string, unknown>;
  const ua = req.headers.get("user-agent") ?? undefined;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    undefined;
  const saved = await recordSubmission({
    kind: "admision",
    pageSlug: "admision",
    name: (d.name ?? d.nombre) as string | undefined,
    email: d.email as string | undefined,
    phone: (d.phone ?? d.telefono) as string | undefined,
    subject: (d.subject ?? d.asunto) as string | undefined,
    message: (d.message ?? d.mensaje) as string | undefined,
    meta: { ua, ip, raw: d },
  });
  if (!saved.ok) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
