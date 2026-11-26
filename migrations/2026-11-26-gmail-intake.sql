-- Additive, no activation or Gmail access. Store only deterministic draft and classification.
CREATE TABLE IF NOT EXISTS gmail_intake_queue (
 id TEXT PRIMARY KEY, received_at INTEGER NOT NULL, expires_at INTEGER NOT NULL,
 language TEXT NOT NULL, vertical TEXT NOT NULL, intent TEXT NOT NULL, risk TEXT NOT NULL,
 draft TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'awaiting_review'
);
CREATE INDEX IF NOT EXISTS gmail_intake_queue_expiry ON gmail_intake_queue(expires_at);
