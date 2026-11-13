// Generates a reviewed configuration only. Does not create resources or deploy.
import fs from "node:fs";
import path from "node:path";
const stage = process.argv[2];
if (!["staging", "production"].includes(stage))
  throw Error("Use staging or production");
const get = (name) => {
  const value = process.env[name];
  if (!value) throw Error("Missing " + name);
  return value;
};
const db = get("B2B_D1_ID"),
  kv = get("B2B_KV_ID"),
  bucket = get("B2B_R2_BUCKET"),
  origin = get("B2B_ORIGIN");
if (
  !/^[a-f0-9-]{36}$/.test(db) ||
  !/[1-9a-f]/.test(db.replaceAll("-", "")) ||
  !/^[a-f0-9]{32}$/.test(kv) ||
  !/[1-9a-f]/.test(kv)
)
  throw Error("Real resource IDs required");
if (stage === "staging" && db === "9c3fc741-5cb0-432f-82ca-c75e8220c435")
  throw Error("Staging must not use production D1");
if (new URL(origin).protocol !== "https:") throw Error("HTTPS origin required");
const config = {
  name: stage === "production" ? "autodanini" : "danini-b2b-staging",
  main: path.resolve("src/index.ts"),
  compatibility_date: "2026-11-07",
  assets: {
    directory: path.resolve("dist"),
    binding: "ASSETS",
    run_worker_first: ["/api/*", "/portal/*"],
    not_found_handling: "404-page",
  },
  vars: {
    B2B_ACTIVE: "false",
    AI_ENABLED: "false",
    SITE_ORIGIN: origin,
    RETENTION_DAYS: "30",
  },
  d1_databases: [
    {
      binding: "DANINI_DB",
      database_name:
        stage === "production" ? "danini-commerce" : "danini-b2b-staging",
      database_id: db,
      migrations_dir: path.resolve("migrations"),
    },
  ],
  kv_namespaces: [{ binding: "PARTNERS", id: kv }],
  r2_buckets: [
    { binding: "DOCUMENTS", bucket_name: bucket, jurisdiction: "eu" },
  ],
  workflows: [
    {
      name: `danini-intake-${stage}`,
      binding: "INTAKE_WORKFLOW",
      class_name: "IntakeWorkflow",
    },
  ],
  triggers: { crons: ["0 3 * * 0"] },
};
// No routes here: existing production overlay routes require a separate approved cutover.
fs.mkdirSync(".wrangler/b2b", { recursive: true });
fs.writeFileSync(
  `.wrangler/b2b/${stage}.json`,
  JSON.stringify(config, null, 2),
);
console.log(`Prepared .wrangler/b2b/${stage}.json; no deployment performed.`);
