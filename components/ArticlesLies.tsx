import { listerPublies } from "@/modules/veille";
import type { Pilier } from "@/config/taxonomie";
import { FilArticles } from "./Articles";

/** Section « Derniers articles » d'une page pilier : chaque article rattaché l'enrichit d'une ligne et d'un lien. */
export async function ArticlesLies({ pilier, titre = "Derniers articles sur ce sujet" }: { pilier: Pilier; titre?: string }) {
  const articles = await listerPublies({ pilier, limite: 8 });
  return (
    <section aria-labelledby="t-lies">
      <h2 id="t-lies" className="section-titre" style={{ fontSize: 26 }}>{titre}</h2>
      <FilArticles articles={articles} vide="Les premiers articles sur ce sujet arrivent bientôt." />
    </section>
  );
}
