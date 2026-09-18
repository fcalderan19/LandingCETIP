import { PrismaClient } from "@prisma/client";
import { site } from "../lib/site";
import { registry } from "../lib/sections";

const db = new PrismaClient();

const ADMIN_EMAIL = (
  process.env.SEED_ADMIN_EMAIL ?? "facundo.calderan@globalesur.com"
)
  .toLowerCase()
  .trim();

type SectionSeed = {
  type: keyof typeof registry;
  // Partial override on top of the section defaults.
  data?: Record<string, unknown>;
};

type PageSeed = {
  slug: string;
  title: string;
  sections: SectionSeed[];
};

const PAGES: PageSeed[] = [
  {
    slug: "home",
    title: "Inicio",
    sections: [
      { type: "hero_slider" },
      { type: "service_grid" },
      { type: "about_preview" },
      { type: "featured_strip" },
    ],
  },
  {
    slug: "quienes-somos",
    title: "Quiénes Somos",
    sections: [
      {
        type: "page_hero",
        data: {
          title: "Quiénes Somos",
          subtitle: "Un espacio integral pensado para cada trayectoria.",
          crumbs: [{ href: "/quienes-somos", label: "Quiénes Somos" }],
        },
      },
      { type: "quienes_somos" },
      { type: "team_list" },
      { type: "featured_strip" },
    ],
  },
  {
    slug: "nuestro-espacio",
    title: "Nuestro Espacio",
    sections: [
      {
        type: "page_hero",
        data: {
          title: "Nuestro Espacio",
          subtitle: "Instalaciones pensadas para acompañar.",
          crumbs: [{ href: "/nuestro-espacio", label: "Nuestro Espacio" }],
        },
      },
      { type: "espacio" },
    ],
  },
  {
    slug: "contacto",
    title: "Contacto",
    sections: [
      {
        type: "page_hero",
        data: {
          title: "Contacto",
          subtitle:
            "Escribinos por el formulario, WhatsApp, mail o vení a visitarnos.",
          crumbs: [{ href: "/contacto", label: "Contacto" }],
        },
      },
      { type: "contacto" },
    ],
  },
  {
    slug: "admision",
    title: "Formulario de Admisión",
    sections: [
      {
        type: "page_hero",
        data: {
          title: "Formulario de Admisión",
          subtitle:
            "Completá tus datos para iniciar el proceso. Te contactaremos para coordinar una entrevista.",
          crumbs: [
            { href: "/admision", label: "Formulario de Admisión" },
          ],
        },
      },
      {
        type: "custom_block",
        data: {
          container: "medium",
          background: "white",
          spacing: "medium",
          elements: [
            {
              id: "adm-h",
              kind: "heading_2",
              text: "Antes de completar el formulario",
              align: "left",
            },
            {
              id: "adm-p",
              kind: "paragraph",
              text:
                "El proceso de admisión nos permite conocerte y proponer el mejor recorrido para vos o para tu familia. Una vez recibida tu solicitud, te contactamos para coordinar una primera entrevista.",
              align: "left",
            },
            {
              id: "adm-btn",
              kind: "button",
              text: "Escribinos por WhatsApp",
              href: `https://wa.me/${site.whatsappNumber}`,
              variant: "primary",
              align: "left",
            },
          ],
        },
      },
    ],
  },
  {
    slug: "rrhh",
    title: "RR.HH.",
    sections: [
      {
        type: "page_hero",
        data: {
          title: "Sumate al equipo",
          subtitle:
            "Buscamos profesionales con vocación, formación sólida y trabajo en equipo.",
          image:
            "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=70",
          crumbs: [{ href: "/rrhh", label: "RR.HH." }],
        },
      },
      { type: "job_openings_list" },
      { type: "rrhh" },
    ],
  },
  {
    slug: "programas-terapeuticos",
    title: "Programas Terapéuticos",
    sections: [
      {
        type: "page_hero",
        data: {
          title: "Programas Terapéuticos",
          subtitle:
            "Elegí el programa que mejor se ajuste a tu momento y necesidades.",
          crumbs: [
            { href: "/programas-terapeuticos", label: "Programas Terapéuticos" },
          ],
        },
      },
      { type: "service_grid" },
    ],
  },
  {
    slug: "programas-terapeuticos/cet",
    title: "Programa CET",
    sections: [
      {
        type: "page_hero",
        data: {
          title: "Centro Educativo Terapéutico",
          subtitle: "Programa integral para acompañar cada trayectoria.",
          crumbs: [
            { href: "/programas-terapeuticos", label: "Programas Terapéuticos" },
            { href: "/programas-terapeuticos/cet", label: "CET" },
          ],
        },
      },
      {
        type: "custom_block",
        data: {
          container: "medium",
          background: "white",
          spacing: "medium",
          elements: [
            {
              id: "cet-h",
              kind: "heading_2",
              text: "Un abordaje interdisciplinario",
              align: "left",
            },
            {
              id: "cet-p",
              kind: "paragraph",
              text:
                "Trabajamos con un Proyecto Individual de Intervención para cada concurrente, en jornada simple o completa, con articulación permanente con la escuela y la familia.",
            },
          ],
        },
      },
    ],
  },
  {
    slug: "programas-terapeuticos/consultorios",
    title: "Consultorios",
    sections: [
      {
        type: "page_hero",
        data: {
          title: "Consultorios externos",
          subtitle:
            "Atención individual con profesionales especializados en distintas disciplinas.",
          crumbs: [
            { href: "/programas-terapeuticos", label: "Programas Terapéuticos" },
            {
              href: "/programas-terapeuticos/consultorios",
              label: "Consultorios",
            },
          ],
        },
      },
      {
        type: "custom_block",
        data: {
          container: "medium",
          background: "white",
          spacing: "medium",
          elements: [
            {
              id: "cx-h",
              kind: "heading_2",
              text: "Disciplinas disponibles",
              align: "left",
            },
            {
              id: "cx-list",
              kind: "list",
              ordered: false,
              items: [
                "Psicología",
                "Fonoaudiología",
                "Terapia ocupacional",
                "Psicopedagogía",
                "Musicoterapia",
              ],
            },
          ],
        },
      },
    ],
  },
  {
    slug: "programas-terapeuticos/talleres",
    title: "Talleres",
    sections: [
      {
        type: "page_hero",
        data: {
          title: "Talleres grupales",
          subtitle:
            "Espacios para fortalecer habilidades, vínculos y expresión.",
          crumbs: [
            { href: "/programas-terapeuticos", label: "Programas Terapéuticos" },
            { href: "/programas-terapeuticos/talleres", label: "Talleres" },
          ],
        },
      },
      {
        type: "custom_block",
        data: {
          container: "medium",
          background: "white",
          spacing: "medium",
          elements: [
            {
              id: "tl-h",
              kind: "heading_2",
              text: "Nuestros talleres",
              align: "left",
            },
            {
              id: "tl-p",
              kind: "paragraph",
              text:
                "Los talleres son espacios grupales acompañados por profesionales del equipo. Editá este bloque desde el admin para listar los talleres vigentes.",
            },
          ],
        },
      },
    ],
  },
  {
    slug: "programas-terapeuticos/evaluaciones-diagnosticas",
    title: "Evaluaciones diagnósticas",
    sections: [
      {
        type: "page_hero",
        data: {
          title: "Evaluaciones diagnósticas",
          subtitle:
            "Procesos de evaluación para orientar intervenciones.",
          crumbs: [
            { href: "/programas-terapeuticos", label: "Programas Terapéuticos" },
            {
              href: "/programas-terapeuticos/evaluaciones-diagnosticas",
              label: "Evaluaciones diagnósticas",
            },
          ],
        },
      },
      {
        type: "custom_block",
        data: {
          container: "medium",
          background: "white",
          spacing: "medium",
          elements: [
            {
              id: "ev-h",
              kind: "heading_2",
              text: "Qué evaluamos",
              align: "left",
            },
            {
              id: "ev-p",
              kind: "paragraph",
              text:
                "Las evaluaciones diagnósticas nos permiten trazar un mapa de fortalezas y áreas a fortalecer. Editá este bloque para detallar el proceso.",
            },
          ],
        },
      },
    ],
  },
];

async function main() {
  // The User table IS the allowlist. Seed bootstraps the first admin;
  // additional admins are activated by SQL.
  await db.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { active: true },
    create: { email: ADMIN_EMAIL, active: true, name: "Admin" },
  });

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

  let inserted = 0;
  let skipped = 0;

  for (const p of PAGES) {
    const page = await db.page.upsert({
      where: { slug: p.slug },
      update: { title: p.title },
      create: { slug: p.slug, title: p.title },
      select: { id: true },
    });

    const existingCount = await db.section.count({
      where: { pageId: page.id },
    });
    if (existingCount > 0) {
      skipped++;
      continue;
    }

    for (let i = 0; i < p.sections.length; i++) {
      const s = p.sections[i];
      const def = registry[s.type];
      const merged = { ...(def.defaults as object), ...(s.data ?? {}) };
      const validated = def.schema.safeParse(merged);
      if (!validated.success) {
        console.warn(
          `[seed] section ${s.type} on ${p.slug} failed schema:`,
          validated.error.flatten().fieldErrors,
        );
        continue;
      }
      await db.section.create({
        data: {
          pageId: page.id,
          type: s.type as string,
          data: validated.data as object,
          order: i,
          enabled: true,
        },
      });
      inserted++;
    }
  }

  console.log(
    `Seed OK — ${PAGES.length} pages, ${inserted} sections inserted, ${skipped} pages skipped (already had sections).`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
