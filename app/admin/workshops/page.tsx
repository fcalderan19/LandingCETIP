import { db } from "@/lib/db";
import CollectionAdmin, { type ColumnDef } from "@/components/admin/CollectionAdmin";
import AdminContainer from "@/components/admin/AdminContainer";
import {
  createWorkshop,
  deleteWorkshop,
  updateWorkshop,
} from "@/app/admin/_actions/collections";

export const dynamic = "force-dynamic";

const columns: ColumnDef[] = [
  { name: "titulo", label: "Título", kind: "text", required: true },
  { name: "dia", label: "Día", kind: "text", required: true },
  { name: "horario", label: "Horario", kind: "text", required: true },
  { name: "destinatarios", label: "Destinatarios", kind: "text", required: true },
  { name: "descripcion", label: "Descripción", kind: "textarea", required: true },
  { name: "orden", label: "Orden", kind: "number" },
  { name: "visible", label: "Visible", kind: "boolean" },
];

const empty = {
  titulo: "",
  dia: "",
  horario: "",
  destinatarios: "",
  descripcion: "",
  orden: 0,
  visible: true,
};

export default async function WorkshopsRoute() {
  let items: Array<Record<string, unknown> & { id: string }> = [];
  let error: string | null = null;
  try {
    const rows = await db.workshop.findMany({
      orderBy: [{ orden: "asc" }, { titulo: "asc" }],
    });
    items = rows.map((r) => ({
      id: r.id,
      titulo: r.titulo,
      dia: r.dia,
      horario: r.horario,
      destinatarios: r.destinatarios,
      descripcion: r.descripcion,
      orden: r.orden,
      visible: r.visible,
    }));
  } catch (err) {
    error = err instanceof Error ? err.message : "DB no disponible";
  }

  if (error) {
    return (
      <AdminContainer>
        <h1 className="text-2xl font-bold">Talleres</h1>
        <p className="text-sm text-[var(--color-coral)] mt-3">{error}</p>
      </AdminContainer>
    );
  }

  return (
    <AdminContainer>
      <CollectionAdmin
        title="Talleres"
        description="Catálogo de talleres disponibles."
        columns={columns}
        items={items}
        empty={empty}
        onCreate={createWorkshop}
        onUpdate={updateWorkshop}
        onDelete={deleteWorkshop}
      />
    </AdminContainer>
  );
}
