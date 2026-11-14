/**
 * Quêtes ajoutées par Forever réservées à une classe. Les relevés en jeu de Questie (npm run base:quetes -- … --questie)
 * ne donnent pas la classe : sans entrée ici, une quête est proposée à toutes les classes dans le guide de 1 à 60.
 *
 * Identifiant de la quête → masque des classes du jeu : guerrier 1, paladin 2, chasseur 4, voleur 8, prêtre 16, chaman 64,
 * mage 128, démoniste 256, druide 1024 (additionner pour deux classes). Ne saisir qu'une classe vue en jeu (quête proposée
 * à cette seule classe), jamais déduite du titre ni lue sur un autre site.
 */
export const CLASSES_QUETES_FOREVER: Record<number, number> = {};
