import type { Recette } from "@/modules/veille";
import { IconeObjet, NomObjet } from "./Objets";

/** Paliers de difficulté de la recette, comme dans le jeu : orange, jaune, vert, gris. */
function Paliers({ r }: { r: Recette }) {
  if (!r.jaune && !r.gris) return null;
  const vert = r.jaune && r.gris ? Math.round((r.jaune + r.gris) / 2) : 0;
  return (
    <p className="paliers" aria-label="Paliers de difficulté">
      <span className="palier palier-orange">{r.rang || 1}</span>
      {r.jaune ? <span className="palier palier-jaune">{r.jaune}</span> : null}
      {vert ? <span className="palier palier-vert">{vert}</span> : null}
      {r.gris ? <span className="palier palier-gris">{r.gris}</span> : null}
      <span className="doux"> rang de métier : la recette rapporte des points jusqu&apos;au gris</span>
    </p>
  );
}

export function Fabrication({ fabrication, composantDe, composantDeTotal, apprend = [] }: { fabrication: Recette[]; composantDe: Recette[]; composantDeTotal: number; apprend?: Recette[] }) {
  if (!fabrication.length && !composantDe.length && !apprend.length) return null;
  return (
    <section aria-labelledby="t-fabrique" className="fabrication">
      {apprend.length ? (
        <div className="encadre-chaud" style={{ marginBottom: 32 }}>
          <h2 className="section-titre" style={{ fontSize: 22, margin: "0 0 12px" }}>Apprend à fabriquer</h2>
          <ul className="utilise-pour">
            {apprend.map((r) => r.produit ? (
              <li key={r.sort}>
                <span className="lien-icone"><IconeObjet objet={r.produit} taille={32} /><NomObjet objet={r.produit} /></span>
                <small className="doux">{r.metier}{r.rang > 1 ? `, rang ${r.rang}` : ""} · {r.composants.map((c) => `${c.quantite} × ${c.nom}`).join(", ")}</small>
              </li>
            ) : null)}
          </ul>
        </div>
      ) : null}
      {fabrication.length ? (
        <>
          <h2 id="t-fabrique" className="section-titre" style={{ fontSize: 22 }}>Fabriqué par</h2>
          <div className="grille-recettes">
            {fabrication.map((r) => (
              <article key={r.sort} className="carte-recette">
                <p className="surtitre" style={{ margin: 0 }}>{r.metier}{r.rang > 1 ? ` · rang ${r.rang} requis` : ""}</p>
                <h3>{r.nom}{r.quantite > 1 ? <span className="doux"> (produit {r.quantite})</span> : null}</h3>
                <ul className="composants">
                  {r.composants.map((c) => (
                    <li key={c.id}>
                      <IconeObjet objet={c} taille={32} />
                      <span className="quantite">{c.quantite} ×</span>
                      <NomObjet objet={c} />
                    </li>
                  ))}
                </ul>
                <Paliers r={r} />
                {r.recette ? (
                  <p className="appris">Appris avec <span className="lien-icone"><IconeObjet objet={r.recette} taille={24} /><NomObjet objet={r.recette} /></span> : sa fiche dit où le trouver.</p>
                ) : (
                  <p className="appris doux">Appris auprès d&apos;un maître de {r.metier.toLowerCase()}.</p>
                )}
              </article>
            ))}
          </div>
        </>
      ) : null}
      {composantDe.length ? (
        <>
          <h2 id={fabrication.length ? "t-composant" : "t-fabrique"} className="section-titre" style={{ fontSize: 22, marginTop: fabrication.length ? 36 : 0 }}>
            Utilisé pour fabriquer
          </h2>
          <ul className="utilise-pour">
            {composantDe.map((r) => r.produit ? (
              <li key={r.sort}>
                <span className="lien-icone"><IconeObjet objet={r.produit} taille={28} /><NomObjet objet={r.produit} /></span>
                <small className="doux">{r.metier}{r.rang > 1 ? `, rang ${r.rang}` : ""}</small>
              </li>
            ) : null)}
          </ul>
          {composantDeTotal > composantDe.length ? <p className="doux" style={{ fontSize: 14 }}>Et {composantDeTotal - composantDe.length} autres recettes.</p> : null}
        </>
      ) : null}
    </section>
  );
}
