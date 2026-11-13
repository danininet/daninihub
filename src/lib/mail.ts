import type { Env } from "./env";
// Durable at-most-once submission. An ambiguous provider response remains
// 'submitting' for operator reconciliation; it is never blindly retried.
export async function mail(
  env: Env,
  caseId: string,
  kind: string,
  message: Record<string, unknown>,
) {
  if (!env.BREVO_API_KEY || !env.DANINI_BREVO_SENDER || !env.DANINI_NOTIFY_TO)
    throw Error("MAIL_NOT_CONFIGURED");
  if (env.MAIL_TEST_RECIPIENT) {
    const recipients = [message.to, message.cc, message.bcc].flatMap((x) =>
      Array.isArray(x) ? x : [],
    );
    if (
      !recipients.length ||
      recipients.some(
        (r: any) =>
          typeof r?.email !== "string" ||
          r.email.toLowerCase() !== env.MAIL_TEST_RECIPIENT!.toLowerCase(),
      )
    )
      throw Error("TEST_RECIPIENT_ONLY");
  }
  const id = `${caseId}:${kind}`;
  const claim = await env.DANINI_DB.prepare(
    "INSERT OR IGNORE INTO mail_outbox(id,case_id,state,created_at) VALUES (?,?,'submitting',?)",
  )
    .bind(id, caseId, Math.floor(Date.now() / 1000))
    .run();
  if (claim.meta.changes !== 1) {
    const old = await env.DANINI_DB.prepare(
      "SELECT state FROM mail_outbox WHERE id=?",
    )
      .bind(id)
      .first<{ state: string }>();
    return old?.state === "accepted";
  }
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "DANINI", email: env.DANINI_BREVO_SENDER },
        replyTo: { email: env.DANINI_BREVO_REPLYTO || env.DANINI_BREVO_SENDER },
        ...message,
      }),
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) {
      await env.DANINI_DB.prepare(
        "UPDATE mail_outbox SET state='rejected' WHERE id=?",
      )
        .bind(id)
        .run();
      return false;
    }
    const data = await response.json<any>();
    if (!data.messageId) return false;
    await env.DANINI_DB.prepare(
      "UPDATE mail_outbox SET state='accepted',provider_id=? WHERE id=?",
    )
      .bind(data.messageId, id)
      .run();
    return true;
  } catch {
    return false;
  }
}
