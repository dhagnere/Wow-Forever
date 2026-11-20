import type { Metadata } from "next";
import Link from "next/link";
import { listerPublies, videosChaine } from "@/modules/veille";
import { CLASSES } from "@/content/classes";
import { CarteArticle, FilArticles } from "@/components/Articles";
import { Visuel } from "@/components/Visuels";
import { IconeClasse } from "@/components/IconeClasse";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import { ChoixGuideParClasse } from "@/components/ChoixGuide";
import { AccesRapides } from "@/components/AccesRapides";
import { RejoindreTaverne } from "@/components/RejoindreTaverne";
import { miniatureDe, titreAffichable } from "@/lib/miniatureVideo";
import { donneesOrganisation, IMAGE_PARTAGE } from "@/lib/referencement";

export const dynamic = "force-dynamic";

const DESCRIPTION =
  "Le guide de WoW Forever de 1 à 60, quête par quête pour chaque race et classe : cartes, talents, donjons, base d'objets et actualité du jeu, en français.";

export const metadata: Metadata = {
  title: { absolute: `Guide WoW Forever de 1 à 60 en français · ${SITE.nom}` },
  description: DESCRIPTION,
  alternates: { canonical: "/", languages: { fr: "/", en: "/en/", "x-default": "/" } },
  openGraph: { siteName: SITE.nom, locale: "fr_FR", type: "website", title: "WoW Forever en français, de 1 à 60", description: DESCRIPTION, url: "/", images: [IMAGE_PARTAGE] },
};

const TERRES = [
  { href: "/zones/mont-hyjal/", nom: "Mont Hyjal", teinte: "#7fbf7a", ecran: "kalimdor" },
  { href: "/zones/ile-de-zephras/", nom: "Île de Zéphras", teinte: "#5fb8d6", ecran: "ile-de-zephras" },
  { href: "/donjons/", nom: "Nouveaux donjons", teinte: "#d9822b", ecran: "salle-des-thanes" },
  { href: "/donjons/#raids", nom: "Raids à 10 et 20", teinte: "#c0504d", ecran: "coeur-du-magma" },
] as const;

export default async function Accueil() {
  const [recents, videos] = await Promise.all([listerPublies({ limite: 9 }), videosChaine(SITE.youtubeChaine)]);
  const aLaUne = recents.slice(0, 3);
  const chroniques = recents.slice(3, 9);
  const video = videos[0];

  return (
    <>
      <JsonLd
        donnees={{
          "@context": "https://schema.org",
          "@graph": [
            donneesOrganisation(),
            {
              "@type": "WebSite",
              "@id": `${SITE.url}/#site`,
              name: SITE.nom,
              url: `${SITE.url}/`,
              inLanguage: "fr-FR",
              description: DESCRIPTION,
              publisher: { "@id": `${SITE.url}/#organisation` },
              potentialAction: { "@type": "SearchAction", target: `${SITE.url}/recherche/?q={search_term_string}`, "query-input": "required name=search_term_string" },
            },
          ],
        }}
      />
      <section className="heros heros-accueil">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="heros-image"
          src="/images/heros-accueil-1920.jpg"
          srcSet="/images/heros-accueil-960.jpg 960w, /images/heros-accueil-1920.jpg 1920w"
          sizes="100vw"
          alt="Coucher de soleil sur une plage d'Azeroth, une épave échouée sur le sable"
          fetchPriority="high"
        />
        <p className="heros-credit">Capture de Jobwow · © Blizzard Entertainment</p>
        <div className="wrap">
          <div className="heros-carte cadre">
            <p className="surtitre heros-surtitre">WoW Forever · en français</p>
            <h1>Votre route dans Azeroth, <span className="accent">de 1 à 60</span></h1>
            <span className="ornement" aria-hidden="true" />
            <p>
              Le guide quête par quête pour votre race et votre classe, les talents, la base d&apos;objets et l&apos;actualité du jeu, servie chaque
              matin par Jobwow.
            </p>
            <div className="boutons">
              <a href="#guide-1-60" className="btn btn-or" data-cta="guide-heros">Choisir mon guide</a>
              <Link href="/lettre/" className="btn btn-contour" data-cta="lettre-accueil">Recevoir la Lettre du dimanche</Link>
            </div>
            <p className="heros-garanties">Gratuit · Progression sauvegardée · Nouvelles chaque matin</p>
          </div>
        </div>
      </section>

      <AccesRapides />

      <section id="guide-1-60" className="accueil-guide" aria-labelledby="t-guide-accueil">
        <div className="wrap">
          <div className="accueil-guide-tete">
            <div>
              <p className="surtitre" style={{ margin: 0 }}>Le guide de la Taverne</p>
              <h2 id="t-guide-accueil">De 1 à 60, quête par quête, pour votre classe</h2>
              <p className="chapo" style={{ margin: 0 }}>
                Chaque quête dans le bon ordre : la prendre, faire ses objectifs, la rendre, puis la suite. Les PNJ et les monstres sont placés
                sur la carte de chaque zone, la route est tracée en flèches, et votre progression se sauvegarde jour après jour avec un compte gratuit.
              </p>
            </div>
            <ul className="accueil-guide-points" aria-label="Ce que propose le guide">
              <li><strong>Votre classe</strong> et vos quêtes de classe à leur place</li>
              <li><strong>Cartes zoomables</strong> avec les PNJ, les monstres et la route</li>
              <li><strong>Progression</strong> cochée et sauvegardée</li>
            </ul>
          </div>
          <p className="accueil-guide-consigne">
            Choisissez votre classe, puis votre race :<span className="accueil-guide-glisser" aria-hidden="true"> faites glisser pour voir les neuf classes →</span>
          </p>
          <ChoixGuideParClasse cta="guide-accueil" />
          <p className="doux" style={{ margin: "16px 0 0", fontSize: 14 }}>
            Ou parcourez <Link href="/guides/parcours/">la route de l&apos;Alliance et de la Horde</Link>, <Link href="/guides/quetes-de-classe/">les quêtes de classe</Link>{" "}
            et <Link href="/guides/zones-par-niveau/">les zones par niveau</Link>.
          </p>
        </div>
      </section>

      <section className="chiffres" aria-label="WoW Forever en chiffres">
        <div className="wrap g4">
          <div><p className="chiffre">60</p><p className="doux" style={{ margin: 0 }}>niveau maximal</p></div>
          <div><p className="chiffre">1 000+</p><p className="doux" style={{ margin: 0 }}>nouvelles quêtes</p></div>
          <div><p className="chiffre">9</p><p className="doux" style={{ margin: 0 }}>donjons inédits</p></div>
          <div><p className="chiffre">10 · 20</p><p className="doux" style={{ margin: 0 }}>joueurs par raid</p></div>
        </div>
      </section>

      <div className="wrap contenu sections">
        {aLaUne.length > 0 ? (
          <section aria-labelledby="t-une">
            <div className="section-tete">
              <h2 id="t-une" className="section-titre">À la une</h2>
              <Link href="/actualites/" className="lien-suite">Toute l&apos;actualité de WoW Forever</Link>
            </div>
            <div className="une">
              {aLaUne.map((a, i) => <CarteArticle key={a.id} article={a} grande={i === 0} />)}
            </div>
          </section>
        ) : null}

        <section aria-labelledby="t-actus" className="colonnes" style={{ gap: 40 }}>
          <div style={{ flex: "999 1 560px", minWidth: 0 }}>
            <h2 id="t-actus" className="section-titre" style={{ marginBottom: 12 }}>Dernières chroniques</h2>
            <FilArticles articles={chroniques} vide="Les prochaines chroniques arrivent avec la veille du matin." />
            <p style={{ marginTop: 16 }}><Link href="/actualites/" className="lien-suite">Toutes les actualités</Link></p>
          </div>
          <aside className="encadre-chaud cadre carnet-accueil" style={{ flex: "1 1 300px" }} aria-labelledby="t-carnet">
            <p className="surtitre" style={{ margin: 0 }}>En vidéo</p>
            <h2 id="t-carnet" className="titre" style={{ margin: "2px 0 8px", fontSize: 23, color: "var(--or-clair)" }}>Le Journal de Jobwow</h2>
            {video ? (
              <a href={video.lien} rel="noopener noreferrer" className="carnet-accueil-video" data-cta="video-accueil">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={miniatureDe(video)} width={1280} height={720} alt="" loading="lazy" />
                <span>{titreAffichable(video.titre)}</span>
              </a>
            ) : (
              <p style={{ margin: "0 0 16px", color: "var(--texte-chaud)" }}>Les premières vidéos arrivent bientôt sur la chaîne.</p>
            )}
            <p style={{ margin: "0 0 14px", color: "var(--texte-chaud)", fontSize: 15 }}>
              Chaque soirée de jeu en épisodes de 15 à 20 minutes, découpés par zone et par niveau. De 1 à 60, sans tricher.
            </p>
            <p style={{ margin: 0, display: "flex", flexWrap: "wrap", gap: "8px 18px" }}>
              <Link href="/carnet/videos/" className="titre" style={{ fontWeight: 700 }}>Toutes les vidéos</Link>
              <Link href="/carnet/" className="titre" style={{ fontWeight: 700 }}>Ouvrir le Carnet</Link>
            </p>
          </aside>
        </section>

        <section aria-labelledby="t-voie" className="centre">
          <h2 id="t-voie" className="section-titre" style={{ fontSize: 34, marginBottom: 8 }}>Les neuf classes</h2>
          <span className="ornement" aria-hidden="true" />
          <p className="doux" style={{ margin: "0 auto 32px", maxWidth: 620 }}>
            Pour chacune : rôles, races possibles, sorts par spécialisation, arbres de talents et calculateur. Les familiers du chasseur et du démoniste aussi.
          </p>
          <div className="g9">
            {CLASSES.map((c) => (
              <Link key={c.slug} href={`/classes/${c.slug}/`} className="lien-classe" title={`${c.nom} : sorts et talents`}>
                <IconeClasse slug={c.slug} couleur={c.couleur} taille="100%" />
                {c.nom}
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="t-terres">
          <div className="section-tete">
            <h2 id="t-terres" className="section-titre">Terres et périls</h2>
            <Link href="/cartes/" className="lien-suite" data-cta="cartes-accueil">Toutes les cartes du monde</Link>
          </div>
          <div className="g4">
            {TERRES.map((t) => (
              <Link key={t.href} href={t.href} className="carte cadre" style={{ height: 240 }}>
                <Visuel hauteur="100%" texte={t.nom} teinte={t.teinte} ecran={t.ecran} />
              </Link>
            ))}
          </div>
        </section>

        <RejoindreTaverne />
      </div>
    </>
  );
}
