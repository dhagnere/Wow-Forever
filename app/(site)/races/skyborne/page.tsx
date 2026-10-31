import type { Metadata } from "next";
import Link from "next/link";
import { SKYBORNE } from "@/content/monde";
import { Ariane } from "@/components/Ariane";
import { ArticlesLies } from "@/components/ArticlesLies";
import { dateLongue } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Skyborne (Éolides) : la nouvelle race de WoW Forever",
  description: "Skyborne, ou Éolides : origines, classes par faction, capacités raciales et comment débloquer la nouvelle race de WoW Forever.",
  alternates: { canonical: "/races/skyborne/" },
};

export default function Skyborne() {
  const s = SKYBORNE;
  return (
    <>
      <section className="bandeau-page">
        <div className="wrap">
          <Ariane etapes={[{ nom: "Races", href: "/races/" }, { nom: "Skyborne" }]} />
          <p className="surtitre">Nouvelle race jouable</p>
          <h1>{s.nom}</h1>
          <p className="chapo">{s.resume}</p>
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
              <p className="doux">Valeurs relevées pendant la bêta, susceptibles d&apos;évoluer. Noms anglais en attendant la traduction officielle.</p>
              <div className="tableau-boite">
                <table>
                  <thead><tr><th scope="col">Capacité</th><th scope="col">Effet</th><th scope="col">Faction</th></tr></thead>
                  <tbody>{s.capacites.map((c) => <tr key={c.nom}><td style={{ fontWeight: 600 }}>{c.nom}</td><td>{c.effet}</td><td>{c.faction}</td></tr>)}</tbody>
                </table>
              </div>
            </section>

            <section aria-labelledby="t-acces">
              <h2 id="t-acces" className="section-titre" style={{ fontSize: 26 }}>Comment jouer Skyborne ?</h2>
              {s.acces.map((p) => <p key={p}>{p}</p>)}
            </section>

            <section className="avis" aria-labelledby="t-avis">
              <div className="avis-titre"><span className="avatar" aria-hidden="true">S</span><h2 id="t-avis">L&apos;avis de Silfax</h2></div>
              <p className="doux" style={{ margin: 0 }}>{s.avis}</p>
            </section>

            <section className="sources" aria-labelledby="t-sources">
              <h2 id="t-sources">Sources</h2>
              <ul>{s.sources.map((x) => <li key={x}>{x}</li>)}</ul>
            </section>

            <ArticlesLies pilier="races/skyborne" />
          </div>
          <aside className="colonne-laterale">
            <p className="doux" style={{ margin: 0, fontSize: 14 }}>Fiche mise à jour le {dateLongue(s.misAJour)} par Silfax.</p>
          </aside>
        </div>
      </div>
    </>
  );
}
