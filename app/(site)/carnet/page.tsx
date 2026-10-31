import type { Metadata } from "next";
import Link from "next/link";
import { listerPublies } from "@/modules/veille";
import { Ariane } from "@/components/Ariane";
import { dateLongue } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Le carnet de Silfax — de 1 à 60 sur WoW Forever",
  description: "Chaque dimanche à 18h, le récit de la semaine de Silfax sur WoW Forever : quêtes marquantes, pièges évités, rencontres de la route.",
  alternates: { canonical: "/carnet/" },
};

export default async function Carnet() {
  const episodes = await listerPublies({ rubrique: "carnet", limite: 100 });
  return (
    <>
      <section className="bandeau-page" style={{ background: "var(--surface-chaude)" }}>
        <div className="wrap">
          <Ariane etapes={[{ nom: "Le carnet de Silfax" }]} />
          <p className="surtitre">Chaque dimanche à 18h</p>
          <h1>Le carnet de Silfax</h1>
          <p className="chapo">De 1 à 60 sur WoW Forever, une semaine après l&apos;autre. Les quêtes qui ont marqué, les pièges évités, les rencontres de la route.</p>
        </div>
      </section>
      <div className="wrap contenu">
        <div className="colonnes">
          <section className="colonne-principale" aria-labelledby="t-episodes">
            <h2 id="t-episodes" className="section-titre" style={{ fontSize: 26 }}>Les épisodes</h2>
            {episodes.length ? (
              <ol style={{ listStyle: "none", margin: 0, padding: "0 0 0 28px", borderLeft: "2px solid var(--bordure)", display: "flex", flexDirection: "column", gap: 28 }}>
                {episodes.map((e) => (
                  <li key={e.id}>
                    <p className="surtitre">{e.publieLe ? dateLongue(e.publieLe) : ""}</p>
                    <h3 style={{ margin: "0 0 6px", fontSize: 22 }}><Link href={`/articles/${e.slug}/`}>{e.titre}</Link></h3>
                    <p className="doux" style={{ margin: 0 }}>{e.chapo}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="doux">Premier épisode le dimanche 8 novembre à 18h.</p>
            )}
          </section>
          <aside className="colonne-laterale">
            <section className="encadre-nuit" aria-labelledby="t-fiche">
              <h2 id="t-fiche" className="titre" style={{ margin: "0 0 4px", fontSize: 22 }}>Silfax</h2>
              <p style={{ margin: "0 0 14px", fontSize: 14, color: "#cfc7b4" }}>[Race] · [Classe] · [Faction]</p>
              <dl style={{ margin: 0, display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 16px", fontSize: 15 }}>
                <dt style={{ color: "#cfc7b4" }}>Serveur</dt><dd style={{ margin: 0 }}>[Nom du serveur]</dd>
                <dt style={{ color: "#cfc7b4" }}>Guilde</dt><dd style={{ margin: 0 }}>[Nom ou « aucune »]</dd>
                <dt style={{ color: "#cfc7b4" }}>Métiers</dt><dd style={{ margin: 0 }}>[Métier 1] · [Métier 2]</dd>
              </dl>
            </section>
            <div className="encadre">
              <h2>Pourquoi ce carnet ?</h2>
              <p className="doux" style={{ margin: 0, fontSize: 15 }}>Les actualités se ressemblent d&apos;un site à l&apos;autre. Une aventure vécue, non. Ici, tout est joué avant d&apos;être écrit.</p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
