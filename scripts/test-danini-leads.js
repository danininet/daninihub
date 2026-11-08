'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');

async function main(){
 const worker=await fs.readFile(path.join(__dirname,'../workers/danini-intake.mjs'),'utf8');
 const {handleApi,isReady}=await import('data:text/javascript;charset=utf-8,'+encodeURIComponent(worker));
 const env={
  DANINI_CONTACT_ACTIVE:'true',
  BREVO_API_KEY:'TEST_NOT_REAL',
  DANINI_BREVO_SENDER:'kontakt@daninihub.com',
  DANINI_NOTIFY_TO:'danininet@gmail.com',
  DANINI_BREVO_REPLYTO:'kontakt@daninihub.com',
  DANINI_TURNSTILE_SECRET:'TEST_NOT_REAL',
  DANINI_TURNSTILE_SITEKEY:'TEST_SITEKEY',
  DANINI_BREVO_TEMPLATES_ACTIVE:'true'
 };
 const mapping={
  general:{de:38,sr:39},vehicle:{de:40,sr:41},
  support:{de:42,sr:43},info:{de:44,sr:45},
  invoice:{de:46,sr:47},business:{de:48,sr:49},
  partner:{de:50,sr:51},privacy:{de:52,sr:53}
 };
 assert.equal(isReady(env),true);
 assert.equal(isReady({}),false);
 const status=await handleApi(new Request('https://daninihub.com/api/lead/status'),env);
 assert.equal(status.status,200);
 const statusData=await status.json();
 assert.equal(statusData.enabled,true);
 assert.equal(statusData.turnstileSiteKey,'TEST_SITEKEY');
 const disabled=await handleApi(new Request('https://daninihub.com/api/lead',{method:'POST',headers:{origin:'https://daninihub.com','content-type':'application/json'},body:'{}'}),{});
 assert.equal(disabled.status,503);

 const originalFetch=globalThis.fetch;
 let outgoing=[];
 let challengeHostname='daninihub.com';
 let failNotify=false,failReceipt=false;
 globalThis.fetch=async (url,options)=>{
  const u=String(url);
  if(u.includes('/turnstile/v0/siteverify'))return Response.json({success:true,hostname:challengeHostname});
  if(u.includes('api.brevo.com/v3/smtp/email')){
   const msg=JSON.parse(options.body);
   outgoing.push(msg);
   if((outgoing.length===1&&failNotify)||(outgoing.length===2&&failReceipt))return Response.json({error:'simulated'},{status:502});
   return Response.json({messageId:'test-message-'+outgoing.length});
  }
  throw new Error('unexpected test fetch: '+u);
 };
 function req(body,origin='https://daninihub.com'){
  return new Request('https://daninihub.com/api/lead',{
   method:'POST',headers:{origin,'content-type':'application/json'},
   body:JSON.stringify(body)
  });
 }
 const basic={name:'Test User',email:'test@example.net',topic:'Real specific question',
  message:'An enquiry about the requested service and availability.',
  consent:true,turnstileToken:'fake_challenge_token_test_123'};
 try{
  for(const [kind,langs] of Object.entries(mapping)){
   for(const [language,expectedId] of Object.entries(langs)){
    outgoing=[];
    const r=await handleApi(req({...basic,kind,language}),env);
    assert.equal(r.status,202,kind+'/'+language);
    const d=await r.json();
    assert.equal(d.accepted,true,kind+'/'+language);
    assert.equal(d.receiptAccepted,true,kind+'/'+language);
    assert.match(d.reference,/^DN-\d{8}-[A-F0-9]{8}$/);
    assert.equal(outgoing.length,2);
    assert.equal(outgoing[0].to[0].email,'danininet@gmail.com');
    assert.equal(outgoing[0].replyTo.email,'test@example.net');
    assert.equal(outgoing[1].templateId,expectedId);
    assert.equal(outgoing[1].params.REFERENCE,d.reference);
    assert.equal(outgoing[1].to[0].email,'test@example.net');
    assert.equal(outgoing[1].sender,undefined,'Template provides the department sender.');
   }
  }
  const invalid=[
    {...basic,kind:'general',language:'en'},
    {...basic,kind:'general',language:'sr',website:'spam.example'},
    {...basic,kind:'general',language:'sr',consent:false},
    {...basic,kind:'other',language:'sr'},
    {...basic,kind:'general',language:'sr',message:'short'}
  ];
  for(const payload of invalid){
   outgoing=[];
   const r=await handleApi(req(payload),env);
   assert.equal(r.status,400);
   assert.equal(outgoing.length,0,'Rejected before sending');
  }
  outgoing=[];
  assert.equal((await handleApi(req({...basic,kind:'general',language:'de'},'https://evil.example'),env)).status,403);
  assert.equal(outgoing.length,0);
  challengeHostname='evil.example';
  assert.equal((await handleApi(req({...basic,kind:'general',language:'sr'}),env)).status,400);
  challengeHostname='daninihub.com';
  outgoing=[];
  failReceipt=true;
  let r=await handleApi(req({...basic,kind:'business',language:'de'}),env);
  assert.equal(r.status,202);
  assert.equal((await r.json()).receiptAccepted,false,'Accepted lead but confirmation failed');
  failReceipt=false;
  outgoing=[];
  failNotify=true;
  r=await handleApi(req({...basic,kind:'support',language:'sr'}),env);
  assert.equal(r.status,502,'Never accept when operator alert fails');
  failNotify=false;
  console.log('DANINI lead Worker: 16 language+category pairs, validation, Turnstile, fail-safe email: OK');
 }finally{globalThis.fetch=originalFetch;}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
