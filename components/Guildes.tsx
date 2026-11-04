import Link from "next/link";
import { CLASSES_GUILDE, FACTIONS, OBJECTIFS, ROLES, TYPES_ROYAUME, type Guilde } from "@/modules/veille";
import { dateLongue } from "@/lib/site";

export const LIBELLES_GUILDE = { factions: FACTIONS, types: TYPES_ROYAUME, objectifs: OBJECTIFS, roles: ROLES, classes: CLASSES_GUILDE };

/** Mêmes listes, libellés anglais (version /en/guilds/) : les valeurs envoyées restent les mêmes. */
export const LIBELLES_GUILDE_EN = {
  factions: { alliance: "Alliance", horde: "Horde" },
  types: { jce: "PvE", jcj: "PvP", rp: "Roleplay", hardcore: "Hardcore" },
  objectifs: { leveling: "Leveling", donjons: "Dungeons", raids: "Raids", jcj: "PvP", rp: "Roleplay", metiers: "Professions", hardcore: "Hardcore", detente: "Casual" },
  roles: { tank: "Tank", soigneur: "Healer", degats: "Damage" },
  classes: {
    guerrier: "Warrior", paladin: "Paladin", chasseur: "Hunter", voleur: "Rogue", pretre: "Priest",
    chaman: "Shaman", mage: "Mage", demoniste: "Warlock", druide: "Druid",
  },
} satisfies Record<keyof typeof LIBELLES_GUILDE, Record<string, string>>;

const dateEn = (d: Date) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(d);

const nomDe = (table: Record<string, string>, cles: string[]) => cles.map((c) => table[c]).filter(Boolean);

/** Liens déposés par les guildes : ni suivis par les moteurs, ni porteurs de l'adresse d'origine. */
const REL_UGC = "nofollow ugc noopener noreferrer";

export function CarteGuilde({ g, complete = false, langue = "fr" }: { g: Guilde; complete?: boolean; langue?: "fr" | "en" }) {
  const en = langue === "en";
  const L = en ? LIBELLES_GUILDE_EN : LIBELLES_GUILDE;
  const objectifs = nomDe(L.objectifs, g.objectifs);
  const classes = nomDe(L.classes, g.classes);
  const roles = nomDe(L.roles, g.roles);
  return (
    <article className={`carte-guilde faction-${g.faction}`}>
      <header>
        <p className="surtitre">{(L.factions as Record<string, string>)[g.faction]} · {g.serveur} · {(L.types as Record<string, string>)[g.typeRoyaume]}</p>
        <h2>{complete ? g.nom : <Link href={en ? `/en/guilds/${g.slug}/` : `/guildes/${g.slug}/`}>{g.nom}</Link>}</h2>
        {g.recrute ? <span className="etiquette etiquette-recrute">{en ? "Recruiting" : "Recrute"}</span> : <span className="etiquette">{en ? "Full" : "Complet"}</span>}
      </header>
      {objectifs.length ? <ul className="puces">{objectifs.map((o) => <li key={o} className="puce puce-douce">{o}</li>)}</ul> : null}
      {/* Texte de la guilde, dans sa langue : jamais traduit automatiquement, il a été relu tel quel. */}
      <p className="texte-guilde" lang={en ? "fr" : undefined}>{complete ? g.description : g.description.length > 220 ? `${g.description.slice(0, 220).replace(/\s+\S*$/, "")}…` : g.description}</p>
      {g.recrute && (roles.length || classes.length) ? (
        <p className="doux" style={{ fontSize: 14 }}>
          <strong>{en ? "Looking for:" : "Recherche :"}</strong> {[...roles, ...classes].join(", ")}
        </p>
      ) : null}
      {g.horaires ? <p className="doux" style={{ fontSize: 14 }}><strong>{en ? "Play times:" : "Horaires :"}</strong> {g.horaires}</p> : null}
      <footer>
        <div className="actions-guilde">
          {g.discord ? <a href={g.discord} className="btn btn-or btn-petit" rel={REL_UGC} target="_blank" data-cta="discord-guilde">{en ? "Join the Discord" : "Rejoindre le Discord"}</a> : null}
          {g.site ? <a href={g.site} className="btn btn-contour btn-petit" rel={REL_UGC} target="_blank">{en ? "Guild website" : "Site de la guilde"}</a> : null}
          {g.contactJeu ? <span className="doux" style={{ fontSize: 14 }}>{en ? "In game: " : "En jeu : "}<strong>{g.contactJeu}</strong></span> : null}
        </div>
        <p className="doux" style={{ fontSize: 13, margin: 0 }}>{en ? `Updated on ${dateEn(g.majLe)}` : `Mise à jour le ${dateLongue(g.majLe)}`}</p>
      </footer>
    </article>
  );
}
