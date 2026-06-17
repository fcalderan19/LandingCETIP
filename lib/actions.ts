import { revalidateTag } from "next/cache";
import { AuthError } from "./auth-server";

export type ActionErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION"
  | "CONFLICT"
  | "INTERNAL";

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | {
      ok: false;
      error: ActionErrorCode;
      message?: string;
      fieldErrors?: Record<string, string[]>;
    };

export function ok<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

export function fail(
  error: ActionErrorCode,
  message?: string,
  fieldErrors?: Record<string, string[]>,
): ActionResult<never> {
  return { ok: false, error, message, fieldErrors };
}

/** Wrap an action body, converting AuthError + thrown errors into ActionResult. */
export async function runAction<T>(
  fn: () => Promise<ActionResult<T>>,
): Promise<ActionResult<T>> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof AuthError) return fail(err.code);
    const message = err instanceof Error ? err.message : "unknown";
    console.error("[action] internal error:", err);
    return fail("INTERNAL", message);
  }
}

/** Revalidate one or more tags after a successful mutation. */
export function revalidate(...tags: string[]) {
  for (const t of tags) revalidateTag(t);
}
