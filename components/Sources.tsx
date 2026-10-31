import { lienFrancais, nomLangue, type SourceCitee } from "@/modules/veille";

/** Une source citée : titre en français, lien vers la version française, lien vers l'original. */
export function LigneSource({ source }: { source: SourceCitee }) {
  const fr = lienFrancais(source.url, source.langue);
  const titre = source.titreFr || source.titre;
  const etrangere = !!source.langue && source.langue !== "fr";
  return (
    <li>
      <a href={fr.url} rel="noopener noreferrer nofollow" target="_blank" lang="fr">
        {source.nom} — {titre}
      </a>
      {fr.mode === "traduction" ? <span className="doux"> · traduction automatique</span> : null}
      {fr.mode === "officiel" ? <span className="doux"> · version française officielle</span> : null}
      {etrangere && fr.mode === "original" ? <span className="doux"> · en {nomLangue(source.langue)}</span> : null}
      {fr.mode !== "original" ? (
        <>
          {" "}
          <span className="doux">
            (<a href={source.url} rel="noopener noreferrer nofollow" target="_blank">
              original{etrangere ? ` en ${nomLangue(source.langue)}` : ""}
            </a>)
          </span>
        </>
      ) : null}
    </li>
  );
}
