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
      { href: "/programas-terapeuticos/cet", label: "CET" },
      { href: "/programas-terapeuticos/consultorios", label: "Consultorios Externos" },
      { href: "/programas-terapeuticos/talleres", label: "Talleres" }
    ]
  },
  { href: "/nuestro-espacio", label: "Nuestro Espacio" },
  { href: "/admision", label: "Formulario de Admisión" },
  { href: "/rrhh", label: "RR.HH." }
];
