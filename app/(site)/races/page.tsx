import type { Metadata } from "next";
import Link from "next/link";
import { RACES_ORIGINE, SKYBORNE } from "@/content/monde";
import { Ariane } from "@/components/Ariane";

export const metadata: Metadata = {
  title: "Les races de WoW Forever",
  description: "Les races jouables de World of Warcraft: Forever, dont les Skyborne, nouvelle race ouverte à l'Alliance comme à la Horde.",
  alternates: { canonical: "/races/" },
};

export default function Races() {
  return (
    <>
      <section className="bandeau-page">
        <div className="wrap">
          <Ariane etapes={[{ nom: "Races" }]} />
          <h1>Les races de WoW Forever</h1>
          <p className="chapo">Huit races héritées de l&apos;Azeroth d&apos;origine, et une nouvelle venue : les Skyborne.</p>
        </div>
      </section>
      <div className="wrap contenu sections" style={{ gap: 48 }}>
        <Link href="/races/skyborne/" className="encadre-chaud cadre" style={{ textDecoration: "none", color: "var(--texte)" }}>
          <p className="surtitre">Nouvelle race jouable</p>
          <h2 className="titre" style={{ margin: "0 0 8px", fontSize: 30 }}>{SKYBORNE.nom}</h2>
          <p style={{ margin: "0 0 12px", color: "var(--texte-chaud)" }}>{SKYBORNE.resume}</p>
          <span style={{ color: "var(--or-clair)", fontWeight: 700 }}>Lire la fiche</span>
        </Link>
        <section aria-labelledby="t-origine">
          <h2 id="t-origine" className="section-titre" style={{ fontSize: 26 }}>Races de l&apos;Azeroth d&apos;origine</h2>
          <div className="tableau-boite">
            <table>
              <thead><tr><th scope="col">Race</th><th scope="col">Faction</th></tr></thead>
              <tbody>{RACES_ORIGINE.map((r) => <tr key={r.nom}><td style={{ fontWeight: 600 }}>{r.nom}</td><td>{r.faction}</td></tr>)}</tbody>
            </table>
          </div>
          <p className="doux" style={{ fontSize: 15 }}>Une fiche par race sera publiée au fil des semaines, avec traits raciaux et classes conseillées.</p>
        </section>
      </div>
    </>
  );
}
