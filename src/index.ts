import { ownerPortal } from "./portal/page";
import legacy from "../workers/danini-intake.mjs";
import type { Env } from "./lib/env";
import { json, HttpError } from "./security/http";
import {
  intake,
  ready,
  caseStatus,
  approve,
  directorReview,
  directorCases,
  reviseDraft,
} from "./api/intake";
import { cleanup } from "./security/retention";
export { IntakeWorkflow } from "./workflows/intake";
export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url),
      p = url.pathname;
    try {
      if (p === "/api/health" && request.method === "GET")
        return json({ status: "ok" }, 200);
      if (p === "/api/tenant-config" && request.method === "GET")
        return json({
          name: "DANINI",
          enabled: ready(env),
          siteKey: ready(env) ? env.DANINI_TURNSTILE_SITEKEY : null,
          languages: ["de", "sr"],
          uploads: { types: ["text/plain"], maxFiles: 2, maxBytes: 32000 },
        });
      if (p === "/api/intake")
        return request.method === "POST"
          ? await intake(request, env)
          : json({ error: "method_not_allowed" }, 405);
      const caseMatch = p.match(/^\/api\/case\/([a-f0-9-]{36})$/);
      if (caseMatch)
        return request.method === "GET"
          ? await caseStatus(request, env, caseMatch[1])
          : json({ error: "method_not_allowed" }, 405);
      if ((p === "/portal" || p === "/portal/") && request.method === "GET")
        return await ownerPortal(request, env);
      if (p === "/portal/cases" && request.method === "GET")
        return await directorCases(request, env);
      const revisionMatch = p.match(/^\/portal\/revise\/([a-f0-9-]{36})$/);
      if (revisionMatch)
        return request.method === "POST"
          ? await reviseDraft(request, env, revisionMatch[1])
          : json({ error: "method_not_allowed" }, 405);
      const approveMatch = p.match(/^\/portal\/approve\/([a-f0-9-]{36})$/);
      if (approveMatch)
        return request.method === "POST"
          ? await approve(request, env, approveMatch[1])
          : json({ error: "method_not_allowed" }, 405);
      const reviewMatch = p.match(/^\/portal\/case\/([a-f0-9-]{36})$/);
      if (reviewMatch)
        return request.method === "GET"
          ? await directorReview(request, env, reviewMatch[1])
          : json({ error: "method_not_allowed" }, 405);
      if (p.startsWith("/portal/")) return json({ error: "not_found" }, 404);
      // Preserve the existing payment, webhook, download and lead handlers verbatim.
      if (p.startsWith("/api/")) return await legacy.fetch(request, env);
      return env.ASSETS.fetch(request);
    } catch (error) {
      return json(
        {
          error:
            error instanceof HttpError ? error.message : "service_unavailable",
        },
        error instanceof HttpError ? error.status : 503,
      );
    }
  },
  async scheduled(
    _event: ScheduledController,
    env: Env,
    ctx: ExecutionContext,
  ) {
    ctx.waitUntil(cleanup(env));
  },
};
