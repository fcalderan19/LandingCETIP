import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Equipo from "@/components/Equipo";

export const metadata: Metadata = { title: "Nuestro Equipo | CETIP" };

export default function Page() {
  return (
    <>
      <PageHero
        title="Nuestro Equipo"
        subtitle="Profesionales formados, comprometidos y cercanos."
        crumbs={[{ href: "/equipo", label: "Nuestro Equipo" }]}
      />
      <Equipo />
    </>
  );
}
