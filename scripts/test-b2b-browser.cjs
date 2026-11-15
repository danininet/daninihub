"use strict";
const { chromium } = require("@playwright/test");
const fs = require("node:fs");
const assert = require("node:assert/strict");

/**
 * Bilingual DANINI brand + Business browser smoke against local Wrangler.
 * This does NOT attempt a customer submission or prove Brevo mail delivery.
 * Backend intake security and fail-closed behavior are separately tested.
 */
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    headless: true,
    args: ["--no-sandbox"],
  });
  fs.mkdirSync("outputs/b2b", { recursive: true });
  const results = [];
  try {
    for (const width of [1440, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const errors = [];
      page.on("pageerror", e => errors.push(e.message));
      page.on("console", message => {
        if (message.type() === "error") errors.push(message.text());
      });
      for (const locale of ["de", "sr"]) {
        const base = "http://127.0.0.1:4321/" + locale + "/";
        if (locale === "de") {
          const rootResponse = await page.goto("http://127.0.0.1:4321/",{waitUntil:"networkidle"});
          assert.equal(rootResponse.status(),200,"root URL HTTP 200");
          assert.match(await page.locator("main h1").innerText(),/Klare Prozesse/,"root URL DANINI brand");
        }
        const brandResponse = await page.goto(base, { waitUntil: "networkidle" });
        assert.equal(brandResponse.status(), 200, locale + " brand HTTP 200");
        const home = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth + 2,
          h1: document.querySelectorAll("main h1").length,
          lang: document.documentElement.lang,
          choices: document.querySelectorAll(".d-card").length,
          businessLink: !!document.querySelector('main a[href$="/business/"]'),
          autoLink: !!document.querySelector('main a[href$="/auto-check/"]')
        }));
        assert.equal(home.overflow, false, locale + " brand overflow");
        assert.equal(home.h1, 1, locale + " brand heading");
        assert.equal(home.lang, locale);
        assert.equal(home.choices, 2, locale + " two offers");
        assert.ok(home.businessLink && home.autoLink, locale + " business/auto choice");
        await page.screenshot({ path: "outputs/b2b/" + locale + "-danini-" + width + ".png", fullPage: true });
        const businessResponse = await page.goto(base + "business/", { waitUntil: "networkidle" });
        assert.equal(businessResponse.status(), 200, locale + " business HTTP 200");
        const business = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth + 2,
          h1: document.querySelectorAll("main h1").length,
          lang: document.documentElement.lang,
          canonical: document.querySelector('link[rel="canonical"]')?.href,
          offers: document.querySelectorAll(".b-card").length,
          emailFallback: !!document.querySelector('main a[href^="mailto:info@daninihub.com"]'),
          noFakeForm: !document.querySelector("#intake")
        }));
        assert.equal(business.overflow, false, locale + " business overflow");
        assert.equal(business.h1, 1, locale + " business H1");
        assert.equal(business.lang, locale);
        assert.match(business.canonical || "", new RegExp("/" + locale + "/business/$"));
        assert.equal(business.offers, 3, locale + " offer cards");
        assert.ok(business.emailFallback, locale + " direct contact fallback");
        assert.ok(business.noFakeForm, locale + " must not expose unverified checkout/form");
        const infoColor = await page.locator(".b-extra-grid p:not(.b-eyebrow)").evaluate(el => getComputedStyle(el).color);
        const channels = (infoColor.match(/[0-9.]+/g) || []).slice(0, 3).map(Number);
        assert.equal(channels.length, 3, locale + " supplemental copy CSS color");
        assert.ok(Math.max(...channels) < 175, locale + " supplemental copy is too pale on white: " + infoColor);
        assert.deepEqual(errors, [], locale + " browser errors");
        await page.screenshot({ path: "outputs/b2b/" + locale + "-business-" + width + ".png", fullPage: true });
        results.push({ locale, width, home, business, errors });
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }
  fs.writeFileSync("outputs/b2b/browser-results.json", JSON.stringify(results, null, 2));
  console.log("PASS " + results.length + " DE/SR DANINI brand and Business browser smoke checks");
})().catch(error => { console.error(error); process.exit(1); });
