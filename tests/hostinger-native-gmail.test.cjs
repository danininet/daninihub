'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {createHash,createHmac}=require('node:crypto');
const {createNativeGmail,adapter}=require('../hostinger-native-gmail.cjs');
function response(){return {code:200,body:null,set(){return this},status(n){this.code=n;return this},json(v){this.body=v;return this},sendStatus(n){this.code=n;return this},type(){return this},send(v){this.body=v;return this}}}
const secret='t'.repeat(64);
function request(signature){const time=String(Math.floor(Date.now()/1000)),nonce='test-nonce-12345678901234567890',originalUrl='/portal/gmail-intake';const h={'x-danini-timestamp':time,'x-danini-nonce':nonce,'x-danini-signature':signature||createHmac('sha256',secret).update(['GET',originalUrl,time,nonce,createHash('sha256').update('').digest('hex')].join('\n')).digest('hex')};return {method:'GET',originalUrl,get:k=>h[k]};}
test('missing and invalid authorization cannot initialize database or load Gmail',async()=>{let calls=0;const factory=()=>{calls++;throw Error('unexpected')};for(const [env,req,status] of [[{},request(),503],[{DIRECTOR_HMAC_SECRET:secret},{...request(),get:()=>undefined},401],[{DIRECTOR_HMAC_SECRET:secret},request('0'.repeat(64)),401]]){const res=response();await createNativeGmail({env,storeFactory:factory,loadCore:factory})(req,res);assert.equal(res.code,status)}assert.equal(calls,0)});
test('valid signature without durable database fails closed',async()=>{const res=response();await createNativeGmail({env:{DIRECTOR_HMAC_SECRET:secret},storeFactory:()=>({databaseConfigured:false}),loadCore:()=>{throw Error('unexpected')}})(request(),res);assert.equal(res.code,503)});
test('D1 compatibility uses parameterized MySQL and preserves affected rows',async()=>{const calls=[];const db=adapter({execute:async(q,a)=>{calls.push([q,a]);return [{affectedRows:1}]}});assert.equal((await db.prepare('INSERT OR IGNORE INTO auth_nonces(nonce,expires_at) VALUES (?,?)').bind('nonce',123).run()).meta.changes,1);assert.deepEqual(calls,[['INSERT IGNORE INTO auth_nonces(nonce,expires_at) VALUES (?,?)',['nonce',123]]])});
test('valid signed request reaches shared core and never enables AI',async()=>{const calls=[];const pool={execute:async(sql,args)=>{calls.push(sql);return [{affectedRows:1}]}};const res=response();await createNativeGmail({env:{DIRECTOR_HMAC_SECRET:secret,GMAIL_INTAKE_ENABLED:'false',AI_ENABLED:'true'},storeFactory:()=>({databaseConfigured:true,mode:'mysql',pool,init:async()=>{}}),loadCore:()=>({gmailQueue:async(req,env)=>{assert.equal(env.AI_ENABLED,'false');assert.equal(env.GMAIL_INTAKE_ENABLED,'false');assert.equal(req.headers.has('cf-access-jwt-assertion'),false);return Response.json({enabled:false,items:[]})}})})(request(),res);assert.equal(res.code,200);assert.deepEqual(JSON.parse(res.body),{enabled:false,items:[]});assert.equal(calls.length,4)});

const ownerEnv={HOSTINGER_PUBLIC_DOMAIN_ENABLED:'true',HOSTINGER_OWNER_GMAIL_ENABLED:'true',GMAIL_INTAKE_ENABLED:'false',AI_ENABLED:'true'};
function ownerRequest({host='daninihub.com',method='GET',origin='https://daninihub.com',token='mock-jwt'}={}){
 const h={'cf-access-jwt-assertion':token,'origin':origin,'content-type':'application/json'};
 return {hostname:host,method,originalUrl:'/portal/gmail-intake'+(method==='POST'?'/poll':''),body:{},get:k=>h[k]};
}
test('owner JWT is refused when disabled, on staging, or from a foreign POST origin',async()=>{
 const fail=()=>assert.fail('must not access database or verifier');
 for(const [env,req] of [
  [{...ownerEnv,HOSTINGER_OWNER_GMAIL_ENABLED:'false'},ownerRequest()],
  [{...ownerEnv,HOSTINGER_PUBLIC_DOMAIN_ENABLED:'false'},ownerRequest()],
  [ownerEnv,ownerRequest({host:'gleaming-orangered-crow-58.hostingersite.com'})],
  [ownerEnv,ownerRequest({method:'POST',origin:'https://untrusted.example'})],
  [ownerEnv,ownerRequest({token:'x'.repeat(16001)})]
 ]){
  const res=response();await createNativeGmail({env,storeFactory:fail,loadCore:fail})(req,res);assert.equal(res.code,401);
 }
});
test('invalid owner JWT fails before database creation and cannot fall back to HMAC',async()=>{
 const res=response();let verified=0;
 await createNativeGmail({env:ownerEnv,storeFactory:()=>assert.fail('unexpected database'),loadCore:()=>({authorizeOwner:async()=>{verified++;throw Object.assign(Error('unauthorized'),{status:401})}})})(ownerRequest(),res);
 assert.equal(verified,1);assert.equal(res.code,401);
});
test('verified owner can reach only existing Gmail queue and poll with AI disabled',async()=>{
 for(const method of ['GET','POST']){
  const calls=[];const res=response();const req=ownerRequest({method});
  const core={authorizeOwner:async(r,e)=>{calls.push('verified');assert.equal(e.SITE_ORIGIN,'https://daninihub.com');assert.equal(r.headers.get('cf-access-jwt-assertion'),'mock-jwt')},
   [method==='GET'?'gmailQueue':'gmailPoll']:async(r,e)=>{calls.push('core');assert.equal(e.AI_ENABLED,'false');assert.equal(e.GMAIL_INTAKE_ENABLED,'false');assert.equal(new URL(r.url).origin,'https://daninihub.com');if(method==='POST')assert.deepEqual(await r.json(),{});return Response.json({ok:true})}};
  const pool={execute:async()=>[{affectedRows:1}]};
  await createNativeGmail({env:ownerEnv,storeFactory:()=>{calls.push('db');return {databaseConfigured:true,mode:'mysql',pool,init:async()=>{}}},loadCore:()=>core})(req,res);
  assert.equal(res.code,200);assert.deepEqual(calls,['verified','db','core']);
 }
});
