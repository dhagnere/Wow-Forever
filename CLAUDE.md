# La Taverne Éternelle — consignes pour Claude Code

Site de fans francophone non officiel consacré à World of Warcraft: Forever. Next.js 16 (App Router), PostgreSQL, hébergé chez Scalingo. Les articles sont signés Jobwow, gnome mage et tavernier (avatar : `visuels/jobwow.svg`). Le nom de code interne de l'avis reste `avis_silfax` / `avisSilfax` : ne pas renommer la colonne.

## Organisation

| Dossier | Rôle | Liberté |
|---|---|---|
| `app/(site)/`, `components/`, `app/globals.css`, `content/` | Pages publiques, habillage, contenu des pages piliers | Libre |
| `app/admin/` | Espace de relecture `/admin/veille` | Libre sur l'ergonomie, garde-fous intacts |
| `modules/veille/` | Collecte, classement, rédaction IA, articles, relais Facebook, sessions, base d'objets (`objets/`), statistiques d'audience (`statistiques/`) | Module cloisonné |
| `content/calendrier.ts` | Dates clés (page Calendrier et fichier d'agenda) | Libre ; une date non annoncée reste `null` |
| `visuels/` | Dessins de l'enseigne, de la chope et de Jobwow ; `npm run visuels:generer` refait les PNG | Libre |
| `config/sources.ts` | Sources surveillées | Libre |
| `config/taxonomie.ts` | Rubriques et pages piliers | Ajouter librement ; ne pas renommer un slug déjà publié |

## Limites du module

- Les pages (`app/`, `components/`, `lib/`, `proxy.ts`) n'importent **que** `@/modules/veille` (fichier `modules/veille/index.ts`). Jamais un fichier interne du module. Un besoin nouveau = un export de plus dans `index.ts`.
- Le module n'importe rien de `app/` ni de `components/`. Il peut lire `config/`.
- Seul `db/schema.sql` modifie la structure de la base. Il doit rester idempotent (`IF NOT EXISTS`) : il est rejoué à chaque déploiement.

## Garde-fous à ne jamais affaiblir

1. **Avis obligatoire.** Aucun article ne se publie sans « L'avis de Jobwow » rédigé (80 caractères minimum, sans texte à remplacer entre crochets). La règle est appliquée deux fois : `articles/publication.ts` et la contrainte `avis_obligatoire` de la base. Ne pas retirer, assouplir ni contourner l'une ou l'autre, ni publier par une requête SQL directe. L'IA peut proposer un avis (`avis_propose`, affiché dans l'éditeur) ; il n'entre dans `avis_silfax` que par un clic de Jobwow. Ne jamais remplir `avis_silfax` automatiquement.
2. **Filtrage du HTML.** Tout contenu affiché passe par `markdownVersHtml` / `nettoyerHtml` (`rendu/html.ts`). Pas de `dangerouslySetInnerHTML` sur du contenu non filtré. Seules les vidéos YouTube sont intégrables.
3. **Accès réservé.** Tout `/admin` exige une session signée : `proxy.ts` à l'entrée, `exigerAdmin()` en tête de chaque page et de chaque action serveur. Une nouvelle page ou action d'administration appelle `exigerAdmin()`.
4. **Droit d'auteur.** Les consignes de rédaction (`redaction/consignes.ts`) imposent un article neuf, une seule citation courte, des sources créditées et aucune image copiée. Le ton peut être ajusté ; ces règles, non. Une image ne s'envoie qu'avec la case de déclaration des droits cochée, et passe toujours par `enregistrerImage` (réencodage, métadonnées retirées). Une image d'en-tête exige sa description.
5. **Les réseaux suivent le site.** Le relais (Facebook, Reels, Instagram, TikTok) ne publie que des articles déjà en ligne, avec un lien ou un renvoi vers le site (jamais vers la source), entre 8h et 22h (Paris), trois publications par heure et par réseau au plus. Les jetons d'accès restent en base ou dans les variables d'environnement, jamais affichés ni journalisés. Tout texte destiné à un réseau social passe par `texteReseau` (`reseaux/textes.ts`), qui ajoute la phrase d'appel unique de `config/reseaux.ts` : ne pas la dupliquer ni la contourner.

## Statistiques d'audience

Mesure maison, sans cookie ni stockage dans le navigateur (`components/Mesure.tsx` → `/api/mesure` → `statistiques/collecte.ts`). Ne jamais enregistrer l'adresse IP, un identifiant durable ni les paramètres d'adresse : le visiteur est une empreinte salée (`STATS_SEL`) recalculée chaque jour. Les refus de suivi du navigateur (DNT, GPC) sont respectés ; les données de plus de 13 mois sont effacées. Tableau de bord : `/admin/statistiques` (`exigerAdmin()`). Un bouton se mesure en lui donnant un attribut `data-cta="nom-court"`.

## Tableau des guildes

Contenu déposé par des inconnus (`guildes/`). Chaque fiche passe par la relecture de `/admin/guildes` avant publication ; une modification repasse en relecture. Les textes sont affichés comme du texte brut (jamais en HTML), sans lien : les seuls liens sont l'invitation Discord et un site https, validés par `validerFiche` et rendus en `rel="nofollow ugc"`. Le lien de modification est un secret : seule son empreinte est en base, la page `/guildes/modifier/…` n'est ni indexée ni mesurée.

## Base d'objets

Importée des fichiers du jeu par wago.tools (`objets/wago.ts`, produit `wowf`), en français. L'import remplace tout en une transaction et s'arrête si moins de 1 000 objets sont lus. Les objets internes (tests, équipement des monstres, objets périmés, niveau requis au-delà de 60) sont écartés par `objetInterne` (`objets/conversion.ts`). Les icônes ne sont demandées à wago.tools que pour un objet connu de la base, puis gardées en cache dans `objets_icones`. Garder le crédit wago.tools et la mention Blizzard (pages de la base et mentions légales). Les icônes de classes et de races, les écrans de chargement et les cartes du monde (`public/images/jeu/`) viennent de la même source : `npm run icones:jeu`, `npm run ecrans:jeu` et `npm run cartes:jeu` les refont. Les pages de lieux `/cartes/<lieu>/` relient les noms des guides (`content/reference.ts`) aux cartes par `lieuParNom` (`lib/cartes.ts`) : un nom qui diffère du jeu va dans `ALIAS` (le test `tests/cartes.test.ts` le signale). La liste des écrans est dans `config/ecrans.ts`, le choix de l'écran de chaque page dans `lib/ecrans.ts`. Chaque illustration porte la mention « © Blizzard Entertainment ».

## Sorts et talents des classes

Lus dans les fichiers du jeu par `npm run sorts:jeu` (`sorts/conversion.ts`), sans base de données : le script écrit `content/sorts-jeu.json` et les icônes `public/images/jeu/sorts/`, affichés sous chaque classe (`components/SortsClasse.tsx`, un onglet par spécialisation). Une spécialisation associe un arbre de talents à la ligne de compétence de son école (`SPECIALISATIONS`). Les descriptions du jeu sont des modèles (`$s1`, `$d`, `${…}`) remplis par `sorts/description.ts` pour un personnage sans talent ni équipement ; ce qui dépend de la puissance d'attaque ou de l'arme s'affiche « X ». Les fichiers ne contiennent que le premier rang des talents. Les familiers suivent (`components/FamiliersClasse.tsx`) : familles de bêtes du chasseur et démons du démoniste, lus par `CreatureFamily` et leurs lignes de compétence ; les techniques communes des bêtes sont celles que le Dressage des bêtes enseigne. Les familiers n'ont pas d'arbre de talents dans les fichiers de Forever (seuls les 27 arbres des classes existent) ; la loyauté du chasseur vient de `PetLoyalty`. Un talent dont le sort n'est pas publié reste dans l'arbre sous `TALENT_NON_PUBLIE`.

Calculateur de talents : `/classes/<classe>/talents/` (`components/CalculateurTalents.tsx`), règles dans `lib/calculateur.ts` (51 points au niveau 60, 5 points par palier, prérequis au maximum, retrait refusé s'il casse l'arbre). Le build est dans l'adresse (`?build=0503-…-…`, un chiffre par talent dans l'ordre palier puis colonne) : changer l'ordre ou le nombre de talents d'un arbre casse les liens déjà partagés. Relancer le script à chaque version du jeu ; il s'arrête si moins de 200 sorts sont lus.

## Caractéristiques et sources des objets

Les recettes des métiers (« Fabriqué par », « Utilisé pour fabriquer », « Apprend à fabriquer ») viennent aussi des fichiers du jeu, lues à l'import par `convertirRecettes` (table `objets_recettes`). Les bonus, l'armure et les dégâts sont calculés à l'import par `objets/caracteristiques.ts`, comme le fait le jeu (budget du niveau d'objet × part de chaque bonus) ; les légendaires gardent des dégâts propres, non calculés. « Où le trouver » vient des bases libres CMaNGOS classic-db (GPL v3) et AzerothCore (noms français, GPL v2) : `npm run base:butin` produit `objets/donnees/butin.json.gz`, lu par `ouTrouver`. Les positions sont converties sur les cartes du jeu, la zone d'un point étant tranchée par les zones d'exploration des cartes. Ne pas récupérer ces données sur Wowhead ou un site équivalent : leurs bases sont protégées. Garder le crédit sur les fiches et dans les mentions légales.

## Commandes

```bash
npm run dev              # site en local (DATABASE_URL requis)
npm test                 # tests unitaires (garde-fous, classement, flux, relais)
npm run lint             # vérification des types
npm run build            # compilation de production
npm run db:migrate       # schéma de la base
npm run veille:sources   # vérifie chaque flux de config/sources.ts
npm run veille:essai     # classement du jour, sans rédaction ni coût d'API
npm run veille:quotidien # passage complet : brouillons rédigés par l'IA
npm run veille:revue     # rédige les meilleurs sujets de la dernière revue, sans refaire la collecte
npm run veille:dossier   # dossiers de référence sur 60 jours (zones-depart, donjons, zones-niveaux), sans coût d'API
npm run veille:facebook  # relais Facebook
npm run veille:liens     # remplace les liens Google News des sources par l'adresse directe des articles (aussi fait chaque matin)
npm run base:importer    # base d'objets depuis wago.tools, caractéristiques comprises (si nouvelle version du jeu ; --forcer, --icones)
npm run base:butin -- <dump CMaNGOS> <db_world AzerothCore>  # « où le trouver » → modules/veille/objets/donnees/butin.json.gz (fichier versionné)
npm run visuels:generer  # PNG de l'enseigne, de l'icône du site et de l'avatar de Jobwow, depuis visuels/
npm run cartes:jeu       # cartes du monde (continents, zones, Zéphras) assemblées depuis les tuiles du jeu → public/images/jeu/cartes/
npm run ecrans:jeu       # écrans de chargement du jeu (config/ecrans.ts) → public/images/jeu/ecrans/, en 1600 et 800 pixels
npm run sorts:jeu        # sorts et talents de chaque classe par spécialisation (wago.tools) → content/sorts-jeu.json et public/images/jeu/sorts/
npm run icones:jeu       # icônes officielles des classes et des races, découpées dans les fichiers du jeu (wago.tools) → public/images/jeu/
```

Avant tout envoi : `npm run lint && npm test && npm run build`.

## Style

Textes du site en français, ton direct et chaleureux, sans formules creuses. Les informations non confirmées restent entre crochets (`[À compléter]`) plutôt qu'inventées.
