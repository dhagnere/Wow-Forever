import Link from "next/link";
import {
  classesAutorisees, decouperPrix, emplacement, lienObjet, qualite, vitesseArme, type Objet, type ObjetResume,
} from "@/modules/veille";

export function urlObjet(id: number): string {
  return `/base-de-donnees/objets/${id}/`;
}

export function IconeObjet({ objet, taille = 36 }: { objet: Pick<ObjetResume, "icone" | "qualite">; taille?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="icone-objet"
      src={`/base-de-donnees/icones/${objet.icone}/`}
      alt=""
      width={taille}
      height={taille}
      loading="lazy"
      style={{ borderColor: qualite(objet.qualite).couleur }}
    />
  );
}

export function NomObjet({ objet, lien = true }: { objet: Pick<ObjetResume, "id" | "nom" | "qualite">; lien?: boolean }) {
  const style = { color: qualite(objet.qualite).couleur };
  return lien ? <Link href={urlObjet(objet.id)} className="nom-objet" style={style}>{objet.nom}</Link> : <span className="nom-objet" style={style}>{objet.nom}</span>;
}

export function Prix({ cuivre }: { cuivre: number }) {
  const p = decouperPrix(cuivre);
  const morceaux: [number, string, string][] = [[p.or, "po", "or"], [p.argent, "pa", "argent"], [p.cuivre, "pc", "cuivre"]];
  const affiches = morceaux.filter(([n]) => n > 0);
  return (
    <span className="prix">
      {(affiches.length ? affiches : [morceaux[2]]).map(([n, abr, metal]) => (
        <span key={metal} className={`piece piece-${metal}`}>{n}<abbr title={`pièce${n > 1 ? "s" : ""} d'${metal === "or" ? "or" : metal === "argent" ? "argent" : "cuivre"}`}>{abr}</abbr></span>
      ))}
    </span>
  );
}

/** Tableau d'objets : icône, nom, niveaux, type. */
export function TableauObjets({ objets, vide }: { objets: ObjetResume[]; vide: string }) {
  if (!objets.length) return <p className="doux">{vide}</p>;
  return (
    <div className="tableau-boite">
      <table className="table-objets">
        <thead>
          <tr>
            <th scope="col">Objet</th>
            <th scope="col" className="num"><abbr title="Niveau d'objet">Niv. obj.</abbr></th>
            <th scope="col" className="num"><abbr title="Niveau requis">Requis</abbr></th>
            <th scope="col" className="masque-mobile">Type</th>
          </tr>
        </thead>
        <tbody>
          {objets.map((o) => (
            <tr key={o.id}>
              <td>
                <span className="cellule-objet"><IconeObjet objet={o} /><NomObjet objet={o} /></span>
              </td>
              <td className="num">{o.niveauObjet || "–"}</td>
              <td className="num">{o.niveauRequis || "–"}</td>
              <td className="masque-mobile doux">{[o.categorie, emplacement(o.emplacement)].filter(Boolean).join(" · ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Infobulle d'objet, à la manière de celles du jeu. */
export function FicheObjet({ objet }: { objet: Objet }) {
  const q = qualite(objet.qualite);
  const classes = classesAutorisees(objet.classesAutorisees);
  const empl = emplacement(objet.emplacement);
  const estArme = objet.classe === 2;
  return (
    <div className="fiche-objet" style={{ borderColor: q.couleur }}>
      <div className="fiche-objet-tete">
        <IconeObjet objet={objet} taille={56} />
        <div>
          <h1 style={{ color: q.couleur }}>{objet.nom}</h1>
          <p className="fiche-qualite" style={{ color: q.couleur }}>{q.nom}</p>
        </div>
      </div>
      <ul className="fiche-lignes">
        {objet.niveauObjet ? <li className="fiche-or">Niveau d&apos;objet {objet.niveauObjet}</li> : null}
        {lienObjet(objet.lien) ? <li>{lienObjet(objet.lien)}</li> : null}
        {objet.exemplairesMax === 1 ? <li>Unique</li> : null}
        {empl || objet.categorie ? (
          <li className="fiche-double"><span>{empl ?? ""}</span><span>{objet.categorie}</span></li>
        ) : null}
        {estArme && objet.vitesseMs > 0 ? <li className="fiche-double"><span /><span>Vitesse {vitesseArme(objet.vitesseMs)}</span></li> : null}
        {objet.casesSac > 0 ? <li>Sac de {objet.casesSac} emplacements</li> : null}
        {classes.length ? (
          <li>Classes : {classes.map((c, i) => <span key={c.slug}>{i ? ", " : ""}<Link href={`/classes/${c.slug}/`}>{c.nom}</Link></span>)}</li>
        ) : null}
        {objet.niveauRequis > 1 ? <li>Niveau {objet.niveauRequis} requis</li> : null}
        {objet.description ? <li className="fiche-description">« {objet.description} »</li> : null}
        {objet.prixVente > 0 ? <li>Prix de vente : <Prix cuivre={objet.prixVente} /></li> : null}
      </ul>
    </div>
  );
}
