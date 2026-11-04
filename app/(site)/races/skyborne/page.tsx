import type { Metadata } from "next";
import Link from "next/link";
import { SKYBORNE } from "@/content/monde";
import { languesDe } from "@/lib/anglais";
import { Ariane } from "@/components/Ariane";
import { IconesRace } from "@/components/IconeRace";
import { ArticlesLies } from "@/components/ArticlesLies";
import { dateLongue } from "@/lib/site";
import { fondBandeau } from "@/lib/ecrans";
import { traitsDeRace, versionSorts } from "@/lib/sorts";
import { TraitsRaciaux } from "@/components/TraitsRaciaux";
import { GuideSkyborne } from "@/components/ChoixGuide";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Skyborne (Éolides) : la nouvelle race de WoW Forever",
  description: "Skyborne, ou Éolides : origines, classes par faction, capacités raciales et comment débloquer la nouvelle race de WoW Forever.",
  alternates: { canonical: "/races/skyborne/", languages: languesDe("/races/skyborne/") },
};

export default function Skyborne() {
  const s = SKYBORNE;
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("ile-de-zephras")}>
        <div className="wrap">
          <Ariane etapes={[{ nom: "Races", href: "/races/" }, { nom: "Skyborne" }]} />
          <div className="presentation-auteur">
            <IconesRace race="Skyborne" taille={96} />
            <div>
              <p className="surtitre">Nouvelle race jouable</p>
              <h1>{s.nom}</h1>
              <p className="chapo">{s.resume}</p>
            </div>
          </div>
        </div>
      </section>
      <div className="wrap contenu">
        <div className="colonnes">
          <div className="colonne-principale">
            <section aria-labelledby="t-origine">
              <h2 id="t-origine" className="section-titre" style={{ fontSize: 26 }}>D&apos;où viennent-ils ?</h2>
              {s.origine.map((p) => <p key={p}>{p}</p>)}
              <p><Link href="/zones/ile-de-zephras/">Voir la fiche de l&apos;île de Zéphras</Link></p>
            </section>

            <section aria-labelledby="t-ordres">
              <h2 id="t-ordres" className="section-titre" style={{ fontSize: 26 }}>Deux ordres, deux factions</h2>
              <p>Le choix se fait à la création du personnage. Il détermine les classes ouvertes et l&apos;une des capacités raciales.</p>
              <div className="g2">
                {s.ordres.map((o) => (
                  <div key={o.faction} className="encadre cadre">
                    <p className="surtitre">{o.faction}</p>
                    <h3 style={{ margin: "0 0 6px" }}>{o.nom}</h3>
                    <p className="doux" style={{ margin: "0 0 8px", fontSize: 15 }}>{o.texte} Nom officiel en anglais : {o.anglais}.</p>
                    <p style={{ margin: 0, fontSize: 15 }}>Classes : {o.classes.join(", ")}</p>
                  </div>
                ))}
              </div>
            </section>

            <section aria-labelledby="t-capacites">
              <h2 id="t-capacites" className="section-titre" style={{ fontSize: 26 }}>Capacités raciales</h2>
              <p className="doux">
                Noms et effets lus dans les fichiers du jeu{versionSorts() ? ` (version ${versionSorts()})` : ""}. Deux capacités dépendent de la faction,
                d&apos;après la bêta ; les autres sont communes à tous les Skyborne.
              </p>
              <TraitsRaciaux traits={traitsDeRace("skyborne")} factions={s.factionsCapacites} />
            </section>

            <section aria-labelledby="t-guide-skyborne" className="encadre-chaud guide-zone">
              <p className="surtitre" style={{ margin: 0 }}>Guide de 1 à 60</p>
              <h2 id="t-guide-skyborne" className="section-titre" style={{ fontSize: 26, margin: "4px 0 8px" }}>Monter un Skyborne de 1 à 60</h2>
              <p style={{ margin: "0 0 14px" }}>
                Départ sur l&apos;<Link href="/zones/ile-de-zephras/">île de Zéphras</Link>, puis la route de votre faction, quête par quête, avec les
                PNJ et les monstres sur la carte et votre progression à cocher. Choisissez votre ordre et votre classe :
              </p>
              <GuideSkyborne />
            </section>

            <section aria-labelledby="t-acces">
              <h2 id="t-acces" className="section-titre" style={{ fontSize: 26 }}>Comment jouer Skyborne ?</h2>
              {s.acces.map((p) => <p key={p}>{p}</p>)}
            </section>

            <section className="avis" aria-labelledby="t-avis">
              <div className="avis-titre"><span className="avatar" aria-hidden="true">S</span><h2 id="t-avis">L&apos;avis de Jobwow</h2></div>
              <p className="doux" style={{ margin: 0 }}>{s.avis}</p>
            </section>

            <section className="sources" aria-labelledby="t-sources">
              <h2 id="t-sources">Sources</h2>
              <ul>{s.sources.map((x) => <li key={x}>{x}</li>)}</ul>
            </section>

            <ArticlesLies pilier="races/skyborne" />
          </div>
          <aside className="colonne-laterale">
            <p className="doux" style={{ margin: 0, fontSize: 14 }}>Fiche mise à jour le {dateLongue(s.misAJour)} par Jobwow.</p>
          </aside>
        </div>
      </div>
    </>
  );
}
