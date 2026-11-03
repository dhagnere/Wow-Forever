import Link from "next/link";
import { prixEnTexte } from "@/modules/veille";
import { ficheQuete, nomLieu, type Chaine, type Personne } from "@/lib/quetes";
import { carte, pageLieu } from "@/lib/cartes";

/** Une personne (ou un objet du décor, ou un objet qui lance la quête), avec son lieu et sa position. */
export function Qui({ p }: { p: Personne }) {
  const lieu = p.l && carte(p.l.lieu) ? p.l : null;
  return (
    <span>
      {p.t === "objet" && p.b !== false ? <Link href={`/base-de-donnees/objets/${p.id}/`}>{p.n}</Link> : <strong>{p.n}</strong>}
      {p.t === "decor" ? <span className="doux"> (objet)</span> : null}
      {lieu ? (
        <span className="doux">
          {" "}· <Link href={`${pageLieu(lieu.lieu)}`}>{nomLieu(lieu.lieu)}</Link> ({lieu.x.toLocaleString("fr-FR")} · {lieu.y.toLocaleString("fr-FR")})
        </span>
      ) : p.donjon ? <span className="doux"> · {p.donjon}</span> : null}
    </span>
  );
}

function NomObjet({ o }: { o: { id: number; n: string; b?: boolean } }) {
  return o.b === false ? <>{o.n}</> : <Link href={`/base-de-donnees/objets/${o.id}/`}>{o.n}</Link>;
}

function Etape({ id, rang }: { id: number; rang: number }) {
  const q = ficheQuete(id);
  if (!q) return null;
  const memeReceveur = q.receveurs[0] && q.donneurs[0] && q.receveurs[0].id === q.donneurs[0].id && q.receveurs[0].t === q.donneurs[0].t;
  return (
    <li className="etape-quete">
      <span className="numero-etape" aria-hidden="true">{rang}</span>
      <div>
        <h4>{q.titre} <span className="doux">· niveau {q.niveau}{q.min && q.min < q.niveau ? ` (dès le ${q.min})` : ""}</span></h4>
        <dl className="details-quete">
          {q.donneurs[0] ? <><dt>{q.donneurs[0].t === "objet" ? "Commence avec" : "Donnée par"}</dt><dd><Qui p={q.donneurs[0]} /></dd></> : null}
          {q.objectifs.length ? <><dt>À faire</dt><dd>{q.objectifs.join(" ; ")}</dd></> : null}
          {q.receveurs[0] && !memeReceveur ? <><dt>À rendre à</dt><dd><Qui p={q.receveurs[0]} /></dd></> : null}
          {q.objets.length || q.sorts.length || q.argent ? (
            <>
              <dt>Récompense</dt>
              <dd>
                {[
                  ...q.sorts.map((s) => <span key={s}>apprend <strong>{s}</strong></span>),
                  ...q.objets.filter((o) => !o.choix).map((o) => <span key={o.id}><NomObjet o={o} />{o.q > 1 ? ` × ${o.q}` : ""}</span>),
                  ...(q.objets.some((o) => o.choix)
                    ? [<span key="choix">au choix : {q.objets.filter((o) => o.choix).map((o, i) => <span key={o.id}>{i ? ", " : ""}<NomObjet o={o} /></span>)}</span>]
                    : []),
                  ...(q.argent ? [<span key="argent">{prixEnTexte(q.argent)}</span>] : []),
                ].map((x, i) => <span key={i}>{i ? " · " : ""}{x}</span>)}
              </dd>
            </>
          ) : null}
        </dl>
      </div>
    </li>
  );
}

export function ChaineQuetes({ c }: { c: Chaine }) {
  const niveaux = c.niveaux[0] === c.niveaux[1] ? `niveau ${c.niveaux[0]}` : `niveaux ${c.niveaux[0]} à ${c.niveaux[1]}`;
  return (
    <article className="chaine-quetes" data-races={c.races?.join("|") ?? ""}>
      <header>
        <h3>{c.titre}</h3>
        <p className="sort-meta">
          {niveaux} · {c.quetes.length > 1 ? `${c.quetes.length} quêtes` : "1 quête"}
          {c.races ? <> · <span className="badge-talent">{c.races.join(", ")}</span></> : null}
        </p>
      </header>
      <ol className="etapes-quetes">
        {c.quetes.map((id, i) => <Etape key={id} id={id} rang={i + 1} />)}
      </ol>
    </article>
  );
}
