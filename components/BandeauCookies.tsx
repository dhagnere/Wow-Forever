"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const CLE = "af-consentement";
const DUREE_CHOIX_MS = 182 * 24 * 3600 * 1000;
const EVENEMENT_ROUVRIR = "af-gerer-cookies";

type Choix = "accepte" | "refuse";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function lireChoix(): Choix | null {
  try {
    const c = JSON.parse(localStorage.getItem(CLE) ?? "null") as { choix?: Choix; date?: number } | null;
    if (c?.choix && typeof c.date === "number" && Date.now() - c.date < DUREE_CHOIX_MS) return c.choix;
  } catch {
    // Stockage indisponible (navigation privée stricte) : on redemandera.
  }
  return null;
}

function appliquer(choix: Choix) {
  const etat = choix === "accepte" ? "granted" : "denied";
  window.gtag?.("consent", "update", {
    ad_storage: etat, ad_user_data: etat, ad_personalization: etat, analytics_storage: etat,
  });
  try {
    localStorage.setItem(CLE, JSON.stringify({ choix, date: Date.now() }));
  } catch {
    // Choix appliqué pour cette page seulement.
  }
}

/** Bannière de consentement : Accepter et Refuser au même niveau, comme l'exige la CNIL. */
export function BandeauCookies() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(lireChoix() === null);
    const rouvrir = () => setVisible(true);
    window.addEventListener(EVENEMENT_ROUVRIR, rouvrir);
    return () => window.removeEventListener(EVENEMENT_ROUVRIR, rouvrir);
  }, []);

  if (!visible) return null;
  const choisir = (choix: Choix) => {
    appliquer(choix);
    setVisible(false);
  };

  return (
    <div className="bandeau-cookies" role="dialog" aria-modal="false" aria-labelledby="t-cookies">
      <div className="wrap">
        <p id="t-cookies" style={{ margin: 0 }}>
          <strong>Mesure d&apos;audience.</strong> Avec votre accord, Azeroth Forever utilise des cookies Google pour compter les
          visites et améliorer le site. Vous pouvez changer d&apos;avis à tout moment en bas de page.{" "}
          <Link href="/mentions-legales/#cookies">En savoir plus</Link>
        </p>
        <div className="boutons" style={{ justifyContent: "flex-start", flex: "none" }}>
          <button type="button" className="btn btn-contour" onClick={() => choisir("refuse")}>Refuser</button>
          <button type="button" className="btn btn-contour" onClick={() => choisir("accepte")}>Accepter</button>
        </div>
      </div>
    </div>
  );
}

/** Lien de pied de page pour revoir son choix. */
export function GererCookies() {
  return (
    <button type="button" className="lien-bouton" onClick={() => window.dispatchEvent(new Event(EVENEMENT_ROUVRIR))}>
      Gérer les cookies
    </button>
  );
}
