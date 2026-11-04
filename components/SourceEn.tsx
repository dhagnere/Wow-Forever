import { nomLangue, type SourceCitee } from "@/modules/veille";

const LANGUES_EN: Record<string, string> = { fr: "French", en: "English", de: "German", es: "Spanish", ko: "Korean", ru: "Russian", pt: "Portuguese", it: "Italian", zh: "Chinese", ja: "Japanese" };

/** Une source citée, version anglaise : titre d'origine et lien vers l'article d'origine. */
export function LigneSourceEn({ source }: { source: SourceCitee }) {
  const langue = source.langue && source.langue !== "en" ? LANGUES_EN[source.langue] ?? nomLangue(source.langue) : null;
  return (
    <li>
      <a href={source.url} rel="noopener noreferrer nofollow" target="_blank">{source.nom} — {source.titre}</a>
      {langue ? <span className="doux"> · in {langue}</span> : null}
    </li>
  );
}
