import { normaliser } from "../collecte/texte";

/**
 * Validation des fiches du Tableau des guildes. Tout le texte est affiché comme du texte brut (jamais en HTML) ;
 * les liens sont limités à des adresses https, Discord pour l'invitation.
 */

export const FACTIONS = { alliance: "Alliance", horde: "Horde" } as const;
export const TYPES_ROYAUME = { jce: "JcE", jcj: "JcJ", rp: "Jeu de rôle", hardcore: "Hardcore" } as const;
export const OBJECTIFS = {
  leveling: "Montée de niveau", donjons: "Donjons", raids: "Raids", jcj: "JcJ", rp: "Jeu de rôle", metiers: "Métiers", hardcore: "Hardcore", detente: "Détente",
} as const;
export const ROLES = { tank: "Tank", soigneur: "Soigneur", degats: "Dégâts" } as const;
export const CLASSES_GUILDE = {
  guerrier: "Guerrier", paladin: "Paladin", chasseur: "Chasseur", voleur: "Voleur", pretre: "Prêtre",
  chaman: "Chaman", mage: "Mage", demoniste: "Démoniste", druide: "Druide",
} as const;

export type Faction = keyof typeof FACTIONS;
export type TypeRoyaume = keyof typeof TYPES_ROYAUME;

export interface FicheGuilde {
  nom: string;
  faction: Faction;
  serveur: string;
  typeRoyaume: TypeRoyaume;
  objectifs: string[];
  classes: string[];
  roles: string[];
  horaires: string;
  description: string;
  discord: string;
  site: string;
  contactJeu: string;
  recrute: boolean;
}

export type Resultat<T> = { ok: true; valeur: T } | { ok: false; erreurs: string[] };

/** Texte sur une ligne : espaces resserrés, caractères de contrôle retirés. */
function ligne(v: unknown, max: number): string {
  return String(v ?? "").replace(/[\u0000-\u001f\u007f​-‏‪-‮]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

/** Texte de plusieurs lignes : trois retours au plus d'affilée. */
function paragraphes(v: unknown, max: number): string {
  return String(v ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0009\u000b-\u001f\u007f​-‏‪-‮]/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);
}

function liste<T extends string>(valeurs: unknown[], permises: Record<T, string>): T[] {
  return [...new Set(valeurs.map(String))].filter((v): v is T => v in permises);
}

/** Invitation Discord : discord.gg/xxx ou discord.com/invite/xxx, rien d'autre. */
export function invitationDiscord(v: string): string | null {
  if (!v) return "";
  try {
    const u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
    const code = u.hostname === "discord.gg" ? u.pathname.slice(1) : /^(www\.)?discord(app)?\.com$/.test(u.hostname) && u.pathname.startsWith("/invite/") ? u.pathname.slice(8) : null;
    if (!code || !/^[A-Za-z0-9-]{2,32}$/.test(code)) return null;
    return `https://discord.gg/${code}`;
  } catch {
    return null;
  }
}

/** Site de la guilde : adresse https publique, sans identifiants ni adresse IP. */
export function siteWeb(v: string): string | null {
  if (!v) return "";
  try {
    const u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
    if (u.protocol !== "https:" || u.username || u.password || !u.hostname.includes(".") || /^[\d.]+$/.test(u.hostname) || u.href.length > 200) return null;
    return u.href;
  } catch {
    return null;
  }
}

/** Liens et publicité dans les textes libres : refusés, les liens ont leurs propres champs. */
const LIEN_DANS_TEXTE = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|fr|gg|net|org|io|be|ch|ca)\b)/i;

export function validerFiche(form: Record<string, unknown>, multiples: Record<string, unknown[]>): Resultat<FicheGuilde> {
  const erreurs: string[] = [];
  const nom = ligne(form.nom, 60);
  const serveur = ligne(form.serveur, 40);
  const faction = String(form.faction ?? "") as Faction;
  const typeRoyaume = String(form.typeRoyaume ?? "") as TypeRoyaume;
  const horaires = ligne(form.horaires, 80);
  const description = paragraphes(form.description, 600);
  const contactJeu = ligne(form.contactJeu, 40);
  const discord = invitationDiscord(ligne(form.discord, 120));
  const site = siteWeb(ligne(form.site, 200));

  if (nom.length < 2) erreurs.push("Le nom de la guilde est obligatoire (2 caractères au moins).");
  if (serveur.length < 2) erreurs.push("Indiquez le serveur (royaume) de la guilde.");
  if (!(faction in FACTIONS)) erreurs.push("Choisissez la faction : Alliance ou Horde.");
  if (!(typeRoyaume in TYPES_ROYAUME)) erreurs.push("Choisissez le type de royaume.");
  if (description.length < 40) erreurs.push("Présentez la guilde en quelques phrases (40 caractères au moins).");
  if (discord === null) erreurs.push("Le lien Discord doit être une invitation (discord.gg/… ou discord.com/invite/…).");
  if (site === null) erreurs.push("Le site de la guilde doit être une adresse https valide.");
  for (const [champ, valeur] of [["nom", nom], ["description", description], ["horaires", horaires], ["contact en jeu", contactJeu]] as const) {
    if (LIEN_DANS_TEXTE.test(valeur)) erreurs.push(`Pas de lien dans le champ « ${champ} » : utilisez les champs Discord et site.`);
  }
  if (!discord && !contactJeu && !site) erreurs.push("Donnez au moins un moyen de contact : Discord, site ou personnage à contacter en jeu.");
  if (erreurs.length) return { ok: false, erreurs };

  return {
    ok: true,
    valeur: {
      nom, faction, serveur, typeRoyaume, horaires, description, contactJeu,
      discord: discord ?? "", site: site ?? "",
      objectifs: liste(multiples.objectifs ?? [], OBJECTIFS),
      classes: liste(multiples.classes ?? [], CLASSES_GUILDE),
      roles: liste(multiples.roles ?? [], ROLES),
      recrute: form.recrute === "oui",
    },
  };
}

export function slugGuilde(nom: string, serveur: string): string {
  return `${normaliser(nom)} ${normaliser(serveur)}`.trim().split(" ").filter(Boolean).slice(0, 10).join("-").slice(0, 80).replace(/-+$/, "") || "guilde";
}
