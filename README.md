# Azeroth Forever

WoW Forever en français, de 1 à 60. Site de fans non officiel, signé Silfax.

Le site publie trois familles de pages : le fil d'actualité alimenté chaque matin par la veille, les pages piliers durables (classes, races, zones, donjons) et les contenus personnels de Silfax (carnet du dimanche, tests). Chaque article publié part ensuite sur la Page Facebook.

## Fonctionnement

1. **Chaque matin**, la veille parcourt les sources de `config/sources.ts`, garde les sujets des dernières 36 heures qui parlent de Forever, écarte les doublons et classe le reste.
2. Les douze meilleurs sujets deviennent des **brouillons** rédigés en français par l'API Anthropic, rangés dans leur rubrique et rattachés à leur page pilier.
3. Silfax **relit** dans `/admin/veille`, écrit son avis, puis publie tout de suite, **programme** la publication à une date et une heure, ou supprime. Sans avis, la publication comme la programmation sont refusées.
4. **Chaque heure**, à la 5e minute, les articles programmés arrivés à échéance sont mis en ligne ; puis, entre 8h et 22h, les articles publiés partent sur la Page Facebook avec leur image d'ouverture.

Score d'un sujet : poids des sources qui en parlent + fraîcheur (3 points au plus) + 1,5 point si une vidéo existe + 1 point par source en langue étrangère (2 au plus). La revue complète de chaque passage est conservée dans la table `veille_revues` et consultable dans `/admin/veille/revue`.

## Mise en service sur Scalingo

1. Créer l'application (région Paris) et ajouter l'extension **PostgreSQL**.
2. Saisir les variables listées dans `.env.example` : `SITE_URL`, `ADMIN_IDENTIFIANT`, `ADMIN_PASSWORD`, `SESSION_SECRET` d'abord ; `ANTHROPIC_API_KEY` et les variables Facebook ensuite.
3. Relier le dépôt GitHub à l'application. Chaque envoi déclenche un déploiement ; la base est créée ou mise à jour par la commande `postdeploy` du `Procfile`.
4. Vérifier les sources :
   ```bash
   scalingo --app azeroth-forever run npm run veille:sources
   ```
   Retirer ou corriger dans `config/sources.ts` les flux en échec.
5. Voir le classement du jour, sans coût :
   ```bash
   scalingo --app azeroth-forever run npm run veille:essai
   ```
6. Premier passage complet, puis relecture dans `/admin/veille` :
   ```bash
   scalingo --app azeroth-forever run npm run veille:quotidien
   ```
7. Créer l'application Meta, obtenir un jeton de Page longue durée avec la permission `pages_manage_posts`, saisir `FACEBOOK_PAGE_ID` et `FACEBOOK_PAGE_TOKEN`. Le relais horaire s'active seul.
8. Contrôler l'aperçu d'un article avec le Débogueur de partage de Meta.
9. Google Search Console : ajouter une propriété de type **Préfixe de l'URL** (adresse exacte du site, avec `https://`), choisir la validation **Balise HTML**, copier la valeur de `content="…"` dans la variable `GOOGLE_SITE_VERIFICATION`, attendre le redémarrage de l'application, puis cliquer sur « Valider ». Envoyer ensuite `sitemap.xml` dans la rubrique Sitemaps. La propriété de type **Domaine** n'est possible qu'avec un nom de domaine à vous (validation par un enregistrement DNS), pas avec l'adresse `scalingo.io`.

### Espace d'administration

Adresse : `/admin/connexion/` (aucun lien public n'y mène ; `/admin/` y renvoie si l'on n'est pas connecté).

| Écran | Rôle |
|---|---|
| `/admin/` | Tableau de bord : brouillons, publications programmées, publiés de la semaine, échecs Facebook ; derniers passages de la veille ; réglages manquants ; boutons « Lancer la veille maintenant » et « Classement seul, sans IA » |
| `/admin/veille/` | Articles : onglets Brouillons, Programmés, Publiés, Corbeille ; « Écrire un article » |
| `/admin/veille/<n>/` | Éditeur : enregistrer, publier maintenant, programmer (heure de Paris), annuler la programmation, retirer du site, relancer le relais Facebook après échec |
| `/admin/veille/revue/` | Revue complète du dernier passage |
| `/admin/sources/` | Sources surveillées, test de chacune |
| `/admin/compte/` | Changement de mot de passe |

**Premier accès.** Tant qu'aucun compte n'existe en base, l'identifiant `ADMIN_IDENTIFIANT` (par défaut `silfax`) et le mot de passe `ADMIN_PASSWORD` créent le compte à la première connexion. L'écran « Mon compte » s'ouvre alors pour choisir un mot de passe personnel ; `ADMIN_PASSWORD` n'est plus lu ensuite.

**Sécurité.** Mots de passe hachés (scrypt, 16 caractères minimum). Session signée de 12 heures, cookie `HttpOnly` et `SameSite=Strict`. Changer le mot de passe ferme toutes les sessions ouvertes. Cinq essais manqués bloquent l'identifiant et l'adresse IP pendant 15 minutes (compteur en base, conservé aux redémarrages).

**Mot de passe perdu, ou second compte :**
```bash
scalingo --app azeroth-forever run npm run admin:compte -- silfax
```
Le mot de passe est demandé au clavier sans s'afficher. Si l'identifiant existe, son mot de passe est remplacé.

**Lancer la veille depuis le tableau de bord.** Le passage tourne dans le conteneur web (même commande que le planificateur, sortie visible dans les journaux Scalingo). Un verrou empêche deux passages simultanés ; chaque passage, planifié ou manuel, est consigné dans la table `veille_passages`.

### Tâches planifiées (`cron.json`)

| Tâche | Horaire | Remarque |
|---|---|---|
| `veille:quotidien` | `37 5 * * *` | Le planificateur Scalingo tourne en UTC : 6h37 à Paris en hiver, 7h37 en été. |
| `veille:facebook` | toutes les heures, à la 5e minute | Met d'abord en ligne les articles programmés arrivés à échéance (à toute heure). Relais Facebook : la plage 8h-22h (heure de Paris) est contrôlée par le code, changement d'heure compris. |

Fixer un plafond mensuel de dépense dans la console Anthropic dès le départ.

## Développement local

```bash
npm install
cp .env.example .env.local   # renseigner DATABASE_URL, ADMIN_IDENTIFIANT, ADMIN_PASSWORD, SESSION_SECRET
npm run db:migrate
npm run dev
```

Avant tout envoi : `npm run lint && npm test && npm run build`. Les règles à respecter en modifiant le code sont dans `CLAUDE.md`.

## Arborescence

```
app/(site)/          pages publiques (accueil, actualités, articles, classes, races, zones, donjons, carnet…)
app/admin/           espace d'administration (tableau de bord, articles, revue, sources, compte)
components/          composants d'affichage
content/             contenu des pages piliers (classes, race Skyborne, zones, donjons)
config/              sources surveillées, rubriques et pages piliers
modules/veille/      module autonome : collecte, classement, rédaction, articles, relais Facebook, sessions
tests/               tests unitaires
```

## Reste à faire

- **Illustrations** : la maquette utilisait des visuels qui n'ont pas pu être récupérés. Ils sont remplacés par des fonds et emblèmes générés en CSS (`components/Visuels.tsx`). Déposer les images dans `public/images/` et remplacer `<Visuel>` / `<Embleme>` par des balises `<img>`.
- **Textes entre crochets** : avis de Silfax sur les pages piliers, conseils de classe, fiche du personnage, mentions légales (éditeur, données personnelles).
- **Adresses des flux** : à confirmer avec `npm run veille:sources` une fois en ligne.
- **Outils** (calculateur de talents, quiz) : prévus dans la maquette, à développer quand Blizzard publiera les arbres de talents de Forever.
- **Cadre juridique** : interroger le service RH ou le référent déontologue avant toute monétisation (voir le plan de lancement, point 4).

World of Warcraft et Blizzard Entertainment sont des marques de Blizzard Entertainment, Inc. Azeroth Forever est un site de fans non officiel, sans lien avec Blizzard.
