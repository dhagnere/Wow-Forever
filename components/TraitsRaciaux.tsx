import type { TraitRacial } from "@/modules/veille";
import { IconeSort } from "./SortsClasse";

/**
 * Traits raciaux lus dans les fichiers du jeu : actifs puis passifs. Un trait qui change selon la classe
 * (Pensée expansive, Eurêka !, Toucher du tombeau) affiche une ligne par groupe de classes.
 * `factions` ajoute la faction quand un trait n'est pas commun aux deux (Skyborne).
 */
export function TraitsRaciaux({ traits, factions, langue = "fr" }: { traits: TraitRacial[]; factions?: Record<string, string>; langue?: "fr" | "en" }) {
  if (!traits.length) return null;
  return (
    <ul className="sorts traits">
      {traits.map((t) => (
        <li key={t.nom} className="sort">
          <IconeSort fichier={t.icone} taille={36} />
          <div>
            <h4>
              {t.nom}
              {factions?.[t.nom] ? <span className="badge-talent">{factions[t.nom]}</span> : null}
            </h4>
            <p className="sort-meta">{t.passif ? (langue === "en" ? "Passive" : "Passif") : t.details.join(" · ")}</p>
            {t.variantes.map((v) => (
              <p key={v.classes?.join() ?? "toutes"} className="sort-desc">
                {v.classes ? <span className="doux">{v.classes.join(", ")}{langue === "en" ? ": " : " : "}</span> : null}
                {v.description}
              </p>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}
