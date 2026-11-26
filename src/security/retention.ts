import type { Env } from "../lib/env";
export async function cleanup(env: Env) {
  if (!env.DANINI_DB || !env.DOCUMENTS) return;
  const now = Math.floor(Date.now() / 1000);
  const rows = await env.DANINI_DB.prepare(
    "SELECT id FROM cases WHERE expires_at<? ORDER BY expires_at LIMIT 25",
  )
    .bind(now)
    .all<{ id: string }>();
  for (const row of rows.results) {
    // Terminate a running workflow before deleting its data. A failed termination
    // keeps the case for the next run rather than racing document recreation.
    if (env.INTAKE_WORKFLOW) {
      const instance = await env.INTAKE_WORKFLOW.get(row.id);
      const status = await instance.status();
      if (
        !["complete", "errored", "terminated", "unknown"].includes(
          status.status,
        )
      )
        await instance.terminate();
    }
    let cursor: string | undefined;
    do {
      const page = await env.DOCUMENTS.list({
        prefix: `cases/${row.id}/`,
        cursor,
        limit: 100,
      });
      if (page.objects.length)
        await env.DOCUMENTS.delete(page.objects.map((o) => o.key));
      cursor = page.truncated ? page.cursor : undefined;
    } while (cursor);
    await env.DANINI_DB.batch([
      env.DANINI_DB.prepare("DELETE FROM case_files WHERE case_id=?").bind(
        row.id,
      ),
      env.DANINI_DB.prepare("DELETE FROM workflow_events WHERE case_id=?").bind(
        row.id,
      ),
      env.DANINI_DB.prepare("DELETE FROM mail_outbox WHERE case_id=?").bind(
        row.id,
      ),
      env.DANINI_DB.prepare(
        "UPDATE affiliate_referrals SET case_id=NULL WHERE case_id=?",
      ).bind(row.id),
      env.DANINI_DB.prepare(
        "UPDATE audit_logs SET case_id=NULL WHERE case_id=?",
      ).bind(row.id),
      env.DANINI_DB.prepare("DELETE FROM cases WHERE id=?").bind(row.id),
    ]);
  }
  // Optional intake queue: retain only classifications/drafts for the original mail age.
  // Existing deployments without the additive migration remain unaffected when disabled.
  if (env.GMAIL_INTAKE_ENABLED === "true")
    await env.DANINI_DB.prepare("DELETE FROM gmail_intake_queue WHERE expires_at<=?").bind(now).run();
  // Customer Builder tables are optional and never touched if public Academy
  // authentication is disabled. Activation requires an applied D1 migration.
  if (env.ACADEMY_AUTH_ENABLED === "true") {
    await env.DANINI_DB.batch([
      env.DANINI_DB.prepare(
        "DELETE FROM academy_login_challenges WHERE expires_at<? OR (consumed_at IS NOT NULL AND consumed_at<?)"
      ).bind(now, now - 3600),
      env.DANINI_DB.prepare(
        "DELETE FROM academy_sessions WHERE expires_at<? OR (revoked_at IS NOT NULL AND revoked_at<?)"
      ).bind(now, now - 3600),
    ]);
  }
  await env.DANINI_DB.batch([
    env.DANINI_DB.prepare("DELETE FROM rate_buckets WHERE expires_at<?").bind(
      now,
    ),
    env.DANINI_DB.prepare("DELETE FROM auth_nonces WHERE expires_at<?").bind(
      now,
    ),
    env.DANINI_DB.prepare("DELETE FROM audit_logs WHERE created_at<?").bind(
      now - 90 * 86400,
    ),
  ]);
}
