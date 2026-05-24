import type { SchemaTypeDefinition } from "sanity";
import { profesional } from "./profesional";
import { taller } from "./taller";
import { busqueda } from "./busqueda";
import { siteSettings } from "./siteSettings";
import { homePage } from "./homePage";
import { quienesSomosPage } from "./quienesSomosPage";
import { nuestroEspacioPage } from "./nuestroEspacioPage";
import {
  programasOverviewPage,
  programaCETPage,
  programaConsultoriosPage,
  programaTalleresPage,
  programaEvaluacionesPage
} from "./programaPages";
import { admisionPage, rrhhPage, contactoPage } from "./formPages";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Singletons
  siteSettings,
  homePage,
  quienesSomosPage,
  nuestroEspacioPage,
  programasOverviewPage,
  programaCETPage,
  programaConsultoriosPage,
  programaTalleresPage,
  programaEvaluacionesPage,
  admisionPage,
  rrhhPage,
  contactoPage,
  // Collections
  profesional,
  taller,
  busqueda
];
