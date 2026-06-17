import { auth } from "@/auth";

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
  role: string;
};

export async function requireAdmin(): Promise<AdminSessionUser> {
  const session = await auth();
  const user = session?.user as
    | { id?: string; email?: string | null; role?: string }
    | undefined;
  if (!user?.id || !user.email) throw new AuthError("UNAUTHORIZED");
  if ((user.role ?? "admin") !== "admin") throw new AuthError("FORBIDDEN");
  return {
    id: user.id,
    email: user.email,
    role: user.role ?? "admin",
  };
}
