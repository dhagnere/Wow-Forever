/**
 * Messages du compte joueur en anglais (version /en/) : le module renvoie ses messages en français, traduits ici
 * pour la version anglaise. Un message inconnu reste en français plutôt que de disparaître.
 */
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
