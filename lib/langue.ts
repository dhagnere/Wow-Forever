/** Langues du site : le français (site principal) et l'anglais (version /en/). */
export type Langue = "fr" | "en";
export const LANGUES: Langue[] = ["fr", "en"];
/** Suffixe des fichiers de données d'une langue : sorts-jeu.json, sorts-jeu.en.json… */
export const suffixe = (l: Langue) => (l === "en" ? ".en" : "");
