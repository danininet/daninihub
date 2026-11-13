import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
function dbAdapter() {
  const db = new DatabaseSync(":memory:");
  db.exec(fs.readFileSync("migrations/2026-11-13-b2b-platform.sql", "utf8"));
  return {
    db,
    async batch(statements) {
      return Promise.all(statements.map((statement) => statement.run()));
    },
    prepare(sql) {
      return {
        bind(...args) {
          return {
            async first() {
              return db.prepare(sql).get(...args) ?? null;
            },
            async all() {
              return { results: db.prepare(sql).all(...args) };
            },
            async run() {
              const r = db.prepare(sql).run(...args);
              return { meta: { changes: Number(r.changes) } };
            },
          };
        },
      };
    },
  };
}
const valid = () => ({
  name: "Test Owner",
  company: "Example GmbH",
  email: "owner@example.test",
  country: "DE",
  vertical: "cbam",
  language: "de",
  message: "Preparing product documentation for a new supplier.",
  consent: true,
  turnstileToken: "test-only-token",
});
function env() {
  const docs = new Map();
  return {
    DANINI_DB: dbAdapter(),
    DOCUMENTS: {
      async put(k, v) {
        docs.set(k, v);
      },
      async get(k) {
        return docs.has(k)
          ? {
              async json() {
                return JSON.parse(docs.get(k));
              },
              async text() {
                return docs.get(k);
              },
            }
          : null;
      },
    },
    INTAKE_WORKFLOW: {
      async create() {},
      async get() {
        return {
          async status() {
            return { status: "queued" };
          },
          async sendEvent() {},
        };
      },
    },
    BREVO_API_KEY: "test",
    DANINI_BREVO_SENDER: "sender@example.test",
    DANINI_NOTIFY_TO: "owner@example.test",
    B2B_ACTIVE: "true",
    SITE_ORIGIN: "https://danini.test",
    DANINI_TURNSTILE_SITEKEY: "test",
    DANINI_TURNSTILE_SECRET: "test",
    TOKEN_SECRET: "t".repeat(64),
    RATE_SECRET: "r".repeat(64),
    DIRECTOR_HMAC_SECRET: "d".repeat(64),
  };
}
function req(body = valid(), key = "idempotency-test-key-12345") {
  return new Request("https://danini.test/api/intake", {
    method: "POST",
    headers: {
      origin: "https://danini.test",
      "content-type": "application/json",
      "idempotency-key": key,
      "cf-connecting-ip": "192.0.2.1",
    },
    body: JSON.stringify(body),
  });
}
const captcha = async () =>
  Response.json({
    success: true,
    hostname: "danini.test",
    action: "b2b-intake",
  });

export { env, valid, req, captcha };
