'use strict';

const { SITE_ROUTES, escapeHtml, renderPage } = require('./core/site-ui');

const copy = {
  de:{title:'Kauf bestätigt',h1:'Vielen Dank. Ihr persönlicher Zugang ist unterwegs.',lead:'Der Zugangslink wird an die beim Kauf verwendete E-Mail-Adresse gesendet.',next:'Öffnen Sie den Link, beantworten Sie die Ausgangsfrage und genau drei Rückfragen. Anschließend erhalten Sie Ihre Analyse und das PDF per E-Mail.',cta:'Zur Analyse',help:'Keine E-Mail erhalten? Prüfen Sie den Spam-Ordner oder kontaktieren Sie uns mit Ihrer Bestellnummer.'},
  sr:{title:'Kupovina je potvrđena',h1:'Hvala. Vaš lični pristup je na putu.',lead:'Pristupni link stiže na email adresu korišćenu pri kupovini.',next:'Otvorite link, odgovorite na početno pitanje i tačno tri podpitanja. Zatim dobijate analizu i PDF emailom.',cta:'Na analizu',help:'Email nije stigao? Proverite spam folder ili nam pišite uz broj porudžbine.'},
  en:{title:'Purchase confirmed',h1:'Thank you. Your personal access is on its way.',lead:'The access link is sent to the email address used for purchase.',next:'Open the link, answer the opening question and exactly three follow-ups. The analysis and PDF will then be delivered by email.',cta:'Go to analysis',help:'No email? Check spam or contact us with your order number.'}
};

function renderSuccessHtml(lang='de') {
  const l=['de','sr','en'].includes(lang)?lang:'de'; const t=copy[l];
  const body=`<section class="hero compact"><span class="badge">DaniniHub · 12 EUR</span><h1>${escapeHtml(t.h1)}</h1><p class="lead">${escapeHtml(t.lead)}</p></section><section class="price-panel"><div><span class="eyebrow">${escapeHtml(t.title)}</span><h2>${escapeHtml(t.next)}</h2><p>${escapeHtml(t.help)}</p><p><a href="mailto:dragangaganet@gmail.com">dragangaganet@gmail.com</a></p></div><div class="price-box"><span class="brand-mark" style="width:68px;height:68px;margin-left:auto">✓</span><div class="actions" style="justify-content:flex-end"><a class="button-primary" href="${SITE_ROUTES[l].activation}">${escapeHtml(t.cta)}</a></div></div></section>`;
  return renderPage({lang:l,pageKey:'activation',title:t.title,description:t.lead,body,robots:'noindex,follow'});
}

function mountSuccessLayer(app){ app.get('/gumroad-success',(req,res)=>res.type('html').send(renderSuccessHtml(String(req.query.lang||'de').toLowerCase()))); }

module.exports={mountSuccessLayer,renderSuccessHtml};
