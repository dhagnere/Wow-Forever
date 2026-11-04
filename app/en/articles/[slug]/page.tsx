import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { lirePublie, lirePublieEn, listerPubliesEn, markdownVersHtml, sourcesPubliees } from "@/modules/veille";
import { CarteArticle } from "@/components/Articles";
import { Ariane } from "@/components/Ariane";
import { JsonLd } from "@/components/JsonLd";
import { LigneSourceEn } from "@/components/SourceEn";
import { IllustrationEcran } from "@/components/Visuels";
import { SITE, tempsDeLecture } from "@/lib/site";
import { ecranArticle } from "@/lib/ecrans";
import { cheminAnglais, nomRubriqueEn, pageRubriqueEn } from "@/lib/anglais";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

const dateEn = (d: Date) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(d);

/** HTML déjà filtré par markdownVersHtml : seuls les liens internes changent, vers leur page anglaise quand elle existe. */
const liensAnglais = (html: string) => html.replace(/href="(\/[^"#?]*)/g, (m, chemin: string) => (chemin.startsWith("/en/") ? m : `href="${cheminAnglais(chemin) ?? chemin}`));

const imageOuverture = (a: { image: { id: number } | null; slug: string }) => (a.image ? `${SITE.url}/medias/${a.image.id}/og/` : `${SITE.url}/articles/${a.slug}/image/`);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const a = await lirePublieEn(slug);
  if (!a) {
    const fr = await lirePublie(slug);
    return fr ? { title: "Article not translated yet", robots: { index: false, follow: true } } : { title: "Article not found" };
  }
  const fr = `/articles/${a.slug}/`;
  const en = `/en/articles/${a.slug}/`;
  return {
    title: a.titre,
    description: a.description,
    alternates: { canonical: en, languages: { fr, en, "x-default": fr } },
    openGraph: {
      type: "article", url: en, title: a.titre, description: a.description, locale: "en_GB",
      publishedTime: a.publieLe?.toISOString(), modifiedTime: a.modifieLe.toISOString(), authors: [SITE.auteur], tags: a.etiquettes,
      images: [{ url: imageOuverture(a), width: 1200, height: 630, alt: a.image?.alt || a.titre }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function ArticleEn({ params }: Props) {
  const slug = (await params).slug;
  const a = await lirePublieEn(slug);
  if (!a) {
    // Article en ligne en français, pas encore traduit : on le dit, sans page vide.
    const fr = await lirePublie(slug);
    if (!fr) notFound();
    return (
      <div className="wrap contenu centre" lang="en">
        <p className="surtitre">{nomRubriqueEn(fr.rubrique)}</p>
        <h1 className="titre" style={{ fontSize: 34 }}>This article has not been translated yet</h1>
        <p className="doux">Articles are translated into English within an hour of their publication. Meanwhile, it is available in French.</p>
        <div className="actions-bandeau" style={{ justifyContent: "center" }}>
          <Link href={`/articles/${fr.slug}/`} hrefLang="fr" className="btn btn-or">Read it in French</Link>
          <Link href="/en/news/" className="btn btn-contour">All English news</Link>
        </div>
      </div>
    );
  }
  const memeTheme = await listerPubliesEn({ rubrique: a.rubrique, limite: 3, sauf: a.id });
  const url = `${SITE.url}/en/articles/${a.slug}/`;
  const partageFacebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const pilier = a.pilier ? cheminAnglais(`/${a.pilier}/`) : null;

  return (
    <div className="wrap contenu">
      <JsonLd
        donnees={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: a.titre,
          description: a.description,
          datePublished: a.publieLe?.toISOString(),
          dateModified: a.modifieLe.toISOString(),
          author: { "@type": "Person", name: SITE.auteur, url: `${SITE.url}/a-propos/` },
          publisher: { "@type": "Organization", name: SITE.nom, url: SITE.url, logo: { "@type": "ImageObject", url: `${SITE.url}/images/logo-taverne-512.png`, width: 512, height: 512 } },
          image: [imageOuverture(a)],
          mainEntityOfPage: url,
          inLanguage: "en",
          keywords: a.etiquettes.join(", "),
          translationOfWork: { "@type": "NewsArticle", url: `${SITE.url}/articles/${a.slug}/`, inLanguage: "fr-FR" },
        }}
      />
      <Ariane langue="en" etapes={[{ nom: nomRubriqueEn(a.rubrique), href: pageRubriqueEn(a.rubrique) }, { nom: a.titre }]} />

      <div className="colonnes">
        <article className="article" style={{ flex: "999 1 600px", minWidth: 0 }}>
          <p className="surtitre">{nomRubriqueEn(a.rubrique)}</p>
          <h1>{a.titre}</h1>
          <div className="article-meta">
            <span className="avatar" aria-hidden="true">S</span>
            <span>
              By Jobwow · {a.publieLe ? dateEn(a.publieLe) : ""} · {tempsDeLecture(a.corps)} min read ·{" "}
              <Link href={`/articles/${a.slug}/`} hrefLang="fr" lang="fr">Version française</Link>
            </span>
          </div>

          {a.image ? (
            <figure className="image-une">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/medias/${a.image.id}/`} alt={a.image.alt} fetchPriority="high" />
              {a.image.credit ? <figcaption>{a.image.credit}</figcaption> : null}
            </figure>
          ) : (
            <IllustrationEcran ecran={ecranArticle(a)} langue="en" />
          )}

          {a.chapo ? <p className="chapo-article">{a.chapo}</p> : null}
          <div className="corps" dangerouslySetInnerHTML={{ __html: liensAnglais(markdownVersHtml(a.corps)) }} />

          <section className="avis" aria-labelledby="t-avis">
            <div className="avis-titre">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/jobwow-192.png" width={48} height={48} alt="" className="avatar-jobwow avatar-petit" />
              <h2 id="t-avis">Jobwow&apos;s take</h2>
            </div>
            <div className="corps" style={{ fontSize: 17 }} dangerouslySetInnerHTML={{ __html: liensAnglais(markdownVersHtml(a.avisSilfax)) }} />
          </section>

          <p className="signature-article">— Jobwow, behind the bar of the Tavern</p>
          <p className="doux" style={{ fontSize: 14 }}>
            Translated from the <Link href={`/articles/${a.slug}/`} hrefLang="fr">French article</Link>, written and reviewed by Jobwow.
          </p>

          <div className="appel-lettre">
            <p><strong>A week of WoW Forever, every Sunday at 10 am.</strong> Jobwow&apos;s column, the five news to remember and a gameplay tip.</p>
            <div className="partage">
              <Link href="/en/newsletter/" className="btn btn-or" data-cta="lettre-article-en">Get the news every Sunday</Link>
              <a href={partageFacebook} className="btn btn-facebook" rel="noopener noreferrer" target="_blank" data-cta="partage-article-en">Share on Facebook</a>
            </div>
          </div>

          {a.etiquettes.length ? (
            <ul className="puces" aria-label="Tags" style={{ marginBottom: 24 }}>
              {a.etiquettes.map((e) => <li key={e} className="puce puce-douce">{e}</li>)}
            </ul>
          ) : null}

          {sourcesPubliees(a.sources).length ? (
            <section className="sources" aria-labelledby="t-sources">
              <h2 id="t-sources">Sources</h2>
              <ul>{sourcesPubliees(a.sources).map((s) => <LigneSourceEn key={s.url} source={s} />)}</ul>
            </section>
          ) : null}
        </article>

        <aside className="colonne-laterale">
          {pilier ? (
            <div className="encadre-nuit">
              <h2 className="titre" style={{ margin: "0 0 6px", fontSize: 19, color: "var(--or-clair)" }}>Go further</h2>
              <p style={{ margin: "0 0 14px", fontSize: 15, color: "#cfc7b4" }}>The reference page on this topic.</p>
              <Link href={pilier} className="btn btn-or">See the page</Link>
            </div>
          ) : null}
          <div className="encadre-nuit">
            <h2 className="titre" style={{ margin: "0 0 6px", fontSize: 19, color: "var(--or-clair)" }}>Getting started</h2>
            <p style={{ margin: "0 0 14px", fontSize: 15, color: "#cfc7b4" }}>Class, race, realm, first quests: the guide for newcomers and returning players.</p>
            <Link href="/en/guides/getting-started/" className="btn btn-or">Read the guide</Link>
          </div>
        </aside>
      </div>

      {memeTheme.length ? (
        <section aria-labelledby="t-aussi" style={{ marginTop: 64 }}>
          <h2 id="t-aussi" className="section-titre" style={{ fontSize: 26 }}>Read also</h2>
          <div className="g3">{memeTheme.map((x) => <CarteArticle key={x.id} article={x} langue="en" />)}</div>
        </section>
      ) : null}
    </div>
  );
}
