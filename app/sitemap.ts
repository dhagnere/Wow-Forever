import type { MetadataRoute } from "next";
import { listerPourPlan } from "@/modules/veille";
import { RUBRIQUES } from "@/config/taxonomie";
import { CLASSES } from "@/content/classes";
import { ZONES, DONJONS } from "@/content/monde";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fixes = [
    "/", "/actualites/", "/classes/", "/races/", "/races/skyborne/", "/zones/", "/donjons/", "/guides/bien-demarrer/",
    "/guides/zones-de-depart/", "/guides/zones-par-niveau/", "/guides/liste-des-donjons/",
    "/carnet/", "/a-propos/", "/plan-du-site/", "/mentions-legales/",
    ...RUBRIQUES.map((r) => `/rubriques/${r.slug}/`),
    ...CLASSES.map((c) => `/classes/${c.slug}/`),
    ...ZONES.map((z) => `/zones/${z.slug}/`),
    ...DONJONS.map((d) => `/donjons/${d.slug}/`),
  ].map((chemin) => ({ url: `${SITE.url}${chemin}` }));
  const articles = (await listerPourPlan()).map((a) => ({ url: `${SITE.url}/articles/${a.slug}/`, lastModified: a.modifieLe }));
  return [...fixes, ...articles];
}
