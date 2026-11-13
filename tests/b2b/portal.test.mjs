import test from "node:test";
import assert from "node:assert/strict";
import { env, valid, req, captcha } from "./helpers.mjs";
import {
  intake,
  approve,
  reviseDraft,
  directorCases,
  directorReview,
} from "../../src/api/intake.ts";
import { digest, hmac } from "../../src/security/http.ts";
import { authorizeOwner } from "../../src/security/access.ts";
import { analyze } from "../../src/ai/analyze.ts";
async function signed(e, path, data) {
  const body = data ? JSON.stringify(data) : "",
    method = data ? "POST" : "GET",
    time = String(Math.floor(Date.now() / 1000)),
    nonce = crypto.randomUUID();
  return new Request(e.SITE_ORIGIN + path, {
    method,
    headers: {
      "content-type": "application/json",
      "x-danini-timestamp": time,
      "x-danini-nonce": nonce,
      "x-danini-signature": await hmac(
        e.DIRECTOR_HMAC_SECRET,
        [method, path, time, nonce, await digest(body)].join("\n"),
      ),
    },
    body: body || undefined,
  });
}
test("portal fails closed without Access configuration and rejects forged assertion", async () => {
  await assert.rejects(
    authorizeOwner(new Request("https://danini.test/portal/"), {}),
    (e) => e.status === 503,
  );
  await assert.rejects(
    authorizeOwner(
      new Request("https://danini.test/portal/", {
        headers: { "cf-access-jwt-assertion": "forged" },
      }),
      {
        ACCESS_TEAM_DOMAIN: "https://test.cloudflareaccess.com",
        ACCESS_AUD: "aud",
        DIRECTOR_EMAIL: "owner@example.test",
      },
    ),
    (e) => e.status === 401,
  );
});
test("owner list/detail require auth; revision invalidates old hash, archives, audits and caps cycles", async () => {
  const e = env(),
    old = globalThis.fetch;
  try {
    globalThis.fetch = captcha;
    const { caseId: id } = await (await intake(req(), e)).json();
    const draft = await analyze(e, valid());
    let hash = await digest(JSON.stringify(draft));
    await e.DOCUMENTS.put(`cases/${id}/draft.json`, JSON.stringify(draft));
    e.DANINI_DB.db
      .prepare(
        "UPDATE cases SET status='awaiting_approval',draft_hash=?,review_deadline=unixepoch()+259200 WHERE id=?",
      )
      .run(hash, id);
    await assert.rejects(
      directorCases(new Request(e.SITE_ORIGIN + "/portal/cases"), e),
      (x) => x.status === 401,
    );
    assert.equal(
      (await (await directorCases(await signed(e, "/portal/cases"), e)).json())
        .cases.length,
      1,
    );
    const detail = await (
      await directorReview(await signed(e, "/portal/case/" + id), e, id)
    ).json();
    assert.equal(detail.intake.company, valid().company);
    for (let i = 0; i < 3; i++) {
      await approve(
        await signed(e, "/portal/approve/" + id, {
          decision: "revise",
          draftHash: hash,
        }),
        e,
        id,
      );
      assert.equal(
        e.DANINI_DB.db.prepare("SELECT status FROM cases").get().status,
        "revision_requested",
      );
      const oldHash = hash;
      const changed = await reviseDraft(
        await signed(e, "/portal/revise/" + id, {
          draftHash: hash,
          summary: "Human revision " + i,
        }),
        e,
        id,
      );
      hash = (await changed.json()).draftHash;
      assert.notEqual(hash, oldHash);
      await assert.rejects(
        approve(
          await signed(e, "/portal/approve/" + id, {
            decision: "approve",
            draftHash: oldHash,
          }),
          e,
          id,
        ),
        (x) => x.status === 409,
      );
    }
    assert.equal(
      e.DANINI_DB.db
        .prepare(
          "SELECT count(*) AS n FROM case_files WHERE kind='draft_revision'",
        )
        .get().n,
      3,
    );
    await assert.rejects(
      approve(
        await signed(e, "/portal/approve/" + id, {
          decision: "revise",
          draftHash: hash,
        }),
        e,
        id,
      ),
      (x) => x.message === "revision_limit_reached",
    );
    await assert.rejects(
      reviseDraft(
        await signed(e, "/portal/revise/" + id, {
          draftHash: hash,
          summary: "Fourth",
        }),
        e,
        id,
      ),
      (x) => x.message === "revision_limit_reached",
    );
    assert.equal(
      e.DANINI_DB.db.prepare("SELECT count(*) AS n FROM mail_outbox").get().n,
      0,
    );
  } finally {
    globalThis.fetch = old;
  }
});

test("Access verifies signature, audience, expiry, owner email and cross-origin writes", async () => {
  const { generateKeyPair, exportJWK, SignJWT } = await import("jose");
  const { publicKey, privateKey } = await generateKeyPair("RS256");
  const jwk = await exportJWK(publicKey);
  jwk.kid = "test-owner";
  const old = globalThis.fetch;
  globalThis.fetch = async () => Response.json({ keys: [jwk] });
  const e = {
    ACCESS_TEAM_DOMAIN: "https://owner-test.cloudflareaccess.com",
    ACCESS_AUD: "owner-aud",
    DIRECTOR_EMAIL: "owner@example.test",
    SITE_ORIGIN: "https://danini.test",
  };
  async function token(patch = {}) {
    return new SignJWT({ email: "owner@example.test", ...patch })
      .setProtectedHeader({ alg: "RS256", kid: "test-owner" })
      .setSubject("owner-id")
      .setIssuedAt()
      .setIssuer(e.ACCESS_TEAM_DOMAIN)
      .setAudience(patch.aud || e.ACCESS_AUD)
      .setExpirationTime(patch.exp || "1h")
      .sign(privateKey);
  }
  try {
    const good = await token();
    const request = (t, method = "GET", origin = e.SITE_ORIGIN) =>
      new Request(e.SITE_ORIGIN + "/portal/", {
        method,
        headers: { "cf-access-jwt-assertion": t, origin },
      });
    assert.equal(await authorizeOwner(request(good), e), "owner@example.test");
    await assert.rejects(
      authorizeOwner(request(good, "POST", "https://evil.test"), e),
      (x) => x.status === 403,
    );
    for (const patch of [
      { email: "outsider@example.test" },
      { aud: "other-app" },
      { exp: 1 },
    ])
      await assert.rejects(
        authorizeOwner(request(await token(patch)), e),
        (x) => x.status === 401,
      );
  } finally {
    globalThis.fetch = old;
  }
});
