import Link from "next/link";
import { CLASSES_GUILDE, FACTIONS, OBJECTIFS, ROLES, TYPES_ROYAUME, type Guilde } from "@/modules/veille";
import { dateLongue } from "@/lib/site";

export const LIBELLES_GUILDE = { factions: FACTIONS, types: TYPES_ROYAUME, objectifs: OBJECTIFS, roles: ROLES, classes: CLASSES_GUILDE };

const nomDe = (table: Record<string, string>, cles: string[]) => cles.map((c) => table[c]).filter(Boolean);

/** Liens déposés par les guildes : ni suivis par les moteurs, ni porteurs de l'adresse d'origine. */
const REL_UGC = "nofollow ugc noopener noreferrer";

export function CarteGuilde({ g, complete = false }: { g: Guilde; complete?: boolean }) {
  const objectifs = nomDe(OBJECTIFS, g.objectifs);
  const classes = nomDe(CLASSES_GUILDE, g.classes);
  const roles = nomDe(ROLES, g.roles);
  return (
    <article className={`carte-guilde faction-${g.faction}`}>
      <header>
        <p className="surtitre">{FACTIONS[g.faction]} · {g.serveur} · {TYPES_ROYAUME[g.typeRoyaume]}</p>
        <h2>{complete ? g.nom : <Link href={`/guildes/${g.slug}/`}>{g.nom}</Link>}</h2>
        {g.recrute ? <span className="etiquette etiquette-recrute">Recrute</span> : <span className="etiquette">Complet</span>}
      </header>
      {objectifs.length ? <ul className="puces">{objectifs.map((o) => <li key={o} className="puce puce-douce">{o}</li>)}</ul> : null}
      <p className="texte-guilde">{complete ? g.description : g.description.length > 220 ? `${g.description.slice(0, 220).replace(/\s+\S*$/, "")}…` : g.description}</p>
      {g.recrute && (roles.length || classes.length) ? (
        <p className="doux" style={{ fontSize: 14 }}>
          <strong>Recherche :</strong> {[...roles, ...classes].join(", ")}
        </p>
      ) : null}
      {g.horaires ? <p className="doux" style={{ fontSize: 14 }}><strong>Horaires :</strong> {g.horaires}</p> : null}
      <footer>
        <div className="actions-guilde">
          {g.discord ? <a href={g.discord} className="btn btn-or btn-petit" rel={REL_UGC} target="_blank" data-cta="discord-guilde">Rejoindre le Discord</a> : null}
          {g.site ? <a href={g.site} className="btn btn-contour btn-petit" rel={REL_UGC} target="_blank">Site de la guilde</a> : null}
          {g.contactJeu ? <span className="doux" style={{ fontSize: 14 }}>En jeu : <strong>{g.contactJeu}</strong></span> : null}
        </div>
        <p className="doux" style={{ fontSize: 13, margin: 0 }}>Mise à jour le {dateLongue(g.majLe)}</p>
      </footer>
    </article>
  );
}
