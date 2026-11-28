-- Apply once to the existing PRIVATE D1 database, never to public assets.
-- Existing PDF rows and order history remain unchanged.
CREATE TABLE IF NOT EXISTS danini_digital_packages (
 sha256 TEXT PRIMARY KEY CHECK(length(sha256)=64),
 byte_length INTEGER NOT NULL CHECK(byte_length BETWEEN 100001 AND 10485760),
 chunk_count INTEGER NOT NULL CHECK(chunk_count BETWEEN 1 AND 400),
 ready INTEGER NOT NULL DEFAULT 0 CHECK(ready IN(0,1))
);
CREATE TABLE IF NOT EXISTS danini_digital_package_chunks (
 sha256 TEXT NOT NULL REFERENCES danini_digital_packages(sha256),
 chunk_index INTEGER NOT NULL CHECK(chunk_index BETWEEN 0 AND 399),
 data_b64 TEXT NOT NULL,
 PRIMARY KEY(sha256,chunk_index)
);
ALTER TABLE danini_digital_orders ADD COLUMN package_sha256 TEXT REFERENCES danini_digital_packages(sha256);
