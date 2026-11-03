import Link from "next/link";
import { CLASSES } from "@/content/classes";
import { combinaisons, RACES_GUIDE } from "@/lib/guide";
import { lienGuideEn, nomClasseEn, nomRaceEn, ORDRES_EN } from "@/lib/anglais";
import { IconeClasse } from "./IconeClasse";
import { IconeRace } from "./IconeRace";

/** Choix du guide de 1 à 60 (version anglaise) : chaque classe, puis la race qui la joue. */
export function ChoixGuideParClasseEn({ cta = "guide-accueil-en" }: { cta?: string }) {
  const c = combinaisons();
  return (
    <div className="choix-classes">
      {CLASSES.map((classe) => {
        const races = c.filter((x) => x.classe.slug === classe.slug).map((x) => x.race);
        if (!races.length) return null;
        return (
          <div key={classe.slug} className="choix-classe" style={{ ["--teinte" as string]: classe.couleur }}>
            <p className="choix-classe-titre">
              <IconeClasse slug={classe.slug} couleur={classe.couleur} taille={44} />
              <strong>{nomClasseEn(classe.slug)}</strong>
            </p>
            <ul>
              {races.map((r) => (
                <li key={r.slug}>
                  <Link href={lienGuideEn(r.slug, classe.slug)} className="lien-icone" data-cta={cta}>
                    <IconeRace race={r.nom} taille={24} />
                    {nomRaceEn(r.slug)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

/** Choix par race, puis classe. */
export function ChoixGuideParRaceEn() {
  return (
    <div className="choix-guide">
      {RACES_GUIDE.map((r) => (
        <div key={r.slug} className="choix-race">
          <p className="lien-icone" style={{ gap: 10, margin: "0 0 8px" }}>
            <IconeRace race={r.nom} taille={36} />
            <strong>{r.skyborne ? `Skyborne, ${ORDRES_EN[r.faction]}` : nomRaceEn(r.slug)}</strong> <span className="doux">· {r.faction === "alliance" ? "Alliance" : "Horde"}</span>
          </p>
          <ul>
            {combinaisons().filter((c) => c.race.slug === r.slug).map(({ classe }) => (
              <li key={classe.slug}>
                <Link href={lienGuideEn(r.slug, classe.slug)} className="lien-icone" data-cta="guide-choix-en">
                  <IconeClasse slug={classe.slug} couleur={classe.couleur} taille={28} />
                  {nomClasseEn(classe.slug)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
