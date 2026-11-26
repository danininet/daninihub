const fs = require("fs"),
  path = require("path"),
  assert = require("assert/strict");
const root = path.resolve("dist");
const locales = ["de", "sr"];
const rootHtml = fs.readFileSync(path.join(root,"index.html"),"utf8");
assert.ok(rootHtml.includes("Mit KI ein eigenes Online-Business entwickeln."),"Root URL must lead with DANINI Akademie, not merely service listings");
assert.ok(rootHtml.includes("/de/akademija/"),"Root missing education CTA");
assert.ok(rootHtml.includes("DANINI Business"),"Root URL must offer DANINI Business");
let count = 0;
for (const locale of locales)
  for (const slug of [
    "",
    "akademija",
    "business",
    "auto-check",
    "ai-savetnik",
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
    // A muted "Aukcije (Uskoro)" label is allowed; linking buyers to unfinished auction/tender services is not.
    assert.ok(!/wa\.me|Informativni pilot/.test(html), file);
    assert.ok(!/<a\b[^>]*href=["'][^"']*\/(?:auctions|tender)(?:\.html|\/)/i.test(html), file);
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
    const shouldNoindex = slug === "ai-transparenz";
    assert.equal(html.includes("noindex,follow"), shouldNoindex, file);
    if (["impressum", "datenschutz", "agb"].includes(slug)) {
      assert.ok(!/\[POPUNITI:|Nacrt za proveru|pravna verifikacija u toku|kontakt@daninihub\.com/i.test(html), file);
      assert.ok(html.includes("info@daninihub.com"), file);
    }
    count++;
  }
for (const [locale, slugs] of Object.entries({de:["ueber-danini","danini-methode"],sr:["o-danini","danini-metoda"]})) {
  for (const slug of slugs) {
    const file = path.join(root, locale, slug, "index.html");
    const html = fs.readFileSync(file, "utf8");
    assert.ok(html.includes(`lang="${locale}"`), file);
    assert.ok(!html.includes("noindex,follow"), file);
    assert.ok(html.includes('mailto:info@daninihub.com') || html.includes('/#kontakt'), file);
    assert.ok(html.includes('hreflang="de"') && html.includes('hreflang="sr"'), file);
    assert.ok((html.match(/<h1(?:\s|>)/g) || []).length === 1, file);
  }
}
const redirects = fs
  .readFileSync(path.join(root, "_redirects"), "utf8")
  .trim()
  .split("\n")
  .map((line) => line.split(/\s+/));
const expectedRedirects = [
  "/buyers.html /sr/auto-check/ 301",
  "/business.html /de/business/ 301",
  "/exclusive.html /auto/exclusive/ 301",
  "/about.html /auto/about/ 301",
  "/inspection /auto/inspection/ 301",
  "/import /auto/import/ 301",
  "/sr/kalkulator /auto/import/ 301",
  "/sr/pregled-auta /auto/inspection/ 301",
  "/sr/dovoz-auta /auto/delivery/ 301",
  "/de/wissen/deutschland-selbstimport /auto/selbstimport/ 301",
  "/sr/vodic/uvoz-zoll-eur1-i-dovoz /auto/uvoz-vodic/ 301",
  "/wiki/javne-nabavke-nemacka-balkan-vodic /sr/wissen/javne-nabavke-nemacka-balkan-vodic/ 301",
  "/wiki/javne-nabavke-nemacka-balkan-vodic/ /sr/wissen/javne-nabavke-nemacka-balkan-vodic/ 301"
].map(line => line.split(/\s+/));
assert.deepEqual(redirects, expectedRedirects, "Existing redirects and procurement aliases must remain intact");
const map = new Map(redirects.map(([a, b]) => [a, b]));
for (const [from, to, status] of redirects) {
  assert.equal(status, "301");
  assert.notEqual(from, to);
  assert.ok(!map.has(to), "redirect chain " + from);
}
const wikiPath = "sr/wissen/javne-nabavke-nemacka-balkan-vodic";
const wikiUrl = "/" + wikiPath + "/";
const wiki = fs.readFileSync(path.join(root, wikiPath, "index.html"), "utf8");
assert.ok(wiki.includes('href="https://daninihub.com' + wikiUrl + '"'), "Wiki canonical missing");
assert.ok(wiki.includes('href="' + wikiUrl + 'demo.pdf"'), "Demo link missing");
assert.ok(wiki.includes('href="/sr/business/"'), "Business CTA missing");
assert.equal(fs.readFileSync(path.join(root, wikiPath, "demo.pdf")).subarray(0, 5).toString(), "%PDF-");
assert.ok(fs.readFileSync(path.join(root, "sr/wissen/index.html"), "utf8").includes(wikiUrl), "Wiki hub link missing");
assert.ok(fs.readFileSync(path.join(root, "sitemap.xml"), "utf8").includes("https://daninihub.com" + wikiUrl), "Wiki sitemap entry missing");
console.log(
  `PASS ${count} B2B pages, language/SEO/local links, ${redirects.length} redirects, published DE/SR legal pages and procurement wiki/demo.`,
);

for(const locale of locales){
 const home=fs.readFileSync(path.join(root,locale,"index.html"),"utf8");
 const business=fs.readFileSync(path.join(root,locale,"business/index.html"),"utf8");
 assert.ok(home.includes("data-prelaunch-entry"),locale+" free entry missing");
 for(const route of ["auto-check/","business/","akademija/","wissen/","wissen/partner/"])assert.ok(home.includes('href="/'+locale+'/'+route+'"'),locale+" entry link "+route);
 assert.ok(business.includes("data-tender-demo-entry"),locale+" demo entry missing");
 assert.ok(business.includes('href="/sr/wissen/javne-nabavke-nemacka-balkan-vodic/demo.pdf"'),locale+" public PDF missing");
 assert.ok(business.includes('href="#anfrage"'),locale+" existing inquiry missing");
}
