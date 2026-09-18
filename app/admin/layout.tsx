import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminShell, { PageDesktopOnlyHint } from "@/components/admin/AdminShell";

export const metadata = { title: "Admin · CETIP" };

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login", "/admin/login/verify"]);

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "";
  const isPublic = PUBLIC_ADMIN_PATHS.has(pathname);

  const session = await auth();
  // A valid admin session has both an email and a non-empty user id. The
  // auth.session callback zeroes out `id` when the user was deactivated
  // mid-session, so relying on it is our "still active?" check here.
  let email = session?.user?.email;
  const sessionUserId = (session?.user as { id?: string } | undefined)?.id ?? "";

  // Dev-only bypass — matches middleware + requireAdmin().
  if (
    !email &&
    process.env.NODE_ENV === "development" &&
    (process.env.ADMIN_DEV_BYPASS === "1" ||
      process.env.NEXT_PUBLIC_ADMIN_DEV_BYPASS === "1")
  ) {
    email = process.env.SEED_ADMIN_EMAIL ?? "facundo.calderan@globalesur.com";
  }

  if (isPublic) {
    // Login routes render without the admin chrome.
    return <>{children}</>;
  }

  if (!email) {
    redirect(`/admin/login?callbackUrl=${encodeURIComponent(pathname || "/admin")}`);
  }
  if (!sessionUserId && !(process.env.NODE_ENV === "development" && process.env.ADMIN_DEV_BYPASS === "1")) {
    // Session exists but user was deactivated — force back to login.
    redirect("/admin/login?error=forbidden");
  }

  return (
    <>
      <PageDesktopOnlyHint />
      <AdminShell user={{ email }}>{children}</AdminShell>
    </>
  );
}
