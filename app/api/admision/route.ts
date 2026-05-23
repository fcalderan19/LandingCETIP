import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json().catch(() => null);
  if (!data) return NextResponse.json({ ok: false }, { status: 400 });
  console.log("[admision]", data);
  return NextResponse.json({ ok: true });
}
