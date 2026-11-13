import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import { validateIntake } from "../../src/security/validation.ts";
import { readJson, digest, hmac } from "../../src/security/http.ts";
import { intake, caseStatus, approve } from "../../src/api/intake.ts";
import { analyze, validateDraft } from "../../src/ai/analyze.ts";
import { mail } from "../../src/lib/mail.ts";
import { env, valid, req, captcha } from "./helpers.mjs";
test("validates B2B fields and rejects unsafe/oversized uploads", () => {
  assert.equal(validateIntake(valid()).country, "DE");
  for (const patch of [
    { consent: false },
    { country: "XX" },
    { vertical: "legal" },
    { email: "bad@" },
    { files: [{ name: "a.pdf", type: "application/pdf", data: "x" }] },
    { message: "a".repeat(4001) },
  ])
    assert.throws(() => validateIntake({ ...valid(), ...patch }));
});
test("bounds actual streamed body regardless of Content-Length", async () => {
  await assert.rejects(
    readJson(req({ a: "x".repeat(100) }), 20),
    (e) => e.status === 413,
  );
});
test("intake requires configuration, exact origin and CAPTCHA hostname/action", async () => {
  const e = env();
  assert.equal(
    (await intake(req(), { ...e, B2B_ACTIVE: "false" })).status,
    503,
  );
  await assert.rejects(
    intake(
      new Request(req(), { headers: { origin: "https://attacker.test" } }),
      e,
    ),
    (x) => x.status === 403,
  );
  const old = globalThis.fetch;
  try {
    globalThis.fetch = async () =>
      Response.json({
        success: true,
        hostname: "attacker.test",
        action: "b2b-intake",
      });
    await assert.rejects(intake(req(), e), (x) => x.status === 400);
  } finally {
    globalThis.fetch = old;
  }
});
test("records once, starts workflow, denies altered replay and unauthorized case reads", async () => {
  const e = env(),
    old = globalThis.fetch;
  let starts = 0;
  e.INTAKE_WORKFLOW.create = async () => {
    starts++;
  };
  try {
    globalThis.fetch = captcha;
    const a = await (await intake(req(), e)).json();
    assert.ok(a.reference.startsWith("DN-"));
    assert.equal((await intake(req(), e)).status, 202);
    assert.equal(starts, 1);
    assert.equal(
      e.DANINI_DB.db.prepare("SELECT count(*) AS n FROM cases").get().n,
      1,
    );
    await assert.rejects(
      intake(req({ ...valid(), company: "Other Company" }), e),
      (x) => x.status === 409,
    );
    assert.equal(
      (await caseStatus(new Request("https://danini.test"), e, a.caseId))
        .status,
      404,
    );
    assert.equal(
      (
        await caseStatus(
          new Request("https://danini.test", {
            headers: { authorization: "Bearer " + a.accessToken },
          }),
          e,
          a.caseId,
        )
      ).status,
      200,
    );
  } finally {
    globalThis.fetch = old;
  }
});
test("workflow start failure does not falsely return accepted", async () => {
  const e = env(),
    old = globalThis.fetch;
  e.INTAKE_WORKFLOW = {
    async create() {
      throw Error();
    },
    async get() {
      throw Error();
    },
  };
  try {
    globalThis.fetch = captcha;
    await assert.rejects(intake(req(), e), (x) => x.status === 503);
    assert.equal(
      e.DANINI_DB.db.prepare("SELECT workflow_started FROM cases").get()
        .workflow_started,
      0,
    );
  } finally {
    globalThis.fetch = old;
  }
});
test("director approval binds document hash and rejects replay", async () => {
  const e = env(),
    old = globalThis.fetch;
  try {
    globalThis.fetch = captcha;
    const created = await (await intake(req(), e)).json();
    const id = created.caseId,
      hash = "a".repeat(64);
    e.DANINI_DB.db
      .prepare(
        "UPDATE cases SET status='awaiting_approval',review_deadline=unixepoch()+259200,draft_hash=? WHERE id=?",
      )
      .run(hash, id);
    const body = JSON.stringify({ decision: "approve", draftHash: hash }),
      timestamp = String(Math.floor(Date.now() / 1000)),
      nonce = "test-director-nonce-123456";
    const path = "/portal/approve/" + id;
    const signature = await hmac(
      e.DIRECTOR_HMAC_SECRET,
      ["POST", path, timestamp, nonce, await digest(body)].join("\n"),
    );
    const request = new Request("https://danini.test" + path, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-danini-timestamp": timestamp,
        "x-danini-nonce": nonce,
        "x-danini-signature": signature,
      },
      body,
    });
    assert.equal((await approve(request.clone(), e, id)).status, 200);
    await assert.rejects(
      approve(request.clone(), e, id),
      (x) => x.status === 409,
    );
    assert.equal(
      e.DANINI_DB.db
        .prepare("SELECT approved_hash FROM cases WHERE id=?")
        .get(id).approved_hash,
      hash,
    );
  } finally {
    globalThis.fetch = old;
  }
});
test("disabled AI returns honest rules draft without provider call", async () => {
  const old = globalThis.fetch;
  globalThis.fetch = async () => {
    throw Error("must not call provider");
  };
  try {
    const d = await analyze({}, valid());
    assert.equal(d.generatedBy, "rules");
    assert.ok(validateDraft(d));
    assert.equal(
      validateDraft({ ...d, questions: ["1", "2", "3", "4"] }),
      false,
    );
    await assert.rejects(
      analyze({ AI_ENABLED: "true" }, valid()),
      /AI_NOT_APPROVED/,
    );
  } finally {
    globalThis.fetch = old;
  }
});
test("uncertain mail response never sends duplicate automatically", async () => {
  const e = env(),
    old = globalThis.fetch;
  let calls = 0;
  try {
    globalThis.fetch = captcha;
    const { caseId } = await (await intake(req(), e)).json();
    Object.assign(e, {
      BREVO_API_KEY: "test",
      DANINI_BREVO_SENDER: "sender@example.test",
      DANINI_NOTIFY_TO: "owner@example.test",
    });
    globalThis.fetch = async () => {
      calls++;
      throw Error("timeout after possible acceptance");
    };
    assert.equal(await mail(e, caseId, "receipt", {}), false);
    assert.equal(await mail(e, caseId, "receipt", {}), false);
    assert.equal(calls, 1);
  } finally {
    globalThis.fetch = old;
  }
});
test("expiry and case lookup use indexes", () => {
  const e = env();
  for (const [query, param] of [
    ["SELECT id FROM cases WHERE expires_at<? ORDER BY expires_at LIMIT 25", 1],
    ["SELECT object_key FROM case_files WHERE case_id=?", "x"],
    ["SELECT * FROM cases WHERE request_key=?", "x"],
  ]) {
    const rows = e.DANINI_DB.db
      .prepare("EXPLAIN QUERY PLAN " + query)
      .all(param);
    assert.ok(
      rows.some((r) => /USING.*INDEX/.test(r.detail)),
      JSON.stringify(rows),
    );
    assert.ok(
      rows.every((r) => !/^SCAN cases/.test(r.detail)),
      JSON.stringify(rows),
    );
  }
});

test("plain-text attachments are stored privately and workflow events are recorded", async () => {
  const e = env(),
    old = globalThis.fetch;
  try {
    globalThis.fetch = captcha;
    const result = await (
      await intake(
        req({
          ...valid(),
          files: [
            {
              name: "product.txt",
              type: "text/plain",
              data: "Product material: steel",
            },
          ],
        }),
        e,
      )
    ).json();
    const stored = await e.DOCUMENTS.get(`cases/${result.caseId}/intake.json`);
    assert.equal(
      (await stored.json()).files[0].data,
      "Product material: steel",
    );
    assert.equal(
      e.DANINI_DB.db.prepare("SELECT count(*) AS n FROM workflow_events").get()
        .n,
      1,
    );
  } finally {
    globalThis.fetch = old;
  }
});
test("forged director signature is rejected before decision", async () => {
  const e = env();
  const id = crypto.randomUUID();
  const request = new Request("https://danini.test/portal/approve/" + id, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-danini-timestamp": String(Math.floor(Date.now() / 1000)),
      "x-danini-nonce": "forged-nonce-1234567890",
      "x-danini-signature": "0".repeat(64),
    },
    body: JSON.stringify({ decision: "approve", draftHash: "a".repeat(64) }),
  });
  await assert.rejects(approve(request, e, id), (x) => x.status === 401);
});
test("expired case capability cannot retrieve status", async () => {
  const e = env(),
    old = globalThis.fetch;
  try {
    globalThis.fetch = captcha;
    const c = await (await intake(req(), e)).json();
    e.DANINI_DB.db
      .prepare("UPDATE cases SET expires_at=0 WHERE id=?")
      .run(c.caseId);
    assert.equal(
      (
        await caseStatus(
          new Request("https://danini.test", {
            headers: { authorization: "Bearer " + c.accessToken },
          }),
          e,
          c.caseId,
        )
      ).status,
      404,
    );
  } finally {
    globalThis.fetch = old;
  }
});
