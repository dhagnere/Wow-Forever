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

export type Langue = "fr" | "en";
const TXT = {
  fr: {
    niveau: (a: number, b: number) => (a === b ? `Niveau ${a}` : `Niveaux ${a} à ${b}`), rangs: (n: number) => `${n} rangs`, rang: "Rang",
    voir: (n: number) => `Voir les ${n} rangs`, niv: "Niveau", cout: "Coût", effet: "Effet", talent: "Talent", sort: "Sort",
    palier: "Palier", nivMin: "niveau", dansArbre: (n: number) => `, ${n} points dans l'arbre`, nbRangs: (n: number) => `${n} ${n > 1 ? "rangs" : "rang"}`,
    requiert: "Requiert", sortsTech: "Sorts et techniques", parTalent: (n: number) => `, dont ${n} obtenus par talent`, arbre: "Arbre de talents",
    talents: (n: number) => `${n} talents`, composer: "Composer mon build dans le calculateur", titre: "Sorts et talents par spécialisation", dp: " : ",
  },
  en: {
    niveau: (a: number, b: number) => (a === b ? `Level ${a}` : `Levels ${a} to ${b}`), rangs: (n: number) => `${n} ranks`, rang: "Rank",
    voir: (n: number) => `Show all ${n} ranks`, niv: "Level", cout: "Cost", effet: "Effect", talent: "Talent", sort: "Spell",
    palier: "Tier", nivMin: "level", dansArbre: (n: number) => `, ${n} points in the tree`, nbRangs: (n: number) => `${n} ${n > 1 ? "ranks" : "rank"}`,
    requiert: "Requires", sortsTech: "Spells and abilities", parTalent: (n: number) => `, ${n} from talents`, arbre: "Talent tree",
    talents: (n: number) => `${n} talents`, composer: "Plan my build in the talent calculator", titre: "Spells and talents by specialisation", dp: ": ",
  },
} as const;
export type TextesSorts = (typeof TXT)["fr"] | (typeof TXT)["en"];
export const textesSorts = (l: Langue): TextesSorts => TXT[l];

export function LigneSort({ s, complement, langue = "fr" }: { s: Sort; complement?: string; langue?: Langue }) {
  const L = TXT[langue];
  const dernier = s.rangs[s.rangs.length - 1];
  const meta = [L.niveau(s.rangs[0].niveau, dernier.niveau), s.rangs.length > 1 ? L.rangs(s.rangs.length) : null, s.incantation, s.recharge, s.portee, dernier.cout].filter(Boolean);
  return (
    <li className="sort">
      <IconeSort fichier={s.icone} />
      <div>
        <h4>
          {s.nom}
          {s.talent ? <span className="badge-talent">{L.talent}</span> : null}
        </h4>
        <p className="sort-meta">{meta.join(" · ")}</p>
        {complement ? <p className="sort-meta sort-familles">{complement}</p> : null}
        {dernier.description ? (
          <p className="sort-desc">
            {s.rangs.length > 1 ? <span className="doux">{L.rang} {dernier.rang ?? s.rangs.length}{L.dp}</span> : null}
            {dernier.description}
          </p>
        ) : null}
        {s.rangs.length > 1 ? (
          <details className="rangs">
            <summary>{L.voir(s.rangs.length)}</summary>
            <div className="tableau-boite">
              <table>
                <thead><tr><th scope="col">{L.rang}</th><th scope="col">{L.niv}</th><th scope="col">{L.cout}</th><th scope="col">{L.effet}</th></tr></thead>
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

function Talents({ talents, L }: { talents: Talent[]; L: TextesSorts }) {
  const paliers = new Map<number, Talent[]>();
  for (const t of talents) paliers.set(t.palier, [...(paliers.get(t.palier) ?? []), t]);
  return (
    <ol className="paliers-talents">
      {[...paliers.entries()].map(([palier, liste]) => (
        <li key={palier}>
          <h4 className="palier-titre">
            {L.palier} {palier + 1} <span className="doux">· {L.nivMin} {liste[0].niveau}{palier ? L.dansArbre(palier * 5) : ""}</span>
          </h4>
          <ul className="talents">
            {liste.map((t) => (
              <li key={t.id} className="sort">
                <IconeSort fichier={t.icone} taille={36} />
                <div>
                  <h5>
                    {t.nom} <span className="doux">({L.nbRangs(t.rangs)})</span>
                    {t.actif ? <span className="badge-talent">{L.sort}</span> : null}
                  </h5>
                  {t.prerequis ? <p className="sort-meta">{L.requiert} {t.prerequis}</p> : null}
                  {(t.descriptions ?? [t.premier]).map((d, k) => (d ? (
                    <p key={k} className="sort-desc">
                      {t.rangs > 1 ? <span className="doux">{L.rang} {k + 1}{L.dp}</span> : null}
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

function Panneau({ spe, lienCalculateur, langue }: { spe: Specialisation; lienCalculateur: string; langue: Langue }) {
  const L = TXT[langue];
  const parTalent = spe.sorts.filter((s) => s.talent).length;
  return (
    <>
      <h3 className="spe-titre">
        <IconeSort fichier={spe.icone} taille={48} />
        {spe.nom}
      </h3>
      <h4 className="sous-titre-spe">{L.sortsTech} <span className="doux">({spe.sorts.length}{parTalent ? L.parTalent(parTalent) : ""})</span></h4>
      <ul className="sorts">
        {spe.sorts.map((s) => <LigneSort key={s.nom} s={s} langue={langue} />)}
      </ul>
      {spe.talents.length ? (
        <>
          <h4 className="sous-titre-spe">{L.arbre} <span className="doux">({L.talents(spe.talents.length)})</span></h4>
          <p style={{ margin: "0 0 14px" }}>
            <Link href={lienCalculateur} className="btn btn-contour" data-cta="calculateur-spe">{L.composer}</Link>
          </p>
          <Talents talents={spe.talents} L={L} />
        </>
      ) : null}
    </>
  );
}

export function SortsClasse({ slugClasse, nomClasse, version, specialisations, langue = "fr", lienCalculateur = `/classes/${slugClasse}/talents/` }: {
  slugClasse: string; nomClasse: string; version: string; specialisations: Specialisation[]; langue?: Langue; lienCalculateur?: string;
}) {
  const en = langue === "en";
  return (
    <section aria-labelledby="t-sorts" id="sorts">
      <h2 id="t-sorts" className="section-titre" style={{ fontSize: 26 }}>{TXT[langue].titre}</h2>
      {en ? (
        <p className="doux" style={{ marginTop: 0 }}>
          Each tab lists the spells learned from the {nomClasse.toLowerCase()} trainer, by school, then the talent tree of that specialisation.
          To spend your points, open the <Link href={lienCalculateur}>talent calculator</Link>.
        </p>
      ) : null}
      {en ? null : <p className="doux" style={{ marginTop: 0 }}>
        Chaque onglet regroupe les sorts appris chez le maître des {nomClasse.toLowerCase()}s, par école, puis l&apos;arbre de talents de la spécialisation.
        Pour répartir vos points, ouvrez le <Link href={lienCalculateur}>calculateur de talents</Link>.
      </p>}
      <OngletsSpe langue={langue} onglets={specialisations.map((s) => ({ slug: s.slug, nom: s.nom, icone: s.icone ? iconeSort(s.icone) : "" }))}>
        {specialisations.map((s) => <Panneau key={s.slug} spe={s} lienCalculateur={lienCalculateur} langue={langue} />)}
      </OngletsSpe>
      {en ? (
        <p className="doux note-donnees">
          Data read from the game files thanks to <a href="https://wago.tools" rel="noopener noreferrer">wago.tools</a>, version {version}.
          Base values, at the level each rank is learned, without gear bonuses; “X” depends on your attack power or weapon. Forever only
          publishes the first rank of most talents so far: further ranks will appear here as soon as a game version includes them. Some
          spells in the files may not be active at Forever&apos;s launch. Names, texts and icons: © Blizzard Entertainment.
        </p>
      ) : <p className="doux note-donnees">
        Données lues dans les fichiers du jeu grâce à <a href="https://wago.tools" rel="noopener noreferrer">wago.tools</a>, version {version}.
        Valeurs de base, au niveau où chaque rang s&apos;apprend, sans bonus d&apos;équipement ; « X » dépend de votre puissance
        d&apos;attaque ou de votre arme. Forever ne publie encore que le premier rang des talents : les suivants apparaîtront ici dès qu&apos;une version du jeu les contiendra. Certains sorts présents dans
        les fichiers peuvent ne pas être actifs au lancement de Forever. Noms, textes et icônes : © Blizzard Entertainment
        (voir les <Link href="/mentions-legales/">mentions légales</Link>).
      </p>}
    </section>
  );
}
