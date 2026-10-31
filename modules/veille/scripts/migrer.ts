import { migrer } from "../db/migrer";
import { lancer } from "./_lanceur";

lancer("db:migrate", async () => {
  await migrer();
  console.log("Schéma de la base à jour.");
});
