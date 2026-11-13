import { verticals } from "../lib/content";
export function GET() {
  const urls = [
    "https://daninihub.com/",
    ...["de", "sr"].flatMap((l) =>
      ["", ...verticals].map(
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
