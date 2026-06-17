import { PrismaClient } from "@prisma/client";
import { site } from "../lib/site";

const db = new PrismaClient();

const ADMIN_EMAIL =
  process.env.SEED_ADMIN_EMAIL ?? "facundo.calderan@globalesur.com";

async function main() {
  // Whitelist mínima para Auth.js
  await db.allowedEmail.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: { email: ADMIN_EMAIL },
  });

  // Settings — refleja lib/site.ts (single source of truth actual)
  await db.siteSettings.upsert({
    where: { id: 1 },
    update: {
      name: site.name,
      fullName: site.fullName,
      tagline: site.tagline,
      description: site.description,
      address: site.address,
      phoneDisplay: site.phoneDisplay,
      phoneTel: site.phoneTel,
      whatsappNumber: site.whatsappNumber,
      whatsappMessage: site.whatsappMessage,
      email: site.email,
      hours: site.hours,
      socials: site.socials,
      mapsEmbed: site.mapsEmbed,
    },
    create: {
      id: 1,
      name: site.name,
      fullName: site.fullName,
      tagline: site.tagline,
      description: site.description,
      address: site.address,
      phoneDisplay: site.phoneDisplay,
      phoneTel: site.phoneTel,
      whatsappNumber: site.whatsappNumber,
      whatsappMessage: site.whatsappMessage,
      email: site.email,
      hours: site.hours,
      socials: site.socials,
      mapsEmbed: site.mapsEmbed,
    },
  });

  // Pages base (slugs alineados con las rutas existentes)
  const pages: Array<{ slug: string; title: string }> = [
    { slug: "home", title: "Inicio" },
    { slug: "quienes-somos", title: "Quiénes Somos" },
    { slug: "nuestro-espacio", title: "Nuestro Espacio" },
    { slug: "programas-terapeuticos", title: "Programas Terapéuticos" },
    { slug: "programas-terapeuticos/cet", title: "Programa CET" },
    { slug: "programas-terapeuticos/consultorios", title: "Consultorios" },
    { slug: "programas-terapeuticos/talleres", title: "Talleres" },
    {
      slug: "programas-terapeuticos/evaluaciones-diagnosticas",
      title: "Evaluaciones diagnósticas",
    },
    { slug: "admision", title: "Admisión" },
    { slug: "contacto", title: "Contacto" },
    { slug: "rrhh", title: "RR.HH." },
  ];

  for (const p of pages) {
    await db.page.upsert({
      where: { slug: p.slug },
      update: {},
      create: { slug: p.slug, title: p.title },
    });
  }

  console.log(
    `Seed OK — ${pages.length} pages, settings, whitelist (${ADMIN_EMAIL}).`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
