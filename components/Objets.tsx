import Link from "next/link";
import {
  bonusPrincipal, classesAutorisees, decouperPrix, emplacement, lienObjet, NOMS_CARACTERISTIQUES, NOMS_CARACTERISTIQUES_EN, qualite, vitesseArme,
  type Objet, type ObjetResume,
} from "@/modules/veille";
import { CLASSES_EN } from "@/lib/anglais";

type Langue = "fr" | "en";

export function urlObjet(id: number, langue: Langue = "fr"): string {
  return langue === "en" ? `/en/item-database/items/${id}/` : `/base-de-donnees/objets/${id}/`;
}

const TXT = {
  fr: {
    objet: "Objet", nivObj: "Niv. obj.", nivObjLong: "Niveau d'objet", requis: "Requis", requisLong: "Niveau requis", type: "Type",
    niveauObjet: "Niveau d'objet", unique: "Unique", degats: (a: number, b: number) => `${a} - ${b} points de dégâts`, vitesse: "Vitesse",
    dps: (v: string) => `(${v} dégâts par seconde)`, armure: (n: number) => `Armure : ${n}`, carac: "caractéristique",
    sac: (n: number) => `Sac de ${n} emplacements`, classes: "Classes : ", niveau: (n: number) => `Niveau ${n} requis`, equipe: "Équipé : ",
    vente: "Prix de vente : ", nombre: "fr-FR", guillemets: ["« ", " »"],
    pieces: { or: ["po", "or"], argent: ["pa", "argent"], cuivre: ["pc", "cuivre"] } as Record<string, [string, string]>,
    piece: (n: number, metal: string) => `pièce${n > 1 ? "s" : ""} d'${metal}`,
  },
  en: {
    objet: "Item", nivObj: "iLvl", nivObjLong: "Item level", requis: "Req.", requisLong: "Required level", type: "Type",
    niveauObjet: "Item Level", unique: "Unique", degats: (a: number, b: number) => `${a} - ${b} Damage`, vitesse: "Speed",
    dps: (v: string) => `(${v} damage per second)`, armure: (n: number) => `${n} Armor`, carac: "stat",
    sac: (n: number) => `${n} Slot Bag`, classes: "Classes: ", niveau: (n: number) => `Requires Level ${n}`, equipe: "Equip: ",
    vente: "Sell price: ", nombre: "en-GB", guillemets: ["“", "”"],
    pieces: { or: ["g", "gold"], argent: ["s", "silver"], cuivre: ["c", "copper"] } as Record<string, [string, string]>,
    piece: (n: number, metal: string) => `${metal} coin${n === 1 ? "" : "s"}`,
  },
};

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

export function NomObjet({ objet, lien = true, langue = "fr" }: { objet: Pick<ObjetResume, "id" | "nom" | "qualite">; lien?: boolean; langue?: Langue }) {
  const style = { color: qualite(objet.qualite).couleur };
  return lien ? <Link href={urlObjet(objet.id, langue)} className="nom-objet" style={style}>{objet.nom}</Link> : <span className="nom-objet" style={style}>{objet.nom}</span>;
}

export function Prix({ cuivre, langue = "fr" }: { cuivre: number; langue?: Langue }) {
  const t = TXT[langue];
  const p = decouperPrix(cuivre);
  const morceaux: [number, string][] = [[p.or, "or"], [p.argent, "argent"], [p.cuivre, "cuivre"]];
  const affiches = morceaux.filter(([n]) => n > 0);
  return (
    <span className="prix">
      {(affiches.length ? affiches : [morceaux[2]]).map(([n, metal]) => (
        <span key={metal} className={`piece piece-${metal}`}>{n}<abbr title={t.piece(n, t.pieces[metal][1])}>{t.pieces[metal][0]}</abbr></span>
      ))}
    </span>
  );
}

/** Tableau d'objets : icône, nom, niveaux, type. */
export function TableauObjets({ objets, vide, langue = "fr" }: { objets: ObjetResume[]; vide: string; langue?: Langue }) {
  const t = TXT[langue];
  if (!objets.length) return <p className="doux">{vide}</p>;
  return (
    <div className="tableau-boite">
      <table className="table-objets">
        <thead>
          <tr>
            <th scope="col">{t.objet}</th>
            <th scope="col" className="num"><abbr title={t.nivObjLong}>{t.nivObj}</abbr></th>
            <th scope="col" className="num"><abbr title={t.requisLong}>{t.requis}</abbr></th>
            <th scope="col" className="masque-mobile">{t.type}</th>
          </tr>
        </thead>
        <tbody>
          {objets.map((o) => (
            <tr key={o.id}>
              <td>
                <span className="cellule-objet"><IconeObjet objet={o} /><NomObjet objet={o} langue={langue} /></span>
              </td>
              <td className="num">{o.niveauObjet || "–"}</td>
              <td className="num">{o.niveauRequis || "–"}</td>
              <td className="masque-mobile doux">{[o.categorie, emplacement(o.emplacement, langue)].filter(Boolean).join(" · ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Infobulle d'objet, à la manière de celles du jeu. */
export function FicheObjet({ objet, langue = "fr" }: { objet: Objet; langue?: Langue }) {
  const t = TXT[langue];
  const en = langue === "en";
  const noms = en ? NOMS_CARACTERISTIQUES_EN : NOMS_CARACTERISTIQUES;
  const q = qualite(objet.qualite, langue);
  const classes = classesAutorisees(objet.classesAutorisees);
  const empl = emplacement(objet.emplacement, langue);
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
        {objet.niveauObjet ? <li className="fiche-or">{t.niveauObjet} {objet.niveauObjet}</li> : null}
        {lienObjet(objet.lien, langue) ? <li>{lienObjet(objet.lien, langue)}</li> : null}
        {objet.exemplairesMax === 1 ? <li>{t.unique}</li> : null}
        {empl || objet.categorie ? (
          <li className="fiche-double"><span>{empl ?? ""}</span><span>{objet.categorie}</span></li>
        ) : null}
        {estArme && objet.vitesseMs > 0 ? (
          <li className="fiche-double">
            <span>{objet.degatsMin !== null && objet.degatsMax !== null ? t.degats(objet.degatsMin, objet.degatsMax) : ""}</span>
            <span>{t.vitesse} {vitesseArme(objet.vitesseMs, langue)}</span>
          </li>
        ) : null}
        {estArme && objet.degatsMin !== null && objet.degatsMax !== null && objet.vitesseMs > 0 ? (
          <li>{t.dps(((objet.degatsMin + objet.degatsMax) / 2 / (objet.vitesseMs / 1000)).toLocaleString(t.nombre, { minimumFractionDigits: 1, maximumFractionDigits: 1 }))}</li>
        ) : null}
        {objet.armure ? <li>{t.armure(objet.armure)}</li> : null}
        {objet.caracteristiques.filter((c) => bonusPrincipal(c.type)).map((c, i) => (
          <li key={`p${i}`}>+{c.valeur} {noms[c.type] ?? t.carac}</li>
        ))}
        {objet.casesSac > 0 ? <li>{t.sac(objet.casesSac)}</li> : null}
        {classes.length ? (
          <li>{t.classes}{classes.map((c, i) => <span key={c.slug}>{i ? ", " : ""}<Link href={en ? `/en/classes/${CLASSES_EN[c.slug].slug}/` : `/classes/${c.slug}/`}>{en ? CLASSES_EN[c.slug].nom : c.nom}</Link></span>)}</li>
        ) : null}
        {objet.niveauRequis > 1 ? <li>{t.niveau(objet.niveauRequis)}</li> : null}
        {objet.caracteristiques.filter((c) => !bonusPrincipal(c.type)).map((c, i) => (
          <li key={`e${i}`} className="fiche-equipe">{t.equipe}+{c.valeur} {noms[c.type] ?? t.carac}</li>
        ))}
        {objet.description ? <li className="fiche-description">{t.guillemets[0]}{objet.description}{t.guillemets[1]}</li> : null}
        {objet.prixVente > 0 ? <li>{t.vente}<Prix cuivre={objet.prixVente} langue={langue} /></li> : null}
      </ul>
    </div>
  );
}
