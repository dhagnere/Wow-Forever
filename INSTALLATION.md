# Mise en ligne de la Taverne Éternelle : Scalingo et Gandi

Procédure complète pour le site **https://www.taverne-eternelle.fr**, hébergé chez Scalingo (application `wowforever`, région Paris `osc-fr1`), nom de domaine enregistré chez Gandi. L'adresse principale est celle avec `www` ; `taverne-eternelle.fr` sans `www` et l'ancien domaine `azeroth-forever.fr` y renvoient automatiquement.

Ordre à respecter : l'application d'abord, puis le domaine (Scalingo, puis Gandi), puis le certificat, et seulement ensuite la variable `SITE_URL`. Changer `SITE_URL` trop tôt enverrait les liens (Facebook, Lettre, plan du site) vers une adresse qui ne répond pas encore.

Dans les commandes ci-dessous, la région est précisée à chaque fois (`--region osc-fr1`). Si l'outil Scalingo est déjà réglé sur cette région, elle peut être omise.

---

## Étape 1 — Préparer les outils

1. Un compte Scalingo, avec un moyen de paiement enregistré.
2. L'outil en ligne de commande Scalingo, installé puis connecté :
   ```bash
   scalingo login
   ```
3. Le dépôt GitHub `dhagnere/Wow-Forever`, relié au compte Scalingo (tableau de bord Scalingo, *Integrations* → GitHub).
4. Le domaine `taverne-eternelle.fr` chez Gandi, et un accès à son espace client.

---

## Étape 2 — Créer l'application et sa base (Scalingo)

> Déjà fait si `wowforever` existe : passer à l'étape 3.

1. Créer l'application dans la région Paris :
   ```bash
   scalingo --region osc-fr1 create wowforever
   ```
2. Ajouter l'extension **PostgreSQL** depuis le tableau de bord (application → *Addons* → *Add an addon* → PostgreSQL), avec l'offre voulue. Scalingo fournit seul la variable `SCALINGO_POSTGRESQL_URL`, que le site lit.
3. Relier le dépôt : application → *Deploy* → *Configuration* → GitHub, dépôt `dhagnere/Wow-Forever`, branche à déployer. Activer le déploiement automatique : chaque envoi sur cette branche met le site à jour.
4. Rien à faire pour la base ni pour les tâches planifiées :
   - le `Procfile` lance `npm run db:migrate` après chaque déploiement (création et mise à jour des tables) ;
   - `cron.json` déclare les quatre tâches (veille du matin, relais des réseaux et traduction anglaise des articles chaque heure, import des objets chaque nuit).

---

## Étape 3 — Saisir les variables d'environnement (Scalingo)

Tableau de bord → application → *Environment*, ou en ligne de commande :

```bash
scalingo --region osc-fr1 --app wowforever env-set NOM=valeur
```

**Indispensables dès le premier déploiement**

| Variable | Valeur |
|---|---|
| `SITE_URL` | provisoirement `https://wowforever.osc-fr1.scalingo.io` ; passera à `https://www.taverne-eternelle.fr` à l'étape 8 |
| `ADMIN_PASSWORD` | mot de passe de `/admin`, 16 caractères au moins |
| `SESSION_SECRET` | 64 caractères aléatoires (`openssl rand -hex 32`) |
| `STATS_SEL` | 32 caractères aléatoires (`openssl rand -hex 16`) |

**Selon les services utilisés** (détail de chaque variable dans `.env.example`)

| Service | Variables |
|---|---|
| Rédaction et traduction anglaise par IA | `ANTHROPIC_API_KEY` (fixer un plafond mensuel dans la console Anthropic) |
| Facebook, Reels | `FACEBOOK_PAGE_ID`, `FACEBOOK_PAGE_TOKEN` (Page `facebook.com/taverneeternelle`, déjà inscrite dans le site ; `NEXT_PUBLIC_FACEBOOK_URL` seulement si elle change d'adresse) |
| Instagram | `INSTAGRAM_TOKEN` (facultatif si le jeton de Page suffit) |
| TikTok | `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET` |
| Lettre et comptes joueurs (Brevo) | `BREVO_API_KEY`, `BREVO_LISTE_ID`, `BREVO_MODELE_DOI`, `BREVO_EXPEDITEUR` (étape 9) ; édition anglaise : `BREVO_LISTE_ID_EN`, `BREVO_MODELE_DOI_EN` |
| Moteurs de recherche | `GOOGLE_SITE_VERIFICATION` (étape 11) ; Bing : rien à saisir, la balise est déjà dans le site |
| Communauté | `NEXT_PUBLIC_DISCORD_URL`, `NEXT_PUBLIC_CONTACT_EMAIL` (par défaut `contact@taverne-eternelle.fr`) |

Après un changement de variable, Scalingo redémarre l'application. Les variables `NEXT_PUBLIC_…` sont lues à la compilation : relancer un déploiement pour qu'elles s'affichent (application → *Deploy* → *Manual deploy*).

---

## Étape 4 — Déclarer les domaines sur Scalingo

1. Ajouter les deux adresses à l'application :
   ```bash
   scalingo --region osc-fr1 --app wowforever domains-add www.taverne-eternelle.fr
   ```
   ```bash
   scalingo --region osc-fr1 --app wowforever domains-add taverne-eternelle.fr
   ```
   Au tableau de bord : *Settings* → *Public Routing* → *Custom Domains* → *Add a domain*.
2. Faire de l'adresse avec `www` le **domaine canonique**. Toute autre adresse rattachée à l'application y renvoie alors par une redirection permanente (301) :
   ```bash
   scalingo --region osc-fr1 --app wowforever set-canonical-domain www.taverne-eternelle.fr
   ```
   Au tableau de bord : l'étoile à côté de `www.taverne-eternelle.fr`, puis *Apply*.
3. Les certificats HTTPS se créent seuls (Let's Encrypt) dès que les adresses pointent vers Scalingo (étape 5). Jusque-là, leur statut reste *Pending DNS* : c'est normal.

---

## Étape 5 — Faire pointer le domaine vers Scalingo (Gandi)

Espace client Gandi → *Noms de domaine* → `taverne-eternelle.fr` → onglet **Enregistrements DNS**.

1. **Vérifier les serveurs de noms.** L'onglet *Serveurs de noms* doit indiquer **LiveDNS**. Avec les anciens serveurs « Classic », l'enregistrement ALIAS de l'étape 3 n'existe pas.
2. **Supprimer les enregistrements de parking** que Gandi crée par défaut :
   - les enregistrements `@` de type **A** et **AAAA** ;
   - l'enregistrement `www` (CNAME ou A).

   Ne pas toucher aux enregistrements **MX**, ni aux **TXT** de la messagerie (SPF), s'il y en a.
3. **Ajouter les deux enregistrements suivants**, avec le point final :

   | Nom | Type | TTL | Valeur |
   |---|---|---|---|
   | `www` | CNAME | 10800 | `wowforever.osc-fr1.scalingo.io.` |
   | `@` | ALIAS | 10800 | `wowforever.osc-fr1.scalingo.io.` |

   **Si DNSSEC est activé sur le domaine** (onglet *DNSSEC*) : Gandi indique qu'un ALIAS sur `@` est incompatible avec DNSSEC. Deux solutions :
   - désactiver DNSSEC ;
   - ou remplacer l'ALIAS par les quatre adresses d'entrée de Scalingo (région osc-fr1), en quatre enregistrements de type **A** sur `@` : `5.104.101.30`, `109.232.236.90`, `109.232.233.130` et `148.253.75.120`.

   Scalingo déconseille les enregistrements A, car ces adresses peuvent changer. L'hébergeur prévient au moins 30 jours avant ; il faudra alors mettre la zone à jour soi-même. L'adresse avec `www`, en CNAME, n'est pas concernée.
4. Attendre la propagation (de quelques minutes à quelques heures), puis vérifier :
   ```bash
   dig +short www.taverne-eternelle.fr
   ```
   ```bash
   dig +short taverne-eternelle.fr
   ```
   La première commande doit afficher `wowforever.osc-fr1.scalingo.io.` suivi d'adresses IP, la seconde des adresses IP.

---

## Étape 6 — Vérifier le certificat et forcer le HTTPS (Scalingo)

1. *Settings* → *Public Routing* : les deux domaines passent à **In use**. Scalingo vérifie toutes les 60 secondes ; compter quelques minutes après la propagation.
2. Ouvrir `https://www.taverne-eternelle.fr` : le site doit s'afficher avec le cadenas. Ouvrir ensuite `https://taverne-eternelle.fr` : l'adresse doit basculer sur `www`.
3. Une fois les deux adresses fonctionnelles en HTTPS, forcer le HTTPS :
   ```bash
   scalingo --region osc-fr1 --app wowforever force-https
   ```
   Toute adresse en `http://` renvoie alors vers `https://`, et les navigateurs retiennent la consigne un an (HSTS). Ne l'activer qu'une fois le HTTPS en état de marche.

---

## Étape 7 — Garder l'ancien domaine `azeroth-forever.fr` (si vous le possédez encore)

Les liens déjà partagés, les favoris et les résultats de Google continuent ainsi de fonctionner.

1. Dans Scalingo, rattacher l'ancien domaine à l'application :
   ```bash
   scalingo --region osc-fr1 --app wowforever domains-add www.azeroth-forever.fr
   ```
   ```bash
   scalingo --region osc-fr1 --app wowforever domains-add azeroth-forever.fr
   ```
2. Chez son registraire, mêmes enregistrements qu'à l'étape 5 : `www` en CNAME et `@` en ALIAS (ou en A), vers `wowforever.osc-fr1.scalingo.io.`
3. Le domaine canonique (étape 4) fait le reste : chaque page de l'ancien domaine renvoie par une 301 vers la même page sur `www.taverne-eternelle.fr`.
4. Garder l'ancien domaine au moins un an, le temps que les moteurs de recherche transfèrent le référencement.

---

## Étape 8 — Basculer le site sur sa nouvelle adresse

1. Changer la variable `SITE_URL` (sans barre finale) :
   ```bash
   scalingo --region osc-fr1 --app wowforever env-set SITE_URL=https://www.taverne-eternelle.fr
   ```
2. Le site suit seul, sans modification du code :
   - liens publiés sur Facebook, Instagram et TikTok ;
   - phrase d'appel « …retrouve tous nos guides sur taverne-eternelle.fr » ;
   - plan du site et `robots.txt` ;
   - balises de partage (Open Graph) ;
   - agenda `.ics` ;
   - liens de la Lettre et du mot de passe oublié.
3. Remettre au propre les liens d'articles déjà publiés :
   ```bash
   scalingo --region osc-fr1 --app wowforever run npm run veille:liens
   ```

---

## Étape 9 — Messagerie et envois Brevo (Gandi et Brevo)

1. **Adresse de contact** `contact@taverne-eternelle.fr` : créer la boîte, ou une redirection vers votre messagerie, chez Gandi (*Boîtes e-mail* du domaine) ou chez le fournisseur de votre choix. Les enregistrements **MX** et le **SPF** (TXT) correspondants s'ajoutent dans la zone Gandi.
2. **Authentifier le domaine dans Brevo**, pour que la Lettre et les messages « mot de passe oublié » n'arrivent pas en indésirables :
   - Brevo → *Expéditeurs, domaines et IP dédiées* → *Domaines* → ajouter `taverne-eternelle.fr` ;
   - Brevo fournit trois sortes d'enregistrements : code de vérification Brevo (TXT), DKIM et DMARC ;
   - les copier un par un dans la zone Gandi (onglet *Enregistrements DNS*), tels quels ;
   - revenir dans Brevo et cliquer sur *Authentifier*.
3. Créer l'expéditeur `contact@taverne-eternelle.fr` dans Brevo, puis le saisir dans Scalingo :
   ```bash
   scalingo --region osc-fr1 --app wowforever env-set BREVO_EXPEDITEUR=contact@taverne-eternelle.fr
   ```
4. Rien à changer dans le modèle de double validation de la Lettre : l'adresse de retour (`/lettre/merci/`) est envoyée par le site à partir de `SITE_URL`.

---

## Étape 10 — Mettre à jour les services reliés au site

| Service | Où | Quoi |
|---|---|---|
| Page Facebook `facebook.com/taverneeternelle` | Paramètres de la Page → *Informations* | Site web : `https://www.taverne-eternelle.fr` |
| Application Meta | developers.facebook.com → application → *Paramètres* → *Général* | Domaines de l'application : `taverne-eternelle.fr` ; URL de la politique de confidentialité : `https://www.taverne-eternelle.fr/confidentialite/` |
| Instagram | Profil → *Modifier le profil* | Lien : `https://www.taverne-eternelle.fr` |
| TikTok | developers.tiktok.com → application → *Login Kit* | Redirect URI : `https://www.taverne-eternelle.fr/reseaux/tiktok/retour/` ; puis relier à nouveau le compte depuis `/admin/reseaux/` |
| Google Tag Manager / Analytics | Flux de données Web | URL du site : `https://www.taverne-eternelle.fr` |
| Discord, profils, signatures | — | Remplacer l'ancien lien |

Vérifier ensuite l'aperçu d'un article avec le *Débogueur de partage* de Meta (developers.facebook.com/tools/debug) et cliquer sur « Récupérer à nouveau ».

---

## Étape 11 — Moteurs de recherche

**Google Search Console**
1. Ajouter une propriété **Domaine** `taverne-eternelle.fr`. Google donne un enregistrement TXT ; l'ajouter sur `@` dans la zone Gandi, puis *Valider*. Cette propriété couvre `www`, le domaine sans `www`, HTTP et HTTPS. À défaut, utiliser une propriété **Préfixe de l'URL** `https://www.taverne-eternelle.fr/` avec la méthode *Balise HTML* : copier la seule valeur de `content="…"` dans `GOOGLE_SITE_VERIFICATION`, attendre le redémarrage, puis *Valider*.
2. *Sitemaps* → envoyer `https://www.taverne-eternelle.fr/sitemap.xml`, puis `https://www.taverne-eternelle.fr/sitemap-actualites.xml`.
3. Si l'ancien domaine avait une propriété : l'ouvrir → *Paramètres* → **Changement d'adresse** → choisir `taverne-eternelle.fr`. L'outil exige que les redirections 301 de l'étape 7 fonctionnent.

**Bing Webmaster Tools**
1. Ajouter le site `https://www.taverne-eternelle.fr`. La validation est déjà en place de deux façons : la balise `msvalidate.01` dans chaque page et le fichier `https://www.taverne-eternelle.fr/BingSiteAuth.xml`. Choisir l'une des deux, puis *Vérifier*.
2. *Sitemaps* → envoyer `https://www.taverne-eternelle.fr/sitemap.xml`.
3. Si l'ancien domaine était déclaré : *Outils* → **Déplacement de site**, vers le nouveau domaine.

Bing peut aussi importer les sites et sitemaps directement depuis Google Search Console.

---

## Étape 12 — Remplir et lancer le site

À faire une fois, après le premier déploiement réussi :

1. Base d'objets, noms anglais et icônes compris (5 minutes environ) :
   ```bash
   scalingo --region osc-fr1 --app wowforever run "npm run base:importer -- --forcer --icones"
   ```
2. Vérifier les flux surveillés ; corriger ou retirer dans `config/sources.ts` ceux qui échouent :
   ```bash
   scalingo --region osc-fr1 --app wowforever run npm run veille:sources
   ```
3. Classement du jour, sans coût d'API :
   ```bash
   scalingo --region osc-fr1 --app wowforever run npm run veille:essai
   ```
4. Premier passage complet, puis relecture dans `/admin/veille` :
   ```bash
   scalingo --region osc-fr1 --app wowforever run npm run veille:quotidien
   ```

Ensuite, les tâches de `cron.json` tournent seules. Le planificateur de Scalingo est en heure UTC : la veille de 5 h 37 UTC tombe à 6 h 37 à Paris en hiver, 7 h 37 en été.

---

## Étape 13 — Contrôle final

- [ ] `https://www.taverne-eternelle.fr` s'ouvre avec le cadenas.
- [ ] `http://taverne-eternelle.fr`, `https://taverne-eternelle.fr` et l'ancien domaine renvoient vers `https://www.taverne-eternelle.fr`, à la même page.
- [ ] `https://www.taverne-eternelle.fr/robots.txt` annonce `Sitemap: https://www.taverne-eternelle.fr/sitemap.xml`.
- [ ] `https://www.taverne-eternelle.fr/sitemap.xml` liste des adresses en `https://www.taverne-eternelle.fr/…`.
- [ ] `/admin/veille` demande le mot de passe et l'accepte.
- [ ] Une inscription test à la Lettre reçoit bien le message de confirmation, hors des indésirables.
- [ ] La création d'un compte joueur et le lien « mot de passe oublié » fonctionnent.
- [ ] Le partage d'un article sur Facebook affiche l'image et le lien vers `taverne-eternelle.fr`.
- [ ] Google Search Console et Bing Webmaster Tools indiquent le site validé et le sitemap lu.
