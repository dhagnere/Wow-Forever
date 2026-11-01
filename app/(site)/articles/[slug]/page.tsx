import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { lirePublie, listerPublies, markdownVersHtml } from "@/modules/veille";
import { CarteArticle, nomRubrique } from "@/components/Articles";
import { Ariane } from "@/components/Ariane";
import { JsonLd } from "@/components/JsonLd";
import { LigneSource } from "@/components/Sources";
import { SITE, dateLongue, tempsDeLecture } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

/** Image d'aperçu (Facebook, Google) : l'image d'en-tête recadrée si elle existe, sinon l'image générée par le site. */
function imageOuverture(article: { image: { id: number } | null }, urlArticle: string): string {
  return article.image ? `${SITE.url}/medias/${article.image.id}/og/` : `${urlArticle}image/`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await lirePublie((await params).slug);
  if (!article) return { title: "Article introuvable" };
  const url = `/articles/${article.slug}/`;
  return {
    title: article.titre,
    description: article.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: article.titre,
      description: article.texteFacebook || article.description,
      publishedTime: article.publieLe?.toISOString(),
      modifiedTime: article.modifieLe.toISOString(),
      authors: [SITE.auteur],
      tags: article.etiquettes,
      images: [{ url: imageOuverture(article, url), width: 1200, height: 630, alt: article.image?.alt || article.titre }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function PageArticle({ params }: Props) {
  const article = await lirePublie((await params).slug);
  if (!article) notFound();
  const memeTheme = await listerPublies({ rubrique: article.rubrique, limite: 3, sauf: article.id });
  const url = `${SITE.url}/articles/${article.slug}/`;
  const partageFacebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  return (
    <div className="wrap contenu">
      <JsonLd
        donnees={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: article.titre,
          description: article.description,
          datePublished: article.publieLe?.toISOString(),
          dateModified: article.modifieLe.toISOString(),
          author: { "@type": "Person", name: SITE.auteur, url: `${SITE.url}/a-propos/` },
          publisher: { "@type": "Organization", name: SITE.nom, url: SITE.url },
          image: article.image ? [`${SITE.url}/medias/${article.image.id}/`, imageOuverture(article, url)] : [imageOuverture(article, url)],
          mainEntityOfPage: url,
          inLanguage: "fr-FR",
          keywords: article.etiquettes.join(", "),
        }}
      />
      <Ariane etapes={[{ nom: nomRubrique(article.rubrique), href: `/rubriques/${article.rubrique}/` }, { nom: article.titre }]} />

      <div className="colonnes">
        <article className="article" style={{ flex: "999 1 600px", minWidth: 0 }}>
          <p className="surtitre">{nomRubrique(article.rubrique)}</p>
          <h1>{article.titre}</h1>
          <div className="article-meta">
            <span className="avatar" aria-hidden="true">S</span>
            <span>
              Par <Link href="/a-propos/">Silfax</Link> · {article.publieLe ? dateLongue(article.publieLe) : ""} ·{" "}
              {tempsDeLecture(article.corps)} min de lecture
            </span>
          </div>

          {article.image ? (
            <figure className="image-une">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/medias/${article.image.id}/`} alt={article.image.alt} fetchPriority="high" />
              {article.image.credit ? <figcaption>{article.image.credit}</figcaption> : null}
            </figure>
          ) : null}

          {article.chapo ? <p className="chapo-article">{article.chapo}</p> : null}
          <div className="corps" dangerouslySetInnerHTML={{ __html: markdownVersHtml(article.corps) }} />

          <section className="avis" aria-labelledby="t-avis">
            <div className="avis-titre">
              <span className="avatar" aria-hidden="true">S</span>
              <h2 id="t-avis">L&apos;avis de Silfax</h2>
            </div>
            <div className="corps" style={{ fontSize: 17 }} dangerouslySetInnerHTML={{ __html: markdownVersHtml(article.avisSilfax) }} />
          </section>

          <div className="partage">
            <a href={partageFacebook} className="btn btn-facebook" rel="noopener noreferrer" target="_blank">Partager sur Facebook</a>
          </div>

          {article.etiquettes.length ? (
            <ul className="puces" aria-label="Étiquettes" style={{ marginBottom: 24 }}>
              {article.etiquettes.map((e) => <li key={e} className="puce puce-douce">{e}</li>)}
            </ul>
          ) : null}

          {article.sources.length ? (
            <section className="sources" aria-labelledby="t-sources">
              <h2 id="t-sources">Sources</h2>
              <ul>
                {article.sources.map((s) => <LigneSource key={s.url} source={s} />)}
              </ul>
            </section>
          ) : null}
        </article>

        <aside className="colonne-laterale">
          {article.pilier ? (
            <div className="encadre-nuit">
              <h2 className="titre" style={{ margin: "0 0 6px", fontSize: 19, color: "var(--or-clair)" }}>Pour aller plus loin</h2>
              <p style={{ margin: "0 0 14px", fontSize: 15, color: "#cfc7b4" }}>La page de référence sur ce sujet, mise à jour à chaque article.</p>
              <Link href={`/${article.pilier}/`} className="btn btn-or">Voir la page</Link>
            </div>
          ) : null}
          <div className="encadre-nuit">
            <h2 className="titre" style={{ margin: "0 0 6px", fontSize: 19, color: "var(--or-clair)" }}>Bien démarrer</h2>
            <p style={{ margin: "0 0 14px", fontSize: 15, color: "#cfc7b4" }}>Classe, race, serveur, premières quêtes : le guide pour débutants et revenants.</p>
            <Link href="/guides/bien-demarrer/" className="btn btn-or">Lire le guide</Link>
          </div>
        </aside>
      </div>

      {memeTheme.length ? (
        <section aria-labelledby="t-aussi" style={{ marginTop: 64 }}>
          <h2 id="t-aussi" className="section-titre" style={{ fontSize: 26 }}>À lire aussi</h2>
          <div className="g3">{memeTheme.map((a) => <CarteArticle key={a.id} article={a} />)}</div>
        </section>
      ) : null}
    </div>
  );
}
