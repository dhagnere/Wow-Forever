"use client";

import { useEffect, useState } from "react";

const SORTIE = Date.UTC(2026, 10, 4, 23, 0, 0); // 5 novembre 2026, minuit à Paris

/** Compte à rebours jusqu'à la sortie, puis jours d'aventure. Calculé dans le navigateur, pour rester juste sur les pages en cache. */
export function Decompte() {
  const [jours, setJours] = useState<number | null>(null);
  useEffect(() => {
    const maj = () => setJours(Math.floor((Date.now() - SORTIE) / 86_400_000));
    maj();
    const t = setInterval(maj, 60_000);
    return () => clearInterval(t);
  }, []);
  if (jours === null) return <div className="decompte" aria-hidden="true" />;
  return (
    <div className="decompte">
      {jours < 0 ? (
        <>
          <span><span className="pastille" aria-hidden="true" />Sortie le 5 novembre</span>
          <strong>J-{Math.abs(jours)}</strong>
        </>
      ) : (
        <>
          <span><span className="pastille" aria-hidden="true" />WoW Forever est ouvert</span>
          <strong>Jour {jours + 1}</strong>
        </>
      )}
    </div>
  );
}
