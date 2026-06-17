import { getProfessionals } from "@/lib/collections";
import EquipoClient, { type Profesional } from "@/components/EquipoClient";
import type { TeamListProps } from "./schema";

export default async function TeamListRender(_props: TeamListProps) {
  // Header (eyebrow/title) lo provee EquipoClient internamente hoy.
  // El admin lo expone para futuras versiones; v1 lo ignora salvo override
  // en EquipoClient (que también es un refactor menor a futuro).
  const items = await getProfessionals();
  const data: Profesional[] = items.map((p) => ({
    _id: p.id,
    nombre: p.nombre,
    rol: p.rol,
    disciplina: p.disciplina,
    fotoUrl: p.fotoUrl ?? undefined,
  }));
  return <EquipoClient data={data} />;
}
