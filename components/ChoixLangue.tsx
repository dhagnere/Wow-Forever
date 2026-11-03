"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cheminAnglais, cheminFrancais } from "@/lib/anglais";

/** Lien vers la même page dans l'autre langue (ou l'accueil de l'autre version si la page n'est pas encore traduite). */
export function ChoixLangue({ langue }: { langue: "fr" | "en" }) {
  const chemin = usePathname() ?? "/";
  if (langue === "en") {
    return <Link href={cheminFrancais(chemin)} hrefLang="fr" lang="fr" className="choix-langue" data-cta="langue-fr" title="Version française">FR</Link>;
  }
  return <Link href={cheminAnglais(chemin) ?? "/en/"} hrefLang="en" lang="en" className="choix-langue" data-cta="langue-en" title="English version">EN</Link>;
}

/**
 * Sur une page française qui existe en anglais, propose la version anglaise aux navigateurs réglés dans une autre langue
 * que le français. Une fois fermée, la proposition ne revient pas de la visite (stockage de session, aucun suivi).
 */
export function SuggestionAnglais() {
  const chemin = usePathname() ?? "/";
  const [voir, setVoir] = useState(false);
  const en = cheminAnglais(chemin);
  useEffect(() => {
    let ferme = false;
    try { ferme = sessionStorage.getItem("taverne-langue") === "1"; } catch { /* navigation privée */ }
    const langues = navigator.languages?.length ? navigator.languages : [navigator.language];
    setVoir(!ferme && !!en && !langues.some((l) => l?.toLowerCase().startsWith("fr")));
  }, [en]);
  if (!voir || !en) return null;
  const fermer = () => {
    setVoir(false);
    try { sessionStorage.setItem("taverne-langue", "1"); } catch { /* sans stockage */ }
  };
  return (
    <div className="suggestion-langue" lang="en" role="region" aria-label="Language">
      <span>This page is also available in English.</span>
      <Link href={en} hrefLang="en" className="btn btn-or btn-petit" data-cta="suggestion-anglais" onClick={fermer}>Read in English</Link>
      <button type="button" className="btn btn-contour btn-petit" onClick={fermer} aria-label="Stay on the French version">Rester en français</button>
    </div>
  );
}
