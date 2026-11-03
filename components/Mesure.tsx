"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Mesure d'audience maison, sans cookie ni stockage dans le navigateur.
 * Envoie : la page vue (avec son origine), sa durée et sa part lue à la sortie, l'affichage et le clic des boutons
 * marqués data-cta, et les clics vers d'autres sites. Le serveur calcule le reste.
 */

type Signal = Record<string, unknown>;

function envoyer(signaux: Signal[]) {
  if (!signaux.length) return;
  const corps = JSON.stringify(signaux);
  // text/plain : pas de requête préalable du navigateur, l'envoi survit à la fermeture de la page.
  if (!navigator.sendBeacon?.("/api/mesure/", new Blob([corps], { type: "text/plain" }))) {
    fetch("/api/mesure/", { method: "POST", body: corps, keepalive: true, headers: { "Content-Type": "text/plain" } }).catch(() => {});
  }
}

function idAleatoire(): string {
  const o = new Uint8Array(12);
  crypto.getRandomValues(o);
  return Array.from(o, (b) => b.toString(36).padStart(2, "0")).join("").slice(0, 20);
}

export function Mesure() {
  const chemin = usePathname() ?? "/";
  const premiere = useRef(true);

  useEffect(() => {
    if (navigator.doNotTrack === "1" || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) return;
    const id = idAleatoire();
    const utm = new URLSearchParams(location.search).get("utm_source") ?? undefined;
    envoyer([{ t: "vue", id, chemin, referent: premiere.current ? document.referrer : undefined, utm, interne: !premiere.current && !utm }]);
    premiere.current = false;

    // Durée de lecture : seulement le temps où la page est visible.
    let visibleDepuis = document.visibilityState === "visible" ? Date.now() : 0;
    let duree = 0;
    let lecture = 0;
    let finie = false;
    const mesurerLecture = () => {
      const h = document.documentElement;
      const part = ((h.scrollTop + h.clientHeight) / Math.max(1, h.scrollHeight)) * 100;
      lecture = Math.max(lecture, Math.min(100, Math.round(part)));
    };
    mesurerLecture();
    const terminer = () => {
      if (finie) return;
      if (visibleDepuis) duree += Date.now() - visibleDepuis;
      finie = true;
      envoyer([{ t: "fin", id, duree: duree / 1000, lecture }]);
    };
    const visibilite = () => {
      if (document.visibilityState === "hidden") {
        terminer();
      } else if (!finie) {
        visibleDepuis = Date.now();
      }
    };

    // Boutons marqués data-cta : un affichage par page vue, puis chaque clic.
    const vus = new Set<string>();
    const observateur = "IntersectionObserver" in window
      ? new IntersectionObserver((entrees) => {
          const nouveaux: Signal[] = [];
          for (const e of entrees) {
            const nom = (e.target as HTMLElement).dataset.cta;
            if (e.isIntersecting && nom && !vus.has(nom)) {
              vus.add(nom);
              nouveaux.push({ t: "cta_vue", nom, chemin });
            }
          }
          envoyer(nouveaux);
        }, { threshold: 0.6 })
      : null;
    const observer = () => document.querySelectorAll<HTMLElement>("[data-cta]").forEach((el) => observateur?.observe(el));
    observer();
    const apparitions = new MutationObserver(observer);
    apparitions.observe(document.body, { childList: true, subtree: true });

    const clic = (ev: MouseEvent) => {
      const cible = ev.target instanceof Element ? ev.target : null;
      const cta = cible?.closest<HTMLElement>("[data-cta]");
      const signaux: Signal[] = [];
      if (cta?.dataset.cta) signaux.push({ t: "cta_clic", nom: cta.dataset.cta, chemin });
      const lien = cible?.closest<HTMLAnchorElement>("a[href]");
      if (lien && lien.host && lien.host !== location.host && /^https?:$/.test(lien.protocol)) signaux.push({ t: "sortie", lien: lien.href, chemin });
      envoyer(signaux);
    };

    window.addEventListener("scroll", mesurerLecture, { passive: true });
    document.addEventListener("visibilitychange", visibilite);
    window.addEventListener("pagehide", terminer);
    document.addEventListener("click", clic, { capture: true });
    return () => {
      terminer();
      observateur?.disconnect();
      apparitions.disconnect();
      window.removeEventListener("scroll", mesurerLecture);
      document.removeEventListener("visibilitychange", visibilite);
      window.removeEventListener("pagehide", terminer);
      document.removeEventListener("click", clic, { capture: true });
    };
  }, [chemin]);

  return null;
}
