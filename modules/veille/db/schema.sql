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
  -- Garde-fou : aucun article publié sans l'avis de Silfax.
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

-- Avis proposé par l'IA : une suggestion que Silfax relit et reprend. L'avis publié reste avis_silfax.
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
