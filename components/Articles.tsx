import Link from "next/link";
import type { Article } from "@/modules/veille";
import { trouverRubrique } from "@/config/taxonomie";
import { dateCourte, tempsDeLecture } from "@/lib/site";
import { Visuel } from "./Visuels";
import { ecranArticle } from "@/lib/ecrans";
import { nomRubriqueEn } from "@/lib/anglais";

type Langue = "fr" | "en";
const lien = (a: Article, l: Langue) => (l === "en" ? `/en/articles/${a.slug}/` : `/articles/${a.slug}/`);
const rubrique = (slug: string, l: Langue) => (l === "en" ? nomRubriqueEn(slug) : nomRubrique(slug));
const dateEn = (d: Date) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "Europe/Paris" }).format(d);
const quand = (d: Date | null, l: Langue) => (d ? (l === "en" ? dateEn(d) : dateCourte(d)) : "");
const lecture = (corps: string, l: Langue) => (l === "en" ? `${tempsDeLecture(corps)} min read` : `${tempsDeLecture(corps)} min de lecture`);

export function nomRubrique(slug: string): string {
  return trouverRubrique(slug)?.nom ?? slug;
}

/** Fiche parchemin d'un article : image, rubrique en pastille, date et durée de lecture, résumé. */
export function CarteArticle({ article, grande = false, langue = "fr" }: { article: Article; grande?: boolean; langue?: Langue }) {
  return (
    <Link href={lien(article, langue)} className={`parchemin${grande ? " parchemin-grand une-grand" : ""}`}>
      <span className="parchemin-image">
        {article.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`/medias/${article.image.id}/`} alt="" loading="lazy" />
        ) : (
          <Visuel hauteur="100%" ecran={ecranArticle(article)} />
        )}
        <span className="parchemin-badge">{rubrique(article.rubrique, langue)}</span>
      </span>
      <span className="parchemin-corps">
        <span className="parchemin-meta">
          {quand(article.publieLe, langue)} · {lecture(article.corps, langue)}
        </span>
        <h3>{article.titre}</h3>
        {article.chapo ? <span className="parchemin-resume">{grande ? article.chapo : couper(article.chapo, 150)}</span> : null}
        <span className="parchemin-lien">{langue === "en" ? "Read the article →" : "Lire l'article →"}</span>
      </span>
    </Link>
  );
}

function couper(texte: string, max: number) {
  return texte.length <= max ? texte : `${texte.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

/** Liste en lignes, façon répertoire : titre, résumé, rubrique et date. */
export function LignesArticles({ articles, vide, langue = "fr" }: { articles: Article[]; vide?: string; langue?: Langue }) {
  if (!articles.length) return <p className="doux">{vide ?? (langue === "en" ? "No article yet." : "Aucun article pour l'instant.")}</p>;
  return (
    <ul className="lignes">
      {articles.map((a) => (
        <li key={a.id}>
          <Link href={lien(a, langue)}>
            <span className="ligne-titre">{a.titre}</span>
            {a.chapo ? <span className="ligne-resume">{couper(a.chapo, 160)}</span> : null}
            <span className="ligne-meta">
              <span className="etiquette">{rubrique(a.rubrique, langue)}</span>
              <br />
              {quand(a.publieLe, langue)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function FilArticles({ articles, vide, langue = "fr" }: { articles: Article[]; vide?: string; langue?: Langue }) {
  if (!articles.length) return <p className="doux">{vide ?? (langue === "en" ? "No article yet." : "Aucun article pour l'instant.")}</p>;
  return (
    <ul className="fil">
      {articles.map((a) => (
        <li key={a.id}>
          <p className="meta">
            {rubrique(a.rubrique, langue)} · {quand(a.publieLe, langue)}
          </p>
          <Link href={lien(a, langue)}>{a.titre}</Link>
        </li>
      ))}
    </ul>
  );
}
