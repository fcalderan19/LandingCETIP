import { unstable_cache } from "next/cache";
import { db } from "./db";
import { site } from "./site";

export type SiteSettingsShape = {
  name: string;
  fullName: string;
  tagline: string;
  description: string;
  address: string;
  phoneDisplay: string;
  phoneTel: string;
  whatsappNumber: string;
  whatsappMessage: string;
  email: string;
  hours: string;
  socials: { instagram: string; facebook: string; [key: string]: string };
  mapsEmbed: string;
};

export const SITE_SETTINGS_TAG = "site-settings";

const fallback: SiteSettingsShape = {
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
};

async function load(): Promise<SiteSettingsShape> {
  try {
    const row = await db.siteSettings.findUnique({ where: { id: 1 } });
    if (!row) return fallback;
    const socials =
      typeof row.socials === "object" && row.socials !== null
        ? (row.socials as SiteSettingsShape["socials"])
        : fallback.socials;
    return {
      name: row.name,
      fullName: row.fullName,
      tagline: row.tagline,
      description: row.description,
      address: row.address,
      phoneDisplay: row.phoneDisplay,
      phoneTel: row.phoneTel,
      whatsappNumber: row.whatsappNumber,
      whatsappMessage: row.whatsappMessage,
      email: row.email,
      hours: row.hours,
      socials,
      mapsEmbed: row.mapsEmbed,
    };
  } catch (err) {
    console.warn("[site-settings] DB unavailable, using fallback:", err);
    return fallback;
  }
}

export const getSiteSettings = unstable_cache(load, ["site-settings"], {
  tags: [SITE_SETTINGS_TAG],
});

export function waLinkFor(
  number: string,
  message: string,
  override?: string,
): string {
  const text = override ?? message;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
