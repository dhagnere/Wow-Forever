import Link from "next/link";
import { compterParRubrique, type Article } from "@/modules/veille";
import { RUBRIQUES } from "@/config/taxonomie";
import { LignesArticles } from "./Articles";

/** Répertoire des articles : rubriques et nombre d'articles en ligne à gauche, liste à droite, recherche en tête. */
export async function Repertoire({
  actif, articles, total, page, base, children, requete,
}: {
  actif?: string;
  requete?: string;
  articles: Article[];
  total: number;
  page: number;
  base: string;
  children?: React.ReactNode;
}) {
  const compteurs = await compterParRubrique();
  const enLigne = (slug: string) => compteurs[slug]?.publie ?? 0;
  const totalSite = Object.values(compteurs).reduce((n, c) => n + (c.publie ?? 0), 0);
  const pages = Math.max(1, Math.ceil(total / 20));
  return (
    <div className="repertoire">
      <nav className="repertoire-categories" aria-label="Rubriques">
        <p className="surtitre">Rubriques</p>
        <Link href="/actualites/" aria-current={!actif ? "page" : undefined}>Tout <span>{totalSite}</span></Link>
        {RUBRIQUES.map((r) => (
          <Link key={r.slug} href={`/rubriques/${r.slug}/`} aria-current={actif === r.slug ? "page" : undefined}>
            {r.nom} <span>{enLigne(r.slug)}</span>
          </Link>
        ))}
      </nav>
      <div>
        <form action="/recherche/" method="get" className="recherche" role="search">
          <label htmlFor="q-repertoire" className="sr-only">Rechercher un article</label>
          <input id="q-repertoire" name="q" type="search" placeholder="Une classe, un donjon, une zone…" defaultValue={requete} />
          <button type="submit" className="btn btn-or">Chercher</button>
        </form>
        {children}
        <p className="doux" style={{ fontSize: 14, margin: "0 0 10px" }}>{total} article{total > 1 ? "s" : ""}</p>
        <LignesArticles articles={articles} vide="Aucun article dans cette rubrique pour l'instant." />
        {pages > 1 ? (
          <nav className="pagination" aria-label="Pagination">
            {page > 1 ? <Link href={page === 2 ? base : `${base}?page=${page - 1}`}>← Plus récents</Link> : <span />}
            <span className="doux">Page {page} sur {pages}</span>
            {page < pages ? <Link href={`${base}?page=${page + 1}`}>Plus anciens →</Link> : <span />}
          </nav>
        ) : null}
      </div>
    </div>
  );
}
