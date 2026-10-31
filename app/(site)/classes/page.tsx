import type { Metadata } from "next";
import Link from "next/link";
import { CLASSES } from "@/content/classes";
import { listerPublies } from "@/modules/veille";
import { Ariane } from "@/components/Ariane";
import { Embleme } from "@/components/Visuels";
import { FilArticles } from "@/components/Articles";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Les classes de WoW Forever",
  description: "Les neuf classes de World of Warcraft: Forever : rôles, points forts, races disponibles et guide pas à pas pour chacune.",
  alternates: { canonical: "/classes/" },
};

export default async function Classes() {
  const articles = await listerPublies({ rubrique: "classes", limite: 5 });
  return (
    <>
      <section className="bandeau-page">
        <div className="wrap">
          <Ariane etapes={[{ nom: "Classes" }]} />
          <h1>Les classes de WoW Forever</h1>
          <p className="chapo">Rôles, points forts, races disponibles et guide pas à pas pour chaque classe. Mis à jour à chaque annonce de Blizzard.</p>
        </div>
      </section>
      <div className="wrap contenu sections" style={{ gap: 56 }}>
        <section aria-labelledby="t-voie">
          <h2 id="t-voie" className="section-titre">Choisis ta voie</h2>
          <div className="g3">
            {CLASSES.map((c) => (
              <Link key={c.slug} href={`/classes/${c.slug}/`} className="carte cadre" style={{ flexDirection: "row", alignItems: "center", gap: 18, padding: 18 }}>
                <span style={{ width: 72, flex: "none" }}><Embleme nom={c.nom} couleur={c.couleur} /></span>
                <span>
                  <span className="titre" style={{ display: "block", fontSize: 21, fontWeight: 700, color: "var(--texte-titre)" }}>{c.nom}</span>
                  <span className="doux" style={{ display: "block", fontSize: 15 }}>{c.resume}</span>
                  <span style={{ color: "var(--or-clair)", fontSize: 15, fontWeight: 700 }}>Lire le guide</span>
                </span>
              </Link>
            ))}
          </div>
          <p className="doux" style={{ marginTop: 20, fontSize: 15 }}>
            Rôles hérités de l&apos;Azeroth d&apos;origine. Les nouvelles techniques et combinaisons race et classe de Forever seront ajoutées dès leur confirmation.
          </p>
        </section>
        <section aria-labelledby="t-derniers">
          <h2 id="t-derniers" className="section-titre" style={{ fontSize: 26 }}>Derniers articles Classes</h2>
          <FilArticles articles={articles} vide="Les premiers articles sur les classes arrivent bientôt." />
        </section>
      </div>
    </>
  );
}
