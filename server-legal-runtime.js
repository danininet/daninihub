const legal={
'/cookies':['Cookies','Technically necessary cookies only during MVP.'],
'/ki-transparenz':['KI-Transparenz','AI supports structure, questions, analysis and artifacts. Users remain responsible for decisions.'],
'/affiliate-hinweis':['Affiliate-Hinweis','Partner links may be used and must be treated as commercial disclosures.'],
'/impressum':['Impressum','Operator details are finalized by the Owner. This is a provisional legal notice.'],
'/datenschutz':['Datenschutz','Only data required for contact, activation, delivery and operation is processed during MVP.'],
'/haftungsausschluss':['Haftungsausschluss','No income, investment, legal, financial, medical or project success guarantee.'],
'/sr/kolacici':['Kolačići','U MVP fazi koriste se samo tehnički neophodni kolačići.'],
'/sr/ai-transparentnost':['AI transparentnost','AI pomaže u strukturiranju pitanja, analiza i artefakata. Korisnik ostaje odgovoran za odluke.'],
'/sr/affiliate-napomena':['Affiliate napomena','Partnerski linkovi mogu biti korišćeni i moraju se tretirati kao komercijalne napomene.'],
'/sr/impressum':['Impressum','Podatke operatora finalno uređuje Owner. Ovo je privremena pravna napomena.'],
'/sr/privatnost':['Privatnost','U MVP fazi obrađuju se samo podaci potrebni za kontakt, aktivaciju, isporuku i rad sistema.'],
'/sr/odricanje-odgovornosti':['Odricanje odgovornosti','Nema garancije zarade, investicionog uspeha, pravnog, finansijskog, medicinskog ili projektnog rezultata.'],
'/en/cookies':['Cookies','Technically necessary cookies only during MVP.'],
'/en/ai-transparency':['AI Transparency','AI supports structure, questions, analysis and artifacts. Users remain responsible for decisions.'],
'/en/affiliate-disclosure':['Affiliate Disclosure','Partner links may be used and must be treated as commercial disclosures.'],
'/en/imprint':['Imprint','Operator details are finalized by the Owner. This is a provisional legal notice.'],
'/en/privacy':['Privacy','Only data required for contact, activation, delivery and operation is processed during MVP.'],
'/en/disclaimer':['Disclaimer','No income, investment, legal, financial, medical or project success guarantee.']
};
function page(title,body){return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} - DaniniHub</title><meta name="robots" content="index,follow"><style>body{margin:0;background:#07111f;color:#f7f2e8;font-family:Arial,Helvetica,sans-serif}main{max-width:900px;margin:auto;padding:56px 22px}.card{border:1px solid rgba(214,178,94,.35);border-radius:24px;padding:32px;background:rgba(255,255,255,.06)}a{color:#d6b25e}.btn{display:inline-block;margin-top:20px;padding:12px 18px;border-radius:999px;background:#d6b25e;color:#07111f;text-decoration:none;font-weight:700}</style></head><body><main><section class="card"><p>DaniniHub Trust Layer</p><h1>${title}</h1><p>${body}</p><p><a class="btn" href="/api/entry/7-eur/checkout">ENTRY 7 EUR</a></p><p><a href="/">Back to DaniniHub</a></p></section></main></body></html>`;}
function mountLegalRuntime(app){Object.keys(legal).forEach(p=>app.get(p,(req,res)=>res.type('html').send(page(legal[p][0],legal[p][1]))));}
module.exports={mountLegalRuntime};
