import type { Metadata } from "next";
import Link from "next/link";
import { lettresCarnet, listerPublies, videosChaine } from "@/modules/veille";
import { languesDe } from "@/lib/anglais";
import { Ariane } from "@/components/Ariane";
import { JournalVideo } from "@/components/JournalVideo";
import { LettresCarnet } from "@/components/LettresCarnet";
import { SITE, dateLongue } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Le Carnet de Jobwow — de 1 à 60 sur WoW Forever",
  description: "Chaque dimanche à 18h, le récit de la semaine de Jobwow sur WoW Forever : quêtes marquantes, pièges évités, rencontres de la route.",
  alternates: { canonical: "/carnet/", languages: languesDe("/carnet/") },
};

export default async function Carnet() {
  const [episodes, videos, lettres] = await Promise.all([
    listerPublies({ rubrique: "carnet", limite: 100 }),
    videosChaine(SITE.youtubeChaine),
    lettresCarnet("fr", 12),
  ]);
  return (
    <>
      <section className="bandeau-page">
        <div className="wrap">
          <Ariane etapes={[{ nom: "Le Carnet de Jobwow" }]} />
          <div className="presentation-auteur">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/jobwow-512.png" width={140} height={140} alt="Avatar de Jobwow : mort-vivant de la Horde, capture du jeu" className="avatar-jobwow" />
            <div>
              <p className="surtitre">Chaque dimanche à 18h</p>
              <h1>Le Carnet de Jobwow</h1>
              <p className="chapo">De 1 à 60 sur WoW Forever, une semaine après l&apos;autre. Les quêtes qui ont marqué, les pièges évités, les rencontres de la route.</p>
              <div className="actions-bandeau">
                {SITE.discord ? <a href={SITE.discord} className="btn btn-or" rel="noopener noreferrer" data-cta="discord-carnet">Répondre à Jobwow sur Discord</a> : null}
                <Link href="/lettre/" className={SITE.discord ? "btn btn-contour" : "btn btn-or"} data-cta="lettre-carnet">Recevoir la Lettre</Link>
                <Link href="/carnet/videos/" className="btn btn-contour" data-cta="videos-carnet">Les vidéos de Jobwow</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="wrap contenu">
        <div className="colonnes">
          <section className="colonne-principale" aria-labelledby="t-episodes">
            {videos.length ? <JournalVideo videos={videos} /> : null}
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
            <LettresCarnet lettres={lettres} />
          </section>
          <aside className="colonne-laterale">
            <section className="encadre-nuit" aria-labelledby="t-fiche">
              <h2 id="t-fiche" className="titre" style={{ margin: "0 0 4px", fontSize: 22 }}>Jobwow</h2>
              <p style={{ margin: "0 0 14px", fontSize: 14, color: "#cfc7b4" }}>Mort-vivant · Horde</p>
              <dl style={{ margin: 0, display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 16px", fontSize: 15 }}>
                <dt style={{ color: "#cfc7b4" }}>Serveur</dt><dd style={{ margin: 0 }}>Normal</dd>
                <dt style={{ color: "#cfc7b4" }}>Guilde</dt><dd style={{ margin: 0 }}>CODEX</dd>
                <dt style={{ color: "#cfc7b4" }}>Métiers</dt><dd style={{ margin: 0 }}>Herboristerie · [Métier 2]</dd>
              </dl>
            </section>
            <div className="encadre">
              <h2>Pourquoi ce carnet ?</h2>
              <p className="doux" style={{ margin: 0, fontSize: 15 }}>Les actualités se ressemblent d&apos;un site à l&apos;autre. Une aventure vécue, non. Ici, tout est joué avant d&apos;être écrit.</p>
            </div>
          </aside>
        </div>
        {videos.length ? null : <div style={{ marginTop: 40 }}><JournalVideo /></div>}
      </div>
    </>
  );
}
