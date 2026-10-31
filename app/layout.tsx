import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.nom} — ${SITE.signature}`, template: `%s · ${SITE.nom}` },
  description:
    "Classes, quêtes, donjons et nouvelles terres de World of Warcraft: Forever, racontés en français par Silfax, de 1 à 60.",
  openGraph: { siteName: SITE.nom, locale: "fr_FR", type: "website" },
  alternates: { canonical: "/" },
  // Validation Google Search Console (méthode « Balise HTML ») : contenu de l'attribut content, sans guillemets.
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Source+Sans+3:wght@400;600;700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
