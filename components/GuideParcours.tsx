"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export interface HubVue { x: number; y: number; n: string[] }
export interface EtapeVue {
  id: number; t: string; nv: number; min: number; cl: number; grp: 0 | 1; obj: string[]; g: number; gn: string; r: number; rn: string; rl: string | null;
  cib: { p: [number, number][]; c: [number, number] } | null;
}
export interface ActionVue { a: "prendre" | "faire" | "rendre"; q: number }
export interface ArretVue { x: number | null; y: number | null; type: "pnj" | "cible" | "ailleurs"; hub: number; actions: ActionVue[] }
export interface ZoneVue {
  lieu: string; nom: string; carte: string; lienCarte: string; niveaux: [number, number]; hubs: HubVue[]; etapes: EtapeVue[]; arrets: ArretVue[];
}

type Jour = { jour: string; faites: number };

/** Hauteur de la carte dans le repère du tracé (cartes de zone en 1002 × 668 : 100 de large, 66,7 de haut). */
const H = 66.7;
const yCarte = (y: number) => (y * H) / 100;

/** Segment de A vers B raccourci aux deux bouts, pour que la pointe de la flèche ne disparaisse pas sous la pastille. */
export function segment(a: { x: number; y: number }, b: { x: number; y: number }, marge = 2.2): [number, number, number, number] | null {
  const ax = a.x, ay = yCarte(a.y), bx = b.x, by = yCarte(b.y);
  const d = Math.hypot(bx - ax, by - ay);
  if (d < marge * 2.2) return null;
  const ux = (bx - ax) / d, uy = (by - ay) / d;
  return [ax + ux * marge, ay + uy * marge, bx - ux * marge, by - uy * marge];
}

const aujourdhui = () => new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris" }).format(new Date());

function CarteZone({ z, faites, voir, actif, onArret }: {
  z: ZoneVue; faites: Set<number>; voir: Set<number>; actif: number | null; onArret: (i: number) => void;
}) {
  // Un arrêt est fait quand toutes les quêtes qu'on y rend ou qu'on y avance sont terminées.
  const arretFait = (a: ArretVue) => a.actions.every((x) => faites.has(z.etapes[x.q].id));
  // Portion de route affichée : l'étape choisie, sinon la première qui reste à faire, et les suivantes.
  const debut = actif ?? Math.max(0, z.arrets.findIndex((a) => !arretFait(a)));
  const fin = debut + FENETRE;
  const toutes = z.arrets.map((a, i) => ({ ...a, i })).filter((a) => a.x !== null && a.y !== null) as (ArretVue & { i: number; x: number; y: number })[];
  const places = toutes.filter((a) => a.i >= debut - 1 && a.i <= fin);
  // Plusieurs passages au même point de rassemblement : une seule pastille, avec les numéros d'étape.
  const pastilles = new Map<string, { x: number; y: number; type: ArretVue["type"]; etapes: number[]; noms: string[]; fait: boolean }>();
  // Les autres PNJ de la zone restent visibles, sans numéro.
  const horsFenetre = new Map<number, ArretVue & { x: number; y: number }>();
  for (const a of toutes) if (a.type === "pnj" && (a.i < debut - 1 || a.i > fin)) horsFenetre.set(a.hub, a);
  for (const a of places) {
    const cle = a.type === "pnj" ? `h${a.hub}` : `c${a.x},${a.y}`;
    const p = pastilles.get(cle) ?? { x: a.x, y: a.y, type: a.type, etapes: [], noms: a.type === "pnj" ? z.hubs[a.hub].n : [], fait: true };
    p.etapes.push(a.i + 1);
    p.fait &&= arretFait(a);
    pastilles.set(cle, p);
  }
  const quetesVues = z.etapes.map((e, q) => ({ e, q })).filter(({ e }) => voir.has(e.id) && e.cib);
  const idSvg = `fl-${z.lieu}`;
  return (
    <figure className="carte-guide">
      <div className="carte-points">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={z.carte} alt={`Carte : ${z.nom}`} width={1000} height={667} loading="lazy" />
        <svg className="trace-route" viewBox={`0 0 100 ${H}`} preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <marker id={`${idSvg}-or`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" className="pointe-or" />
            </marker>
            <marker id={`${idSvg}-rouge`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" className="pointe-rouge" />
            </marker>
          </defs>
          {places.slice(1).map((b, k) => {
            const s = segment(places[k], b);
            if (!s) return null;
            const fait = arretFait(b);
            return <line key={b.i} x1={s[0]} y1={s[1]} x2={s[2]} y2={s[3]} className={`fleche-route${fait ? " fleche-faite" : ""}${actif === b.i ? " fleche-active" : ""}`} markerEnd={`url(#${idSvg}-or)`} />;
          })}
          {quetesVues.map(({ e }) => {
            const c = { x: e.cib!.c[0], y: e.cib!.c[1] };
            const depart = e.g >= 0 ? z.hubs[e.g] : null;
            const fin = e.r >= 0 ? z.hubs[e.r] : null;
            const aller = depart ? segment(depart, c, 1.3) : null;
            const retour = fin ? segment(c, fin, 1.3) : null;
            return (
              <g key={e.id} className="fleches-quete">
                {aller ? <line x1={aller[0]} y1={aller[1]} x2={aller[2]} y2={aller[3]} markerEnd={`url(#${idSvg}-rouge)`} /> : null}
                {retour ? <line x1={retour[0]} y1={retour[1]} x2={retour[2]} y2={retour[3]} className="retour" markerEnd={`url(#${idSvg}-rouge)`} /> : null}
              </g>
            );
          })}
        </svg>
        {quetesVues.flatMap(({ e }) => e.cib!.p.map(([x, y], k) => (
          <span key={`${e.id}-${k}`} className="cible-carte" style={{ left: `${x}%`, top: `${y}%` }} title={`${e.t} : ${e.obj.join(" ; ")}`} aria-hidden="true" />
        )))}
        {[...horsFenetre.entries()].filter(([h]) => !places.some((a) => a.type === "pnj" && a.hub === h)).map(([h, a]) => (
          <span key={`loin-${h}`} className="hub-loin" style={{ left: `${a.x}%`, top: `${a.y}%` }} title={z.hubs[h].n.join(", ")} aria-hidden="true" />
        ))}
        {[...pastilles.values()].map((p) => {
          const libelle = p.etapes.length > 3 ? `${p.etapes.slice(0, 3).join("·")}…` : p.etapes.join("·");
          return (
            <button
              key={`${p.type}-${p.x}-${p.y}`}
              type="button"
              className={`${p.type === "pnj" ? "hub-carte" : "secteur-carte"}${p.fait ? " hub-fini" : ""}${actif !== null && p.etapes.includes(actif + 1) ? " hub-choisi" : ""}`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              onClick={() => onArret(p.etapes.find((n) => !arretFait(z.arrets[n - 1])) ?? p.etapes[0])}
              aria-label={`${p.type === "pnj" ? p.noms.join(", ") : "Secteur des objectifs"}, étape${p.etapes.length > 1 ? "s" : ""} ${p.etapes.join(", ")}`}
              title={p.type === "pnj" ? p.noms.join(", ") : "Monstres et objets des quêtes en cours"}
            >
              <span>{libelle}</span>
            </button>
          );
        })}
      </div>
      <figcaption className="doux">
        <span className="legende-pnj" aria-hidden="true" /> PNJ · <span className="legende-secteur" aria-hidden="true" /> objectifs · flèches : étapes {debut + 1} à {Math.min(fin + 1, z.arrets.length)}{" "}
        (choisissez une étape pour voir la suite).{" "}
        <Link href={z.lienCarte}>Carte détaillée</Link> · © Blizzard Entertainment
      </figcaption>
    </figure>
  );
}

const VERBES = { prendre: "Prendre", faire: "Faire", rendre: "Rendre" } as const;
/** Nombre d'étapes tracées après l'étape en cours. */
const FENETRE = 8;

export function GuideParcours({ cle, titre, zones, retour }: { cle: string; titre: string; zones: ZoneVue[]; retour: string }) {
  const [faites, setFaites] = useState<Set<number>>(new Set());
  const [voir, setVoir] = useState<Set<number>>(new Set());
  const [compte, setCompte] = useState<{ connecte: boolean; pseudo?: string } | null>(null);
  const [jours, setJours] = useState<Jour[]>([]);
  const [etat, setEtat] = useState<"" | "envoi" | "ok" | "erreur">("");
  const [popup, setPopup] = useState(false);
  const [actif, setActif] = useState<{ zone: number; arret: number } | null>(null);
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

  const basculerVoir = (id: number) => setVoir((avant) => {
    const s = new Set(avant);
    if (s.has(id)) s.delete(id); else s.add(id);
    return s;
  });

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

  const allerA = (zone: number, arret: number) => {
    setActif({ zone, arret });
    document.getElementById(`arret-${zones[zone].lieu}-${arret}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const total = zones.reduce((s, z) => s + z.etapes.length, 0);
  const nbFaites = zones.reduce((s, z) => s + z.etapes.filter((e) => faites.has(e.id)).length, 0);
  const duJour = jours.find((j) => j.jour === aujourdhui())?.faites ?? 0;
  const zoneEnCours = zones.findIndex((z) => z.etapes.some((e) => !faites.has(e.id)));
  const lienCompte = `/compte/?retour=${encodeURIComponent(retour)}`;

  return (
    <div className="guide-parcours">
      <div className="guide-bilan" aria-live="polite">
        <div>
          <p className="guide-compteur"><strong>{nbFaites}</strong> / {total} quêtes rendues</p>
          <div className="barre" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={nbFaites} aria-label="Progression du guide">
            <span style={{ width: `${total ? (100 * nbFaites) / total : 0}%` }} />
          </div>
        </div>
        <div className="guide-sauvegarde">
          {compte === null ? <span className="doux">Chargement de votre progression…</span>
            : compte.connecte ? (
              <>
                <span>
                  <strong>{compte.pseudo}</strong>, aujourd&apos;hui : {duJour} quête{duJour > 1 ? "s" : ""} rendue{duJour > 1 ? "s" : ""}.{" "}
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
          const arretActif = actif?.zone === zi ? actif.arret : null;
          return (
            <li key={z.lieu} id={`zone-${z.lieu}`} className="zone-guide">
              <details open={zi === Math.max(0, zoneEnCours)}>
                <summary>
                  <span className="numero-etape" aria-hidden="true">{zi + 1}</span>
                  <span className="zone-titre">
                    <strong>{z.nom}</strong>
                    <span className="doux"> · niveaux {z.niveaux[0]} à {z.niveaux[1]} · {nb}/{z.etapes.length} quêtes · {z.arrets.length} étapes</span>
                  </span>
                  {nb === z.etapes.length ? <span className="badge-talent">Terminée</span> : null}
                </summary>
                <div className="zone-corps">
                  <CarteZone z={z} faites={faites} voir={voir} actif={arretActif} onArret={(n) => allerA(zi, n - 1)} />
                  <ol className="arrets-guide">
                    {z.arrets.map((a, ai) => {
                      const lieu = a.type === "pnj" ? z.hubs[a.hub].n.slice(0, 3).join(", ")
                        : a.type === "cible" ? "Secteur des objectifs" : "Hors de la zone";
                      return (
                        <li key={ai} id={`arret-${z.lieu}-${ai}`} className={`arret-guide arret-${a.type}${arretActif === ai ? " arret-actif" : ""}`}>
                          <button type="button" className="arret-titre" onClick={() => setActif(arretActif === ai ? null : { zone: zi, arret: ai })}>
                            <span className={a.type === "pnj" ? "pastille" : "pastille pastille-secteur"}>{ai + 1}</span>
                            <strong>{lieu}</strong>
                            {a.x !== null && a.y !== null ? <span className="doux"> ({a.x.toLocaleString("fr-FR")} · {a.y.toLocaleString("fr-FR")})</span> : null}
                          </button>
                          <ul className="actions-arret">
                            {a.actions.map((x) => {
                              const e = z.etapes[x.q];
                              const fait = faites.has(e.id);
                              return (
                                <li key={`${x.a}-${e.id}`} className={`action-${x.a}${fait ? " faite" : ""}`}>
                                  {x.a === "rendre" ? (
                                    <label className="ligne-action">
                                      <input type="checkbox" checked={fait} onChange={() => basculer(e.id)} />
                                      <span><span className="verbe">{VERBES[x.a]}</span> <strong>{e.t}</strong>{e.rl ? <span className="doux"> à {e.rn} ({e.rl})</span> : a.type !== "pnj" && e.rn ? <span className="doux"> à {e.rn}</span> : null}</span>
                                    </label>
                                  ) : (
                                    <div className="ligne-action">
                                      <span className="puce-action" aria-hidden="true">{x.a === "prendre" ? "!" : "⚔"}</span>
                                      <span>
                                        <span className="verbe">{VERBES[x.a]}</span> <strong>{e.t}</strong>
                                        {x.a === "prendre" ? <span className="doux"> · niv. {e.nv}</span> : null}
                                        {x.a === "prendre" && e.cl ? <span className="badge-talent">Classe</span> : null}
                                        {x.a === "prendre" && e.grp ? <span className="badge-talent">Groupe</span> : null}
                                        {x.a === "faire" && e.obj.length ? <span className="objectifs"> : {e.obj.join(" ; ")}</span> : null}
                                        {e.cib && x.a === "faire" ? (
                                          <label className="voir-cibles">
                                            <input type="checkbox" checked={voir.has(e.id)} onChange={() => basculerVoir(e.id)} />
                                            Monstres et objets sur la carte
                                          </label>
                                        ) : null}
                                      </span>
                                    </div>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
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
