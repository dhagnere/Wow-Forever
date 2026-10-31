import { createInterface } from "node:readline/promises";
import { Writable } from "node:stream";
import { enregistrerAdmin, MOT_DE_PASSE_MINIMUM } from "../auth/comptes";
import { lancer } from "./_lanceur";

/**
 * Crée un compte d'administration, ou remplace son mot de passe (mot de passe perdu).
 *   npm run admin:compte -- silfax
 *   Sur Scalingo : scalingo --app <application> run npm run admin:compte -- silfax
 * Le mot de passe est demandé au clavier sans s'afficher : jamais en argument (il resterait dans l'historique).
 */
async function saisieMasquee(question: string): Promise<string> {
  let muet = false;
  const sortie = new Writable({ write(morceau, enc, fin) { if (!muet) process.stdout.write(morceau, enc); fin(); } });
  const rl = createInterface({ input: process.stdin, output: sortie, terminal: true });
  const reponse = rl.question(question);
  muet = true;
  const texte = await reponse;
  rl.close();
  process.stdout.write("\n");
  return texte;
}

lancer("admin:compte", async () => {
  const identifiant = process.argv[2];
  if (!identifiant) throw new Error("Indiquez l'identifiant : npm run admin:compte -- silfax");
  const mdp = await saisieMasquee(`Mot de passe (${MOT_DE_PASSE_MINIMUM} caractères minimum) : `);
  if ((await saisieMasquee("Confirmez le mot de passe : ")) !== mdp) throw new Error("Les deux saisies diffèrent.");
  const { admin, cree } = await enregistrerAdmin(identifiant, mdp);
  console.log(cree
    ? `Compte « ${admin.identifiant} » créé. Connexion : /admin/connexion/`
    : `Mot de passe de « ${admin.identifiant} » remplacé. Les sessions ouvertes sont fermées.`);
});
