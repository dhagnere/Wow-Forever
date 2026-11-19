import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DONJONS } from "@/content/monde";
import { DONJONS_TEXTE_EN, NOTE_DONJONS_EN } from "@/content/monde-en";
import { Ariane } from "@/components/Ariane";
import { IllustrationEcran } from "@/components/Visuels";
import { ECRAN_DONJON, fondBandeau } from "@/lib/ecrans";
import { CONTINENTS_EN, donjonDepuisEn, nomDonjonEn, nomZoneEn, pageDonjonEn } from "@/lib/anglais";
import { DONJONS_ORIGINE } from "@/content/reference";
import { objetsParIds, type ObjetResume } from "@/modules/veille";
import { donjonOrigine, donneesDonjon, objetsDuDonjon, quetesDonjonsVerifiees, sourceDonjons } from "@/lib/donjons";
import { FicheDonjon } from "@/components/FicheDonjon";
import { ecranParNom } from "@/lib/ecrans";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

const lire = (slug: string) => DONJONS.find((x) => x.slug === donjonDepuisEn(slug));
const nom = (d: (typeof DONJONS)[number]) => nomDonjonEn(d.nom) ?? d.nom;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slugEn = (await params).slug;
  const d = lire(slugEn);
  const o = d ? undefined : donjonOrigine(donjonDepuisEn(slugEn) ?? "");
  if (o) {
    const nomEn = nomDonjonEn(o.nom) ?? o.nom;
    const donnees = donneesDonjon(o.slug);
    const fr = `/donjons/${o.slug}/`;
    const en = pageDonjonEn(o.slug);
    return {
      title: `${nomEn} — bosses, loot and entrance · WoW Forever`,
      description: `${nomEn} (levels ${o.min}-${o.max}, ${nomZoneEn(o.zone)}): ${donnees ? `${donnees.boss.length} bosses in order, ` : ""}their loot in Forever, the entrance on the map and the dungeon quests.`,
      alternates: { canonical: en, languages: { fr, en, "x-default": fr } },
    };
  }
  if (!d) return {};
  const fr = `/donjons/${d.slug}/`;
  const en = pageDonjonEn(d.slug);
  return {
    title: `${nom(d)} — WoW Forever dungeon`,
    description: `${nom(d)}, a new WoW Forever dungeon open from level ${d.niveau}: access, bosses and loot.`,
    alternates: { canonical: en, languages: { fr, en, "x-default": fr } },
  };
}

async function objetsDe(ids: number[]): Promise<{ objets: Map<number, ObjetResume>; lu: boolean }> {
  try {
    const liste = await objetsParIds(ids, "en");
    return { objets: new Map(liste.map((o) => [o.id, o])), lu: true };
  } catch (e) {
    console.error("[dungeons] loot:", e instanceof Error ? e.message : e);
    return { objets: new Map(), lu: false };
  }
}

/** Page of a dungeon of original Azeroth: same content as the French page, from the same data. */
async function DonjonOrigineEn({ slug }: { slug: string }) {
  const o = donjonOrigine(slug)!;
  const nomEn = nomDonjonEn(o.nom) ?? o.nom;
  const donnees = donneesDonjon(slug);
  const { objets, lu } = donnees ? await objetsDe(objetsDuDonjon(donnees)) : { objets: new Map(), lu: true };
  const ecran = ecranParNom(o.nom);
  const memeTranche = DONJONS_ORIGINE.filter((x) => x.slug !== o.slug && Math.abs(x.min - o.min) <= 8);
  return (
    <>
      <section className="bandeau-page" style={fondBandeau(ecran ?? "profondeurs-de-rochenoire")}>
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "Dungeons and raids", href: "/en/dungeons/" }, { nom: nomEn }]} />
          <p className="surtitre">Dungeon of original Azeroth · levels {o.min}-{o.max}</p>
          <h1>{nomEn}</h1>
          <p className="chapo">
            {nomZoneEn(o.zone)}, {CONTINENTS_EN[o.continent] ?? o.continent}.{donnees ? ` ${donnees.boss.length} bosses to defeat, their loot in Forever, the entrance on the map and the quests to pick up before going.` : ""}
          </p>
        </div>
      </section>
      <div className="wrap contenu">
        <div className="colonnes">
          <div className="colonne-principale">
            {ecran ? <IllustrationEcran ecran={ecran} langue="en" /> : null}
            <FicheDonjon donjon={o} d={donnees} objets={objets} butinLu={lu} quetesVerifiees={quetesDonjonsVerifiees()} source={sourceDonjons()} langue="en" />
          </div>
          <aside className="colonne-laterale">
            {donnees && donnees.boss.length ? (
              <div className="encadre cadre">
                <h2>Bosses at a glance</h2>
                <ol style={{ margin: 0, paddingLeft: 22, fontSize: 15 }}>
                  {donnees.boss.map((b) => <li key={b.id}><a href={`#boss-${b.id}`}>{b.en}</a></li>)}
                </ol>
              </div>
            ) : null}
            <div className="encadre cadre">
              <h2>Also for your level</h2>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15 }}>
                {memeTranche.map((x) => <li key={x.slug}><Link href={pageDonjonEn(x.slug)}>{nomDonjonEn(x.nom) ?? x.nom}</Link> <span className="doux">— {x.min}-{x.max}</span></li>)}
              </ul>
              <p style={{ margin: "10px 0 0", fontSize: 15 }}><Link href="/en/dungeons/">All dungeons and raids</Link></p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

export default async function DonjonEn({ params }: Props) {
  const slugEn = (await params).slug;
  const d = lire(slugEn);
  if (!d) {
    const fr = donjonDepuisEn(slugEn);
    if (fr && donjonOrigine(fr)) return <DonjonOrigineEn slug={fr} />;
    notFound();
  }
  return (
    <>
      <section className="bandeau-page" style={fondBandeau(ECRAN_DONJON[d.slug] ?? "salle-des-thanes")}>
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "Dungeons and raids", href: "/en/dungeons/" }, { nom: nom(d) }]} />
          <p className="surtitre">New dungeon · from level {d.niveau}</p>
          <h1>{nom(d)}</h1>
          <p className="chapo">{DONJONS_TEXTE_EN[d.slug].resume(d.niveau)}</p>
        </div>
      </section>
      <div className="wrap contenu">
        <div className="colonnes">
          <div className="colonne-principale">
            {ECRAN_DONJON[d.slug] ? <IllustrationEcran ecran={ECRAN_DONJON[d.slug]} langue="en" /> : null}
            <section aria-labelledby="t-acces">
              <h2 id="t-acces" className="section-titre" style={{ fontSize: 26 }}>Access and preparation</h2>
              <p className="doux">[Entrance location, quests to pick up before entering, recommended group: to be recorded in game.]</p>
            </section>
            <section aria-labelledby="t-boss">
              <h2 id="t-boss" className="section-titre" style={{ fontSize: 26 }}>Bosses and loot</h2>
              <p className="doux">[List of bosses, abilities to know and notable items.]</p>
            </section>
            <p className="doux" style={{ fontSize: 15 }}>{NOTE_DONJONS_EN}</p>
          </div>
          <aside className="colonne-laterale">
            <div className="encadre cadre">
              <h2>Other dungeons</h2>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15 }}>
                {DONJONS.filter((x) => x.slug !== d.slug).map((x) => <li key={x.slug}><Link href={pageDonjonEn(x.slug)}>{nom(x)}</Link> <span className="doux">— lvl {x.niveau}</span></li>)}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
