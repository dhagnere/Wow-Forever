import { fermer } from "../db/pool";

/** Exécute une tâche en ligne de commande, ferme la base et renvoie un code de sortie propre. */
export function lancer(nom: string, tache: () => Promise<void>): void {
  const debut = Date.now();
  tache()
    .then(() => console.log(`[${nom}] terminé en ${Math.round((Date.now() - debut) / 1000)} s.`))
    .catch((e) => {
      console.error(`[${nom}] ÉCHEC :`, e instanceof Error ? e.message : e);
      process.exitCode = 1;
    })
    .finally(() => fermer());
}
