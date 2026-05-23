import Hero from "@/components/Hero";
import QuienesSomos from "@/components/QuienesSomos";
import Equipo from "@/components/Equipo";
import Espacio from "@/components/Espacio";
import Servicios from "@/components/Servicios";
import ContactoForm from "@/components/ContactoForm";
import RRHH from "@/components/RRHH";
import Contacto from "@/components/Contacto";

export default function Home() {
  return (
    <>
      <Hero />
      <QuienesSomos />
      <Equipo />
      <Espacio />
      <Servicios />
      <ContactoForm />
      <RRHH />
      <Contacto />
    </>
  );
}
