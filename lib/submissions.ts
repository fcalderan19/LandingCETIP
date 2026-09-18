import { z } from "zod";
import { db } from "@/lib/db";

export const SubmissionKindSchema = z.enum([
  "contacto",
  "admision",
  "rrhh",
  "otro",
]);
export type SubmissionKind = z.infer<typeof SubmissionKindSchema>;

export type SubmissionInput = {
  kind: SubmissionKind;
  pageSlug?: string;
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  attachments?: Array<{
    url: string;
    filename: string;
    size: number;
    mime: string;
  }>;
  meta?: Record<string, unknown>;
};

const MAX_MESSAGE = 8000;

function clip(s: unknown, max: number): string | undefined {
  if (typeof s !== "string") return undefined;
  const trimmed = s.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
}

export async function recordSubmission(input: SubmissionInput): Promise<{
  ok: boolean;
  id?: string;
  error?: string;
}> {
  try {
    const kind = SubmissionKindSchema.parse(input.kind);
    const row = await db.submission.create({
      data: {
        kind,
        pageSlug: clip(input.pageSlug, 240),
        name: clip(input.name, 200),
        email: clip(input.email, 200),
        phone: clip(input.phone, 60),
        subject: clip(input.subject, 240),
        message: clip(input.message, MAX_MESSAGE),
        attachments: input.attachments ?? undefined,
        meta: input.meta ?? undefined,
      },
      select: { id: true },
    });
    return { ok: true, id: row.id };
  } catch (err) {
    console.error("[submissions] recordSubmission failed:", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "unknown",
    };
  }
}
