import type { Env } from "../lib/env";
import { digest, verifyHmac, HttpError } from "./http";
// Dedicated director signing key, never delivered to the browser. A signed request
// binds method, path, body, timestamp and one-use nonce. No cookie authentication.
export async function authorizeDirector(
  request: Request,
  env: Env,
  body: string,
) {
  if (!env.DIRECTOR_HMAC_SECRET || env.DIRECTOR_HMAC_SECRET.length < 32)
    throw new HttpError(503, "director_not_configured");
  const time = request.headers.get("x-danini-timestamp") || "",
    nonce = request.headers.get("x-danini-nonce") || "",
    signature = request.headers.get("x-danini-signature") || "";
  if (
    !/^\d{10}$/.test(time) ||
    Math.abs(Date.now() / 1000 - Number(time)) > 300 ||
    !/^[a-zA-Z0-9_-]{20,80}$/.test(nonce)
  )
    throw new HttpError(401, "unauthorized");
  const signed = [
    request.method,
    new URL(request.url).pathname,
    time,
    nonce,
    await digest(body),
  ].join("\n");
  if (!(await verifyHmac(env.DIRECTOR_HMAC_SECRET, signed, signature)))
    throw new HttpError(401, "unauthorized");
  const r = await env.DANINI_DB.prepare(
    "INSERT OR IGNORE INTO auth_nonces(nonce,expires_at) VALUES (?,?)",
  )
    .bind(nonce, Math.floor(Date.now() / 1000) + 600)
    .run();
  if (r.meta.changes !== 1) throw new HttpError(409, "replayed_request");
}
