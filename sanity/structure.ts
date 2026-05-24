import type { StructureResolver } from "sanity/structure";

const singletons = [
  { id: "siteSettings", title: "⚙️ Configuración del sitio" },
  { id: "homePage", title: "🏠 Página de Inicio" },
  { id: "quienesSomosPage", title: "👥 Página Quiénes Somos" },
  { id: "nuestroEspacioPage", title: "🏛️ Página Nuestro Espacio" },
  { id: "programasOverviewPage", title: "📚 Programas — Overview" },
  { id: "programaCETPage", title: "📚 Programa CET" },
  { id: "programaConsultoriosPage", title: "📚 Programa Consultorios" },
  { id: "programaTalleresPage", title: "📚 Programa Talleres" },
  { id: "programaEvaluacionesPage", title: "📚 Programa Evaluaciones" },
  { id: "admisionPage", title: "📝 Página Admisión" },
  { id: "rrhhPage", title: "💼 Página RR.HH." },
  { id: "contactoPage", title: "📞 Página Contacto" }
];

const collections = [
  { type: "profesional", title: "👤 Equipo" },
  { type: "taller", title: "🎨 Talleres" },
  { type: "busqueda", title: "💼 Búsquedas activas" }
];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenido")
    .items([
      S.listItem()
        .title("Páginas")
        .child(
          S.list()
            .title("Páginas")
            .items(
              singletons.map((s) =>
                S.listItem()
                  .title(s.title)
                  .id(s.id)
                  .child(S.document().schemaType(s.id).documentId(s.id))
              )
            )
        ),
      S.divider(),
      ...collections.map((c) =>
        S.listItem()
          .title(c.title)
          .schemaType(c.type)
          .child(S.documentTypeList(c.type).title(c.title))
      )
    ]);
