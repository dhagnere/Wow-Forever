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
- **Comptes joueurs et guide de 1 à 60** : `/compte/` (inscription, connexion, Lettre, mot de passe oublié via Brevo avec `BREVO_EXPEDITEUR`) ; guide pas à pas par race et classe sur `/guides/parcours/<race>/<classe>/`, cartes numérotées, route tracée et progression sauvegardée jour par jour.
- **Guides de quêtes** : quêtes de classe chaîne par chaîne et parcours de 1 à 60 pour chaque faction (`npm run base:quetes`, à partir des bases libres CMaNGOS et AzerothCore, recoupées avec les fichiers de Forever).
- **Illustrations** : icônes de classes et de races et écrans de chargement tirés des fichiers de Forever (`npm run icones:jeu`, `npm run ecrans:jeu`). Chaque page a l'écran de son thème (`lib/ecrans.ts`). Le Mont Hyjal, Shen'dralar et les Rives claires n'ont pas encore d'écran publié par Blizzard (fichiers chiffrés) : relancer `npm run ecrans:jeu` après chaque mise à jour du jeu, puis ajouter leur carte dans `config/ecrans.ts`.
- **Version anglaise** : `/en/` (accueil, guide de 1 à 60, classes, sorts, talents et calculateur, races, base d'objets, cartes du monde, zones, donjons, Skyborne, guides et quêtes de classe, compte), avec les noms tirés des fichiers anglais du jeu. Bouton FR/EN dans l'en-tête, balises hreflang sur les pages traduites, proposition de la version anglaise aux navigateurs non francophones. Même compte et même progression dans les deux langues.
- **Statistiques** : `/admin/statistiques`, sans cookie (voir `CLAUDE.md`).
- **Tableau des guildes** : `/guildes/`. Les guildes s'inscrivent sans compte ni adresse électronique ; chaque fiche est relue dans `/admin/guildes/` avant publication. Le responsable reçoit un lien secret pour modifier sa fiche ou confirmer qu'elle est active ; une fiche non confirmée depuis 90 jours n'est plus affichée. Trois dépôts par jour et par connexion au plus.
- **Soutenir** : `/soutenir/`. Les boutons de don n'apparaissent qu'une fois `NEXT_PUBLIC_DON_PONCTUEL_URL` ou `NEXT_PUBLIC_DON_MENSUEL_URL` renseignées (et `NEXT_PUBLIC_DON_PLATEFORME`, par exemple « Tipeee »). Agent public : obtenir l'autorisation de cumul d'activités avant la première recette.

## Mise en ligne : Scalingo et Gandi

Le site est publié à l'adresse **https://www.taverne-eternelle.fr** (application Scalingo `wowforever`, région Paris `osc-fr1`, domaine chez Gandi). La procédure complète, pas à pas, est dans [`INSTALLATION.md`](INSTALLATION.md) :

1. outils ;
2. création de l'application ;
3. variables ;
4. domaines sur Scalingo ;
5. enregistrements DNS chez Gandi ;
6. certificat et HTTPS ;
7. ancien domaine ;
8. bascule de `SITE_URL` ;
9. messagerie et Brevo ;
10. services reliés (Meta, TikTok…) ;
11. Google et Bing ;
12. premier remplissage ;
13. contrôle final.

Page Facebook (textes, images de profil et de couverture) et connecteurs du site (Facebook, Instagram, TikTok, Brevo, Anthropic, Discord) : [`RESEAUX.md`](RESEAUX.md).

Lettre, confirmations d'inscription et messages « mot de passe oublié » (Brevo), pas à pas : [`BREVO.md`](BREVO.md).

### Tâches planifiées (`cron.json`)

| Tâche | Horaire | Remarque |
|---|---|---|
| `veille:quotidien` | `37 5 * * *` | Le planificateur Scalingo tourne en UTC : 6h37 à Paris en hiver, 7h37 en été. |
| `veille:facebook` | toutes les heures, à la 5e minute | La plage 8h-22h (heure de Paris) est contrôlée par le code, changement d'heure compris. |
| `veille:traduire` | toutes les heures, à la 25e minute | Traduit en anglais les articles en ligne sans version anglaise à jour (8 par passage). |
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
