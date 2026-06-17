import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminRoot() {
  let homeId: string | null = null;
  try {
    const home = await db.page.findUnique({
      where: { slug: "home" },
      select: { id: true },
    });
    homeId = home?.id ?? null;
  } catch (err) {
    console.warn("[admin] could not resolve home page id:", err);
  }
  if (homeId) redirect(`/admin/pages/${homeId}`);
  redirect("/admin/pages");
}
