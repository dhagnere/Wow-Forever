import Link from "next/link";
import type { VideoChaine } from "@/modules/veille";
import { VIDEOS_PREPAREES } from "@/content/videos-preparees";
import { prepareeDe } from "@/lib/videosPreparees";
import { SITE } from "@/lib/site";

const FORMATS = {
  fr: new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }),
  en: new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }),
};

const TEXTES = {
  fr: {
    titre: "Le Journal de Jobwow en vidéo",
    texte: "Chaque séance de jeu est sur YouTube, découpée en chapitres par lieu et par niveau.",
    derniere: "Dernière vidéo",
    regarder: "Regarder sur YouTube",
    videos: "Toutes les vidéos",
    chaine: "La chaîne YouTube",
    lienVideos: "/carnet/videos/",
    miniature: "Miniature de la vidéo",
  },
  en: {
    titre: "Jobwow's Journal on video",
    texte: "Every play session is on YouTube, split into chapters by place and level (the videos are in French).",
    derniere: "Latest video",
    regarder: "Watch on YouTube",
    videos: "All the videos",
    chaine: "The YouTube channel",
    lienVideos: "/en/notebook/videos/",
    miniature: "Video thumbnail",
  },
};

/**
 * Le Journal en vidéo, sur le Carnet et ses épisodes : la dernière vidéo de la chaîne (flux public), avec la miniature
 * gardée par le site quand elle a été préparée ici (aucune image chargée chez Google), puis les liens vers la page des
 * vidéos et la chaîne.
 */
export function JournalVideo({ langue = "fr", videos = [] }: { langue?: "fr" | "en"; videos?: VideoChaine[] }) {
  const t = TEXTES[langue];
  const derniere = videos[0];
  const miniature = derniere ? prepareeDe(derniere, VIDEOS_PREPAREES)?.miniature : undefined;
  const suffixe = langue === "en" ? "-en" : "";
  return (
    <section className="encadre journal-video" aria-labelledby={`t-journal-video-${langue}`}>
      <h2 id={`t-journal-video-${langue}`}>{t.titre}</h2>
      {derniere ? (
        <div className={miniature ? "journal-video-derniere avec-image" : "journal-video-derniere"}>
          {miniature ? (
            <a href={derniere.lien} rel="noopener noreferrer" data-cta={`video-carnet-image${suffixe}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={miniature} width={1280} height={720} alt={`${t.miniature} : ${derniere.titre}`} loading="lazy" />
            </a>
          ) : null}
          <div>
            <p className="surtitre" style={{ margin: 0 }}>
              {t.derniere}{derniere.publieLe ? ` · ${FORMATS[langue].format(new Date(derniere.publieLe))}` : ""}
            </p>
            <h3><a href={derniere.lien} rel="noopener noreferrer" data-cta={`video-carnet-titre${suffixe}`}>{derniere.titre}</a></h3>
            {derniere.resume ? <p className="doux" style={{ margin: "0 0 12px" }}>{derniere.resume}</p> : null}
            <a href={derniere.lien} className="btn btn-or" rel="noopener noreferrer" data-cta={`video-carnet${suffixe}`}>▶ {t.regarder}</a>
          </div>
        </div>
      ) : (
        <p className="doux" style={{ margin: "0 0 12px" }}>{t.texte}</p>
      )}
      <div className="actions-bandeau" style={{ marginTop: derniere ? 16 : 0 }}>
        <Link href={t.lienVideos} className={derniere || !SITE.youtube ? "btn btn-contour" : "btn btn-or"} data-cta={`videos-carnet-pied${suffixe}`}>{t.videos}</Link>
        {SITE.youtube ? (
          <a href={SITE.youtube} className={derniere ? "btn btn-contour" : "btn btn-or"} rel="noopener noreferrer" data-cta={`youtube-carnet${suffixe}`}>{t.chaine}</a>
        ) : null}
      </div>
    </section>
  );
}
