const content = {
  sr: {
    title: 'DANINI | Kupovina auta u Nemačkoj i saradnja sa Balkanom',
    description: 'Proverite oglas, procenite troškove uvoza i zatražite pregled vozila u Nemačkoj. DANINI Business pomaže firmama pri upitima i nabavci između Nemačke i Balkana.',
    nav: ['Za kupce', 'Za firme', 'Vodiči', 'Kontakt'],
    hero: 'Kupujete auto u Nemačkoj?',
    intro: 'Prvo proverite oglas i procenite ukupan trošak. Kada su vam potrebne dodatne informacije o vozilu, zatražite video-obilazak ili nezavisan pregled.',
    actions: ['Proveri oglas', 'Izračunaj troškove uvoza'],
    photo: 'Ilustracija pregleda vozila',
    tools: 'Besplatni alati pre kupovine',
    cards: [
      ['Provera oglasa', 'Unesite podatke iz oglasa. Dobijate pitanja za prodavca i spisak dokumenata koje treba proveriti.', '/ai-advisor.html'],
      ['Kalkulator uvoza', 'Napravite okvirnu procenu troškova za Srbiju, BiH ili Hrvatsku.', '/import'],
      ['Sedam vodiča', 'Od izbora oglasa i dokumentacije do pregleda, preuzimanja i uvoza.', '/guides.html'],
    ],
    serviceTitle: 'Pomoć oko konkretnog vozila',
    serviceCopy: 'Pošaljite oglas i recite šta želite da proverite. Izvodljivost, obim, cenu i termin potvrđujemo za svaki zahtev.',
    serviceLinks: ['Video-obilazak', 'Nezavisan pregled', 'Cenovnik', 'Pošalji upit'],
    businessTitle: 'Nabavka i poslovni upiti',
    businessCopy: 'Nemačke firme mogu poslati zahtev za pronalazak dobavljača. Firmama sa Balkana pomažemo da pripreme upit za nemačko tržište.',
    businessAction: 'Otvori poslovni upit',
    brand: 'O brendu DANINI',
    legal: ['Impressum', 'Privatnost', 'Uslovi', 'Kolačići'],
    skip: 'Preskoči na sadržaj',
  },
  de: {
    title: 'DANINI | Autokauf in Deutschland und Geschäftskontakte zum Balkan',
    description: 'Inserate prüfen, Importkosten schätzen und Fahrzeugbesichtigungen in Deutschland anfragen. DANINI Business unterstützt Anfragen und Beschaffung zwischen Deutschland und dem Balkan.',
    nav: ['Für Autokäufer', 'Für Unternehmen', 'Ratgeber', 'Kontakt'],
    hero: 'Sie möchten in Deutschland ein Auto kaufen?',
    intro: 'Prüfen Sie zuerst das Inserat und schätzen Sie die Gesamtkosten. Für weitere Informationen zum Fahrzeug können Sie eine Videobesichtigung oder eine unabhängige Prüfung anfragen.',
    actions: ['Inserat prüfen', 'Importkosten berechnen'],
    photo: 'Symbolfoto einer Fahrzeugprüfung',
    tools: 'Kostenlose Werkzeuge vor dem Kauf',
    cards: [
      ['Inserat prüfen', 'Tragen Sie die Angaben aus dem Inserat ein. Sie erhalten Fragen für den Verkäufer und eine Liste der zu prüfenden Unterlagen.', '/ai-advisor.html'],
      ['Importkosten berechnen', 'Schätzen Sie die Kosten für die Einfuhr nach Serbien, Bosnien und Herzegowina oder Kroatien.', '/import'],
      ['Sieben Ratgeber', 'Von der Inseratsuche und den Unterlagen bis zur Prüfung, Abholung und Einfuhr.', '/guides.html'],
    ],
    serviceTitle: 'Unterstützung für ein konkretes Fahrzeug',
    serviceCopy: 'Senden Sie uns das Inserat und sagen Sie, was Sie prüfen lassen möchten. Machbarkeit, Umfang, Preis und Termin bestätigen wir für jede Anfrage.',
    serviceLinks: ['Videobesichtigung', 'Unabhängige Prüfung', 'Preise', 'Anfrage senden'],
    businessTitle: 'Beschaffung und Geschäftsanfragen',
    businessCopy: 'Deutsche Unternehmen können eine Lieferantensuche anfragen. Unternehmen aus dem Balkan unterstützen wir bei der Vorbereitung ihrer Anfrage für den deutschen Markt.',
    businessAction: 'Geschäftsanfrage öffnen',
    brand: 'Über DANINI',
    legal: ['Impressum', 'Datenschutz', 'AGB', 'Cookies'],
    skip: 'Zum Inhalt springen',
  },
};

export function daniniHome(request, url) {
  const lang = url.pathname === '/de/' ? 'de' : 'sr';
  const c = content[lang];
  const canonical = lang === 'de' ? 'https://daninihub.com/de/' : 'https://daninihub.com/';
  const link = (href, label, css = '') => `<a class="${css}" href="${href}">${label}</a>`;
  const nav = ['/buyers.html', '/business.html', '/guides.html', '/contact'];
  const services = ['/live.html', '/inspection.html', '/cenovnik', '/contact'];
  const legal = ['/impressum.html', '/privacy.html', '/terms.html', '/cookies.html'];
  const headers = {'content-type':'text/html; charset=utf-8','cache-control':'public, max-age=300','x-content-type-options':'nosniff'};
  if (request.method === 'HEAD') return new Response(null, {headers});
  return new Response(`<!doctype html>
<html lang="${lang}"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${c.title}</title><meta name="description" content="${c.description}">
<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="sr" href="https://daninihub.com/">
<link rel="alternate" hreflang="de" href="https://daninihub.com/de/">
<link rel="alternate" hreflang="x-default" href="https://daninihub.com/">
<link rel="icon" type="image/svg+xml" href="/danini-favicon.svg">
<meta name="theme-color" content="#0f172a">
<script>try{localStorage.setItem("autodanini-language","${lang}")}catch{}</script>
<meta property="og:type" content="website"><meta property="og:site_name" content="DANINI">
<meta property="og:title" content="${c.title}"><meta property="og:description" content="${c.description}">
<meta property="og:url" content="${canonical}"><meta property="og:image" content="https://daninihub.com/danini-pregled-auta.webp">
<style>
:root{color-scheme:light;--ink:#0f172a;--muted:#475569;--gold:#facc15;--line:#dce2eb;--paper:#f8fafc}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.55 Inter,system-ui,sans-serif}
a{color:inherit}a:focus-visible{outline:3px solid #2675d9;outline-offset:4px}
.shell{width:min(1160px,calc(100% - 48px));margin:auto}.top{background:var(--ink);color:#fff}
.bar,.brand,.menu,.locale,.actions,.footer-links{display:flex;align-items:center;gap:18px}.bar{min-height:76px;justify-content:space-between}
.brand{gap:10px;text-decoration:none;font-size:21px;font-weight:800;letter-spacing:.05em}.brand img{display:block}
.menu a,.locale a,.footer-links a{text-decoration:none}.menu a:hover,.footer-links a:hover{text-decoration:underline}.locale{gap:5px}
.locale a{padding:5px 8px;border-radius:5px}.locale [aria-current]{color:var(--ink);background:var(--gold)}
.skip{position:absolute;top:4px;left:4px;padding:8px;background:#fff;color:var(--ink);transform:translateY(-150%);z-index:2}.skip:focus{transform:none}
.hero{background:var(--ink);color:#fff;padding:54px 0 62px}.hero-grid{display:grid;grid-template-columns:1.1fr 1fr;align-items:center;gap:50px}
.line-brand{display:inline-block;color:var(--gold);font-size:15px;font-weight:800}.hero h1{font-size:clamp(38px,5vw,70px);line-height:1.03;letter-spacing:-.045em;margin:14px 0 18px}
.hero p{max-width:54ch;color:#dbe3ef;font-size:clamp(17px,1.7vw,20px);margin:0 0 26px}
.hero figure{margin:0}.hero img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:14px}
.actions,.footer-links{flex-wrap:wrap;gap:12px}.button{display:inline-flex;align-items:center;min-height:46px;padding:10px 15px;border:1px solid currentColor;border-radius:7px;text-decoration:none;font-weight:750}
.gold{background:var(--gold);border-color:var(--gold);color:var(--ink)}.button:hover{filter:brightness(.9)}
.section{padding:50px 0}.section h2,.panel h2{font-size:clamp(25px,3.3vw,39px);line-height:1.14;letter-spacing:-.025em;margin:0 0 18px}
.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.card,.panel{background:#fff;border:1px solid var(--line);border-radius:12px;padding:24px}
.card{display:block;text-decoration:none}.card:hover{border-color:#62769a}.card h3{font-size:19px;margin:0 0 8px}.card p,.panel p{color:var(--muted);margin:0 0 12px}.card span{font-weight:800}
.panels{display:grid;grid-template-columns:1.15fr 1fr;gap:14px;padding-bottom:50px}.panel p{margin-bottom:20px}.panel .actions{font-size:14px}
footer{border-top:1px solid var(--line);padding:24px 0}.footer-links{gap:16px;font-size:14px}
@media(max-width:800px){.shell{width:min(100% - 36px,1160px)}.bar{padding:12px 0;flex-wrap:wrap;gap:8px}.menu{order:3;width:100%;flex-wrap:wrap;gap:5px 14px;font-size:14px}.menu a{padding:5px 0}.hero-grid{gap:24px}.hero{padding:36px 0}.hero img{aspect-ratio:1}.cards{grid-template-columns:1fr}.panels{grid-template-columns:1fr}.section{padding:36px 0}}
@media(max-width:570px){.hero-grid{grid-template-columns:1fr}.hero img{aspect-ratio:16/9}.card,.panel{padding:18px}.hero .button{flex:1 1 auto;justify-content:center}}
</style></head><body>
<a class="skip" href="#content">${c.skip}</a>
<header class="top"><div class="shell bar">
<a href="${lang === 'de' ? '/de/' : '/'}" class="brand"><img src="/danini-favicon.svg" width="38" height="38" alt="">DANINI</a>
<nav class="menu">${nav.map((href,i)=>link(href,c.nav[i])).join('')}</nav>
<nav class="locale" aria-label="${lang === 'de' ? 'Sprache' : 'Jezik'}"><a href="/de/" lang="de" aria-label="Deutsch"${lang==='de'?' aria-current="page"':''}>DE</a><a href="/" lang="sr" aria-label="Srpski"${lang==='sr'?' aria-current="page"':''}>SR</a></nav>
</div></header>
<main id="content">
<section class="hero"><div class="shell hero-grid"><div>
${link('/buyers.html','AutoDanini','line-brand')}<h1>${c.hero}</h1><p>${c.intro}</p>
<div class="actions">${link('/ai-advisor.html',c.actions[0],'button gold')}${link('/import',c.actions[1],'button')}</div>
</div><figure><img src="/danini-pregled-auta.webp" width="800" height="600" alt="${c.photo}" fetchpriority="high"></figure></div></section>
<section class="shell section"><h2>${c.tools}</h2><div class="cards">
${c.cards.map(([heading,desc,href])=>`<a class="card" href="${href}"><h3>${heading}</h3><p>${desc}</p><span aria-hidden="true">↗</span></a>`).join('')}
</div></section>
<div class="shell panels">
<section class="panel"><h2>${c.serviceTitle}</h2><p>${c.serviceCopy}</p><div class="actions">${services.map((href,i)=>link(href,c.serviceLinks[i],i===3?'button gold':'button')).join('')}</div></section>
<section class="panel"><p><strong>DANINI Business</strong></p><h2>${c.businessTitle}</h2><p>${c.businessCopy}</p>${link('/business.html',c.businessAction,'button')}</section>
</div>
</main><footer><div class="shell footer-links"><strong>© DANINI</strong>
${link(lang==='de'?'/danini.html':'/danini-sr.html',c.brand)}${legal.map((href,i)=>link(href,c.legal[i])).join('')}</div></footer>
</body></html>`, {headers});
}
