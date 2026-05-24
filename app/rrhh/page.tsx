import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import BusquedasActivas from "@/components/BusquedasActivas";
import RRHH from "@/components/RRHH";

export const metadata: Metadata = { title: "RR.HH. | CETIP" };

export default function Page() {
  return (
    <>
      <PageHero
        title="Sumate al equipo"
        subtitle="Buscamos profesionales con vocación, formación sólida y trabajo en equipo."
        image="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=70"
        crumbs={[{ href: "/rrhh", label: "RR.HH." }]}
      />
      <BusquedasActivas />
      <RRHH />
    </>
  );
}
