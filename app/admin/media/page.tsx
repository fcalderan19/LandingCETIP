import MediaLibrary from "@/components/admin/MediaLibrary";
import AdminContainer from "@/components/admin/AdminContainer";
import { listMediaAssets } from "@/app/admin/_actions/media";

export const dynamic = "force-dynamic";

export default async function MediaRoute() {
  const res = await listMediaAssets();
  if (!res.ok) {
    return (
      <AdminContainer>
        <h1 className="text-2xl font-bold">Media</h1>
        <p className="text-sm text-[var(--color-coral)] mt-3">
          Error: {res.message ?? res.error}
        </p>
      </AdminContainer>
    );
  }
  return (
    <AdminContainer>
      <MediaLibrary initial={res.data} />
    </AdminContainer>
  );
}
