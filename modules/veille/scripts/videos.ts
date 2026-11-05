import { COOKIE_SESSION, creerJeton } from "../auth/session";
import { obtenirVideo, videoEchouee, videoFabriquee, videosAFabriquer } from "../reels/stockage";
import { lancer } from "./_lanceur";

/** Vidéos fabriquées par passage : chacune prend quelques secondes à une minute. */
const PAR_PASSAGE = 5;

// Vidéos des Reels : lancé toutes les 10 minutes par cron.json, dans un conteneur à part (ffmpeg y a sa mémoire).
lancer("veille:videos", async () => {
  const articles = await videosAFabriquer(PAR_PASSAGE);
  if (!articles.length) return console.log("Aucune vidéo à fabriquer.");
  // L'image d'un brouillon n'est servie qu'à l'administration : session signée, valable le temps du passage.
  const cookie = `${COOKIE_SESSION}=${await creerJeton()}`;
  for (const a of articles) {
    const debut = Date.now();
    try {
      await obtenirVideo(a, { cookie: a.statut === "publie" ? undefined : cookie });
      await videoFabriquee(a.id);
      console.log(`  ${a.slug} : vidéo prête en ${Math.round((Date.now() - debut) / 1000)} s.`);
    } catch (e) {
      const erreur = e instanceof Error ? e.message : String(e);
      await videoEchouee(a.id, erreur);
      console.log(`  ${a.slug} : échec — ${erreur}`);
    }
  }
});
