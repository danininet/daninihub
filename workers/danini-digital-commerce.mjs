/**
 * DANINI Cloudflare digital checkout. Fail-closed, D1 backed.
 * PayPal confirmation, not browser return parameters, unlocks a private PDF.
 * No real payment can start until operator-enabled credentials and PDF are present.
 */
const JSON_HEADERS={'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff','x-robots-tag':'noindex,nofollow'};
const PRODUCTS=Object.freeze({guide:{cents:4900,label:'DANINI Auto-Biznis Master Vodič (PDF)'}});
const PDF_MAX=10*1024*1024;
const origin='https://daninihub.com';
const emailRe=/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const refRe=/^DGD-[0-9A-F]{32}$/;
const paypalIdRe=/^[A-Z0-9-]{8,80}$/;
const encode=(s)=>new TextEncoder().encode(s);
const b64url=bytes=>btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:JSON_HEADERS});}
function err(code,status=400){return json({ok:false,error:code},status);}
function textPage(text,status=200){return new Response('<!doctype html><html lang="sr"><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DANINI · Plaćanje</title><body style="font:18px/1.6 system-ui;max-width:720px;margin:8vh auto;padding:22px;color:#0f172a"><h1>'+text+'</h1><p><a href="/digital.html">Digitalni proizvodi / Digitale Produkte</a></p></body></html>',{status,headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store','referrer-policy':'no-referrer','x-robots-tag':'noindex,nofollow'}});}
export function configured(env){
 const enabled=env.DANINI_DIGITAL_CHECKOUT_ENABLED==='true';
 const mode=env.PAYPAL_ENV;
 return !!(enabled&&['sandbox','live'].includes(mode)&&
  (mode!=='live'||env.DANINI_DIGITAL_LIVE_APPROVED==='true')&&
  env.DANINI_DB&&env.PAYPAL_CLIENT_ID&&env.PAYPAL_CLIENT_SECRET&&env.PAYPAL_WEBHOOK_ID&&
  emailRe.test(env.DANINI_PAYPAL_RECEIVER_EMAIL||'')&&
  typeof env.DANINI_DIGITAL_SIGNING_SECRET==='string'&&env.DANINI_DIGITAL_SIGNING_SECRET.length>=32&&
  env.BREVO_API_KEY&&env.DANINI_BREVO_SENDER&&
  env.DANINI_TURNSTILE_SECRET&&env.DANINI_TURNSTILE_SITEKEY);
}
async function readyFile(env,sku){
 try{
  const f=await env.DANINI_DB.prepare('SELECT byte_length,chunk_count FROM danini_digital_files WHERE sku=? AND ready=1').bind(sku).first();
  return !!(f&&Number(f.byte_length)>100000&&Number(f.byte_length)<=PDF_MAX&&Number(f.chunk_count)>0&&Number(f.chunk_count)<=400);
 }catch{return false;}
}
export async function ready(env){return configured(env)&&await readyFile(env,'guide');}
async function paypal(env,path,{method='GET',body,requestId}={}){
 const root=env.PAYPAL_ENV==='live'?'https://api-m.paypal.com':'https://api-m.sandbox.paypal.com';
 const secret=btoa(env.PAYPAL_CLIENT_ID+':'+env.PAYPAL_CLIENT_SECRET);
 const a=await fetch(root+'/v1/oauth2/token',{method:'POST',headers:{Authorization:'Basic '+secret,'content-type':'application/x-www-form-urlencoded'},body:'grant_type=client_credentials',signal:AbortSignal.timeout(12000)});
 if(!a.ok)throw Error('PAYPAL_TOKEN_FAILED');
 const access=(await a.json()).access_token;
 if(!access)throw Error('PAYPAL_TOKEN_EMPTY');
 const h={Authorization:'Bearer '+access,'content-type':'application/json'};
 if(requestId)h['PayPal-Request-Id']=requestId;
 const r=await fetch(root+path,{method,headers:h,body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(15000)});
 const data=await r.json().catch(()=>({}));
 if(!r.ok)throw Error('PAYPAL_HTTP_'+r.status);
 return data;
}
export function verifiedCapture(paypalOrder,dbOrder,receiver){
 if(!paypalOrder||paypalOrder.id!==dbOrder.paypal_order_id||paypalOrder.status!=='COMPLETED')return false;
 if(!Array.isArray(paypalOrder.purchase_units)||paypalOrder.purchase_units.length!==1)return false;
 const u=paypalOrder.purchase_units[0],captures=u.payments?.captures;
 if(!Array.isArray(captures)||captures.length!==1)return false;
 const c=captures[0];
 return u.custom_id===dbOrder.reference&&c.status==='COMPLETED'&&
  c.amount?.currency_code==='EUR'&&c.amount?.value===(Number(dbOrder.amount_cents)/100).toFixed(2)&&
  String(u.payee?.email_address||c.payee?.email_address||'').toLowerCase()===String(receiver||'').toLowerCase()&&
  Number(dbOrder.amount_cents)===PRODUCTS[dbOrder.sku]?.cents&&!!c.id;
}
async function signingKey(env){
 return crypto.subtle.importKey('raw',encode(env.DANINI_DIGITAL_SIGNING_SECRET),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);
}
export async function downloadToken(env,record){
 const until=Date.parse(record.paid_at)+72*3600000;
 if(!Number.isFinite(until)||record.status!=='PAID')throw Error('NOT_PAID');
 const message=record.reference+'.'+until;
 const signature=new Uint8Array(await crypto.subtle.sign('HMAC',await signingKey(env),encode(message)));
 return message+'.'+b64url(signature);
}
export async function tokenValid(env,record,token,now=Date.now()){
 if(!record||record.status!=='PAID'||!refRe.test(record.reference)||typeof token!=='string'||token.length>220)return false;
 const deadline=Date.parse(record.paid_at)+72*3600000;
 if(!Number.isFinite(deadline)||deadline<=now||deadline>now+72*3600000)return false;
 const bits=token.split('.');
 if(bits.length!==3||bits[0]!==record.reference||Number(bits[1])!==deadline)return false;
 const sig=bits[2];
 if(!/^[A-Za-z0-9_-]{43}$/.test(sig))return false;
 const decoded=Uint8Array.from(atob(sig.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
 return crypto.subtle.verify('HMAC',await signingKey(env),decoded,encode(record.reference+'.'+deadline));
}
async function getOrder(env,ref){return env.DANINI_DB.prepare('SELECT * FROM danini_digital_orders WHERE reference=?').bind(ref).first();}
async function emailReceipt(env,record,sandbox=false){
 if(record.email_sent_at)return;
 const claim=await env.DANINI_DB.prepare("UPDATE danini_digital_orders SET email_state='SENDING' WHERE reference=? AND status='PAID' AND email_state='PENDING'").bind(record.reference).run();
 if(claim.meta?.changes!==1)return;
 try{
  const link=origin+'/api/danini/digital/download/'+encodeURIComponent(record.reference)+'?token='+encodeURIComponent(await downloadToken(env,record));
  const de=record.language==='de';
  const message={sender:{name:'DANINI',email:env.DANINI_BREVO_SENDER},to:[{email:record.email}],
   subject:(sandbox?'[SANDBOX] ':'')+(de?'DANINI – Ihr PDF nach bestätigter Zahlung':'DANINI – PDF nakon potvrđene uplate'),
   htmlContent:(sandbox?'<p>Stripe Sandbox – testna uplata, bez stvarne naplate.</p>':'')+'<p>'+(de?'Ihre Zahlung wurde beim Zahlungsdienst verifiziert.':'Vaša uplata je potvrđena kod pružaoca plaćanja.')+'</p><p><a href="'+link+'">'+(de?'PDF herunterladen':'Preuzmi PDF vodič')+'</a></p><p>'+(de?'Link 72 Stunden gültig.':'Link važi 72 sata.')+'</p><p>DANINI · info@daninihub.com</p>'};
  const r=await fetch('https://api.brevo.com/v3/smtp/email',{method:'POST',headers:{'api-key':env.BREVO_API_KEY,'content-type':'application/json'},body:JSON.stringify(message),signal:AbortSignal.timeout(12000)});
  if(!r.ok)throw Error('MAIL_REJECTED');
  await env.DANINI_DB.prepare("UPDATE danini_digital_orders SET email_state='SENT',email_sent_at=datetime('now') WHERE reference=?").bind(record.reference).run();
 }catch{
  await env.DANINI_DB.prepare("UPDATE danini_digital_orders SET email_state='PENDING' WHERE reference=? AND email_state='SENDING'").bind(record.reference).run();
 }
}
async function finalize(env,ref,paypalOrderId){
 let record=await getOrder(env,ref);
 if(!record||record.paypal_order_id!==paypalOrderId)throw Error('ORDER_MISMATCH');
 if(record.status==='PAID'){await emailReceipt(env,record);return record;}
 const claim=await env.DANINI_DB.prepare("UPDATE danini_digital_orders SET status='PROCESSING',processing_at=datetime('now') WHERE reference=? AND (status='CREATED' OR (status='PROCESSING' AND processing_at < datetime('now','-2 minutes')))").bind(ref).run();
 if(claim.meta?.changes!==1)throw Error('ORDER_BUSY');
 try{
  let p=await paypal(env,'/v2/checkout/orders/'+encodeURIComponent(paypalOrderId));
  if(p.status==='APPROVED'){
   await paypal(env,'/v2/checkout/orders/'+encodeURIComponent(paypalOrderId)+'/capture',{method:'POST',body:{},requestId:'DANINI-'+paypalOrderId});
   p=await paypal(env,'/v2/checkout/orders/'+encodeURIComponent(paypalOrderId));
  }
  if(!verifiedCapture(p,record,env.DANINI_PAYPAL_RECEIVER_EMAIL))throw Error('PAYMENT_NOT_VERIFIED');
  const capture=p.purchase_units[0].payments.captures[0].id;
  await env.DANINI_DB.prepare("UPDATE danini_digital_orders SET status='PAID',capture_id=?,paid_at=?,processing_at=NULL WHERE reference=? AND status='PROCESSING'").bind(capture,new Date().toISOString(),ref).run();
  record=await getOrder(env,ref);
  if(record?.status!=='PAID')throw Error('ORDER_NOT_PERSISTED');
  await emailReceipt(env,record);
  return record;
 }catch(e){
  await env.DANINI_DB.prepare("UPDATE danini_digital_orders SET status='CREATED',processing_at=NULL WHERE reference=? AND status='PROCESSING'").bind(ref).run();
  throw e;
 }
}
async function verifyHuman(token,env,request){
 if(typeof token!=='string'||token.length<10||token.length>2048||!env.DANINI_TURNSTILE_SECRET)return false;
 const form=new FormData();form.set('secret',env.DANINI_TURNSTILE_SECRET);form.set('response',token);
 const r=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:form,signal:AbortSignal.timeout(9000)});
 if(!r.ok)return false;
 const d=await r.json();return d.success===true&&['daninihub.com','www.daninihub.com'].includes(d.hostname);
}
async function checkout(request,env){
 if(!await ready(env))return err('CHECKOUT_NOT_READY',503);
 if(!['https://daninihub.com','https://www.daninihub.com'].includes(request.headers.get('Origin')))return err('INVALID_ORIGIN',403);
 if(!/^application\/json(?:;|$)/i.test(request.headers.get('content-type')||''))return err('UNSUPPORTED_MEDIA',415);
 const raw=await request.text();if(raw.length>12000)return err('TOO_LARGE',413);
 let d;try{d=JSON.parse(raw)}catch{return err('INVALID_JSON');}
 const email=typeof d.email==='string'?d.email.trim().toLowerCase():'';
 if(d.sku!=='guide'||!emailRe.test(email)||email.length>191||d.termsAccepted!==true||d.instantDeliveryConsent!==true)return err('INVALID_ORDER');
 if(!await verifyHuman(d.turnstileToken,env,request))return err('HUMAN_VERIFICATION_FAILED',403);
 const ref='DGD-'+crypto.randomUUID().replace(/-/g,'').toUpperCase();
 const language=d.language==='de'?'de':'sr';
 await env.DANINI_DB.prepare("INSERT INTO danini_digital_orders(reference,sku,email,language,amount_cents,status,email_state) VALUES (?,?,?,?,?,'PENDING','PENDING')").bind(ref,'guide',email,language,4900).run();
 try{
  const p=await paypal(env,'/v2/checkout/orders',{method:'POST',requestId:'DANINI-'+ref,body:{intent:'CAPTURE',purchase_units:[{reference_id:ref,custom_id:ref,description:PRODUCTS.guide.label,amount:{currency_code:'EUR',value:'49.00'}}],payment_source:{paypal:{experience_context:{brand_name:'DANINI',user_action:'PAY_NOW',shipping_preference:'NO_SHIPPING',return_url:origin+'/api/danini/digital/paypal/return?ref='+ref,cancel_url:origin+'/digital.html?cancelled=1'}}}}});
  const link=p.links?.find(x=>x.rel==='approve'||x.rel==='payer-action')?.href;
  if(!link||!/^https:\/\/(www\.)?(sandbox\.)?paypal\.com\//.test(link)||!paypalIdRe.test(p.id))throw Error('INVALID_CHECKOUT_LINK');
  await env.DANINI_DB.prepare("UPDATE danini_digital_orders SET status='CREATED',paypal_order_id=? WHERE reference=? AND status='PENDING'").bind(p.id,ref).run();
  return json({ok:true,reference:ref,checkoutUrl:link});
 }catch{return err('CHECKOUT_PROVIDER_FAILED',503);}
}
async function retrievePdf(env,record){
 const meta=await env.DANINI_DB.prepare("SELECT byte_length,chunk_count,sha256 FROM danini_digital_files WHERE sku=? AND ready=1").bind(record.sku).first();
 if(!meta||meta.byte_length>PDF_MAX||meta.byte_length<100000||meta.chunk_count>400)return null;
 const buffer=new Uint8Array(meta.byte_length);let offset=0;let loaded=0;
 while(loaded<meta.chunk_count){
  const out=await env.DANINI_DB.prepare('SELECT data_b64 FROM danini_digital_pdf_chunks WHERE sku=? ORDER BY chunk_index LIMIT 8 OFFSET ?').bind(record.sku,loaded).all();
  const rows=out.results||[];if(!rows.length)return null;
  for(const row of rows){
   const bytes=Uint8Array.from(atob(row.data_b64),x=>x.charCodeAt(0));
   if(offset+bytes.length>buffer.length)return null;
   buffer.set(bytes,offset);offset+=bytes.length;loaded++;
  }
 }
 if(offset!==buffer.length||new TextDecoder().decode(buffer.slice(0,5))!=='%PDF-')return null;
 const digest=new Uint8Array(await crypto.subtle.digest('SHA-256',buffer));
 const hex=Array.from(digest).map(x=>x.toString(16).padStart(2,'0')).join('');
 if(hex!==meta.sha256)return null;
 return buffer;
}
async function sendDownload(request,env,url){
 if(request.method!=='GET')return err('METHOD_NOT_ALLOWED',405);
 if(!configured(env)&&!stripeConfigured(env))return err('NOT_READY',503);
 const ref=url.pathname.split('/').pop();
 if(!refRe.test(ref))return err('NOT_FOUND',404);
 const record=await getOrder(env,ref);
 if(!record || (record.stripe_session_id ? !stripeConfigured(env) : !configured(env)))return err('NOT_FOUND',404);
 if(!await tokenValid(env,record,url.searchParams.get('token')))return err('NOT_FOUND',404);
 const pdf=await retrievePdf(env,record);if(!pdf)return err('FILE_NOT_READY',503);
 return new Response(pdf,{headers:{'content-type':'application/pdf','content-disposition':'attachment; filename="DANINI_Auto_Biznis_Master_Vodic_2026_FINAL.pdf"','cache-control':'private, no-store, max-age=0','x-robots-tag':'noindex,nofollow','x-content-type-options':'nosniff','referrer-policy':'no-referrer','content-security-policy':"default-src 'none'; frame-ancestors 'none'"}});
}
async function browserReturn(env,url){
 if(!await ready(env))return textPage('Plaćanje nije omogućeno / Zahlung nicht verfügbar',503);
 const ref=url.searchParams.get('ref')||'',id=url.searchParams.get('token')||'';
 if(!refRe.test(ref)||!paypalIdRe.test(id))return textPage('Neispravna potvrda / Ungültige Bestätigung',400);
 try{
  const record=await finalize(env,ref,id);
  const link=origin+'/api/danini/digital/download/'+ref+'?token='+encodeURIComponent(await downloadToken(env,record));
  const de=record.language==='de';
  return new Response('<!doctype html><html lang="'+(de?'de':'sr')+'"><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><meta name="referrer" content="no-referrer"><title>DANINI</title><body style="font:18px/1.6 system-ui;max-width:680px;margin:8vh auto;padding:28px"><h1>'+(de?'Zahlung bestätigt':'Uplata potvrđena')+'</h1><p>'+(de?'Ihr PDF ist verfügbar. Link 72 Stunden gültig.':'PDF je spreman. Link važi 72 sata.')+'</p><p><a href="'+link+'">'+(de?'PDF herunterladen':'Preuzmi PDF')+'</a></p><p><a href="/digital.html">DANINI</a></p></body></html>',{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store','referrer-policy':'no-referrer','x-robots-tag':'noindex,nofollow'}});
 }catch{return textPage('Plaćanje nije potvrđeno. Kontakt: info@daninihub.com / Zahlung nicht bestätigt.',409);}
}
async function webhook(request,env){
 if(request.method!=='POST')return err('METHOD_NOT_ALLOWED',405);
 if(!configured(env))return err('NOT_READY',503);
 const raw=await request.text();if(raw.length>100000)return err('TOO_LARGE',413);
 let event;try{event=JSON.parse(raw)}catch{return err('INVALID_JSON');}
 const h=request.headers;
 const fields=['paypal-auth-algo','paypal-cert-url','paypal-transmission-id','paypal-transmission-sig','paypal-transmission-time'];
 if(fields.some(x=>!h.get(x)))return err('INVALID_SIGNATURE',403);
 let proof;try{proof=await paypal(env,'/v1/notifications/verify-webhook-signature',{method:'POST',body:{auth_algo:h.get(fields[0]),cert_url:h.get(fields[1]),transmission_id:h.get(fields[2]),transmission_sig:h.get(fields[3]),transmission_time:h.get(fields[4]),webhook_id:env.PAYPAL_WEBHOOK_ID,webhook_event:event}})}catch{return err('VERIFICATION_FAILED',503);}
 if(proof.verification_status!=='SUCCESS')return err('INVALID_SIGNATURE',403);
 if(!['CHECKOUT.ORDER.APPROVED','PAYMENT.CAPTURE.COMPLETED'].includes(event.event_type))return new Response(null,{status:204});
 const id=event.event_type==='CHECKOUT.ORDER.APPROVED'?event.resource?.id:event.resource?.supplementary_data?.related_ids?.order_id;
 if(!paypalIdRe.test(id))return new Response(null,{status:204});
 try{
  const p=await paypal(env,'/v2/checkout/orders/'+encodeURIComponent(id));
  const ref=p.purchase_units?.[0]?.custom_id;
  if(!refRe.test(ref))return new Response(null,{status:204});
  await finalize(env,ref,id);return new Response(null,{status:204});
 }catch{return err('RETRY_LATER',503);}
}

const stripeSessionId = /^cs_test_[A-Za-z0-9]{16,160}$/;
const stripePaymentId = /^pi_[A-Za-z0-9]{8,120}$/;

function stripeConfigured(env) {
  return Boolean(env.DANINI_STRIPE_SANDBOX_ENABLED === 'true' &&
    /^(sk|rk)_test_[A-Za-z0-9]{16,}$/.test(env.STRIPE_SECRET_KEY || '') &&
    /^whsec_[A-Za-z0-9]{16,}$/.test(env.STRIPE_WEBHOOK_SECRET || '') &&
    /^acct_[A-Za-z0-9]{8,}$/.test(env.DANINI_STRIPE_ACCOUNT_ID || '') &&
    env.DANINI_STRIPE_SANDBOX_ACCESS?.length >= 32 &&
    emailRe.test(env.DANINI_STRIPE_SANDBOX_EMAIL || '') &&
    env.DANINI_DB && env.DANINI_DIGITAL_SIGNING_SECRET?.length >= 32 &&
    env.BREVO_API_KEY && env.DANINI_BREVO_SENDER);
}

async function sameSecret(expected, supplied) {
  if (!supplied || supplied.length !== expected.length) return false;
  const key = await crypto.subtle.importKey('raw', encode(expected), {name:'HMAC',hash:'SHA-256'}, false, ['sign', 'verify']);
  const signature = await crypto.subtle.sign('HMAC', key, encode(expected));
  return crypto.subtle.verify('HMAC', key, signature, encode(supplied));
}

async function stripeApi(env, path, form, idempotencyKey) {
  const headers = {Authorization: 'Bearer ' + env.STRIPE_SECRET_KEY};
  if (form) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    headers['Idempotency-Key'] = idempotencyKey;
  }
  const response = await fetch('https://api.stripe.com/v1' + path, {
    method: form ? 'POST' : 'GET', headers, body: form, signal: AbortSignal.timeout(12000)
  });
  if (!response.ok) throw Error('STRIPE_API_FAILURE');
  return response.json();
}

async function stripeCheckout(request, env) {
  if (!stripeConfigured(env)) return err('CHECKOUT_NOT_READY',503);
  if (!await sameSecret(env.DANINI_STRIPE_SANDBOX_ACCESS, request.headers.get('X-Danini-Sandbox-Access'))) {
    return err('NOT_FOUND',404);
  }
  if (!await readyFile(env,'guide')) return err('CHECKOUT_NOT_READY',503);
  try {
    const account = await stripeApi(env, '/account');
    if (account.id !== env.DANINI_STRIPE_ACCOUNT_ID) return err('CHECKOUT_ACCOUNT_MISMATCH',503);
    const ref = 'DGD-' + crypto.randomUUID().replace(/-/g,'').toUpperCase();
    const email = env.DANINI_STRIPE_SANDBOX_EMAIL.trim().toLowerCase();
    const guide = PRODUCTS.guide;
    const form = new URLSearchParams({
      mode: 'payment',
      'payment_method_types[0]': 'card',
      client_reference_id: ref,
      'metadata[danini_reference]': ref,
      customer_email: email,
      success_url: origin + '/api/danini/digital/stripe/return?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: origin + '/digital.html?cancelled=1',
      'line_items[0][price_data][currency]': 'eur',
      'line_items[0][price_data][unit_amount]': String(guide.cents),
      'line_items[0][price_data][product_data][name]': guide.label,
      'line_items[0][quantity]': '1'
    });
    const session = await stripeApi(env, '/checkout/sessions', form, ref);
    const url = new URL(session.url);
    if (session.livemode !== false || !stripeSessionId.test(session.id) ||
        url.origin !== 'https://checkout.stripe.com') return err('CHECKOUT_PROVIDER_FAILED',503);
    await env.DANINI_DB.prepare(
      "INSERT INTO danini_digital_orders(reference,sku,email,language,amount_cents,status,email_state,stripe_session_id) VALUES (?,'guide',?,'sr',?,'CREATED','PENDING',?)"
    ).bind(ref,email,guide.cents,session.id).run();
    return json({ok:true,reference:ref,checkoutUrl:url.href});
  } catch {
    return err('CHECKOUT_PROVIDER_FAILED',503);
  }
}

export function verifiedStripeSession(session, order) {
  return Boolean(session && order && stripeSessionId.test(session.id) &&
    session.id === order.stripe_session_id && session.livemode === false &&
    session.mode === 'payment' && session.status === 'complete' &&
    session.payment_status === 'paid' && session.currency === 'eur' &&
    session.amount_total === PRODUCTS.guide.cents && session.amount_total === order.amount_cents &&
    session.client_reference_id === order.reference && session.metadata?.danini_reference === order.reference &&
    session.customer_email?.toLowerCase() === order.email &&
    order.sku === 'guide' && stripePaymentId.test(session.payment_intent || ''));
}

export async function verifiedStripeSignature(raw, header, secret, now = Date.now()) {
  if (!header || header.length > 2048) return false;
  const parts = header.split(',');
  const timestamps = parts.filter(value => value.startsWith('t='));
  if (timestamps.length !== 1 || !/^t=\d{1,12}$/.test(timestamps[0])) return false;
  const timestamp = timestamps[0].slice(2);
  if (Math.abs(now / 1000 - Number(timestamp)) > 300) return false;
  const key = await crypto.subtle.importKey('raw', encode(secret), {name:'HMAC',hash:'SHA-256'}, false, ['verify']);
  for (const part of parts) {
    if (!/^v1=[a-f0-9]{64}$/i.test(part)) continue;
    const bytes = Uint8Array.from(part.slice(3).match(/../g), hex => parseInt(hex,16));
    if (await crypto.subtle.verify('HMAC',key,bytes,encode(timestamp + '.' + raw))) return true;
  }
  return false;
}

async function findStripeOrder(env, id) {
  return env.DANINI_DB.prepare('SELECT * FROM danini_digital_orders WHERE stripe_session_id=?').bind(id).first();
}

async function finalizeStripe(env, order) {
  const session = await stripeApi(env, '/checkout/sessions/' + encodeURIComponent(order.stripe_session_id));
  if (!verifiedStripeSession(session, order)) return null;
  await env.DANINI_DB.prepare(
    "UPDATE danini_digital_orders SET status='PAID',capture_id=?,paid_at=? WHERE stripe_session_id=? AND status='CREATED'"
  ).bind(session.payment_intent,new Date().toISOString(),session.id).run();
  const record = await findStripeOrder(env,session.id);
  if (record?.status !== 'PAID' || record.capture_id !== session.payment_intent) return null;
  await emailReceipt(env,record,true);
  return record;
}

async function stripeWebhook(request, env) {
  if (!stripeConfigured(env)) return err('NOT_READY',503);
  const raw = await request.text();
  if (raw.length > 100000) return err('TOO_LARGE',413);
  if (!await verifiedStripeSignature(raw, request.headers.get('Stripe-Signature'), env.STRIPE_WEBHOOK_SECRET)) {
    return err('INVALID_SIGNATURE',403);
  }
  let event;
  try { event = JSON.parse(raw); } catch { return err('INVALID_JSON'); }
  const id = event?.data?.object?.id;
  if (event?.livemode !== false || event.type !== 'checkout.session.completed' || !stripeSessionId.test(id || '')) {
    return new Response(null,{status:204});
  }
  try {
    const order = await findStripeOrder(env,id);
    if (!order) return new Response(null,{status:204});
    const record = await finalizeStripe(env,order);
    const latest = record && await findStripeOrder(env,id);
    return latest?.email_state === 'SENT' ? new Response(null,{status:204}) : err('RETRY_LATER',503);
  } catch {
    return err('RETRY_LATER',503);
  }
}

async function stripeReturn(env,url) {
  if (!stripeConfigured(env)) return textPage('Stripe Sandbox nije dostupan / Stripe Sandbox nicht verfügbar',503);
  const id = url.searchParams.get('session_id') || '';
  if (!stripeSessionId.test(id)) return textPage('Neispravna potvrda / Ungültige Bestätigung',400);
  try {
    const order = await findStripeOrder(env,id);
    const record = order && await finalizeStripe(env,order);
    if (!record) return textPage('Stripe Sandbox uplata nije potvrđena',409);
    return textPage('Stripe Sandbox uplata je potvrđena. Proverite e-mail za link za preuzimanje.');
  } catch {
    return textPage('Stripe Sandbox uplata nije potvrđena',409);
  }
}

export async function digitalRoute(request,env){
 const url=new URL(request.url),path=url.pathname;
 if(path==='/api/danini/digital/status'){
  const on=await ready(env);
  return json({ok:true,enabled:on,mode:configured(env)?env.PAYPAL_ENV:'disabled',guidePriceEur:49,softwareEnabled:false,delivery:'private-d1-pdf'});
 }
 if(path==='/api/danini/digital/checkout'&&request.method==='POST')return checkout(request,env);
 if(path==='/api/danini/digital/paypal/return'&&request.method==='GET')return browserReturn(env,url);
 if(path==='/api/danini/digital/paypal/webhook')return webhook(request,env);
 if(path==='/api/danini/digital/stripe/checkout'&&request.method==='POST')return stripeCheckout(request,env);
 if(path==='/api/danini/digital/stripe/webhook'&&request.method==='POST')return stripeWebhook(request,env);
 if(path==='/api/danini/digital/stripe/return'&&request.method==='GET')return stripeReturn(env,url);
 if(path.startsWith('/api/danini/digital/download/'))return sendDownload(request,env,url);
 return err('NOT_FOUND',404);
}
