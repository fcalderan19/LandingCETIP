import { unstable_cache } from "next/cache";
import { db } from "./db";

export type ProfessionalItem = {
  id: string;
  nombre: string;
  rol: string;
  disciplina: string;
  fotoUrl: string | null;
};

export type WorkshopItem = {
  id: string;
  titulo: string;
  dia: string;
  horario: string;
  destinatarios: string;
  descripcion: string;
};

export type JobOpeningItem = {
  id: string;
  titulo: string;
  area: string;
  modalidad: string;
  jornada: string;
  descripcion: string;
};

export const PROFESSIONALS_TAG = "professionals";
export const WORKSHOPS_TAG = "workshops";
export const JOB_OPENINGS_TAG = "job-openings";

const professionalsFallback: ProfessionalItem[] = [
  { id: "f1", nombre: "Lic. María González", rol: "Coordinadora — Psicóloga", disciplina: "Psicología", fotoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=70" },
  { id: "f2", nombre: "Lic. Juan Pérez", rol: "Fonoaudiólogo", disciplina: "Fonoaudiología", fotoUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=70" },
  { id: "f3", nombre: "Lic. Camila Ríos", rol: "Terapeuta Ocupacional", disciplina: "Terapia Ocupacional", fotoUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=70" },
  { id: "f4", nombre: "Lic. Sofía Méndez", rol: "Psicopedagoga", disciplina: "Psicopedagogía", fotoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=70" },
  { id: "f5", nombre: "Lic. Diego Torres", rol: "Psicólogo Infantil", disciplina: "Psicología", fotoUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=70" },
  { id: "f6", nombre: "Lic. Paula Bravo", rol: "Fonoaudióloga", disciplina: "Fonoaudiología", fotoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=70" },
];

const jobOpeningsFallback: JobOpeningItem[] = [
  { id: "f1", titulo: "Fonoaudióloga/o", area: "Tratamiento en Consultorios Externos", modalidad: "Presencial", jornada: "Tarde", descripcion: "Para sumarse al equipo de tratamientos individuales con niños y adolescentes." },
  { id: "f2", titulo: "Orientador/a de Sala", area: "Centro Educativo Terapéutico", modalidad: "Presencial", jornada: "Jornada completa", descripcion: "Acompañamiento educativo-terapéutico en sala con adolescentes y adultos jóvenes." },
  { id: "f3", titulo: "Psicólogo/a Infantil", area: "Tratamiento en Consultorios Externos", modalidad: "Presencial", jornada: "Mañana", descripcion: "Atención clínica individual a niños de 6 a 12 años. Experiencia en TEA deseable." },
];

async function loadProfessionals(): Promise<ProfessionalItem[]> {
  try {
    const rows = await db.professional.findMany({
      where: { visible: true },
      orderBy: [{ orden: "asc" }, { nombre: "asc" }],
      include: { fotoAsset: true },
    });
    if (rows.length === 0) return professionalsFallback;
    return rows.map((r) => ({
      id: r.id,
      nombre: r.nombre,
      rol: r.rol,
      disciplina: r.disciplina,
      fotoUrl: r.fotoAsset?.url ?? null,
    }));
  } catch (err) {
    console.warn("[collections] professionals fallback:", err);
    return professionalsFallback;
  }
}

async function loadJobOpenings(): Promise<JobOpeningItem[]> {
  try {
    const rows = await db.jobOpening.findMany({
      where: { activa: true },
      orderBy: [{ orden: "asc" }, { titulo: "asc" }],
    });
    if (rows.length === 0) return jobOpeningsFallback;
    return rows.map((r) => ({
      id: r.id,
      titulo: r.titulo,
      area: r.area,
      modalidad: r.modalidad,
      jornada: r.jornada,
      descripcion: r.descripcion,
    }));
  } catch (err) {
    console.warn("[collections] job openings fallback:", err);
    return jobOpeningsFallback;
  }
}

async function loadWorkshops(): Promise<WorkshopItem[]> {
  try {
    const rows = await db.workshop.findMany({
      where: { visible: true },
      orderBy: [{ orden: "asc" }, { titulo: "asc" }],
    });
    return rows.map((r) => ({
      id: r.id,
      titulo: r.titulo,
      dia: r.dia,
      horario: r.horario,
      destinatarios: r.destinatarios,
      descripcion: r.descripcion,
    }));
  } catch (err) {
    console.warn("[collections] workshops fallback:", err);
    return [];
  }
}

export const getProfessionals = unstable_cache(
  loadProfessionals,
  ["professionals"],
  { tags: [PROFESSIONALS_TAG] },
);

export const getJobOpenings = unstable_cache(
  loadJobOpenings,
  ["job-openings"],
  { tags: [JOB_OPENINGS_TAG] },
);

export const getWorkshops = unstable_cache(loadWorkshops, ["workshops"], {
  tags: [WORKSHOPS_TAG],
});
