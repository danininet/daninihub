'use strict';

const crypto=require('crypto');
const express=require('express');
const path=require('path');
const Stripe=require('stripe');
const {BrevoClient}=require('@getbrevo/brevo');
const {evaluateImport,estimateFieldServices}=require('./core/importos-engine');
const {listModelDna,getModelDna}=require('./core/importos-model-dna');
const {createImportOSStore}=require('./importos-store');
const {
  createStripeHoldCheckout,
  getStripeAuthorization,
  captureStripe,
  cancelStripe,
  createPayPalAuthorizeOrder,
  authorizePayPalOrder,
  capturePayPal,
  voidPayPal,
  createPayPalPassportOrder,
  capturePayPalOrder
}=require('./core/importos-payments');

const clean=(v,max=4000)=>String(v||'').trim().slice(0,max);
const html=v=>clean(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const eur=v=>new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format(Number(v||0));
const cents=v=>Math.round(Number(v)*100);

function reference(prefix){
  return prefix+'-'+new Date().toISOString().slice(0,10).replace(/-/g,'')+'-'+crypto.randomBytes(3).toString('hex').toUpperCase();
}
function publicUrl(req){
  const configured=clean(process.env.DANINI_PUBLIC_URL,500).replace(/\/$/,'');
  if(configured)return configured;
  const proto=clean(req.headers['x-forwarded-proto']||req.protocol||'https',20).split(',')[0].trim();
  return proto+'://'+req.get('host');
}
function adminAllowed(req){
  const secret=clean(process.env.DANINI_ADMIN_SECRET,300);
  const supplied=clean(req.headers['x-danini-admin']||String(req.headers.authorization||'').replace(/^Bearer\s+/i,''),300);
  if(!secret||!supplied||secret.length!==supplied.length)return false;
  return crypto.timingSafeEqual(Buffer.from(secret),Buffer.from(supplied));
}
function sender(){
  const email=process.env.BREVO_SENDER_EMAIL||process.env.DANINIHUB_SENDER_EMAIL||process.env.MAIL_FROM||process.env.EMAIL_FROM;
  return email?{email,name:process.env.BREVO_SENDER_NAME||'DANINI'}:null;
}
async function notifyServiceRequest(record){
  if(!process.env.BREVO_API_KEY)return false;
  const from=sender(); if(!from)return false;
  const api=new BrevoClient({apiKey:process.env.BREVO_API_KEY}).transactionalEmails;
  const admin=process.env.DANINI_ADMIN_EMAIL||'info@daninihub.com';
  const p=record.payload||{};
  await api.sendTransacEmail({
    sender:from,to:[{email:admin,name:'DANINI'}],
    replyTo:record.email?{email:record.email,name:record.name||'ImportOS Kunde'}:undefined,
    subject:'ImportOS Anfrage '+record.reference+' · '+clean(p.serviceType,120),
    htmlContent:`<h2>Neue ImportOS Service-Anfrage</h2><p><strong>Referenz:</strong> ${html(record.reference)}</p><p><strong>Service:</strong> ${html(p.serviceType)}</p><p><strong>Name:</strong> ${html(record.name)}<br><strong>E-Mail:</strong> ${html(record.email)}<br><strong>Telefon:</strong> ${html(p.phone)}</p><p><strong>Fahrzeug:</strong> ${html(p.vehicle)}<br><strong>VIN:</strong> ${html(p.vin)}<br><strong>Teilenummer:</strong> ${html(p.partNumber)}</p><p><strong>Abholort:</strong> ${html(p.pickupLocation)}<br><strong>Ziel:</strong> ${html(p.destination)}</p><p><strong>Nachricht:</strong><br>${html(p.message).replace(/\n/g,'<br>')}</p>`
  });
  if(record.email)await api.sendTransacEmail({
    sender:from,to:[{email:record.email,name:record.name||'ImportOS Kunde'}],
    subject:(record.language==='sr'?'Vaš DANINI upit · ':'Ihre DANINI Anfrage · ')+record.reference,
    htmlContent:record.language==='sr'
      ?`<h2>Primili smo vaš upit.</h2><p>Broj upita: <strong>${html(record.reference)}</strong></p><p>Proverićemo udaljenost, dostupnost, obim usluge i potrebna dokumenta. Zatim dobijate konkretnu ponudu. Ova potvrda još nije prihvatanje narudžbine.</p><p>DANINI · Pregled i uvoz automobila</p>`
      :`<h2>Ihre Anfrage ist eingegangen.</h2><p>Referenz: <strong>${html(record.reference)}</strong></p><p>Wir prüfen Umfang, Entfernung, Verfügbarkeit und notwendige Dokumente. Erst danach erhalten Sie ein konkretes Angebot. Diese Bestätigung ist noch keine Auftragsannahme.</p><p>DANINI · Fahrzeugimport</p>`
  });
  return true;
}
async function notifyQuote(record,bookingUrl){
  if(!process.env.BREVO_API_KEY)return false;
  const from=sender();if(!from)return false;
  const api=new BrevoClient({apiKey:process.env.BREVO_API_KEY}).transactionalEmails;
  const sr=record.language==='sr';
  await api.sendTransacEmail({
    sender:from,to:[{email:record.email,name:record.name||'DANINI korisnik'}],
    subject:(sr?'DANINI ponuda · ':'DANINI Angebot · ')+record.reference,
    htmlContent:`<h2>${sr?'Vaša ponuda':'Ihr Angebot'}</h2><p>${html(record.payload.description)}</p><p><strong>${eur(record.payload.amountCents/100)}</strong></p><p><a href="${html(bookingUrl)}">${sr?'Pogledaj ponudu':'Angebot ansehen'}</a></p><p>${sr?'Ponuda važi do':'Angebot gültig bis'}: ${html(record.payload.expiresAt)}. ${sr?'Usluga se sprovodi tek po dogovoru o obimu i terminu.':'Leistung nach Vereinbarung von Umfang und Termin.'}</p>`
  });
  return true;
}
function previewResult(full){
  return {
    product:full.product,version:full.version,decision:full.decision,route:full.route,customsBasis:full.customsBasis,
    importability:{status:full.importability.status,historic:full.importability.historic,issues:full.importability.issues.slice(0,2)},
    originProof:full.originProof,
    scenarios:full.scenarios.map(x=>({name:x.name,dutyRate:x.dutyRate,total:x.total,duty:x.duty,vat:x.vat,grossSpread:x.grossSpread,marginPct:x.marginPct})),
    corridor:full.corridor,
    fraud:{score:full.fraud.score,verdict:full.fraud.verdict,flagCount:full.fraud.flags.length},
    modelDna:full.modelDna?{key:full.modelDna.key,label:full.modelDna.label,sourceQuality:full.modelDna.sourceQuality}:null,
    premiumLocked:true,priceEur:9.90
  };
}
function renderPaidReport(record){
  const result=record?.payload?.result;
  if(!result)return '<h1>Import Passport nije pronađen.</h1>';
  const scenarios=(result.scenarios||[]).map(s=>`<article><h3>${html(s.name)}</h3><strong>${eur(s.total)}</strong><p>Carina ${eur(s.duty)} · PDV ${eur(s.vat)}</p></article>`).join('');
  const flags=(result.fraud?.flags||[]).map(f=>`<li><strong>${html(f.code)}</strong> — ${html(f.text)}</li>`).join('')||'<li>Nema aktiviranih osnovnih crvenih zastavica iz unetih podataka.</li>';
  const dna=result.modelDna?`<h2>Model DNA · ${html(result.modelDna.label)}</h2><h3>Prednosti</h3><ul>${result.modelDna.strengths.map(x=>'<li>'+html(x)+'</li>').join('')}</ul><h3>Šta proveriti</h3><ul>${result.modelDna.watch.map(x=>'<li>'+html(x)+'</li>').join('')}</ul>`:'<h2>Model DNA</h2><p>Profil nije izabran.</p>';
  const diy=(result.checklists?.diy||[]).map(x=>'<li>'+html(x)+'</li>').join('');
  const broker=(result.checklists?.broker||[]).map(x=>'<li>'+html(x)+'</li>').join('');
  const sources=(result.sources||[]).map(s=>`<li><a href="${html(s.url)}" target="_blank" rel="noreferrer">${html(s.title)}</a> · ${html(s.verifiedAt)}</li>`).join('');
  return `<!doctype html><html lang="sr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Import Passport ${html(record.reference)}</title><style>body{margin:0;background:#090d11;color:#e8edf2;font-family:Inter,Arial,sans-serif}.w{max-width:980px;margin:auto;padding:36px 18px}.hero{padding:30px;border:1px solid #28323c;border-radius:20px;background:#111820}.hero small{color:#ff7438;letter-spacing:.14em}.hero h1{font-size:44px;margin:10px 0}.verdict{font-size:30px;color:#ff8a52}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin:14px 0}.card,article{background:#121920;border:1px solid #28323c;border-radius:16px;padding:20px}.card h2{margin-top:0}li{margin:8px 0;line-height:1.55}a{color:#8bc5ff}.note{font-size:13px;color:#9aa6b2;line-height:1.7}</style></head><body><main class="w"><section class="hero"><small>DANINI · IMPORT PASSPORT</small><h1>${html(record.reference)}</h1><div class="verdict">${html(result.decision)}</div><p>${html(result.route)} · ${eur(result.corridor.best)} – ${eur(result.corridor.worst)}</p></section><div class="grid">${scenarios}</div><section class="card"><h2>Importability Gate</h2><p><strong>${html(result.importability.status)}</strong></p><ul>${result.importability.issues.map(x=>'<li>'+html(x)+'</li>').join('')}</ul></section><section class="card"><h2>Fraud Shield · ${html(result.fraud.score)}/100</h2><ul>${flags}</ul></section><section class="card">${dna}</section><div class="grid"><section class="card"><h2>DIY ruta</h2><ol>${diy}</ol></section><section class="card"><h2>Preko posrednika</h2><ol>${broker}</ol></section></div><section class="card"><h2>Izvori</h2><ul>${sources}</ul></section><p class="note">ImportOS je pomoć pri odluci. Ne zamenjuje carinsku odluku, tehnički pregled, Kfz-Gutachten, homologaciju ili pravni savet.</p></main></body></html>`;
}
function quotePublic(record){
  if(!record||record.type!=='service-quote')return null;
  const p=record.payload||{};
  return {
    reference:record.reference,status:record.status,language:record.language,
    serviceType:p.serviceType,description:p.description,amountCents:p.amountCents,currency:p.currency||'EUR',
    serviceDate:p.serviceDate||null,expiresAt:p.expiresAt||null,
    paymentProvider:p.payment?.provider||null,paymentStatus:p.payment?.status||null
  };
}
function quoteUsable(record){
  if(!record||record.type!=='service-quote')return false;
  if(['CAPTURED','VOIDED','EXPIRED'].includes(record.status))return false;
  const expires=Date.parse(record.payload?.expiresAt||'');
  return !Number.isFinite(expires)||expires>Date.now();
}

function mountImportOSRuntime(app){
  const store=createImportOSStore();
  app.use('/api/importos',express.json({limit:'120kb'}));

  app.get('/api/importos/models',(req,res)=>res.json({ok:true,models:listModelDna().map(x=>({key:x.key,label:x.label,sourceQuality:x.sourceQuality}))}));
  app.get('/api/importos/model/:key',(req,res)=>{
    const item=getModelDna(req.params.key);
    if(!item)return res.status(404).json({ok:false,error:'MODEL_DNA_NOT_FOUND'});
    return res.json({ok:true,model:item});
  });
  app.post('/api/importos/evaluate',(req,res)=>{
    try{return res.json({ok:true,result:previewResult(evaluateImport(req.body||{}))})}
    catch(error){return res.status(400).json({ok:false,error:error.message||'IMPORTOS_EVALUATION_FAILED'})}
  });
  app.post('/api/importos/services/estimate',(req,res)=>{
    try{return res.json({ok:true,estimate:estimateFieldServices(req.body||{})})}
    catch(error){return res.status(400).json({ok:false,error:error.message||'SERVICE_ESTIMATE_FAILED'})}
  });

  app.post('/api/importos/service-request',async(req,res)=>{
    const data=req.body||{};
    const email=clean(data.email,191).toLowerCase();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return res.status(400).json({ok:false,error:'VALID_EMAIL_REQUIRED'});
    if(data.privacyAcknowledged!==true)return res.status(400).json({ok:false,error:'PRIVACY_NOTICE_REQUIRED'});
    const serviceType=clean(data.serviceType,120);
    const allowed=new Set(['FIELD_CHECK_LIVE','PRO_MECHANIC_CHECK','DRIVER_ONLY','TRAILER_TRANSPORT','TRUCK_TRANSPORT','ORIGINAL_PARTS','IMPORT_BASE']);
    if(!allowed.has(serviceType))return res.status(400).json({ok:false,error:'INVALID_SERVICE_TYPE'});
    const record=await store.create({
      reference:reference('SRV'),type:'service-request',language:data.language==='sr'?'sr':'de',email,name:clean(data.name,180),status:'NEW',
      payload:{serviceType,phone:clean(data.phone,120),vehicle:clean(data.vehicle,280),vin:clean(data.vin,80),partNumber:clean(data.partNumber,120),pickupLocation:clean(data.pickupLocation,280),destination:clean(data.destination,280),message:clean(data.message,4000)}
    });
    let delivered=false;
    try{delivered=await notifyServiceRequest(record)}catch(error){console.error('ImportOS request email failed:',error.message)}
    return res.json({ok:true,reference:record.reference,delivered});
  });

  app.get('/api/importos/admin/records',async(req,res)=>{
    if(!adminAllowed(req))return res.status(403).json({ok:false,error:'FORBIDDEN'});
    const records=await store.listRecent(50);
    res.set('Cache-Control','no-store');
    return res.json({ok:true,records:records.map(item=>({reference:item.reference,type:item.type,status:item.status,
      createdAt:item.createdAt,name:item.name,email:item.email,language:item.language,payload:item.payload}))});
  });

  app.post('/api/importos/admin/quotes',async(req,res)=>{
    if(!adminAllowed(req))return res.status(403).json({ok:false,error:'FORBIDDEN'});
    const data=req.body||{};
    const email=clean(data.email,191).toLowerCase();
    const amountEur=Number(data.amountEur);
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return res.status(400).json({ok:false,error:'VALID_EMAIL_REQUIRED'});
    if(!Number.isFinite(amountEur)||amountEur<5||amountEur>20000)return res.status(400).json({ok:false,error:'INVALID_AMOUNT'});
    const hours=Math.min(168,Math.max(1,Number(data.expiresInHours)||72));
    const requestReference=clean(data.requestReference,80);
    let linkedRequest=null;
    if(requestReference){
      linkedRequest=await store.get(requestReference);
      if(!linkedRequest||linkedRequest.type!=='service-request'||linkedRequest.email!==email)return res.status(400).json({ok:false,error:'REQUEST_MISMATCH'});
    }
    const ref=reference('QTE');
    const record=await store.create({
      reference:ref,type:'service-quote',language:data.language==='sr'?'sr':'de',email,name:clean(data.name,180),status:'QUOTED',
      payload:{
        serviceType:clean(data.serviceType,120),
        description:clean(data.description,500),
        amountCents:cents(amountEur),
        currency:'EUR',
        serviceDate:clean(data.serviceDate,80)||null,
        expiresAt:new Date(Date.now()+hours*3600000).toISOString(),
        requestReference:linkedRequest?.reference||null,
        payment:null
      }
    });
    const bookingUrl=publicUrl(req)+'/'+record.language+'/?quote='+encodeURIComponent(ref)+'#quote-checkout';
    if(linkedRequest)await store.update(linkedRequest.reference,{status:'QUOTED',reviewedAt:new Date().toISOString()});
    let delivered=false;
    try{delivered=await notifyQuote(record,bookingUrl)}catch(error){console.error('ImportOS quote email failed:',error.message)}
    return res.json({ok:true,quote:quotePublic(record),bookingUrl,delivered});
  });

  app.get('/api/importos/quotes/:reference',async(req,res)=>{
    const record=await store.get(clean(req.params.reference,80));
    const pub=quotePublic(record);
    if(!pub)return res.status(404).json({ok:false,error:'QUOTE_NOT_FOUND'});
    if(!quoteUsable(record)&&record.status!=='CAPTURED')return res.status(410).json({ok:false,error:'QUOTE_EXPIRED',quote:pub});
    const enabled=process.env.DANINI_IMPORTOS_SERVICE_PAYMENTS_ENABLED==='true';
    return res.json({ok:true,quote:pub,paymentOptions:{card:enabled&&Boolean(process.env.STRIPE_SECRET_KEY),paypal:enabled&&Boolean(process.env.PAYPAL_CLIENT_ID&&process.env.PAYPAL_CLIENT_SECRET)}});
  });

  app.post('/api/importos/quotes/:reference/authorize/stripe',async(req,res)=>{
    if(process.env.DANINI_IMPORTOS_SERVICE_PAYMENTS_ENABLED!=='true')return res.status(503).json({ok:false,error:'SERVICE_PAYMENTS_NOT_ACTIVE'});
    const ref=clean(req.params.reference,80);
    const record=await store.get(ref);
    if(!quoteUsable(record)||record.status!=='QUOTED')return res.status(409).json({ok:false,error:'QUOTE_NOT_USABLE'});
    try{
      const created=await createStripeHoldCheckout({
        origin:publicUrl(req),quoteRef:ref,email:record.email,amountCents:record.payload.amountCents,currency:'eur',
        description:record.payload.description||record.payload.serviceType,language:record.language
      });
      await store.update(ref,{status:'AUTHORIZATION_PENDING',payload:{...record.payload,payment:{provider:'stripe',status:'CHECKOUT_CREATED',sessionId:created.sessionId}}});
      return res.json({ok:true,checkoutUrl:created.checkoutUrl});
    }catch(error){
      console.error('Stripe hold checkout failed:',error.message);
      return res.status(503).json({ok:false,error:error.message||'STRIPE_AUTHORIZATION_FAILED'});
    }
  });

  app.post('/api/importos/quotes/:reference/authorize/paypal',async(req,res)=>{
    if(process.env.DANINI_IMPORTOS_SERVICE_PAYMENTS_ENABLED!=='true')return res.status(503).json({ok:false,error:'SERVICE_PAYMENTS_NOT_ACTIVE'});
    const ref=clean(req.params.reference,80);
    const record=await store.get(ref);
    if(!quoteUsable(record)||record.status!=='QUOTED')return res.status(409).json({ok:false,error:'QUOTE_NOT_USABLE'});
    try{
      const created=await createPayPalAuthorizeOrder({
        origin:publicUrl(req),quoteRef:ref,amountCents:record.payload.amountCents,currency:'EUR',
        description:record.payload.description||record.payload.serviceType,language:record.language
      });
      await store.update(ref,{status:'AUTHORIZATION_PENDING',payload:{...record.payload,payment:{provider:'paypal',status:'ORDER_CREATED',orderId:created.orderId}}});
      return res.json({ok:true,checkoutUrl:created.checkoutUrl});
    }catch(error){
      console.error('PayPal hold checkout failed:',error.message,error.details||'');
      return res.status(503).json({ok:false,error:error.message||'PAYPAL_AUTHORIZATION_FAILED'});
    }
  });

  app.get('/payment/stripe/authorized',async(req,res)=>{
    const ref=clean(req.query.quote,80);
    const sessionId=clean(req.query.session_id,250);
    const record=await store.get(ref);
    if(!record||record.type!=='service-quote')return res.status(404).type('html').send('<h1>Quote not found.</h1>');
    try{
      const auth=await getStripeAuthorization(sessionId);
      if(auth.status!=='requires_capture')return res.status(409).type('html').send('<h1>Card authorization was not completed.</h1>');
      await store.update(ref,{status:'AUTHORIZED',payload:{...record.payload,payment:{provider:'stripe',status:auth.status,sessionId:auth.sessionId,paymentIntentId:auth.paymentIntentId,amountCapturable:auth.amountCapturable,captureBefore:auth.captureBefore}}});
      return res.type('html').send(`<main style="max-width:720px;margin:70px auto;font-family:system-ui"><h1>Zahlung autorisiert / Iznos rezervisan</h1><p><strong>${html(ref)}</strong></p><p>Der Betrag wurde autorisiert, aber noch nicht eingezogen. / Iznos je rezervisan, ali još nije naplaćen.</p><p><a href="/${record.language}/#payment-protection">Zurück / Nazad</a></p></main>`);
    }catch(error){
      console.error('Stripe authorization callback failed:',error.message);
      return res.status(500).type('html').send('<h1>Authorization verification failed.</h1>');
    }
  });

  app.get('/payment/paypal/authorized',async(req,res)=>{
    const ref=clean(req.query.quote,80);
    const orderId=clean(req.query.token,250);
    const record=await store.get(ref);
    if(!record||record.type!=='service-quote')return res.status(404).type('html').send('<h1>Quote not found.</h1>');
    try{
      const auth=await authorizePayPalOrder(orderId);
      await store.update(ref,{status:'AUTHORIZED',payload:{...record.payload,payment:{provider:'paypal',status:auth.status,orderId:auth.orderId,authorizationId:auth.authorizationId,expirationTime:auth.expirationTime,amount:auth.amount}}});
      return res.type('html').send(`<main style="max-width:720px;margin:70px auto;font-family:system-ui"><h1>PayPal autorisiert / PayPal rezervacija</h1><p><strong>${html(ref)}</strong></p><p>Der Betrag ist autorisiert, aber noch nicht eingezogen. PayPal-Autorisierungen sind zeitlich begrenzt.</p><p><a href="/${record.language}/#payment-protection">Zurück / Nazad</a></p></main>`);
    }catch(error){
      console.error('PayPal authorization callback failed:',error.message,error.details||'');
      return res.status(500).type('html').send('<h1>PayPal authorization failed.</h1>');
    }
  });

  app.post('/api/importos/admin/quotes/:reference/capture',async(req,res)=>{
    if(!adminAllowed(req))return res.status(403).json({ok:false,error:'FORBIDDEN'});
    const ref=clean(req.params.reference,80);
    const record=await store.get(ref);
    if(!record||record.status!=='AUTHORIZED')return res.status(409).json({ok:false,error:'QUOTE_NOT_AUTHORIZED'});
    const payment=record.payload?.payment||{};
    try{
      let captured;
      if(payment.provider==='stripe')captured=await captureStripe(payment.paymentIntentId,req.body?.amountEur?cents(req.body.amountEur):undefined);
      else if(payment.provider==='paypal')captured=await capturePayPal(payment.authorizationId,req.body?.amountEur?{currency_code:'EUR',value:Number(req.body.amountEur).toFixed(2)}:undefined);
      else return res.status(400).json({ok:false,error:'UNKNOWN_PROVIDER'});
      await store.update(ref,{status:'CAPTURED',reviewedAt:new Date().toISOString(),payload:{...record.payload,payment:{...payment,status:'CAPTURED',capture:captured}}});
      return res.json({ok:true,reference:ref,capture:captured});
    }catch(error){
      console.error('Service capture failed:',error.message,error.details||'');
      return res.status(503).json({ok:false,error:error.message||'CAPTURE_FAILED'});
    }
  });

  app.post('/api/importos/admin/quotes/:reference/void',async(req,res)=>{
    if(!adminAllowed(req))return res.status(403).json({ok:false,error:'FORBIDDEN'});
    const ref=clean(req.params.reference,80);
    const record=await store.get(ref);
    if(!record||!['AUTHORIZED','AUTHORIZATION_PENDING'].includes(record.status))return res.status(409).json({ok:false,error:'QUOTE_NOT_VOIDABLE'});
    const payment=record.payload?.payment||{};
    try{
      let released={provider:payment.provider,status:'NO_AUTHORIZATION_TO_RELEASE'};
      if(payment.provider==='stripe'&&payment.paymentIntentId)released=await cancelStripe(payment.paymentIntentId);
      else if(payment.provider==='paypal'&&payment.authorizationId)released=await voidPayPal(payment.authorizationId);
      await store.update(ref,{status:'VOIDED',reviewedAt:new Date().toISOString(),payload:{...record.payload,payment:{...payment,status:'VOIDED',release:released}}});
      return res.json({ok:true,reference:ref,release:released});
    }catch(error){
      console.error('Service authorization release failed:',error.message,error.details||'');
      return res.status(503).json({ok:false,error:error.message||'VOID_FAILED'});
    }
  });

  app.post('/api/importos/checkout',async(req,res)=>{
    const data=req.body||{}; const email=clean(data.email,191).toLowerCase(); const language=data.language==='sr'?'sr':'de';
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return res.status(400).json({ok:false,error:'VALID_EMAIL_REQUIRED'});
    if(data.termsAccepted!==true)return res.status(400).json({ok:false,error:'TERMS_ACCEPTANCE_REQUIRED'});
    if(!process.env.STRIPE_SECRET_KEY)return res.status(503).json({ok:false,error:'PAYMENT_NOT_CONFIGURED'});
    if(process.env.DANINI_IMPORTOS_CHECKOUT_ENABLED!=='true')return res.status(503).json({ok:false,error:'CHECKOUT_PENDING_LEGAL_ACTIVATION'});
    try{
      const full=evaluateImport(data.vehicle||{}); const ref=reference('IMP'); const stripe=new Stripe(process.env.STRIPE_SECRET_KEY); const origin=publicUrl(req);
      const session=await stripe.checkout.sessions.create({
        mode:'payment',customer_email:email,billing_address_collection:'auto',
        success_url:origin+'/importos/success?session_id={CHECKOUT_SESSION_ID}',cancel_url:origin+'/'+language+'/?importos_cancelled=1#passport',
        line_items:[{quantity:1,price_data:{currency:'eur',unit_amount:990,product_data:{name:'DANINI Import Passport',description:'DE/CH → RS: Importability, Origin Risk, Fraud Shield, Model DNA, Landed Cost und DIY/Profi-Route.'}}}],
        metadata:{system:'DANINI ImportOS',product:'import_passport',order_ref:ref,language}
      });
      await store.create({reference:ref,type:'passport-order',language,email,name:clean(data.name||email,180),status:'CHECKOUT_CREATED',payload:{result:full,vehicle:data.vehicle||{},provider:'stripe',stripeSessionId:session.id,priceEur:9.90}});
      return res.json({ok:true,reference:ref,checkoutUrl:session.url});
    }catch(error){console.error('ImportOS checkout failed:',error.message);return res.status(500).json({ok:false,error:'IMPORTOS_CHECKOUT_FAILED'})}
  });

  app.post('/api/importos/checkout/paypal',async(req,res)=>{
    const data=req.body||{}; const email=clean(data.email,191).toLowerCase(); const language=data.language==='sr'?'sr':'de';
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return res.status(400).json({ok:false,error:'VALID_EMAIL_REQUIRED'});
    if(data.termsAccepted!==true)return res.status(400).json({ok:false,error:'TERMS_ACCEPTANCE_REQUIRED'});
    if(process.env.DANINI_IMPORTOS_CHECKOUT_ENABLED!=='true')return res.status(503).json({ok:false,error:'CHECKOUT_PENDING_LEGAL_ACTIVATION'});
    try{
      const full=evaluateImport(data.vehicle||{}); const ref=reference('IMP');
      const pp=await createPayPalPassportOrder({origin:publicUrl(req),reference:ref,email,language});
      await store.create({reference:ref,type:'passport-order',language,email,name:clean(data.name||email,180),status:'CHECKOUT_CREATED',payload:{result:full,vehicle:data.vehicle||{},provider:'paypal',paypalOrderId:pp.orderId,priceEur:9.90}});
      return res.json({ok:true,reference:ref,checkoutUrl:pp.checkoutUrl});
    }catch(error){console.error('PayPal passport checkout failed:',error.message,error.details||'');return res.status(503).json({ok:false,error:error.message||'PAYPAL_CHECKOUT_FAILED'})}
  });

  app.get('/importos/success',async(req,res)=>{
    const sessionId=clean(req.query.session_id,250);
    if(!sessionId||!process.env.STRIPE_SECRET_KEY)return res.status(400).type('html').send('<h1>Missing payment session.</h1>');
    try{
      const stripe=new Stripe(process.env.STRIPE_SECRET_KEY); const session=await stripe.checkout.sessions.retrieve(sessionId);
      if(session.payment_status!=='paid')return res.status(402).type('html').send('<h1>Payment not completed.</h1>');
      const ref=clean(session.metadata?.order_ref,64); const record=await store.get(ref);
      if(!record||record.payload?.stripeSessionId!==session.id)return res.status(404).type('html').send('<h1>Import Passport not found.</h1>');
      if(record.status!=='PAID')await store.update(ref,{status:'PAID',reviewedAt:new Date().toISOString()});
      res.set('Cache-Control','private, no-store'); return res.type('html').send(renderPaidReport(record));
    }catch(error){console.error('ImportOS paid report failed:',error.message);return res.status(500).type('html').send('<h1>Import Passport could not be opened.</h1>')}
  });

  app.get('/payment/paypal/passport',async(req,res)=>{
    const ref=clean(req.query.ref,80); const orderId=clean(req.query.token,250); const record=await store.get(ref);
    if(!record||record.type!=='passport-order'||record.payload?.paypalOrderId!==orderId)return res.status(404).type('html').send('<h1>Import Passport not found.</h1>');
    try{
      const capture=await capturePayPalOrder(orderId);
      if(capture.status!=='COMPLETED')return res.status(402).type('html').send('<h1>PayPal payment not completed.</h1>');
      await store.update(ref,{status:'PAID',reviewedAt:new Date().toISOString(),payload:{...record.payload,paypalCapture:capture}});
      const updated=await store.get(ref); res.set('Cache-Control','private, no-store'); return res.type('html').send(renderPaidReport(updated));
    }catch(error){console.error('PayPal passport capture failed:',error.message,error.details||'');return res.status(500).type('html').send('<h1>PayPal payment could not be completed.</h1>')}
  });
}

module.exports={mountImportOSRuntime,previewResult,renderPaidReport};
