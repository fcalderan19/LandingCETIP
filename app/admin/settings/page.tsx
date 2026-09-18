import SettingsForm from "@/components/admin/SettingsForm";
import AdminContainer from "@/components/admin/AdminContainer";
import { getSiteSettingsForEdit } from "@/app/admin/_actions/settings";
import {
  DEFAULT_HEADER_CONFIG,
  DEFAULT_FOOTER_CONFIG,
  type HeaderConfigShape,
  type FooterConfigShape,
} from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function SettingsRoute() {
  const res = await getSiteSettingsForEdit();
  if (!res.ok) {
    return (
      <AdminContainer>
        <h1 className="text-2xl font-bold">Configuración del sitio</h1>
        <p className="text-sm text-[var(--color-coral)] mt-3">
          {res.message ?? res.error} — corré <code>npm run db:seed</code>.
        </p>
      </AdminContainer>
    );
  }
  const row = res.data;
  const headerConfig: HeaderConfigShape = {
    ...DEFAULT_HEADER_CONFIG,
    ...((row.headerConfig as Partial<HeaderConfigShape> | null) ?? {}),
  };
  const footerConfig: FooterConfigShape = {
    ...DEFAULT_FOOTER_CONFIG,
    ...((row.footerConfig as Partial<FooterConfigShape> | null) ?? {}),
  };
  return (
    <AdminContainer>
      <SettingsForm
        initial={{
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
          socials: (row.socials as Record<string, string>) ?? {
            instagram: "",
            facebook: "",
          },
          mapsEmbed: row.mapsEmbed,
          headerConfig,
          footerConfig,
        }}
      />
    </AdminContainer>
  );
}
