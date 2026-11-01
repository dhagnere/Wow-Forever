# Azeroth Forever — consignes pour Claude Code

Site de fans francophone non officiel consacré à World of Warcraft: Forever. Next.js 16 (App Router), PostgreSQL, hébergé chez Scalingo. Les articles sont signés Silfax.

## Organisation

| Dossier | Rôle | Liberté |
|---|---|---|
| `app/(site)/`, `components/`, `app/globals.css`, `content/` | Pages publiques, habillage, contenu des pages piliers | Libre |
| `app/admin/` | Espace de relecture `/admin/veille` | Libre sur l'ergonomie, garde-fous intacts |
| `modules/veille/` | Collecte, classement, rédaction IA, articles, relais Facebook, sessions | Module cloisonné |
| `config/sources.ts` | Sources surveillées | Libre |
| `config/taxonomie.ts` | Rubriques et pages piliers | Ajouter librement ; ne pas renommer un slug déjà publié |

## Limites du module

- Les pages (`app/`, `components/`, `lib/`, `proxy.ts`) n'importent **que** `@/modules/veille` (fichier `modules/veille/index.ts`). Jamais un fichier interne du module. Un besoin nouveau = un export de plus dans `index.ts`.
- Le module n'importe rien de `app/` ni de `components/`. Il peut lire `config/`.
- Seul `db/schema.sql` modifie la structure de la base. Il doit rester idempotent (`IF NOT EXISTS`) : il est rejoué à chaque déploiement.

## Garde-fous à ne jamais affaiblir

1. **Avis obligatoire.** Aucun article ne se publie sans « L'avis de Silfax » rédigé (80 caractères minimum, sans texte à remplacer entre crochets). La règle est appliquée deux fois : `articles/publication.ts` et la contrainte `avis_obligatoire` de la base. Ne pas retirer, assouplir ni contourner l'une ou l'autre, ni publier par une requête SQL directe. L'IA peut proposer un avis (`avis_propose`, affiché dans l'éditeur) ; il n'entre dans `avis_silfax` que par un clic de Silfax. Ne jamais remplir `avis_silfax` automatiquement.
2. **Filtrage du HTML.** Tout contenu affiché passe par `markdownVersHtml` / `nettoyerHtml` (`rendu/html.ts`). Pas de `dangerouslySetInnerHTML` sur du contenu non filtré. Seules les vidéos YouTube sont intégrables.
3. **Accès réservé.** Tout `/admin` exige une session signée : `proxy.ts` à l'entrée, `exigerAdmin()` en tête de chaque page et de chaque action serveur. Une nouvelle page ou action d'administration appelle `exigerAdmin()`.
4. **Droit d'auteur.** Les consignes de rédaction (`redaction/consignes.ts`) imposent un article neuf, une seule citation courte, des sources créditées et aucune image copiée. Le ton peut être ajusté ; ces règles, non. Une image ne s'envoie qu'avec la case de déclaration des droits cochée, et passe toujours par `enregistrerImage` (réencodage, métadonnées retirées). Une image d'en-tête exige sa description.
5. **Les réseaux suivent le site.** Le relais (Facebook, Reels, Instagram, TikTok) ne publie que des articles déjà en ligne, avec un lien ou un renvoi vers le site (jamais vers la source), entre 8h et 22h (Paris), trois publications par heure et par réseau au plus. Les jetons d'accès restent en base ou dans les variables d'environnement, jamais affichés ni journalisés. Tout texte destiné à un réseau social passe par `texteReseau` (`reseaux/textes.ts`), qui ajoute la phrase d'appel unique de `config/reseaux.ts` : ne pas la dupliquer ni la contourner.

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
npm run icones:generer   # régénère content/icones-classes.ts (game-icons.net, CC BY 3.0 : garder le crédit des mentions légales)
```

Avant tout envoi : `npm run lint && npm test && npm run build`.

## Style

Textes du site en français, ton direct et chaleureux, sans formules creuses. Les informations non confirmées restent entre crochets (`[À compléter]`) plutôt qu'inventées.
