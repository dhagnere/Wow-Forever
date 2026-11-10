/**
 * Noms anglais des contenus propres à Forever, pour la version anglaise de l'addon EternalRoutes (QuestDB.lua).
 *
 * Les bases libres (CMaNGOS, AzerothCore) ne connaissent pas ces quêtes, PNJ et objectifs, et les fichiers du jeu n'en
 * donnent que le numéro : sans cette table, un client français les affiche en français même quand l'addon est en anglais.
 *
 * Règles :
 *  - clé : le nom exact affiché par le client français (titre de quête, nom de PNJ ou d'entraîneur, objectif sans son
 *    compteur « 3/6 ») ; valeur : le nom anglais ;
 *  - seulement un nom lu sur un client anglais ou une source officielle de Blizzard, jamais une traduction de notre cru
 *    ni un nom repris de Wowhead ou d'un guide commercial ;
 *  - noter la source en commentaire au-dessus de l'entrée.
 */
export const TRADUCTIONS_FOREVER_EN: Record<string, string> = {
  // Exemple (à remplacer par des noms relevés en jeu) :
  // « L'appel de la terre » relevé sur un client anglais le … :
  // "L’appel de la terre": "…",
};
