import type { MetadataRoute } from "next";
import { listerGuildesPourPlan, listerObjetsPourPlan, listerPourPlan } from "@/modules/veille";
import { RUBRIQUES } from "@/config/taxonomie";
import { CLASSES } from "@/content/classes";
import { combinaisons } from "@/lib/guide";
import { ZONES, DONJONS } from "@/content/monde";
import { SITE } from "@/lib/site";
import { cheminAnglais } from "@/lib/anglais";
import { tousLesLieux } from "@/lib/cartes";

export const dynamic = "force-dynamic";

/**
 * Plan du site (sitemap.xml), déclaré dans robots.txt et à soumettre dans Google Search Console et Bing Webmaster Tools.
 * Chaque page française qui a sa version anglaise apparaît avec elle, et les deux s'annoncent l'une l'autre
 * (balises xhtml:link hreflang fr / en / x-default), comme dans l'en-tête des pages.
 */
function avecTraduction(chemin: string, extra: Partial<MetadataRoute.Sitemap[number]> = {}): MetadataRoute.Sitemap {
  const en = cheminAnglais(chemin);
  if (!en) return [{ url: `${SITE.url}${chemin}`, ...extra }];
  const alternates = { languages: { fr: `${SITE.url}${chemin}`, en: `${SITE.url}${en}`, "x-default": `${SITE.url}${chemin}` } };
  return [{ url: `${SITE.url}${chemin}`, alternates, ...extra }, { url: `${SITE.url}${en}`, alternates, ...extra }];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fixes = [
    "/", "/actualites/", "/classes/", "/races/", "/races/skyborne/", "/zones/", "/donjons/", "/guides/bien-demarrer/",
    "/guides/zones-de-depart/", "/guides/zones-par-niveau/", "/guides/liste-des-donjons/", "/guides/parcours/", "/guides/quetes-de-classe/",
    "/base-de-donnees/", "/base-de-donnees/objets/", "/cartes/", ...tousLesLieux().map((l) => `/cartes/${l}/`), "/calendrier/", "/lettre/", "/communaute/", "/guildes/", "/guildes/inscrire/", "/soutenir/", "/contact/", "/confidentialite/", "/carnet/", "/a-propos/", "/plan-du-site/", "/mentions-legales/",
    ...RUBRIQUES.map((r) => `/rubriques/${r.slug}/`),
    ...CLASSES.map((c) => `/classes/${c.slug}/`),
    ...CLASSES.map((c) => `/classes/${c.slug}/talents/`),
    ...CLASSES.map((c) => `/guides/quetes-de-classe/${c.slug}/`),
    ...combinaisons().map((c) => `/guides/parcours/${c.race.slug}/${c.classe.slug}/`),
    ...ZONES.map((z) => `/zones/${z.slug}/`),
    ...DONJONS.map((d) => `/donjons/${d.slug}/`),
  ].flatMap((chemin) => avecTraduction(chemin));
  const articles = (await listerPourPlan()).map((a) => ({ url: `${SITE.url}/articles/${a.slug}/`, lastModified: a.modifieLe }));
  // Fiches d'objets : qualité « bonne » et au-delà, pour ne pas noyer le plan sous les objets gris et blancs.
  const objets = (await listerObjetsPourPlan().catch(() => [])).flatMap((o) => avecTraduction(`/base-de-donnees/objets/${o.id}/`));
  const guildes = (await listerGuildesPourPlan().catch(() => [])).map((g) => ({ url: `${SITE.url}/guildes/${g.slug}/`, lastModified: g.majLe }));
  return [...fixes, ...articles, ...guildes, ...objets];
}
