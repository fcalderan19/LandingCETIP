import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { site } from "@/lib/site";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsapp from "@/components/FloatingWhatsapp";
import RevealObserver from "@/components/RevealObserver";

export const metadata: Metadata = {
  title: `${site.fullName}`,
  description: site.description,
  openGraph: {
    title: site.fullName,
    description: site.description,
    type: "website",
    locale: "es_AR"
  },
  alternates: { canonical: "/" }
};

const ldJson = {
  "@context": "https://schema.org",
  "@type": ["EducationalOrganization", "LocalBusiness"],
  name: site.fullName,
  description: site.description,
  address: { "@type": "PostalAddress", streetAddress: site.address },
  telephone: site.phoneTel,
  email: site.email,
  openingHours: "Mo-Fr 08:00-19:00, Sa 09:00-13:00",
  sameAs: [site.socials.instagram, site.socials.facebook]
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html lang="es-AR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
        />
      </head>
      <body>
        {isAdmin ? (
          children
        ) : (
          <>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:bg-white focus:px-3 focus:py-2 focus:rounded-md focus:shadow"
            >
              Saltar al contenido
            </a>
            <TopBar />
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <FloatingWhatsapp />
            <RevealObserver />
          </>
        )}
      </body>
    </html>
  );
}
