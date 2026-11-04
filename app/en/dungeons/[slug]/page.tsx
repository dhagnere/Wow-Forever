import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DONJONS } from "@/content/monde";
import { DONJONS_TEXTE_EN, NOTE_DONJONS_EN } from "@/content/monde-en";
import { Ariane } from "@/components/Ariane";
import { IllustrationEcran } from "@/components/Visuels";
import { ECRAN_DONJON, fondBandeau } from "@/lib/ecrans";
import { donjonDepuisEn, nomDonjonEn, pageDonjonEn } from "@/lib/anglais";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.values(DONJONS_TEXTE_EN).map((d) => ({ slug: d.slug }));
}

const lire = (slug: string) => DONJONS.find((x) => x.slug === donjonDepuisEn(slug));
const nom = (d: (typeof DONJONS)[number]) => nomDonjonEn(d.nom) ?? d.nom;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = lire((await params).slug);
  if (!d) return {};
  const fr = `/donjons/${d.slug}/`;
  const en = pageDonjonEn(d.slug);
  return {
    title: `${nom(d)} — WoW Forever dungeon`,
    description: `${nom(d)}, a new WoW Forever dungeon open from level ${d.niveau}: access, bosses and loot.`,
    alternates: { canonical: en, languages: { fr, en, "x-default": fr } },
  };
}

export default async function DonjonEn({ params }: Props) {
  const d = lire((await params).slug);
  if (!d) notFound();
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
