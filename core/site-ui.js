'use strict';

const SITE_URL = 'https://daninihub.com';
const SITE_ROUTES = Object.freeze({
  sr: Object.freeze({ home: '/', method: '/sr/metoda', project: '/sr/projektni-mod', levels: '/sr/nivoi', activation: '/sr/aktivacija', artifacts: '/sr/artefakti', trust: '/sr/centar-poverenja', cookies: '/sr/kolacici', ai: '/sr/ai-transparentnost', affiliate: '/sr/affiliate-napomena', imprint: '/sr/impressum', privacy: '/sr/privatnost', terms: '/sr/uslovi-koriscenja', withdrawal: '/sr/odustanak', disclaimer: '/sr/odricanje-odgovornosti' }),
  de: Object.freeze({ home: '/de', method: '/de/methode', project: '/de/projektmodus', levels: '/de/preise', activation: '/de/analyse-starten', artifacts: '/de/artifacts', trust: '/de/trust-center', cookies: '/de/cookies', ai: '/de/ki-transparenz', affiliate: '/de/affiliate-hinweis', imprint: '/de/impressum', privacy: '/de/datenschutz', terms: '/de/nutzungsbedingungen', withdrawal: '/de/widerruf', disclaimer: '/de/haftungsausschluss' }),
  en: Object.freeze({ home: '/en', method: '/en/method', project: '/en/project-mode', levels: '/en/levels', activation: '/en/activation', artifacts: '/en/artifacts', trust: '/en/trust-center', cookies: '/en/cookies', ai: '/en/ai-transparency', affiliate: '/en/affiliate-disclosure', imprint: '/en/imprint', privacy: '/en/privacy', terms: '/en/terms', withdrawal: '/en/withdrawal', disclaimer: '/en/disclaimer' })
});

const UI_COPY = Object.freeze({
  de: { claim: 'Persönliche KI-Analyse', nav: ['So funktioniert es', 'Ihre Analyse', 'Preis', 'Ergebnis', 'Vertrauen'], legal: 'Recht & Transparenz', start: 'Für 12 EUR starten', menu: 'Menü', footer: 'Eine persönliche KI-Analyse mit genau drei Rückfragen.', primary: 'Rechtlich maßgeblich ist die deutsche Fassung.' },
  sr: { claim: 'Lična AI analiza', nav: ['Kako radi', 'Vaša analiza', 'Cena', 'Rezultat', 'Poverenje'], legal: 'Pravo i transparentnost', start: 'Pokreni za 12 EUR', menu: 'Meni', footer: 'Lična AI analiza sa tačno tri ciljano postavljena podpitanja.', primary: 'Nemačka verzija je pravno merodavna.' },
  en: { claim: 'Personal AI analysis', nav: ['How it works', 'Your analysis', 'Price', 'Result', 'Trust'], legal: 'Legal & transparency', start: 'Start for 12 EUR', menu: 'Menu', footer: 'A personal AI analysis with exactly three targeted follow-up questions.', primary: 'The German version is legally authoritative.' }
});

const LEGAL_KEYS = Object.freeze(['imprint', 'privacy', 'cookies', 'terms', 'withdrawal', 'ai', 'affiliate', 'disclaimer']);
const PUBLIC_KEYS = Object.freeze(['method', 'project', 'levels', 'artifacts']);

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function normalizeLang(lang) {
  return ['de', 'sr', 'en'].includes(lang) ? lang : 'de';
}

function navigation(lang, activeKey) {
  const l = normalizeLang(lang);
  const t = UI_COPY[l];
  const r = SITE_ROUTES[l];
  const items = [
    ['method', t.nav[0]], ['project', t.nav[1]], ['levels', t.nav[2]],
    ['artifacts', t.nav[3]], ['trust', t.nav[4]]
  ];
  return items.map(([key, label]) => `<a class="nav-link${activeKey === key ? ' active' : ''}" href="${r[key]}">${escapeHtml(label)}</a>`).join('');
}

function languageLinks(lang, pageKey) {
  return ['de', 'sr', 'en'].map(code => {
    const href = SITE_ROUTES[code][pageKey] || SITE_ROUTES[code].home;
    return `<a class="lang-link${code === lang ? ' active' : ''}" href="${href}" lang="${code}">${code.toUpperCase()}</a>`;
  }).join('');
}

function renderHeader(lang, activeKey = 'home') {
  const l = normalizeLang(lang);
  const t = UI_COPY[l];
  const r = SITE_ROUTES[l];
  const nav = navigation(l, activeKey);
  return `<header class="site-header"><div class="header-inner">
    <a class="site-brand" href="${r.home}" aria-label="DaniniHub">
      <span class="brand-mark" aria-hidden="true">DH</span>
      <span><strong>DaniniHub</strong><small>${escapeHtml(t.claim)}</small></span>
    </a>
    <nav class="desktop-nav" aria-label="Primary">${nav}</nav>
    <div class="header-actions"><div class="language-switch" aria-label="Language">${languageLinks(l, activeKey)}</div><a class="header-cta" href="/api/entry/12-eur/checkout">${escapeHtml(t.start)}</a></div>
    <details class="mobile-menu"><summary>${escapeHtml(t.menu)}</summary><nav>${nav}<a class="header-cta" href="/api/entry/12-eur/checkout">${escapeHtml(t.start)}</a><div class="language-switch">${languageLinks(l, activeKey)}</div></nav></details>
  </div></header>`;
}

function legalLabel(lang, key) {
  const labels = {
    de: { imprint: 'Impressum', privacy: 'Datenschutz', cookies: 'Cookies & Speicherungen', terms: 'Nutzungsbedingungen', withdrawal: 'Widerruf', ai: 'KI-Transparenz', affiliate: 'Affiliate-Hinweis', disclaimer: 'Haftungsausschluss' },
    sr: { imprint: 'Impressum', privacy: 'Privatnost', cookies: 'Kolačići i čuvanje', terms: 'Uslovi korišćenja', withdrawal: 'Odustanak', ai: 'AI transparentnost', affiliate: 'Affiliate napomena', disclaimer: 'Odricanje odgovornosti' },
    en: { imprint: 'Imprint', privacy: 'Privacy', cookies: 'Cookies & storage', terms: 'Terms', withdrawal: 'Withdrawal', ai: 'AI transparency', affiliate: 'Affiliate disclosure', disclaimer: 'Disclaimer' }
  };
  return labels[normalizeLang(lang)][key];
}

function renderFooter(lang) {
  const l = normalizeLang(lang);
  const t = UI_COPY[l];
  const r = SITE_ROUTES[l];
  return `<footer class="site-footer"><div class="footer-grid">
    <div class="footer-brand"><div class="site-brand"><span class="brand-mark">DH</span><span><strong>DaniniHub</strong><small>${escapeHtml(t.claim)}</small></span></div><p>${escapeHtml(t.footer)}</p><p class="footer-meta">Dragan Zdravkovic · Duisburg, Deutschland</p></div>
    <div><h2>${escapeHtml(t.nav[1])}</h2><a href="${r.method}">${escapeHtml(t.nav[0])}</a><a href="${r.levels}">${escapeHtml(t.nav[2])}</a><a href="${r.artifacts}">${escapeHtml(t.nav[3])}</a><a href="${r.activation}">${escapeHtml(t.start)}</a></div>
    <div><h2>${escapeHtml(t.legal)}</h2>${LEGAL_KEYS.map(key => `<a href="${r[key]}">${escapeHtml(legalLabel(l, key))}</a>`).join('')}</div>
  </div><div class="footer-bottom"><span>© ${new Date().getUTCFullYear()} DaniniHub</span><span>${escapeHtml(t.primary)}</span></div></footer>`;
}

const SITE_CSS = `
:root{--navy:#07111f;--navy-2:#0b1728;--panel:#101d30;--panel-2:#15243a;--line:#2a3b53;--text:#f7f3ea;--muted:#b5c0ce;--gold:#d6b25e;--gold-2:#f0d894;--blue:#a9cdf5;--paper:#f7f4ed;--ink:#142033;--paper-muted:#566477;--paper-line:#ded8cc;--danger:#9b3b3b;--shadow:0 24px 70px rgba(0,0,0,.22);font-synthesis:none}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--navy);color:var(--text);font-family:Inter,ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.65;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}button,textarea{font:inherit}
.site-header{position:sticky;top:0;z-index:50;background:rgba(7,17,31,.94);border-bottom:1px solid rgba(214,178,94,.18);backdrop-filter:blur(18px)}.header-inner{width:min(1240px,calc(100% - 40px));min-height:78px;margin:auto;display:flex;align-items:center;gap:28px}.site-brand{display:inline-flex;align-items:center;gap:12px;min-width:max-content}.site-brand strong{display:block;font-size:17px;letter-spacing:.01em}.site-brand small{display:block;color:var(--gold);font-size:11px;letter-spacing:.05em}.brand-mark{width:40px;height:40px;border:1px solid rgba(214,178,94,.55);border-radius:11px;display:grid;place-items:center;color:var(--gold-2);font-size:12px;font-weight:900;letter-spacing:.08em;background:rgba(214,178,94,.05)}
.desktop-nav{display:flex;align-items:center;justify-content:center;gap:4px;margin-left:auto}.nav-link{padding:9px 11px;border-radius:9px;color:#c7d1de;font-size:13px;font-weight:650}.nav-link:hover,.nav-link.active{background:rgba(255,255,255,.07);color:#fff}.header-actions{display:flex;align-items:center;gap:14px}.language-switch{display:flex;gap:3px}.lang-link{padding:5px 7px;border-radius:7px;color:#8fa0b4;font-size:11px;font-weight:800}.lang-link.active{background:#1c2b40;color:var(--gold-2)}.header-cta,.button-primary{display:inline-flex;align-items:center;justify-content:center;border-radius:10px;background:var(--gold);color:#101827;padding:11px 15px;font-size:13px;font-weight:850;box-shadow:0 8px 24px rgba(214,178,94,.12)}.header-cta:hover,.button-primary:hover{background:var(--gold-2)}.mobile-menu{display:none}
.page-shell{width:min(1180px,calc(100% - 40px));margin:auto}.hero{padding:88px 0 54px}.hero.compact{padding:54px 0 34px}.eyebrow,.badge{display:inline-flex;align-items:center;gap:8px;color:var(--blue);font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.12em}.badge{border:1px solid #405978;border-radius:999px;padding:7px 12px;text-transform:none;letter-spacing:.03em}.hero h1{max-width:980px;margin:20px 0;font-size:clamp(42px,6.5vw,78px);line-height:1.02;letter-spacing:-.045em}.hero.compact h1{font-size:clamp(38px,5vw,60px);max-width:850px}.lead{max-width:840px;color:#c9d3df;font-size:clamp(18px,2vw,22px);line-height:1.7}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:30px}.button-secondary{display:inline-flex;align-items:center;justify-content:center;padding:11px 15px;border:1px solid #52647d;border-radius:10px;color:#e7edf5;font-weight:750;font-size:13px}.button-secondary:hover{border-color:var(--gold);color:var(--gold-2)}
.section{padding:34px 0}.section-head{max-width:760px;margin-bottom:24px}.section-head h2{font-size:clamp(28px,4vw,44px);line-height:1.15;letter-spacing:-.03em;margin:8px 0}.section-head p{color:var(--muted);font-size:17px}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.card{background:linear-gradient(145deg,var(--panel),#0d192a);border:1px solid var(--line);border-radius:17px;padding:24px;box-shadow:0 14px 40px rgba(0,0,0,.12)}.card-number{color:var(--gold);font-size:13px;font-weight:900;letter-spacing:.12em}.card h2,.card h3{margin:10px 0 8px;color:#fff;font-size:20px}.card p{margin:0;color:var(--muted)}.feature-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.feature{padding:18px;border-left:2px solid var(--gold);background:rgba(255,255,255,.035);border-radius:0 12px 12px 0}.feature strong{display:block;color:#fff}.feature span{color:var(--muted);font-size:14px}.price-panel{display:grid;grid-template-columns:1.3fr .7fr;gap:30px;align-items:center;background:var(--paper);color:var(--ink);border-radius:22px;padding:36px;margin:34px 0;box-shadow:var(--shadow)}.price-panel h2{font-size:36px;line-height:1.12;margin:0 0 10px}.price-panel p{color:var(--paper-muted)}.price-box{text-align:right}.price{display:block;font-size:58px;font-weight:850;letter-spacing:-.05em}.price-box small{display:block;color:var(--paper-muted);margin-bottom:16px}
.legal-masthead{padding:46px 0 32px;border-bottom:1px solid var(--line)}.breadcrumbs{display:flex;gap:8px;align-items:center;color:#8fa0b4;font-size:12px;margin-bottom:22px}.breadcrumbs a:hover{color:var(--gold)}.legal-masthead h1{font-size:clamp(38px,5vw,58px);line-height:1.05;letter-spacing:-.035em;margin:12px 0}.legal-masthead .lead{font-size:18px;max-width:760px}.document-meta{display:flex;gap:18px;flex-wrap:wrap;margin-top:20px;color:#92a2b5;font-size:12px}.legal-layout{display:grid;grid-template-columns:250px minmax(0,760px);gap:42px;align-items:start;padding:42px 0 68px}.legal-toc{position:sticky;top:106px;border:1px solid var(--line);border-radius:15px;padding:14px;background:var(--panel)}.legal-toc strong{display:block;padding:8px 10px;color:#fff;font-size:12px;text-transform:uppercase;letter-spacing:.1em}.legal-toc a{display:block;padding:8px 10px;border-radius:8px;color:#aebac8;font-size:13px}.legal-toc a:hover,.legal-toc a.active{background:rgba(255,255,255,.06);color:var(--gold-2)}.legal-document{background:var(--paper);color:var(--ink);border-radius:18px;padding:clamp(26px,5vw,54px);box-shadow:var(--shadow)}.legal-document section+section{border-top:1px solid var(--paper-line);margin-top:32px;padding-top:30px}.legal-document h2{font-size:24px;line-height:1.25;margin:0 0 14px;letter-spacing:-.02em}.legal-document h3{font-size:16px;margin:22px 0 8px}.legal-document p,.legal-document li{color:#344256}.legal-document p{margin:0 0 14px}.legal-document ul,.legal-document ol{padding-left:22px}.legal-document li+li{margin-top:8px}.contact-block{background:#ebe6da;border:1px solid #d7cdbb;border-radius:13px;padding:20px;margin:16px 0}.contact-block strong,.contact-block span{display:block}.legal-note{border-left:3px solid var(--gold);background:#f0eadf;padding:16px 18px;margin:20px 0;color:#3d4a5a}.legal-note strong{display:block;color:var(--ink);margin-bottom:4px}.legal-source{font-size:12px;color:#6c7887!important}.legal-source a{text-decoration:underline;text-underline-offset:3px}.legal-next{display:flex;justify-content:space-between;gap:14px;margin-top:30px;padding-top:24px;border-top:1px solid var(--paper-line)}.legal-next a{color:#725817;font-weight:750}.trust-index{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;padding:38px 0 68px}.trust-card{display:block;border:1px solid var(--line);background:var(--panel);border-radius:15px;padding:22px}.trust-card small{color:var(--gold);font-weight:800}.trust-card h2{margin:8px 0;font-size:19px}.trust-card p{color:var(--muted);font-size:14px;margin:0}
.site-footer{border-top:1px solid rgba(214,178,94,.18);background:#050c16;margin-top:64px}.footer-grid{width:min(1180px,calc(100% - 40px));margin:auto;padding:48px 0;display:grid;grid-template-columns:1.4fr .8fr 1fr;gap:44px}.footer-grid h2{font-size:12px;text-transform:uppercase;letter-spacing:.12em;color:#fff;margin:0 0 14px}.footer-grid>div>a{display:block;color:#98a8bb;font-size:13px;padding:4px 0}.footer-grid>div>a:hover{color:var(--gold)}.footer-brand p{max-width:380px;color:#9aabba;font-size:14px}.footer-meta{font-size:12px!important;color:#718198!important}.footer-bottom{width:min(1180px,calc(100% - 40px));margin:auto;padding:18px 0 24px;border-top:1px solid #1a2738;display:flex;justify-content:space-between;gap:20px;color:#718198;font-size:11px}
@media(max-width:980px){.desktop-nav,.header-actions{display:none}.mobile-menu{display:block;margin-left:auto;position:relative}.mobile-menu summary{list-style:none;cursor:pointer;border:1px solid var(--line);border-radius:9px;padding:8px 12px;color:#fff;font-size:13px;font-weight:750}.mobile-menu summary::-webkit-details-marker{display:none}.mobile-menu[open] nav{position:absolute;right:0;top:46px;width:min(320px,calc(100vw - 36px));padding:14px;background:#0d192a;border:1px solid var(--line);border-radius:14px;box-shadow:var(--shadow);display:grid;z-index:60}.mobile-menu nav .header-cta{margin:8px 0}.mobile-menu .language-switch{margin-top:8px}.legal-layout{grid-template-columns:1fr;gap:18px}.legal-toc{position:static;display:flex;overflow-x:auto;gap:4px}.legal-toc strong{display:none}.legal-toc a{min-width:max-content}.grid{grid-template-columns:1fr 1fr}}
@media(max-width:680px){.header-inner,.page-shell,.footer-grid,.footer-bottom{width:min(100% - 28px,1180px)}.header-inner{min-height:68px}.hero{padding:54px 0 34px}.hero h1{font-size:clamp(38px,12vw,54px)}.hero.compact{padding:38px 0 26px}.grid,.feature-list,.trust-index{grid-template-columns:1fr}.price-panel{grid-template-columns:1fr;padding:24px}.price-box{text-align:left}.legal-masthead{padding:34px 0 25px}.legal-layout{padding:24px 0 42px}.legal-document{border-radius:14px;padding:24px 20px}.legal-document h2{font-size:21px}.footer-grid{grid-template-columns:1fr;gap:28px;padding:38px 0}.footer-bottom{display:block}.footer-bottom span{display:block;margin:5px 0}.site-footer{margin-top:40px}}
`;

function renderPage({ lang = 'de', pageKey = 'home', title, description, body, robots = 'index,follow', extraHead = '', extraCss = '' }) {
  const l = normalizeLang(lang);
  const canonical = `${SITE_URL}${SITE_ROUTES[l][pageKey] || SITE_ROUTES[l].home}`;
  return `<!doctype html><html lang="${l}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)} | DaniniHub</title><meta name="description" content="${escapeHtml(description)}"><meta name="robots" content="${escapeHtml(robots)}"><link rel="canonical" href="${canonical}"><meta name="theme-color" content="#07111f"><style>${SITE_CSS}${extraCss}</style>${extraHead}</head><body>${renderHeader(l, pageKey)}<main class="page-shell">${body}</main>${renderFooter(l)}</body></html>`;
}

module.exports = { SITE_URL, SITE_ROUTES, UI_COPY, LEGAL_KEYS, PUBLIC_KEYS, SITE_CSS, escapeHtml, legalLabel, normalizeLang, renderFooter, renderHeader, renderPage };
