const { chromium } = require("@playwright/test");
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
    await page.route("**/api/tenant-config", (route) =>
      route.fulfill({ json: { enabled: false } }),
    );
    for (const locale of ["de", "sr"]) {
      await page.goto(`http://127.0.0.1:4321/${locale}/`, {
        waitUntil: "networkidle",
      });
      await page.screenshot({
        path: `outputs/b2b/${locale}-${width}.png`,
        fullPage: true,
      });
      const data = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        h1: document.querySelectorAll("h1").length,
        lang: document.documentElement.lang,
        canonical: document.querySelector("link[rel=canonical]")?.href,
        formStatus: document.querySelector("#form-status")?.textContent,
        buttonDisabled: document.querySelector("button[type=submit]")?.disabled,
      }));
      if (
        data.overflow ||
        data.h1 !== 1 ||
        data.lang !== locale ||
        !data.buttonDisabled ||
        !data.formStatus ||
        errors.length
      )
        throw Error(JSON.stringify({ data, errors }));
      results.push({ width, locale, ...data, errors });
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
