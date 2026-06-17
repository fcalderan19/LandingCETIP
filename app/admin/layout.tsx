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
  const email = session?.user?.email;
  const role = (session?.user as { role?: string } | undefined)?.role ?? "admin";

  if (isPublic) {
    // Login routes render without the admin chrome.
    return <>{children}</>;
  }

  // Real auth check (middleware only verified cookie presence).
  if (!email) {
    redirect(`/admin/login?callbackUrl=${encodeURIComponent(pathname || "/admin")}`);
  }
  if (role !== "admin") {
    redirect("/admin/login?error=forbidden");
  }

  return (
    <>
      <PageDesktopOnlyHint />
      <AdminShell user={{ email }}>{children}</AdminShell>
    </>
  );
}
