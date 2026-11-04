import type { Metadata } from "next";
import Link from "next/link";
import { CLASSES_GUILDE, DUREE_VALIDITE_JOURS, FACTIONS, listerGuildes, OBJECTIFS, TYPES_ROYAUME } from "@/modules/veille";
import { languesDe } from "@/lib/anglais";
import { Ariane } from "@/components/Ariane";
import { CarteGuilde } from "@/components/Guildes";
import { fondBandeau } from "@/lib/ecrans";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tableau des guildes francophones de WoW Forever",
  description: "Les guildes francophones de WoW Forever qui recrutent : Alliance ou Horde, JcE, JcJ, RP ou Hardcore. Inscription gratuite pour les guildes.",
  alternates: { canonical: "/guildes/", languages: languesDe("/guildes/") },
};

type Params = Record<string, string | string[] | undefined>;
const un = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const parmi = (v: string, table: Record<string, string>) => (v in table ? v : undefined);

export default async function Guildes({ searchParams }: { searchParams: Promise<Params> }) {
  const p = await searchParams;
  const filtres = {
    faction: parmi(un(p.faction), FACTIONS),
    type: parmi(un(p.type), TYPES_ROYAUME),
    objectif: parmi(un(p.objectif), OBJECTIFS),
    classe: parmi(un(p.classe), CLASSES_GUILDE),
    recrute: un(p.recrute) === "oui",
  };
  const guildes = await listerGuildes(filtres);
  const filtre = Object.values(filtres).some(Boolean);

  return (
    <>
      <section className="bandeau-page" style={fondBandeau("vallee-d-alterac")}>
        <div className="wrap">
          <Ariane etapes={[{ nom: "Le Comptoir", href: "/actualites/" }, { nom: "Tableau des guildes" }]} />
          <p className="surtitre">Le Comptoir · recrutement</p>
          <h1>Le tableau des <span className="accent">guildes</span></h1>
          <p className="chapo">
            Les guildes francophones de WoW Forever affichent ici leurs annonces. Vous cherchez un groupe, une ambiance, un raid ? Jetez un œil,
            puis passez sur leur Discord.
          </p>
          <div className="actions-bandeau">
            <Link href="/guildes/inscrire/" className="btn btn-or" data-cta="inscrire-guilde">Inscrire ma guilde</Link>
            <Link href="/communaute/" className="btn btn-contour" data-cta="communaute-guildes">Rejoindre la Taverne</Link>
          </div>
        </div>
      </section>
      <div className="wrap contenu">
        <form method="get" action="/guildes/" className="filtres-objets" aria-label="Filtrer les guildes">
          <label>
            <span>Faction</span>
            <select name="faction" defaultValue={filtres.faction ?? ""}>
              <option value="">Toutes</option>
              {Object.entries(FACTIONS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <label>
            <span>Royaume</span>
            <select name="type" defaultValue={filtres.type ?? ""}>
              <option value="">Tous</option>
              {Object.entries(TYPES_ROYAUME).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <label>
            <span>Activité</span>
            <select name="objectif" defaultValue={filtres.objectif ?? ""}>
              <option value="">Toutes</option>
              {Object.entries(OBJECTIFS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <label>
            <span>Recherche la classe</span>
            <select name="classe" defaultValue={filtres.classe ?? ""}>
              <option value="">Peu importe</option>
              {Object.entries(CLASSES_GUILDE).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <label className="case" style={{ flexDirection: "row", alignSelf: "center" }}>
            <input type="checkbox" name="recrute" value="oui" defaultChecked={filtres.recrute} />
            <span>Qui recrutent</span>
          </label>
          <button type="submit" className="btn btn-or">Filtrer</button>
        </form>

        <p className="doux" style={{ fontSize: 14 }}>
          {guildes.length} guilde{guildes.length > 1 ? "s" : ""}{filtre ? " pour ces critères" : ""}. Les fiches mises à jour récemment passent en tête ;
          une fiche non confirmée depuis {DUREE_VALIDITE_JOURS} jours n&apos;est plus affichée.
        </p>

        {guildes.length ? (
          <div className="grille-guildes">{guildes.map((g) => <CarteGuilde key={g.id} g={g} />)}</div>
        ) : (
          <div className="encadre" style={{ padding: 24 }}>
            <p style={{ margin: "0 0 14px" }}>{filtre ? "Aucune guilde ne correspond à ces critères pour l'instant." : "Le tableau attend ses premières guildes. La vôtre ?"}</p>
            <Link href="/guildes/inscrire/" className="btn btn-or" data-cta="inscrire-guilde-vide">Inscrire ma guilde</Link>
          </div>
        )}

        <p className="doux" style={{ fontSize: 13, marginTop: 32, maxWidth: 760 }}>
          Les fiches sont rédigées par les guildes et relues par Jobwow avant publication. La Taverne ne garantit ni leur exactitude ni ce qui se
          passe sur leurs serveurs Discord. Un problème avec une fiche ? <Link href="/contact/">Signalez-le</Link>.
        </p>
      </div>
    </>
  );
}
