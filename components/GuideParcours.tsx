"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface HubVue { x: number; y: number; n: string[] }
export interface EtapeVue { id: number; t: string; nv: number; min: number; cl: number; grp: 0 | 1; obj: string[]; g: number; gn: string; r: number; rn: string; rl: string | null }
export interface ZoneVue { lieu: string; nom: string; carte: string; lienCarte: string; niveaux: [number, number]; hubs: HubVue[]; etapes: EtapeVue[] }

type Jour = { jour: string; faites: number };

/** Ordre de passage des points de rassemblement : donneur puis receveur de chaque quête, sans répéter un même point. */
export function routeDesHubs(etapes: { g: number; r: number }[]): number[] {
  const route: number[] = [];
  for (const e of etapes) {
    for (const h of [e.g, e.r]) if (h >= 0 && route[route.length - 1] !== h) route.push(h);
  }
  return route;
}

const aujourdhui = () => new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris" }).format(new Date());

function CarteZone({ z, faites, choisi, onChoisir }: { z: ZoneVue; faites: Set<number>; choisi: number | null; onChoisir: (h: number) => void }) {
  const route = useMemo(() => routeDesHubs(z.etapes), [z.etapes]);
  // Numéro de chaque point dans l'ordre de passage (son premier passage).
  const numero = useMemo(() => {
    const m = new Map<number, number>();
    route.forEach((h) => { if (!m.has(h)) m.set(h, m.size + 1); });
    return m;
  }, [route]);
  const fini = (h: number) => z.etapes.filter((e) => e.g === h || e.r === h).every((e) => faites.has(e.id));
  return (
    <figure className="carte-guide">
      <div className="carte-points">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={z.carte} alt={`Carte : ${z.nom}`} width={1000} height={667} loading="lazy" />
        <svg className="trace-route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <polyline points={route.map((h) => `${z.hubs[h].x},${z.hubs[h].y}`).join(" ")} vectorEffect="non-scaling-stroke" />
        </svg>
        {[...numero.entries()].map(([h, n]) => (
          <button
            key={h}
            type="button"
            className={`hub-carte${fini(h) ? " hub-fini" : ""}${choisi === h ? " hub-choisi" : ""}`}
            style={{ left: `${z.hubs[h].x}%`, top: `${z.hubs[h].y}%` }}
            onClick={() => onChoisir(h)}
            aria-label={`Point ${n} : ${z.hubs[h].n.join(", ")}`}
            title={z.hubs[h].n.join(", ")}
          >
            {n}
          </button>
        ))}
      </div>
      <figcaption className="doux">
        Les numéros suivent l&apos;ordre de passage ; le trait relie les points dans cet ordre. <Link href={z.lienCarte}>Carte détaillée de la zone</Link> · © Blizzard Entertainment
      </figcaption>
    </figure>
  );
}

export function GuideParcours({ cle, titre, zones, retour }: { cle: string; titre: string; zones: ZoneVue[]; retour: string }) {
  const [faites, setFaites] = useState<Set<number>>(new Set());
  const [compte, setCompte] = useState<{ connecte: boolean; pseudo?: string } | null>(null);
  const [jours, setJours] = useState<Jour[]>([]);
  const [etat, setEtat] = useState<"" | "envoi" | "ok" | "erreur">("");
  const [popup, setPopup] = useState(false);
  const [hubChoisi, setHubChoisi] = useState<{ zone: number; hub: number } | null>(null);
  const minuteur = useRef<ReturnType<typeof setTimeout> | null>(null);
  const deja = useRef(false);

  useEffect(() => {
    fetch(`/api/progression/?guide=${encodeURIComponent(cle)}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { connecte: boolean; pseudo?: string; quetes?: number[]; jours?: Jour[] }) => {
        setCompte({ connecte: d.connecte, pseudo: d.pseudo });
        if (d.quetes) setFaites(new Set(d.quetes));
        if (d.jours) setJours(d.jours);
      })
      .catch(() => setCompte({ connecte: false }));
  }, [cle]);

  const sauvegarder = useCallback((s: Set<number>) => {
    if (minuteur.current) clearTimeout(minuteur.current);
    setEtat("envoi");
    minuteur.current = setTimeout(() => {
      fetch("/api/progression/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ guide: cle, quetes: [...s] }) })
        .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
        .then((d: { jours?: Jour[] }) => { setEtat("ok"); if (d.jours) setJours(d.jours); })
        .catch(() => setEtat("erreur"));
    }, 800);
  }, [cle]);

  const basculer = (id: number) => {
    setFaites((avant) => {
      const s = new Set(avant);
      if (s.has(id)) s.delete(id); else s.add(id);
      if (compte?.connecte) sauvegarder(s);
      return s;
    });
    // Sans compte : la proposition s'affiche une fois par visite.
    if (compte && !compte.connecte && !deja.current) {
      deja.current = true;
      let vu = false;
      try { vu = sessionStorage.getItem("taverne-proposition-compte") === "1"; } catch { /* navigation privée */ }
      if (!vu) setPopup(true);
    }
  };

  const fermerPopup = () => {
    setPopup(false);
    try { sessionStorage.setItem("taverne-proposition-compte", "1"); } catch { /* sans stockage */ }
  };

  useEffect(() => {
    if (!popup) return;
    const echap = (e: KeyboardEvent) => e.key === "Escape" && fermerPopup();
    window.addEventListener("keydown", echap);
    return () => window.removeEventListener("keydown", echap);
  }, [popup]);

  const total = zones.reduce((s, z) => s + z.etapes.length, 0);
  const nbFaites = zones.reduce((s, z) => s + z.etapes.filter((e) => faites.has(e.id)).length, 0);
  const duJour = jours.find((j) => j.jour === aujourdhui())?.faites ?? 0;
  const zoneEnCours = zones.findIndex((z) => z.etapes.some((e) => !faites.has(e.id)));
  const lienCompte = `/compte/?retour=${encodeURIComponent(retour)}`;

  return (
    <div className="guide-parcours">
      <div className="guide-bilan" aria-live="polite">
        <div>
          <p className="guide-compteur"><strong>{nbFaites}</strong> / {total} quêtes</p>
          <div className="barre" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={nbFaites} aria-label="Progression du guide">
            <span style={{ width: `${total ? (100 * nbFaites) / total : 0}%` }} />
          </div>
        </div>
        <div className="guide-sauvegarde">
          {compte === null ? <span className="doux">Chargement de votre progression…</span>
            : compte.connecte ? (
              <>
                <span>
                  <strong>{compte.pseudo}</strong>, aujourd&apos;hui : {duJour} quête{duJour > 1 ? "s" : ""} faite{duJour > 1 ? "s" : ""}.{" "}
                  <span className="doux">{etat === "envoi" ? "Sauvegarde…" : etat === "ok" ? "Progression sauvegardée." : etat === "erreur" ? "Sauvegarde impossible, réessayez." : "Progression sauvegardée sur votre compte."}</span>
                </span>
                {jours.length > 1 ? (
                  <span className="doux jours">Derniers jours : {jours.slice(0, 7).map((j) => `${j.jour.slice(8, 10)}/${j.jour.slice(5, 7)} · ${j.faites}`).join(" — ")}</span>
                ) : null}
              </>
            ) : (
              <span>
                Vos cases cochées disparaîtront en quittant la page. <Link href={lienCompte} data-cta="guide-compte">Créez un compte gratuit</Link> pour garder votre progression.
              </span>
            )}
        </div>
      </div>

      <ol className="zones-guide">
        {zones.map((z, zi) => {
          const nb = z.etapes.filter((e) => faites.has(e.id)).length;
          const choisi = hubChoisi?.zone === zi ? hubChoisi.hub : null;
          const ordre = [...new Set(routeDesHubs(z.etapes))];
          const num = (h: number) => (h >= 0 ? ordre.indexOf(h) + 1 : 0);
          return (
            <li key={z.lieu} id={`zone-${z.lieu}`} className="zone-guide">
              <details open={zi === Math.max(0, zoneEnCours)}>
                <summary>
                  <span className="numero-etape" aria-hidden="true">{zi + 1}</span>
                  <span className="zone-titre">
                    <strong>{z.nom}</strong>
                    <span className="doux"> · niveaux {z.niveaux[0]} à {z.niveaux[1]} · {nb}/{z.etapes.length} quêtes</span>
                  </span>
                  {nb === z.etapes.length ? <span className="badge-talent">Terminée</span> : null}
                </summary>
                <div className="zone-corps">
                  <CarteZone z={z} faites={faites} choisi={choisi} onChoisir={(h) => setHubChoisi(choisi === h ? null : { zone: zi, hub: h })} />
                  <ol className="quetes-guide">
                    {z.etapes.map((e) => {
                      const visible = choisi === null || e.g === choisi || e.r === choisi;
                      return (
                        <li key={e.id} className={`quete-guide${faites.has(e.id) ? " faite" : ""}${visible ? "" : " estompee"}`}>
                          <label>
                            <input type="checkbox" checked={faites.has(e.id)} onChange={() => basculer(e.id)} />
                            <span>
                              <strong>{e.t}</strong> <span className="doux">· niv. {e.nv}</span>
                              {e.cl ? <span className="badge-talent">Classe</span> : null}
                              {e.grp ? <span className="badge-talent">Groupe</span> : null}
                              <span className="quete-ligne">
                                {e.g >= 0 ? <span className="pastille">{num(e.g)}</span> : null} {e.gn}
                                {e.obj.length ? <> — {e.obj.join(" ; ")}</> : null}
                                {e.rn && e.r !== e.g ? <> — à rendre à {e.r >= 0 ? <span className="pastille">{num(e.r)}</span> : null} {e.rn}{e.rl ? ` (${e.rl.replace(/-/g, " ")})` : ""}</> : null}
                              </span>
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </details>
            </li>
          );
        })}
      </ol>

      {popup ? (
        <div className="fond-popup" role="presentation" onClick={fermerPopup}>
          <div className="popup" role="dialog" aria-modal="true" aria-labelledby="titre-popup" onClick={(e) => e.stopPropagation()}>
            <h2 id="titre-popup">Gardez votre progression</h2>
            <p>
              Avec un compte gratuit à la Taverne, chaque quête cochée dans « {titre} » est sauvegardée, jour après jour, sur tous vos appareils.
              Sans compte, vos cases s&apos;effacent quand vous quittez la page.
            </p>
            <p className="doux" style={{ fontSize: 14 }}>Le même formulaire vous inscrit à la Lettre du dimanche, si vous le souhaitez.</p>
            <div className="actions-bandeau">
              <Link href={lienCompte} className="btn btn-or" data-cta="popup-compte-creer">Créer mon compte</Link>
              <Link href={`${lienCompte}&mode=connexion`} className="btn btn-contour" data-cta="popup-compte-connexion">Me connecter</Link>
              <button type="button" className="btn btn-contour" onClick={fermerPopup}>Plus tard</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
