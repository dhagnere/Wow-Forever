import type { Familiers } from "@/modules/veille";
import { IconeSort, LigneSort } from "./SortsClasse";

/**
 * Familiers d'une classe (données des fichiers du jeu). Chasseur : chaque famille de bêtes et ses techniques propres,
 * puis toutes les techniques avec les familles qui les apprennent. Démoniste : chaque démon et ses sorts.
 */
export function FamiliersClasse({ classe, familiers }: { classe: string; familiers: Familiers }) {
  const chasseur = familiers.mode === "partage";
  const communes = familiers.techniques.filter((t) => t.familles === null);
  const propres = new Set(familiers.techniques.filter((t) => t.familles !== null).map((t) => t.nom));

  return (
    <section aria-labelledby="t-familiers" id="familiers">
      <h2 id="t-familiers" className="section-titre" style={{ fontSize: 26 }}>
        {chasseur ? "Les familiers et leurs techniques" : "Les démons et leurs sorts"}
      </h2>
      {chasseur ? (
        <p className="doux" style={{ marginTop: 0 }}>
          Chaque famille de bêtes a ses techniques propres ; {communes.length} autres conviennent à toutes les familles. Dans
          l&apos;Azeroth d&apos;origine, le chasseur les enseigne à son familier par le Dressage des bêtes, après les avoir apprises
          d&apos;une bête sauvage ou d&apos;un maître des familiers. Les niveaux indiqués sont ceux du familier.
        </p>
      ) : (
        <p className="doux" style={{ marginTop: 0 }}>
          Chaque démon a ses propres sorts. Dans l&apos;Azeroth d&apos;origine, les rangs suivants s&apos;achètent sous forme
          de grimoires auprès des marchands de démons des capitales. Les niveaux indiqués sont ceux du démon.
        </p>
      )}

      {chasseur ? (
        <>
          <ul className="familles">
            {familiers.familles.map((f) => (
              <li key={f.nom} className="famille">
                <IconeSort fichier={f.icone} taille={44} />
                <div>
                  <h3>{f.nom}</h3>
                  <p className="sort-meta">{f.techniques.filter((t) => propres.has(t)).join(" · ")}</p>
                </div>
              </li>
            ))}
          </ul>
          <h3 className="sous-titre-spe">Toutes les techniques <span className="doux">({familiers.techniques.length})</span></h3>
          <ul className="sorts">
            {familiers.techniques.map((t) => (
              <LigneSort
                key={t.nom}
                s={t}
                complement={t.familles === null ? "Toutes les familles" : `${t.familles.length > 1 ? "Familles" : "Famille"} : ${t.familles.join(", ")}`}
              />
            ))}
          </ul>
        </>
      ) : (
        familiers.familles.map((f) => (
          <div key={f.nom} className="demon">
            <h3 className="spe-titre">
              <IconeSort fichier={f.icone} taille={48} />
              {f.nom}
            </h3>
            <ul className="sorts">
              {familiers.techniques.filter((t) => t.familles?.includes(f.nom)).map((t) => <LigneSort key={t.nom} s={t} />)}
            </ul>
          </div>
        ))
      )}
      <p className="doux note-donnees">
        Familiers du {classe.toLowerCase()} lus dans les fichiers du jeu (wago.tools) ; valeurs de base, au niveau où chaque rang s&apos;apprend.
        Noms, textes et icônes : © Blizzard Entertainment.
      </p>
    </section>
  );
}
