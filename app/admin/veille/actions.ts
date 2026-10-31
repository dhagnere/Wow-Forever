"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { estPilier, SLUGS_RUBRIQUES, type SlugRubrique } from "@/config/taxonomie";
import { changerStatut, creerBrouillon, ErreurPublication, modifier, publier, type Modifications } from "@/modules/veille";
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
  };
}

export async function enregistrer(id: number, _etat: EtatEdition, form: FormData): Promise<EtatEdition> {
  await exigerAdmin();
  const intention = String(form.get("intention") ?? "enregistrer");
  try {
    const m = lireFormulaire(form);
    if (m.titre.length < 3) return { erreurs: ["Le titre est obligatoire."] };
    await modifier(id, m);
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
