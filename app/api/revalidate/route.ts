import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

type Body = { _type?: string };

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.SANITY_REVALIDATE_SECRET;
    const { body, isValidSignature } = await parseBody<Body>(
      req,
      secret,
      true
    );

    if (secret && !isValidSignature) {
      return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 401 });
    }
    if (!body?._type) {
      return NextResponse.json({ ok: false, error: "Missing _type" }, { status: 400 });
    }

    const tagMap: Record<string, string> = {
      profesional: "equipo",
      taller: "talleres",
      busqueda: "busquedas"
    };
    const tag = tagMap[body._type];
    if (tag) revalidateTag(tag);

    return NextResponse.json({ ok: true, revalidated: tag ?? null, type: body._type });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
