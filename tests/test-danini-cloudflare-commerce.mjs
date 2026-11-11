import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {configured,ready,verifiedCapture,downloadToken,tokenValid,digitalRoute} from '../workers/danini-digital-commerce.mjs';
const ref='DGD-'+'A'.repeat(32);
const sku='guide';
const fakePaid={reference:ref,sku,email:'buyer@example.test',language:'de',amount_cents:4900,status:'PAID',paid_at:new Date().toISOString(),paypal_order_id:'9TESTORDER99'};
const baseEnv={DANINI_DIGITAL_CHECKOUT_ENABLED:'true',PAYPAL_ENV:'sandbox',PAYPAL_CLIENT_ID:'sandbox-client',PAYPAL_CLIENT_SECRET:'sandbox-secret',PAYPAL_WEBHOOK_ID:'sandbox-webhook',DANINI_PAYPAL_RECEIVER_EMAIL:'sandbox-merchant@example.test',DANINI_DIGITAL_SIGNING_SECRET:'a-secure-local-test-signing-key-that-is-over-32-chars',BREVO_API_KEY:'mock-brevo',DANINI_BREVO_SENDER:'kontakt@daninihub.com'};
function mockDb({withFile=false,paidOrder=null}={}){
 const records=new Map(paidOrder?[[paidOrder.reference,{...paidOrder}]]:[]);
 const bytes=new Uint8Array(120000).fill(65);bytes.set(new TextEncoder().encode('%PDF-1.7\n'),0);
 const meta={byte_length:bytes.length,chunk_count:Math.ceil(bytes.length/32768),sha256:createHash('sha256').update(bytes).digest('hex'),ready:1};
 const chunks=Array.from({length:meta.chunk_count},(_,n)=>Buffer.from(bytes.slice(n*32768,(n+1)*32768)).toString('base64'));
 return {records,bytes,prepare(sql){
  const argsRef={args:[]};
  return {bind(...args){argsRef.args=args;return this;},
   async first(){
    const a=argsRef.args;
    if(sql.includes('FROM danini_digital_files'))return withFile?{...meta}:null;
    if(sql.includes('FROM danini_digital_orders'))return records.get(a[0])||null;
    throw Error('unexpected first '+sql);
   },
   async all(){
    if(!sql.includes('danini_digital_pdf_chunks'))throw Error('unexpected all '+sql);
    const n=argsRef.args[1];return {results:chunks.slice(n,n+8).map(data_b64=>({data_b64}))};
   },
   async run(){
    const a=argsRef.args;
    if(sql.startsWith('INSERT INTO danini_digital_orders')){
     records.set(a[0],{reference:a[0],sku:a[1],email:a[2],language:a[3],amount_cents:a[4],status:'PENDING',paypal_order_id:null,email_state:'PENDING'});return {meta:{changes:1}};
    }
    if(sql.includes("status='CREATED',paypal_order_id")){
     const r=records.get(a[1]);if(!r)return {meta:{changes:0}};r.status='CREATED';r.paypal_order_id=a[0];return {meta:{changes:1}};
    }
    if(sql.includes("status='PROCESSING',processing_at")){
     const r=records.get(a[0]);if(!r||r.status!=='CREATED')return {meta:{changes:0}};
     r.status='PROCESSING';return {meta:{changes:1}};
    }
    if(sql.includes("status='PAID',capture_id")){
     const r=records.get(a[1]);if(!r)return {meta:{changes:0}};r.capture_id=a[0];r.status='PAID';r.paid_at=new Date().toISOString();return {meta:{changes:1}};
    }
    if(sql.includes("status='CREATED',processing_at")){
     const r=records.get(a[0]);if(r&&r.status==='PROCESSING')r.status='CREATED';return {meta:{changes:1}};
    }
    if(sql.includes("email_state='SENDING'")){const r=records.get(a[0]);if(r.email_state!=='PENDING')return {meta:{changes:0}};r.email_state='SENDING';return {meta:{changes:1}};}
    if(sql.includes("email_state='SENT'")){const r=records.get(a[0]);r.email_state='SENT';r.email_sent_at=new Date().toISOString();return {meta:{changes:1}};}
    if(sql.includes("email_state='PENDING'")){const r=records.get(a[0]);r.email_state='PENDING';return {meta:{changes:1}};}
    throw Error('unexpected run '+sql);
   }};
 }};
}
function orderPayload(id,reference,payee='sandbox-merchant@example.test',status='COMPLETED'){
 return {id,status,purchase_units:[{custom_id:reference,payee:{email_address:payee},payments:{captures:[{id:'TESTCAPTURE',status:'COMPLETED',amount:{currency_code:'EUR',value:'49.00'}}]}}]};
}
test('fail closed: missing credentials, live approval, PDF content',async()=>{
 assert.equal(configured({}),false);
 const env={...baseEnv,DANINI_DB:mockDb()};
 assert.equal(configured(env),true);
 assert.equal(await ready(env),false);
 assert.equal(configured({...env,PAYPAL_ENV:'live'}),false);
 assert.equal(configured({...env,PAYPAL_ENV:'live',DANINI_DIGITAL_LIVE_APPROVED:'true'}),true);
 const response=await digitalRoute(new Request('https://daninihub.com/api/danini/digital/status'),env);
 assert.equal((await response.json()).enabled,false);
 const checkout=await digitalRoute(new Request('https://daninihub.com/api/danini/digital/checkout',{method:'POST'}),env);
 assert.equal(checkout.status,503);
});
test('verified capture rejects wrong amount, wrong merchant and duplicates',()=>{
 const p=orderPayload('9TESTORDER99',ref);
 assert.equal(verifiedCapture(p,fakePaid,'sandbox-merchant@example.test'),true);
 assert.equal(verifiedCapture(orderPayload(p.id,ref,'forged@example.test'),fakePaid,'sandbox-merchant@example.test'),false);
 assert.equal(verifiedCapture({...p,purchase_units:[...p.purchase_units,p.purchase_units[0]]},fakePaid,'sandbox-merchant@example.test'),false);
 assert.equal(verifiedCapture({...p,purchase_units:[{...p.purchase_units[0],payments:{captures:[{...p.purchase_units[0].payments.captures[0],amount:{currency_code:'EUR',value:'0.01'}}]}}]},fakePaid,'sandbox-merchant@example.test'),false);
 assert.equal(verifiedCapture({...p,status:'APPROVED'},fakePaid,'sandbox-merchant@example.test'),false);
});
test('signed token is valid only for paid order for 72 hours',async()=>{
 const env={...baseEnv,DANINI_DB:mockDb({withFile:true})};
 const token=await downloadToken(env,fakePaid);
 assert.equal(await tokenValid(env,fakePaid,token),true);
 assert.equal(await tokenValid(env,{...fakePaid,status:'CREATED'},token),false);
 assert.equal(await tokenValid(env,fakePaid,token.slice(0,-1)+'A'),false);
 assert.equal(await tokenValid(env,fakePaid,token,Date.now()+73*3600000),false);
});
test('offline simulated checkout -> PayPal capture -> D1 -> private PDF -> email',async()=>{
 const db=mockDb({withFile:true}),env={...baseEnv,DANINI_DB:db,DANINI_TURNSTILE_SECRET:'sandbox-turnstile'};
 const original=globalThis.fetch;
 let createdId='9TESTORDER99',currentStatus='APPROVED',mailCount=0,captureCount=0;
 globalThis.fetch=async(url,opts)=>{
  const u=String(url);
  if(u.includes('turnstile/v0/siteverify'))return Response.json({success:true,hostname:'daninihub.com'});
  if(u.includes('/v1/oauth2/token'))return Response.json({access_token:'mock'});
  if(u.endsWith('/v2/checkout/orders')&&opts.method==='POST')return Response.json({id:createdId,links:[{rel:'approve',href:'https://www.sandbox.paypal.com/checkoutnow?token=9TESTORDER99'}]});
  if(u.endsWith('/capture')){captureCount++;currentStatus='COMPLETED';return Response.json({status:'COMPLETED'});}
  if(u.includes('/v2/checkout/orders/')){const refKey=Array.from(db.records.keys())[0];return Response.json(currentStatus==='COMPLETED'?orderPayload(createdId,refKey):{id:createdId,status:'APPROVED',purchase_units:[{custom_id:refKey}]});}
  if(u.includes('api.brevo.com')){mailCount++;return Response.json({messageId:'mock-msg'});}
  throw Error('unexpected fetch '+u);
 };
 try{
  assert.equal(await ready(env),true);
  const post=new Request('https://daninihub.com/api/danini/digital/checkout',{method:'POST',headers:{Origin:'https://daninihub.com','content-type':'application/json'},body:JSON.stringify({sku:'guide',language:'de',email:'buyer@example.test',termsAccepted:true,instantDeliveryConsent:true,turnstileToken:'sandbox-token-valid'})});
  const res=await digitalRoute(post,env);
  assert.equal(res.status,200);
  const order=await res.json();assert.match(order.reference,/^DGD-[A-F0-9]{32}$/);
  assert.ok(order.checkoutUrl.startsWith('https://www.sandbox.paypal.com/'));
  const before=await digitalRoute(new Request('https://daninihub.com/api/danini/digital/download/'+order.reference+'?token=forged'),env);
  assert.equal(before.status,404);
  const callback=await digitalRoute(new Request('https://daninihub.com/api/danini/digital/paypal/return?ref='+order.reference+'&token='+createdId),env);
  assert.equal(callback.status,200);
  assert.equal(db.records.get(order.reference).status,'PAID');
  assert.equal(mailCount,1);assert.equal(captureCount,1);
  const html=await callback.text();const url=html.match(/href="(https:\/\/daninihub.com\/api\/danini\/digital\/download\/[^"]+)"/)?.[1];
  assert.ok(url);
  const download=await digitalRoute(new Request(url),env);
  assert.equal(download.status,200);assert.match(download.headers.get('content-type'),/pdf/);
  assert.equal((await download.arrayBuffer()).byteLength,db.bytes.length);
  const again=await digitalRoute(new Request('https://daninihub.com/api/danini/digital/paypal/return?ref='+order.reference+'&token='+createdId),env);
  assert.equal(again.status,200);
  assert.equal(captureCount,1);assert.equal(mailCount,1);
  const badSignature=await digitalRoute(new Request('https://daninihub.com/api/danini/digital/paypal/webhook',{method:'POST',body:'{}'}),env);
  assert.equal(badSignature.status,403);
 }finally{globalThis.fetch=original;}
});
