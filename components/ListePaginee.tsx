import Link from "next/link";
import type { Article } from "@/modules/veille";
import { CarteArticle } from "./Articles";

export const PAR_PAGE = 12;

export function pageDemandee(brut: string | string[] | undefined): number {
  const n = Number(Array.isArray(brut) ? brut[0] : brut);
  return Number.isInteger(n) && n > 1 ? Math.min(n, 1000) : 1;
}

export function ListePaginee({ articles, total, page, base }: { articles: Article[]; total: number; page: number; base: string }) {
  const pages = Math.max(1, Math.ceil(total / PAR_PAGE));
  if (!articles.length) return <p className="doux">Aucun article publié pour l&apos;instant. Revenez dès le 5 novembre.</p>;
  return (
    <>
      <div className="g3">{articles.map((a) => <CarteArticle key={a.id} article={a} />)}</div>
      {pages > 1 ? (
        <nav className="pagination" aria-label="Pagination">
          {page > 1 ? <Link href={page === 2 ? base : `${base}?page=${page - 1}`}>← Plus récents</Link> : <span />}
          <span className="doux">Page {page} sur {pages}</span>
          {page < pages ? <Link href={`${base}?page=${page + 1}`}>Plus anciens →</Link> : <span />}
        </nav>
      ) : null}
    </>
  );
}
