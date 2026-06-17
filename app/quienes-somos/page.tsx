import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import QuienesSomos from "@/components/QuienesSomos";
import Equipo from "@/components/Equipo";
import FeaturedStrip from "@/components/FeaturedStrip";
import PageRenderer from "@/components/PageRenderer";

export const metadata: Metadata = { title: "Quiénes Somos | CETIP" };

export default function Page() {
  return (
    <PageRenderer
      slug="quienes-somos"
      fallback={
        <>
          <PageHero
            title="Quiénes Somos"
            subtitle="Un espacio integral pensado para cada trayectoria."
            crumbs={[{ href: "/quienes-somos", label: "Quiénes Somos" }]}
          />
          <QuienesSomos />
          <Equipo />
          <FeaturedStrip />
        </>
      }
    />
  );
}
