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
import { cleGuide, combinaisons, guidePour, planifier, raceGuide, versionGuide, ZEPHRAS } from "@/lib/guide";
import { CLASSES_EN, classeDepuisEn, lienGuideEn, nomClasseEn, nomRaceEn, raceDepuisEn, RACES_EN } from "@/lib/anglais";
import { LIEUX_ZEPHRAS } from "@/content/zephras-jeu";
import { LIEUX_ZEPHRAS_EN } from "@/content/lieux-en";
import { SORTIE_ZEPHRAS } from "@/content/zephras";

type Props = { params: Promise<{ race: string; classe: string }> };

export function generateStaticParams() {
  return combinaisons().map(({ race, classe }) => ({ race: RACES_EN[race.slug].slug, classe: CLASSES_EN[classe.slug].slug }));
}

function lire(p: { race: string; classe: string }) {
  const race = raceGuide(raceDepuisEn(p.race) ?? "");
  const classe = trouverClasse(classeDepuisEn(p.classe) ?? "");
  if (!race || !classe || !combinaisons().some((c) => c.race.slug === race.slug && c.classe.slug === classe.slug)) return null;
  return { race, classe };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = lire(await params);
  if (!c) return {};
  const titre = `${nomRaceEn(c.race.slug)} ${nomClasseEn(c.classe.slug)}`;
  const fr = `/guides/parcours/${c.race.slug}/${c.classe.slug}/`;
  const en = lienGuideEn(c.race.slug, c.classe.slug);
  return {
    title: `${titre} leveling guide 1-60 for WoW Forever`,
    description: `The ${titre} route from 1 to 60 in WoW Forever: zones in order, every quest with its NPCs on the map, class quests included, and progress to tick.`,
    alternates: { canonical: en, languages: { fr, en, "x-default": fr } },
  };
}

export default async function GuideRaceClasseEn({ params }: Props) {
  const c = lire(await params);
  if (!c) notFound();
  const zones: ZoneVue[] = guidePour(c.race, c.classe.slug, "en").map((z) => ({
    lieu: z.lieu, nom: nomLieu(z.lieu, "en"), carte: urlCarte(z.lieu, 1000), lienCarte: pageLieu(z.lieu), niveaux: z.niveaux, hubs: z.hubs,
    etapes: z.etapes.map(({ id, t, nv, min, cl, grp, obj, g, gn, r, rn, rl, cib }) => ({ id, t, nv, min, cl, grp, obj, g, gn, r, rn, rl: rl ? nomLieu(rl, "en") : null, cib })),
    arrets: planifier(z),
    ...(z.lieu === ZEPHRAS ? { lieux: LIEUX_ZEPHRAS.map((l) => ({ ...l, nom: LIEUX_ZEPHRAS_EN[l.nom] ?? l.nom })) } : {}),
    ...(z.lieu === ZEPHRAS && !z.etapes.length ? {
      note: `The island's quests are not in the game files yet: Jobwow will record them at launch and add them here, with their NPCs and targets on the map. Meanwhile, the map shows the island's places. Start from the village of Thendal, do the island's quests until it is complete, then take the road ${SORTIE_ZEPHRAS[c.race.faction] ? `to ${SORTIE_ZEPHRAS[c.race.faction]}` : "of your faction [arrival point to be confirmed at launch]"}: the guide picks up again at level 10.`,
    } : {}),
  }));
  if (!zones.length) notFound();
  const titre = `${nomRaceEn(c.race.slug)} ${nomClasseEn(c.classe.slug)}`;
  const chemin = lienGuideEn(c.race.slug, c.classe.slug);
  const source = versionGuide("en");
  const nbClasse = zones.reduce((s, z) => s + z.etapes.filter((e) => e.cl).length, 0);
  const slugClasseEn = CLASSES_EN[c.classe.slug].slug;

  return (
    <>
      <section className="bandeau-page" style={fondBandeau(ECRAN_CLASSE[c.classe.slug] ?? "salle-des-thanes")}>
        <div className="wrap" style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center" }}>
          <span className="lien-icone" style={{ gap: 8 }}>
            <IconeRace race={c.race.nom} taille={80} />
            <IconeClasse slug={c.classe.slug} couleur={c.classe.couleur} taille={80} />
          </span>
          <div style={{ flex: "1 1 420px" }}>
            <Ariane langue="en" etapes={[{ nom: "Leveling guide 1-60", href: "/en/leveling-guide/" }, { nom: titre }]} />
            <h1>Leveling guide 1-60: {titre}</h1>
            <p className="chapo" style={{ margin: 0 }}>
              {zones.length} zones, {zones.reduce((s, z) => s + z.etapes.length, 0)} quests, including {nbClasse} class quests, in a logical order:
              accept, complete the objectives, turn in, then move on. The arrows on each map go from one step to the next.
            </p>
          </div>
        </div>
      </section>
      <div className="wrap contenu">
        <div className="encadre-chaud" style={{ marginBottom: 24 }}>
          <p style={{ margin: 0 }}>
            <strong>Check in game.</strong> This route is built from original Azeroth quests still present in Forever: some NPCs or steps may have
            changed, and Forever&apos;s new content is not included yet. Pick up the quests at the same place before leaving, do those marked
            “Group” with others, and skip a zone if it becomes too easy. The “Monsters and objects on the map” box shows where to find a quest&apos;s
            targets, with an arrow from the quest giver to the targets, then to the NPC you turn it in to.
          </p>
        </div>
        <GuideParcours langue="en" cle={cleGuide(c.race, c.classe.slug)} titre={`Leveling guide 1-60: ${titre}`} zones={zones} retour={chemin} />
        <p className="doux note-donnees">
          Quests, NPCs and positions: free community databases ({source?.source ?? "CMaNGOS, AzerothCore"}), cross-checked with Forever&apos;s files
          (version {source?.jeu ?? "?"}). Order and objectives written by the Tavern. Maps and names: © Blizzard Entertainment.
          Detailed maps open on the French site.
        </p>
        <p>
          <Link href={`/en/classes/${slugClasseEn}/`}>{nomClasseEn(c.classe.slug)} spells and talents</Link>
          {" · "}<Link href={`/en/classes/${slugClasseEn}/talents/`}>Talent calculator</Link>
          {" · "}<Link href="/en/leveling-guide/">Choose another race or class</Link>
        </p>
      </div>
    </>
  );
}
