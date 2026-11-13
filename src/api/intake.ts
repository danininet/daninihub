import type { Env } from "../lib/env";
import {
  json,
  HttpError,
  readJson,
  sameOrigin,
  digest,
  hmac,
  verifyHmac,
} from "../security/http";
import { validateIntake } from "../security/validation";
import { authorizeDirector } from "../security/director";
export function ready(env: Env) {
  return (
    env.B2B_ACTIVE === "true" &&
    !!env.DANINI_DB &&
    !!env.DOCUMENTS &&
    !!env.INTAKE_WORKFLOW &&
    !!env.DANINI_TURNSTILE_SECRET &&
    !!env.DANINI_TURNSTILE_SITEKEY &&
    (env.TOKEN_SECRET?.length ?? 0) >= 32 &&
    (env.RATE_SECRET?.length ?? 0) >= 32 &&
    !!env.SITE_ORIGIN &&
    !!env.BREVO_API_KEY &&
    !!env.DANINI_BREVO_SENDER &&
    !!env.DANINI_NOTIFY_TO &&
    (env.DIRECTOR_HMAC_SECRET?.length ?? 0) >= 32
  );
}
export async function audit(
  env: Env,
  id: string,
  action: string,
  actor = "system",
) {
  const now = Math.floor(Date.now() / 1000);
  await env.DANINI_DB.batch([
    env.DANINI_DB.prepare("INSERT INTO audit_logs VALUES (?,?,?,?,?)").bind(
      crypto.randomUUID(),
      id,
      action,
      actor,
      now,
    ),
    env.DANINI_DB.prepare(
      "INSERT OR IGNORE INTO workflow_events VALUES (?,?,?,?,?)",
    ).bind(`${id}:${action}`, id, action, "recorded", now),
  ]);
}
export async function intake(request: Request, env: Env) {
  if (!ready(env)) return json({ error: "not_configured" }, 503);
  sameOrigin(request, env.SITE_ORIGIN!);
  const now = Math.floor(Date.now() / 1000);
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const bucket = await hmac(env.RATE_SECRET!, ip + ":" + Math.floor(now / 600));
  const rate = await env.DANINI_DB.prepare(
    "INSERT INTO rate_buckets VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count",
  )
    .bind(bucket, now + 1200)
    .first<{ count: number }>();
  if (!rate || rate.count > 10) return json({ error: "rate_limited" }, 429);
  const raw = await readJson(request, 80000);
  const data = validateIntake(raw);
  const requestKey = request.headers.get("idempotency-key") || "";
  if (!/^[a-zA-Z0-9_-]{20,80}$/.test(requestKey))
    throw new HttpError(400, "idempotency_key_required");
  const { turnstileToken, ...safe } = data;
  const payloadHash = await digest(JSON.stringify(safe));
  // Always verify a new CAPTCHA, including idempotent retries, before revealing a reference.
  const captcha = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        secret: env.DANINI_TURNSTILE_SECRET,
        response: turnstileToken,
        remoteip: ip === "unknown" ? undefined : ip,
      }),
      signal: AbortSignal.timeout(8000),
    },
  );
  if (!captcha.ok) throw new HttpError(502, "verification_unavailable");
  const verified = await captcha.json<any>();
  if (
    !verified.success ||
    verified.hostname !== new URL(env.SITE_ORIGIN!).hostname ||
    verified.action !== "b2b-intake"
  )
    throw new HttpError(400, "human_verification_failed");
  const requestHash = await hmac(env.TOKEN_SECRET!, requestKey);
  const previous = await env.DANINI_DB.prepare(
    "SELECT id,reference,payload_hash,workflow_started,status FROM cases WHERE request_key=?",
  )
    .bind(requestHash)
    .first<any>();
  let id: string, reference: string;
  if (previous) {
    if (previous.payload_hash !== payloadHash)
      throw new HttpError(409, "idempotency_conflict");
    id = previous.id;
    reference = previous.reference;
    if (previous.status === "storing")
      throw new HttpError(409, "request_in_progress");
    if (previous.status === "storage_failed")
      throw new HttpError(503, "storage_failed");
  } else {
    id = crypto.randomUUID();
    reference =
      "DN-" +
      new Date().toISOString().slice(0, 10).replaceAll("-", "") +
      "-" +
      id.replaceAll("-", "").slice(0, 12).toUpperCase();
    const days = Number(env.RETENTION_DAYS || 30);
    if (!Number.isInteger(days) || days < 1 || days > 90)
      throw new HttpError(503, "retention_not_configured");
    const insert = await env.DANINI_DB.prepare(
      "INSERT OR IGNORE INTO cases(id,tenant_id,reference,request_key,payload_hash,status,vertical,language,country,created_at,expires_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
    )
      .bind(
        id,
        "danini",
        reference,
        requestHash,
        payloadHash,
        "storing",
        data.vertical,
        data.language,
        data.country,
        now,
        now + days * 86400,
      )
      .run();
    if (insert.meta.changes !== 1)
      throw new HttpError(409, "request_in_progress");
    try {
      const key = `cases/${id}/intake.json`;
      await env.DOCUMENTS.put(key, JSON.stringify(safe), {
        httpMetadata: { contentType: "application/json" },
      });
      await env.DANINI_DB.prepare("INSERT INTO case_files VALUES (?,?,?,?,?,?)")
        .bind(crypto.randomUUID(), id, key, "intake", payloadHash, now)
        .run();
      await env.DANINI_DB.prepare(
        "UPDATE cases SET status='received' WHERE id=? AND status='storing'",
      )
        .bind(id)
        .run();
      await audit(env, id, "intake_recorded");
    } catch {
      await env.DANINI_DB.prepare(
        "UPDATE cases SET status='storage_failed' WHERE id=?",
      )
        .bind(id)
        .run();
      throw new HttpError(503, "storage_failed");
    }
  }
  if (!previous?.workflow_started) {
    try {
      await env.INTAKE_WORKFLOW.create({ id, params: { caseId: id } });
    } catch {
      // A network timeout may occur after creation. Resolve by deterministic ID.
      try {
        const existing = await env.INTAKE_WORKFLOW.get(id);
        const state = await existing.status();
        if (!state || state.status === "unknown") throw Error();
      } catch {
        throw new HttpError(503, "workflow_start_unconfirmed");
      }
    }
    await env.DANINI_DB.prepare(
      "UPDATE cases SET workflow_started=1 WHERE id=?",
    )
      .bind(id)
      .run();
  }
  const token = await hmac(env.TOKEN_SECRET!, `case:${id}`);
  return json(
    { accepted: true, reference, caseId: id, accessToken: token },
    202,
  );
}
export async function caseStatus(request: Request, env: Env, id: string) {
  if (!env.TOKEN_SECRET || !env.DANINI_DB)
    return json({ error: "not_configured" }, 503);
  const token =
    request.headers.get("authorization")?.replace(/^Bearer /, "") || "";
  if (!(await verifyHmac(env.TOKEN_SECRET, `case:${id}`, token)))
    return json({ error: "not_found" }, 404);
  const row = await env.DANINI_DB.prepare(
    "SELECT reference,status,created_at,expires_at FROM cases WHERE id=? AND expires_at>?",
  )
    .bind(id, Math.floor(Date.now() / 1000))
    .first();
  return row ? json(row) : json({ error: "not_found" }, 404);
}
export async function approve(request: Request, env: Env, id: string) {
  const data = await readJson(request, 2000);
  const body = JSON.stringify(data);
  await authorizeDirector(request, env, body);
  if (
    !["approve", "reject"].includes(data.decision) ||
    !/^[a-f0-9]{64}$/.test(data.draftHash || "")
  )
    throw new HttpError(400, "invalid_decision");
  const now = Math.floor(Date.now() / 1000),
    decisionId = crypto.randomUUID();
  const r = await env.DANINI_DB.prepare(
    "UPDATE cases SET status=?,approved_hash=?,decision_id=?,decision_at=? WHERE id=? AND status='awaiting_approval' AND draft_hash=? AND expires_at>? AND review_deadline>? AND decision_id IS NULL",
  )
    .bind(
      data.decision === "approve" ? "approved" : "rejected",
      data.decision === "approve" ? data.draftHash : null,
      decisionId,
      now,
      id,
      data.draftHash,
      now,
      now,
    )
    .run();
  if (r.meta.changes !== 1) throw new HttpError(409, "not_approvable");
  await audit(env, id, data.decision, "director");
  try {
    const instance = await env.INTAKE_WORKFLOW.get(id);
    await instance.sendEvent({
      type: "director-decision",
      payload: { decisionId },
    });
  } catch {
    // Persisted decision is authoritative. Workflow reads it on timeout as well.
    return json({ recorded: true, eventDelivered: false }, 202);
  }
  return json({ recorded: true, eventDelivered: true });
}
export async function directorReview(request: Request, env: Env, id: string) {
  await authorizeDirector(request, env, "");
  const row = await env.DANINI_DB.prepare(
    "SELECT id,reference,status,draft_hash,expires_at FROM cases WHERE id=? AND expires_at>?",
  )
    .bind(id, Math.floor(Date.now() / 1000))
    .first();
  if (!row) return json({ error: "not_found" }, 404);
  const draft = await env.DOCUMENTS.get(`cases/${id}/draft.json`);
  return json({ case: row, draft: draft ? await draft.json() : null });
}
