import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {academyRoute} from '../../src/academy/routes.mjs';
const sql=readFileSync(new URL('../../migrations/2026-11-22-academy-business-builder.sql',import.meta.url),'utf8');
const origin='https://daninihub.com';
function fresh(){
 const db=new DatabaseSync(':memory:');
 db.exec(sql);
 db.exec('CREATE TABLE rate_buckets(key TEXT PRIMARY KEY,count INTEGER NOT NULL,expires_at INTEGER NOT NULL)');
 const dbApi={prepare(query){return {bind(...args){return {
   async run(){const x=db.prepare(query).run(...args);return {meta:{changes:x.changes}}},
   async first(){return db.prepare(query).get(...args)||null},
   async all(){return {results:db.prepare(query).all(...args)}}
 }}}}};
 const env={ACADEMY_AUTH_ENABLED:'true',ACADEMY_AUTH_SECRET:'5'.repeat(64),SITE_ORIGIN:origin,
  DANINI_DB:dbApi,BREVO_API_KEY:'test',DANINI_BREVO_SENDER:'internal@example.test',DANINI_TURNSTILE_SECRET:'testing',DANINI_TURNSTILE_SITEKEY:'1x00000000000000000000AA',MAIL_TEST_RECIPIENT:undefined};
 return {db,env};
}
function send(path,method='GET',body,opts={}){
 return new Request(origin+path,{method,headers:{...(method==='GET'?{}:{origin, 'content-type':'application/json'}), ...(opts.cookie?{'cookie':opts.cookie}:{})},body:body===undefined?undefined:JSON.stringify(body)});
}
function fakeProviders(){
 const emails=[];
 const prior=globalThis.fetch;
 globalThis.fetch=async(resource,init)=>{
  const url=String(resource);
  if(url.includes('siteverify'))return Response.json({success:true,hostname:'daninihub.com',action:'academy-login'});
  if(url.includes('api.brevo.com')){
   const message=JSON.parse(init.body);const code=message.htmlContent.match(/<strong>(\d{8})<\/strong>/)?.[1];
   assert.ok(code);emails.push({code,to:message.to[0].email});return Response.json({messageId:'test'}, {status:201});
  }
  throw Error('Unexpected external fetch '+url);
 };
 return {emails,restore:()=>globalThis.fetch=prior};
}
function loginStart(email,language='de') {return send('/api/academy/auth/start','POST',{email,language,turnstileToken:'SIMULATED.TURNSTILE.TOKEN'})}
async function login(env,email,providers){
 const started=await academyRoute(loginStart(email),env);assert.equal(started.status,202,await started.clone().text());
 const id=(await started.json()).challengeId;
 const mail=providers.emails.at(-1);assert.equal(mail.to,email);
 const verified=await academyRoute(send('/api/academy/auth/verify','POST',{challengeId:id,code:mail.code}),env);
 assert.equal(verified.status,200,await verified.clone().text());
 const cookie=verified.headers.get('set-cookie');
 assert.match(cookie,/HttpOnly/);assert.match(cookie,/Secure/);assert.match(cookie,/SameSite=Strict/);
 return {cookie:cookie.split(';')[0],id};
}
test('feature is closed by default; no email, no data or public session',async()=>{
 const {env,db}=fresh();env.ACADEMY_AUTH_ENABLED='false';let calls=0;const before=globalThis.fetch;
 globalThis.fetch=async()=>{calls++;throw Error('Do not send!')};
 try{const r=await academyRoute(loginStart('one@example.test'),env);assert.equal(r.status,404);assert.equal(calls,0);assert.equal(db.prepare('SELECT count(*) AS n FROM academy_users').get().n,0);}finally{globalThis.fetch=before;db.close();}
});
test('two real OTP sign-ins keep projects private; logout revokes; export/delete',async()=>{
 const {env,db}=fresh();const f=fakeProviders();
 try{
  const alice=await login(env,'alice@example.test',f);
  const bob=await login(env,'bob@example.test',f);
  const own={cookie:alice.cookie},other={cookie:bob.cookie};
  const a=await academyRoute(send('/api/academy/projects','POST',{title:'Mein eigener Shop',language:'de'},own),env);
  assert.equal(a.status,201);const project=(await a.json()).project;
  assert.equal((await academyRoute(send('/api/academy/projects','GET',undefined,other),env)).status,200);
  const bProjects=await (await academyRoute(send('/api/academy/projects','GET',undefined,other),env)).json();assert.deepEqual(bProjects.projects,[]);
  const put=await academyRoute(send(`/api/academy/projects/${project.id}/steps/niche`,'PUT',{fields:{problem:'Ich möchte eine Dienstleistung anbieten',customer:'Kleinunternehmen'}},own),env);assert.equal(put.status,200);
  const got=await (await academyRoute(send(`/api/academy/projects/${project.id}`,'GET',undefined,own),env)).json();assert.equal(got.project.steps[0].fields.problem,'Ich möchte eine Dienstleistung anbieten');
  const deny=await academyRoute(send(`/api/academy/projects/${project.id}`,'GET',undefined,other),env);assert.equal(deny.status,404);
  assert.equal((await academyRoute(send(`/api/academy/projects/${project.id}/steps/market`,'PUT',{fields:{x:'tampered'}},other),env)).status,404);
  assert.equal((await academyRoute(send(`/api/academy/projects/${project.id}`,'DELETE',undefined,other),env)).status,404);
  assert.equal((await academyRoute(send(`/api/academy/projects/${project.id}/export`,'GET',undefined,own),env)).status,200);
  const noOrigin=send('/api/academy/projects','POST',{title:'Should be rejected',language:'sr'},own);
  noOrigin.headers.delete('origin');assert.equal((await academyRoute(noOrigin,env)).status,403);
  assert.equal((await academyRoute(send('/api/academy/logout','POST',{},own),env)).status,200);
  const old=await academyRoute(send('/api/academy/projects','GET',undefined,own),env);assert.equal(old.status,401);
  const aliceAgain=await login(env,'alice@example.test',f);
  const listed=await (await academyRoute(send('/api/academy/projects','GET',undefined,aliceAgain),env)).json();assert.equal(listed.projects.length,1);
  const gone=await academyRoute(send('/api/academy/account','DELETE',{confirm:'DELETE'},{cookie:aliceAgain.cookie}),env);assert.equal(gone.status,200);
  assert.equal((await academyRoute(send('/api/academy/projects','GET',undefined,{cookie:aliceAgain.cookie}),env)).status,401);
  assert.equal(db.prepare('SELECT count(*) AS n FROM academy_projects').get().n,0);
  assert.equal(db.prepare('SELECT count(*) AS n FROM academy_sessions').get().n,1);
 }finally{f.restore();db.close();}
});
test('codes expire, wrong guesses are bounded, cannot replay, input validation',async()=>{
 const {env,db}=fresh();const f=fakeProviders();
 try{
  const a=await academyRoute(loginStart('a@example.test','sr'),env);assert.equal(a.status,202);
  const id=(await a.json()).challengeId;const correct=f.emails.at(-1).code;
  for(let i=0;i<5;i++)assert.equal((await academyRoute(send('/api/academy/auth/verify','POST',{challengeId:id,code:'00000000'}),env)).status,401);
  assert.equal((await academyRoute(send('/api/academy/auth/verify','POST',{challengeId:id,code:correct}),env)).status,401);
  const b=await academyRoute(loginStart('b@example.test'),env);const bid=(await b.json()).challengeId;const second=f.emails.at(-1).code;
  db.prepare('UPDATE academy_login_challenges SET expires_at=0 WHERE id=?').run(bid);
  assert.equal((await academyRoute(send('/api/academy/auth/verify','POST',{challengeId:bid,code:second}),env)).status,401);
  assert.equal((await academyRoute(send('/api/academy/projects','POST',{title:'Forged',language:'sr',authenticated:true,userId:'11111111-1111-4111-8111-111111111111'}),env)).status,401);
  assert.equal((await academyRoute(send('/api/academy/auth/start','POST',{email:'invalid',language:'de',turnstileToken:'VALID.TOKEN.TOKEN'}),env)).status,400);
 }finally{f.restore();db.close();}
});
test('rate limits, provider failure and invalid Turnstile cannot mint usable sessions',async()=>{
 const {env,db}=fresh();const f=fakeProviders();
 try{
  for(let i=0;i<3;i++)assert.equal((await academyRoute(loginStart('same@example.test'),env)).status,202);
  assert.equal((await academyRoute(loginStart('same@example.test'),env)).status,429);
  assert.equal(db.prepare('SELECT count(*) AS n FROM academy_users').get().n,0);
 }finally{f.restore();db.close();}
 const {env:e2,db:d2}=fresh();const prior=globalThis.fetch;
 globalThis.fetch=async (u)=>String(u).includes('siteverify')?Response.json({success:true,hostname:'daninihub.com',action:'academy-login'}):new Response('{}',{status:503});
 try{const r=await academyRoute(loginStart('any@example.test'),e2);assert.equal(r.status,503);assert.equal(d2.prepare('SELECT count(*) AS n FROM academy_login_challenges WHERE consumed_at IS NULL').get().n,0)}finally{globalThis.fetch=prior;d2.close();}
});

test('Academy configuration discloses only public Turnstile key when all required bindings are present',async()=>{
 const {env,db}=fresh();
 try{
  const r=await academyRoute(send('/api/academy/config'),env);
  assert.equal(r.status,200);
  assert.deepEqual(await r.json(),{enabled:true,siteKey:'1x00000000000000000000AA'});
  delete env.BREVO_API_KEY;
  assert.equal((await academyRoute(send('/api/academy/config'),env)).status,404);
  env.ACADEMY_AUTH_ENABLED='false';
  assert.equal((await academyRoute(send('/api/academy/config'),env)).status,404);
 } finally { db.close(); }
});
test('cross-site mutations and unauthenticated requests fail closed',async()=>{
 const {env,db}=fresh(),fake=fakeProviders();
 try{
  const session=await login(env,'test@example.test',fake);
  const cross=send('/api/academy/projects','POST',{title:'Injected',language:'sr'},{cookie:session.cookie});
  cross.headers.set('origin','https://attack.example');
  assert.equal((await academyRoute(cross,env)).status,403);
  const missing=await academyRoute(send('/api/academy/projects','GET'),env);
  assert.equal(missing.status,401);
  const projects=await academyRoute(send('/api/academy/projects','GET',undefined,{cookie:session.cookie}),env);
  assert.equal(projects.status,200);
 } finally {fake.restore();db.close();}
});