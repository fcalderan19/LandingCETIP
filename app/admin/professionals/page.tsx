import { db } from "@/lib/db";
import CollectionAdmin, { type ColumnDef } from "@/components/admin/CollectionAdmin";
import AdminContainer from "@/components/admin/AdminContainer";
import {
  createProfessional,
  deleteProfessional,
  updateProfessional,
} from "@/app/admin/_actions/collections";

export const dynamic = "force-dynamic";

const columns: ColumnDef[] = [
  { name: "nombre", label: "Nombre", kind: "text", required: true },
  { name: "rol", label: "Rol", kind: "text", required: true },
  { name: "disciplina", label: "Disciplina", kind: "text", required: true },
  { name: "descripcion", label: "Descripción", kind: "textarea" },
  { name: "fotoAssetId", label: "ID Asset foto (de /admin/media)", kind: "text" },
  { name: "orden", label: "Orden", kind: "number" },
  { name: "visible", label: "Visible", kind: "boolean" },
];

const empty = {
  nombre: "",
  rol: "",
  disciplina: "",
  descripcion: "",
  fotoAssetId: "",
  orden: 0,
  visible: true,
};

export default async function ProfessionalsRoute() {
  let items: Array<Record<string, unknown> & { id: string }> = [];
  let error: string | null = null;
  try {
    const rows = await db.professional.findMany({
      orderBy: [{ orden: "asc" }, { nombre: "asc" }],
    });
    items = rows.map((r) => ({
      id: r.id,
      nombre: r.nombre,
      rol: r.rol,
      disciplina: r.disciplina,
      descripcion: r.descripcion ?? "",
      fotoAssetId: r.fotoAssetId ?? "",
      orden: r.orden,
      visible: r.visible,
    }));
  } catch (err) {
    error = err instanceof Error ? err.message : "DB no disponible";
  }

  if (error) {
    return (
      <AdminContainer>
        <h1 className="text-2xl font-bold">Equipo</h1>
        <p className="text-sm text-[var(--color-coral)] mt-3">{error}</p>
      </AdminContainer>
    );
  }

  return (
    <AdminContainer>
      <CollectionAdmin
        title="Equipo"
        description="Profesionales que aparecen en la sección Equipo."
        columns={columns}
        items={items}
        empty={empty}
        onCreate={createProfessional}
        onUpdate={updateProfessional}
        onDelete={deleteProfessional}
      />
    </AdminContainer>
  );
}
