import {
  WorkflowEntrypoint,
  type WorkflowEvent,
  type WorkflowStep,
} from "cloudflare:workers";
import type { Env } from "../lib/env";
import { analyze, auriFilter } from "../ai/analyze";
import { digest } from "../security/http";
import { audit } from "../api/intake";
import { mail } from "../lib/mail";
export class IntakeWorkflow extends WorkflowEntrypoint<
  Env,
  { caseId: string }
> {
  async run(event: WorkflowEvent<{ caseId: string }>, step: WorkflowStep) {
    const id = event.payload.caseId;
    await step.do("receipt-and-director-notification", async () => {
      const object = await this.env.DOCUMENTS.get(`cases/${id}/intake.json`);
      if (!object) throw Error("INTAKE_MISSING");
      const input = await object.json<any>();
      const row = await this.env.DANINI_DB.prepare(
        "SELECT reference FROM cases WHERE id=?",
      )
        .bind(id)
        .first<{ reference: string }>();
      if (!row) throw Error("CASE_MISSING");
      await mail(this.env, id, "receipt", {
        to: [{ email: input.email }],
        templateId: input.language === "de" ? 48 : 49,
        params: { REFERENCE: row.reference },
      });
      await mail(this.env, id, "director", {
        to: [{ email: this.env.DANINI_NOTIFY_TO }],
        subject: `DANINI ${row.reference}: ${input.vertical}`,
        textContent: `New business intake. Reference: ${row.reference}\nCase: ${id}\nUse the authenticated director review tool. No report is released without a decision.`,
      });
      return { recorded: true };
    });
    await step.do(
      "prepare-administrative-draft",
      {
        retries: { limit: 2, delay: "10 seconds", backoff: "exponential" },
        timeout: "1 minute",
      },
      async () => {
        const object = await this.env.DOCUMENTS.get(`cases/${id}/intake.json`);
        if (!object) throw Error("INTAKE_MISSING");
        const input = await object.json();
        const draft = await analyze(this.env, input);
        const serialized = JSON.stringify(draft),
          hash = await digest(serialized);
        await this.env.DOCUMENTS.put(`cases/${id}/draft.json`, serialized, {
          httpMetadata: { contentType: "application/json" },
        });
        await this.env.DANINI_DB.prepare(
          "UPDATE cases SET status='awaiting_approval',draft_hash=?,review_deadline=? WHERE id=? AND status='received'",
        )
          .bind(hash, Math.floor(Date.now() / 1000) + 72 * 3600, id)
          .run();
        await audit(this.env, id, "draft_prepared");
        return { hash };
      },
    );
    // Payload contains only a decision identifier. The authenticated D1 decision,
    // exact draft hash and expiry are the authority, not the event payload.
    try {
      await step.waitForEvent("director-review", {
        type: "director-decision",
        timeout: "72 hours",
      });
    } catch {
      await step.do("review-deadline", async () => {
        await this.env.DANINI_DB.prepare(
          "UPDATE cases SET status='review_expired' WHERE id=? AND status IN ('awaiting_approval','revision_requested')",
        )
          .bind(id)
          .run();
        await audit(this.env, id, "review_deadline_reached");
        return true;
      });
    }
    return step.do("release-approved-report", async () => {
      const row = await this.env.DANINI_DB.prepare(
        "SELECT status,reference,draft_hash,approved_hash,expires_at FROM cases WHERE id=?",
      )
        .bind(id)
        .first<any>();
      if (
        !row ||
        row.status !== "approved" ||
        row.expires_at <= Date.now() / 1000 ||
        row.draft_hash !== row.approved_hash
      )
        return { released: false };
      const object = await this.env.DOCUMENTS.get(`cases/${id}/draft.json`);
      if (!object) throw Error("DRAFT_MISSING");
      const text = await object.text();
      if ((await digest(text)) !== row.approved_hash)
        throw Error("DRAFT_CHANGED");
      const inputObject = await this.env.DOCUMENTS.get(
        `cases/${id}/intake.json`,
      );
      if (!inputObject) throw Error("INTAKE_MISSING");
      const input = await inputObject.json<any>();
      const draft = JSON.parse(text);
      if (auriFilter(draft, true).status !== "PASS")
        throw Error("DRAFT_SCHEMA_FAILED");
      const de = draft.language === "de";
      const report = [
        `DANINI | ${row.reference}`,
        draft.generatedBy === "ai"
          ? de
            ? "KI-unterstützter, menschlich freigegebener administrativer Bericht"
            : "Administrativni izveštaj uz AI podršku, odobren od odgovornog lica"
          : de
            ? "Regelbasierter, menschlich freigegebener administrativer Bericht"
            : "Administrativni izveštaj na osnovu pravila, odobren od odgovornog lica",
        draft.summary,
        ...draft.missingData.map((x: string) => "- " + x),
        ...(draft.questions || []).map((x: string) => "? " + x),
        ...draft.limitations,
      ].join("\n\n");
      const accepted = await mail(this.env, id, "final", {
        to: [{ email: input.email }],
        subject: `DANINI | ${row.reference}`,
        textContent: report,
      });
      await this.env.DANINI_DB.prepare(
        "UPDATE cases SET delivery_status=? WHERE id=?",
      )
        .bind(accepted ? "provider_accepted" : "needs_reconciliation", id)
        .run();
      await audit(
        this.env,
        id,
        accepted ? "report_provider_accepted" : "delivery_needs_reconciliation",
      );
      return { released: accepted, deliveryConfirmed: false };
    });
  }
}
