/**
 * Descriptions des sorts : le jeu stocke des modèles (« inflige $s1 points de dégâts en $d ») que son interface
 * remplit au moment d'afficher l'infobulle. On les remplit ici de la même façon, pour un personnage sans bonus
 * (ni talent, ni puissance des sorts, ni puissance d'attaque), au niveau où le rang s'apprend.
 *
 * Jetons pris en charge : $s $m $M $o $t $d $a $n $h $u $x $i $r $b $e (avec ou sans numéro de sort devant),
 * $/N; et $*N; (division, multiplication), ${formule}.N, $?condition[oui][non] (on suit toujours « non » : aucun talent),
 * $<variable>, $lsingulier:pluriel;, $gmasculin:féminin;, $@spelldesc / $@spellname.
 * Un jeton inconnu, ou propre au personnage (puissance d'attaque, dégâts de l'arme), est affiché « X ».
 */

export interface EffetSort {
  index: number;
  effet: number;
  aura: number;
  base: number;
  variance: number;
  /** Période des effets périodiques, en millisecondes. */
  periode: number;
  ciblesChainees: number;
  /** Rayon, en mètres. */
  rayon: number;
  pointsParRessource: number;
  amplitude: number;
  misc: number;
  declencheur: number;
  /** Coefficient par point de ressource (rage convertie d'Exécution…) : jeton $F. */
  coefficientChaine: number;
}

export interface DonneesSort {
  id: number;
  nom: string;
  description: string;
  /** Durée en millisecondes (null : aucune ; -1 : jusqu'à annulation). */
  duree: number | null;
  effets: EffetSort[];
  charges: number;
  chance: number;
  cumul: number;
  ciblesMax: number;
  /** Niveau maximal des cibles (Apaisement…) : jeton $v. */
  niveauMaxCible: number;
  /** Portée maximale, en mètres. */
  portee: number;
  variables: string;
}

export type Recherche = (id: number) => DonneesSort | undefined;

/** Variables partagées ($<frostdamage>…) : un sort peut en utiliser une sans la déclarer lui-même. */
export type Variables = Map<string, string>;

/** Niveau du personnage retenu pour les formules ($PL). */
export const NIVEAU_FORMULES = 60;

/** Bonus d'équipement comptés à zéro : puissance des sorts et des soins (un personnage sans équipement n'en a pas). */
const VALEURS_NULLES = new Set(["SPS", "SPFI", "SPFR", "SPN", "SPA", "SPH", "SP", "sp", "bh", "BH", "bc", "BC", "SPI", "spi"]);
/** Puissance d'attaque, dégâts de l'arme : propres à chaque personnage, la valeur reste « X ». */
const VALEURS_PERSONNAGE = new Set(["AP", "ap", "RAP", "rap", "apm", "APM", "mw", "MW", "mwb", "MWB", "mws", "MWS", "MWb"]);
const FONCTIONS = new Set(["cond", "gt", "lt", "gte", "lte", "eq", "max", "min", "floor", "ceil", "abs", "clamp", "round"]);
const LETTRES = "sSmMwWotTdDaAnhuxirRbeqFv";

export function nombreFr(n: number, decimales?: number): string {
  if (!Number.isFinite(n)) return "X";
  const v = decimales === undefined ? Math.round(n) : Number(n.toFixed(decimales));
  return v.toLocaleString("fr-FR", { maximumFractionDigits: decimales ?? 0, minimumFractionDigits: 0 }).replace(/ /g, " ");
}

export function dureeFr(ms: number): string {
  if (ms < 0) return "jusqu'à annulation";
  const s = ms / 1000;
  if (s >= 3600 && s % 360 === 0) return `${nombreFr(s / 3600, 1)} h`;
  if (s >= 60 && s % 6 === 0) return `${nombreFr(s / 60, 1)} min`;
  return `${nombreFr(s, 1)} s`;
}

interface Contexte {
  sort: DonneesSort;
  chercher: Recherche;
  profondeur: number;
  incomplet: { oui: boolean };
  /** Dans une formule ${…} : on rend des nombres bruts, sans mise en forme. */
  formule: boolean;
  variables: Map<string, string>;
  communes: Variables;
}

export function lireVariables(texte: string): Map<string, string> {
  const m = new Map<string, string>();
  for (const ligne of texte.split(/\r?\n/)) {
    const r = /^\s*\$(\w+)\s*=(.*)$/.exec(ligne);
    if (r) m.set(r[1], r[2].trim());
  }
  return m;
}

/** Fin d'un bloc ouvert par `ouvrant` à la position i (sur le caractère ouvrant). */
function fermeture(t: string, i: number, ouvrant: string, fermant: string): number {
  let niveau = 0;
  for (let k = i; k < t.length; k++) {
    if (t[k] === ouvrant) niveau++;
    else if (t[k] === fermant && --niveau === 0) return k;
  }
  return -1;
}

function effetDe(s: DonneesSort, index: number): EffetSort | undefined {
  return s.effets.find((e) => e.index === index - 1) ?? (index <= 1 ? s.effets[0] : undefined);
}

const arrondi = (n: number) => Math.round(n);

/** Valeur numérique brute d'un jeton (null : inconnu). */
function valeurJeton(lettre: string, cible: DonneesSort, index: number): number | null {
  const e = effetDe(cible, index || 1);
  switch (lettre) {
    case "s": case "S": case "w": case "W": case "m": case "M": {
      if (!e) return null;
      if (lettre !== "m" && lettre !== "M") return e.base;
      if (!e.variance) return e.base;
      return arrondi(e.base * (lettre === "m" ? 1 - e.variance / 2 : 1 + e.variance / 2));
    }
    case "o": {
      if (!e) return null;
      const d = cible.duree ?? 0;
      return e.periode > 0 && d > 0 ? e.base * Math.floor(d / e.periode) : e.base;
    }
    case "t": case "T": return e ? e.periode / 1000 : null;
    case "d": case "D": return cible.duree === null ? null : cible.duree / 1000;
    case "a": case "A": return e?.rayon || Math.max(0, ...cible.effets.map((x) => x.rayon)) || null;
    case "F": return e ? e.coefficientChaine : null;
    case "v": return cible.niveauMaxCible || null;
    case "n": return cible.charges;
    case "h": return cible.chance;
    case "u": return cible.cumul;
    case "x": return e ? e.ciblesChainees : null;
    case "i": return cible.ciblesMax;
    case "r": case "R": return cible.portee;
    case "b": return e ? e.pointsParRessource : null;
    case "e": return e ? e.amplitude : null;
    case "q": return e ? e.misc : null;
  }
  return null;
}

/** Rendu affiché d'un jeton hors formule. */
function texteJeton(lettre: string, cible: DonneesSort, index: number, facteur: number): string | null {
  const e = effetDe(cible, index || 1);
  if ((lettre === "s" || lettre === "S") && e && e.variance && facteur === 1) {
    const min = Math.abs(arrondi(e.base * (1 - e.variance / 2)));
    const max = Math.abs(arrondi(e.base * (1 + e.variance / 2)));
    return min === max ? nombreFr(min) : `${nombreFr(min)} à ${nombreFr(max)}`;
  }
  if ((lettre === "d" || lettre === "D") && facteur === 1) {
    return cible.duree === null ? null : dureeFr(cible.duree);
  }
  const v = valeurJeton(lettre, cible, index);
  if (v === null) return null;
  const n = Math.abs(v * facteur);
  return nombreFr(n, Number.isInteger(n) ? 0 : 1);
}

function rendre(t: string, c: Contexte): string {
  let sortie = "";
  let i = 0;
  const inconnu = (brut: string) => {
    c.incomplet.oui = true;
    return c.formule ? "NaN" : "X";
  };
  while (i < t.length) {
    const ch = t[i];
    if (ch !== "$") {
      sortie += ch;
      i++;
      continue;
    }
    const reste = t.slice(i + 1);

    // ${formule} avec décimales éventuelles : ${…}.1
    if (reste[0] === "{") {
      const fin = fermeture(t, i + 1, "{", "}");
      if (fin < 0) { sortie += inconnu("{"); break; }
      const interieur = rendre(t.slice(i + 2, fin), { ...c, formule: true });
      const valeur = evaluer(interieur);
      i = fin + 1;
      let decimales: number | undefined;
      const d = /^\.(\d)/.exec(t.slice(i));
      if (d) { decimales = Number(d[1]); i += 2; }
      if (valeur === null) sortie += inconnu("formule");
      else sortie += c.formule ? String(valeur) : nombreFr(Math.abs(valeur), decimales);
      continue;
    }

    // $?condition[oui]?autre[…][non] : sans talent ni aura, on garde la dernière branche.
    if (reste[0] === "?") {
      let k = i + 2;
      let derniere = "";
      for (;;) {
        const ouvre = t.indexOf("[", k);
        if (ouvre < 0) break;
        const fin = fermeture(t, ouvre, "[", "]");
        if (fin < 0) break;
        derniere = t.slice(ouvre + 1, fin);
        k = fin + 1;
        if (t[k] === "[") continue;
        if (t[k] === "?") { k++; continue; }
        // Une condition suivie d'un seul bloc : la branche « non » est vide.
        if (t[k] !== "[") {
          const blocs = t.slice(i, k).match(/\]\[/g)?.length ?? 0;
          if (!blocs) derniere = "";
        }
        break;
      }
      sortie += rendre(derniere, c);
      i = k;
      continue;
    }

    // $<variable>
    if (reste[0] === "<") {
      const fin = t.indexOf(">", i);
      const nom = t.slice(i + 2, fin);
      const def = c.variables.get(nom) ?? c.communes.get(nom);
      i = fin + 1;
      if (def === undefined || c.profondeur > 8) { sortie += inconnu(nom); continue; }
      sortie += rendre(def, { ...c, profondeur: c.profondeur + 1 });
      continue;
    }

    // $lsingulier:pluriel; et $gmasculin:féminin;
    const lg = /^([lLgG])([^:;$]*):([^;]*);/.exec(reste);
    if (lg) {
      if (lg[1].toLowerCase() === "g") sortie += lg[2];
      else {
        const nombres = sortie.replace(/ /g, "").match(/-?\d+(?:,\d+)?/g);
        const dernier = nombres ? Math.abs(Number(nombres[nombres.length - 1].replace(",", "."))) : 1;
        // Après une valeur inconnue (« X »), le pluriel se lit mieux.
        const apresX = /\bX[\s\u00a0]*$/.test(sortie);
        sortie += apresX || dernier >= 2 ? lg[3] : lg[2];
      }
      i += 1 + lg[0].length;
      continue;
    }

    // $@spelldesc123, $@spellname123
    const ar = /^@(spelldesc|spellname|spelltooltip|spellaura)(\d+)/.exec(reste);
    if (ar) {
      i += 1 + ar[0].length;
      const autre = c.chercher(Number(ar[2]));
      if (!autre || c.profondeur > 3) { sortie += inconnu(ar[0]); continue; }
      if (ar[1] === "spellname") sortie += autre.nom;
      else if (ar[1] === "spellaura") sortie += inconnu(ar[0]);
      else sortie += rendre(autre.description, { ...c, sort: autre, profondeur: c.profondeur + 1, variables: lireVariables(autre.variables) });
      continue;
    }

    // $*  (simple signe de multiplication dans une formule)
    if (reste[0] === "*" && !/^\*\d/.test(reste)) {
      sortie += "*";
      i += 2;
      continue;
    }

    // Noms (fonctions de formule, caractéristiques du personnage).
    const mot = /^([A-Za-z]+)/.exec(reste)?.[1] ?? "";
    if (FONCTIONS.has(mot) && reste[mot.length] === "(") { sortie += mot; i += 1 + mot.length; continue; }
    if (mot === "PL" || mot === "pl") { sortie += String(NIVEAU_FORMULES); i += 1 + mot.length; continue; }
    if (VALEURS_NULLES.has(mot)) { sortie += "0"; i += 1 + mot.length; continue; }
    if (VALEURS_PERSONNAGE.has(mot)) { sortie += inconnu(mot); i += 1 + mot.length; continue; }
    if (mot === "z" && !/^z\d/.test(reste)) { sortie += "votre foyer"; i += 2; continue; }

    // $/1000;S1, $*5;s1, $12345s1, $d, $s2…
    const j = /^(?:([/*])(\d+(?:\.\d+)?);)?(\d*)([A-Za-z])(\d?)/.exec(reste);
    if (j && LETTRES.includes(j[4])) {
      const [brut, op, nb, idSort, lettre, idx] = j;
      i += 1 + brut.length;
      const cible = idSort ? c.chercher(Number(idSort)) : c.sort;
      const facteur = op === "/" ? 1 / Number(nb) : op === "*" ? Number(nb) : 1;
      if (!cible) { sortie += inconnu(brut); continue; }
      if (c.formule) {
        const v = valeurJeton(lettre, cible, Number(idx || 0));
        if (v === null) sortie += inconnu(brut);
        else sortie += `(${v * facteur})`;
      } else {
        const v = texteJeton(lettre, cible, Number(idx || 0), facteur);
        sortie += v ?? inconnu(brut);
      }
      continue;
    }

    sortie += inconnu(reste.slice(0, 6));
    i += 1 + (mot.length || 1);
  }
  return sortie;
}

/* ---- Évaluation des formules (+ - * / parenthèses et quelques fonctions), sans eval ---- */

export function evaluer(expr: string): number | null {
  const jetons = expr.match(/\d+(?:\.\d+)?(?:e[-+]?\d+)?|NaN|[A-Za-z]+|[-+*/(),]|\S/g) ?? [];
  let p = 0;
  const voir = () => jetons[p];
  const prendre = () => jetons[p++];
  function primaire(): number {
    const j = prendre();
    if (j === undefined) throw new Error("fin");
    if (j === "(") { const v = somme(); if (prendre() !== ")") throw new Error(")"); return v; }
    if (j === "-") return -primaire();
    if (j === "+") return primaire();
    if (j === "NaN") return NaN;
    if (/^\d/.test(j)) return Number(j);
    if (FONCTIONS.has(j)) {
      if (prendre() !== "(") throw new Error("(");
      const args: number[] = [];
      if (voir() !== ")") {
        for (;;) {
          args.push(somme());
          if (voir() === ",") { p++; continue; }
          break;
        }
      }
      if (prendre() !== ")") throw new Error(")");
      const [a = 0, b = 0, c = 0] = args;
      switch (j) {
        case "cond": return a ? b : c;
        case "gt": return a > b ? 1 : 0;
        case "lt": return a < b ? 1 : 0;
        case "gte": return a >= b ? 1 : 0;
        case "lte": return a <= b ? 1 : 0;
        case "eq": return a === b ? 1 : 0;
        case "max": return Math.max(...args);
        case "min": return Math.min(...args);
        case "floor": return Math.floor(a);
        case "ceil": return Math.ceil(a);
        case "round": return Math.round(a);
        case "abs": return Math.abs(a);
        case "clamp": return Math.min(Math.max(a, b), c);
      }
    }
    throw new Error(`jeton ${j}`);
  }
  function produit(): number {
    let v = primaire();
    while (voir() === "*" || voir() === "/") {
      const op = prendre();
      const d = primaire();
      v = op === "*" ? v * d : v / d;
    }
    return v;
  }
  function somme(): number {
    let v = produit();
    while (voir() === "+" || voir() === "-") {
      const op = prendre();
      const d = produit();
      v = op === "+" ? v + d : v - d;
    }
    return v;
  }
  try {
    const v = somme();
    if (p !== jetons.length || !Number.isFinite(v)) return null;
    return v;
  } catch {
    return null;
  }
}

export function decrire(sort: DonneesSort, chercher: Recherche, texte = sort.description, communes: Variables = new Map()): { texte: string; complet: boolean } {
  const incomplet = { oui: false };
  const brut = rendre(texte, { sort, chercher, profondeur: 0, incomplet, formule: false, variables: lireVariables(sort.variables), communes });
  return {
    texte: brut
      .replace(/[ \t]+/g, " ")
      .replace(/ ([,.])/g, "$1")
      // « pendant $d s » : l'unité figure déjà dans la durée.
      .replace(/(\u00a0(?:s|min|h)) s\b/g, "$1")
      .replace(/\r?\n\s*\r?\n+/g, "\n")
      .trim(),
    complet: !incomplet.oui,
  };
}
