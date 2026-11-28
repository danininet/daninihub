import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import {handleRequest} from '../../src/request-handler.ts';
import d1 from '../../hostinger-b2b-d1.cjs';
import services from '../../hostinger-b2b-services.cjs';
import runtime from '../../hostinger-b2b-runtime.cjs';

const id='12345678-1234-4234-8234-123456789abc';
const decision='87654321-1234-4234-8234-123456789abc';
const key='cases/'+id+'/draft.json';
const select='SELECT reference,status,created_at,expires_at,draft_hash FROM cases WHERE id=? AND expires_at>?';
const write="UPDATE cases SET status='received' WHERE id=? AND status='storing'";
const result=(data)=>Response.json({success:true,result:data});
const config={
 HOSTINGER_PUBLIC_DOMAIN_ENABLED:'true',HOSTINGER_B2B_PUBLIC_ENABLED:'true',
 HOSTINGER_B2B_D1_READ_TOKEN:'d1-read',HOSTINGER_B2B_D1_WRITE_TOKEN:'d1-write',
 HOSTINGER_B2B_R2_READ_TOKEN:'r2-read',HOSTINGER_B2B_R2_WRITE_TOKEN:'r2-write',
 HOSTINGER_B2B_WORKFLOW_READ_TOKEN:'wf-read',HOSTINGER_B2B_WORKFLOW_WRITE_TOKEN:'wf-write',
 TOKEN_SECRET:'a'.repeat(48),RATE_SECRET:'b'.repeat(48),DIRECTOR_HMAC_SECRET:'c'.repeat(48),
 ACCESS_TEAM_DOMAIN:'https://test.cloudflareaccess.com',ACCESS_AUD:'aud-test',DIRECTOR_EMAIL:'owner@example.test',
 DANINI_TURNSTILE_SECRET:'captcha-test',DANINI_TURNSTILE_SITEKEY:'site-test',
 BREVO_API_KEY:'brevo-test',DANINI_BREVO_SENDER:'sender@example.test',DANINI_NOTIFY_TO:'owner@example.test',
 DANINI_PACKAGE_D1_READ_TOKEN:'premium-read',HOSTINGER_B2B_PILOT_RECIPIENT:'pilot@example.test'
};
const never=async()=>assert.fail('unexpected provider call');
test('B2B is locked to canonical host, explicit gates and independent credentials',()=>{
 assert.equal(runtime.createB2BContext(config,'daninihub.com',never).MAIL_TEST_RECIPIENT,'pilot@example.test');
 for(const host of ['www.daninihub.com','gleaming-orangered-crow-58.hostingersite.com','evil.test'])assert.equal(runtime.createB2BContext(config,host,never),null);
 for(const patch of [{HOSTINGER_PUBLIC_DOMAIN_ENABLED:'false'},{HOSTINGER_B2B_PUBLIC_ENABLED:'false'},{HOSTINGER_B2B_D1_WRITE_TOKEN:''},{HOSTINGER_B2B_D1_WRITE_TOKEN:'d1-read'},{HOSTINGER_B2B_D1_READ_TOKEN:'premium-read'},{TOKEN_SECRET:'short'}])assert.equal(runtime.createB2BContext({...config,...patch},'daninihub.com',never),null);
 assert.equal(runtime.routeMethod('/api/danini/digital/status'),null);
 assert.equal(runtime.routeMethod('/api/academy/config'),null);
 assert.equal(runtime.routeMethod('/portal/gmail-intake'),null);
 assert.equal(runtime.routeMethod('/portal/approve/'+id),'POST');
 assert.equal(runtime.routeMethod('/api/case/'+id),'GET');
 assert.equal(runtime.routeMethod('/portal/approve/../../x'),null);
});
test('D1 uses parameter binding and separate credentials, rejects arbitrary SQL',async()=>{
 const calls=[];
 const db=d1.createB2BD1({readToken:'read',writeToken:'write',fetcher:async(url,opts)=>{
  assert.equal(url,d1.D1_URL);assert.equal(opts.redirect,'error');
  const body=JSON.parse(opts.body);calls.push({body,auth:opts.headers.Authorization});
  return result((body.batch||[body]).map(x=>({success:true,results:x.sql.startsWith('SELECT ')?[{status:'received'}]:[],meta:{changes:1}})));
 }});
 assert.deepEqual(await db.prepare(select).bind(id,42).first(),{status:'received'});
 assert.equal(calls[0].auth,'Bearer read');
 assert.deepEqual(calls[0].body.params,[id,42]);
 assert.equal((await db.prepare(write).bind(id).run()).meta.changes,1);
 assert.equal(calls[1].auth,'Bearer write');
 assert.equal((await db.batch([db.prepare(select).bind(id,42),db.prepare(write).bind(id)])).length,2);
 assert.equal(calls[2].auth,'Bearer write');
 assert.throws(()=>db.prepare('DELETE FROM cases'));
 assert.throws(()=>db.prepare(select).bind(id));
 await assert.rejects(db.batch([{}]));
 assert.equal(calls.length,3);
});
test('D1 fails closed on provider refusal or malformed batch responses',async()=>{
 for(const response of [()=>new Response('denied',{status:403}),()=>result([{success:false,results:[],meta:{changes:0}}]),()=>result([])]){
  const db=d1.createB2BD1({readToken:'read',writeToken:'write',fetcher:async()=>response()});
  await assert.rejects(db.prepare(select).bind(id,42).first());
 }
});
test('private R2 accepts only bounded case JSON and exact acknowledged writes',async()=>{
 const calls=[];
 const r2=services.createB2BR2({readToken:'read',writeToken:'write',fetcher:async(url,opts)=>{
  calls.push({url,opts});assert.equal(opts.redirect,'error');
  assert.equal(url,services.R2+key);
  if(opts.method==='PUT')return result({key});
  return Response.json({summary:'example'});
 }});
 assert.deepEqual(await (await r2.get(key)).json(),{summary:'example'});
 await r2.put(key,'{"summary":"new"}');
 assert.equal(calls[0].opts.headers.Authorization,'Bearer read');
 assert.equal(calls[1].opts.headers.Authorization,'Bearer write');
 await assert.rejects(r2.get('cases/../private.json'));
 await assert.rejects(r2.put(key,'invalid-json'));
 await assert.rejects(r2.put(key,JSON.stringify({data:'x'.repeat(300000)})));
 assert.equal(calls.length,2);
 const wrong=services.createB2BR2({readToken:'read',writeToken:'write',fetcher:async()=>result({key:'wrong'})});
 await assert.rejects(wrong.put(key,'{}'));
});
test('workflow validates creation, existing status and decision acknowledgment',async()=>{
 const calls=[];
 const wf=services.createB2BWorkflow({readToken:'read',writeToken:'write',fetcher:async(url,opts)=>{
  calls.push({url,opts});
  if(url.endsWith('/events/director-decision'))return result({instanceId:id});
  if(opts.method==='POST')return result({id,status:'queued'});
  return result({status:'waiting'});
 }});
 const instance=await wf.create({id,params:{caseId:id}});
 assert.equal(calls[0].url,services.WORKFLOW);
 assert.deepEqual(JSON.parse(calls[0].opts.body),{instance_id:id,params:JSON.stringify({caseId:id})});
 assert.deepEqual(await instance.status(),{status:'waiting'});
 await instance.sendEvent({type:'director-decision',payload:{decisionId:decision}});
 assert.deepEqual(JSON.parse(calls[2].opts.body),{decisionId:decision});
 await assert.rejects(instance.sendEvent({type:'other',payload:{decisionId:decision}}));
 await assert.rejects(wf.create({id,params:{caseId:decision}}));
 await assert.rejects(wf.get('../escape'));
 assert.equal(calls.length,3);
 const wrong=services.createB2BWorkflow({readToken:'read',writeToken:'write',fetcher:async()=>result({instanceId:decision})});
 await assert.rejects((await wrong.get(id)).sendEvent({type:'director-decision',payload:{decisionId:decision}}));
});
test('Express dispatch preserves staging and protected routes; invalid credentials never read a case',async t=>{
 const app=express();
 let invoked=0;
 runtime.mountHostingerB2B(app,express,config,()=>({handleRequest:(request,env)=>{invoked++;return handleRequest(request,env);}}));
 app.use((_req,res)=>res.status(404).json({fallback:true}));
 const server=app.listen(0,'127.0.0.1');
 t.after(()=>new Promise(resolve=>server.close(resolve)));
 if(!server.listening)await new Promise(resolve=>server.once('listening',resolve));
 const base='http://127.0.0.1:'+server.address().port;
 const get=(path,init={},host='daninihub.com')=>fetch(base+path,{...init,headers:{Host:host,...init.headers}});
 assert.equal((await get('/api/tenant-config',{},'gleaming-orangered-crow-58.hostingersite.com')).status,404);
 assert.equal(invoked,0);
 const cfg=await get('/api/tenant-config');
 assert.equal(cfg.status,200);
 assert.equal((await cfg.json()).enabled,true);
 assert.match(cfg.headers.get('x-robots-tag'),/noindex/);
 assert.equal((await get('/portal/')).status,401);
 assert.equal((await get('/portal/cases')).status,401);
 assert.equal((await get('/api/case/'+id)).status,404);
 assert.equal((await get('/api/intake',{method:'POST',headers:{origin:'https://evil.test','content-type':'application/json'},body:'{}'})).status,403);
 assert.equal((await get('/portal/approve/'+id,{method:'GET'})).status,405);
 assert.equal((await get('/api/danini/digital/status')).status,404);
 assert.equal(invoked,4);
});
