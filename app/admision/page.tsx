import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import AdmisionForm from "@/components/AdmisionForm";
import PageRenderer from "@/components/PageRenderer";

export const metadata: Metadata = { title: "Formulario de Admisión | CETIP" };

export default function Page() {
  return (
    <PageRenderer
      slug="admision"
      fallback={
        <>
          <PageHero
            title="Formulario de Admisión"
            subtitle="Completá tus datos para iniciar el proceso. Te contactaremos para coordinar una entrevista."
            crumbs={[{ href: "/admision", label: "Formulario de Admisión" }]}
          />
          <AdmisionForm />
        </>
      }
    />
  );
}
