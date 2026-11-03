import type { Metadata } from "next";
import Link from "next/link";
import { Ariane } from "@/components/Ariane";
import { CarteLieu, FigureCarte } from "@/components/Cartes";
import { fondBandeau } from "@/lib/ecrans";
import { pageLieu, zonesDuContinent } from "@/lib/cartes";

export const metadata: Metadata = {
  title: "Cartes du monde de WoW Forever : Kalimdor, Royaumes de l'Est, Zéphras",
  description: "Les cartes de Kalimdor, des Royaumes de l'Est et de l'île de Zéphras dans WoW Forever, et chaque zone avec son niveau, ses donjons et ses voisines.",
  alternates: { canonical: "/cartes/" },
};

const VILLES = ["hurlevent", "forgefer", "darnassus", "orgrimmar", "thunder-bluff", "fossoyeuse"];

function niveaux(min?: number, max?: number) {
  if (min === undefined) return undefined;
  return min === max ? `Niveau ${min}` : `Niveaux ${min} à ${max}`;
}

export default function Cartes() {
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("kalimdor")}>
        <div className="wrap">
          <Ariane etapes={[{ nom: "Explorer", href: "/zones/" }, { nom: "Cartes du monde" }]} />
          <p className="surtitre">La Salle des cartes</p>
          <h1>Les cartes du <span className="accent">monde</span></h1>
          <p className="chapo">Deux continents, une île nouvelle et plus de quarante zones. Choisissez un lieu : sa carte, ses niveaux, ses donjons et la route qui suit.</p>
          <nav className="actions-bandeau" aria-label="Aller au continent">
            <a href="#royaumes-de-l-est" className="btn btn-or">Royaumes de l&apos;Est</a>
            <a href="#kalimdor" className="btn btn-contour">Kalimdor</a>
            <a href="#zephras" className="btn btn-contour">Île de Zéphras</a>
          </nav>
        </div>
      </section>
      <div className="wrap contenu sections" style={{ gap: 56 }}>
        {(["Royaumes de l'Est", "Kalimdor"] as const).map((continent) => {
          const slug = continent === "Kalimdor" ? "kalimdor" : "royaumes-de-l-est";
          const zones = zonesDuContinent(continent).filter((z) => !VILLES.includes(z.slug));
          const villes = zonesDuContinent(continent).filter((z) => VILLES.includes(z.slug));
          return (
            <section key={continent} id={slug} aria-labelledby={`t-${slug}`}>
              <h2 id={`t-${slug}`} className="section-titre">{continent}</h2>
              <div className="colonnes-carte">
                <FigureCarte slug={slug} legende={`Carte : ${continent} · cliquer pour agrandir`} />
                <div>
                  <p className="doux" style={{ marginTop: 0 }}>
                    {zones.length} zones, rangées par niveau. <Link href="/guides/zones-par-niveau/">La route complète de 1 à 60</Link>.
                  </p>
                  {villes.length ? (
                    <p className="doux">
                      Capitales : {villes.map((v, i) => <span key={v.slug}>{i ? ", " : ""}<Link href={pageLieu(v.slug)}>{v.nom}</Link></span>)}.
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="grille-lieux">
                {zones.map((z) => <CarteLieu key={z.slug} slug={z.slug} detail={niveaux(z.niveau?.min, z.niveau?.max) ?? "Niveau à confirmer"} />)}
              </div>
            </section>
          );
        })}
        <section id="zephras" aria-labelledby="t-zephras">
          <h2 id="t-zephras" className="section-titre">Île de Zéphras</h2>
          <div className="colonnes-carte">
            <FigureCarte slug="ile-de-zephras" />
            <p className="doux" style={{ marginTop: 0 }}>
              Nouvelle dans Forever, l&apos;île de départ des Skyborne flotte à l&apos;écart des deux continents.{" "}
              <Link href="/zones/ile-de-zephras/">Lire la fiche de la zone</Link>.
            </p>
          </div>
        </section>
        <p className="doux" style={{ fontSize: 13 }}>Cartes lues dans les fichiers de WoW Forever grâce à <a href="https://wago.tools" rel="noopener noreferrer">wago.tools</a>. © Blizzard Entertainment.</p>
      </div>
    </>
  );
}
