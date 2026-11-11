import Link from "next/link";
import { SITE } from "@/lib/site";

const TEXTES = {
  fr: {
    titre: "Le Journal de Jobwow en vidéo",
    texte: "Chaque séance de jeu est sur YouTube, découpée en chapitres par lieu et par niveau.",
    videos: "Les vidéos sur le site",
    chaine: "La chaîne YouTube",
    lienVideos: "/carnet/videos/",
  },
  en: {
    titre: "Jobwow's Journal on video",
    texte: "Every play session is on YouTube, split into chapters by place and level (the videos are in French).",
    videos: "The videos on the site",
    chaine: "The YouTube channel",
    lienVideos: "/en/notebook/videos/",
  },
};

/** Renvoi vers la page des vidéos et la chaîne YouTube, en bas du Carnet et de ses épisodes. */
export function JournalVideo({ langue = "fr" }: { langue?: "fr" | "en" }) {
  const t = TEXTES[langue];
  return (
    <section className="encadre journal-video" aria-labelledby={`t-journal-video-${langue}`}>
      <h2 id={`t-journal-video-${langue}`}>{t.titre}</h2>
      <p className="doux" style={{ margin: "0 0 12px" }}>{t.texte}</p>
      <div className="actions-bandeau" style={{ marginTop: 0 }}>
        {SITE.youtube ? (
          <a href={SITE.youtube} className="btn btn-or" rel="noopener noreferrer" data-cta={langue === "en" ? "youtube-carnet-en" : "youtube-carnet"}>▶ {t.chaine}</a>
        ) : null}
        <Link href={t.lienVideos} className={SITE.youtube ? "btn btn-contour" : "btn btn-or"} data-cta={langue === "en" ? "videos-carnet-pied-en" : "videos-carnet-pied"}>{t.videos}</Link>
      </div>
    </section>
  );
}
