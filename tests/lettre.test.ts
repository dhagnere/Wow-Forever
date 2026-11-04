import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const appels: { url: string; corps: Record<string, unknown> }[] = [];
function brevo(statut = 201) {
  appels.length = 0;
  vi.stubGlobal("fetch", vi.fn(async (url: string, init: { body: string }) => {
    appels.push({ url, corps: JSON.parse(init.body) });
    return new Response(null, { status: statut });
  }));
}

describe("Lettre en français et en anglais", () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

  it("inscrit la page anglaise à la liste et au modèle anglais, retour sur la page anglaise", async () => {
    vi.stubEnv("BREVO_API_KEY", "cle"); vi.stubEnv("BREVO_LISTE_ID", "3"); vi.stubEnv("BREVO_MODELE_DOI", "7");
    vi.stubEnv("BREVO_LISTE_ID_EN", "4"); vi.stubEnv("BREVO_MODELE_DOI_EN", "8");
    const { inscrire } = await import("@/lib/lettre");
    brevo();
    expect(await inscrire("Joueur@Exemple.com", "https://www.taverne-eternelle.fr", "en")).toEqual({ ok: true });
    expect(appels[0].corps).toMatchObject({ email: "joueur@exemple.com", includeListIds: [4], templateId: 8, redirectionUrl: "https://www.taverne-eternelle.fr/en/newsletter/thanks/" });
    brevo();
    await inscrire("joueur@exemple.fr", "https://www.taverne-eternelle.fr");
    expect(appels[0].corps).toMatchObject({ includeListIds: [3], templateId: 7, redirectionUrl: "https://www.taverne-eternelle.fr/lettre/merci/" });
  });

  it("se replie sur la liste française tant que l'édition anglaise n'est pas réglée", async () => {
    vi.stubEnv("BREVO_API_KEY", "cle"); vi.stubEnv("BREVO_LISTE_ID", "3"); vi.stubEnv("BREVO_MODELE_DOI", "7");
    vi.stubEnv("BREVO_LISTE_ID_EN", ""); vi.stubEnv("BREVO_MODELE_DOI_EN", "");
    const { inscrire, lettreAnglaiseConfiguree } = await import("@/lib/lettre");
    expect(lettreAnglaiseConfiguree()).toBe(false);
    brevo();
    await inscrire("player@example.com", "https://www.taverne-eternelle.fr", "en");
    expect(appels[0].corps).toMatchObject({ includeListIds: [3], templateId: 7, redirectionUrl: "https://www.taverne-eternelle.fr/en/newsletter/thanks/" });
  });

  it("répond en anglais sur la page anglaise et retire l'adresse des deux listes", async () => {
    vi.stubEnv("BREVO_API_KEY", "cle"); vi.stubEnv("BREVO_LISTE_ID", "3"); vi.stubEnv("BREVO_MODELE_DOI", "7"); vi.stubEnv("BREVO_LISTE_ID_EN", "4"); vi.stubEnv("BREVO_MODELE_DOI_EN", "8");
    const { desinscrire, inscrire } = await import("@/lib/lettre");
    expect(await inscrire("pas-une-adresse", "https://x.fr", "en")).toEqual({ ok: false, message: "This email address does not look valid. Please check it and try again." });
    brevo();
    expect(await desinscrire("player@example.com")).toBe(true);
    expect(appels.map((a) => a.url)).toEqual(["https://api.brevo.com/v3/contacts/lists/3/contacts/remove", "https://api.brevo.com/v3/contacts/lists/4/contacts/remove"]);
  });
});
