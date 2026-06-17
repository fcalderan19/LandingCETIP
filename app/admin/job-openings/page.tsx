import { db } from "@/lib/db";
import CollectionAdmin, { type ColumnDef } from "@/components/admin/CollectionAdmin";
import AdminContainer from "@/components/admin/AdminContainer";
import {
  createJobOpening,
  deleteJobOpening,
  updateJobOpening,
} from "@/app/admin/_actions/collections";

export const dynamic = "force-dynamic";

const columns: ColumnDef[] = [
  { name: "titulo", label: "Título", kind: "text", required: true },
  { name: "area", label: "Área", kind: "text", required: true },
  { name: "modalidad", label: "Modalidad", kind: "text", required: true },
  { name: "jornada", label: "Jornada", kind: "text", required: true },
  { name: "descripcion", label: "Descripción", kind: "textarea", required: true },
  { name: "orden", label: "Orden", kind: "number" },
  { name: "activa", label: "Activa", kind: "boolean" },
];

const empty = {
  titulo: "",
  area: "",
  modalidad: "Presencial",
  jornada: "",
  descripcion: "",
  orden: 0,
  activa: true,
};

export default async function JobOpeningsRoute() {
  let items: Array<Record<string, unknown> & { id: string }> = [];
  let error: string | null = null;
  try {
    const rows = await db.jobOpening.findMany({
      orderBy: [{ orden: "asc" }, { titulo: "asc" }],
    });
    items = rows.map((r) => ({
      id: r.id,
      titulo: r.titulo,
      area: r.area,
      modalidad: r.modalidad,
      jornada: r.jornada,
      descripcion: r.descripcion,
      orden: r.orden,
      activa: r.activa,
    }));
  } catch (err) {
    error = err instanceof Error ? err.message : "DB no disponible";
  }

  if (error) {
    return (
      <AdminContainer>
        <h1 className="text-2xl font-bold">Búsquedas activas</h1>
        <p className="text-sm text-[var(--color-coral)] mt-3">{error}</p>
      </AdminContainer>
    );
  }

  return (
    <AdminContainer>
      <CollectionAdmin
        title="Búsquedas activas"
        description="Búsquedas laborales que se publican en RR.HH."
        columns={columns}
        items={items}
        empty={empty}
        onCreate={createJobOpening}
        onUpdate={updateJobOpening}
        onDelete={deleteJobOpening}
      />
    </AdminContainer>
  );
}
