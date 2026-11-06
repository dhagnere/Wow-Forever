-- Schéma du module de veille. Idempotent : exécuté à chaque déploiement (npm run db:migrate).

CREATE TABLE IF NOT EXISTS articles (
  id                  SERIAL PRIMARY KEY,
  slug                TEXT NOT NULL UNIQUE,
  titre               TEXT NOT NULL,
  chapo               TEXT NOT NULL DEFAULT '',
  corps               TEXT NOT NULL DEFAULT '',
  avis_silfax         TEXT NOT NULL DEFAULT '',
  rubrique            TEXT NOT NULL,
  etiquettes          TEXT[] NOT NULL DEFAULT '{}',
  pilier              TEXT,
  description         TEXT NOT NULL DEFAULT '',
  accroche_facebook   TEXT NOT NULL DEFAULT '',
  texte_facebook      TEXT NOT NULL DEFAULT '',
  sources             JSONB NOT NULL DEFAULT '[]'::jsonb,
  statut              TEXT NOT NULL DEFAULT 'brouillon' CHECK (statut IN ('brouillon', 'publie', 'supprime')),
  score               REAL,
  origine             TEXT NOT NULL DEFAULT 'veille' CHECK (origine IN ('veille', 'manuel')),
  cree_le             TIMESTAMPTZ NOT NULL DEFAULT now(),
  modifie_le          TIMESTAMPTZ NOT NULL DEFAULT now(),
  publie_le           TIMESTAMPTZ,
  facebook_post_id    TEXT,
  facebook_publie_le  TIMESTAMPTZ,
  facebook_tentatives INTEGER NOT NULL DEFAULT 0,
  facebook_erreur     TEXT,
  -- Garde-fou : aucun article publié sans l'avis de Jobwow.
  CONSTRAINT avis_obligatoire CHECK (statut <> 'publie' OR length(btrim(avis_silfax)) > 0)
);

CREATE INDEX IF NOT EXISTS articles_statut_publie_le ON articles (statut, publie_le DESC);
CREATE INDEX IF NOT EXISTS articles_rubrique ON articles (rubrique);
CREATE INDEX IF NOT EXISTS articles_pilier ON articles (pilier);

-- Sujets déjà rédigés : évite de produire deux fois le même brouillon d'un jour à l'autre.
CREATE TABLE IF NOT EXISTS veille_sujets (
  cle         TEXT PRIMARY KEY,
  titre       TEXT NOT NULL,
  article_id  INTEGER REFERENCES articles(id) ON DELETE SET NULL,
  traite_le   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Revue complète de chaque passage : tous les sujets retenus, leur score et le détail.
CREATE TABLE IF NOT EXISTS veille_revues (
  id          SERIAL PRIMARY KEY,
  jour        DATE NOT NULL DEFAULT (now() AT TIME ZONE 'Europe/Paris')::date,
  cree_le     TIMESTAMPTZ NOT NULL DEFAULT now(),
  mode        TEXT NOT NULL CHECK (mode IN ('essai', 'quotidien')),
  bilan       JSONB NOT NULL,
  sujets      JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS veille_revues_jour ON veille_revues (jour DESC, cree_le DESC);

-- Images envoyées depuis l'espace de relecture (en-tête d'article, post Facebook).
CREATE TABLE IF NOT EXISTS medias (
  id          SERIAL PRIMARY KEY,
  largeur     INTEGER NOT NULL,
  hauteur     INTEGER NOT NULL,
  donnees     BYTEA NOT NULL,     -- en-tête, JPEG, 1600 px de large au plus
  donnees_og  BYTEA NOT NULL,     -- recadrage 1200 × 630 (Facebook, Google)
  cree_le     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE articles ADD COLUMN IF NOT EXISTS image_id INTEGER REFERENCES medias(id) ON DELETE SET NULL;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS image_alt TEXT NOT NULL DEFAULT '';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS image_credit TEXT NOT NULL DEFAULT '';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS image_facebook_id INTEGER REFERENCES medias(id) ON DELETE SET NULL;

-- Avis proposé par l'IA : une suggestion que Jobwow relit et reprend. L'avis publié reste avis_silfax.
ALTER TABLE articles ADD COLUMN IF NOT EXISTS avis_propose TEXT NOT NULL DEFAULT '';

-- Mode « dossier » (recherches de référence sur 60 jours). Contrainte recréée à chaque déploiement : idempotent.
ALTER TABLE veille_revues DROP CONSTRAINT IF EXISTS veille_revues_mode_check;
ALTER TABLE veille_revues ADD CONSTRAINT veille_revues_mode_check CHECK (mode IN ('essai', 'quotidien', 'dossier'));

-- Reels Facebook : vidéo verticale publiée après le post de chaque article.
ALTER TABLE articles ADD COLUMN IF NOT EXISTS facebook_reel_id TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS facebook_reel_le TIMESTAMPTZ;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS facebook_reel_tentatives INTEGER NOT NULL DEFAULT 0;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS facebook_reel_erreur TEXT;

-- Vidéo de Reel de chaque article, fabriquée une fois puis réutilisée (Facebook, Instagram, TikTok).
CREATE TABLE IF NOT EXISTS reels_videos (
  article_id  INTEGER PRIMARY KEY REFERENCES articles(id) ON DELETE CASCADE,
  donnees     BYTEA NOT NULL,
  cree_le     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Publication sur Instagram et TikTok.
ALTER TABLE articles ADD COLUMN IF NOT EXISTS instagram_media_id TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS instagram_le TIMESTAMPTZ;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS instagram_tentatives INTEGER NOT NULL DEFAULT 0;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS instagram_erreur TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS tiktok_publish_id TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS tiktok_le TIMESTAMPTZ;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS tiktok_tentatives INTEGER NOT NULL DEFAULT 0;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS tiktok_erreur TEXT;

-- Jetons d'accès des réseaux qui les renouvellent (TikTok : jeton de 24 h, renouvelable pendant un an).
CREATE TABLE IF NOT EXISTS jetons_reseaux (
  reseau                      TEXT PRIMARY KEY,
  compte                      TEXT,
  acces                       TEXT NOT NULL,
  rafraichissement            TEXT,
  expire_le                   TIMESTAMPTZ NOT NULL,
  rafraichissement_expire_le  TIMESTAMPTZ,
  modifie_le                  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Base d'objets de WoW Forever, importée des fichiers du jeu (wago.tools) par npm run base:importer.
-- Les tables sont vidées puis remplies à chaque nouvelle version du jeu ; les icônes, converties à la demande, restent en cache.
CREATE TABLE IF NOT EXISTS objets_import (
  id          SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  version     TEXT NOT NULL,
  nombre      INTEGER NOT NULL,
  importe_le  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Catégories (classe d'objet) et sous-catégories ; sous_classe = -1 désigne la catégorie elle-même.
CREATE TABLE IF NOT EXISTS objets_categories (
  classe       INTEGER NOT NULL,
  sous_classe  INTEGER NOT NULL,
  nom          TEXT NOT NULL,
  nom_long     TEXT NOT NULL DEFAULT '',
  PRIMARY KEY (classe, sous_classe)
);

CREATE TABLE IF NOT EXISTS objets_ensembles (
  id   INTEGER PRIMARY KEY,
  nom  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS objets (
  id                  INTEGER PRIMARY KEY,
  nom                 TEXT NOT NULL,
  nom_recherche       TEXT NOT NULL,
  description         TEXT NOT NULL DEFAULT '',
  classe              INTEGER NOT NULL,
  sous_classe         INTEGER NOT NULL,
  qualite             SMALLINT NOT NULL,
  niveau_objet        INTEGER NOT NULL,
  niveau_requis       INTEGER NOT NULL,
  emplacement         SMALLINT NOT NULL,
  lien                SMALLINT NOT NULL,
  classes_autorisees  INTEGER NOT NULL,
  prix_vente          BIGINT NOT NULL,
  prix_achat          BIGINT NOT NULL,
  pile                INTEGER NOT NULL,
  exemplaires_max     INTEGER NOT NULL,
  vitesse_ms          INTEGER NOT NULL,
  cases_sac           INTEGER NOT NULL,
  ensemble            INTEGER,
  icone               INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS objets_categorie_idx ON objets (classe, sous_classe);
CREATE INDEX IF NOT EXISTS objets_icone_idx ON objets (icone);
CREATE INDEX IF NOT EXISTS objets_ensemble_idx ON objets (ensemble);

-- Icônes converties en PNG à la première demande.
CREATE TABLE IF NOT EXISTS objets_icones (
  id       INTEGER PRIMARY KEY,
  png      BYTEA NOT NULL,
  cree_le  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Mesure d'audience sans cookie (module statistiques). Le visiteur est un code recalculé chaque jour
-- (empreinte salée de l'adresse IP et du navigateur) : ni adresse IP ni identifiant durable ne sont conservés.
CREATE TABLE IF NOT EXISTS stats_vues (
  id          TEXT PRIMARY KEY,
  cree_le     TIMESTAMPTZ NOT NULL DEFAULT now(),
  visiteur    TEXT NOT NULL,
  chemin      TEXT NOT NULL,
  source      TEXT NOT NULL,
  appareil    TEXT NOT NULL,
  duree_s     INTEGER,
  lecture     SMALLINT
);
CREATE INDEX IF NOT EXISTS stats_vues_date_idx ON stats_vues (cree_le);
CREATE INDEX IF NOT EXISTS stats_vues_visiteur_idx ON stats_vues (visiteur, cree_le);

CREATE TABLE IF NOT EXISTS stats_actions (
  id        BIGSERIAL PRIMARY KEY,
  cree_le   TIMESTAMPTZ NOT NULL DEFAULT now(),
  type      TEXT NOT NULL CHECK (type IN ('cta_vue', 'cta_clic', 'sortie')),
  nom       TEXT NOT NULL,
  chemin    TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS stats_actions_date_idx ON stats_actions (cree_le);

-- Tableau des guildes : fiches déposées par les guildes, publiées après relecture.
-- Le responsable modifie sa fiche par un lien secret ; seule l'empreinte du jeton est gardée.
CREATE TABLE IF NOT EXISTS guildes (
  id               SERIAL PRIMARY KEY,
  slug             TEXT NOT NULL UNIQUE,
  nom              TEXT NOT NULL,
  faction          TEXT NOT NULL CHECK (faction IN ('alliance', 'horde')),
  serveur          TEXT NOT NULL,
  type_royaume     TEXT NOT NULL CHECK (type_royaume IN ('jce', 'jcj', 'rp', 'hardcore')),
  objectifs        TEXT[] NOT NULL DEFAULT '{}',
  classes          TEXT[] NOT NULL DEFAULT '{}',
  roles            TEXT[] NOT NULL DEFAULT '{}',
  horaires         TEXT NOT NULL DEFAULT '',
  description      TEXT NOT NULL DEFAULT '',
  discord          TEXT NOT NULL DEFAULT '',
  site             TEXT NOT NULL DEFAULT '',
  contact_jeu      TEXT NOT NULL DEFAULT '',
  recrute          BOOLEAN NOT NULL DEFAULT true,
  statut           TEXT NOT NULL DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'publiee', 'refusee')),
  a_relire         BOOLEAN NOT NULL DEFAULT true,
  jeton_empreinte  TEXT NOT NULL,
  depot_empreinte  TEXT NOT NULL DEFAULT '',
  cree_le          TIMESTAMPTZ NOT NULL DEFAULT now(),
  maj_le           TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS guildes_statut_idx ON guildes (statut, maj_le DESC);

-- Caractéristiques calculées à l'import comme le fait le jeu (bonus, armure, dégâts des armes).
ALTER TABLE objets ADD COLUMN IF NOT EXISTS caracteristiques JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE objets ADD COLUMN IF NOT EXISTS armure INTEGER;
ALTER TABLE objets ADD COLUMN IF NOT EXISTS degats_min INTEGER;
ALTER TABLE objets ADD COLUMN IF NOT EXISTS degats_max INTEGER;

-- Recettes des métiers (« Fabriqué par », « Composant de »), importées avec les objets.
CREATE TABLE IF NOT EXISTS objets_recettes (
  sort        INTEGER PRIMARY KEY,
  nom         TEXT NOT NULL,
  objet       INTEGER NOT NULL,
  quantite    INTEGER NOT NULL DEFAULT 1,
  metier      TEXT NOT NULL,
  rang        INTEGER NOT NULL DEFAULT 0,
  jaune       INTEGER NOT NULL DEFAULT 0,
  gris        INTEGER NOT NULL DEFAULT 0,
  composants  JSONB NOT NULL DEFAULT '[]'::jsonb,
  recette     INTEGER
);
CREATE INDEX IF NOT EXISTS objets_recettes_objet_idx ON objets_recettes (objet);
CREATE INDEX IF NOT EXISTS objets_recettes_composants_idx ON objets_recettes USING GIN (composants jsonb_path_ops);

-- Comptes joueurs : connexion, Lettre et progression du guide de 1 à 60.
-- Mot de passe : empreinte scrypt salée, jamais le mot de passe lui-même. Sessions et liens de réinitialisation :
-- seule l'empreinte du jeton est gardée. Tout s'efface avec le compte (ON DELETE CASCADE).
CREATE TABLE IF NOT EXISTS joueurs (
  id             SERIAL PRIMARY KEY,
  pseudo         TEXT NOT NULL CHECK (char_length(pseudo) BETWEEN 3 AND 24),
  courriel       TEXT NOT NULL UNIQUE CHECK (courriel = lower(courriel)),
  mot_de_passe   TEXT NOT NULL,
  lettre         BOOLEAN NOT NULL DEFAULT false,
  race           TEXT NOT NULL DEFAULT '',
  classe         TEXT NOT NULL DEFAULT '',
  echecs         INTEGER NOT NULL DEFAULT 0,
  bloque_jusqu   TIMESTAMPTZ,
  depot_empreinte TEXT NOT NULL DEFAULT '',
  cree_le        TIMESTAMPTZ NOT NULL DEFAULT now(),
  vu_le          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS joueurs_pseudo_idx ON joueurs (lower(pseudo));

CREATE TABLE IF NOT EXISTS joueurs_sessions (
  empreinte  TEXT PRIMARY KEY,
  joueur_id  INTEGER NOT NULL REFERENCES joueurs (id) ON DELETE CASCADE,
  expire     TIMESTAMPTZ NOT NULL,
  cree_le    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS joueurs_sessions_joueur_idx ON joueurs_sessions (joueur_id);

CREATE TABLE IF NOT EXISTS joueurs_reinitialisations (
  empreinte  TEXT PRIMARY KEY,
  joueur_id  INTEGER NOT NULL REFERENCES joueurs (id) ON DELETE CASCADE,
  expire     TIMESTAMPTZ NOT NULL
);

-- Progression : quêtes cochées par guide (« alliance:humain:mage »), et quêtes faites chaque jour.
CREATE TABLE IF NOT EXISTS progression (
  joueur_id  INTEGER NOT NULL REFERENCES joueurs (id) ON DELETE CASCADE,
  guide      TEXT NOT NULL,
  quetes     INTEGER[] NOT NULL DEFAULT '{}',
  maj_le     TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (joueur_id, guide)
);
CREATE TABLE IF NOT EXISTS progression_jours (
  joueur_id  INTEGER NOT NULL REFERENCES joueurs (id) ON DELETE CASCADE,
  guide      TEXT NOT NULL,
  jour       DATE NOT NULL,
  faites     INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (joueur_id, guide, jour)
);

-- Statistiques d'audience, compléments : pays estimé d'après le fuseau horaire du navigateur (jamais d'après l'adresse IP),
-- langue du navigateur, pages introuvables, et recherches faites sur le site (termes filtrés, sans lien avec le visiteur).
ALTER TABLE stats_vues ADD COLUMN IF NOT EXISTS pays TEXT NOT NULL DEFAULT '';
ALTER TABLE stats_vues ADD COLUMN IF NOT EXISTS langue TEXT NOT NULL DEFAULT '';
ALTER TABLE stats_vues ADD COLUMN IF NOT EXISTS introuvable BOOLEAN NOT NULL DEFAULT false;
CREATE TABLE IF NOT EXISTS stats_recherches (
  id         BIGSERIAL PRIMARY KEY,
  cree_le    TIMESTAMPTZ NOT NULL DEFAULT now(),
  lieu       TEXT NOT NULL CHECK (lieu IN ('site', 'objets')),
  terme      TEXT NOT NULL,
  resultats  INTEGER
);
CREATE INDEX IF NOT EXISTS stats_recherches_date_idx ON stats_recherches (cree_le);

-- Version anglaise du site : noms et descriptions des objets en anglais, remplis à l'import.
ALTER TABLE objets ADD COLUMN IF NOT EXISTS nom_en TEXT NOT NULL DEFAULT '';
ALTER TABLE objets ADD COLUMN IF NOT EXISTS description_en TEXT NOT NULL DEFAULT '';
-- Version anglaise de la base d'objets : catégories, ensembles et recettes en anglais, recherche sur le nom anglais.
ALTER TABLE objets ADD COLUMN IF NOT EXISTS nom_recherche_en TEXT NOT NULL DEFAULT '';
ALTER TABLE objets_categories ADD COLUMN IF NOT EXISTS nom_en TEXT NOT NULL DEFAULT '';
ALTER TABLE objets_categories ADD COLUMN IF NOT EXISTS nom_long_en TEXT NOT NULL DEFAULT '';
ALTER TABLE objets_ensembles ADD COLUMN IF NOT EXISTS nom_en TEXT NOT NULL DEFAULT '';
ALTER TABLE objets_recettes ADD COLUMN IF NOT EXISTS nom_en TEXT NOT NULL DEFAULT '';
ALTER TABLE objets_recettes ADD COLUMN IF NOT EXISTS metier_en TEXT NOT NULL DEFAULT '';

-- Version anglaise des articles en ligne (/en/articles/<slug>/), traduite par l'IA après publication.
-- L'avis anglais est la traduction de l'avis de Jobwow (avis_silfax), jamais un texte produit sans lui.
-- empreinte : condensé des champs français traduits ; s'il change, la traduction est à refaire.
CREATE TABLE IF NOT EXISTS articles_en (
  article_id   INTEGER PRIMARY KEY REFERENCES articles(id) ON DELETE CASCADE,
  titre        TEXT NOT NULL,
  chapo        TEXT NOT NULL DEFAULT '',
  corps        TEXT NOT NULL DEFAULT '',
  avis         TEXT NOT NULL DEFAULT '',
  description  TEXT NOT NULL DEFAULT '',
  etiquettes   TEXT[] NOT NULL DEFAULT '{}',
  empreinte    TEXT NOT NULL,
  manuel       BOOLEAN NOT NULL DEFAULT false,
  traduit_le   TIMESTAMPTZ NOT NULL DEFAULT now(),
  erreur       TEXT
);

-- Légende de l'image d'en-tête (affichée sous l'image, avant le crédit), et sa traduction anglaise.
ALTER TABLE articles ADD COLUMN IF NOT EXISTS image_legende TEXT NOT NULL DEFAULT '';
ALTER TABLE articles_en ADD COLUMN IF NOT EXISTS legende TEXT NOT NULL DEFAULT '';

-- Relance manuelle des publications en échec sur les réseaux (bouton de l'éditeur) : rouvre la fenêtre de 7 jours.
ALTER TABLE articles ADD COLUMN IF NOT EXISTS relais_relance_le TIMESTAMPTZ;

-- Vidéos de Reel à fabriquer par la tâche planifiée (veille:videos), jamais dans le conteneur du site.
CREATE TABLE IF NOT EXISTS reels_demandes (
  article_id  INTEGER PRIMARY KEY REFERENCES articles(id) ON DELETE CASCADE,
  demande_le  TIMESTAMPTZ NOT NULL DEFAULT now(),
  erreur      TEXT
);

-- Lettre : abonnés (double validation gérée par le site, envoi par Resend), numéros et file d'expédition.
-- Une désinscription efface la ligne de l'abonné ; une demande jamais confirmée est effacée au bout de sept jours.
CREATE TABLE IF NOT EXISTS lettre_abonnes (
  id              SERIAL PRIMARY KEY,
  courriel        TEXT NOT NULL UNIQUE CHECK (courriel = lower(courriel) AND char_length(courriel) <= 254),
  langue          TEXT NOT NULL DEFAULT 'fr' CHECK (langue IN ('fr', 'en')),
  confirme_le     TIMESTAMPTZ,
  jeton_empreinte TEXT UNIQUE,
  jeton_expire    TIMESTAMPTZ,
  demande_le      TIMESTAMPTZ NOT NULL DEFAULT now(),
  cree_le         TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS lettre_abonnes_confirmes_idx ON lettre_abonnes (langue) WHERE confirme_le IS NOT NULL;

CREATE TABLE IF NOT EXISTS lettre_envois (
  id          SERIAL PRIMARY KEY,
  langue      TEXT NOT NULL CHECK (langue IN ('fr', 'en')),
  sujet       TEXT NOT NULL CHECK (char_length(sujet) BETWEEN 1 AND 200),
  corps       TEXT NOT NULL,
  statut      TEXT NOT NULL DEFAULT 'brouillon' CHECK (statut IN ('brouillon', 'en_cours', 'termine')),
  cree_le     TIMESTAMPTZ NOT NULL DEFAULT now(),
  lance_le    TIMESTAMPTZ,
  termine_le  TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS lettre_file (
  envoi_id   INTEGER NOT NULL REFERENCES lettre_envois (id) ON DELETE CASCADE,
  abonne_id  INTEGER NOT NULL REFERENCES lettre_abonnes (id) ON DELETE CASCADE,
  envoye_le  TIMESTAMPTZ,
  echecs     INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (envoi_id, abonne_id)
);
CREATE INDEX IF NOT EXISTS lettre_file_attente_idx ON lettre_file (envoi_id) WHERE envoye_le IS NULL;
CREATE INDEX IF NOT EXISTS lettre_file_envoye_idx ON lettre_file (envoye_le) WHERE envoye_le IS NOT NULL;

-- Relecture du guide de 1 à 60 en jeu (/admin/guides) : étape vérifiée et remarque, par guide.
CREATE TABLE IF NOT EXISTS guides_relecture (
  guide     TEXT NOT NULL,
  etape     TEXT NOT NULL,
  verifie   BOOLEAN NOT NULL DEFAULT false,
  remarque  TEXT NOT NULL DEFAULT '' CHECK (char_length(remarque) <= 1000),
  maj_le    TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (guide, etape)
);
