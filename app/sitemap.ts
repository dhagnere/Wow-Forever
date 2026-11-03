import type { MetadataRoute } from "next";
import { listerGuildesPourPlan, listerObjetsPourPlan, listerPourPlan } from "@/modules/veille";
import { RUBRIQUES } from "@/config/taxonomie";
import { CLASSES } from "@/content/classes";
import { combinaisons } from "@/lib/guide";
import { ZONES, DONJONS } from "@/content/monde";
import { SITE } from "@/lib/site";
import { CLASSES_EN, lienGuideEn } from "@/lib/anglais";
import { tousLesLieux } from "@/lib/cartes";

export const dynamic = "force-dynamic";

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
    // Version anglaise
    "/en/", "/en/leveling-guide/", "/en/classes/", "/en/races/",
    ...CLASSES.map((c) => `/en/classes/${CLASSES_EN[c.slug].slug}/`),
    ...CLASSES.map((c) => `/en/classes/${CLASSES_EN[c.slug].slug}/talents/`),
    ...combinaisons().map((c) => lienGuideEn(c.race.slug, c.classe.slug)),
    ...DONJONS.map((d) => `/donjons/${d.slug}/`),
  ].map((chemin) => ({ url: `${SITE.url}${chemin}` }));
  const articles = (await listerPourPlan()).map((a) => ({ url: `${SITE.url}/articles/${a.slug}/`, lastModified: a.modifieLe }));
  // Fiches d'objets : qualité « bonne » et au-delà, pour ne pas noyer le plan sous les objets gris et blancs.
  const objets = (await listerObjetsPourPlan().catch(() => [])).map((o) => ({ url: `${SITE.url}/base-de-donnees/objets/${o.id}/` }));
  const guildes = (await listerGuildesPourPlan().catch(() => [])).map((g) => ({ url: `${SITE.url}/guildes/${g.slug}/`, lastModified: g.majLe }));
  return [...fixes, ...articles, ...guildes, ...objets];
}
