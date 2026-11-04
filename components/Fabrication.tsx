import type { Recette } from "@/modules/veille";
import { IconeObjet, NomObjet } from "./Objets";

type Langue = "fr" | "en";
const TXT = {
  fr: {
    paliers: "Paliers de difficulté", rangMetier: " rang de métier : la recette rapporte des points jusqu'au gris", apprend: "Apprend à fabriquer",
    rang: (n: number) => `, rang ${n}`, rangRequis: (n: number) => ` · rang ${n} requis`, fabrique: "Fabriqué par", produit: (n: number) => ` (produit ${n})`,
    appris: ["Appris avec", " : sa fiche dit où le trouver."], maitre: (m: string) => `Appris auprès d'un maître de ${m.toLowerCase()}.`,
    utilise: "Utilisé pour fabriquer", autres: (n: number) => `Et ${n} autres recettes.`,
  },
  en: {
    paliers: "Difficulty levels", rangMetier: " skill level: the recipe gives skill points until grey", apprend: "Teaches you how to make",
    rang: (n: number) => `, skill ${n}`, rangRequis: (n: number) => ` · requires skill ${n}`, fabrique: "Created by", produit: (n: number) => ` (makes ${n})`,
    appris: ["Learned from", ": its page tells where to find it."], maitre: (m: string) => `Learned from a ${m.toLowerCase()} trainer.`,
    utilise: "Reagent for", autres: (n: number) => `And ${n} other recipes.`,
  },
} as const;

/** Paliers de difficulté de la recette, comme dans le jeu : orange, jaune, vert, gris. */
function Paliers({ r, langue }: { r: Recette; langue: Langue }) {
  const t = TXT[langue];
  if (!r.jaune && !r.gris) return null;
  const vert = r.jaune && r.gris ? Math.round((r.jaune + r.gris) / 2) : 0;
  return (
    <p className="paliers" aria-label={t.paliers}>
      <span className="palier palier-orange">{r.rang || 1}</span>
      {r.jaune ? <span className="palier palier-jaune">{r.jaune}</span> : null}
      {vert ? <span className="palier palier-vert">{vert}</span> : null}
      {r.gris ? <span className="palier palier-gris">{r.gris}</span> : null}
      <span className="doux">{t.rangMetier}</span>
    </p>
  );
}

export function Fabrication({ fabrication, composantDe, composantDeTotal, apprend = [], langue = "fr" }: {
  fabrication: Recette[]; composantDe: Recette[]; composantDeTotal: number; apprend?: Recette[]; langue?: Langue;
}) {
  const t = TXT[langue];
  if (!fabrication.length && !composantDe.length && !apprend.length) return null;
  return (
    <section aria-labelledby="t-fabrique" className="fabrication">
      {apprend.length ? (
        <div className="encadre-chaud" style={{ marginBottom: 32 }}>
          <h2 className="section-titre" style={{ fontSize: 22, margin: "0 0 12px" }}>{t.apprend}</h2>
          <ul className="utilise-pour">
            {apprend.map((r) => r.produit ? (
              <li key={r.sort}>
                <span className="lien-icone"><IconeObjet objet={r.produit} taille={32} /><NomObjet objet={r.produit} langue={langue} /></span>
                <small className="doux">{r.metier}{r.rang > 1 ? t.rang(r.rang) : ""} · {r.composants.map((c) => `${c.quantite} × ${c.nom}`).join(", ")}</small>
              </li>
            ) : null)}
          </ul>
        </div>
      ) : null}
      {fabrication.length ? (
        <>
          <h2 id="t-fabrique" className="section-titre" style={{ fontSize: 22 }}>{t.fabrique}</h2>
          <div className="grille-recettes">
            {fabrication.map((r) => (
              <article key={r.sort} className="carte-recette">
                <p className="surtitre" style={{ margin: 0 }}>{r.metier}{r.rang > 1 ? t.rangRequis(r.rang) : ""}</p>
                <h3>{r.nom}{r.quantite > 1 ? <span className="doux">{t.produit(r.quantite)}</span> : null}</h3>
                <ul className="composants">
                  {r.composants.map((c) => (
                    <li key={c.id}>
                      <IconeObjet objet={c} taille={32} />
                      <span className="quantite">{c.quantite} ×</span>
                      <NomObjet objet={c} langue={langue} />
                    </li>
                  ))}
                </ul>
                <Paliers r={r} langue={langue} />
                {r.recette ? (
                  <p className="appris">{t.appris[0]} <span className="lien-icone"><IconeObjet objet={r.recette} taille={24} /><NomObjet objet={r.recette} langue={langue} /></span>{t.appris[1]}</p>
                ) : (
                  <p className="appris doux">{t.maitre(r.metier)}</p>
                )}
              </article>
            ))}
          </div>
        </>
      ) : null}
      {composantDe.length ? (
        <>
          <h2 id={fabrication.length ? "t-composant" : "t-fabrique"} className="section-titre" style={{ fontSize: 22, marginTop: fabrication.length ? 36 : 0 }}>
            {t.utilise}
          </h2>
          <ul className="utilise-pour">
            {composantDe.map((r) => r.produit ? (
              <li key={r.sort}>
                <span className="lien-icone"><IconeObjet objet={r.produit} taille={28} /><NomObjet objet={r.produit} langue={langue} /></span>
                <small className="doux">{r.metier}{r.rang > 1 ? t.rang(r.rang) : ""}</small>
              </li>
            ) : null)}
          </ul>
          {composantDeTotal > composantDe.length ? <p className="doux" style={{ fontSize: 14 }}>{t.autres(composantDeTotal - composantDe.length)}</p> : null}
        </>
      ) : null}
    </section>
  );
}
