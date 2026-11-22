-- Dormant Academy Builder data model. No route, login, monetization, or public activation.
-- New names keep existing danini commerce / B2B case tables unchanged.
PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS academy_users (
  id TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS academy_projects (
  id TEXT PRIMARY KEY,
  owner_user_id TEXT NOT NULL REFERENCES academy_users(id),
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
-- Explicitly add customer authentication, verified identities, session revocation,
-- retention policy and quota control before registering any public API handlers.