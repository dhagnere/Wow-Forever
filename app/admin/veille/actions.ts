"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { estPilier, SLUGS_RUBRIQUES, type SlugRubrique } from "@/config/taxonomie";
import {
  changerStatut, creerBrouillon, definirImage, enregistrerAvisPropose, enregistrerImage, ErreurImage, ErreurPublication, modifier,
  proposerAvis, publier,
  TAILLE_MAX_OCTETS, type Modifications,
} from "@/modules/veille";
import { exigerAdmin } from "@/lib/admin";

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
    imageAlt: texte("imageAlt"),
    imageCredit: texte("imageCredit"),
    // Le formulaire signale la présence des cases par un champ caché : sans lui, le choix des sources reste inchangé.
    sourcesAffichees: form.has("sourcesPresentes") ? form.getAll("sourceAffichee").map(Number).filter(Number.isInteger) : undefined,
  };
}

function fichier(form: FormData, nom: string): File | null {
  const f = form.get(nom);
  return f instanceof File && f.size > 0 ? f : null;
}

/** Enregistre les images envoyées ou retire celles demandées. Renvoie les erreurs éventuelles. */
async function traiterImages(id: number, form: FormData, m: Modifications): Promise<string[]> {
  const une = fichier(form, "image");
  const facebook = fichier(form, "imageFacebook");
  const erreurs: string[] = [];
  if ((une || facebook) && form.get("droitsImages") !== "on") {
    return ["Cochez la case confirmant que les images envoyées vous appartiennent ou sont utilisées avec autorisation."];
  }
  if (une && m.imageAlt.length < 5) {
    return ["Décrivez l'image d'en-tête en quelques mots (texte alternatif) avant de l'envoyer."];
  }
  for (const [f, emplacement] of [[une, "une"], [facebook, "facebook"]] as const) {
    if (!f) continue;
    if (f.size > TAILLE_MAX_OCTETS) {
      erreurs.push(`« ${f.name} » : image trop lourde, 8 Mo au maximum.`);
      continue;
    }
    try {
      const mediaId = await enregistrerImage(Buffer.from(await f.arrayBuffer()));
      await definirImage(id, emplacement, mediaId);
    } catch (e) {
      if (e instanceof ErreurImage) erreurs.push(`« ${f.name} » : ${e.message}`);
      else throw e;
    }
  }
  if (!une && form.get("retirerImage") === "on") await definirImage(id, "une", null);
  if (!facebook && form.get("retirerImageFacebook") === "on") await definirImage(id, "facebook", null);
  return erreurs;
}

export async function enregistrer(id: number, _etat: EtatEdition, form: FormData): Promise<EtatEdition> {
  await exigerAdmin();
  const intention = String(form.get("intention") ?? "enregistrer");
  try {
    const m = lireFormulaire(form);
    if (m.titre.length < 3) return { erreurs: ["Le titre est obligatoire."] };
    // Le texte est enregistré d'abord : une image refusée ne fait pas perdre les modifications.
    await modifier(id, m);
    const erreursImages = await traiterImages(id, form, m);
    if (erreursImages.length) {
      revalidatePath("/", "layout");
      return { erreurs: erreursImages, message: "Texte enregistré, mais l'image n'a pas été prise en compte." };
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

/**
 * Demande à l'IA une proposition d'avis de Silfax, à partir du texte en cours d'édition.
 * La proposition est conservée à part : elle n'entre dans l'avis que si Silfax la reprend.
 */
export async function proposerAvisPour(
  id: number,
  contenu: { titre: string; chapo: string; corps: string },
): Promise<{ avis?: string; erreur?: string }> {
  await exigerAdmin();
  if (!process.env.ANTHROPIC_API_KEY) return { erreur: "ANTHROPIC_API_KEY n'est pas renseignée : proposition impossible." };
  const r = await proposerAvis({
    titre: String(contenu.titre ?? "").slice(0, 300),
    chapo: String(contenu.chapo ?? "").slice(0, 1000),
    corps: String(contenu.corps ?? "").slice(0, 20000),
  });
  if (!r.ok) return { erreur: r.raison };
  await enregistrerAvisPropose(id, r.avis);
  return { avis: r.avis };
}
