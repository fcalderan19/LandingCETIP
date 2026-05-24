import { groq } from "next-sanity";

export const profesionalesQuery = groq`
  *[_type == "profesional"] | order(orden asc, nombre asc) {
    _id,
    nombre,
    rol,
    disciplina,
    descripcion,
    "fotoUrl": foto.asset->url
  }
`;

export const talleresQuery = groq`
  *[_type == "taller" && visible == true] | order(orden asc, titulo asc) {
    _id,
    titulo,
    dia,
    horario,
    destinatarios,
    descripcion
  }
`;

export const busquedasQuery = groq`
  *[_type == "busqueda" && activa == true] | order(orden asc, titulo asc) {
    _id,
    titulo,
    area,
    modalidad,
    jornada,
    descripcion
  }
`;
