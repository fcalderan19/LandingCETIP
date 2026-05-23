import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const fd = await req.formData().catch(() => null);
  if (!fd) return NextResponse.json({ ok: false }, { status: 400 });
  const summary: Record<string, string> = {};
  for (const [k, v] of fd.entries()) {
    summary[k] = v instanceof File ? `${v.name} (${v.size}B)` : String(v);
  }
  console.log("[rrhh]", summary);
  return NextResponse.json({ ok: true });
}
