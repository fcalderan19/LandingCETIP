export type NavItem = {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
};

export const nav: NavItem[] = [
  { href: "/", label: "Inicio" },
  { href: "/quienes-somos", label: "Quiénes Somos" },
  { href: "/equipo", label: "Nuestro Equipo" },
  { href: "/nuestro-espacio", label: "Nuestro Espacio" },
  {
    href: "/servicios",
    label: "Servicios",
    children: [
      { href: "/servicios/cet", label: "CET" },
      { href: "/servicios/consultorios", label: "Consultorios Externos" },
      { href: "/servicios/talleres", label: "Talleres" }
    ]
  },
  { href: "/rrhh", label: "RR.HH." },
  { href: "/contacto", label: "Contacto" }
];
