/**
 * Numéros de la Lettre préparés chaque semaine à partir des vidéos du Journal de Jobwow, en français et en anglais
 * (même `semaine`, une entrée par langue). Ils s'affichent dans /admin/lettre (« Brouillons préparés ») : un clic les
 * importe comme brouillon ; l'essai obligatoire et le lancement restent à Jobwow.
 *
 * Règles : Markdown (passé par markdownVersHtml à l'affichage et à l'envoi), liens vers le site seulement
 * (/carnet/videos/ ou /en/notebook/videos/, le Carnet, les guides), faits vus dans les vidéos, rien d'inventé
 * (une information non confirmée reste entre crochets), mêmes faits dans les deux langues.
 */

export interface LettrePreparee {
  /** Identifiant stable : « 2026-S46-fr ». */
  id: string;
  semaine: string;
  langue: "fr" | "en";
  sujet: string;
  corps: string;
}

export const LETTRES_PREPAREES: LettrePreparee[] = [];
