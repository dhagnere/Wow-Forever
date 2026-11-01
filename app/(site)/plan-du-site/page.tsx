import type { Metadata } from "next";
import Link from "next/link";
import { RUBRIQUES } from "@/config/taxonomie";
import { CLASSES } from "@/content/classes";
import { ZONES, DONJONS } from "@/content/monde";
import { Ariane } from "@/components/Ariane";

export const metadata: Metadata = { title: "Plan du site", alternates: { canonical: "/plan-du-site/" } };

export default function PlanDuSite() {
  const blocs: { titre: string; liens: [string, string][] }[] = [
    { titre: "Actualités", liens: [["/actualites/", "Toutes les actualités"], ...RUBRIQUES.filter((r) => r.famille === "fil").map((r) => [`/rubriques/${r.slug}/`, r.nom] as [string, string])] },
    { titre: "Classes", liens: [["/classes/", "Les neuf classes"], ...CLASSES.map((c) => [`/classes/${c.slug}/`, c.nom] as [string, string])] },
    { titre: "Races", liens: [["/races/", "Toutes les races"], ["/races/skyborne/", "Skyborne, la nouvelle race"]] },
    { titre: "Monde", liens: [["/zones/", "Zones"], ...ZONES.map((z) => [`/zones/${z.slug}/`, z.nom] as [string, string]), ["/donjons/", "Donjons et raids"], ...DONJONS.map((d) => [`/donjons/${d.slug}/`, d.nom] as [string, string])] },
    { titre: "Guides", liens: [["/guides/bien-demarrer/", "Bien démarrer"], ["/guides/zones-de-depart/", "Zones de départ"], ["/guides/zones-par-niveau/", "Zones par niveau"], ["/guides/liste-des-donjons/", "Liste des donjons"], ...RUBRIQUES.filter((r) => r.famille === "guides").map((r) => [`/rubriques/${r.slug}/`, r.nom] as [string, string])] },
    { titre: "Carnet de Silfax", liens: [["/carnet/", "Tous les épisodes"], ["/rubriques/tests/", "Tests et avis"]] },
    { titre: "Le site", liens: [["/a-propos/", "Qui est Silfax ?"], ["/mentions-legales/", "Mentions légales"]] },
  ];
  return (
    <div className="wrap contenu">
      <Ariane etapes={[{ nom: "Plan du site" }]} />
      <h1 className="titre" style={{ fontSize: 40 }}>Plan du site</h1>
      <div className="g3">
        {blocs.map((b) => (
          <section key={b.titre} className="encadre cadre">
            <h2 className="titre" style={{ fontSize: 20, color: "var(--or-clair)" }}>{b.titre}</h2>
            <ul style={{ margin: 0, paddingLeft: 20 }}>{b.liens.map(([href, nom]) => <li key={href}><Link href={href}>{nom}</Link></li>)}</ul>
          </section>
        ))}
      </div>
    </div>
  );
}
