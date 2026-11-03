import type { Metadata } from "next";
import Link from "next/link";
import { CLASSES } from "@/content/classes";
import { Ariane } from "@/components/Ariane";
import { IconeClasse } from "@/components/IconeClasse";
import { fondBandeau } from "@/lib/ecrans";
import { CLASSES_EN, ROLES_EN } from "@/lib/anglais";

export const metadata: Metadata = {
  title: "WoW Forever classes: spells, talents and calculator",
  description: "The nine classes of WoW Forever: spells by specialisation, talent trees, hunter and warlock pets, and a talent calculator, read from the game files.",
  alternates: { canonical: "/en/classes/", languages: { fr: "/classes/", en: "/en/classes/", "x-default": "/classes/" } },
};

export default function ClassesEn() {
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("salle-des-thanes")}>
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "Classes" }]} />
          <p className="surtitre">The Armoury · Classes</p>
          <h1>The classes of WoW Forever</h1>
          <p className="chapo">Nine classes. For each: spells by specialisation, the three talent trees and a calculator to plan your build.</p>
        </div>
      </section>
      <div className="wrap contenu">
        <div className="g3">
          {CLASSES.map((c) => (
            <Link key={c.slug} href={`/en/classes/${CLASSES_EN[c.slug].slug}/`} className="encadre cadre lien-icone" style={{ gap: 16, textDecoration: "none", color: "var(--texte)" }}>
              <IconeClasse slug={c.slug} couleur={c.couleur} taille={64} />
              <span>
                <strong style={{ fontSize: 20, color: "var(--or-clair)" }}>{CLASSES_EN[c.slug].nom}</strong>
                <span className="doux" style={{ display: "block", fontSize: 15 }}>{c.roles.map((r) => ROLES_EN[r] ?? r).join(" · ")}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
