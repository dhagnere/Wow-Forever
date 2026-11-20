import type { Metadata } from "next";
import Link from "next/link";
import { combinaisons, nomRace } from "@/lib/guide";
import { RUBRIQUES } from "@/config/taxonomie";
import { CLASSES } from "@/content/classes";
import { ZONES, DONJONS } from "@/content/monde";
import { FICHES_ORIGINE } from "@/content/reference";
import { languesDe } from "@/lib/anglais";
import { Ariane } from "@/components/Ariane";
import { fondBandeau } from "@/lib/ecrans";

export const metadata: Metadata = { title: "Plan du site", description: "Toutes les pages de la Taverne Éternelle : guides de 1 à 60, classes, races, zones, cartes, donjons, base d'objets et actualité de WoW Forever.", alternates: { canonical: "/plan-du-site/", languages: languesDe("/plan-du-site/") } };

export default function PlanDuSite() {
  const blocs: { titre: string; liens: [string, string][] }[] = [
    { titre: "Actualités", liens: [["/actualites/", "Toutes les actualités"], ...RUBRIQUES.filter((r) => r.famille === "fil").map((r) => [`/rubriques/${r.slug}/`, r.nom] as [string, string])] },
    { titre: "Classes", liens: [["/classes/", "Les neuf classes"], ...CLASSES.map((c) => [`/classes/${c.slug}/`, c.nom] as [string, string])] },
    { titre: "Races", liens: [["/races/", "Toutes les races"], ["/races/skyborne/", "Skyborne, la nouvelle race"]] },
    { titre: "Monde", liens: [["/zones/", "Zones"], ...ZONES.map((z) => [`/zones/${z.slug}/`, z.nom] as [string, string]), ["/donjons/", "Donjons et raids"], ...DONJONS.map((d) => [`/donjons/${d.slug}/`, d.nom] as [string, string]), ...FICHES_ORIGINE.map((d) => [`/donjons/${d.slug}/`, d.nom] as [string, string]), ["/base-de-donnees/", "Base de données des objets"], ["/cartes/", "Cartes du monde"]] },
    { titre: "Guides", liens: [["/guides/bien-demarrer/", "Bien démarrer"], ["/guides/zones-de-depart/", "Zones de départ"], ["/guides/zones-par-niveau/", "Zones par niveau"], ["/guides/parcours/", "Guide de 1 à 60"], ["/addon/", "Addon TaverneRoutes"], ["/guides/quetes-de-classe/", "Quêtes de classe"], ["/guides/liste-des-donjons/", "Liste des donjons"], ...RUBRIQUES.filter((r) => r.famille === "guides").map((r) => [`/rubriques/${r.slug}/`, r.nom] as [string, string])] },
    { titre: "Guide de 1 à 60 par classe", liens: combinaisons().map(({ race, classe }) => [`/guides/parcours/${race.slug}/${classe.slug}/`, `${nomRace(race)} ${classe.nom.toLowerCase()}`] as [string, string]) },
    { titre: "Le Comptoir", liens: [["/calendrier/", "Calendrier"], ["/lettre/", "La Lettre du dimanche"], ["/guildes/", "Tableau des guildes"], ["/guildes/inscrire/", "Inscrire sa guilde"], ["/communaute/", "Communauté"]] },
    { titre: "Carnet de Jobwow", liens: [["/carnet/", "Le Carnet"], ["/carnet/videos/", "Les vidéos de Jobwow"], ["/rubriques/tests/", "Tests et avis"]] },
    { titre: "Le site", liens: [["/a-propos/", "Qui est Jobwow ?"], ["/soutenir/", "Soutenir la Taverne"], ["/contact/", "Contact"], ["/compte/", "Mon compte"], ["/recherche/", "Recherche"], ["/mentions-legales/", "Mentions légales"], ["/confidentialite/", "Confidentialité"]] },
  ];
  return (
    <>
      <section className="bandeau-page bandeau-mince" style={fondBandeau("royaumes-de-l-est")}>
        <div className="wrap">
          <Ariane etapes={[{ nom: "Plan du site" }]} />
          
          <h1>Plan du site</h1>
        </div>
      </section>
    <div className="wrap contenu">
      <div className="g3">
        {blocs.map((b) => (
          <section key={b.titre} className="encadre cadre">
            <h2 className="titre" style={{ fontSize: 20, color: "var(--or-clair)" }}>{b.titre}</h2>
            <ul style={{ margin: 0, paddingLeft: 20 }}>{b.liens.map(([href, nom]) => <li key={href}><Link href={href}>{nom}</Link></li>)}</ul>
          </section>
        ))}
      </div>
    </div>
    </>
  );
}
