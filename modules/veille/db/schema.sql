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

-- Programmation : un brouillon dont programme_le est renseigné sera publié par le passage horaire
-- (publication normale, donc soumise aux mêmes contrôles et à la contrainte avis_obligatoire).
ALTER TABLE articles ADD COLUMN IF NOT EXISTS programme_le TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS articles_programme_le ON articles (programme_le) WHERE programme_le IS NOT NULL;

-- Comptes d'administration. version_session augmente à chaque changement de mot de passe :
-- toutes les sessions ouvertes deviennent alors invalides.
CREATE TABLE IF NOT EXISTS admins (
  id                  SERIAL PRIMARY KEY,
  identifiant         TEXT NOT NULL UNIQUE,
  empreinte           TEXT NOT NULL,
  version_session     INTEGER NOT NULL DEFAULT 1,
  cree_le             TIMESTAMPTZ NOT NULL DEFAULT now(),
  derniere_connexion  TIMESTAMPTZ
);

-- Essais de connexion manqués, par identifiant et par adresse IP (blocage temporaire).
CREATE TABLE IF NOT EXISTS admin_echecs (
  cle     TEXT PRIMARY KEY,
  n       INTEGER NOT NULL DEFAULT 0,
  depuis  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Journal des passages de veille (planifiés ou lancés depuis le tableau de bord).
CREATE TABLE IF NOT EXISTS veille_passages (
  id           SERIAL PRIMARY KEY,
  mode         TEXT NOT NULL CHECK (mode IN ('essai', 'quotidien')),
  declencheur  TEXT NOT NULL DEFAULT 'planificateur',
  debut        TIMESTAMPTZ NOT NULL DEFAULT now(),
  fin          TIMESTAMPTZ,
  statut       TEXT NOT NULL DEFAULT 'en_cours' CHECK (statut IN ('en_cours', 'termine', 'echec')),
  resume       TEXT,
  erreur       TEXT
);

CREATE INDEX IF NOT EXISTS veille_passages_debut ON veille_passages (debut DESC);
