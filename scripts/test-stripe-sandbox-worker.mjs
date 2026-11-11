import assert from 'node:assert/strict';
import {createHash,createHmac} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {digitalRoute} from '../workers/danini-digital-commerce.mjs';
const db = new DatabaseSync(':memory:');
for (const file of ['2026-11-11-danini-digital-d1.sql','2026-11-12-danini-stripe-sandbox.sql']) {
 db.exec(readFileSync(new URL('../migrations/' + file, import.meta.url), 'utf8'));
}
const pdf=Buffer.alloc(110000,65);
pdf.write('%PDF-1.7\n');
db.prepare("INSERT INTO danini_digital_files(sku,byte_length,chunk_count,sha256,ready) VALUES ('guide',?,1,?,1)").run(pdf.length,createHash('sha256').update(pdf).digest('hex'));
db.prepare("INSERT INTO danini_digital_pdf_chunks VALUES ('guide',0,?)").run(pdf.toString('base64'));
const env = {
 DANINI_DB:{prepare:sql=>({bind:(...args)=>({
  first:()=>db.prepare(sql).get(...args),
  run:()=>({meta:db.prepare(sql).run(...args)}),
  all:()=>({results:db.prepare(sql).all(...args)})
 })})},
 DANINI_STRIPE_SANDBOX_ENABLED:'true', STRIPE_SECRET_KEY:'sk_test_' + 'a'.repeat(26),
 STRIPE_WEBHOOK_SECRET:'whsec_' + 'b'.repeat(26), DANINI_STRIPE_ACCOUNT_ID:'acct_123456789',
 DANINI_STRIPE_SANDBOX_ACCESS:'abcdefghijklmnopqrstuvwxyz012345',
 DANINI_STRIPE_SANDBOX_EMAIL:'qa@example.test',
 DANINI_DIGITAL_SIGNING_SECRET:'abcdefghijklmnopqrstuvwxyz012345',
 BREVO_API_KEY:'dummy', DANINI_BREVO_SENDER:'sender@example.test'
};
const base='https://daninihub.com/api/danini/digital/';
const session={id:'cs_test_1234567890123456',url:'https://checkout.stripe.com/c/pay/test',livemode:false};
let retrieved;
let attempts=0;
let receipt;
globalThis.fetch=async (url,init)=>{
 switch(url){
  case 'https://api.stripe.com/v1/account':return Response.json({id:env.DANINI_STRIPE_ACCOUNT_ID});
  case 'https://api.stripe.com/v1/checkout/sessions':{
   assert.equal(init.body.get('line_items[0][price_data][unit_amount]'),'4900');
   assert.equal(init.body.get('customer_email'),'qa@example.test');
   const ref=init.body.get('client_reference_id');
   retrieved={...session,mode:'payment',status:'complete',payment_status:'paid',currency:'eur',amount_total:4900,client_reference_id:ref,metadata:{danini_reference:ref},customer_email:'qa@example.test',payment_intent:'pi_123456789'};
   return Response.json(session);
  }
  case 'https://api.stripe.com/v1/checkout/sessions/'+session.id:return Response.json(retrieved);
  case 'https://api.brevo.com/v3/smtp/email':{
   attempts++;
   if(attempts===1) return new Response('',{status:503});
   receipt=JSON.parse(init.body);
   return Response.json({messageId:'mock'});
  }
  default:throw Error('Unexpected fetch '+url);
 }
};
const call=(path,opts,override={})=>digitalRoute(new Request(base+path,opts),{...env,...override});
const auth={'X-Danini-Sandbox-Access':env.DANINI_STRIPE_SANDBOX_ACCESS};
assert.equal((await call('stripe/checkout',{method:'POST'})).status,404);
assert.equal((await call('stripe/checkout',{method:'POST',headers:auth},{STRIPE_SECRET_KEY:'sk_live_' + 'c'.repeat(26)})).status,503);
assert.equal((await call('stripe/checkout',{method:'POST',headers:auth},{DANINI_STRIPE_ACCOUNT_ID:'acct_WRONG111'})).status,503);
const checkout=await call('stripe/checkout',{method:'POST',headers:auth});
assert.equal(checkout.status,200);
const order=await checkout.json();
assert.equal(db.prepare('SELECT status FROM danini_digital_orders WHERE reference=?').get(order.reference).status,'CREATED');
const raw=JSON.stringify({livemode:false,type:'checkout.session.completed',data:{object:{id:session.id}}});
const post=(payload,sign=true)=>{
 const t=Math.floor(Date.now()/1000);
 const h=createHmac('sha256',env.STRIPE_WEBHOOK_SECRET).update(t+'.'+payload).digest('hex');
 return call('stripe/webhook',{method:'POST',body:payload,headers:{'Stripe-Signature':'t='+t+',v1='+(sign?h:'0'.repeat(64))}});
};
assert.equal((await post(raw,false)).status,403);
retrieved.amount_total=1;
assert.equal((await post(raw)).status,503);
assert.equal(attempts,0);
retrieved.amount_total=4900;
assert.equal((await post(raw)).status,503);
assert.equal((await post(raw)).status,204);
assert.equal((await post(raw)).status,204);
assert.equal(attempts,2);
assert.equal(receipt.to[0].email,'qa@example.test');
assert.match(receipt.subject,/SANDBOX/);
const link=receipt.htmlContent.match(/href="([^"]+)"/)[1];
const download=await digitalRoute(new Request(link),env);
assert.equal(download.status,200);
assert.equal(download.headers.get('content-type'),'application/pdf');
assert.deepEqual(Buffer.from(await download.arrayBuffer()),pdf);
assert.equal((await call('download/'+order.reference+'?token=invalid')).status,404);
assert.equal((await call('status')).status,200);
assert.equal((await (await call('status')).json()).enabled,false);
console.log('Stripe Sandbox Worker: test key/account, protected checkout, signature, amount, D1, Brevo retry, duplicate event and PDF verified.');
