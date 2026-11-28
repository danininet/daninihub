import test from 'node:test';
import assert from 'node:assert/strict';
import provider from '../../hostinger-ai-provider.cjs';
import runtime from '../../hostinger-ai-runtime.cjs';
import counters from '../../hostinger-vehicle-counters.cjs';
import {handleRequest} from '../../src/request-handler.ts';
const cfg={HOSTINGER_PUBLIC_DOMAIN_ENABLED:'true',HOSTINGER_AI_PUBLIC_ENABLED:'true',HOSTINGER_AI_SPEND_APPROVED:'true',HOSTINGER_WORKERS_AI_TOKEN:'fake-token',HOSTINGER_SITE_ASSISTANT_ENABLED:'true',DANINI_TURNSTILE_SITEKEY:'site',DANINI_TURNSTILE_SECRET:'secret'};
test('AI routes require canonical host and explicit spend approval',()=>{
 assert.equal(runtime.aiContext(cfg,'daninihub.com').AI_ENABLED,'true');
 assert.equal(runtime.aiContext(cfg,'gleaming-orangered-crow-58.hostingersite.com'),null);
 for(const patch of [{HOSTINGER_AI_SPEND_APPROVED:'false'},{HOSTINGER_WORKERS_AI_TOKEN:''},{HOSTINGER_AI_PUBLIC_ENABLED:'false'}])assert.equal(runtime.aiContext({...cfg,...patch},'daninihub.com').AI_ENABLED,'false');
 assert.equal(runtime.aiContext(cfg,'daninihub.com').HOSTINGER_VEHICLE_ENABLED,'false');
 assert.equal(runtime.ROUTES.get('/api/vehicle-analysis')[1],'vehicle');
});
test('provider reserves before inference and blocks unapproved model, excessive tokens and exhausted quota',async()=>{
 const calls=[];
 const ai=provider.createWorkersAI({token:'fake',reserve:async m=>{calls.push('reserve');return true},fetcher:async(u,o)=>{calls.push('fetch');assert.equal(u,provider.BASE+provider.TEXT);assert.equal(o.redirect,'error');return Response.json({success:true,result:{response:'ok'}})}});
 const input={messages:[{role:'system',content:'test'},{role:'user',content:'test'}],max_tokens:380};
 assert.deepEqual(await ai.run(provider.TEXT,input),{response:'ok'});
 await assert.rejects(ai.run('unknown',input));
 await assert.rejects(ai.run(provider.TEXT,{...input,max_tokens:521}));
 assert.deepEqual(calls,['reserve','fetch']);
 const exhausted=provider.createWorkersAI({token:'fake',reserve:async()=>false,fetcher:async()=>assert.fail('unexpected inference')});
 await assert.rejects(exhausted.run(provider.TEXT,input));
});
test('vehicle counter reserves once before handler comparison and rejects arbitrary keys',async()=>{
 let used=0;
 const conn={async beginTransaction(){},async commit(){},async rollback(){},release(){},async execute(sql,args){
 if(sql.startsWith('UPDATE')&&sql.includes('used=used+1')){if(used>=args[1])return [{affectedRows:0}];used++;return [{affectedRows:1}]}
 if(sql.startsWith('SELECT'))return [[{used}]];
 return [{affectedRows:0}];
 }};
 const db=counters.createVehicleCounters({async getConnection(){return conn}});
 const key='vehicle-vision-daily:2026-11-28';
 for(let i=0;i<6;i++){assert.equal(await db.get(key),String(i));await db.put(key,String(i+1),{expirationTtl:90000})}
 assert.equal(await db.get(key),'6');assert.equal(used,6);
 await assert.rejects(db.get('arbitrary'));
});
test('shared handler keeps both assistant paths disabled without configuration',async()=>{
 for(const path of ['/api/assistant/status','/api/academy/assistant/status']){
 const r=await handleRequest(new Request('https://daninihub.com'+path),{});
 assert.equal(r.status,200);assert.equal((await r.json()).enabled,false);
 }
});
