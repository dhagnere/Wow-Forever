import Link from "next/link";
import type { Article } from "@/modules/veille";
import { trouverRubrique } from "@/config/taxonomie";
import { dateCourte, tempsDeLecture } from "@/lib/site";
import { Visuel } from "./Visuels";

export function nomRubrique(slug: string): string {
  return trouverRubrique(slug)?.nom ?? slug;
}

/** Fiche parchemin d'un article : image, rubrique en pastille, date et durée de lecture, résumé. */
export function CarteArticle({ article, grande = false }: { article: Article; grande?: boolean }) {
  return (
    <Link href={`/articles/${article.slug}/`} className={`parchemin${grande ? " parchemin-grand une-grand" : ""}`}>
      <span className="parchemin-image">
        {article.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`/medias/${article.image.id}/`} alt="" loading="lazy" />
        ) : (
          <Visuel hauteur="100%" />
        )}
        <span className="parchemin-badge">{nomRubrique(article.rubrique)}</span>
      </span>
      <span className="parchemin-corps">
        <span className="parchemin-meta">
          {article.publieLe ? dateCourte(article.publieLe) : ""} · {tempsDeLecture(article.corps)} min de lecture
        </span>
        <h3>{article.titre}</h3>
        {article.chapo ? <span className="parchemin-resume">{grande ? article.chapo : couper(article.chapo, 150)}</span> : null}
        <span className="parchemin-lien">Lire l&apos;article →</span>
      </span>
    </Link>
  );
}

function couper(texte: string, max: number) {
  return texte.length <= max ? texte : `${texte.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

/** Liste en lignes, façon répertoire : titre, résumé, rubrique et date. */
export function LignesArticles({ articles, vide }: { articles: Article[]; vide?: string }) {
  if (!articles.length) return <p className="doux">{vide ?? "Aucun article pour l'instant."}</p>;
  return (
    <ul className="lignes">
      {articles.map((a) => (
        <li key={a.id}>
          <Link href={`/articles/${a.slug}/`}>
            <span className="ligne-titre">{a.titre}</span>
            {a.chapo ? <span className="ligne-resume">{couper(a.chapo, 160)}</span> : null}
            <span className="ligne-meta">
              <span className="etiquette">{nomRubrique(a.rubrique)}</span>
              <br />
              {a.publieLe ? dateCourte(a.publieLe) : ""}
            </span>
          </Link>
        </li>
      ))}
    </ul>
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
