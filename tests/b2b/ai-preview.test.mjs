import test from 'node:test';
import assert from 'node:assert/strict';
import preview from '../../workers/danini-ai-preview.mjs';

const url='https://danini-ai-pr207-preview.dragangaganet.workers.dev';
const payload={
 language:'de',source:'https://www.mobile.de/test-vehicle',
 name:'Internal Tester',email:'tester@example.com',consent:true,
 answers:[{question:1,status:'confirmed'},{question:2,status:'critical'},{question:3,status:'missing'}],
 'cf-turnstile-response':'XXXX.DUMMY.TOKEN.XXXX'
};
function post(body,origin=url){
 return new Request(url+'/api/ai-intake',{
  method:'POST',headers:{origin,'content-type':'application/json'},
  body:JSON.stringify(body)
 });
}
test('preview status exposes only Cloudflare test key, never production secrets',async()=>{
 const response=await preview.fetch(new Request(url+'/api/lead/status'));
 assert.equal(response.status,200);
 const data=await response.json();
 assert.equal(data.enabled,true);
 assert.equal(data.channel,'preview_no_email');
 assert.equal(data.turnstileSiteKey,'1x00000000000000000000AA');
 assert.ok(!JSON.stringify(data).includes('BREVO_API_KEY'));
});
test('preview blocks cross-origin calls before Turnstile',async()=>{
 const res=await preview.fetch(post(payload,'https://attacker.example'));
 assert.equal(res.status,403);
});
test('preview rejects failed Turnstile without email',async()=>{
 const saved=globalThis.fetch;
 let called=0;
 globalThis.fetch=async url=>{
  called++;
  assert.match(String(url),/siteverify/);
  return Response.json({success:false,hostname:'example.com'});
 };
 try{
  const res=await preview.fetch(post(payload));
  assert.equal(res.status,403);
  assert.equal(called,1);
 }finally{globalThis.fetch=saved;}
});
test('preview returns sanitized risk report and mailSent false; no Brevo call',async()=>{
 const saved=globalThis.fetch;
 let called=0;
 globalThis.fetch=async url=>{
  called++;
  assert.match(String(url),/siteverify/);
  return Response.json({success:true,hostname:'example.com'});
 };
 try{
  const res=await preview.fetch(post(payload));
  assert.equal(res.status,200);
  const result=await res.json();
  assert.equal(result.accepted,true);
  assert.equal(result.preview,true);
  assert.equal(result.mailSent,false);
  assert.deepEqual(result.payload.answers,payload.answers);
  assert.ok(!JSON.stringify(result).includes(payload.email));
  assert.equal(called,1);
 }finally{globalThis.fetch=saved;}
});
test('preview rejects incomplete questionnaire after successful Turnstile',async()=>{
 const saved=globalThis.fetch;
 globalThis.fetch=async()=>Response.json({success:true,hostname:'example.com'});
 try{
  const res=await preview.fetch(post({...payload,answers:payload.answers.slice(0,2)}));
  assert.equal(res.status,400);
 }finally{globalThis.fetch=saved;}
});
