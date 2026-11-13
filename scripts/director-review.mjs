// Usage: DANINI_DIRECTOR_SECRET=<secret from secure store> node scripts/director-review.mjs https://staging-host CASE_ID [approve|reject DRAFT_HASH]
// Never pass the secret in command arguments or commit it to a file.
import { createHmac, createHash, randomUUID } from "node:crypto";
const [origin, id, decision, hash] = process.argv.slice(2);
const secret = process.env.DANINI_DIRECTOR_SECRET;
if (
  !secret ||
  secret.length < 32 ||
  !origin ||
  !id ||
  !/^https:\/\//.test(origin) ||
  !/^[a-f0-9-]{36}$/.test(id)
)
  throw Error(
    "Supply HTTPS origin, case UUID and DANINI_DIRECTOR_SECRET in environment",
  );
if (
  decision &&
  (!["approve", "reject"].includes(decision) ||
    !/^[a-f0-9]{64}$/.test(hash || ""))
)
  throw Error("Supply approve|reject and reviewed draft hash");
const method = decision ? "POST" : "GET",
  path = `/portal/${decision ? "approve" : "case"}/${id}`,
  body = decision ? JSON.stringify({ decision, draftHash: hash }) : "";
const time = String(Math.floor(Date.now() / 1000)),
  nonce = randomUUID();
const signature = createHmac("sha256", secret)
  .update(
    [
      method,
      path,
      time,
      nonce,
      createHash("sha256").update(body).digest("hex"),
    ].join("\n"),
  )
  .digest("hex");
const response = await fetch(new URL(path, origin), {
  method,
  headers: {
    "content-type": "application/json",
    "x-danini-timestamp": time,
    "x-danini-nonce": nonce,
    "x-danini-signature": signature,
  },
  body: body || undefined,
});
console.log(JSON.stringify(await response.json(), null, 2));
if (!response.ok) process.exitCode = 1;
