import Link from "next/link";
import { markdownVersHtml, type LettreParue } from "@/modules/veille";
import { dateLongue } from "@/lib/site";

const TEXTES = {
  fr: {
    titre: "Les Lettres de Jobwow",
    parue: "parue le",
    abonner: "Recevoir la Lettre",
    lienLettre: "/lettre/",
    texte: "La Lettre du dimanche, telle qu'elle est partie aux abonnés.",
  },
  en: {
    titre: "Jobwow's Letters",
    parue: "published on",
    abonner: "Get the Letter",
    lienLettre: "/en/newsletter/",
    texte: "The Sunday Letter, as it went out to subscribers.",
  },
};

const DATE_EN = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" });

/**
 * Lettres déjà lancées (jamais un brouillon : lettresParues ne lit que les envois partis), sous les épisodes du Carnet.
 * La plus récente est ouverte ; le corps passe par markdownVersHtml (garde-fou « Filtrage du HTML »).
 */
export function LettresCarnet({ lettres, langue = "fr" }: { lettres: LettreParue[]; langue?: "fr" | "en" }) {
  if (!lettres.length) return null;
  const t = TEXTES[langue];
  return (
    <section aria-labelledby={`t-lettres-carnet-${langue}`} style={{ marginTop: 44 }}>
      <h2 id={`t-lettres-carnet-${langue}`} className="section-titre" style={{ fontSize: 26 }}>{t.titre}</h2>
      <p className="doux" style={{ marginTop: 0 }}>{t.texte}</p>
      <div className="lettres-compte">
        {lettres.map((l, i) => (
          <details key={l.id} className="encadre" open={i === 0}>
            <summary>
              <strong>{l.sujet}</strong>{" "}
              <span className="doux">· {t.parue} {langue === "en" ? DATE_EN.format(new Date(l.parueLe)) : dateLongue(l.parueLe)}</span>
            </summary>
            <div className="corps" dangerouslySetInnerHTML={{ __html: markdownVersHtml(l.corps) }} />
          </details>
        ))}
      </div>
      <p style={{ marginBottom: 0 }}>
        <Link href={t.lienLettre} className="btn btn-contour" data-cta={langue === "en" ? "lettre-carnet-liste-en" : "lettre-carnet-liste"}>{t.abonner}</Link>
      </p>
    </section>
  );
}
