import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import QuienesSomos from "@/components/QuienesSomos";
import FeaturedStrip from "@/components/FeaturedStrip";

export const metadata: Metadata = { title: "Quiénes Somos | CETIP" };

export default function Page() {
  return (
    <>
      <PageHero
        title="Quiénes Somos"
        subtitle="Un espacio integral pensado para cada trayectoria."
        crumbs={[{ href: "/quienes-somos", label: "Quiénes Somos" }]}
      />
      <QuienesSomos />
      <FeaturedStrip />
    </>
  );
}
