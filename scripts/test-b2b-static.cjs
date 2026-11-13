const fs = require("fs"),
  path = require("path"),
  assert = require("assert/strict");
const root = path.resolve("dist");
const locales = ["de", "sr"];
let count = 0;
for (const locale of locales)
  for (const slug of [
    "",
    "cbam",
    "subcontractor",
    "nearshoring",
    "impressum",
    "datenschutz",
    "agb",
    "ai-transparenz",
  ]) {
    const file = path.join(root, locale, slug, "index.html"),
      html = fs.readFileSync(file, "utf8");
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, file);
    assert.ok(html.includes(`lang="${locale}"`), file);
    assert.ok(
      html.includes('hreflang="de"') && html.includes('hreflang="sr"'),
      file,
    );
    assert.ok(
      !/wa\.me|Aukcije|Auto Tender|Informativni pilot/.test(html),
      file,
    );
    for (const m of html.matchAll(
      /(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g,
    )) {
      const url = m[1];
      if (url.startsWith("/api/")) continue;
      const candidate = path.join(root, url);
      assert.ok(
        [
          candidate,
          candidate + ".html",
          path.join(candidate, "index.html"),
        ].some((p) => fs.existsSync(p)),
        `${file}: missing ${url}`,
      );
    }
    const legal = [
      "impressum",
      "datenschutz",
      "agb",
      "ai-transparenz",
    ].includes(slug);
    assert.equal(html.includes("noindex,follow"), legal, file);
    count++;
  }
const redirects = fs
  .readFileSync(path.join(root, "_redirects"), "utf8")
  .trim()
  .split("\n")
  .map((line) => line.split(/\s+/));
assert.equal(redirects.length, 9);
const map = new Map(redirects.map(([a, b]) => [a, b]));
for (const [from, to, status] of redirects) {
  assert.equal(status, "301");
  assert.notEqual(from, to);
  assert.ok(!map.has(to), "redirect chain " + from);
}
console.log(
  `PASS ${count} B2B pages, language/SEO/local links, 9 redirects, legal draft isolation.`,
);
