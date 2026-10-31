import type { Metadata } from "next";
import Link from "next/link";
import { ZONES } from "@/content/monde";
import { Ariane } from "@/components/Ariane";
import { Visuel } from "@/components/Visuels";

export const metadata: Metadata = {
  title: "Les zones de WoW Forever",
  description: "Mont Hyjal, Rives Claires, île de Zéphras, Shen'dralar : les nouvelles zones de World of Warcraft: Forever.",
  alternates: { canonical: "/zones/" },
};

export default function Zones() {
  return (
    <>
      <section className="bandeau-page">
        <div className="wrap">
          <Ariane etapes={[{ nom: "Monde" }]} />
          <h1>Le monde de WoW Forever</h1>
          <p className="chapo">Quatre nouvelles zones, neuf donjons inédits et des raids à 10 et 20 joueurs.</p>
        </div>
      </section>
      <div className="wrap contenu sections" style={{ gap: 48 }}>
        <section aria-labelledby="t-zones">
          <h2 id="t-zones" className="section-titre">Nouvelles zones</h2>
          <div className="g2">
            {ZONES.map((z) => (
              <Link key={z.slug} href={`/zones/${z.slug}/`} className="carte cadre">
                <Visuel hauteur={160} />
                <div className="carte-corps">
                  <p className="surtitre">Niveau {z.niveau}</p>
                  <h3>{z.nom}</h3>
                  <p className="doux" style={{ margin: "6px 0 0", fontSize: 15 }}>{z.resume}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section className="encadre-chaud cadre">
          <h2 className="titre" style={{ margin: "0 0 8px", fontSize: 24, color: "var(--or-clair)" }}>Donjons et raids</h2>
          <p style={{ margin: "0 0 14px", color: "var(--texte-chaud)" }}>Les nouveaux donjons repérés en bêta, leur niveau d&apos;accès et les raids annoncés.</p>
          <Link href="/donjons/" className="btn btn-or">Voir les donjons</Link>
        </section>
      </div>
    </>
  );
}
