# Brevo : la Lettre et les messages du site, pas à pas

Brevo sert à trois choses sur la Taverne :

1. **l'inscription à la Lettre**, en double validation : le site demande à Brevo d'envoyer un message de confirmation, et l'abonné n'entre dans la liste qu'après son clic ;
2. **la Lettre du dimanche** elle-même, écrite et envoyée depuis Brevo (le site ne la rédige pas) ;
3. **le message « mot de passe oublié »** des comptes joueurs (envoi transactionnel).

Le site ne garde aucune adresse d'abonné : elles restent chez Brevo.

**Ordre à suivre :** domaine (étapes 1 à 3), listes et modèles (4 à 6), clé d'API (7), variables Scalingo (8), essais (9), puis la Lettre de chaque dimanche (10).

**Variables saisies à la fin chez Scalingo :**

| Variable | Contenu |
|---|---|
| `BREVO_API_KEY` | clé d'API Brevo |
| `BREVO_LISTE_ID` | numéro de la liste française |
| `BREVO_MODELE_DOI` | numéro du modèle de confirmation français |
| `BREVO_LISTE_ID_EN` | numéro de la liste anglaise (facultatif) |
| `BREVO_MODELE_DOI_EN` | numéro du modèle de confirmation anglais (facultatif) |
| `BREVO_EXPEDITEUR` | `contact@taverne-eternelle.fr` |

Sans les trois premières, les formulaires d'inscription annoncent une ouverture prochaine, sans erreur. Sans `BREVO_EXPEDITEUR`, la page « mot de passe oublié » invite à écrire à la Taverne.

Les intitulés des menus Brevo changent de temps en temps : en cas d'écart, chercher l'intitulé le plus proche.

---

## Étape 1 — Créer le compte

1. Créer un compte sur brevo.com, avec l'adresse que vous consultez vraiment. Les alertes de sécurité y arriveront.
2. Renseigner le profil de l'entreprise : nom *La Taverne Éternelle*, site `https://www.taverne-eternelle.fr`. L'adresse postale demandée apparaît en pied de chaque Lettre, comme l'exige la réglementation : indiquer une adresse où vous acceptez de recevoir du courrier.
3. Activer la **double authentification** du compte (*Mon profil* → *Sécurité*).

L'offre gratuite suffit pour démarrer ; elle limite le nombre d'envois par jour.

---

## Étape 2 — Adresse de contact

L'adresse `contact@taverne-eternelle.fr` doit exister avant de devenir expéditeur : Brevo y envoie un code de vérification, et les abonnés peuvent y répondre.

Créer la boîte, ou une redirection vers votre messagerie habituelle, chez Gandi (*Boîtes e-mail* du domaine) ou chez un autre fournisseur. Les enregistrements **MX** et **SPF** de ce fournisseur s'ajoutent dans la zone DNS chez Gandi.

---

## Étape 3 — Authentifier le domaine (Brevo et Gandi)

Sans cette étape, la Lettre et les messages du site risquent d'arriver en indésirables, ou d'être refusés par Gmail et Yahoo.

1. Brevo → *Expéditeurs, domaines et IP dédiées* → onglet **Domaines** → *Ajouter un domaine* → `taverne-eternelle.fr`.
2. Brevo affiche les enregistrements à créer, en général :
   - un **TXT** de vérification (`brevo-code:…`) ;
   - un ou deux enregistrements **DKIM** (CNAME ou TXT, selon ce que Brevo affiche) ;
   - un **TXT DMARC** sur `_dmarc`, si le domaine n'en a pas encore.
3. Dans un autre onglet : espace client Gandi → *Noms de domaine* → `taverne-eternelle.fr` → *Enregistrements DNS* → *Ajouter un enregistrement*. Recopier chaque enregistrement tel quel, type, nom et valeur.
   - **Nom** : Gandi ajoute seul `.taverne-eternelle.fr`. Si Brevo donne `mail._domainkey.taverne-eternelle.fr`, saisir seulement `mail._domainkey`.
   - **Déjà un SPF ?** S'il existe déjà un enregistrement TXT qui commence par `v=spf1` (messagerie de l'étape 2), ne pas en créer un second. Si Brevo demande un SPF, ajouter son `include:` à l'enregistrement existant.
   - **Ne rien supprimer** : les enregistrements du site (CNAME `www`, ALIAS `@`) et ceux de la messagerie (MX) restent tels quels.
4. Revenir dans Brevo et cliquer sur **Authentifier ce domaine**. La propagation DNS peut prendre de quelques minutes à quelques heures : réessayer plus tard si un enregistrement apparaît encore en rouge.

---

## Étape 4 — Créer l'expéditeur

1. *Expéditeurs, domaines et IP dédiées* → onglet **Expéditeurs** → *Ajouter un expéditeur*.
2. Nom : **La Taverne Éternelle**. Adresse : `contact@taverne-eternelle.fr`.
3. Valider avec le code que Brevo envoie à cette adresse.

C'est l'adresse qui figurera dans `BREVO_EXPEDITEUR`. Elle signe les messages « mot de passe oublié », les confirmations d'inscription et la Lettre.

---

## Étape 5 — Créer les listes

*Contacts* → **Listes** → *Créer une liste*.

| Liste | Usage | Variable |
|---|---|---|
| **Lettre de la Taverne** | inscrits de `/lettre/` et des comptes joueurs français | `BREVO_LISTE_ID` |
| **Tavern newsletter (English)** | inscrits de `/en/newsletter/` et des comptes anglais | `BREVO_LISTE_ID_EN` |

Le **numéro** de chaque liste figure dans la colonne *ID* du tableau des listes, ou dans l'adresse de la page quand la liste est ouverte. Le noter.

La liste anglaise est facultative. Sans elle, les inscrits de la page anglaise rejoignent la liste française, et la page l'annonce.

---

## Étape 6 — Créer les modèles de confirmation (double opt-in)

Le site demande à Brevo d'envoyer ce modèle à chaque nouvelle inscription. Il ne fonctionne que s'il est un vrai modèle de double confirmation.

1. *Campagnes* (ou *Marketing*) → **Modèles** → *Nouveau modèle*. Partir du modèle **Double opt-in** proposé par Brevo s'il apparaît : les réglages ci-dessous y sont déjà.
2. Paramètres :
   - **nom du modèle** : *Confirmation Lettre (FR)* ;
   - **expéditeur** : La Taverne Éternelle, `contact@taverne-eternelle.fr` ;
   - **objet** : `Confirmez votre inscription à la Lettre de la Taverne` ;
   - **étiquette** (*tag*) du modèle : `optin`. Brevo s'en sert pour reconnaître un modèle de double confirmation.
3. Contenu, par exemple :

   > Bonjour,
   >
   > Vous avez demandé à recevoir la Lettre de la Taverne Éternelle : chaque dimanche à 10 h, le billet de Jobwow, les cinq nouvelles de WoW Forever à retenir et un tuyau de jeu.
   >
   > **[ Je confirme mon inscription ]**
   >
   > Si vous n'êtes pas à l'origine de cette demande, ignorez ce message : vous ne recevrez rien.
   >
   > Jobwow, de la Taverne Éternelle

4. **Lien du bouton** : saisir exactement `{{ doubleoptin }}`. C'est ce lien qui confirme l'inscription ; sans lui, personne n'entre dans la liste.
5. Ne rien saisir comme adresse de retour : le site envoie lui-même la page d'arrivée (`/lettre/merci/`, ou `/en/newsletter/thanks/` pour l'anglais).
6. Enregistrer, puis **activer** le modèle. Son **numéro** (colonne *ID*, ou dans l'adresse de la page d'édition) donne `BREVO_MODELE_DOI`.
7. Recommencer pour l'anglais, numéro dans `BREVO_MODELE_DOI_EN` :
   - nom : *Confirmation newsletter (EN)* ;
   - objet : `Confirm your subscription to the Tavern's newsletter` ;
   - bouton : **[ Confirm my subscription ]**, lien `{{ doubleoptin }}` ;
   - texte : la traduction du message français.

---

## Étape 7 — Créer la clé d'API

1. Menu du compte → **SMTP et API** → onglet **Clés API** → *Générer une nouvelle clé API*. Nom : `site-taverne-eternelle`.
2. Copier la clé tout de suite : Brevo ne la réaffiche plus. La saisir directement chez Scalingo (étape 8), sans la coller dans un message, un document ou un ticket.
3. **Adresses IP autorisées.** Brevo bloque les appels d'API venant d'une adresse IP inconnue, et passe seul en mode blocage après 30 jours sans nouvelle adresse. Pour que le site ne soit jamais bloqué :
   - menu du compte → *Sécurité* → **IP autorisées** ;
   - ajouter les deux adresses de sortie de Scalingo (région osc-fr1) : `171.33.105.206` et `171.33.92.211`.

   Ces adresses peuvent changer : la liste à jour se lit à l'adresse `egress.osc-fr1.scalingo.com`. Si Brevo envoie un jour un courriel « adresse IP bloquée » qui cite une adresse Scalingo, l'autoriser depuis ce courriel.
4. En cas de doute sur une clé (fuite, activité inconnue) : la supprimer dans Brevo, en créer une nouvelle, puis la remplacer chez Scalingo.

---

## Étape 8 — Saisir les variables chez Scalingo

En ligne de commande, une variable par commande ou toutes ensemble :

```bash
scalingo --region osc-fr1 --app wowforever env-set BREVO_API_KEY=… BREVO_LISTE_ID=… BREVO_MODELE_DOI=… BREVO_EXPEDITEUR=contact@taverne-eternelle.fr
```

Puis, pour l'édition anglaise :

```bash
scalingo --region osc-fr1 --app wowforever env-set BREVO_LISTE_ID_EN=… BREVO_MODELE_DOI_EN=…
```

Ou bien au tableau de bord : application → *Environment*. L'application redémarre seule après chaque changement.

---

## Étape 9 — Essayer chaque parcours

Avec une adresse à vous, de préférence chez un autre fournisseur que Gandi (Gmail, par exemple) :

1. **Lettre en français** : `https://www.taverne-eternelle.fr/lettre/`, s'inscrire.
   - La page « Vérifiez votre boîte de réception » s'affiche.
   - Le message de confirmation arrive, hors des indésirables.
   - Le bouton mène à `/lettre/merci/`.
   - L'adresse apparaît dans la liste *Lettre de la Taverne*.
2. **Newsletter en anglais** : `https://www.taverne-eternelle.fr/en/newsletter/`. Même parcours ; la confirmation est en anglais, l'arrivée se fait sur `/en/newsletter/thanks/`, l'adresse va dans la liste anglaise.
3. **Compte joueur** : créer un compte sur `/compte/` en cochant la case de la Lettre. Le message de confirmation doit arriver.
4. **Mot de passe oublié** : `/compte/oubli/`. Un message « Votre nouveau mot de passe pour la Taverne Éternelle » arrive, avec un lien valable une heure.
5. **Désinscription** : depuis *Mon compte* → « Ne plus recevoir la Lettre ». L'adresse quitte les deux listes.

**Si rien n'arrive :**
- Vérifier les quatre variables chez Scalingo.
- Vérifier que le modèle est actif, avec l'étiquette `optin` et le lien `{{ doubleoptin }}`.
- Vérifier que les adresses IP de Scalingo sont autorisées.
- Lire le journal de l'application : le site y note la réponse de Brevo (code d'erreur), jamais l'adresse de l'abonné.

---

## Étape 10 — Envoyer la Lettre chaque dimanche

1. *Campagnes* → *Créer une campagne* → *E-mail*.
2. **Destinataires** : la liste *Lettre de la Taverne*.
3. **Objet** : par exemple « La Lettre de la Taverne — semaine du … ». L'aperçu (*preheader*) peut reprendre la nouvelle principale.
4. **Contenu**, dans l'ordre que promet la page `/lettre/` :
   - le billet de Jobwow ;
   - les cinq nouvelles de la semaine, chacune avec son lien vers l'article du site ;
   - le tuyau ;
   - la prochaine date du calendrier.
5. **Liens vers le site** : dans les réglages de suivi de la campagne, activer le suivi Google Analytics avec `utm_source=lettre`. Les visites venues de la Lettre apparaissent alors à part dans `/admin/statistiques`.
6. **Pied de page** : garder le lien de désinscription et l'adresse que Brevo ajoutent d'office.
7. **Programmer** l'envoi le dimanche à 10 h, heure de Paris.
8. **Édition anglaise** :
   - dupliquer la campagne française et choisir la liste *Tavern newsletter (English)* ;
   - traduire le texte ;
   - faire pointer les liens vers les articles anglais (`/en/articles/<adresse>/`, même adresse que l'article français précédée de `/en`) ;
   - programmer le même envoi.

---

## Récapitulatif

| Où | Quoi | Résultat |
|---|---|---|
| Gandi | boîte ou redirection `contact@` ; enregistrements Brevo (TXT, DKIM, DMARC) | messages délivrés, pas d'indésirables |
| Brevo | domaine authentifié, expéditeur `contact@taverne-eternelle.fr` | — |
| Brevo | listes FR et EN | `BREVO_LISTE_ID`, `BREVO_LISTE_ID_EN` |
| Brevo | modèles de confirmation FR et EN (étiquette `optin`, bouton `{{ doubleoptin }}`) | `BREVO_MODELE_DOI`, `BREVO_MODELE_DOI_EN` |
| Brevo | clé d'API ; adresses IP de Scalingo autorisées | `BREVO_API_KEY` |
| Scalingo | les six variables | inscriptions et « mot de passe oublié » actifs |
| Brevo, chaque dimanche | campagne FR, puis sa copie traduite en EN | la Lettre part à 10 h |
