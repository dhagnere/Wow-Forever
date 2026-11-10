/** Licences et crédit des images de Wikimedia Commons (fonctions pures, testées par tests/wikimedia.test.ts). */
import type { ImageWikimedia } from "./wikimedia";

/** Texte brut d'un champ de métadonnées (souvent en HTML). */
export function texteBrut(html: string | undefined, max = 200): string {
  const t = (html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}

/** Licences acceptées : domaine public, CC0, CC BY et CC BY-SA (toutes versions). Le reste est écarté. */
export function licenceLibre(licence: string): boolean {
  const l = licence.trim().toLowerCase();
  return /^(public domain|domaine public|pd\b|pd-|cc0|cc[- ]zero)/.test(l) || /^cc[- ]by(-sa)?[- ]\d/.test(l) || /^cc[- ]by(-sa)?$/.test(l);
}

/** Crédit affiché sous l'image, comme le demandent les licences CC BY et CC BY-SA : auteur, licence, source. */
export function creditWikimedia(i: Pick<ImageWikimedia, "auteur" | "licence">): string {
  return `${i.auteur || "Auteur inconnu"} · ${i.licence} · via Wikimedia Commons`.slice(0, 200);
}
