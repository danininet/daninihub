'use strict';
/**
 * DANINI digital delivery. No public paid PDF assets, no trust in browser
 * payment claims. Live checkout requires durable DB, verified PayPal merchant,
 * a private local PDF file and a 32+ character signing secret.
 */
const express=require('express');
const path=require('node:path');
const fs=require('node:fs');
const crypto=require('node:crypto');
const {BrevoClient}=require('@getbrevo/brevo');
const SKU=Object.freeze({guide:4900,software:14900});
const PRODUCT=Object.freeze({guide:'DANINI Auto-Biznis Master Vodic (PDF)',software:'DANINI Softverski Paket + Master Vodic GRATIS'});
const RE=/^[^@\s]{1,64}@[^@\s]{1,180}\.[^@\s]{2,}$/;
const MAX_AGE=72*60*60*1000;
const fixedOrigin='https://daninihub.com';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function paypalRoot(){return process.env.PAYPAL_ENV==='live'?'https://api-m.paypal.com':'https://api-m.sandbox.paypal.com'}
function privateFile(){
  const raw=process.env.DANINI_GUIDE_PDF_PATH||'';
  if(!path.isAbsolute(raw))return null;
  try{
    const file=fs.realpathSync(raw);
    const root=fs.realpathSync(__dirname);
    // Never rely on an accidentally committed or publicly served paid PDF.
    if(file===root||file.startsWith(root+path.sep))return null;
    const stat=fs.statSync(file);
    if(!stat.isFile()||stat.size<100000||stat.size>25*1024*1024)return null;
    const fd=fs.openSync(file,'r'); const sig=Buffer.alloc(5);
    try{fs.readSync(fd,sig,0,5,0)}finally{fs.closeSync(fd)}
    return sig.toString()==='%PDF-'?file:null;
  }catch{return null}
}
function enabled(app){
  const store=app.locals.importOSStore;
  return Boolean(process.env.DANINI_DIGITAL_CHECKOUT_ENABLED==='true' &&
    process.env.PAYPAL_CLIENT_ID &&
    process.env.PAYPAL_CLIENT_SECRET &&
    process.env.PAYPAL_WEBHOOK_ID &&
    ['live','sandbox'].includes(process.env.PAYPAL_ENV) &&
    (process.env.PAYPAL_ENV==='live'?(process.env.DANINI_PAYPAL_RECEIVER_EMAIL||'').toLowerCase()==='draganganet@gmail.com':RE.test(process.env.DANINI_PAYPAL_RECEIVER_EMAIL||'')) &&
    (process.env.DANINI_DIGITAL_SIGNING_SECRET||'').length>=32 &&
    process.env.DANINI_PUBLIC_URL===fixedOrigin &&
    store&&store.mode==='mysql' && privateFile());
}
function sign(ref,sku,expires){
  const message=[ref,sku,String(expires)].join('.');
  return crypto.createHmac('sha256',process.env.DANINI_DIGITAL_SIGNING_SECRET||'not-configured').update(message).digest('base64url');
}
function tokenFor(record,expires){
  const paidAt=Date.parse(record?.payload?.paymentVerifiedAt||'');
  if(!Number.isFinite(paidAt))throw Error('PAYMENT_TIMESTAMP_REQUIRED');
  const deadline=paidAt+MAX_AGE;
  expires=expires===undefined?deadline:expires;
  if(expires>deadline)throw Error('DOWNLOAD_EXPIRY_OUT_OF_BOUNDS');
  const sku=record?.payload?.sku;
  if(!Object.hasOwn(SKU,sku)||!record?.reference)throw Error('INVALID_ORDER');
  const t=[record.reference,sku,String(expires),sign(record.reference,sku,expires)].join('.');
  return t;
}
function validToken(record,token,now=Date.now()){
  if(!record||record.type!=='digital-order'||record.status!=='PAID'||typeof token!=='string'||token.length>300)return false;
  const parts=token.split('.');
  if(parts.length!==4||parts[0]!==record.reference||parts[1]!==record.payload?.sku||! /^\d{13}$/.test(parts[2]))return false;
  const exp=Number(parts[2]);
  const paidAt=Date.parse(record.payload?.paymentVerifiedAt||'');
  if(!Number.isFinite(paidAt)||exp>paidAt+MAX_AGE||exp<=now||exp>now+MAX_AGE||!process.env.DANINI_DIGITAL_SIGNING_SECRET)return false;
  const expected=sign(parts[0],parts[1],exp);
  const provided=Buffer.from(parts[3]||'','utf8');
  const correct=Buffer.from(expected,'utf8');
  return provided.length===correct.length&&crypto.timingSafeEqual(provided,correct);
}
async function api(route,options={}){
  const creds=process.env.PAYPAL_CLIENT_ID+':'+process.env.PAYPAL_CLIENT_SECRET;
  const t=await fetch(paypalRoot()+'/v1/oauth2/token',{method:'POST',headers:{Authorization:'Basic '+Buffer.from(creds).toString('base64'),'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=client_credentials'});
  if(!t.ok)throw Error('PAYPAL_AUTH_FAILED');
  const access=(await t.json()).access_token;
  const h={Authorization:'Bearer '+access,'Content-Type':'application/json'};
  if(options.requestId)h['PayPal-Request-Id']=options.requestId;
  const response=await fetch(paypalRoot()+route,{method:options.method||'GET',headers:h,body:options.body?JSON.stringify(options.body):undefined});
  const data=await response.json().catch(()=>({}));
  if(!response.ok){const err=new Error('PAYPAL_API_'+response.status);err.status=response.status;throw err}
  return data;
}
function verified(order,record){
  if(!order||order.id!==record.payload.paypalOrderId||order.status!=='COMPLETED')return false;
  const unit=order.purchase_units?.[0]||{};
  const capture=unit.payments?.captures?.find(c=>c.status==='COMPLETED')||null;
  const expected=SKU[record.payload.sku];
  const actual=capture?.amount;
  if(!expected||unit.custom_id!==record.reference||!capture)return false;
  if(actual?.currency_code!=='EUR'||actual?.value!==(expected/100).toFixed(2))return false;
  const receiver=(unit.payee?.email_address||capture?.payee?.email_address||'').toLowerCase();
  if(receiver!==(process.env.DANINI_PAYPAL_RECEIVER_EMAIL||'').toLowerCase())return false;
  return true;
}
function reportUrl(record){
  return fixedOrigin+'/digital/download/'+encodeURIComponent(record.reference)+'?token='+encodeURIComponent(tokenFor(record));
}
async function notify(record,url){
  if(!process.env.BREVO_API_KEY)return false;
  const sender=process.env.BREVO_SENDER_EMAIL||process.env.DANINIHUB_SENDER_EMAIL||process.env.MAIL_FROM;
  if(!sender)return false;
  const de=record.language==='de';
  const subject=de?'DANINI: Ihr PDF Master-Guide':'DANINI: vaš Auto-Biznis PDF vodič';
  const message=de
    ? 'Vielen Dank für Ihren Einkauf. Laden Sie den PDF-Guide innerhalb von 72 Stunden herunter. Bei einem Softwarepaket wird der Software-Zugang separat vereinbart.'
    : 'Hvala na kupovini. Preuzmite PDF vodič u naredna 72 sata. Ako ste kupili softverski paket, pristup softveru dogovara se zasebno.';
  const link=esc(url);
  const apiClient=new BrevoClient({apiKey:process.env.BREVO_API_KEY}).transactionalEmails;
  await apiClient.sendTransacEmail({sender:{email:sender,name:'DANINI'},to:[{email:record.email}],subject,htmlContent:'<p>'+esc(message)+'</p><p><a href="'+link+'">'+(de?'PDF herunterladen':'Preuzmi PDF vodič')+'</a></p><p>DANINI · info@daninihub.com</p>'});
  return true;
}
async function completeOrder(app,reference,orderId){
  const store=app.locals.importOSStore;
  let record=await store.get(reference);
  if(!record||record.type!=='digital-order'||record.payload?.paypalOrderId!==orderId)throw Error('ORDER_NOT_FOUND');
  if(record.status==='PAID')return record;
  // Idempotent PayPal-Request-Id prevents repeated capture on callback/webhook retries.
  const before=await api('/v2/checkout/orders/'+encodeURIComponent(orderId));
  if(before.status==='APPROVED'){
    await api('/v2/checkout/orders/'+encodeURIComponent(orderId)+'/capture',{method:'POST',requestId:'DANINI-'+orderId,body:{}});
  }else if(before.status!=='COMPLETED'){throw Error('PAYMENT_NOT_COMPLETE')}
  const paid=await api('/v2/checkout/orders/'+encodeURIComponent(orderId));
  if(!verified(paid,record))throw Error('UNVERIFIED_PAYMENT_OR_PAYEE');
  const captureId=paid.purchase_units?.[0]?.payments?.captures?.[0]?.id||'';
  const payload={...record.payload,captureId,paymentVerifiedAt:new Date().toISOString()};
  await store.update(reference,{status:'PAID',reviewedAt:new Date().toISOString(),payload});
  record=await store.get(reference);
  try{await notify(record,reportUrl(record))}catch(e){console.error('DANINI digital mail delivery failed:',e.message)}
  return record;
}
function page(lang,record,url){
  const de=lang==='de',s=record?.payload?.sku;
  const title=de?'Zahlung bestätigt':'Uplata potvrđena';
  const software=s==='software';
  return '<!doctype html><html lang="'+(de?'de':'sr')+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>'+title+' | DANINI</title></head><body style="background:#0a1118;color:#fff;font:18px/1.6 system-ui;max-width:720px;margin:50px auto;padding:24px"><h1>'+title+'</h1><p>'+(de?'Ihr PDF steht nach verifizierter Zahlung bereit.':'Vaš PDF je spreman nakon proverene uplate.')+'</p><p><a style="background:#93ecc0;color:#063625;padding:16px;display:inline-block;border-radius:9px;text-decoration:none;font-weight:bold" href="'+esc(url)+'">'+(de?'PDF jetzt herunterladen':'Preuzmi PDF odmah')+'</a></p><p>'+(de?'Der Link ist 72 Stunden gültig.':'Link važi 72 sata.')+'</p>'+(software?'<p>'+(de?'Softwarezugang wird separat abgestimmt. Der PDF-Guide ist im Preis inklusive (0 € zusätzlich).':'Pristup softveru ugovara se zasebno. PDF vodič je uključen u cenu (0 € doplate).')+'</p>':'')+'<p><a href="/'+(de?'de/auto-business-guide-software':'sr/auto-biznis-vodic-i-softver')+'">'+(de?'Zurück zum Shop':'Nazad u prodavnicu')+'</a></p></body></html>';
}
function mountDigitalCommerce(app){
  const store=app.locals.importOSStore;
  app.get('/api/danini/digital/status',async(req,res)=>{
    try{await store.init()}catch{return res.status(503).json({ok:false,enabled:false})}
    res.set({'Cache-Control':'no-store','X-Robots-Tag':'noindex,nofollow'});
    res.json({ok:true,enabled:Boolean(enabled(app)),softwareEnabled:process.env.DANINI_SOFTWARE_READY==='true',delivery:'private-pdf-after-paypal-capture'});
  });
  app.post('/api/danini/digital/checkout',express.json({limit:'12kb'}),async(req,res)=>{
    res.set('Cache-Control','no-store');
    try{await store.init()}catch{return res.status(503).json({ok:false,error:'STORAGE_UNAVAILABLE'})}
    if(!enabled(app))return res.status(503).json({ok:false,error:'DIGITAL_CHECKOUT_NOT_READY'});
    const d=req.body||{},sku=d.sku,language=d.language==='de'?'de':'sr',email=String(d.email||'').trim().toLowerCase();
    if(!Object.hasOwn(SKU,sku)||!RE.test(email)||email.length>191)return res.status(400).json({ok:false,error:'INVALID_ORDER_DATA'});
    if(d.termsAccepted!==true||d.instantDeliveryConsent!==true)return res.status(400).json({ok:false,error:'TERMS_CONSENT_REQUIRED'});
    if(sku==='software'&&process.env.DANINI_SOFTWARE_READY!=='true')return res.status(503).json({ok:false,error:'SOFTWARE_DELIVERY_NOT_READY'});
    const reference='DGD-'+crypto.randomBytes(18).toString('hex').toUpperCase();
    try{
      const order=await api('/v2/checkout/orders',{method:'POST',requestId:'DANINI-'+reference,
        body:{intent:'CAPTURE',purchase_units:[{reference_id:reference,custom_id:reference,description:PRODUCT[sku],amount:{currency_code:'EUR',value:(SKU[sku]/100).toFixed(2)}}],
          payment_source:{paypal:{experience_context:{brand_name:'DANINI',user_action:'PAY_NOW',
            shipping_preference:'NO_SHIPPING',return_url:fixedOrigin+'/digital/paypal/return?ref='+reference,
            cancel_url:fixedOrigin+'/'+language+'/'+(language==='de'?'auto-business-guide-software':'auto-biznis-vodic-i-softver')+'?payment_cancelled=1'}}}}});
      const checkoutUrl=order.links?.find(x=>x.rel==='approve'||x.rel==='payer-action')?.href;
      if(!checkoutUrl||!/^https:\/\/(www\.)?(paypal\.com|sandbox\.paypal\.com)\//i.test(checkoutUrl))throw Error('NO_VALID_PAYPAL_URL');
      await store.create({reference,type:'digital-order',language,email,name:'',status:'CHECKOUT_CREATED',payload:{sku,paypalOrderId:order.id,priceCents:SKU[sku]}});
      return res.json({ok:true,checkoutUrl});
    }catch(e){console.error('DANINI digital checkout error:',e.message);return res.status(503).json({ok:false,error:'CHECKOUT_FAILED'})}
  });
  app.get('/digital/paypal/return',async(req,res)=>{
    res.set({'Cache-Control':'no-store','X-Robots-Tag':'noindex,nofollow','Referrer-Policy':'no-referrer'});
    try{await store.init()}catch{return res.sendStatus(503)}
    if(!enabled(app))return res.status(503).type('text/plain').send('Checkout unavailable');
    const reference=String(req.query.ref||''),orderId=String(req.query.token||'');
    if(!/^DGD-[0-9A-F]{36}$/.test(reference)||!/^[A-Z0-9-]{8,80}$/.test(orderId))return res.sendStatus(400);
    try{
      const record=await completeOrder(app,reference,orderId);
      return res.type('html').send(page(record.language,record,reportUrl(record)));
    }catch(e){console.error('DANINI PayPal callback:',e.message);return res.status(409).type('text/html').send('<h1>Payment not verified</h1><p>Contact info@daninihub.com with your PayPal receipt.</p>')}
  });
  app.get('/digital/download/:reference',async(req,res)=>{
    res.set({'Cache-Control':'private, no-store, max-age=0','Pragma':'no-cache','X-Robots-Tag':'noindex,nofollow','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'none'; frame-ancestors 'none'"});
    try{await store.init()}catch{return res.sendStatus(503)}
    if(!enabled(app))return res.sendStatus(503);
    const ref=String(req.params.reference||'');
    if(!/^DGD-[0-9A-F]{36}$/.test(ref))return res.sendStatus(404);
    const record=await store.get(ref);
    if(!validToken(record,req.query.token))return res.sendStatus(404);
    const file=privateFile();
    if(!file)return res.sendStatus(503);
    return res.download(file,'DANINI_Auto_Biznis_Master_Vodic_2026_FINAL.pdf',{headers:{'Cache-Control':'private, no-store, max-age=0'}},error=>{
      if(error&&!res.headersSent)res.status(503).end();
    });
  });
  app.post('/api/danini/digital/paypal/webhook',express.json({limit:'100kb'}),async(req,res)=>{
    try{await store.init()}catch{return res.sendStatus(503)}
    if(!process.env.PAYPAL_WEBHOOK_ID||!enabled(app))return res.sendStatus(503);
    try{
      const body=req.body||{};
      const proof=await api('/v1/notifications/verify-webhook-signature',{method:'POST',body:{
        auth_algo:req.get('paypal-auth-algo'),cert_url:req.get('paypal-cert-url'),
        transmission_id:req.get('paypal-transmission-id'),transmission_sig:req.get('paypal-transmission-sig'),
        transmission_time:req.get('paypal-transmission-time'),webhook_id:process.env.PAYPAL_WEBHOOK_ID,
        webhook_event:body}});
      if(proof.verification_status!=='SUCCESS')return res.sendStatus(403);
      if(!['CHECKOUT.ORDER.APPROVED','PAYMENT.CAPTURE.COMPLETED'].includes(body.event_type))return res.sendStatus(204);
      const orderId=body.event_type==='CHECKOUT.ORDER.APPROVED'
        ?body.resource?.id
        :body.resource?.supplementary_data?.related_ids?.order_id;
      if(!/^[A-Z0-9-]{8,80}$/.test(String(orderId||'')))return res.sendStatus(204);
      const order=await api('/v2/checkout/orders/'+encodeURIComponent(orderId));
      const reference=order.purchase_units?.[0]?.custom_id||'';
      if(!/^DGD-[0-9A-F]{36}$/.test(reference))return res.sendStatus(204);
      await completeOrder(app,reference,orderId);
      return res.sendStatus(204);
    }catch(e){console.error('DANINI digital webhook:',e.message);return res.sendStatus(503)}
  });
}
module.exports={mountDigitalCommerce,privateFile,tokenFor,validToken,verified,enabled,SKU};
