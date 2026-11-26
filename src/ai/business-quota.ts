import type { Env } from "../lib/env";
// Business-draft calls only. A single conditional D1 write reserves each attempt.
// Preserve the old same-day KV count on transition. No credit is refunded on
// timeout or provider failure, because a provider may have processed the call.
export async function reserveBusinessInference(env: Env): Promise<boolean> {
  const day = new Date().toISOString().slice(0, 10);
  const key = "business-ai-daily:" + day;
  try {
    if (!env.DANINI_DB) return false;
    const previous = env.PARTNERS ? Number(await env.PARTNERS.get(key) || 0) : 0;
    if (!Number.isSafeInteger(previous) || previous < 0 || previous >= 20) return false;
    const expires = Math.floor(Date.now() / 1000) + 172800;
    const row = await env.DANINI_DB.prepare(
      "INSERT INTO rate_buckets(key,count,expires_at) VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET count=MAX(rate_buckets.count,excluded.count-1)+1 WHERE MAX(rate_buckets.count,excluded.count-1)<20 RETURNING count"
    ).bind(key, previous + 1, expires).first<{count:number}>();
    return !!row && row.count <= 20;
  } catch { return false; }
}
