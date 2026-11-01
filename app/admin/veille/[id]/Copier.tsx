"use client";

import { useState } from "react";

/** Texte prêt à copier pour un réseau social. */
export function TexteACopier({ titre, texte, note }: { titre: string; texte: string; note?: string }) {
  const [copie, setCopie] = useState(false);
  async function copier() {
    try {
      await navigator.clipboard.writeText(texte);
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    } catch {
      setCopie(false);
    }
  }
  return (
    <details style={{ borderTop: "1px solid var(--bordure)", paddingTop: 8 }}>
      <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: 15 }}>{titre}</summary>
      {note ? <p className="doux" style={{ margin: "6px 0", fontSize: 13 }}>{note}</p> : null}
      <p style={{ margin: "6px 0 8px", whiteSpace: "pre-wrap", fontSize: 14 }}>{texte}</p>
      <button type="button" className="btn btn-contour" style={{ minHeight: 36, padding: "6px 14px", fontSize: 13 }} onClick={copier}>
        {copie ? "Copié" : "Copier le texte"}
      </button>
    </details>
  );
}
