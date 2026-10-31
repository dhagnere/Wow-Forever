"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { estPilier, SLUGS_RUBRIQUES, type SlugRubrique } from "@/config/taxonomie";
import { annulerProgrammation, changerStatut, creerBrouillon, ErreurPublication, modifier, programmer, publier, relancerFacebook, type Modifications } from "@/modules/veille";
import { exigerAdmin } from "@/lib/admin";

/** Heure du passage horaire (cron.json : 5e minute de chaque heure) qui publiera un article programmé à « d ». */
function passageApres(d: Date): string {
  const t = new Date(d);
  t.setUTCMinutes(5, 0, 0);
  if (t < d) t.setUTCHours(t.getUTCHours() + 1);
  return t.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });
}

const dateHeure = (d: Date) => new Date(d).toLocaleString("fr-FR", { dateStyle: "full", timeStyle: "short", timeZone: "Europe/Paris" });

/** Décalage (en minutes) de l'heure de Paris par rapport à UTC à l'instant donné. */
function decalageParis(instant: number): number {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })
      .formatToParts(new Date(instant)).map((x) => [x.type, x.value]),
  );
  return (Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute) - instant) / 60_000;
}

/** « 2026-11-05T09:00 » saisi dans le formulaire, compris comme une heure de Paris. */
function heureDeParis(saisie: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(saisie);
  if (!m) return null;
  const naif = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  let instant = naif - decalageParis(naif) * 60_000;
  instant = naif - decalageParis(instant) * 60_000; // second passage : changement d'heure
  return new Date(instant);
}

export interface EtatEdition {
  erreurs: string[];
  message?: string;
}

function lireFormulaire(form: FormData): Modifications {
  const texte = (nom: string) => String(form.get(nom) ?? "").trim();
  const rubrique = texte("rubrique");
  const pilier = texte("pilier");
  return {
    titre: texte("titre"),
    chapo: texte("chapo"),
    corps: texte("corps"),
    avisSilfax: texte("avisSilfax"),
    rubrique: ((SLUGS_RUBRIQUES as string[]).includes(rubrique) ? rubrique : "actualites") as SlugRubrique,
    etiquettes: [...new Set(texte("etiquettes").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean))].slice(0, 6),
    pilier: estPilier(pilier) ? pilier : null,
    description: texte("description"),
    accrocheFacebook: texte("accrocheFacebook"),
    texteFacebook: texte("texteFacebook"),
  };
}

export async function enregistrer(id: number, _etat: EtatEdition, form: FormData): Promise<EtatEdition> {
  await exigerAdmin();
  const intention = String(form.get("intention") ?? "enregistrer");
  try {
    const m = lireFormulaire(form);
    if (m.titre.length < 3) return { erreurs: ["Le titre est obligatoire."] };
    if (intention === "annuler-programmation") {
      await annulerProgrammation(id);
      await modifier(id, m);
      revalidatePath("/admin", "layout");
      return { erreurs: [], message: "Programmation annulée : l'article reste en brouillon." };
    }
    await modifier(id, m);
    if (intention === "programmer") {
      const quand = heureDeParis(String(form.get("programmeLe") ?? ""));
      if (!quand) return { erreurs: ["Indiquez la date et l'heure de publication."] };
      const a = await programmer(id, quand);
      revalidatePath("/admin", "layout");
      return { erreurs: [], message: `Publication programmée le ${dateHeure(a.programmeLe!)}. Mise en ligne effective au passage horaire suivant, vers ${passageApres(a.programmeLe!)}, puis relais Facebook.` };
    }
    if (intention === "publier") {
      const a = await publier(id);
      revalidatePath("/", "layout");
      return { erreurs: [], message: `Article publié : /articles/${a.slug}/ — il partira sur Facebook dans l'heure (entre 8h et 22h).` };
    }
    revalidatePath("/", "layout");
    return { erreurs: [], message: "Modifications enregistrées." };
  } catch (e) {
    if (e instanceof ErreurPublication) return { erreurs: e.erreurs };
    throw e;
  }
}

export async function relancer(id: number): Promise<void> {
  await exigerAdmin();
  const ok = await relancerFacebook(id);
  const message = ok
    ? "Article remis dans la file Facebook : il partira au prochain passage horaire, entre 8h et 22h."
    : "Relance impossible : l'article est déjà relayé, n'est pas en ligne, ou a été publié il y a plus de 7 jours.";
  redirect(`/admin/veille/${id}/?message=${encodeURIComponent(message)}`);
}

export async function supprimer(id: number): Promise<void> {
  await exigerAdmin();
  await changerStatut(id, "supprime");
  revalidatePath("/", "layout");
  redirect("/admin/veille/");
}

export async function depublier(id: number): Promise<void> {
  await exigerAdmin();
  await changerStatut(id, "brouillon");
  revalidatePath("/", "layout");
  redirect(`/admin/veille/${id}/`);
}

export async function restaurer(id: number): Promise<void> {
  await exigerAdmin();
  await changerStatut(id, "brouillon");
  redirect(`/admin/veille/${id}/`);
}

export async function ecrireArticle(): Promise<void> {
  await exigerAdmin();
  const a = await creerBrouillon({
    titre: "Nouvel article",
    chapo: "",
    corps: "",
    rubrique: "actualites",
    etiquettes: [],
    pilier: null,
    description: "",
    accrocheFacebook: "",
    texteFacebook: "",
    sources: [],
    origine: "manuel",
  });
  redirect(`/admin/veille/${a.id}/`);
}
