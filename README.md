# La Taverne Éternelle

L'actualité de WoW Forever, servie chaque matin par Jobwow. Site de fans non officiel, de 1 à 60.

Le site publie trois familles de pages : le fil d'actualité alimenté chaque matin par la veille, les pages piliers durables (classes, races, zones, donjons) et les contenus personnels de Jobwow (carnet du dimanche, tests). Chaque article publié part ensuite sur la Page Facebook.

## Fonctionnement

1. **Chaque matin**, la veille parcourt les sources de `config/sources.ts`, garde les sujets des dernières 36 heures qui parlent de Forever, écarte les doublons et classe le reste.
2. Les douze meilleurs sujets deviennent des **brouillons** rédigés en français par l'API Anthropic, rangés dans leur rubrique et rattachés à leur page pilier.
3. Jobwow **relit** dans `/admin/veille`, écrit son avis, publie ou supprime. Sans avis, la publication est refusée.
4. **Chaque heure**, entre 8h et 22h, les articles publiés partent sur la Page Facebook avec leur image d'ouverture, puis en Reel (vidéo verticale de 10 secondes fabriquée par le site). Chaque post se termine par la même phrase d'appel à l'action, définie dans `config/reseaux.ts`. La même vidéo part en Reel sur Instagram (compte professionnel relié à la Page) et sur TikTok (compte relié depuis `/admin/reseaux/` ; mode brouillon par défaut, mode direct après audit de l'application par TikTok). Le texte pour X est prêt à copier dans l'éditeur.

Liens des sources : un lien Google News ne contient plus l'adresse de l'article. La veille la retrouve dans le flux RSS public de l'éditeur, puis dans son plan du site, à partir du titre (`collecte/liens.ts`) ; sinon le lien Google News est gardé. Les liens restés indirects sont retentés chaque matin, et `npm run veille:liens` corrige à la demande les articles déjà enregistrés (en créditant au passage l'éditeur réel des anciennes sources « Google News (…) »).

Score d'un sujet : poids des sites qui en parlent (un site compte une fois, même s'il remonte par plusieurs flux) + fraîcheur (3 points au plus) + 1,5 point si une vidéo existe + 1 point par source en langue étrangère (2 au plus). Chaque sujet est aussi classé par thème (rubrique) et, quand il en désigne une nettement, par page pilier, à partir de mots-clés français et anglais, sans coût d'API. La sélection quotidienne plafonne chaque thème pour alimenter toutes les pages. La revue complète de chaque passage est conservée dans la table `veille_revues` et consultable dans `/admin/veille/revue`, avec un filtre par thème ; la liste des articles montre le remplissage de chaque page de thème.

## La Taverne en bref

- **Identité** : enseigne de taverne (chope et sablier), palette bois sombre `#2B1D14`, ambre `#E0A23B`, parchemin `#F3E6C8`, vert de Hyjal `#2F5D50`, rouge braise `#A3402C` ; Cinzel et Source Sans 3. Jobwow, gnome mage, signe « — Jobwow, au comptoir de la Taverne ». Avatar à télécharger pour les réseaux : `public/images/jobwow-1080.png`.
- **Rubriques** : Le Comptoir (actualités), L'Armurerie (classes), La Salle des cartes (zones), La Cave (donjons et raids), Le Registre (races), Le Carnet de Jobwow. Les adresses ne changent pas.
- **Pages ajoutées** : `/calendrier/` (et `/agenda-taverne.ics`), `/lettre/`, `/communaute/`, `/contact/`, `/confidentialite/`, page introuvable, `/rss.xml`, `/sitemap-actualites.xml`.
- **Appels à l'action** : un bouton principal et un secondaire par page, chacun marqué `data-cta` ; les liens publiés sur Facebook portent `utm_source=facebook`.
- **Base d'objets, caractéristiques et sources** : bonus, armure et dégâts calculés depuis les fichiers du jeu à l'import, avec les recettes des métiers (fabriqué par, composants, paliers de difficulté, plans qui l'apprennent, objets fabriqués avec) (`npm run base:importer -- --forcer` pour les ajouter aux objets déjà importés). « Où le trouver » (monstres et taux, coffres et filons, marchands, quêtes, emplacements sur la carte) vient des bases libres CMaNGOS et AzerothCore ; pour le refaire : cloner `cmangos/classic-db` et les fichiers `creature_template_locale`, `gameobject_template_locale`, `quest_template_locale` d'AzerothCore, puis `npm run base:butin -- <dump .sql.gz> <dossier db_world>`.
- **Cartes du monde** : `/cartes/` (Royaumes de l'Est, Kalimdor, île de Zéphras) et une page par lieu `/cartes/<lieu>/` avec sa carte, ses niveaux, ses donjons et les zones voisines (`npm run cartes:jeu`). Les guides de zones et de donjons y renvoient.
- **Sorts et talents** : sous chaque classe, un onglet par spécialisation avec ses sorts (rangs, niveaux, coût, incantation) et son arbre de talents, plus les traits raciaux de chaque race (page Races, fiche Skyborne), les familiers du chasseur (19 familles) et les démons du démoniste, et un calculateur de talents par classe (`/classes/<classe>/talents/`, build partageable par lien), lus dans les fichiers de Forever (`npm run sorts:jeu`, à relancer à chaque version du jeu).
- **Guides de quêtes** : quêtes de classe chaîne par chaîne et parcours de 1 à 60 pour chaque faction (`npm run base:quetes`, à partir des bases libres CMaNGOS et AzerothCore, recoupées avec les fichiers de Forever).
- **Illustrations** : icônes de classes et de races et écrans de chargement tirés des fichiers de Forever (`npm run icones:jeu`, `npm run ecrans:jeu`). Chaque page a l'écran de son thème (`lib/ecrans.ts`). Le Mont Hyjal, Shen'dralar et les Rives claires n'ont pas encore d'écran publié par Blizzard (fichiers chiffrés) : relancer `npm run ecrans:jeu` après chaque mise à jour du jeu, puis ajouter leur carte dans `config/ecrans.ts`.
- **Statistiques** : `/admin/statistiques`, sans cookie (voir `CLAUDE.md`).
- **Tableau des guildes** : `/guildes/`. Les guildes s'inscrivent sans compte ni adresse électronique ; chaque fiche est relue dans `/admin/guildes/` avant publication. Le responsable reçoit un lien secret pour modifier sa fiche ou confirmer qu'elle est active ; une fiche non confirmée depuis 90 jours n'est plus affichée. Trois dépôts par jour et par connexion au plus.
- **Soutenir** : `/soutenir/`. Les boutons de don n'apparaissent qu'une fois `NEXT_PUBLIC_DON_PONCTUEL_URL` ou `NEXT_PUBLIC_DON_MENSUEL_URL` renseignées (et `NEXT_PUBLIC_DON_PLATEFORME`, par exemple « Tipeee »). Agent public : obtenir l'autorisation de cumul d'activités avant la première recette.

### Changer de nom de domaine

1. Déclarer `www.taverne-eternelle.fr` dans Scalingo (onglet *Domains*), en domaine principal.
2. Chez le registraire : `www` en CNAME vers la cible donnée par Scalingo ; l'adresse sans `www` et les `.com` en redirection permanente (301) vers `https://www.taverne-eternelle.fr`.
3. Changer `SITE_URL` chez Scalingo. Le domaine affiché dans la phrase d'appel des réseaux, les liens Facebook, le plan du site et l'agenda suivent seuls.

## Mise en service sur Scalingo

1. Créer l'application (région Paris) et ajouter l'extension **PostgreSQL**.
2. Saisir les variables listées dans `.env.example` : `SITE_URL`, `ADMIN_PASSWORD`, `SESSION_SECRET` d'abord ; `ANTHROPIC_API_KEY` et les variables Facebook ensuite.
3. Relier le dépôt GitHub à l'application. Chaque envoi déclenche un déploiement ; la base est créée ou mise à jour par la commande `postdeploy` du `Procfile`.
4. Vérifier les sources :
   ```bash
   scalingo --app wowforever run npm run veille:sources
   ```
   Retirer ou corriger dans `config/sources.ts` les flux en échec.
5. Voir le classement du jour, sans coût :
   ```bash
   scalingo --app wowforever run npm run veille:essai
   ```
6. Premier passage complet, puis relecture dans `/admin/veille` :
   ```bash
   scalingo --app wowforever run npm run veille:quotidien
   ```
   Pour transformer en brouillons les sujets d'une revue déjà faite (par `veille:essai`), sans refaire la collecte : cocher les sujets dans `/admin/veille/revue` et cliquer sur « Rédiger les sujets cochés », ou lancer `npm run veille:revue`.
7. Créer l'application Meta, obtenir un jeton de Page longue durée avec la permission `pages_manage_posts`, saisir `FACEBOOK_PAGE_ID` et `FACEBOOK_PAGE_TOKEN`. Le relais horaire s'active seul.
8. Contrôler l'aperçu d'un article avec le Débogueur de partage de Meta.
9. Google Search Console : ajouter une propriété de type **Préfixe de l'URL** (adresse exacte du site, avec `https://`), choisir la validation **Balise HTML**, copier la valeur de `content="…"` dans la variable `GOOGLE_SITE_VERIFICATION`, attendre le redémarrage de l'application, puis cliquer sur « Valider ». Envoyer ensuite `sitemap.xml` dans la rubrique Sitemaps. La propriété de type **Domaine** n'est possible qu'avec un nom de domaine à vous (validation par un enregistrement DNS), pas avec l'adresse `scalingo.io`.

10. Base d'objets : premier import, icônes comprises (5 minutes environ), puis la tâche quotidienne suit les nouvelles versions du jeu :
   ```bash
   scalingo --app wowforever run npm run base:importer -- --icones
   ```

11. Lettre de la Taverne (Brevo) : créer une liste, un modèle de confirmation « double opt-in », puis saisir `BREVO_API_KEY`, `BREVO_LISTE_ID` et `BREVO_MODELE_DOI`. Dans les campagnes, activer le suivi Google Analytics de Brevo avec `utm_source=lettre` : les visites venues de la Lettre apparaissent alors dans les statistiques.
12. Statistiques : saisir `STATS_SEL` (32 caractères aléatoires). Discord : `NEXT_PUBLIC_DISCORD_URL` (lien d'invitation) ; sans lui, les boutons Discord restent masqués.

### Tâches planifiées (`cron.json`)

| Tâche | Horaire | Remarque |
|---|---|---|
| `veille:quotidien` | `37 5 * * *` | Le planificateur Scalingo tourne en UTC : 6h37 à Paris en hiver, 7h37 en été. |
| `veille:facebook` | toutes les heures, à la 5e minute | La plage 8h-22h (heure de Paris) est contrôlée par le code, changement d'heure compris. |
| `base:importer` | `17 4 * * *` | Réimporte la base d'objets seulement si une nouvelle version de Forever est sortie. |

Fixer un plafond mensuel de dépense dans la console Anthropic dès le départ.

## Développement local

```bash
npm install
cp .env.example .env.local   # renseigner DATABASE_URL, ADMIN_PASSWORD, SESSION_SECRET
npm run db:migrate
npm run dev
```

Avant tout envoi : `npm run lint && npm test && npm run build`. Les règles à respecter en modifiant le code sont dans `CLAUDE.md`.

## Arborescence

```
app/(site)/          pages publiques (accueil, actualités, articles, classes, races, zones, donjons, carnet…)
app/admin/           espace de relecture /admin/veille
components/          composants d'affichage
content/             contenu des pages piliers (classes, race Skyborne, zones, donjons)
config/              sources surveillées, rubriques et pages piliers
modules/veille/      module autonome : collecte, classement, rédaction, articles, relais Facebook, sessions, base d'objets
tests/               tests unitaires
```

## Reste à faire

- **Illustrations** : chaque article peut recevoir une image d'en-tête et une image propre au post Facebook, envoyées depuis `/admin/veille` (stockées en base). Les visuels des pages fixes (accueil, classes, zones) restent générés en CSS (`components/Visuels.tsx`) : déposer les images dans `public/images/` et remplacer `<Visuel>` / `<Embleme>` par des balises `<img>`.
- **Textes entre crochets** : avis de Jobwow sur les pages piliers, conseils de classe, fiche du personnage, mentions légales (éditeur, données personnelles).
- **Adresses des flux** : à confirmer avec `npm run veille:sources` une fois en ligne.
- **Outils** (calculateur de talents, quiz) : prévus dans la maquette, à développer quand Blizzard publiera les arbres de talents de Forever.
- **Cadre juridique** : interroger le service RH ou le référent déontologue avant toute monétisation (voir le plan de lancement, point 4).

World of Warcraft et Blizzard Entertainment sont des marques de Blizzard Entertainment, Inc. La Taverne Éternelle est un site de fans non officiel, sans lien avec Blizzard.
