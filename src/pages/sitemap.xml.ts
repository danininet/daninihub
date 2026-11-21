import { guides } from "../lib/knowledge";
import { originalEvergreen } from "../lib/original-evergreen";
import { srBusinessEvergreen } from "../lib/sr-business-evergreen";
import { verticals } from "../lib/content";
export function GET() {
  const urls = [
    "https://daninihub.com/",
    "https://daninihub.com/de/ueber-danini/",
    "https://daninihub.com/de/danini-methode/",
    "https://daninihub.com/sr/o-danini/",
    "https://daninihub.com/sr/danini-metoda/",
    ...[...originalEvergreen,...srBusinessEvergreen].filter(a=>a.index).map(a=>`https://daninihub.com/${a.locale}/wissen/${a.slug}/`),
    ...["de", "sr"].flatMap((l) => ["wissen", "wissen/checkliste", "wissen/produkte", "wissen/partner", "wissen/glossar", "wissen/dokumente", ...guides.filter(g=>!(l==="de"&&g.slug==="kundenanfragen")&&!(l==="sr"&&g.slug==="fahrzeugpapiere")).map(g => "wissen/" + g.slug)].map(s => `https://daninihub.com/${l}/${s}/`)),
    ...["de", "sr"].flatMap((l) =>
      ["", "akademija", "akademija/modul-02", "business", "auto-check", "ai-savetnik", ...verticals, "impressum", "datenschutz", "agb"].map(
        (s) => `https://daninihub.com/${l}/${s ? s + "/" : ""}`,
      ),
    ),
  ];
  return new Response(
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
      urls.map((u) => `<url><loc>${u}</loc></url>`).join("") +
      "</urlset>",
    { headers: { "content-type": "application/xml" } },
  );
}
