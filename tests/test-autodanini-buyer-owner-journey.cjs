'use strict';
/**
 * HTTP journey: Brevo OTP simulation -> private draft -> explicit submission
 * -> independent owner TOTP -> inbox reply -> buyer-only reply visibility.
 * Fake SQL and captured mail only: NO live Hostinger, Brevo or payments.
 */
const test=require('node:test');
const assert=require('node:assert/strict');
const express=require('express');
const {makeCustomerAuth}=require('../core/autodanini-customer-auth');
const {makeOwnerDesk}=require('../core/autodanini-owner-desk');

const env={
 NODE_ENV:'production',AUTODANINI_PREVIEW_ENABLED:'true',
 AUTODANINI_AUTH_ENABLED:'true',AUTODANINI_ADMIN_ENABLED:'true',
 AUTODANINI_SUBMISSIONS_ENABLED:'true',
 DANINI_PUBLIC_URL:'https://daninihub.com',
 DANINI_AUTH_HMAC_SECRET:'standalone-owner-journey-test-secret-123456',
 AUTODANINI_OWNER_EMAIL:'owner@example.net',
 AUTODANINI_OWNER_TOTP_SECRET:'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ'
};
class Sql {
 constructor(){
  this.codes=new Map();this.users=new Map();this.sessions=new Map();
  this.cases=new Map();this.submissions=new Map();this.replies=new Map();
  this.elevations=new Map();this.mfa=null;
 }
 async getConnection(){return this}
 async beginTransaction(){}
 async commit(){}
 async rollback(){}
 release(){}
 async query(sql){
  if(sql.includes('email_count'))return [[{email_count:0,ip_count:0}]];
  throw Error('Unknown SQL query: '+sql);
 }
 async execute(sql,a=[]){
  if(sql.startsWith('CREATE TABLE IF NOT EXISTS'))return [{affectedRows:0}];
  if(sql.startsWith('INSERT INTO ad_login_codes')){
   this.codes.set(a[0],{id:a[0],email:a[1],code_hash:a[2],attempts:0,used_at:null});
   return [{affectedRows:1}];
  }
  if(sql.includes('FROM ad_login_codes WHERE id=')){
   const x=this.codes.get(a[0]);return [x?[x]:[]];
  }
  if(sql.startsWith('UPDATE ad_login_codes SET attempts=')){
   this.codes.get(a[0]).attempts++;return [{affectedRows:1}];
  }
  if(sql.startsWith('UPDATE ad_login_codes SET used_at=')){
   this.codes.get(a[0]).used_at=new Date();return [{affectedRows:1}];
  }
  if(sql.startsWith('INSERT INTO ad_customers')){
   if(!this.users.has(a[1]))this.users.set(a[1],{id:a[0],email:a[1]});
   return [{affectedRows:1}];
  }
  if(sql.includes('FROM ad_customers WHERE email=')){
   return [[this.users.get(a[0])].filter(Boolean)];
  }
  if(sql.startsWith('INSERT INTO ad_sessions')){
   this.sessions.set(a[0],{customer_id:a[1]});return [{affectedRows:1}];
  }
  if(sql.includes('FROM ad_sessions s JOIN ad_customers c')){
   const x=this.sessions.get(a[0]);
   const user=[...this.users.values()].find(z=>z.id===x?.customer_id);
   return [user?[user]:[]];
  }
  if(sql.startsWith('DELETE FROM ad_sessions')){
   this.sessions.delete(a[0]);return [{affectedRows:1}];
  }
  if(sql.includes('COUNT(*) AS total FROM ad_private_cases')){
   return [[{total:[...this.cases.values()].filter(z=>z.customer_id===a[0]).length}]];
  }
  if(sql.startsWith('INSERT INTO ad_private_cases')){
   this.cases.set(a[0],{id:a[0],customer_id:a[1],type:a[2],vehicle:a[3],
    destination:a[4],budget:a[5],listing:a[6],notes:a[7],status:'saved_not_submitted'});
   return [{affectedRows:1}];
  }
  if(sql.includes('FROM ad_private_cases WHERE customer_id=')){
   return [[...this.cases.values()].filter(z=>z.customer_id===a[0])];
  }
  if(sql.includes('SELECT id FROM ad_private_cases WHERE id=?')){
   const z=this.cases.get(a[0]);return [z?.customer_id===a[1]?[{id:z.id}]:[]];
  }
  if(sql.startsWith('INSERT IGNORE INTO ad_submitted_requests')){
   const x=this.cases.get(a[1]);
   if(x?.customer_id===a[2]&&!this.submissions.has(a[0]))
    this.submissions.set(a[0],{...x,id:a[0],source_case_id:a[1],status:'new',
     quote_eur:null,admin_note:'',created_at:new Date(),updated_at:new Date()});
   return [{affectedRows:1}];
  }
  if(sql.startsWith('SELECT id FROM ad_submitted_requests WHERE customer_id=? AND source_case_id=? LIMIT 1')){
   const x=[...this.submissions.values()].find(z=>z.customer_id===a[0]&&z.source_case_id===a[1]);
   return [x?[{id:x.id}]:[]];
  }
  if(sql.includes('SELECT id,status FROM ad_submitted_requests WHERE id=')){
   const x=this.submissions.get(a[0]);
   return [x?.customer_id===a[1]?[{id:x.id,status:x.status}]:[]];
  }
  if(sql.startsWith('SELECT id,status,created_at AS createdAt')){
   const x=this.submissions.get(a[0]);
   return [x?.customer_id===a[1]?[{id:x.id,status:x.status,
    createdAt:x.created_at,updatedAt:x.updated_at}]:[]];
  }
  if(sql.startsWith('SELECT id FROM ad_submitted_requests WHERE id=? LIMIT 1')){
   return [this.submissions.has(a[0])?[{id:a[0]}]:[]];
  }
  if(sql.includes('FROM ad_submitted_requests s JOIN ad_customers c')){
   return [[...this.submissions.values()].map(x=>({
    id:x.id,userId:x.customer_id,
    ownerEmail:[...this.users.values()].find(z=>z.id===x.customer_id)?.email||'',
    ownerName:'',vehicle:x.vehicle,type:x.type,destination:x.destination,
    budget:x.budget,listing:x.listing,notes:x.notes,status:x.status,
    quoteEUR:x.quote_eur,adminNote:x.admin_note,
    createdAt:x.created_at,updatedAt:x.updated_at
   }))];
  }
  if(sql.startsWith('INSERT IGNORE INTO ad_admin_mfa_state')){
   this.mfa??={owner_id:a[0],last_step:-1,attempt_count:0,window_at:new Date(0)};
   return [{affectedRows:1}];
  }
  if(sql.includes('FROM ad_admin_mfa_state WHERE owner_id=')){
   return [this.mfa?[this.mfa]:[]];
  }
  if(sql.includes('SET last_step=?,attempt_count=0')){
   this.mfa.last_step=a[0];this.mfa.attempt_count=0;this.mfa.window_at=a[1];
   return [{affectedRows:1}];
  }
  if(sql.includes('SET attempt_count=?,window_at=?')){
   this.mfa.attempt_count=a[0];this.mfa.window_at=a[1];return [{affectedRows:1}];
  }
  if(sql.startsWith('INSERT INTO ad_admin_elevations')){
   this.elevations.set(a[0],{customer_id:a[1],login_hash:a[2]});
   return [{affectedRows:1}];
  }
  if(sql.includes('FROM ad_admin_elevations')){
   const x=this.elevations.get(a[0]);
   return [x?.customer_id===a[1]&&x?.login_hash===a[2]?[{token_hash:a[0]}]:[]];
  }
  if(sql.startsWith('DELETE FROM ad_admin_elevations')){
   this.elevations.delete(a[0]);return [{affectedRows:1}];
  }
  if(sql.startsWith('INSERT INTO ad_buyer_replies')){
   this.replies.set(a[0],{id:a[0],request_id:a[1],author_id:a[2],message:a[3],
    createdAt:new Date()});
   return [{affectedRows:1}];
  }
  if(sql.includes('FROM ad_buyer_replies r')){
   const request=this.submissions.get(a[0]);
   if(request?.customer_id!==a[1]||request?.source_case_id!==a[2])return [[]];
   return [[...this.replies.values()].filter(x=>x.request_id===a[0])
    .map(x=>({id:x.id,message:x.message,createdAt:x.createdAt}))];
  }
  if(sql.includes('FROM ad_buyer_replies')&&sql.includes('WHERE request_id=?')){
   return [[...this.replies.values()].filter(x=>x.request_id===a[0])
    .map(x=>({id:x.id,message:x.message,createdAt:x.createdAt}))];
  }
  throw Error('Unimplemented test SQL: '+sql.slice(0,180));
 }
}
test('full HTTP journey keeps drafts private and replies buyer-scoped',async t=>{
 const sql=new Sql(),sent=new Map();
 const store={mode:'mysql',pool:sql,async init(){}};
 const auth=makeCustomerAuth({store,env,sendEmail:async(email,code)=>{sent.set(email,code)}});
 const desk=makeOwnerDesk({store,customerAuth:auth,env,clock:()=>59000});
 const app=express();app.use('/api',desk.router);app.use('/api',auth.router);
 const server=app.listen(0,'127.0.0.1');
 await new Promise(resolve=>server.once('listening',resolve));
 t.after(()=>new Promise(resolve=>server.close(resolve)));
 const root='http://127.0.0.1:'+server.address().port;
 async function call(path,{method='GET',cookie,body,origin=env.DANINI_PUBLIC_URL}={}){
  const response=await fetch(root+path,{
   method,headers:{Origin:origin,...(cookie?{Cookie:cookie}:{}),
    ...(body?{'Content-Type':'application/json'}:{})},
   ...(body?{body:JSON.stringify(body)}:{})
  });
  return {status:response.status,data:await response.json(),
   cookie:response.headers.get('set-cookie')};
 }
 async function login(email){
  const start=await call('/api/auth/start',{method:'POST',body:{email}});
  assert.equal(start.status,202);
  const verify=await call('/api/auth/verify',{method:'POST',
   body:{challengeId:start.data.challengeId,code:sent.get(email)}});
  assert.equal(verify.status,200);
  return verify.cookie.split(';')[0];
 }
 const buyerCookie=await login('buyer@example.net');
 const unrelatedCookie=await login('other@example.net');
 const ownerCookie=await login('owner@example.net');
 const saved=await call('/api/my-cases',{method:'POST',cookie:buyerCookie,
  body:{type:'inspection',vehicle:'Mercedes C280 2007',destination:'Srbija',
   budget:5600,listing:'https://example.net/vehicle',notes:'Proveriti servisnu istoriju',consent:true}});
 assert.equal(saved.status,201);
 const caseId=saved.data.id;
 assert.equal((await call('/api/my-cases',{cookie:unrelatedCookie})).data.cases.length,0);
 assert.equal((await call('/api/admin/requests',{cookie:ownerCookie})).status,403);
 assert.equal(sql.submissions.size,0);
 assert.equal((await call('/api/case-submissions',{method:'POST',cookie:buyerCookie,
  body:{caseId,submitConsent:false}})).status,400);
 assert.equal(sql.submissions.size,0);
 assert.equal((await call('/api/case-submissions',{method:'POST',cookie:unrelatedCookie,
  body:{caseId,submitConsent:true}})).status,404);
 const submitted=await call('/api/case-submissions',{method:'POST',cookie:buyerCookie,
  body:{caseId,submitConsent:true}});
 assert.equal(submitted.status,200);
 assert.equal(sql.submissions.size,1);
 const blockedDelete=await call('/api/my-cases/'+caseId,{method:'DELETE',cookie:buyerCookie});
 assert.equal(blockedDelete.status,409,'submitted draft must not be deleted while replies depend on it');
 assert.equal(sql.cases.has(caseId),true);
 assert.equal((await call('/api/admin/elevate',{method:'POST',cookie:unrelatedCookie,
  body:{code:'287082'}})).status,403);
 const elevated=await call('/api/admin/elevate',{method:'POST',cookie:ownerCookie,
  body:{code:'287082'}});
 assert.equal(elevated.status,200);
 const adminCookie=ownerCookie+'; '+elevated.cookie.split(';')[0];
 const inbox=await call('/api/admin/requests',{cookie:adminCookie});
 assert.equal(inbox.status,200);
 assert.equal(inbox.data.requests.length,1);
 assert.equal(inbox.data.requests[0].vehicle,'Mercedes C280 2007');
 const endpoint='/api/admin/requests/'+submitted.data.submissionId+'/replies';
 const msg='Primili smo vaš zahtev. Pošaljite dostupnu servisnu dokumentaciju.';
 const reply=await call(endpoint,{method:'POST',cookie:adminCookie,
  body:{message:msg,confirmSend:true}});
 assert.equal(reply.status,201);
 assert.equal(reply.data.emailSent,false);
 assert.equal(reply.data.sentToBuyerAccount,true);
 const myAnswer=await call('/api/my-submission/'+caseId,{cookie:buyerCookie});
 assert.equal(myAnswer.status,200);
 assert.equal(myAnswer.data.replies[0].message,msg);
 assert.equal((await call('/api/my-submission/'+caseId,{cookie:unrelatedCookie})).data.submitted,false);
 assert.equal((await call(endpoint,{cookie:unrelatedCookie})).status,403);
});
