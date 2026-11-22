-- DORMANT: academy customer workspace. Must not be applied on production before authorization.
-- Only additive tables; no changes to existing commerce, B2B or owner-portal tables.
PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS academy_users (
  id TEXT PRIMARY KEY,
  email_hash TEXT UNIQUE,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS academy_projects (
  id TEXT PRIMARY KEY,
  owner_user_id TEXT NOT NULL REFERENCES academy_users(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK(length(title) BETWEEN 1 AND 120),
  language TEXT NOT NULL CHECK(language IN ('de','sr')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','review','archived')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS academy_projects_owner_updated ON academy_projects(owner_user_id,updated_at DESC);
CREATE TABLE IF NOT EXISTS academy_project_steps (
  project_id TEXT NOT NULL REFERENCES academy_projects(id) ON DELETE CASCADE,
  step TEXT NOT NULL CHECK(step IN ('niche','market','offer','online_presence','operations','validation')),
  content_json TEXT NOT NULL CHECK(json_valid(content_json) AND length(content_json)<=12000),
  updated_at INTEGER NOT NULL,
  PRIMARY KEY(project_id,step)
);
-- Store neither raw e-mail addresses nor one-time codes; only HMAC digests.
CREATE TABLE IF NOT EXISTS academy_login_challenges (
  id TEXT PRIMARY KEY,
  email_hash TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0 CHECK(attempts BETWEEN 0 AND 5),
  expires_at INTEGER NOT NULL,
  consumed_at INTEGER,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS academy_challenges_email_time ON academy_login_challenges(email_hash,created_at DESC);
CREATE INDEX IF NOT EXISTS academy_challenges_expiry ON academy_login_challenges(expires_at);
-- Random opaque cookie is stored only as a HMAC digest; logout revokes it.
CREATE TABLE IF NOT EXISTS academy_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES academy_users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at INTEGER NOT NULL,
  revoked_at INTEGER,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS academy_sessions_user ON academy_sessions(user_id);
CREATE INDEX IF NOT EXISTS academy_sessions_expiry ON academy_sessions(expires_at);
-- Existing rate_buckets table (2026-11-13 migration) is reused for atomic abuse limits.