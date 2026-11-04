import Link from "next/link";
import { compterParRubriqueEn, type Article } from "@/modules/veille";
import { RUBRIQUES } from "@/config/taxonomie";
import { RUBRIQUES_EN } from "@/lib/anglais";
import { LignesArticles } from "./Articles";

/** Répertoire des articles traduits (version anglaise) : rubriques à gauche, liste à droite. */
export async function RepertoireEn({ actif, articles, total, page, base }: { actif?: string; articles: Article[]; total: number; page: number; base: string }) {
  const compteurs = await compterParRubriqueEn();
  const totalSite = Object.values(compteurs).reduce((n, c) => n + c, 0);
  const pages = Math.max(1, Math.ceil(total / 20));
  return (
    <div className="repertoire">
      <nav className="repertoire-categories" aria-label="Topics">
        <p className="surtitre">Topics</p>
        <Link href="/en/news/" aria-current={!actif ? "page" : undefined}>All <span>{totalSite}</span></Link>
        {RUBRIQUES.filter((r) => RUBRIQUES_EN[r.slug] && compteurs[r.slug]).map((r) => (
          <Link key={r.slug} href={`/en/topics/${RUBRIQUES_EN[r.slug].slug}/`} aria-current={actif === r.slug ? "page" : undefined}>
            {RUBRIQUES_EN[r.slug].nom} <span>{compteurs[r.slug]}</span>
          </Link>
        ))}
      </nav>
      <div>
        <p className="doux" style={{ fontSize: 14, margin: "0 0 10px" }}>{total} article{total === 1 ? "" : "s"}</p>
        <LignesArticles langue="en" articles={articles} vide="No article in this topic yet: articles are translated within an hour of their French publication." />
        {pages > 1 ? (
          <nav className="pagination" aria-label="Pagination">
            {page > 1 ? <Link href={page === 2 ? base : `${base}?page=${page - 1}`}>← Newer</Link> : <span />}
            <span className="doux">Page {page} of {pages}</span>
            {page < pages ? <Link href={`${base}?page=${page + 1}`}>Older →</Link> : <span />}
          </nav>
        ) : null}
      </div>
    </div>
  );
}
