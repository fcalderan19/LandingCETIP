import { sanityFetch } from "@/sanity/lib/client";
import { profesionalesQuery } from "@/sanity/lib/queries";
import EquipoClient, { type Profesional } from "./EquipoClient";

const fallback: Profesional[] = [
  { nombre: "Lic. María González", rol: "Coordinadora — Psicóloga", disciplina: "Psicología", fotoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=70" },
  { nombre: "Lic. Juan Pérez", rol: "Fonoaudiólogo", disciplina: "Fonoaudiología", fotoUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=70" },
  { nombre: "Lic. Camila Ríos", rol: "Terapeuta Ocupacional", disciplina: "Terapia Ocupacional", fotoUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=70" },
  { nombre: "Lic. Sofía Méndez", rol: "Psicopedagoga", disciplina: "Psicopedagogía", fotoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=70" },
  { nombre: "Lic. Diego Torres", rol: "Psicólogo Infantil", disciplina: "Psicología", fotoUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=70" },
  { nombre: "Lic. Paula Bravo", rol: "Fonoaudióloga", disciplina: "Fonoaudiología", fotoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=70" }
];

export default async function Equipo() {
  const data = await sanityFetch<Profesional[]>({
    query: profesionalesQuery,
    tags: ["equipo"],
    fallback
  });
  return <EquipoClient data={data} />;
}
