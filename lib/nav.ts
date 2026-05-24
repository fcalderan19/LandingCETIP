export type NavItem = {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
};

export const nav: NavItem[] = [
  { href: "/", label: "Inicio" },
  { href: "/quienes-somos", label: "Quiénes Somos" },
  {
    href: "/programas-terapeuticos",
    label: "Programas Terapéuticos",
    children: [
      { href: "/programas-terapeuticos/cet", label: "Centro Educativo Terapéutico" },
      { href: "/programas-terapeuticos/consultorios", label: "Tratamiento en Consultorios Externos" },
      { href: "/programas-terapeuticos/talleres", label: "Talleres" },
      { href: "/programas-terapeuticos/evaluaciones-diagnosticas", label: "Evaluaciones Diagnósticas" }
    ]
  },
  { href: "/nuestro-espacio", label: "Nuestro Espacio" },
  { href: "/admision", label: "Formulario de Admisión" },
  { href: "/rrhh", label: "RR.HH." }
];
