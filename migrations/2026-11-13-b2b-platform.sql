-- Additive only. Never drops or modifies existing commerce tables.
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS tenants (id TEXT PRIMARY KEY, name TEXT NOT NULL, created_at INTEGER NOT NULL);
INSERT OR IGNORE INTO tenants VALUES ('danini','DANINI',unixepoch());
CREATE TABLE IF NOT EXISTS cases (
 id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id), reference TEXT NOT NULL UNIQUE,
 request_key TEXT NOT NULL UNIQUE, payload_hash TEXT NOT NULL, status TEXT NOT NULL,
 vertical TEXT NOT NULL, language TEXT NOT NULL, country TEXT NOT NULL,
 created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL,
 draft_hash TEXT, review_deadline INTEGER, approved_hash TEXT, decision_id TEXT, decision_at INTEGER,
 delivery_status TEXT NOT NULL DEFAULT 'not_sent', workflow_started INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS cases_tenant_created ON cases(tenant_id,created_at DESC);
CREATE INDEX IF NOT EXISTS cases_status_expiry ON cases(status,expires_at);
CREATE INDEX IF NOT EXISTS cases_expiry ON cases(expires_at);
CREATE TABLE IF NOT EXISTS case_files (id TEXT PRIMARY KEY,case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,object_key TEXT NOT NULL UNIQUE,kind TEXT NOT NULL,sha256 TEXT NOT NULL,created_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS case_files_case ON case_files(case_id);
CREATE TABLE IF NOT EXISTS affiliate_referrals (id TEXT PRIMARY KEY,tenant_id TEXT NOT NULL REFERENCES tenants(id),code TEXT NOT NULL UNIQUE,case_id TEXT REFERENCES cases(id) ON DELETE SET NULL,created_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS referrals_tenant ON affiliate_referrals(tenant_id,created_at);
CREATE TABLE IF NOT EXISTS audit_logs (id TEXT PRIMARY KEY,case_id TEXT REFERENCES cases(id) ON DELETE SET NULL,action TEXT NOT NULL,actor TEXT NOT NULL,created_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS audit_case_time ON audit_logs(case_id,created_at);
CREATE INDEX IF NOT EXISTS audit_expiry ON audit_logs(created_at);
CREATE TABLE IF NOT EXISTS workflow_events (id TEXT PRIMARY KEY,case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,type TEXT NOT NULL,state TEXT NOT NULL,created_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS workflow_case_time ON workflow_events(case_id,created_at);
CREATE TABLE IF NOT EXISTS rate_buckets (key TEXT PRIMARY KEY,count INTEGER NOT NULL,expires_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS rate_expiry ON rate_buckets(expires_at);
CREATE TABLE IF NOT EXISTS auth_nonces (nonce TEXT PRIMARY KEY,expires_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS nonce_expiry ON auth_nonces(expires_at);
CREATE TABLE IF NOT EXISTS mail_outbox (id TEXT PRIMARY KEY,case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,state TEXT NOT NULL,provider_id TEXT,created_at INTEGER NOT NULL);
