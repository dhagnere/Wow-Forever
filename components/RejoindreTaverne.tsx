import { FormulaireLettre } from "@/app/(site)/lettre/FormulaireLettre";
import { SITE } from "@/lib/site";

/**
 * Bloc d'abonnement de l'accueil : la Lettre (formulaire sur place), la chaîne YouTube et la Page Facebook côte à côte.
 * Un seul appel par canal, chacun mesuré par son data-cta.
 */
const TXT = {
  fr: {
    titre: "Rejoindre la Taverne",
    chapo: "Trois façons de ne rien rater de WoW Forever. Choisissez la vôtre, ou les trois.",
    lettre: "La Lettre du dimanche",
    lettreTexte: "Chaque dimanche à 10 h : le billet de Jobwow, les cinq nouvelles de la semaine, un tuyau de jeu. Gratuite, désinscription en un clic.",
    youtube: "Le Journal en vidéo",
    youtubeTexte: "Les soirées de Jobwow de 1 à 60, en épisodes de 15 à 20 minutes, et des Shorts des meilleurs moments.",
    youtubeBouton: "S'abonner à la chaîne",
    facebook: "La Page Facebook",
    facebookTexte: "Les articles du jour, les illustrations et les tournées du tavernier, entre 8 h et 22 h.",
    facebookBouton: "Suivre la Page",
    discordBouton: "Rejoindre le Discord",
  },
  en: {
    titre: "Join the Tavern",
    chapo: "Three ways to keep up with WoW Forever. Pick yours, or all three.",
    lettre: "The Sunday newsletter",
    lettreTexte: "Every Sunday at 10 am: Jobwow's note, the week's five news items and a gameplay tip. Free, one-click unsubscribe.",
    youtube: "The video journal",
    youtubeTexte: "Jobwow's evenings from 1 to 60, in 15 to 20 minute episodes, plus Shorts of the best moments (in French).",
    youtubeBouton: "Subscribe to the channel",
    facebook: "The Facebook page",
    facebookTexte: "Daily articles, artwork and the innkeeper's rounds, between 8 am and 10 pm (Paris time).",
    facebookBouton: "Follow the page",
    discordBouton: "Join the Discord",
  },
} as const;

export function RejoindreTaverne({ langue = "fr" }: { langue?: "fr" | "en" }) {
  const t = TXT[langue];
  const suffixe = langue === "en" ? "-en" : "";
  return (
    <section className="rejoindre" aria-labelledby="t-rejoindre">
      <div className="centre">
        <h2 id="t-rejoindre" className="section-titre" style={{ marginBottom: 8 }}>{t.titre}</h2>
        <span className="ornement" aria-hidden="true" />
        <p className="doux" style={{ margin: "0 auto 28px", maxWidth: 560 }}>{t.chapo}</p>
      </div>
      <div className="rejoindre-grille">
        <div className="rejoindre-carte rejoindre-lettre cadre">
          <h3>{t.lettre}</h3>
          <p>{t.lettreTexte}</p>
          <FormulaireLettre langue={langue} cta={`lettre-accueil-form${suffixe}`} />
        </div>
        {SITE.youtube ? (
          <div className="rejoindre-carte cadre">
            <h3>{t.youtube}</h3>
            <p>{t.youtubeTexte}</p>
            <a href={`${SITE.youtube}?sub_confirmation=1`} className="btn btn-youtube" rel="noopener noreferrer" data-cta={`youtube-rejoindre${suffixe}`}>{t.youtubeBouton}</a>
          </div>
        ) : null}
        <div className="rejoindre-carte cadre">
          <h3>{t.facebook}</h3>
          <p>{t.facebookTexte}</p>
          <a href={SITE.facebook} className="btn btn-facebook" rel="noopener noreferrer" data-cta={`facebook-rejoindre${suffixe}`}>{t.facebookBouton}</a>
          {SITE.discord ? (
            <a href={SITE.discord} className="btn btn-contour" rel="noopener noreferrer" data-cta={`discord-rejoindre${suffixe}`} style={{ marginTop: 10 }}>{t.discordBouton}</a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
