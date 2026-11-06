# La Lettre et les messages du site, pas à pas (Resend)

Le site gère lui-même la Lettre ; Resend ne sert qu'à **remettre les messages** :

1. **l'inscription**, en double validation : l'adresse attend dans la base du site, un lien de confirmation part par Resend, et l'abonné n'est inscrit qu'après son clic (`/lettre/confirmation/`, `/en/newsletter/confirm/`) ;
2. **la Lettre du dimanche**, écrite dans `/admin/lettre` et envoyée par lots toutes les 15 minutes (`npm run veille:lettre`, tâche de `cron.json`) ;
3. **le message « mot de passe oublié »** des comptes joueurs.

Les adresses restent dans la base du site, chez Scalingo. Une désinscription efface l'adresse ; une inscription jamais confirmée est effacée au bout de sept jours. Chaque Lettre porte un lien de désinscription et l'en-tête de désinscription en un clic que Gmail et Yahoo exigent.

**Variables à saisir chez Scalingo :**

| Variable | Contenu |
|---|---|
| `RESEND_API_KEY` | clé d'API Resend (droit « Sending access ») |
| `COURRIEL_EXPEDITEUR` | `lettre@taverne-eternelle.fr` (une adresse du domaine vérifié chez Resend) |
| `COURRIEL_REPONSE` | facultatif : `contact@taverne-eternelle.fr`, où arrivent les réponses |
| `LETTRE_PLAFOND_JOUR` | facultatif : messages de Lettre par jour, 80 par défaut |

Sans les deux premières, les formulaires d'inscription annoncent une ouverture prochaine, sans erreur, et la page « mot de passe oublié » invite à écrire à la Taverne. `SESSION_SECRET`, déjà en place, signe les liens de désinscription.

**Offre gratuite de Resend** : de l'ordre de 3 000 messages par mois et 100 par jour (à vérifier sur la page des tarifs au moment de l'inscription). Le plafond de 80 messages de Lettre par jour laisse la place aux confirmations et aux mots de passe. Au-delà de 80 abonnés, la Lettre part sur plusieurs jours : relever `LETTRE_PLAFOND_JOUR` après un passage à l'offre payante.

---

## Étape 1 — Compte Resend

1. Créer un compte sur resend.com, avec l'adresse que vous consultez vraiment.
2. Activer la double authentification (*Settings* → *Security*).

## Étape 2 — Domaine (Resend et Gandi)

Sans cette étape, Resend refuse d'envoyer depuis `@taverne-eternelle.fr`.

1. Resend → **Domains** → *Add domain* → `taverne-eternelle.fr`. Si Resend propose une région, choisir l'Europe (Irlande).
2. Resend affiche trois ou quatre enregistrements : un **MX** et un **TXT** (SPF) sur un sous-domaine d'envoi (souvent `send`), un **TXT** DKIM (`resend._domainkey`).
3. Les créer chez Gandi (*Domaines* → `taverne-eternelle.fr` → *Enregistrements DNS*). Gandi ajoute seul `.taverne-eternelle.fr` : saisir `send` ou `resend._domainkey`, pas le nom complet. Ces enregistrements visent un sous-domaine : ils ne touchent pas à la messagerie `contact@`.
4. Ajouter, s'il n'existe pas déjà, un **DMARC** : TXT, nom `_dmarc`, valeur `v=DMARC1; p=none;`.
5. Revenir dans Resend et cliquer sur **Verify**. La propagation DNS peut prendre de quelques minutes à quelques heures.

## Étape 3 — Clé d'API

1. Resend → **API Keys** → *Create API key*, droit **Sending access**, limité au domaine `taverne-eternelle.fr`.
2. La copier tout de suite (Resend ne la réaffiche pas) et la saisir directement chez Scalingo, sans la coller dans un message ni un document.
3. En cas de doute (fuite, activité inconnue) : supprimer la clé chez Resend, en créer une autre, la remplacer chez Scalingo.

## Étape 4 — Variables Scalingo

```bash
scalingo --region osc-fr1 --app wowforever env-set RESEND_API_KEY=… COURRIEL_EXPEDITEUR=lettre@taverne-eternelle.fr COURRIEL_REPONSE=contact@taverne-eternelle.fr
```

Puis retirer les anciennes variables Brevo, qui ne servent plus :

```bash
scalingo --region osc-fr1 --app wowforever env-unset BREVO_API_KEY BREVO_LISTE_ID BREVO_MODELE_DOI BREVO_LISTE_ID_EN BREVO_MODELE_DOI_EN BREVO_EXPEDITEUR
```

Le déploiement suivant crée les tables de la Lettre (`npm run db:migrate`, lancé seul après chaque déploiement).

## Étape 5 — Reprendre les abonnés de Brevo

1. Brevo → *Contacts* → choisir la liste française → *Exporter* (CSV).
2. `/admin/lettre` → **Reprendre des abonnés** : édition *Française*, coller le contenu du fichier (seules les adresses sont lues), cocher la case de consentement, *Importer*.
3. Recommencer avec la liste anglaise, édition *Anglaise*.

N'importer que des personnes qui ont confirmé leur inscription : elles ne reçoivent pas de nouveau message de confirmation. Une fois l'import vérifié, le compte Brevo peut être fermé.

## Étape 6 — Essayer chaque parcours

Avec une adresse à vous, de préférence chez Gmail :

1. **Lettre en français** : `/lettre/`, s'inscrire. Le message de confirmation arrive ; son bouton mène à `/lettre/confirmation/`, puis à `/lettre/merci/` après le clic sur « Confirmer mon inscription ».
2. **Newsletter en anglais** : `/en/newsletter/`. Même parcours, en anglais, jusqu'à `/en/newsletter/thanks/`.
3. **Compte joueur** : créer un compte sur `/compte/` en cochant la case de la Lettre : le message de confirmation arrive.
4. **Mot de passe oublié** : `/compte/oubli/`. Un lien valable une heure arrive.
5. **Essai de Lettre** : `/admin/lettre`, écrire un brouillon, *Envoyer un essai* à votre adresse.
6. **Désinscription** : le lien en bas d'une Lettre mène à `/lettre/desinscription/`, puis efface l'adresse. Depuis *Mon compte*, « Ne plus recevoir la Lettre » fait de même.

**Si rien n'arrive :**
- Vérifier les variables chez Scalingo et que le domaine est **Verified** chez Resend.
- Lire le journal de l'application : le site y note le code de réponse de Resend (`[courriel] Resend a répondu 403`), jamais l'adresse du destinataire. 401/403 : clé ou domaine ; 422 : adresse d'expéditeur hors du domaine vérifié ; 429 : quota atteint.
- Resend → **Emails** liste chaque message, avec son état (remis, refusé, en indésirables).

## Étape 7 — Envoyer la Lettre chaque dimanche

1. `/admin/lettre` → **Nouvelle Lettre** : édition française, sujet (« La Lettre de la Taverne — semaine du … »), texte en Markdown, dans l'ordre promis par `/lettre/` :
   - le billet de Jobwow ;
   - les cinq nouvelles de la semaine, chacune avec son lien vers l'article du site ;
   - le tuyau ;
   - la prochaine date du calendrier.
2. *Enregistrer* : l'aperçu s'affiche sous le formulaire.
3. *Envoyer un essai* à votre adresse, relire dans la messagerie.
4. Cocher « J'ai relu l'essai », puis **Lancer l'envoi aux abonnés** le dimanche vers 10 h : les messages partent au passage suivant de la tâche (15 minutes au plus), par lots de 50. La colonne *Envois* suit la progression.
5. **Édition anglaise** : nouvelle Lettre, édition *Anglaise*, texte traduit, liens vers les articles anglais (`/en/articles/<adresse>/`). Même essai, même lancement.

Un numéro lancé ne se modifie plus. Un message refusé trois fois par Resend n'est plus retenté ; il apparaît « en échec ».

---

## Récapitulatif

| Où | Quoi | Résultat |
|---|---|---|
| Resend | compte, domaine `taverne-eternelle.fr` vérifié | envoi autorisé depuis `@taverne-eternelle.fr` |
| Gandi | enregistrements Resend (MX, SPF, DKIM) et DMARC | messages délivrés, pas d'indésirables |
| Resend | clé d'API « Sending access » | `RESEND_API_KEY` |
| Scalingo | `RESEND_API_KEY`, `COURRIEL_EXPEDITEUR`, `COURRIEL_REPONSE` ; variables `BREVO_*` retirées | inscriptions, Lettre et « mot de passe oublié » actifs |
| `/admin/lettre` | import des abonnés Brevo, puis une Lettre par dimanche et par langue | la Lettre part par lots |
