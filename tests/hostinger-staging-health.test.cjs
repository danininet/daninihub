'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {STAGING_HEALTH_URL,probeStaging,createStagingHealth}=require('../hostinger-staging-health.cjs');
const json=()=>new Response('{"status":"ok"}',{headers:{'content-type':'application/json'}});
test('fixed read-only staging target and safe request',async()=>{
 assert.equal(await probeStaging(async(url,opts)=>{assert.equal(url,STAGING_HEALTH_URL);assert.match(url,/^https:\/\/danini-b2b-staging\./);assert.equal(opts.method,'GET');assert.equal(opts.credentials,'omit');assert.equal(opts.redirect,'error');assert.deepEqual(opts.headers,{accept:'application/json'});assert.ok(opts.signal);return json();}),true);
});
test('fails closed on bad responses and network failures',async()=>{
 for(const response of [new Response('{"status":"ok"}',{status:503,headers:{'content-type':'application/json'}}),new Response('{"status":"ok"}'),new Response('bad',{headers:{'content-type':'application/json'}}),new Response('{"status":"other"}',{headers:{'content-type':'application/json'}}),new Response(' '.repeat(1025),{headers:{'content-type':'application/json'}})])assert.equal(await probeStaging(async()=>response),false);
 assert.equal(await probeStaging(async()=>{throw Error('network');}),false);
});
test('disabled default, cache and coalescing',async()=>{
 let calls=0,clock=0;
 const fetcher=async()=>{calls++;return json();};
 const disabled=createStagingHealth({fetcher});
 assert.equal((await disabled()).staging,'disabled');assert.equal(calls,0);
 const check=createStagingHealth({enabled:true,fetcher,now:()=>clock});
 const results=await Promise.all([check(),check(),check()]);
 assert.ok(results.every(x=>x.ok&&x.staging==='reachable'));assert.equal(calls,1);
 await check();assert.equal(calls,1);clock=30001;await check();assert.equal(calls,2);
});
