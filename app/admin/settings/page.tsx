import SettingsForm from "@/components/admin/SettingsForm";
import AdminContainer from "@/components/admin/AdminContainer";
import { getSiteSettingsForEdit } from "@/app/admin/_actions/settings";

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
      }}
    />
    </AdminContainer>
  );
}
