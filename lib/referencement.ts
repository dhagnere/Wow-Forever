import { SITE } from "@/lib/site";

/** Image de partage par défaut (Facebook, Discord, X, Google Discover) : 1200 × 630, faite par `npm run visuels:partage`. */
export const IMAGE_PARTAGE = { url: "/images/partage-taverne-1200x630.jpg", width: 1200, height: 630, alt: "La Taverne Éternelle : WoW Forever en français, de 1 à 60" };

/** Données structurées de l'éditeur du site, reliées aux comptes officiels (Page Facebook, chaîne YouTube, Discord). */
export function donneesOrganisation(): Record<string, unknown> {
  const profils = [SITE.facebook, SITE.youtube, SITE.discord].filter(Boolean);
  return {
    "@type": "Organization",
    "@id": `${SITE.url}/#organisation`,
    name: SITE.nom,
    url: `${SITE.url}/`,
    logo: { "@type": "ImageObject", url: `${SITE.url}/images/logo-taverne-512.png`, width: 512, height: 512 },
    ...(profils.length ? { sameAs: profils } : {}),
  };
}
