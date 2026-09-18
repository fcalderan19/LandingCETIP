import { listSubmissions } from "@/app/admin/_actions/submissions";
import AdminContainer from "@/components/admin/AdminContainer";
import MensajesClient from "@/components/admin/MensajesClient";

export const dynamic = "force-dynamic";

export default async function MensajesPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string; archived?: string }>;
}) {
  const sp = await searchParams;
  const showArchived = sp.archived === "1";
  const kind = sp.kind && sp.kind !== "todos" ? sp.kind : undefined;
  const res = await listSubmissions({ kind, showArchived });

  if (!res.ok) {
    return (
      <AdminContainer>
        <h1 className="text-2xl font-bold">Buzón de mensajes</h1>
        <p className="mt-3 text-sm text-[var(--color-coral)]">
          Error cargando mensajes: {res.error}
        </p>
      </AdminContainer>
    );
  }

  return (
    <MensajesClient
      initialItems={res.data.items}
      activeKinds={res.data.activeKinds}
      totalUnread={res.data.totalUnread}
      currentKind={kind ?? "todos"}
      showArchived={showArchived}
    />
  );
}
