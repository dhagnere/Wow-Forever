import type { Metadata } from "next";
import Link from "next/link";
import { lettresCarnet, listerPubliesEn, videosChaine } from "@/modules/veille";
import { LETTRES_PREPAREES } from "@/content/lettres-preparees";
import { lettresCarnetEn } from "@/lib/lettresCarnet";
import { Ariane } from "@/components/Ariane";
import { JournalVideo } from "@/components/JournalVideo";
import { LettresCarnet } from "@/components/LettresCarnet";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Jobwow's Notebook — from 1 to 60 in WoW Forever",
  description: "Every Sunday at 6 pm, Jobwow's week in WoW Forever: memorable quests, traps avoided, encounters on the road.",
  alternates: { canonical: "/en/notebook/", languages: { fr: "/carnet/", en: "/en/notebook/", "x-default": "/carnet/" } },
};

const dateEn = (d: Date) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(d);

export default async function NotebookEn() {
  const [episodes, videos, en, fr] = await Promise.all([
    listerPubliesEn({ rubrique: "carnet", limite: 100 }),
    videosChaine(SITE.youtubeChaine),
    lettresCarnet("en", 12),
    lettresCarnet("fr", 12),
  ]);
  const lettres = lettresCarnetEn(en, fr, LETTRES_PREPAREES);
  return (
    <>
      <section className="bandeau-page">
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "Jobwow's Notebook" }]} />
          <div className="presentation-auteur">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/jobwow-512.png" width={140} height={140} alt="Jobwow's avatar: a Horde Undead, in-game screenshot" className="avatar-jobwow" />
            <div>
              <p className="surtitre">Every Sunday at 6 pm, Paris time</p>
              <h1>Jobwow&apos;s Notebook</h1>
              <p className="chapo">From 1 to 60 in WoW Forever, one week after another. The quests that stood out, the traps avoided, the encounters on the road.</p>
              <div className="actions-bandeau">
                {SITE.discord ? <a href={SITE.discord} className="btn btn-or" rel="noopener noreferrer" data-cta="discord-carnet-en">Reply to Jobwow on Discord</a> : null}
                <Link href="/en/newsletter/" className={SITE.discord ? "btn btn-contour" : "btn btn-or"} data-cta="lettre-carnet-en">Get the newsletter</Link>
                <Link href="/en/notebook/videos/" className="btn btn-contour" data-cta="videos-carnet-en">Jobwow&apos;s videos</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="wrap contenu">
        <div className="colonnes">
          <section className="colonne-principale" aria-labelledby="t-episodes">
            {videos.length ? <JournalVideo langue="en" videos={videos} /> : null}
            <h2 id="t-episodes" className="section-titre" style={{ fontSize: 26 }}>The episodes</h2>
            {episodes.length ? (
              <ol style={{ listStyle: "none", margin: 0, padding: "0 0 0 28px", borderLeft: "2px solid var(--bordure)", display: "flex", flexDirection: "column", gap: 28 }}>
                {episodes.map((e) => (
                  <li key={e.id}>
                    <p className="surtitre">{e.publieLe ? dateEn(e.publieLe) : ""}</p>
                    <h3 style={{ margin: "0 0 6px", fontSize: 22 }}><Link href={`/en/articles/${e.slug}/`}>{e.titre}</Link></h3>
                    <p className="doux" style={{ margin: 0 }}>{e.chapo}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="doux">First episode on Sunday 8 November at 6 pm, Paris time. Each episode is translated within an hour of its French publication.</p>
            )}
            <LettresCarnet lettres={lettres} langue="en" />
          </section>
          <aside className="colonne-laterale">
            <section className="encadre-nuit" aria-labelledby="t-fiche">
              <h2 id="t-fiche" className="titre" style={{ margin: "0 0 4px", fontSize: 22 }}>Jobwow</h2>
              <p style={{ margin: "0 0 14px", fontSize: 14, color: "#cfc7b4" }}>Undead · Horde</p>
              <dl style={{ margin: 0, display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 16px", fontSize: 15 }}>
                <dt style={{ color: "#cfc7b4" }}>Realm</dt><dd style={{ margin: 0 }}>Normal</dd>
                <dt style={{ color: "#cfc7b4" }}>Guild</dt><dd style={{ margin: 0 }}>CODEX</dd>
                <dt style={{ color: "#cfc7b4" }}>Professions</dt><dd style={{ margin: 0 }}>Herbalism · [Profession 2]</dd>
              </dl>
            </section>
            <div className="encadre">
              <h2>Why this notebook?</h2>
              <p className="doux" style={{ margin: 0, fontSize: 15 }}>News look alike from one site to another. A lived adventure does not. Here, everything is played before it is written.</p>
            </div>
          </aside>
        </div>
        {videos.length ? null : <div style={{ marginTop: 40 }}><JournalVideo langue="en" /></div>}
      </div>
    </>
  );
}
