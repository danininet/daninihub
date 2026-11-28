import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import legacy from '../../workers/danini-intake.mjs';
const integratedSource=readFileSync(new URL('../../src/request-handler.ts',import.meta.url),'utf8');

function config(){
 return {
  ACADEMY_AI_ENABLED:'true',DANINI_ACADEMY_AI_SPEND_APPROVED:'true',
  AI_ENABLED:'true',DANINI_AI_LIVE_APPROVED:'true',
  AI:{run:()=>{throw Error('AI inference must not run in route tests')}},
  DANINI_DB:{},DANINI_TURNSTILE_SITEKEY:'0xTEST_SITE_KEY',DANINI_TURNSTILE_SECRET:'MOCK_SECRET',
  ASSETS:{fetch:()=>new Response('Static 404',{status:404})}
 };
}
test('integrated Cloudflare main route exposes Academy AI status before private workspace router',async()=>{
 const env=config();
 const aiIndex=integratedSource.indexOf('p.startsWith("/api/academy/ai/")');
 const workspaceIndex=integratedSource.indexOf('p.startsWith("/api/academy/")');
 assert.ok(aiIndex>=0&&workspaceIndex>=0&&aiIndex<workspaceIndex,'Integrated entrypoint must route opt-in AI before private Academy workspace');
 const response=await legacy.fetch(new Request('https://daninihub.com/api/academy/ai/status'),env);
 assert.equal(response.status,200);
 const payload=await response.json();
 assert.equal(payload.enabled,true);
 assert.equal(payload.siteKey,'0xTEST_SITE_KEY');
});
test('integrated Academy AI route rejects invalid methods and origins before inference',async()=>{
 const env=config();
 const wrong=await legacy.fetch(new Request('https://daninihub.com/api/academy/ai/review'),env);
 assert.equal(wrong.status,405);
 assert.equal((await wrong.json()).error,'method_not_allowed');
 const blocked=await legacy.fetch(new Request('https://daninihub.com/api/academy/ai/review',{
  method:'POST',headers:{origin:'https://attacker.example','content-type':'application/json'},
  body:JSON.stringify({language:'sr',step:'niche',projectName:'Demo',fields:{a:'Demo field'},turnstileToken:'bad-token-001'})
 }),env);
 assert.equal(blocked.status,403);
 assert.equal((await blocked.json()).error,'invalid_origin');
});
test('AI feature disabling does not accidentally enable protected Academy accounts',async()=>{
 const env={...config(),ACADEMY_AI_ENABLED:'false'};
 const status=await legacy.fetch(new Request('https://daninihub.com/api/academy/ai/status'),env);
 assert.equal(status.status,200);
 assert.equal((await status.json()).enabled,false);
 assert.match(integratedSource,/p\.startsWith\("\/api\/academy\/"\)/,'Protected Academy workspace route must remain');
});
