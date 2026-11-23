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
          assert.match(await page.locator("main h1").innerText(),/Auto in Deutschland gefunden\? Erst prüfen, dann reisen\./,"root URL DANINI AutoDanini commercial brand");
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
        // Mock ONLY the browser test: never call Brevo or bypass real Turnstile on production.
        let submitted = null;
        await page.route("**/api/lead/status", route => route.fulfill({
          status:200,contentType:"application/json",
          body:JSON.stringify({enabled:true,channel:"brevo",turnstileSiteKey:"1x00000000000000000000AA"})
        }));
        await page.route("https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", route => route.fulfill({
          status:200, contentType:"application/javascript",
          body:"window.turnstile={render:function(el,o){el.textContent='QA mock';queueMicrotask(function(){o.callback()});return 'qa-only'},getResponse:function(){return 'QA_MOCK_TOKEN_NOT_VALID'},reset:function(){}};"
        }));
        await page.route("**/api/lead", route => {
          submitted=route.request().postDataJSON();
          route.fulfill({status:202,contentType:"application/json",
            body:JSON.stringify({accepted:true,reference:"DN-QA-BROWSER-ONLY",receiptAccepted:true})});
        });
        const businessResponse = await page.goto(base + "business/", { waitUntil: "networkidle" });
        assert.equal(businessResponse.status(), 200, locale + " business HTTP 200");
        const business = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth + 2,
          h1: document.querySelectorAll("main h1").length,
          lang: document.documentElement.lang,
          canonical: document.querySelector('link[rel="canonical"]')?.href,
          offers: document.querySelectorAll(".b-card").length,
          emailFallback: !!document.querySelector('main a[href^="mailto:info@daninihub.com"]'),
          formAvailable: !!document.querySelector("[data-business-enquiry]"),
          fallbackEmail: !!document.querySelector(".bc-fallback a[href^='mailto:info@daninihub.com']")
        }));
        assert.equal(business.overflow, false, locale + " business overflow");
        assert.equal(business.h1, 1, locale + " business H1");
        assert.equal(business.lang, locale);
        assert.match(business.canonical || "", new RegExp("/" + locale + "/business/$"));
        assert.equal(business.offers, 3, locale + " offer cards");
        assert.ok(business.emailFallback, locale + " direct contact fallback");
        assert.equal(business.formAvailable,true,locale + " Business form present");
        assert.equal(business.fallbackEmail,true,locale + " manual email fallback");
        const enquiry=page.locator("[data-business-enquiry]");
        await page.waitForFunction(() => !document.querySelector("[data-business-submit]")?.disabled,{timeout:10000});
        await enquiry.locator('[name="name"]').fill("DANINI QA Tester");
        await enquiry.locator('[name="email"]').fill("qa-test@example.invalid");
        await enquiry.locator('[name="company"]').fill("DANINI QA");
        await enquiry.locator('[name="service"]').selectOption("check");
        await enquiry.locator('[name="message"]').fill("QA browser simulation of Business Check demand; no real request.");
        await enquiry.locator('[name="consent"]').check();
        await enquiry.locator("[data-business-submit]").click();
        await page.waitForFunction(() => (document.querySelector("[data-business-status]")?.textContent || "").includes("DN-QA-BROWSER-ONLY"));
        assert.equal(submitted.kind,"business");
        assert.equal(submitted.language,locale);
        assert.equal(submitted.topic,"DANINI Business Check");
        assert.equal(submitted.consent,true);
        assert.equal(submitted.details.service,"check");
        assert.equal(submitted.turnstileToken,"QA_MOCK_TOKEN_NOT_VALID");
        assert.equal(await enquiry.locator("[data-business-submit]").isDisabled(),true);

        const infoColor = await page.locator(".b-extra-grid p:not(.b-eyebrow)").evaluate(el => getComputedStyle(el).color);
        const channels = (infoColor.match(/[0-9.]+/g) || []).slice(0, 3).map(Number);
        assert.equal(channels.length, 3, locale + " supplemental copy CSS color");
        assert.ok(Math.max(...channels) < 175, locale + " supplemental copy is too pale on white: " + infoColor);
        assert.deepEqual(errors, [], locale + " browser errors");
        await page.screenshot({ path: "outputs/b2b/" + locale + "-business-" + width + ".png", fullPage: true });
        // New AutoDanini inquiry: isolated browser simulation, no external delivery.
        submitted = null;
        const autoResponse = await page.goto(base + "auto-check/", { waitUntil: "networkidle" });
        assert.equal(autoResponse.status(), 200, locale + " AutoDanini HTTP 200");
        const auto = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth + 2,
          h1: document.querySelectorAll("main h1").length,
          lang: document.documentElement.lang,
          demo: document.querySelector(".auto-example-stamp")?.textContent?.trim() || "",
          form: !!document.querySelector("[data-auto-enquiry]"),
          fallback: !!document.querySelector('a[href^="mailto:auto@daninihub.com"]'),
          privacy: !!document.querySelector('form[data-auto-enquiry] a[href$="/datenschutz/"]')
        }));
        assert.equal(auto.overflow, false, locale + " AutoDanini overflow");
        assert.equal(auto.h1, 1, locale + " AutoDanini H1");
        assert.equal(auto.lang, locale);
        assert.match(auto.demo, /DEMO/);
        assert.ok(auto.form && auto.fallback && auto.privacy, locale + " AutoDanini contact and privacy");
        const autoEnquiry = page.locator("[data-auto-enquiry]");
        await page.waitForFunction(() => !document.querySelector("[data-auto-submit]")?.disabled, {timeout:10000});
        await autoEnquiry.locator('[name="source"]').fill("Fiktive Fahrzeugangaben: 2018, 143000 km, Preis 12500 EUR.");
        await autoEnquiry.locator('[name="location"]').fill("Duisburg");
        await autoEnquiry.locator('[name="intent"]').selectOption("documents");
        await autoEnquiry.locator('[name="name"]').fill("DANINI QA Tester");
        await autoEnquiry.locator('[name="email"]').fill("qa-test@example.invalid");
        await autoEnquiry.locator('[name="consent"]').check();
        await autoEnquiry.locator("[data-auto-submit]").click();
        await page.waitForFunction(() => (document.querySelector("[data-auto-status]")?.textContent || "").includes("DN-QA-BROWSER-ONLY"));
        assert.equal(submitted.kind, "vehicle");
        assert.equal(submitted.language, locale);
        assert.equal(submitted.details.intent, "documents");
        assert.equal(submitted.details.location, "Duisburg");
        assert.match(submitted.message, /143000 km/);
        assert.equal(submitted.consent, true);
        assert.equal(submitted.turnstileToken, "QA_MOCK_TOKEN_NOT_VALID");
        await page.screenshot({ path: "outputs/b2b/" + locale + "-auto-" + width + ".png", fullPage: true });
        // Simulate unavailable lead endpoint: the form must remain actionable,
        // and the fallback must never claim an email has been delivered.
        await page.route("**/api/lead/status", route => route.fulfill({status:503,contentType:"application/json",body:JSON.stringify({error:"unavailable"})}));
        await page.goto(base+"auto-check/",{waitUntil:"networkidle"});
        const unavailableAuto=page.locator("[data-auto-enquiry]");
        await page.waitForFunction(()=>document.querySelector("[data-auto-submit]")?.textContent?.includes("E-Mail") || document.querySelector("[data-auto-submit]")?.textContent?.includes("nacrt"));
        assert.equal(await unavailableAuto.locator("[data-auto-submit]").isDisabled(),false,locale+" Auto fallback clickable");
        await unavailableAuto.locator('[name="source"]').fill("Fiktivni oglas za proveru formulara, bez slanja na produkciju.");
        await unavailableAuto.locator('[name="intent"]').selectOption("documents");
        await unavailableAuto.locator('[name="name"]').fill("QA Tester");
        await unavailableAuto.locator('[name="email"]').fill("qa@example.invalid");
        await unavailableAuto.locator('[name="consent"]').check();
        await unavailableAuto.locator("[data-auto-submit]").click();
        assert.match(await unavailableAuto.locator("[data-auto-status]").innerText(),locale==="de"?/nicht bestätigt/:/nije potvrđeno/);
        await page.goto(base+"business/",{waitUntil:"networkidle"});
        const unavailableBusiness=page.locator("[data-business-enquiry]");
        await page.waitForFunction(()=>document.querySelector("[data-business-submit]")?.textContent?.includes("E-Mail") || document.querySelector("[data-business-submit]")?.textContent?.includes("nacrt"));
        assert.equal(await unavailableBusiness.locator("[data-business-submit]").isDisabled(),false,locale+" Business fallback clickable");
        await unavailableBusiness.locator('[name="name"]').fill("QA Tester");
        await unavailableBusiness.locator('[name="email"]').fill("qa@example.invalid");
        await unavailableBusiness.locator('[name="service"]').selectOption("check");
        await unavailableBusiness.locator('[name="message"]').fill("Fiktivni poslovni upit za proveru rezervnog režima slanja.");
        await unavailableBusiness.locator('[name="consent"]').check();
        await unavailableBusiness.locator("[data-business-submit]").click();
        assert.match(await unavailableBusiness.locator("[data-business-status]").innerText(),locale==="de"?/nicht bestätigt/:/nije potvrđeno/);
        assert.deepEqual(errors.filter(message => !message.includes("status of 503 (Service Unavailable)")), [], locale + " unexpected browser errors excluding intentional 503 fallback test");
        results.push({ locale, width, home, business, auto, errors });
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }
  fs.writeFileSync("outputs/b2b/browser-results.json", JSON.stringify(results, null, 2));
  console.log("PASS " + results.length + " DE/SR DANINI brand and Business browser smoke checks");
})().catch(error => { console.error(error); process.exit(1); });
