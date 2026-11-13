"use strict";
const fs = require("node:fs"),
  path = require("node:path");
const source = path.resolve("autodanini-auto-dist"),
  dest = path.resolve("dist");
if (
  !fs.existsSync(path.join(source, "buyers.html")) ||
  !fs.existsSync(path.join(dest, "de/index.html"))
)
  throw Error("Build both frontends first");
// Preserve existing absolute asset/API URLs and legacy payment return paths.
for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
  if (
    [
      "index.html",
      "de",
      "sr",
      "sitemap.xml",
      "robots.txt",
      "_redirects",
      "_headers",
      "favicon.svg",
      "danini.html",
      "danini-sr.html",
    ].includes(entry.name)
  )
    continue;
  fs.cpSync(path.join(source, entry.name), path.join(dest, entry.name), {
    recursive: true,
    force: false,
    errorOnExist: false,
  });
}
const auto = path.join(dest, "auto");
fs.mkdirSync(auto, { recursive: true });
const pages = fs
  .readdirSync(source)
  .filter(
    (n) =>
      n.endsWith(".html") && !["danini.html", "danini-sr.html"].includes(n),
  );
for (const name of pages) {
  let html = fs.readFileSync(path.join(source, name), "utf8");
  // Remove only unfinished navigation links, retaining source pages/modules.
  html = html.replace(
    /<a\b[^>]*href=["'][^"']*(?:auctions|tender)(?:\.html)?[^"']*["'][^>]*>[\s\S]*?<\/a>/gi,
    "",
  );
  html = html.replace(
    /<a\b[^>]*href=["']https:\/\/wa\.me\/[^"']*["'][^>]*>[\s\S]*?<\/a>/gi,
    "",
  );
  html = html.replace(
    /href="\/?([a-z-]+)\.html([?#][^"]*)?"/g,
    (whole, slug, query = "") =>
      pages.includes(slug + ".html")
        ? `href="/auto/${slug === "index" ? "" : slug + ".html"}${query}"`
        : whole,
  );
  // Canonicals belong to AutoDanini's namespace; omit stale locale alternates.
  html = html.replace(/<link\b[^>]*rel="(?:canonical|alternate)"[^>]*>/g, "");
  html = html.replace(
    "</head>",
    `<link rel="canonical" href="https://daninihub.com/auto/${name === "index.html" ? "" : name.replace(".html", "/")}"/></head>`,
  );
  // Legacy relative public assets must remain rooted, while external URLs stay intact.
  html = html.replace(
    /(src|href)="(?:\.\/)?([^/":#][^":]*\.(?:js|css|svg|webp|jpg|png))(\?[^"]*)?"/g,
    (_m, attr, file, query = "") => `${attr}="/${file}${query}"`,
  );
  fs.writeFileSync(path.join(auto, name), html);
}
const redirectSource = fs
  .readFileSync("public/_redirects", "utf8")
  .trim()
  .split("\n");
const routes = Object.fromEntries(
  redirectSource.map((line) => {
    const [from, to, status] = line.trim().split(/\s+/);
    if (status !== "301" || !from.startsWith("/") || !to.startsWith("/"))
      throw Error("Invalid redirect " + line);
    return [from, to];
  }),
);
for (const target of Object.values(routes)) {
  const file = path.join(dest, target.replace(/\/$/, ".html"));
  const index = path.join(dest, target, "index.html");
  if (!fs.existsSync(file) && !fs.existsSync(index))
    throw Error("Missing redirect destination " + target);
}
fs.writeFileSync(
  path.join(dest, "_redirects"),
  Object.entries(routes)
    .map(([from, to]) => `${from} ${to} 301`)
    .join("\n") + "\n",
);
const sitemapFile = path.join(dest, "sitemap.xml");
let sitemap = fs.readFileSync(sitemapFile, "utf8");
const indexable = pages.filter(
  (n) =>
    ![
      "admin.html",
      "nalog.html",
      "tender.html",
      "auctions.html",
      "business.html",
      "cnc.html",
      "ai-solutions.html",
    ].includes(n) &&
    fs
      .readFileSync(path.join(auto, n), "utf8")
      .includes('content="index,follow"'),
);
sitemap = sitemap.replace(
  "</urlset>",
  indexable
    .map(
      (n) =>
        `<url><loc>https://daninihub.com/auto/${n === "index.html" ? "" : n.replace(".html", "/")}</loc></url>`,
    )
    .join("") + "</urlset>",
);
fs.writeFileSync(sitemapFile, sitemap);
console.log(
  `Preserved legacy assets; packaged ${pages.length} AutoDanini pages; validated ${Object.keys(routes).length} redirects.`,
);

fs.writeFileSync(
  path.join(dest, "llms.txt"),
  `# DANINI

> Administrative B2B project preparation between DACH and the Balkans. Final reports require human review. No legal, tax or compliance certification.

## Services
- [Deutsch](https://daninihub.com/de/): German homepage.
- [Srpski](https://daninihub.com/sr/): Serbian homepage.
- [CBAM](https://daninihub.com/de/cbam/): Data preparation and gaps.
- [Subcontractors](https://daninihub.com/de/subcontractor/): Country-specific documentation preparation.
- [Nearshoring](https://daninihub.com/de/nearshoring/): Supplier and product documentation.
- [AutoDanini](https://daninihub.com/auto/): Vehicle preparation and inspection services.
`,
);
