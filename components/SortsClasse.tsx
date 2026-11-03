import Link from "next/link";
import type { Sort, Specialisation, Talent } from "@/modules/veille";
import { iconeSort } from "@/lib/sorts";
import { OngletsSpe } from "./OngletsSpe";

/** Sorts et talents d'une classe, un onglet par spécialisation (données des fichiers du jeu). */

export function IconeSort({ fichier, taille = 40 }: { fichier: number; taille?: number }) {
  if (!fichier) return <span className="icone-sort icone-vide" style={{ width: taille, height: taille }} aria-hidden="true" />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={iconeSort(fichier)} alt="" width={taille} height={taille} loading="lazy" className="icone-sort icone-jeu" />;
}

const niveaux = (s: Sort) => {
  const a = s.rangs[0].niveau;
  const b = s.rangs[s.rangs.length - 1].niveau;
  return a === b ? `Niveau ${a}` : `Niveaux ${a} à ${b}`;
};

export function LigneSort({ s, complement }: { s: Sort; complement?: string }) {
  const dernier = s.rangs[s.rangs.length - 1];
  const meta = [niveaux(s), s.rangs.length > 1 ? `${s.rangs.length} rangs` : null, s.incantation, s.recharge, s.portee, dernier.cout].filter(Boolean);
  return (
    <li className="sort">
      <IconeSort fichier={s.icone} />
      <div>
        <h4>
          {s.nom}
          {s.talent ? <span className="badge-talent">Talent</span> : null}
        </h4>
        <p className="sort-meta">{meta.join(" · ")}</p>
        {complement ? <p className="sort-meta sort-familles">{complement}</p> : null}
        {dernier.description ? (
          <p className="sort-desc">
            {s.rangs.length > 1 ? <span className="doux">Rang {dernier.rang ?? s.rangs.length} : </span> : null}
            {dernier.description}
          </p>
        ) : null}
        {s.rangs.length > 1 ? (
          <details className="rangs">
            <summary>Voir les {s.rangs.length} rangs</summary>
            <div className="tableau-boite">
              <table>
                <thead><tr><th scope="col">Rang</th><th scope="col">Niveau</th><th scope="col">Coût</th><th scope="col">Effet</th></tr></thead>
                <tbody>
                  {s.rangs.map((r, i) => (
                    <tr key={r.id}>
                      <td>{r.rang ?? i + 1}</td>
                      <td>{r.niveau}</td>
                      <td className="doux">{r.cout ?? "–"}</td>
                      <td>{r.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        ) : null}
      </div>
    </li>
  );
}

function Talents({ talents }: { talents: Talent[] }) {
  const paliers = new Map<number, Talent[]>();
  for (const t of talents) paliers.set(t.palier, [...(paliers.get(t.palier) ?? []), t]);
  return (
    <ol className="paliers-talents">
      {[...paliers.entries()].map(([palier, liste]) => (
        <li key={palier}>
          <h4 className="palier-titre">
            Palier {palier + 1} <span className="doux">· niveau {liste[0].niveau}{palier ? `, ${palier * 5} points dans l'arbre` : ""}</span>
          </h4>
          <ul className="talents">
            {liste.map((t) => (
              <li key={t.id} className="sort">
                <IconeSort fichier={t.icone} taille={36} />
                <div>
                  <h5>
                    {t.nom} <span className="doux">({t.rangs} {t.rangs > 1 ? "rangs" : "rang"})</span>
                    {t.actif ? <span className="badge-talent">Sort</span> : null}
                  </h5>
                  {t.prerequis ? <p className="sort-meta">Requiert {t.prerequis}</p> : null}
                  {(t.descriptions ?? [t.premier]).map((d, k) => (d ? (
                    <p key={k} className="sort-desc">
                      {t.rangs > 1 ? <span className="doux">Rang {k + 1} : </span> : null}
                      {d}
                    </p>
                  ) : null))}
                </div>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

function Panneau({ spe, slugClasse }: { spe: Specialisation; slugClasse: string }) {
  const parTalent = spe.sorts.filter((s) => s.talent).length;
  return (
    <>
      <h3 className="spe-titre">
        <IconeSort fichier={spe.icone} taille={48} />
        {spe.nom}
      </h3>
      <h4 className="sous-titre-spe">Sorts et techniques <span className="doux">({spe.sorts.length}{parTalent ? `, dont ${parTalent} obtenus par talent` : ""})</span></h4>
      <ul className="sorts">
        {spe.sorts.map((s) => <LigneSort key={s.nom} s={s} />)}
      </ul>
      {spe.talents.length ? (
        <>
          <h4 className="sous-titre-spe">Arbre de talents <span className="doux">({spe.talents.length} talents)</span></h4>
          <p style={{ margin: "0 0 14px" }}>
            <Link href={`/classes/${slugClasse}/talents/`} className="btn btn-contour" data-cta="calculateur-spe">Composer mon build dans le calculateur</Link>
          </p>
          <Talents talents={spe.talents} />
        </>
      ) : null}
    </>
  );
}

export function SortsClasse({ slugClasse, nomClasse, version, specialisations }: { slugClasse: string; nomClasse: string; version: string; specialisations: Specialisation[] }) {
  return (
    <section aria-labelledby="t-sorts" id="sorts">
      <h2 id="t-sorts" className="section-titre" style={{ fontSize: 26 }}>Sorts et talents par spécialisation</h2>
      <p className="doux" style={{ marginTop: 0 }}>
        Chaque onglet regroupe les sorts appris chez le maître des {nomClasse.toLowerCase()}s, par école, puis l&apos;arbre de talents de la spécialisation.
        Pour répartir vos points, ouvrez le <Link href={`/classes/${slugClasse}/talents/`}>calculateur de talents</Link>.
      </p>
      <OngletsSpe onglets={specialisations.map((s) => ({ slug: s.slug, nom: s.nom, icone: s.icone ? iconeSort(s.icone) : "" }))}>
        {specialisations.map((s) => <Panneau key={s.slug} spe={s} slugClasse={slugClasse} />)}
      </OngletsSpe>
      <p className="doux note-donnees">
        Données lues dans les fichiers du jeu grâce à <a href="https://wago.tools" rel="noopener noreferrer">wago.tools</a>, version {version}.
        Valeurs de base, au niveau où chaque rang s&apos;apprend, sans bonus d&apos;équipement ; « X » dépend de votre puissance
        d&apos;attaque ou de votre arme. Forever ne publie encore que le premier rang des talents : les suivants apparaîtront ici dès qu&apos;une version du jeu les contiendra. Certains sorts présents dans
        les fichiers peuvent ne pas être actifs au lancement de Forever. Noms, textes et icônes : © Blizzard Entertainment
        (voir les <Link href="/mentions-legales/">mentions légales</Link>).
      </p>
    </section>
  );
}
