import { MOT_DE_PASSE_MIN } from "./motdepasse";

/** Vérification des formulaires du compte joueur (inscription, connexion, nouveau mot de passe). */

const COURRIEL = /^[^\s@<>()[\]\\,;:"]{1,64}@[^\s@<>()[\]\\,;:"]{1,190}\.[a-z]{2,24}$/i;
const PSEUDO = /^[\p{L}\p{N}][\p{L}\p{N} '\-]{1,22}[\p{L}\p{N}]$/u;

export interface Inscription {
  pseudo: string;
  courriel: string;
  motDePasse: string;
  lettre: boolean;
}

export type Resultat<T> = { ok: true; valeur: T } | { ok: false; erreurs: Record<string, string> };

export const normaliserCourriel = (c: string) => c.trim().toLowerCase().slice(0, 254);

export function erreurMotDePasse(m: string, courriel = "", pseudo = ""): string | null {
  if (m.length < MOT_DE_PASSE_MIN) return `Au moins ${MOT_DE_PASSE_MIN} caractères.`;
  if (m.length > 200) return "200 caractères au plus.";
  const bas = m.toLowerCase();
  if ((courriel && bas.includes(courriel.split("@")[0])) || (pseudo && pseudo.length >= 3 && bas.includes(pseudo.toLowerCase()))) {
    return "Évitez d'y mettre votre pseudo ou votre adresse.";
  }
  if (/^(.)\1+$/.test(m) || /^(0123456789|1234567890|azertyuiop|motdepasse)/i.test(m)) return "Ce mot de passe est trop facile à deviner.";
  return null;
}

export function validerInscription(d: { pseudo?: unknown; courriel?: unknown; motDePasse?: unknown; confirmation?: unknown; lettre?: unknown }): Resultat<Inscription> {
  const erreurs: Record<string, string> = {};
  const pseudo = String(d.pseudo ?? "").trim().replace(/\s+/g, " ");
  const courriel = normaliserCourriel(String(d.courriel ?? ""));
  const motDePasse = String(d.motDePasse ?? "");
  if (!PSEUDO.test(pseudo)) erreurs.pseudo = "De 3 à 24 caractères : lettres, chiffres, espaces, tirets ou apostrophes.";
  if (!COURRIEL.test(courriel)) erreurs.courriel = "Cette adresse ne semble pas valide.";
  const m = erreurMotDePasse(motDePasse, courriel, pseudo);
  if (m) erreurs.motDePasse = m;
  else if (String(d.confirmation ?? "") !== motDePasse) erreurs.confirmation = "Les deux mots de passe ne sont pas identiques.";
  if (Object.keys(erreurs).length) return { ok: false, erreurs };
  return { ok: true, valeur: { pseudo, courriel, motDePasse, lettre: d.lettre === "oui" || d.lettre === true } };
}

/** Identifiant d'un guide : faction, race et classe (« alliance:humain:mage »). */
export function cleGuideValide(cle: string): boolean {
  return /^(alliance|horde):[a-z-]{3,20}:[a-z]{4,12}$/.test(cle);
}
