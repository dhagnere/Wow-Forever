import type { Metadata } from "next";
import Link from "next/link";
import { RUBRIQUES } from "@/config/taxonomie";
import { CLASSES } from "@/content/classes";
import { ZONES, DONJONS } from "@/content/monde";
import { languesDe } from "@/lib/anglais";
import { Ariane } from "@/components/Ariane";
import { fondBandeau } from "@/lib/ecrans";

export const metadata: Metadata = { title: "Plan du site", alternates: { canonical: "/plan-du-site/", languages: languesDe("/plan-du-site/") } };

export default function PlanDuSite() {
  const blocs: { titre: string; liens: [string, string][] }[] = [
    { titre: "Actualités", liens: [["/actualites/", "Toutes les actualités"], ...RUBRIQUES.filter((r) => r.famille === "fil").map((r) => [`/rubriques/${r.slug}/`, r.nom] as [string, string])] },
    { titre: "Classes", liens: [["/classes/", "Les neuf classes"], ...CLASSES.map((c) => [`/classes/${c.slug}/`, c.nom] as [string, string])] },
    { titre: "Races", liens: [["/races/", "Toutes les races"], ["/races/skyborne/", "Skyborne, la nouvelle race"]] },
    { titre: "Monde", liens: [["/zones/", "Zones"], ...ZONES.map((z) => [`/zones/${z.slug}/`, z.nom] as [string, string]), ["/donjons/", "Donjons et raids"], ...DONJONS.map((d) => [`/donjons/${d.slug}/`, d.nom] as [string, string]), ["/base-de-donnees/", "Base de données des objets"], ["/cartes/", "Cartes du monde"]] },
    { titre: "Guides", liens: [["/guides/bien-demarrer/", "Bien démarrer"], ["/guides/zones-de-depart/", "Zones de départ"], ["/guides/zones-par-niveau/", "Zones par niveau"], ["/guides/parcours/", "Parcours de 1 à 60"], ["/guides/quetes-de-classe/", "Quêtes de classe"], ["/guides/liste-des-donjons/", "Liste des donjons"], ...RUBRIQUES.filter((r) => r.famille === "guides").map((r) => [`/rubriques/${r.slug}/`, r.nom] as [string, string])] },
    { titre: "Carnet de Jobwow", liens: [["/carnet/", "Tous les épisodes"], ["/carnet/videos/", "Les vidéos de Jobwow"], ["/rubriques/tests/", "Tests et avis"]] },
    { titre: "Le site", liens: [["/a-propos/", "Qui est Jobwow ?"], ["/mentions-legales/", "Mentions légales"]] },
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
