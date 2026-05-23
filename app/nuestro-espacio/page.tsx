import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Espacio from "@/components/Espacio";

export const metadata: Metadata = { title: "Nuestro Espacio | CETIP" };

export default function Page() {
  return (
    <>
      <PageHero
        title="Nuestro Espacio"
        subtitle="Instalaciones pensadas para acompañar."
        crumbs={[{ href: "/nuestro-espacio", label: "Nuestro Espacio" }]}
      />
      <Espacio />
    </>
  );
}
