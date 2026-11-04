import Link from "next/link";
import { prixEnTexte } from "@/modules/veille";
import { ficheQuete, nomLieu, type Chaine, type Personne } from "@/lib/quetes";
import { carte, pageLieu } from "@/lib/cartes";
import { pageLieuEn } from "@/lib/anglais";

type Langue = "fr" | "en";
const TXT = {
  fr: {
    objet: " (objet)", niveau: "niveau", des: (n: number) => ` (dès le ${n})`, commence: "Commence avec", donnee: "Donnée par", faire: "À faire",
    rendre: "À rendre à", recompense: "Récompense", apprend: "apprend", choix: "au choix : ", niveaux: (a: number, b: number) => (a === b ? `niveau ${a}` : `niveaux ${a} à ${b}`),
    quetes: (n: number) => (n > 1 ? `${n} quêtes` : "1 quête"), nombre: "fr-FR", pv: " ; ",
  },
  en: {
    objet: " (object)", niveau: "level", des: (n: number) => ` (from ${n})`, commence: "Starts with", donnee: "Given by", faire: "To do",
    rendre: "Turn in to", recompense: "Reward", apprend: "teaches", choix: "choice of: ", niveaux: (a: number, b: number) => (a === b ? `level ${a}` : `levels ${a} to ${b}`),
    quetes: (n: number) => (n > 1 ? `${n} quests` : "1 quest"), nombre: "en-GB", pv: "; ",
  },
} as const;
const urlObjet = (id: number, l: Langue) => (l === "en" ? `/en/item-database/items/${id}/` : `/base-de-donnees/objets/${id}/`);

/** Une personne (ou un objet du décor, ou un objet qui lance la quête), avec son lieu et sa position. */
export function Qui({ p, langue = "fr" }: { p: Personne; langue?: Langue }) {
  const t = TXT[langue];
  const lieu = p.l && carte(p.l.lieu) ? p.l : null;
  return (
    <span>
      {p.t === "objet" && p.b !== false ? <Link href={urlObjet(p.id, langue)}>{p.n}</Link> : <strong>{p.n}</strong>}
      {p.t === "decor" ? <span className="doux">{t.objet}</span> : null}
      {lieu ? (
        <span className="doux">
          {" "}· <Link href={langue === "en" ? pageLieuEn(lieu.lieu) : pageLieu(lieu.lieu)}>{nomLieu(lieu.lieu, langue)}</Link> ({lieu.x.toLocaleString(t.nombre)} · {lieu.y.toLocaleString(t.nombre)})
        </span>
      ) : p.donjon ? <span className="doux"> · {p.donjon}</span> : null}
    </span>
  );
}

function NomObjet({ o, langue }: { o: { id: number; n: string; b?: boolean }; langue: Langue }) {
  return o.b === false ? <>{o.n}</> : <Link href={urlObjet(o.id, langue)}>{o.n}</Link>;
}

function Etape({ id, rang, langue }: { id: number; rang: number; langue: Langue }) {
  const t = TXT[langue];
  const q = ficheQuete(id, langue);
  if (!q) return null;
  const memeReceveur = q.receveurs[0] && q.donneurs[0] && q.receveurs[0].id === q.donneurs[0].id && q.receveurs[0].t === q.donneurs[0].t;
  return (
    <li className="etape-quete">
      <span className="numero-etape" aria-hidden="true">{rang}</span>
      <div>
        <h4>{q.titre} <span className="doux">· {t.niveau} {q.niveau}{q.min && q.min < q.niveau ? t.des(q.min) : ""}</span></h4>
        <dl className="details-quete">
          {q.donneurs[0] ? <><dt>{q.donneurs[0].t === "objet" ? t.commence : t.donnee}</dt><dd><Qui p={q.donneurs[0]} langue={langue} /></dd></> : null}
          {q.objectifs.length ? <><dt>{t.faire}</dt><dd>{q.objectifs.join(t.pv)}</dd></> : null}
          {q.receveurs[0] && !memeReceveur ? <><dt>{t.rendre}</dt><dd><Qui p={q.receveurs[0]} langue={langue} /></dd></> : null}
          {q.objets.length || q.sorts.length || q.argent ? (
            <>
              <dt>{t.recompense}</dt>
              <dd>
                {[
                  ...q.sorts.map((s) => <span key={s}>{t.apprend} <strong>{s}</strong></span>),
                  ...q.objets.filter((o) => !o.choix).map((o) => <span key={o.id}><NomObjet o={o} langue={langue} />{o.q > 1 ? ` × ${o.q}` : ""}</span>),
                  ...(q.objets.some((o) => o.choix)
                    ? [<span key="choix">{t.choix}{q.objets.filter((o) => o.choix).map((o, i) => <span key={o.id}>{i ? ", " : ""}<NomObjet o={o} langue={langue} /></span>)}</span>]
                    : []),
                  ...(q.argent ? [<span key="argent">{prixEnTexte(q.argent, langue)}</span>] : []),
                ].map((x, i) => <span key={i}>{i ? " · " : ""}{x}</span>)}
              </dd>
            </>
          ) : null}
        </dl>
      </div>
    </li>
  );
}

export function ChaineQuetes({ c, langue = "fr" }: { c: Chaine; langue?: Langue }) {
  const t = TXT[langue];
  const niveaux = t.niveaux(c.niveaux[0], c.niveaux[1]);
  return (
    <article className="chaine-quetes" data-races={c.races?.join("|") ?? ""}>
      <header>
        <h3>{c.titre}</h3>
        <p className="sort-meta">
          {niveaux} · {t.quetes(c.quetes.length)}
          {c.races ? <> · <span className="badge-talent">{c.races.join(", ")}</span></> : null}
        </p>
      </header>
      <ol className="etapes-quetes">
        {c.quetes.map((id, i) => <Etape key={id} id={id} rang={i + 1} langue={langue} />)}
      </ol>
    </article>
  );
}
