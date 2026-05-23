import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import AdmisionForm from "@/components/AdmisionForm";

export const metadata: Metadata = { title: "Formulario de Admisión | CETIP" };

export default function Page() {
  return (
    <>
      <PageHero
        title="Formulario de Admisión"
        subtitle="Completá tus datos para iniciar el proceso. Te contactaremos para coordinar una entrevista."
        crumbs={[{ href: "/admision", label: "Formulario de Admisión" }]}
      />
      <AdmisionForm />
    </>
  );
}
