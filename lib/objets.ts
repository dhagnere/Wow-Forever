import type { FiltresObjets } from "@/modules/veille";

type Params = Record<string, string | string[] | undefined>;

function premier(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v ?? "").trim();
}

function entierBorne(v: string, min: number, max: number): number | undefined {
  if (!/^-?\d{1,6}$/.test(v)) return undefined;
  const n = Number(v);
  return n >= min && n <= max ? n : undefined;
}

/** Filtres de la liste d'objets, lus dans l'adresse et bornés. */
export function lireFiltres(p: Params): FiltresObjets {
  return {
    q: premier(p.q).slice(0, 80) || undefined,
    classe: entierBorne(premier(p.classe), 0, 99),
    sousClasse: entierBorne(premier(p.sous), -1, 99),
    qualite: entierBorne(premier(p.qualite), 0, 7),
    niveauMin: entierBorne(premier(p.min), 0, 100),
    niveauMax: entierBorne(premier(p.max), 0, 100),
    page: entierBorne(premier(p.page), 1, 10000) ?? 1,
  };
}

/** Adresse de la liste avec ces filtres ; la page 1 n'apparaît pas dans l'adresse. */
export function urlObjets(f: FiltresObjets, changements: Partial<FiltresObjets> = {}): string {
  const g = { ...f, ...changements };
  const p = new URLSearchParams();
  if (g.q) p.set("q", g.q);
  if (g.classe !== undefined) p.set("classe", String(g.classe));
  if (g.classe !== undefined && g.sousClasse !== undefined) p.set("sous", String(g.sousClasse));
  if (g.qualite !== undefined) p.set("qualite", String(g.qualite));
  if (g.niveauMin !== undefined) p.set("min", String(g.niveauMin));
  if (g.niveauMax !== undefined) p.set("max", String(g.niveauMax));
  if (g.page && g.page > 1) p.set("page", String(g.page));
  const s = p.toString();
  return `/base-de-donnees/objets/${s ? `?${s}` : ""}`;
}

/** Seules les listes par catégorie sont indexées ; les recherches et filtres fins ne le sont pas. */
export function listeIndexable(f: FiltresObjets): boolean {
  return !f.q && f.qualite === undefined && f.niveauMin === undefined && f.niveauMax === undefined && (f.page ?? 1) === 1;
}
