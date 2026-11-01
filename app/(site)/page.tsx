import Link from "next/link";
import { listerPublies } from "@/modules/veille";
import { CLASSES } from "@/content/classes";
import { CarteArticle, FilArticles } from "@/components/Articles";
import { Embleme, Visuel } from "@/components/Visuels";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

const TERRES = [
  { href: "/zones/mont-hyjal/", nom: "Mont Hyjal", teinte: "#7fbf7a" },
  { href: "/zones/ile-de-zephras/", nom: "Île de Zéphras", teinte: "#5fb8d6" },
  { href: "/donjons/", nom: "Nouveaux donjons", teinte: "#d9822b" },
  { href: "/donjons/#raids", nom: "Raids à 10 et 20", teinte: "#c0504d" },
];

export default async function Accueil() {
  const [recents, carnet] = await Promise.all([listerPublies({ limite: 9 }), listerPublies({ rubrique: "carnet", limite: 1 })]);
  const aLaUne = recents.slice(0, 3);
  const chroniques = recents.slice(3, 9);

  return (
    <>
      <JsonLd donnees={{ "@context": "https://schema.org", "@type": "WebSite", name: SITE.nom, url: SITE.url, inLanguage: "fr-FR" }} />
      <section className="heros">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="heros-image"
          src="/images/heros-accueil-1920.jpg"
          srcSet="/images/heros-accueil-960.jpg 960w, /images/heros-accueil-1920.jpg 1920w"
          sizes="100vw"
          alt="Coucher de soleil sur une plage d'Azeroth, une épave échouée sur le sable"
          fetchPriority="high"
        />
        <p className="heros-credit">Capture de Silfax · © Blizzard Entertainment</p>
        <div className="wrap">
          <div className="heros-carte cadre">
            <p className="surtitre" style={{ fontSize: 15, letterSpacing: "0.22em", marginBottom: 14 }}>5 novembre · minuit</p>
            <h1>L&apos;Azeroth d&apos;origine renaît</h1>
            <span className="ornement" aria-hidden="true" />
            <p>Classes, quêtes, donjons et nouvelles terres de WoW Forever, racontés en français par Silfax, de 1 à 60.</p>
            <div className="boutons">
              <Link href="/guides/bien-demarrer/" className="btn btn-or">Commencer l&apos;aventure</Link>
              <Link href="/actualites/" className="btn btn-contour">Dernières nouvelles</Link>
            </div>
          </div>
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
        <section aria-labelledby="t-voie" className="centre">
          <h2 id="t-voie" className="section-titre" style={{ fontSize: 34, marginBottom: 8 }}>Choisis ta voie</h2>
          <span className="ornement" aria-hidden="true" />
          <p className="doux" style={{ margin: "0 auto 32px", maxWidth: 620 }}>
            Neuf classes, autant de façons de vivre Azeroth. Rôle, forces, races possibles et guide pas à pas pour chacune.
          </p>
          <div className="g9">
            {CLASSES.map((c) => (
              <Link key={c.slug} href={`/classes/${c.slug}/`} className="lien-classe">
                <Embleme nom={c.nom} couleur={c.couleur} />
                {c.nom}
              </Link>
            ))}
          </div>
        </section>

        {aLaUne.length > 0 ? (
          <section aria-labelledby="t-une">
            <h2 id="t-une" className="section-titre">À la une</h2>
            <div className="une">
              {aLaUne.map((a, i) => <CarteArticle key={a.id} article={a} grande={i === 0} />)}
            </div>
          </section>
        ) : null}

        <section aria-labelledby="t-actus" className="colonnes" style={{ gap: 40 }}>
          <div style={{ flex: "999 1 560px", minWidth: 0 }}>
            <h2 id="t-actus" className="section-titre" style={{ marginBottom: 12 }}>Chroniques du jour</h2>
            <FilArticles articles={chroniques} vide="Les premières chroniques arrivent avec la sortie du jeu." />
            <p style={{ marginTop: 16 }}><Link href="/actualites/">Toutes les actualités</Link></p>
          </div>
          <aside className="encadre-chaud cadre" style={{ flex: "1 1 300px" }} aria-labelledby="t-carnet">
            <h2 id="t-carnet" className="titre" style={{ margin: "0 0 8px", fontSize: 23, color: "var(--or-clair)" }}>Le carnet de Silfax</h2>
            <p style={{ margin: "0 0 16px", color: "var(--texte-chaud)" }}>
              Chaque dimanche à 18h, le récit de la semaine et une capture d&apos;écran. De 1 à 60, sans tricher.
            </p>
            {carnet[0] ? (
              <p style={{ margin: "0 0 16px" }}>
                Dernier épisode : <Link href={`/articles/${carnet[0].slug}/`}>{carnet[0].titre}</Link>
              </p>
            ) : (
              <p style={{ margin: "0 0 16px", color: "var(--texte-chaud)" }}>Premier épisode le dimanche 8 novembre.</p>
            )}
            <Link href="/carnet/" className="titre" style={{ fontWeight: 700 }}>Ouvrir le carnet</Link>
          </aside>
        </section>

        <section aria-labelledby="t-terres">
          <h2 id="t-terres" className="section-titre">Terres et périls</h2>
          <div className="g4">
            {TERRES.map((t) => (
              <Link key={t.href} href={t.href} className="carte cadre" style={{ height: 240 }}>
                <Visuel hauteur="100%" texte={t.nom} teinte={t.teinte} />
              </Link>
            ))}
          </div>
        </section>

        <section className="encadre cadre" style={{ padding: "30px 34px", display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ flex: "1 1 420px" }}>
            <h2 className="titre" style={{ margin: "0 0 6px", fontSize: 23 }}>Rejoignez la compagnie</h2>
            <p className="doux" style={{ margin: 0 }}>Chaque nouvel article part aussi sur la Page Facebook Azeroth Forever, entre 8h et 22h.</p>
          </div>
          <a href={SITE.facebook} className="btn btn-facebook" rel="noopener noreferrer">Suivre sur Facebook</a>
        </section>
      </div>
    </>
  );
}
