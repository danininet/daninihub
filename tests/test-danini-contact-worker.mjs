import test from 'node:test';
import assert from 'node:assert/strict';
import worker,{handleApi,isReady} from '../workers/danini-intake.mjs';

const ready={
 DANINI_CONTACT_ACTIVE:'true',
 BREVO_API_KEY:'secret-test-not-live',
 DANINI_BREVO_SENDER:'verified@example.test',
 DANINI_BREVO_REPLYTO:'contact@example.test',
 DANINI_NOTIFY_TO:'operator@example.test',
 DANINI_TURNSTILE_SECRET:'turnstile-secret-test',
 DANINI_TURNSTILE_SITEKEY:'public-sitekey-test'
};
const payload=()=>({
 kind:'general',name:'Test Customer',email:'customer@example.test',
 topic:'DANINI Business',message:'I need an answer about your planned digital services.',
 consent:true,language:'de',
 company:'Example GmbH',details:{source:'Website'},
 turnstileToken:'turnstile-token-test-123456'
});
const req=(data,headers={})=>new Request('https://daninihub.com/api/lead',{
 method:'POST',headers:{origin:'https://daninihub.com','content-type':'application/json',...headers},
 body:JSON.stringify(data)
});
test('fail closed unless every required secret and explicit activation flag is present',async()=>{
 assert.equal(isReady({}),false);
 assert.equal(isReady({...ready,DANINI_CONTACT_ACTIVE:'false'}),false);
 assert.equal(isReady({...ready,DANINI_TURNSTILE_SECRET:undefined}),false);
 const status=await handleApi(new Request('https://daninihub.com/api/lead/status'),{});
 assert.equal(status.status,200);
 const body=await status.json();
 assert.equal(body.enabled,false);
 assert.equal(body.turnstileSiteKey,null);
 const post=await handleApi(req(payload()),{});
 assert.equal(post.status,503);
 assert.equal((await post.json()).error,'not_configured');
});
test('public status exposes only public Turnstile identifier, never Brevo credentials',async()=>{
 const r=await handleApi(new Request('https://daninihub.com/api/lead/status'),ready);
 assert.equal(r.status,200);
 const j=await r.json();
 assert.equal(j.enabled,true);
 assert.equal(j.turnstileSiteKey,ready.DANINI_TURNSTILE_SITEKEY);
 assert.ok(!JSON.stringify(j).includes(ready.BREVO_API_KEY));
});
test('rejects wrong Origin, bad fields and non-JSON without calling provider',async()=>{
 const old=globalThis.fetch;
 globalThis.fetch=()=>{throw Error('should not call provider')};
 try{
  assert.equal((await handleApi(req(payload(),{origin:'https://attacker.example'}),ready)).status,403);
  assert.equal((await handleApi(req({...payload(),consent:false}),ready)).status,400);
  assert.equal((await handleApi(req({...payload(),email:'invalid'}),ready)).status,400);
  assert.equal((await handleApi(new Request('https://daninihub.com/api/lead',{method:'POST',headers:{origin:'https://daninihub.com','content-type':'text/plain'},body:'hello'}),ready)).status,415);
 }finally{globalThis.fetch=old;}
});
test('Turnstile must validate the correct hostname before any Brevo email',async()=>{
 const old=globalThis.fetch;let requests=0;
 globalThis.fetch=async(url)=>{
  requests++;
  if(String(url).includes('siteverify'))return Response.json({success:true,hostname:'attacker.example'});
  throw Error('Brevo should not be called');
 };
 try{
  const r=await handleApi(req(payload()),ready);
  assert.equal(r.status,400);
  assert.equal((await r.json()).error,'human_verification_failed');
  assert.equal(requests,1);
 }finally{globalThis.fetch=old;}
});
test('Brevo operator alert and neutral customer receipt only after captcha passes',async()=>{
 const old=globalThis.fetch;
 const records=[];
 globalThis.fetch=async(url,opts)=>{
  if(String(url).includes('siteverify'))return Response.json({success:true,hostname:'daninihub.com'});
  assert.equal(String(url),'https://api.brevo.com/v3/smtp/email');
  assert.equal(opts.headers['api-key'],ready.BREVO_API_KEY);
  records.push(JSON.parse(opts.body));
  return Response.json({messageId:'<test-provider-accepted@example.test>'},{status:201});
 };
 try {
  const r=await handleApi(req(payload()),ready);
  assert.equal(r.status,202);
  const j=await r.json();
  assert.equal(j.accepted,true);
  assert.equal(j.receiptAccepted,true);
  assert.match(j.reference,/^DN-\d{8}-[A-F0-9]{8}$/);
  assert.equal(records.length,2);
  assert.ok(records[0].subject.includes('DaniniHub'));
  assert.equal(records[0].to[0].email,ready.DANINI_NOTIFY_TO);
  assert.equal(records[0].replyTo.email,payload().email);
  assert.equal(records[1].to[0].email,payload().email);
  assert.equal(records[1].templateId,38,'German general inquiry must use verified DANINI Kontakt DE branded template');
  assert.deepEqual(records[1].sender,{name:'DANINI',email:'kontakt@daninihub.com'});
  assert.ok(records[1].params.REFERENCE.startsWith('DN-'));
  assert.ok(!JSON.stringify(records[1]).includes(payload().message),'receipt must never echo untrusted input');
  assert.equal(records[0].to.length,1);
  assert.ok(!JSON.stringify(records).includes(ready.BREVO_API_KEY));
 }finally{globalThis.fetch=old;}
});
test('vehicle, support and B2B requests route to distinct verified logo templates without newsletter consent',async()=>{
 const cases=[['vehicle','sr',41],['vehicle','de',40],['support','sr',43],['support','de',42],['business','sr',49],['business','de',48],['general','sr',39]];
 const prior=globalThis.fetch;
 try{
  for(const [kind,language,templateId] of cases){
   const sent=[];
   globalThis.fetch=async(url,options)=>{
    if(String(url).includes('siteverify'))return Response.json({success:true,hostname:'daninihub.com'});
    sent.push(JSON.parse(options.body));
    return Response.json({messageId:'<accepted@example.test>'},{status:201});
   };
   const result=await handleApi(req({...payload(),kind,language}),ready);
   assert.equal(result.status,202);
   assert.equal(sent.length,2);
   assert.equal(sent[1].templateId,templateId);
   assert.equal(sent[1].sender.name,kind==='vehicle'?'DANINI Auto':kind==='business'?'DANINI Business':kind==='support'?'DANINI Support':'DANINI');
   assert.equal(sent[1].sender.email,({vehicle:'auto@daninihub.com',business:'business@daninihub.com',support:'support@daninihub.com',general:'kontakt@daninihub.com'})[kind]);
   assert.equal(sent[1].params.REFERENCE, (await result.json()).reference);
   assert.ok(!JSON.stringify(sent[1]).includes(payload().message));
  }
 }finally{globalThis.fetch=prior}
});
test('Brevo failure never returns a fake success',async()=>{
 const old=globalThis.fetch;
 globalThis.fetch=async(url)=>{
  if(String(url).includes('siteverify'))return Response.json({success:true,hostname:'daninihub.com'});
  return Response.json({message:'rate limit'},{status:429});
 };
 try{
  const r=await handleApi(req(payload()),ready);
  assert.equal(r.status,502);
  assert.equal((await r.json()).error,'mail_provider_unavailable');
 }finally{globalThis.fetch=old;}
});
test('unrelated API endpoints remain forbidden and static assets still routed via binding',async()=>{
 assert.equal((await handleApi(new Request('https://daninihub.com/api/checkout'),ready)).status,404);
 const assets={
  fetch:async()=>new Response('<title>Existing DANINI</title>',{status:200,headers:{'content-type':'text/html'}})
 };
 const r=await worker.fetch(new Request('https://daninihub.com/index.html'),{ASSETS:assets});
 assert.equal(r.status,200);
 assert.match(await r.text(),/Existing DANINI/);
});
