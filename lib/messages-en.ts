/**
 * Messages du compte joueur en anglais (version /en/) : le module renvoie ses messages en français, traduits ici
 * pour la version anglaise. Un message inconnu reste en français plutôt que de disparaître.
 */
const CHAMPS_GUILDE: Record<string, string> = { nom: "guild name", description: "presentation", horaires: "play times", "contact en jeu": "in-game contact" };

const MESSAGES: [RegExp, string | ((m: RegExpExecArray) => string)][] = [
  [/^Trop de comptes créés depuis cette connexion aujourd'hui/, "Too many accounts created from this connection today. Please try again tomorrow."],
  [/^Ce pseudo est déjà pris/, "This username is already taken."],
  [/^Un compte existe déjà avec cette adresse/, "An account already exists with this address. Please log in."],
  [/^Adresse ou mot de passe incorrect/, "Incorrect email address or password."],
  [/^Trop d'essais : réessayez dans (\d+) minutes/, (m) => `Too many attempts: try again in ${m[1]} minutes, or choose a new password.`],
  [/^Au moins (\d+) caractères/, (m) => `At least ${m[1]} characters.`],
  [/^200 caractères au plus/, "200 characters at most."],
  [/^Évitez d'y mettre votre pseudo ou votre adresse/, "Avoid using your username or email address in it."],
  [/^Ce mot de passe est trop facile à deviner/, "This password is too easy to guess."],
  [/^De 3 à 24 caractères/, "3 to 24 characters: letters, digits, spaces, hyphens or apostrophes."],
  [/^Cette adresse ne semble pas valide/, "This email address does not look valid."],
  [/^Les deux mots de passe ne sont pas identiques/, "The two passwords do not match."],
  // Tableau des guildes
  [/^Merci, la fiche est en relecture/, "Thank you, the listing is being reviewed."],
  [/^Cochez la case : vous représentez la guilde/, "Tick the box: you represent the guild and accept the board's rules."],
  [/^Le nom de la guilde est obligatoire/, "The guild name is required (at least 2 characters)."],
  [/^Indiquez le serveur/, "Give the guild's realm."],
  [/^Choisissez la faction/, "Choose the faction: Alliance or Horde."],
  [/^Choisissez le type de royaume/, "Choose the realm type."],
  [/^Présentez la guilde en quelques phrases/, "Present the guild in a few sentences (at least 40 characters)."],
  [/^Le lien Discord doit être une invitation/, "The Discord link must be an invite (discord.gg/… or discord.com/invite/…)."],
  [/^Le site de la guilde doit être une adresse https/, "The guild website must be a valid https address."],
  [/^Pas de lien dans le champ « (.+) »/, (m) => `No link in the “${CHAMPS_GUILDE[m[1]] ?? m[1]}” field: use the Discord and website fields.`],
  [/^Donnez au moins un moyen de contact/, "Give at least one way to get in touch: Discord, website or a character to contact in game."],
  [/^Trop de fiches déposées aujourd'hui/, "Too many listings submitted from this connection today. Please try again tomorrow."],
  [/^Cette guilde a déjà sa fiche/, "This guild already has a listing. To edit it, use the link you received when registering, or write to us."],
  [/^Lien de modification invalide/, "Invalid edit link."],
  [/^Fiche mise à jour\. Jobwow relit/, "Listing updated. Jobwow reviews the changes; the listing stays visible meanwhile."],
];

export function messageEn(m: string): string {
  for (const [motif, en] of MESSAGES) {
    const r = motif.exec(m);
    if (r) return typeof en === "string" ? en : en(r);
  }
  return m;
}

export function erreursEn(e: Record<string, string> | undefined): Record<string, string> | undefined {
  return e ? Object.fromEntries(Object.entries(e).map(([k, v]) => [k, messageEn(v)])) : e;
}
