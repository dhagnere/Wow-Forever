import { createHmac, timingSafeEqual } from "node:crypto";
import { markdownVersHtml } from "../rendu/html";
import type { Courriel } from "../courriel/resend";

/**
 * Messages de la Lettre : confirmation d'inscription et numéros envoyés aux abonnés, en français et en anglais.
 * Le lien de désinscription est signé (HMAC, SESSION_SECRET) : il ne demande aucun jeton stocké et ne vaut que
 * pour son abonné.
 */

export type LangueLettre = "fr" | "en";

export const PAGES_LETTRE = {
  fr: { confirmation: "/lettre/confirmation/", desinscription: "/lettre/desinscription/", merci: "/lettre/merci/" },
  en: { confirmation: "/en/newsletter/confirm/", desinscription: "/en/newsletter/unsubscribe/", merci: "/en/newsletter/thanks/" },
} as const;

function secret(): string {
  const s = process.env.SESSION_SECRET ?? "";
  if (s.length < 32) throw new Error("SESSION_SECRET absent ou trop court (32 caractères minimum).");
  return s;
}

export function signatureAbonne(id: number, courriel: string): string {
  return createHmac("sha256", secret()).update(`lettre.desinscription.${id}.${courriel}`).digest("base64url");
}

export function signatureValide(id: number, courriel: string, signature: string): boolean {
  const attendue = Buffer.from(signatureAbonne(id, courriel));
  const recue = Buffer.from(signature);
  return attendue.length === recue.length && timingSafeEqual(attendue, recue);
}

const parametres = (id: number, courriel: string) => `a=${id}&s=${signatureAbonne(id, courriel)}`;

export function lienDesinscription(site: string, langue: LangueLettre, id: number, courriel: string): string {
  return `${site}${PAGES_LETTRE[langue].desinscription}?${parametres(id, courriel)}`;
}

/** Adresse de la désinscription en un clic (RFC 8058), appelée par la messagerie de l'abonné. */
export function lienDesinscriptionDirecte(site: string, id: number, courriel: string): string {
  return `${site}/api/lettre/desinscription/?${parametres(id, courriel)}`;
}

const echapper = (t: string) => t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

function gabarit(contenu: string, pied: string): string {
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f4efe4">
<div style="max-width:600px;margin:0 auto;padding:24px;font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.55;color:#2b2118;background:#fffaf0">
<p style="margin:0 0 18px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#8a6d3b">La Taverne Éternelle</p>
${contenu}
<hr style="border:0;border-top:1px solid #e3d6bd;margin:28px 0 14px">
<p style="margin:0;font-size:13px;color:#7a6a55">${pied}</p>
</div></body></html>`;
}

const TEXTES = {
  fr: {
    sujet: "Confirmez votre inscription à la Lettre de la Taverne",
    corps: "Bonjour,\n\nPour recevoir la Lettre de la Taverne chaque dimanche, confirmez votre inscription en ouvrant ce lien (valable 48 heures) :",
    bouton: "Confirmer mon inscription",
    ignorer: "Si vous n'avez rien demandé, ignorez ce message : votre adresse ne sera pas inscrite et sera effacée d'ici une semaine.",
    signature: "Jobwow, de la Taverne Éternelle",
    piedLettre: "Vous recevez la Lettre de la Taverne parce que vous vous y êtes inscrit. Pour ne plus la recevoir :",
    lienPied: "se désinscrire",
  },
  en: {
    sujet: "Confirm your sign-up to the Tavern's newsletter",
    corps: "Hello,\n\nTo receive the Tavern's newsletter every Sunday, confirm your sign-up by opening this link (valid for 48 hours):",
    bouton: "Confirm my sign-up",
    ignorer: "If you did not ask for anything, ignore this message: your address will not be added and will be deleted within a week.",
    signature: "Jobwow, from La Taverne Éternelle",
    piedLettre: "You receive the Tavern's newsletter because you signed up for it. To stop receiving it:",
    lienPied: "unsubscribe",
  },
} as const;

export function messageConfirmation(site: string, langue: LangueLettre, courriel: string, jeton: string): Courriel {
  const t = TEXTES[langue];
  const lien = `${site}${PAGES_LETTRE[langue].confirmation}?jeton=${encodeURIComponent(jeton)}`;
  const [salut, phrase] = t.corps.split("\n\n");
  return {
    a: courriel,
    sujet: t.sujet,
    texte: `${t.corps}\n${lien}\n\n${t.ignorer}\n\n${t.signature}`,
    html: gabarit(
      `<p>${echapper(salut)}</p><p>${echapper(phrase)}</p>
<p style="margin:24px 0"><a href="${echapper(lien)}" style="display:inline-block;padding:12px 22px;background:#b8862b;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold">${t.bouton}</a></p>
<p style="font-size:14px;color:#7a6a55">${echapper(t.ignorer)}</p><p>${t.signature}</p>`,
      echapper(t.signature),
    ),
  };
}

/** Texte brut tiré du Markdown de la Lettre, pour les messageries qui n'affichent pas le HTML. */
export function markdownVersTexte(md: string): string {
  return md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\(([^)\s]+)[^)]*\)/g, "$1 ($2)")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/(\*\*|__|\*|_|`)/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function messageLettre(
  site: string,
  envoi: { langue: LangueLettre; sujet: string; corps: string },
  abonne: { id: number; courriel: string },
): Courriel {
  const t = TEXTES[envoi.langue];
  const lien = lienDesinscription(site, envoi.langue, abonne.id, abonne.courriel);
  return {
    a: abonne.courriel,
    sujet: envoi.sujet,
    texte: `${markdownVersTexte(envoi.corps)}\n\n—\n${t.piedLettre} ${lien}`,
    // Garde-fou « Filtrage du HTML » : le corps passe par markdownVersHtml, comme les articles.
    html: gabarit(markdownVersHtml(envoi.corps), `${echapper(t.piedLettre)} <a href="${echapper(lien)}" style="color:#7a6a55">${t.lienPied}</a>.`),
    entetes: {
      "List-Unsubscribe": `<${lienDesinscriptionDirecte(site, abonne.id, abonne.courriel)}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  };
}

/** Messages encore permis aujourd'hui pour la Lettre (plafond quotidien moins ce qui est déjà parti). */
export function resteDuJour(plafond: number, dejaEnvoyes: number): number {
  return Math.max(0, Math.floor(plafond) - dejaEnvoyes);
}

export function plafondJour(): number {
  const n = Number(process.env.LETTRE_PLAFOND_JOUR);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 80;
}
