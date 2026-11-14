import type { Metadata } from "next";
import Link from "next/link";
import { etatFluxChaine, videosChaine } from "@/modules/veille";
import { VIDEOS_PREPAREES } from "@/content/videos-preparees";
import { LETTRES_PREPAREES } from "@/content/lettres-preparees";
import { exigerAdmin } from "@/lib/admin";
import { problemesVideo, publication } from "@/lib/videosPreparees";
import { SITE, dateLongue } from "@/lib/site";
import { TexteACopier } from "../veille/[id]/Copier";
import { rafraichirVideos } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Vidéos" };

/**
 * Vidéos du Journal de Jobwow préparées pour YouTube (content/videos-preparees.ts) : titre et description, chapitres
 * compris, à coller dans YouTube Studio. Une vidéo passe « publiée » quand une vidéo publique de la chaîne porte son titre.
 */
export default async function AdminVideos({ searchParams }: { searchParams: Promise<{ rafraichi?: string }> }) {
  await exigerAdmin();
  const q = await searchParams;
  const [chaine, flux] = await Promise.all([videosChaine(SITE.youtubeChaine), etatFluxChaine(SITE.youtubeChaine)]);
  const enDirect = Math.max(0, ...flux.map((f) => f.videos));
  const semaines = [...new Set(VIDEOS_PREPAREES.map((v) => v.semaine))].sort().reverse();
  const aPublier = VIDEOS_PREPAREES.filter((v) => !publication(v, chaine, VIDEOS_PREPAREES)).length;
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Vidéos du Journal</h1>
      <p className="doux">
        {VIDEOS_PREPAREES.length} vidéo(s) préparée(s), dont <strong>{aPublier}</strong> à publier. Pour chacune : faire glisser le fichier d&apos;origine
        dans <a href="https://studio.youtube.com/" rel="noopener noreferrer">YouTube Studio</a>, coller le titre et la description, puis publier en
        « Public ». Le filigrane de la chaîne s&apos;ajoute seul. Les Lettres de la semaine sont dans <Link href="/admin/lettre/">Lettre</Link>.
      </p>

      <section className="encadre" style={{ marginTop: 16 }}>
        <h2 style={{ marginTop: 0, fontSize: 19 }}>La chaîne vue par le site</h2>
        {q.rafraichi ? <p className="succes" role="status">Pages des vidéos et du Carnet recalculées avec le flux du moment.</p> : null}
        <p style={{ margin: "0 0 8px" }}>
          Page publique <Link href="/carnet/videos/" target="_blank">Les vidéos de Jobwow</Link> : {chaine.length} vidéo(s) en mémoire, {enDirect} dans le flux de YouTube à l&apos;instant.
        </p>
        <ul className="doux" style={{ margin: "0 0 8px", fontSize: 14 }}>
          {flux.map((f) => (
            <li key={f.url}>
              {f.url.includes("playlist_id") ? "Liste « Mises en ligne »" : "Flux de la chaîne"} :{" "}
              {f.erreur ?? `${f.videos} vidéo(s)${f.titres.length ? ` (${f.titres.join(" · ")})` : ""}`}
            </li>
          ))}
        </ul>
        <p className="doux" style={{ margin: "0 0 10px", fontSize: 14 }}>
          Seules les vidéos <strong>publiques</strong> y figurent : une vidéo privée, non répertoriée ou programmée n&apos;apparaît qu&apos;une fois publique.
          YouTube met ensuite de quelques minutes à une heure à l&apos;ajouter à son flux ; le site le relit toutes les 10 minutes.
        </p>
        <form action={rafraichirVideos}><button type="submit" className="btn btn-or">Rafraîchir maintenant</button></form>
      </section>
      {!semaines.length ? <p>Aucune vidéo préparée pour l&apos;instant : envoyez les liens des parties filmées.</p> : null}
      {semaines.map((s) => {
        const lettres = LETTRES_PREPAREES.filter((l) => l.semaine === s);
        return (
          <section key={s} style={{ marginTop: 32 }}>
            <h2>Semaine {s.replace("-S", ", n° ")}</h2>
            {lettres.length ? (
              <p className="doux">Lettre de la semaine : {lettres.map((l) => (l.langue === "en" ? "anglaise" : "française")).join(" et ")}, à importer dans <Link href="/admin/lettre/">Lettre</Link>.</p>
            ) : null}
            <div style={{ display: "grid", gap: 18 }}>
              {VIDEOS_PREPAREES.filter((v) => v.semaine === s).sort((a, b) => a.id.localeCompare(b.id)).map((v) => {
                const pub = publication(v, chaine, VIDEOS_PREPAREES);
                const problemes = problemesVideo(v);
                return (
                  <article key={v.id} className="encadre" style={{ display: "grid", gap: 10 }}>
                    <p className="surtitre" style={{ margin: 0 }}>
                      Séance du {dateLongue(v.date)} · {v.duree} · {pub ? "publiée" : "à publier"}
                    </p>
                    <h3 style={{ margin: 0, fontSize: 19 }}>{v.titre}</h3>
                    {pub ? <p style={{ margin: 0 }}><a href={pub.lien} rel="noopener noreferrer">Voir sur YouTube</a></p> : null}
                    {problemes.length ? <p className="erreur" role="note" style={{ margin: 0 }}>À corriger : {problemes.join(" · ")}</p> : null}
                    <p className="doux" style={{ margin: 0, fontSize: 14 }}>
                      Fichier{v.fichiers.length > 1 ? "s (à assembler avec npm run carnet:video)" : ""} :{" "}
                      {v.fichiers.map((f, i) => (
                        <span key={f}>{i ? ", " : ""}<a href={v.liens[i]} rel="noopener noreferrer">{f}</a></span>
                      ))}
                    </p>
                    <figure style={{ margin: 0, display: "grid", gap: 6 }}>
                      <a href={v.miniature} download>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={v.miniature} alt={`Miniature : ${v.titre}`} width={1280} height={720} loading="lazy"
                          style={{ width: "100%", maxWidth: 480, height: "auto", borderRadius: 6, border: "1px solid var(--bord, #9a6a22)", display: "block" }} />
                      </a>
                      <figcaption className="doux" style={{ fontSize: 14 }}>
                        Miniature 1280 × 720 : <a href={v.miniature} download>télécharger</a>, puis dans YouTube Studio, section « Miniature », « Importer un fichier ».
                      </figcaption>
                    </figure>
                    <TexteACopier titre="Titre" texte={v.titre} note={`${v.titre.length} caractères sur 100.`} />
                    <TexteACopier titre="Description et chapitres" texte={v.description} note="YouTube crée les chapitres à partir des horodatages." />
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
