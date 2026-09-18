export type CategoryKey =
  | "custom"
  | "hero"
  | "content"
  | "media"
  | "list"
  | "form";

export const CATEGORY_LABEL: Record<CategoryKey, string> = {
  custom: "Armá el tuyo",
  hero: "Encabezados",
  content: "Contenido",
  media: "Medios",
  list: "Colecciones",
  form: "Formularios",
};

export const CATEGORY_ORDER: CategoryKey[] = [
  "custom",
  "hero",
  "content",
  "media",
  "list",
  "form",
];

const MAP: Record<string, CategoryKey> = {
  custom_block: "custom",
  hero_slider: "hero",
  page_hero: "hero",
  about_preview: "content",
  quienes_somos: "content",
  featured_strip: "content",
  service_grid: "list",
  team_list: "list",
  job_openings_list: "list",
  espacio: "media",
  contacto: "form",
  rrhh: "form",
};

export function categoryOf(type: string): CategoryKey {
  return MAP[type] ?? "content";
}
