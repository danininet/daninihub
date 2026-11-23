import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {academyAiRoute} from '../../workers/danini-academy-ai.mjs';

const prod=JSON.parse(readFileSync(new URL('../../wrangler.b2b-production.jsonc',import.meta.url),'utf8'));
test('owner approved Academy AI release retains existing Cloudflare resource bindings',()=>{
 assert.equal(prod.name,'autodanini');
 assert.equal(prod.ai.binding,'AI');
 assert.equal(prod.vars.AI_ENABLED,'true');
 assert.equal(prod.vars.DANINI_AI_LIVE_APPROVED,'true');
 assert.equal(prod.vars.ACADEMY_AI_ENABLED,'true');
 assert.equal(prod.vars.DANINI_ACADEMY_AI_SPEND_APPROVED,'true');
 assert.equal(prod.d1_databases[0].binding,'DANINI_DB');
 assert.equal(prod.r2_buckets[0].binding,'DOCUMENTS');
 assert.equal(prod.kv_namespaces[0].binding,'PARTNERS');
 assert.equal(prod.workflows[0].binding,'INTAKE_WORKFLOW');
 assert.equal(prod.assets.directory,'./dist');
 assert.equal(prod.keep_vars,true);
});
test('Academy AI fails closed if any free-plan authorization or existing service dependency disappears',async()=>{
 const flags=['ACADEMY_AI_ENABLED','DANINI_ACADEMY_AI_SPEND_APPROVED','AI_ENABLED','DANINI_AI_LIVE_APPROVED'];
 const env={...prod.vars,AI:{run:()=>{throw Error('must never call')}},DANINI_DB:{},DANINI_TURNSTILE_SECRET:'test',DANINI_TURNSTILE_SITEKEY:'test'};
 for(const flag of flags){
  const result=await academyAiRoute(new Request('https://daninihub.com/api/academy/ai/status'),{...env,[flag]:'false'});
  assert.equal((await result.json()).enabled,false,'Disabling '+flag+' must block paid inference');
 }
 for(const missing of ['AI','DANINI_DB','DANINI_TURNSTILE_SECRET','DANINI_TURNSTILE_SITEKEY']){
  const result=await academyAiRoute(new Request('https://daninihub.com/api/academy/ai/status'),{...env,[missing]:undefined});
  assert.equal((await result.json()).enabled,false,'Missing '+missing+' must block inference');
 }
});
