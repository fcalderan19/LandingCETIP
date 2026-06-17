import type { SectionDef } from "./sections-types";

import {
  HeroSliderSchema,
  HeroSliderDefaults,
  HeroSliderRender,
  HeroSliderEditor,
} from "@/components/sections/HeroSlider";
import {
  ServiceGridSchema,
  ServiceGridDefaults,
  ServiceGridRender,
  ServiceGridEditor,
} from "@/components/sections/ServiceGrid";
import {
  AboutPreviewSchema,
  AboutPreviewDefaults,
  AboutPreviewRender,
  AboutPreviewEditor,
} from "@/components/sections/AboutPreview";
import {
  FeaturedStripSchema,
  FeaturedStripDefaults,
  FeaturedStripRender,
  FeaturedStripEditor,
} from "@/components/sections/FeaturedStrip";
import {
  PageHeroSchema,
  PageHeroDefaults,
  PageHeroRender,
  PageHeroEditor,
} from "@/components/sections/PageHero";
import {
  QuienesSomosSchema,
  QuienesSomosDefaults,
  QuienesSomosRender,
  QuienesSomosEditor,
} from "@/components/sections/QuienesSomos";
import {
  EspacioSchema,
  EspacioDefaults,
  EspacioRender,
  EspacioEditor,
} from "@/components/sections/Espacio";
import {
  ContactoSchema,
  ContactoDefaults,
  ContactoRender,
  ContactoEditor,
} from "@/components/sections/Contacto";
import {
  RRHHSchema,
  RRHHDefaults,
  RRHHRender,
  RRHHEditor,
} from "@/components/sections/RRHH";
import {
  TeamListSchema,
  TeamListDefaults,
  TeamListRender,
  TeamListEditor,
} from "@/components/sections/TeamList";
import {
  JobOpeningsListSchema,
  JobOpeningsListDefaults,
  JobOpeningsListRender,
  JobOpeningsListEditor,
} from "@/components/sections/JobOpeningsList";

export const registry = {
  hero_slider: {
    type: "hero_slider",
    schema: HeroSliderSchema,
    defaults: HeroSliderDefaults,
    render: HeroSliderRender,
    editor: HeroSliderEditor,
  },
  service_grid: {
    type: "service_grid",
    schema: ServiceGridSchema,
    defaults: ServiceGridDefaults,
    render: ServiceGridRender,
    editor: ServiceGridEditor,
  },
  about_preview: {
    type: "about_preview",
    schema: AboutPreviewSchema,
    defaults: AboutPreviewDefaults,
    render: AboutPreviewRender,
    editor: AboutPreviewEditor,
  },
  featured_strip: {
    type: "featured_strip",
    schema: FeaturedStripSchema,
    defaults: FeaturedStripDefaults,
    render: FeaturedStripRender,
    editor: FeaturedStripEditor,
  },
  page_hero: {
    type: "page_hero",
    schema: PageHeroSchema,
    defaults: PageHeroDefaults,
    render: PageHeroRender,
    editor: PageHeroEditor,
  },
  quienes_somos: {
    type: "quienes_somos",
    schema: QuienesSomosSchema,
    defaults: QuienesSomosDefaults,
    render: QuienesSomosRender,
    editor: QuienesSomosEditor,
  },
  espacio: {
    type: "espacio",
    schema: EspacioSchema,
    defaults: EspacioDefaults,
    render: EspacioRender,
    editor: EspacioEditor,
  },
  contacto: {
    type: "contacto",
    schema: ContactoSchema,
    defaults: ContactoDefaults,
    render: ContactoRender,
    editor: ContactoEditor,
  },
  rrhh: {
    type: "rrhh",
    schema: RRHHSchema,
    defaults: RRHHDefaults,
    render: RRHHRender,
    editor: RRHHEditor,
  },
  team_list: {
    type: "team_list",
    schema: TeamListSchema,
    defaults: TeamListDefaults,
    render: TeamListRender,
    editor: TeamListEditor,
  },
  job_openings_list: {
    type: "job_openings_list",
    schema: JobOpeningsListSchema,
    defaults: JobOpeningsListDefaults,
    render: JobOpeningsListRender,
    editor: JobOpeningsListEditor,
  },
} satisfies Record<string, SectionDef>;

export type SectionType = keyof typeof registry;

export function getSection(type: string): SectionDef | undefined {
  return (registry as Record<string, SectionDef>)[type];
}

export function listSectionTypes(): Array<{
  type: string;
  label: string;
  description?: string;
}> {
  return Object.values(registry).map((def) => ({
    type: def.type,
    label: def.editor.label,
    description: def.editor.description,
  }));
}
