"use client";

import { useState } from "react";

/** Bloc de remarques prêt à copier, et bouton « Copier ». */
export function CopierBloc({ texte, id }: { texte: string; id: string }) {
  const [copie, setCopie] = useState(false);
  const lignes = Math.max(2, Math.min(16, texte.split("\n").length + 1));
  return (
    <div>
      <textarea readOnly id={id} value={texte} rows={lignes} style={{ width: "100%", fontFamily: "ui-monospace, monospace", fontSize: 13 }} />
      <p style={{ margin: "6px 0 0" }}>
        <button
          type="button"
          className="btn btn-contour"
          onClick={() => {
            navigator.clipboard?.writeText(texte).then(() => {
              setCopie(true);
              setTimeout(() => setCopie(false), 1500);
            });
          }}
        >
          {copie ? "Copié ✓" : "Copier le bloc"}
        </button>
      </p>
    </div>
  );
}
