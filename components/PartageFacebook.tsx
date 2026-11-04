"use client";

import { useState } from "react";

/**
 * Bouton « Partager sur Facebook ». Facebook interdit de pré-remplir le champ « Quoi de neuf ? » depuis un lien de
 * partage (le paramètre est ignoré) : le texte du post (texteReseau) est donc copié au clic, puis la fenêtre de
 * partage s'ouvre ; il ne reste qu'à coller. Sans JavaScript, le lien de partage fonctionne seul.
 */
export function PartageFacebook({ url, texte, libelle = "Partager sur Facebook", cta, className = "btn btn-facebook" }: {
  url: string; texte: string; libelle?: string; cta?: string; className?: string;
}) {
  const [etat, setEtat] = useState<"" | "copie" | "echec">("");
  const lien = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  function copier() {
    // Lancée pendant le clic (geste de l'utilisateur), sans retenir l'ouverture de la fenêtre.
    try {
      navigator.clipboard.writeText(texte).then(() => setEtat("copie"), () => setEtat("echec"));
    } catch {
      setEtat("echec");
    }
  }
  return (
    <>
      <a href={lien} className={className} rel="noopener noreferrer" target="_blank" data-cta={cta} onClick={copier}>{libelle}</a>
      {etat === "copie" ? (
        <small role="status" className="doux" style={{ flexBasis: "100%" }}>
          Texte du post copié : dans Facebook, collez-le dans « Quoi de neuf ? » (Ctrl+V, ou appui long puis Coller).
        </small>
      ) : etat === "echec" ? (
        <details style={{ flexBasis: "100%" }}>
          <summary className="doux" style={{ cursor: "pointer" }}>Copie impossible : afficher le texte à coller</summary>
          <p style={{ whiteSpace: "pre-wrap", fontSize: 14, margin: "6px 0 0" }}>{texte}</p>
        </details>
      ) : null}
    </>
  );
}
