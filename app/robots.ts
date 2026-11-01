import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Lu à chaque requête : l'adresse du plan du site suit SITE_URL sans nouveau déploiement.
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin/", "/reseaux/"] }],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
