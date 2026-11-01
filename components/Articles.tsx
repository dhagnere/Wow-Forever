import Link from "next/link";
import type { Article } from "@/modules/veille";
import { trouverRubrique } from "@/config/taxonomie";
import { dateCourte } from "@/lib/site";
import { Visuel } from "./Visuels";

export function nomRubrique(slug: string): string {
  return trouverRubrique(slug)?.nom ?? slug;
}

export function CarteArticle({ article, grande = false }: { article: Article; grande?: boolean }) {
  return (
    <Link href={`/articles/${article.slug}/`} className={`carte cadre${grande ? " carte-grande une-grand" : ""}`}>
      {article.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/medias/${article.image.id}/`} alt="" loading="lazy" style={{ width: "100%", height: grande ? 300 : 150, objectFit: "cover", display: "block" }} />
      ) : (
        <Visuel hauteur={grande ? 300 : 150} />
      )}
      <div className="carte-corps">
        <p className="surtitre">{nomRubrique(article.rubrique)}</p>
        <h3>{article.titre}</h3>
        {grande ? (
          <>
            <p className="doux" style={{ margin: "0 0 12px" }}>{article.chapo}</p>
            <p className="doux" style={{ margin: 0, fontSize: 14 }}>
              Par Silfax · {article.publieLe ? dateCourte(article.publieLe) : ""}
            </p>
          </>
        ) : null}
      </div>
    </Link>
  );
}

export function FilArticles({ articles, vide }: { articles: Article[]; vide?: string }) {
  if (!articles.length) return <p className="doux">{vide ?? "Aucun article pour l'instant."}</p>;
  return (
    <ul className="fil">
      {articles.map((a) => (
        <li key={a.id}>
          <p className="meta">
            {nomRubrique(a.rubrique)} · {a.publieLe ? dateCourte(a.publieLe) : ""}
          </p>
          <Link href={`/articles/${a.slug}/`}>{a.titre}</Link>
        </li>
      ))}
    </ul>
  );
}
