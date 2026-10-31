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
