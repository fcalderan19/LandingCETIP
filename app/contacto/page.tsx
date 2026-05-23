import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ContactoForm from "@/components/ContactoForm";
import Contacto from "@/components/Contacto";

export const metadata: Metadata = { title: "Contacto | CETIP" };

export default function Page() {
  return (
    <>
      <PageHero
        title="Contacto"
        subtitle="Escribinos por el formulario, WhatsApp, mail o vení a visitarnos."
        crumbs={[{ href: "/contacto", label: "Contacto" }]}
      />
      <Contacto />
      <ContactoForm />
    </>
  );
}
