import type { ReactNode } from "react";
import { signOut } from "@/auth";
import AdminSidebar from "./AdminSidebar";

export default function AdminShell({
  user,
  children,
}: {
  user: { email: string };
  children: ReactNode;
}) {
  async function signOutAction() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  return (
    <div className="min-h-screen bg-[var(--color-petroleo-50)] text-[var(--color-petroleo)] admin-shell">
      <AdminSidebar user={user} signOutAction={signOutAction} />
      <main className="admin-main-area bg-[var(--color-petroleo-50)]">
        {children}
      </main>
    </div>
  );
}

export function PageDesktopOnlyHint() {
  return (
    <div className="lg:hidden mx-4 mt-4 rounded-xl bg-[var(--color-naranja)]/15 text-[var(--color-naranja-600)] px-4 py-3 text-sm">
      El admin está optimizado para pantallas grandes. Usá un escritorio para una
      mejor experiencia.
    </div>
  );
}
