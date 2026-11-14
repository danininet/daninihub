const { chromium, expect } = require("@playwright/test");
const fs = require("fs");
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    headless: true,
    args: ["--no-sandbox"],
  });
  fs.mkdirSync("outputs/b2b", { recursive: true });
  const results = [];
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.route("**/api/tenant-config", (route) =>
      route.fulfill({ json: { enabled: false } }),
    );
    // Both config paths must stay offline; no inference, submissions or real captcha.
    await page.route("**/api/lead/status", route => route.fulfill({ json: { enabled: false } }));
    const submissions = [];
    await page.route("**/api/**", async route => {
      if (route.request().method() !== "GET") {
        submissions.push(route.request().url());
        return route.abort();
      }
      return route.fallback();
    });
    for (const locale of ["de", "sr"]) {
      const response = await page.goto(`http://127.0.0.1:4321/${locale}/`, {
        waitUntil: "networkidle",
      });
      await expect(page.locator('#universal-advisor-form')).toBeVisible();
      await page.screenshot({
        path: `outputs/b2b/${locale}-${width}.png`,
        fullPage: true,
      });
      const data = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        h1: document.querySelectorAll("h1").length,
        lang: document.documentElement.lang,
        canonical: document.querySelector("link[rel=canonical]")?.href,
        contact: document.querySelector('#contact a[href^="mailto:info@daninihub.com"]')?.href,
      }));
      if (
        data.overflow ||
        data.h1 !== 1 ||
        data.lang !== locale ||
        response.status() !== 200 ||
        data.canonical !== `https://daninihub.com/${locale}/` ||
        !data.contact ||
        errors.length
      )
        throw Error(JSON.stringify({ data, errors }));
      // The home now hands off locally to the automotive three-question advisor.
      const source = "Volkswagen Golf 2020, 90000 km, 15000 EUR, Diesel, Schaltgetriebe.";
      await page.locator('#vehicle-source').fill(source);
      await page.locator('#universal-advisor-form button[type="submit"]').click();
      await expect(page).toHaveURL(`http://127.0.0.1:4321/${locale}/ai-savetnik/`);
      await expect(page.locator('#listing')).toHaveValue(source);
      await expect(page.locator('#advisor-cta')).toBeDisabled();
      await expect(page.locator('[data-question]')).toHaveCount(3);
      const advisor = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        lang: document.documentElement.lang,
        stored: sessionStorage.getItem('danini-advisor-source-v1')
      }));
      if (advisor.overflow || advisor.lang !== locale || advisor.stored !== null ||
          submissions.length || errors.length) throw Error(JSON.stringify({advisor, submissions, errors}));
      results.push({ width, locale, ...data, advisorHandoff: "pass", errors });
    }
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(
    "outputs/b2b/browser-results.json",
    JSON.stringify(results, null, 2),
  );
  console.log(JSON.stringify(results, null, 2));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
