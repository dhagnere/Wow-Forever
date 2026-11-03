import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { trouverClasse } from "@/content/classes";
import { Ariane } from "@/components/Ariane";
import { IconeClasse } from "@/components/IconeClasse";
import { IconeRace } from "@/components/IconeRace";
import { GuideParcours, type ZoneVue } from "@/components/GuideParcours";
import { ECRAN_CLASSE, fondBandeau } from "@/lib/ecrans";
import { pageLieu, urlCarte } from "@/lib/cartes";
import { nomLieu } from "@/lib/quetes";
import { cleGuide, combinaisons, guidePour, raceGuide, versionGuide } from "@/lib/guide";

type Props = { params: Promise<{ race: string; classe: string }> };

export function generateStaticParams() {
  return combinaisons().map(({ race, classe }) => ({ race: race.slug, classe: classe.slug }));
}

function lire(p: { race: string; classe: string }) {
  const race = raceGuide(p.race);
  const classe = trouverClasse(p.classe);
  if (!race || !classe || !combinaisons().some((c) => c.race.slug === race.slug && c.classe.slug === classe.slug)) return null;
  return { race, classe };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = lire(await params);
  if (!c) return {};
  return {
    title: `Guide de 1 à 60 : ${c.race.nom} ${c.classe.nom.toLowerCase()} sur WoW Forever`,
    description: `La route de 1 à 60 du ${c.race.nom.toLowerCase()} ${c.classe.nom.toLowerCase()} sur WoW Forever : zones dans l'ordre, chaque quête avec ses PNJ sur la carte, quêtes de classe comprises, et progression à cocher.`,
    alternates: { canonical: `/guides/parcours/${c.race.slug}/${c.classe.slug}/` },
  };
}

export default async function GuideRaceClasse({ params }: Props) {
  const c = lire(await params);
  if (!c) notFound();
  const zones: ZoneVue[] = guidePour(c.race, c.classe.slug).map((z) => ({
    lieu: z.lieu, nom: nomLieu(z.lieu), carte: urlCarte(z.lieu, 1000), lienCarte: pageLieu(z.lieu), niveaux: z.niveaux, hubs: z.hubs,
    etapes: z.etapes.map(({ id, t, nv, min, cl, grp, obj, g, gn, r, rn, rl }) => ({ id, t, nv, min, cl, grp, obj, g, gn, r, rn, rl: rl ? nomLieu(rl) : null })),
  }));
  if (!zones.length) notFound();
  const titre = `${c.race.nom} ${c.classe.nom.toLowerCase()}`;
  const chemin = `/guides/parcours/${c.race.slug}/${c.classe.slug}/`;
  const source = versionGuide();
  const nbClasse = zones.reduce((s, z) => s + z.etapes.filter((e) => e.cl).length, 0);

  return (
    <>
      <section className="bandeau-page" style={fondBandeau(ECRAN_CLASSE[c.classe.slug] ?? "salle-des-thanes")}>
        <div className="wrap" style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center" }}>
          <span className="lien-icone" style={{ gap: 8 }}>
            <IconeRace race={c.race.nom} taille={80} />
            <IconeClasse slug={c.classe.slug} couleur={c.classe.couleur} taille={80} />
          </span>
          <div style={{ flex: "1 1 420px" }}>
            <Ariane etapes={[{ nom: "Guides", href: "/guides/parcours/" }, { nom: "Parcours de 1 à 60", href: "/guides/parcours/" }, { nom: titre }]} />
            <h1>Guide de 1 à 60 : {titre}</h1>
            <p className="chapo" style={{ margin: 0 }}>
              {zones.length} zones, {zones.reduce((s, z) => s + z.etapes.length, 0)} quêtes dans l&apos;ordre, dont {nbClasse} quêtes de classe. Sur chaque carte,
              les PNJ sont numérotés et le trait suit la route. Cochez au fur et à mesure.
            </p>
          </div>
        </div>
      </section>
      <div className="wrap contenu">
        <div className="encadre-chaud" style={{ marginBottom: 24 }}>
          <p style={{ margin: 0 }}>
            <strong>À vérifier en jeu.</strong> Route établie à partir des quêtes de l&apos;Azeroth d&apos;origine encore présentes dans Forever : des PNJ ou des
            étapes ont pu changer, et les nouveautés de Forever n&apos;y figurent pas encore. Prenez les quêtes au même endroit avant de partir, faites
            celles marquées « Groupe » à plusieurs, et passez une zone si elle devient trop facile.
          </p>
        </div>
        <GuideParcours cle={cleGuide(c.race, c.classe.slug)} titre={`Guide de 1 à 60 : ${titre}`} zones={zones} retour={chemin} />
        <p className="doux note-donnees">
          Quêtes, PNJ et positions : bases communautaires libres ({source?.source ?? "CMaNGOS, AzerothCore"}), recoupées avec les fichiers de Forever
          (version {source?.jeu ?? "?"}). Ordre et objectifs établis par la Taverne. Cartes et noms : © Blizzard Entertainment.
        </p>
        <p>
          <Link href={`/guides/quetes-de-classe/${c.classe.slug}/`}>Toutes les quêtes de classe du {c.classe.nom.toLowerCase()}</Link>
          {" · "}<Link href={`/classes/${c.classe.slug}/`}>Guide du {c.classe.nom.toLowerCase()}</Link>
          {" · "}<Link href="/guides/parcours/">Choisir une autre race ou classe</Link>
        </p>
      </div>
    </>
  );
}
