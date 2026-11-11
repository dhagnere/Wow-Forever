import type { VideoChaine } from "@/modules/veille";
import { SITE } from "@/lib/site";

const FORMATS = {
  fr: new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }),
  en: new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }),
};

const TEXTES = {
  fr: {
    regarder: "Regarder sur YouTube",
    vide: "Les premières vidéos arrivent bientôt sur la chaîne.",
    pasReglee: "La chaîne YouTube de la Taverne ouvre bientôt.",
    chaine: "Voir la chaîne YouTube",
    note: "Les vidéos se regardent sur YouTube : cette page n'intègre aucun lecteur et ne transmet rien à Google.",
  },
  en: {
    regarder: "Watch on YouTube",
    vide: "The first videos are coming to the channel soon.",
    pasReglee: "The Tavern's YouTube channel opens soon.",
    chaine: "Visit the YouTube channel",
    note: "The videos play on YouTube: this page embeds no player and sends nothing to Google.",
  },
};

/** Liste des dernières vidéos de la chaîne (flux public), avec un lien vers YouTube pour chacune. */
export function VideosChaine({ videos, langue = "fr" }: { videos: VideoChaine[]; langue?: "fr" | "en" }) {
  const t = TEXTES[langue];
  return (
    <div className="sections" style={{ gap: 28 }}>
      {videos.length ? (
        <ol className="videos-chaine">
          {videos.map((v) => (
            <li key={v.id} className="encadre">
              {v.publieLe ? <p className="surtitre" style={{ margin: 0 }}>{FORMATS[langue].format(new Date(v.publieLe))}</p> : null}
              <h2 style={{ margin: "4px 0 6px", fontSize: 21 }}>
                <a href={v.lien} rel="noopener noreferrer" data-cta="video-youtube">{v.titre}</a>
              </h2>
              {v.resume ? <p className="doux" style={{ margin: "0 0 12px" }}>{v.resume}</p> : null}
              <a href={v.lien} className="btn btn-contour" rel="noopener noreferrer" data-cta="video-youtube-bouton">▶ {t.regarder}</a>
            </li>
          ))}
        </ol>
      ) : (
        <p>{SITE.youtubeChaine ? t.vide : t.pasReglee}</p>
      )}
      <div className="actions-bandeau">
        {SITE.youtube ? <a href={SITE.youtube} className="btn btn-or" rel="noopener noreferrer" data-cta="chaine-youtube">{t.chaine}</a> : null}
      </div>
      <p className="doux" style={{ fontSize: 14, margin: 0 }}>{t.note}</p>
    </div>
  );
}
