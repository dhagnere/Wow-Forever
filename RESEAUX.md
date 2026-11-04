# Page Facebook et connecteurs du site

Deux parties : ce qu'il faut écrire sur la Page **facebook.com/taverneeternelle**, puis, service par service, les clés que le site attend chez Scalingo. Une fois les clés saisies, `/admin/reseaux/` indique l'état de chaque réseau (✓ ou ✗).

Les intitulés des menus de Meta et de TikTok changent souvent : en cas d'écart, chercher l'intitulé le plus proche.

---

## Partie 1 — Remplir la Page Facebook

Depuis la Page : *Modifier* (ou *Paramètres* → *Informations sur la Page*).

### Images

| Élément | Fichier du dépôt | Remarque |
|---|---|---|
| Photo de profil | `public/images/facebook-profil-1080.png` (1080 × 1080) | Facebook la recadre en cercle : l'enseigne reste entière. |
| Photo de couverture | `public/images/facebook-couverture-1640x624.png` (1640 × 624) | Texte au centre, pour rester lisible sur téléphone, où les bords sont coupés. |

Les deux images sont faites avec les dessins de la Taverne, sans capture du jeu.

### Informations

| Champ | À saisir |
|---|---|
| Nom | La Taverne Éternelle |
| Nom d'utilisateur | taverneeternelle |
| Catégories (3 au plus) | taper « jeux vidéo », puis « actualités », et prendre les plus proches proposées (par exemple *Site web de jeux vidéo*, *Site web d'actualités et de médias*) |
| Bio (101 caractères au plus) | `Actualité, guides et base de données de WoW Forever, en français, servis chaque matin par Jobwow.` (97 caractères) |
| Site web | `https://www.taverne-eternelle.fr` |
| Adresse e-mail | `contact@taverne-eternelle.fr` |
| Lien supplémentaire | Discord de la Taverne, s'il existe |
| Bouton d'action | *S'inscrire* → `https://www.taverne-eternelle.fr/lettre/` |

Ne pas indiquer de numéro de téléphone ni d'adresse postale : la Page n'en a pas besoin.

### Publication d'accueil, à épingler

À publier une fois le site en ligne, puis à épingler (*…* → *Épingler la publication*) :

> Bienvenue à la Taverne Éternelle 🍺
>
> Ici, Jobwow, gnome mage et tavernier, sert chaque matin l'actualité de WoW Forever, en français : nouvelles vérifiées, correctifs, annonces de Blizzard.
>
> Sur le site, vous trouverez aussi :
> • le guide de 1 à 60 pour votre race et votre classe, quête par quête, avec les PNJ et les monstres sur la carte ;
> • les sorts, les talents et un calculateur pour chaque classe ;
> • la base de données de tous les objets du jeu, avec où les trouver.
>
> 👉 https://www.taverne-eternelle.fr
>
> Site de fans indépendant, non affilié à Blizzard Entertainment. World of Warcraft et Warcraft sont des marques de Blizzard Entertainment.

### Réglages de la Page

- *Paramètres* → *Confidentialité* : laisser les publications des visiteurs soumises à validation, pour garder la main sur ce qui s'affiche.
- *Rôles de la Page* : vous en administrateur. Le compte qui crée l'application Meta (partie 2) doit être administrateur de la Page.

---

## Partie 2 — Les connecteurs demandés par le site

Toutes les clés se saisissent chez Scalingo :
- en ligne de commande : `scalingo --region osc-fr1 --app wowforever env-set NOM=valeur` ;
- ou au tableau de bord : application → *Environment*.

Ne jamais les publier, les envoyer par message ou les coller dans un ticket.

### 2.1 Facebook : publications et Reels

Variables : `FACEBOOK_PAGE_ID`, `FACEBOOK_PAGE_TOKEN`.

**Créer l'application Meta**
1. Sur developers.facebook.com, avec le compte administrateur de la Page : *Mes applications* → *Créer une application*.
2. Nom : « La Taverne Éternelle – relais ». Choisir le cas d'usage **Gérer tout sur votre Page**. Ajouter aussi le cas d'usage Instagram de publication de contenu si Meta le propose (pour la partie 2.2).
3. Rattacher l'application à votre portefeuille Business si la Page en fait partie.
4. *Paramètres de l'application* → *Général* :
   - domaine : `taverne-eternelle.fr` ;
   - politique de confidentialité : `https://www.taverne-eternelle.fr/confidentialite/` ;
   - instructions de suppression des données : `https://www.taverne-eternelle.fr/confidentialite/` ;
   - catégorie : *Actualités* ou *Divertissement* ;
   - icône : `public/images/logo-taverne-512.png`.

**Obtenir le jeton de Page permanent**
1. Ouvrir l'**Explorateur de l'API Graph** (developers.facebook.com/tools/explorer). Choisir l'application, puis *Jeton d'utilisateur*.
2. Ajouter les autorisations :
   - `pages_show_list` ;
   - `pages_read_engagement` ;
   - `pages_manage_posts` ;
   - `instagram_basic` ;
   - `instagram_content_publish` ;
   - `business_management`, si la Page est dans un portefeuille Business.
3. Cliquer sur *Générer un jeton d'accès*, se connecter, cocher la Page *La Taverne Éternelle* (et le compte Instagram) et valider.
4. Ouvrir le **Débogueur de jeton d'accès** (developers.facebook.com/tools/debug/accesstoken), coller ce jeton, puis cliquer sur *Prolonger le jeton d'accès*. On obtient un jeton d'utilisateur valable environ 60 jours.
5. Revenir à l'Explorateur, coller ce jeton prolongé et lancer la requête `GET` suivante :
   ```
   me/accounts?fields=id,name,access_token
   ```
6. Dans la réponse, sur la ligne « La Taverne Éternelle » :
   - `id` est le **FACEBOOK_PAGE_ID** ;
   - `access_token` est le **FACEBOOK_PAGE_TOKEN**.

   Un jeton de Page obtenu depuis un jeton prolongé n'expire pas. Le vérifier dans le Débogueur : la ligne « Expire » doit indiquer *Jamais*.
7. Saisir les deux valeurs chez Scalingo.

**Passer l'application en ligne**
- Tant que l'application est en mode *Développement*, ce qu'elle publie n'est visible que des personnes qui ont un rôle sur l'application. Passer l'application en mode **En ligne** (sélecteur en haut de son tableau de bord) une fois les champs de l'étape « Créer » remplis.
- Vous êtes administrateur à la fois de l'application et de la Page : l'accès standard aux autorisations suffit en principe. Si Meta refuse une autorisation en mode En ligne, la soumettre à l'*Examen de l'application* (App Review), en expliquant qu'elle sert à publier sur votre propre Page.

**Vérifier**
- `/admin/reseaux/` doit afficher « ✓ Page configurée (posts) » et « ✓ Reels actifs ».
- Le premier article publié part dans l'heure, entre 8 h et 22 h, heure de Paris.
- Pour couper les Reels et garder les posts : `FACEBOOK_REELS=off`.
- Si vous changez votre mot de passe Facebook ou retirez l'application de la Page, le jeton tombe : refaire les étapes « Obtenir le jeton » ci-dessus.

### 2.2 Instagram

Aucune variable supplémentaire : le site se sert du jeton de Page de la partie 2.1.

1. Passer le compte Instagram en **compte professionnel** : application Instagram → *Paramètres* → *Type de compte et outils* → *Passer à un compte professionnel*, catégorie *Créateur de contenu numérique* ou *Site web d'actualités*.
2. Relier le compte à la Page : Page Facebook → *Paramètres* → *Comptes liés* → *Instagram* → *Connecter le compte*. Le lien peut aussi se faire depuis l'Espace Comptes de Meta.
3. Si le jeton a été généré avant cette liaison, en regénérer un (partie 2.1, étapes 1 à 7) en cochant aussi le compte Instagram.
4. Remplir le profil Instagram :
   - nom : *La Taverne Éternelle* ;
   - bio : `L'actualité de WoW Forever, servie chaque matin par Jobwow 🍺 Guide de 1 à 60, classes, objets.` ;
   - lien : `https://www.taverne-eternelle.fr` ;
   - photo : `facebook-profil-1080.png`.
5. `/admin/reseaux/` doit afficher « ✓ compte relié (identifiant …) ». Chaque article part en Reel, avec sa vidéo et sa légende.

Pour couper Instagram : `INSTAGRAM_PUBLICATION=off`.

### 2.3 TikTok

Variables : `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`. Facultative : `TIKTOK_MODE`.

1. Sur developers.tiktok.com, avec votre compte TikTok : *Manage apps* → *Connect an app*. Type : application pour vous-même ou votre organisation.
2. Fiche de l'application :
   - nom : *La Taverne Éternelle* ;
   - icône : `logo-taverne-512.png` ;
   - catégorie : *Entertainment* ou *News* ;
   - description : « Publie les vidéos des articles de la Taverne Éternelle, site de fans de WoW Forever, sur le compte TikTok de la Taverne » ;
   - conditions d'utilisation : `https://www.taverne-eternelle.fr/mentions-legales/` ;
   - confidentialité : `https://www.taverne-eternelle.fr/confidentialite/` ;
   - plateforme : *Web*, site `https://www.taverne-eternelle.fr`.
3. Ajouter les produits :
   - **Login Kit**, avec l'adresse de retour (Redirect URI) `https://www.taverne-eternelle.fr/reseaux/tiktok/retour/` ;
   - **Content Posting API**.
4. Portées demandées : `user.info.basic`, `video.upload`, `video.publish`.
5. Copier *Client key* et *Client secret* dans `TIKTOK_CLIENT_KEY` et `TIKTOK_CLIENT_SECRET` chez Scalingo.
6. Soumettre l'application à validation (*Submit for review*). En attendant, le mode *Sandbox* fonctionne avec votre compte ajouté comme utilisateur de test.
7. Dans `/admin/reseaux/`, cliquer sur **Relier le compte TikTok**, puis accepter sur TikTok. L'accès se renouvelle ensuite seul.

Modes de publication :
- **Brouillon**, par défaut : la vidéo arrive dans votre boîte de réception TikTok ; vous ajoutez la légende (copiable dans l'éditeur de l'article) et publiez depuis l'application.
- **Direct** (`TIKTOK_MODE=direct`) : publication immédiate, mais seulement après l'audit de l'application par TikTok. D'ici là, les vidéos restent privées.

### 2.4 Brevo : la Lettre et les messages des comptes joueurs

Variables : `BREVO_API_KEY`, `BREVO_LISTE_ID`, `BREVO_MODELE_DOI`, `BREVO_EXPEDITEUR` ; pour l'édition anglaise, `BREVO_LISTE_ID_EN` et `BREVO_MODELE_DOI_EN`.

La procédure complète, étape par étape, est dans [`BREVO.md`](BREVO.md) :
- domaine authentifié chez Gandi ;
- expéditeur ;
- listes française et anglaise ;
- modèles de confirmation ;
- clé d'API et adresses IP de Scalingo à autoriser ;
- essais ;
- Lettre du dimanche.

### 2.5 Rédaction par l'IA (Anthropic)

Variable : `ANTHROPIC_API_KEY`.

Sur console.anthropic.com :
- *API Keys* → créer une clé, à copier dans `ANTHROPIC_API_KEY` ;
- *Limits* : fixer un plafond de dépense mensuel dès le départ.

### 2.6 Discord et autres liens

| Variable | Valeur |
|---|---|
| `NEXT_PUBLIC_DISCORD_URL` | lien d'invitation permanent du serveur (*Inviter des membres* → *Modifier le lien* → expiration *Jamais*) ; sans lui, les boutons Discord restent masqués |
| `NEXT_PUBLIC_FACEBOOK_URL` | rien à saisir : `https://www.facebook.com/taverneeternelle` est déjà la valeur par défaut |
| `NEXT_PUBLIC_CONTACT_EMAIL` | rien à saisir si `contact@taverne-eternelle.fr` vous convient |

Les variables `NEXT_PUBLIC_…` s'affichent au déploiement suivant.

### 2.7 Moteurs de recherche

Voir `INSTALLATION.md`, étape 11.
- Google : propriété *Domaine*, validée par un enregistrement TXT chez Gandi, ou variable `GOOGLE_SITE_VERIFICATION`.
- Bing : déjà validé par le site (balise et fichier), rien à saisir.

---

## Récapitulatif

| Connecteur | Variables chez Scalingo | Contrôle |
|---|---|---|
| Facebook et Reels | `FACEBOOK_PAGE_ID`, `FACEBOOK_PAGE_TOKEN` | `/admin/reseaux/` |
| Instagram | aucune (jeton de Page) | `/admin/reseaux/` |
| TikTok | `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET` (+ `TIKTOK_MODE`) | `/admin/reseaux/`, bouton « Relier » |
| Lettre et comptes | `BREVO_API_KEY`, `BREVO_LISTE_ID`, `BREVO_MODELE_DOI`, `BREVO_EXPEDITEUR` (+ `BREVO_LISTE_ID_EN`, `BREVO_MODELE_DOI_EN` pour l'édition anglaise) | inscription test sur `/lettre/` et `/en/newsletter/` |
| Rédaction IA | `ANTHROPIC_API_KEY` | `npm run veille:quotidien` |
| Discord | `NEXT_PUBLIC_DISCORD_URL` | bouton Discord sur `/communaute/` |
| Google | `GOOGLE_SITE_VERIFICATION` (ou TXT chez Gandi) | Search Console |
