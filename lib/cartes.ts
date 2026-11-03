import { CARTES_JEU, type CarteJeu } from "@/content/cartes-jeu";
import { DONJONS_ORIGINE, RAIDS, ZONES_DEPART, ZONES_NIVEAUX, type DonjonReference, type ZoneDepart, type ZoneNiveau } from "@/content/reference";
import { ZONES } from "@/content/monde";

/**
 * Cartes du monde (npm run cartes:jeu) et pages de lieux /cartes/<lieu>/.
 * Relie les noms utilisés dans les guides aux cartes du jeu. Cartes © Blizzard Entertainment, lues grâce à wago.tools.
 */

export function normaliserLieu(nom: string): string {
  return nom
    .replace(/\(.*?\)/g, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[’']/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Noms des guides qui diffèrent du nom en jeu. */
const ALIAS: Record<string, string> = {
  ashenvale: "orneval",
  "shen-dralar": "shen-dralas",
  shendralar: "shen-dralas",
  "les-mille-pointes": "mille-pointes",
  "les-terres-ingrates": "terres-ingrates",
  "les-pitons-du-tonnerre": "thunder-bluff",
  "pitons-du-tonnerre": "thunder-bluff",
};

export function lieuParNom(nom: string): string | undefined {
  const n = normaliserLieu(nom);
  const slug = ALIAS[n] ?? n;
  return CARTES_JEU[slug] ? slug : undefined;
}

/** Noms laissés en anglais dans les fichiers du jeu. */
const NOMS_FRANCAIS: Record<string, string> = { "thunder-bluff": "Les Pitons-du-Tonnerre" };

export function carte(slug: string): CarteJeu | undefined {
  const c = CARTES_JEU[slug];
  return c ? { ...c, nom: NOMS_FRANCAIS[slug] ?? c.nom } : undefined;
}

export function urlCarte(slug: string, largeur: 1000 | 500 = 1000): string {
  return `/images/jeu/cartes/${slug}-${largeur}.jpg`;
}

export function pageLieu(slug: string): string {
  return `/cartes/${slug}/`;
}

/** Fiche Forever d'un lieu, s'il en a une (Mont Hyjal, île de Zéphras…). */
export function ficheForever(slug: string): { nom: string; lien: string } | undefined {
  const z = ZONES.find((x) => lieuParNom(x.nom) === slug || (x.slug === "shendralar" && slug === "shen-dralas"));
  return z ? { nom: z.nom, lien: `/zones/${z.slug}/` } : undefined;
}

export interface Lieu {
  slug: string;
  carte: CarteJeu;
  niveau?: ZoneNiveau;
  departs: ZoneDepart[];
  donjons: DonjonReference[];
  raids: typeof RAIDS;
  voisins: { slug: string; nom: string; niveau: ZoneNiveau }[];
  fiche?: { nom: string; lien: string };
}

export function lieu(slug: string): Lieu | undefined {
  const c = carte(slug);
  if (!c) return undefined;
  const niveau = ZONES_NIVEAUX.find((z) => lieuParNom(z.nom) === slug);
  const departs = ZONES_DEPART.filter((z) => lieuParNom(z.zone) === slug || lieuParNom(z.capitale) === slug);
  const donjons = DONJONS_ORIGINE.filter((d) => lieuParNom(d.zone) === slug);
  const raids = RAIDS.filter((r) => lieuParNom(r.zone) === slug);
  // Zones voisines par le niveau, sur le même continent : la suite logique de la route.
  const voisins = niveau
    ? ZONES_NIVEAUX.filter((z) => z !== niveau && z.continent === niveau.continent && Math.abs(z.min - niveau.min) <= 8)
        .map((z) => ({ slug: lieuParNom(z.nom), nom: carte(lieuParNom(z.nom) ?? "")?.nom ?? z.nom, niveau: z }))
        .filter((v): v is { slug: string; nom: string; niveau: ZoneNiveau } => !!v.slug)
        .sort((a, b) => a.niveau.min - b.niveau.min)
        .slice(0, 6)
    : [];
  return { slug, carte: c, niveau, departs, donjons, raids, voisins, fiche: ficheForever(slug) };
}

/** Zones d'un continent, rangées par niveau (les zones sans niveau connu, villes comprises, à la fin). */
export function zonesDuContinent(continent: string): { slug: string; nom: string; niveau?: ZoneNiveau }[] {
  return Object.entries(CARTES_JEU)
    .filter(([, c]) => c.type === "zone" && c.continent === continent)
    .map(([slug]) => ({ slug, nom: carte(slug)!.nom, niveau: ZONES_NIVEAUX.find((z) => lieuParNom(z.nom) === slug) }))
    .sort((a, b) => (a.niveau?.min ?? 99) - (b.niveau?.min ?? 99) || a.nom.localeCompare(b.nom, "fr"));
}

export function tousLesLieux(): string[] {
  return Object.keys(CARTES_JEU);
}
