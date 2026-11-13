import test from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import { env, valid, req, captcha } from "./helpers.mjs";
import { intake } from "../../src/api/intake.ts";
const bundle = await build({
  entryPoints: ["src/workflows/intake.ts"],
  bundle: true,
  write: false,
  format: "esm",
  platform: "neutral",
  plugins: [
    {
      name: "workflow-test-runtime",
      setup(build) {
        build.onResolve({ filter: /^cloudflare:workers$/ }, () => ({
          path: "cloudflare:workers",
          namespace: "stub",
        }));
        build.onLoad({ filter: /.*/, namespace: "stub" }, () => ({
          contents:
            "export class WorkflowEntrypoint {constructor(ctx,env){this.env=env;}}",
        }));
      },
    },
  ],
});
const { IntakeWorkflow } = await import(
  "data:text/javascript;base64," +
    Buffer.from(bundle.outputFiles[0].text).toString("base64")
);
for (const scenario of ["approve", "reject", "timeout", "tampered"])
  test(
    "workflow " + scenario + " enforces persisted decision and exact draft",
    async () => {
      const e = env(),
        old = globalThis.fetch;
      let finalSends = 0;
      try {
        globalThis.fetch = captcha;
        const { caseId } = await (await intake(req(), e)).json();
        globalThis.fetch = async (_url, options) => {
          const msg = JSON.parse(options.body);
          if (msg.textContent?.includes("administrative report")) finalSends++;
          return Response.json({ messageId: "test-provider-id" });
        };
        const step = {
          async do(_name, config, fn) {
            return (fn || config)();
          },
          async waitForEvent(_name, options) {
            assert.equal(options.timeout, "72 hours");
            if (scenario === "timeout") throw Error("timeout");
            const db = e.DANINI_DB.db;
            if (scenario === "reject")
              db.prepare(
                "UPDATE cases SET status='rejected',decision_id='test' WHERE id=?",
              ).run(caseId);
            else
              db.prepare(
                "UPDATE cases SET status='approved',approved_hash=draft_hash,decision_id='test' WHERE id=?",
              ).run(caseId);
            if (scenario === "tampered")
              await e.DOCUMENTS.put(
                `cases/${caseId}/draft.json`,
                '{"tampered":true}',
              );
            return { payload: { decisionId: "test" } };
          },
        };
        const run = () =>
          new IntakeWorkflow({}, e).run({ payload: { caseId } }, step);
        if (scenario === "tampered")
          await assert.rejects(run(), /DRAFT_CHANGED/);
        else {
          const result = await run();
          assert.equal(result.released, scenario === "approve");
        }
        assert.equal(finalSends, scenario === "approve" ? 1 : 0);
        if (scenario === "timeout")
          assert.equal(
            e.DANINI_DB.db.prepare("SELECT status FROM cases").get().status,
            "review_expired",
          );
      } finally {
        globalThis.fetch = old;
      }
    },
  );
