import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

const KNOWN_TAG_PREFIXES = ["page:", "site-settings", "professionals", "workshops", "job-openings"];

function isAllowedTag(tag: string) {
  return KNOWN_TAG_PREFIXES.some((p) => tag === p || tag.startsWith(p));
}

function secretsMatch(expected: string, received: string | null): boolean {
  if (!received) return false;
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(received, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "REVALIDATE_SECRET not set" },
      { status: 500 },
    );
  }
  if (!secretsMatch(secret, req.headers.get("x-revalidate-secret"))) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const tags = Array.isArray((body as { tags?: unknown })?.tags)
    ? ((body as { tags: unknown[] }).tags.filter(
        (t): t is string => typeof t === "string",
      ))
    : [];
  if (tags.length === 0) {
    return NextResponse.json({ ok: false, error: "Missing tags[]" }, { status: 400 });
  }

  const accepted: string[] = [];
  const rejected: string[] = [];
  for (const tag of tags) {
    if (isAllowedTag(tag)) {
      revalidateTag(tag);
      accepted.push(tag);
    } else {
      rejected.push(tag);
    }
  }
  return NextResponse.json({ ok: true, accepted, rejected });
}
