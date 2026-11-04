import type { Metadata } from "next";
import Link from "next/link";
import { CLASSES } from "@/content/classes";
import { Ariane } from "@/components/Ariane";
import { IconeClasse } from "@/components/IconeClasse";
import { fondBandeau } from "@/lib/ecrans";
import { chainesDeClasse } from "@/lib/quetes";
import { CLASSES_EN } from "@/lib/anglais";

export const metadata: Metadata = {
  title: "WoW Forever class quests",
  description: "WoW Forever class quests, class by class: chains, quest givers and locations, objectives and rewards.",
  alternates: { canonical: "/en/guides/class-quests/", languages: { fr: "/guides/quetes-de-classe/", en: "/en/guides/class-quests/", "x-default": "/guides/quetes-de-classe/" } },
};

export default function ClassQuestsIndex() {
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("salle-des-thanes")}>
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "Guides" }, { nom: "Class quests" }]} />
          <p className="surtitre">Guides · Quests</p>
          <h1>Class quests</h1>
          <p className="chapo">Hunter pet, druid forms, shaman totems, warlock mount: every class has its own quests. Pick yours.</p>
        </div>
      </section>
      <div className="wrap contenu">
        <ul className="g3" style={{ listStyle: "none", padding: 0, margin: "0 0 28px" }}>
          {CLASSES.map((c) => {
            const chaines = chainesDeClasse(c.slug, "en");
            const quetes = chaines.reduce((s, x) => s + x.quetes.length, 0);
            return (
              <li key={c.slug}>
                <Link href={`/en/guides/class-quests/${CLASSES_EN[c.slug].slug}/`} className="encadre cadre lien-icone" style={{ gap: 14, textDecoration: "none", color: "var(--texte)" }} data-cta="quetes-classe-en">
                  <IconeClasse slug={c.slug} couleur={c.couleur} taille={56} />
                  <span>
                    <strong style={{ fontSize: 18, color: "var(--texte-titre)" }}>{CLASSES_EN[c.slug].nom}</strong>
                    <br />
                    <span className="doux" style={{ fontSize: 14 }}>{quetes} quests, {chaines.length} chains</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <p>For the road from one zone to the next, from level 1 to 60, see the <Link href="/en/leveling-guide/">leveling guide</Link>.</p>
      </div>
    </>
  );
}
