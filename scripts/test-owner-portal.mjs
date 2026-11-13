// UI fixture only: real authentication is covered separately in portal.test.mjs.
import { createServer } from "node:http";
import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { portalHtml } from "../src/portal/page.ts";
const server = createServer((req, res) => {
  res.setHeader("content-type", "text/html");
  res.end(portalHtml("fixture-nonce"));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH || undefined,
  args: ["--no-sandbox"],
});
try {
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    let status = "awaiting_approval",
      hash = "a".repeat(64),
      summary = "Proveri dokumentaciju pre ponude.";
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const c = () => ({
      id: "11111111-1111-4111-8111-111111111111",
      reference: "DN-TEST-PORTAL",
      status,
      language: "sr",
      vertical: "subcontractor",
      created_at: 1794582000,
      draft_hash: hash,
      delivery_status: "not_sent",
    });
    await page.route("**/portal/cases", (route) =>
      route.fulfill({ json: { cases: [c()] } }),
    );
    await page.route("**/portal/case/*", (route) =>
      route.fulfill({
        json: {
          case: c(),
          intake: {
            company: "Example <script>bad()</script>",
            name: "Test",
            email: "owner@example.test",
            message: "Priprema dokumentacije",
          },
          draft: {
            generatedBy: "rules",
            summary,
            missingData: ["Period rada"],
            questions: ["Koji period?"],
            limitations: ["Nije pravni savet."],
          },
          history: [],
          messages: [],
        },
      }),
    );
    await page.route("**/portal/approve/*", (route) => {
      const d = route.request().postDataJSON();
      assert.equal(d.draftHash, hash);
      status =
        d.decision === "revise"
          ? "revision_requested"
          : d.decision === "approve"
            ? "approved"
            : "rejected";
      return route.fulfill({ json: { recorded: true, eventDelivered: true } });
    });
    await page.route("**/portal/revise/*", (route) => {
      summary = route.request().postDataJSON().summary;
      hash = "b".repeat(64);
      status = "awaiting_approval";
      return route.fulfill({ json: { recorded: true, draftHash: hash } });
    });
    await page.goto(`http://127.0.0.1:${server.address().port}/portal/`);
    await page.getByRole("button", { name: /DN-TEST-PORTAL/ }).click();
    await page.getByRole("button", { name: "Vrati na doradu" }).click();
    await page
      .getByLabel("Novi sažetak odgovora")
      .fill("Ispravljen odgovor za kupca.");
    await page.getByRole("button", { name: "Sačuvaj doradu" }).click();
    await page
      .getByText("Ispravljen odgovor za kupca.", { exact: true })
      .waitFor();
    page.on("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Odobri i pošalji" }).click();
    await page.locator(".badge").filter({ hasText: "Odobren" }).waitFor();
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
    assert.deepEqual(errors, []);
    await page.screenshot({
      path: `/tmp/danini-portal-${width}.png`,
      fullPage: true,
    });
    await page.close();
    console.log("PASS owner portal UI fixture", width, "revision and approval");
  }
} finally {
  await browser.close();
  server.close();
}
