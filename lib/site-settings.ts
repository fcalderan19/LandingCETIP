import { unstable_cache } from "next/cache";
import { db } from "./db";
import { site } from "./site";

export type HeaderConfigShape = {
  showTopBar: boolean;
  showAddress: boolean;
  showPhone: boolean;
  showHours: boolean;
  showEmail: boolean;
  showWhatsapp: boolean;
  showSocials: boolean;
  ctaLabel: string;
  ctaHref: string;
};

export type FooterConfigShape = {
  showDescription: boolean;
  showContactInfo: boolean;
  showSocials: boolean;
  copyright: string;
  extraNote: string;
};

export const DEFAULT_HEADER_CONFIG: HeaderConfigShape = {
  showTopBar: true,
  showAddress: true,
  showPhone: true,
  showHours: true,
  showEmail: true,
  showWhatsapp: true,
  showSocials: true,
  ctaLabel: "Contactanos",
  ctaHref: "/contacto",
};

export const DEFAULT_FOOTER_CONFIG: FooterConfigShape = {
  showDescription: true,
  showContactInfo: true,
  showSocials: true,
  copyright: "",
  extraNote: "",
};

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
  headerConfig: HeaderConfigShape;
  footerConfig: FooterConfigShape;
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
  headerConfig: DEFAULT_HEADER_CONFIG,
  footerConfig: DEFAULT_FOOTER_CONFIG,
};

function mergeHeader(raw: unknown): HeaderConfigShape {
  if (!raw || typeof raw !== "object") return DEFAULT_HEADER_CONFIG;
  return { ...DEFAULT_HEADER_CONFIG, ...(raw as Partial<HeaderConfigShape>) };
}

function mergeFooter(raw: unknown): FooterConfigShape {
  if (!raw || typeof raw !== "object") return DEFAULT_FOOTER_CONFIG;
  return { ...DEFAULT_FOOTER_CONFIG, ...(raw as Partial<FooterConfigShape>) };
}

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
      headerConfig: mergeHeader(row.headerConfig),
      footerConfig: mergeFooter(row.footerConfig),
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
