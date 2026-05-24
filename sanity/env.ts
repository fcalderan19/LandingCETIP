/**
 * Lee variables tanto del prefijo de Next (NEXT_PUBLIC_*) como del de Sanity Studio (SANITY_STUDIO_*).
 * Esto permite que el mismo .env sirva para el sitio Next y el Studio de Sanity.
 */
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_STUDIO_PROJECT_ID ||
  "";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_STUDIO_DATASET ||
  "production";

export const apiVersion = "2024-10-01";
export const isConfigured = Boolean(projectId);
