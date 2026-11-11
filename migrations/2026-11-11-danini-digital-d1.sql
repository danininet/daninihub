-- DANINI digital commerce (private D1): run once on existing danini-commerce DB.
-- Nothing activates checkout without provider secrets, approved operator switch and uploaded PDF.
CREATE TABLE IF NOT EXISTS danini_digital_orders (
 reference TEXT PRIMARY KEY,
 sku TEXT NOT NULL CHECK (sku IN ('guide')),
 email TEXT NOT NULL,
 language TEXT NOT NULL CHECK (language IN ('sr','de')),
 amount_cents INTEGER NOT NULL CHECK (amount_cents=4900),
 status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','CREATED','PROCESSING','PAID')),
 paypal_order_id TEXT UNIQUE,
 capture_id TEXT UNIQUE,
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 processing_at TEXT,
 paid_at TEXT,
 email_state TEXT NOT NULL DEFAULT 'PENDING' CHECK(email_state IN ('PENDING','SENDING','SENT')),
 email_sent_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_danini_digital_orders_status ON danini_digital_orders(status,created_at);
CREATE TABLE IF NOT EXISTS danini_digital_files (
 sku TEXT PRIMARY KEY CHECK (sku IN ('guide')),
 byte_length INTEGER NOT NULL CHECK(byte_length BETWEEN 100001 AND 10485760),
 chunk_count INTEGER NOT NULL CHECK(chunk_count BETWEEN 1 AND 400),
 sha256 TEXT NOT NULL,
 ready INTEGER NOT NULL DEFAULT 0 CHECK (ready IN (0,1)),
 updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS danini_digital_pdf_chunks (
 sku TEXT NOT NULL CHECK (sku IN ('guide')),
 chunk_index INTEGER NOT NULL CHECK (chunk_index BETWEEN 0 AND 399),
 data_b64 TEXT NOT NULL,
 PRIMARY KEY(sku,chunk_index)
);
-- Attach PDF content through the reviewed offline SQL importer; no public storage.
