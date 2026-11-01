import { describe, expect, it } from "vitest";
import { classesAutorisees, decouperPrix, prixEnTexte, vitesse, nomCategorie, qualite } from "@/modules/veille/objets/libelles";
import { convertirCategories, convertirEnsembles, convertirObjets, objetInterne } from "@/modules/veille/objets/conversion";
import { decoderBlp, ErreurBlp } from "@/modules/veille/objets/blp";
import { lireFiltres, urlObjets, listeIndexable } from "@/lib/objets";

describe("libellés des objets", () => {
  it("découpe un prix en or, argent et cuivre", () => {
    expect(decouperPrix(255355)).toEqual({ or: 25, argent: 53, cuivre: 55 });
    expect(prixEnTexte(255355)).toBe("25 po 53 pa 55 pc");
    expect(prixEnTexte(10000)).toBe("1 po");
    expect(prixEnTexte(0)).toBe("0 pc");
  });

  it("ne retient que les neuf classes de Forever", () => {
    expect(classesAutorisees(-1)).toEqual([]);
    expect(classesAutorisees(32767)).toEqual([]);
    // Masque du jeu qui mêle le chaman à des classes absentes de Forever.
    expect(classesAutorisees(31296).map((c) => c.slug)).toEqual(["chaman"]);
    expect(classesAutorisees(1 | 1024).map((c) => c.nom)).toEqual(["Guerrier", "Druide"]);
  });

  it("formate la vitesse et nettoie les catégories abandonnées", () => {
    expect(vitesse(1900)).toBe("1,90");
    expect(nomCategorie("Generic(OBSOLETE)")).toBe("Generic");
    expect(qualite(99).nom).toBe("Classique");
  });
});

describe("conversion des tables du jeu", () => {
  const sparse = [
    "ID,Description_lang,Display_lang,OverallQualityID,ItemLevel,RequiredLevel,InventoryType,Bonding,AllowableClass,SellPrice,BuyPrice,Stackable,MaxCount,ItemDelay,ContainerSlots,ItemSet",
    '19019,,"Lame-tonnerre, épée bénie du Cherchevent",5,80,60,13,1,-1,255355,1276778,1,1,1900,0,0',
    "25,,Vieille épée courte,1,2,1,21,0,-1,7,35,1,0,1900,0,41",
    "99,,,1,1,1,0,0,-1,0,0,1,0,0,0,0",
    "100,,Sans entrée Item,1,1,1,0,0,-1,0,0,1,0,0,0,0",
  ].join("\n");
  const item = "ID,ClassID,SubclassID,IconFileDataID\n19019,2,7,135349\n25,2,7,135274\n99,15,0,1\n";

  it("assemble ItemSparse et Item, et écarte les objets sans nom ni entrée", () => {
    const objets = convertirObjets(sparse, item);
    expect(objets.map((o) => o.id)).toEqual([19019, 25]);
    expect(objets[0]).toMatchObject({ nom: "Lame-tonnerre, épée bénie du Cherchevent", nomRecherche: "lame tonnerre epee benie du cherchevent", qualite: 5, classe: 2, sousClasse: 7, icone: 135349, ensemble: null, prixVente: 255355 });
    expect(objets[1].ensemble).toBe(41);
  });

  it("écarte les objets internes et ceux au-delà du niveau 60", () => {
    for (const nom of ["[PÉRIMÉ] Lame-tonnerre", "Monster - Mace, Basic Stone Hammer", "OLDMonster - Feet", "1500 Test sword 80 purple", "Deprecated Book of Cyclone II", "Large Moneybag (old)", "Weapon of Massive Destruction (test)", "90 Epic Warrior Helm", "63 Green Rogue Tunic", "CHU's QUEST ITEM", "Template Item", "QAEnchant Shield - Law of Nature", "Ring of Critical Testing 2", "Head of Instructor Razuvious DEP"]) {
      expect(objetInterne(nom, 1), nom).toBe(true);
    }
    expect(objetInterne("Glaive de guerre d'Azzinoth (droit)", 70)).toBe(true);
    for (const nom of ["Testament du héros", "Vieille épée courte", "Lame-tonnerre, épée bénie du Cherchevent", "Old Blanchy", "Le phylactère of Kel'Thuzad", "Red Dragon Orb"]) {
      expect(objetInterne(nom, 60), nom).toBe(false);
    }
  });

  it("refuse un format de table inattendu plutôt que de remplir la base de zéros", () => {
    expect(() => convertirObjets("ID,Nom\n1,x", item)).toThrow(/colonnes absentes/);
  });

  it("lit les catégories et les ensembles", () => {
    const cats = convertirCategories(
      "ID,ClassName_lang,ClassID\n3,Arme,2\n",
      'DisplayName_lang,VerboseName_lang,ID,ClassID,SubClassID\nÉpée,"Épées à une main",9,2,7\n',
    );
    expect(cats).toEqual([
      { classe: 2, sousClasse: -1, nom: "Arme", nomLong: "" },
      { classe: 2, sousClasse: 7, nom: "Épée", nomLong: "Épées à une main" },
    ]);
    expect(convertirCategories("ID,ClassName_lang,ClassID\n9,Generic(OBSOLETE),8\n", "DisplayName_lang,VerboseName_lang,ID,ClassID,SubClassID\nTrade Goods (OBSOLETE),x,1,7,0\n"))
      .toEqual([{ classe: 8, sousClasse: -1, nom: "Autres objets", nomLong: "" }, { classe: 7, sousClasse: 0, nom: "Autres", nomLong: "" }]);
    expect(convertirEnsembles('ID,Name_lang\n1,"Le Gladiateur"\n2,\n')).toEqual([{ id: 1, nom: "Le Gladiateur" }]);
  });
});

/** Fichier BLP2 minimal : en-tête de 148 octets, palette de 1 024 octets, puis les données du premier niveau. */
function blp(encodage: number, profondeurAlpha: number, encodageAlpha: number, largeur: number, hauteur: number, donnees: Buffer, palette?: Buffer): Buffer {
  const entete = Buffer.alloc(148 + 1024);
  entete.write("BLP2", 0, "ascii");
  entete.writeUInt32LE(1, 4);
  entete[8] = encodage;
  entete[9] = profondeurAlpha;
  entete[10] = encodageAlpha;
  entete.writeUInt32LE(largeur, 12);
  entete.writeUInt32LE(hauteur, 16);
  entete.writeUInt32LE(148 + 1024, 20);
  entete.writeUInt32LE(donnees.length, 84);
  if (palette) palette.copy(entete, 148);
  return Buffer.concat([entete, donnees]);
}

describe("décodeur BLP2", () => {
  it("décode un bloc DXT1 uni", () => {
    // Couleur 0 = rouge pur (565 : 0xF800), tous les pixels sur l'index 0.
    const bloc = Buffer.from([0x00, 0xf8, 0x00, 0x00, 0, 0, 0, 0]);
    const img = decoderBlp(blp(2, 0, 0, 4, 4, bloc));
    expect(img.largeur).toBe(4);
    expect([...img.pixels.subarray(0, 4)]).toEqual([255, 0, 0, 255]);
    expect([...img.pixels.subarray(60, 64)]).toEqual([255, 0, 0, 255]);
  });

  it("décode une image à palette avec alpha sur 8 bits", () => {
    const palette = Buffer.alloc(1024);
    palette.set([255, 0, 0, 0], 4); // index 1 : bleu (BGRA)
    const img = decoderBlp(blp(1, 8, 0, 2, 1, Buffer.from([1, 0, 128, 255]), palette));
    expect([...img.pixels]).toEqual([0, 0, 255, 128, 0, 0, 0, 255]);
  });

  it("refuse un fichier qui n'est pas un BLP2", () => {
    expect(() => decoderBlp(Buffer.alloc(200))).toThrow(ErreurBlp);
  });
});

describe("filtres de la liste d'objets", () => {
  it("borne les valeurs et reconstruit l'adresse", () => {
    const f = lireFiltres({ q: " lame ", classe: "2", sous: "7", qualite: "9", min: "50", page: "abc" });
    expect(f).toEqual({ q: "lame", classe: 2, sousClasse: 7, qualite: undefined, niveauMin: 50, niveauMax: undefined, page: 1 });
    expect(urlObjets(f, { page: 3 })).toBe("/base-de-donnees/objets/?q=lame&classe=2&sous=7&min=50&page=3");
    expect(urlObjets({})).toBe("/base-de-donnees/objets/");
  });

  it("n'indexe que les listes par catégorie", () => {
    expect(listeIndexable({ classe: 2, sousClasse: 7, page: 1 })).toBe(true);
    expect(listeIndexable({ q: "lame" })).toBe(false);
    expect(listeIndexable({ classe: 2, page: 2 })).toBe(false);
  });
});
