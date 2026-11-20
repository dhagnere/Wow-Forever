import { SITE } from "@/lib/site";

/** Lien « mailto: » de demande de l'addon TaverneRoutes, objet et corps préremplis (le visiteur complète ses informations). */
export function lienDemandeAddon(langue: "fr" | "en" = "fr"): string {
  const sujet = langue === "en" ? "TaverneRoutes addon request" : "Demande de l'addon TaverneRoutes";
  const corps =
    langue === "en"
      ? "Hello Jobwow,\n\nI would like to receive the TaverneRoutes addon.\n\nIn-game name:\nRace and class:\nGame client language (French or English):\n\nThank you!"
      : "Bonjour Jobwow,\n\nJe voudrais recevoir l'addon TaverneRoutes.\n\nPseudo en jeu :\nRace et classe :\nLangue du client (français ou anglais) :\n\nMerci !";
  return `mailto:${SITE.contact}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;
}
