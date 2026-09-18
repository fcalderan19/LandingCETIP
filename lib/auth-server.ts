import { auth } from "@/auth";
import { db } from "@/lib/db";

export class AuthError extends Error {
  code: "UNAUTHORIZED" | "FORBIDDEN";
  constructor(code: "UNAUTHORIZED" | "FORBIDDEN") {
    super(code);
    this.code = code;
  }
}

export type AdminSessionUser = {
  id: string;
  email: string;
};

async function devBypassUser(): Promise<AdminSessionUser | null> {
  if (
    process.env.NODE_ENV !== "development" ||
    process.env.ADMIN_DEV_BYPASS !== "1"
  ) {
    return null;
  }
  const email = (
    process.env.SEED_ADMIN_EMAIL ?? "facundo.calderan@globalesur.com"
  )
    .toLowerCase()
    .trim();
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { id: existing.id, email: existing.email };
  }
  const created = await db.user.create({
    data: { email, name: "Dev Admin", active: true },
  });
  return { id: created.id, email: created.email };
}

export async function requireAdmin(): Promise<AdminSessionUser> {
  const session = await auth();
  const user = session?.user as
    | { id?: string; email?: string | null }
    | undefined;
  if (!user?.id || !user.email) {
    const bypass = await devBypassUser();
    if (bypass) return bypass;
    throw new AuthError("UNAUTHORIZED");
  }
  // Re-check the DB on every call so revocations (row deleted or
  // active=false) take effect immediately — no waiting for session expiry.
  const row = await db.user.findUnique({
    where: { id: user.id },
    select: { email: true, active: true },
  });
  if (!row || !row.active) throw new AuthError("FORBIDDEN");
  return {
    id: user.id,
    email: row.email,
  };
}
