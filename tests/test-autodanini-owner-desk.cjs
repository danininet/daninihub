'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const express=require('express');
const {makeOwnerDesk}=require('../core/autodanini-owner-desk');
const TOTP='GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';
const owner={id:'1'.repeat(32),email:'owner@example.net'};
const buyer={id:'2'.repeat(32),email:'buyer@example.net'};
const OWNER_SESSION='a'.repeat(64),BUYER_SESSION='b'.repeat(64);
const env={
  NODE_ENV:'production',AUTODANINI_PREVIEW_ENABLED:'true',
  AUTODANINI_AUTH_ENABLED:'true',AUTODANINI_ADMIN_ENABLED:'true',
  AUTODANINI_SUBMISSIONS_ENABLED:'true',
  DANINI_AUTH_HMAC_SECRET:'testing-only-secret-for-owner-session-123',
  AUTODANINI_OWNER_EMAIL:'owner@example.net',
  AUTODANINI_OWNER_TOTP_SECRET:TOTP,
  DANINI_PUBLIC_URL:'https://daninihub.com'
};
class FakeSql{
  constructor(){
    this.mfa=null;this.elevations=new Map();this.submissions=new Map();this.replies=new Map();this.audit=[];
    this.saved=new Map([['c'.repeat(32),{id:'c'.repeat(32),customer_id:buyer.id,
      type:'sourcing',vehicle:'Mercedes C280',destination:'Srbija',
      budget:5900,listing:'https://example.net/offer',notes:'Bitte kontrollieren'}]]);
  }
  async getConnection(){return this}
  async beginTransaction(){}
  async commit(){}
  async rollback(){}
  release(){}
  async execute(sql,a=[]){
    if(sql.startsWith('CREATE TABLE IF NOT EXISTS'))return [{affectedRows:1}];
    if(sql.startsWith('INSERT IGNORE INTO ad_admin_mfa_state')){
      if(!this.mfa)this.mfa={owner_id:a[0],last_step:-1,attempt_count:0,window_at:new Date(0)};
      return [{affectedRows:1}];
    }
    if(sql.includes('FROM ad_admin_mfa_state WHERE owner_id='))return [this.mfa?[this.mfa]:[]];
    if(sql.startsWith('UPDATE ad_admin_mfa_state SET attempt_count=')){
      this.mfa.attempt_count=a[0];this.mfa.window_at=a[1];return [{affectedRows:1}];
    }
    if(sql.startsWith('UPDATE ad_admin_mfa_state\n')||sql.includes('SET last_step=?,attempt_count=0')){
      this.mfa.last_step=a[0];this.mfa.attempt_count=0;this.mfa.window_at=a[1];return [{affectedRows:1}];
    }
    if(sql.startsWith('INSERT INTO ad_admin_elevations')){
      this.elevations.set(a[0],{customer_id:a[1],login_hash:a[2]});
      return [{affectedRows:1}];
    }
    if(sql.startsWith('DELETE FROM ad_admin_elevations'))
      return [{affectedRows:this.elevations.delete(a[0])?1:0}];
    if(sql.includes('FROM ad_admin_elevations')){
      const v=this.elevations.get(a[0]);return [v?.customer_id===a[1]&&v.login_hash===a[2]?[{token_hash:a[0]}]:[]];
    }
    if(sql.includes('SELECT id FROM ad_private_cases')){
      const x=this.saved.get(a[0]);return [x?.customer_id===a[1]?[{id:x.id}]:[]];
    }
    if(sql.startsWith('INSERT IGNORE INTO ad_submitted_requests')){
      const x=this.saved.get(a[1]);if(x?.customer_id===a[2]&&!this.submissions.has(a[0]))
        this.submissions.set(a[0],{...x,id:a[0],source_case_id:a[1],status:'new',quote_eur:null,admin_note:'',
          created_at:new Date(),updated_at:new Date()});
      return [{affectedRows:1}];
    }
    if(sql.startsWith('SELECT id FROM ad_submitted_requests WHERE id=? LIMIT 1')){
      return [this.submissions.has(a[0])?[{id:a[0]}]:[]];
    }
    if(sql.startsWith('INSERT INTO ad_buyer_replies')){
      this.replies.set(a[0],{id:a[0],request_id:a[1],author_id:a[2],message:a[3],createdAt:new Date()});
      return [{affectedRows:1}];
    }
    if(sql.includes('FROM ad_buyer_replies r')){
      const request=this.submissions.get(a[0]);
      if(request?.customer_id!==a[1]||request?.source_case_id!==a[2])return [[]];
      return [[...this.replies.values()].filter(r=>r.request_id===a[0])
        .map(r=>({id:r.id,message:r.message,createdAt:r.createdAt}))];
    }
    if(sql.includes('FROM ad_buyer_replies') && sql.includes('WHERE request_id=?')){
      return [[...this.replies.values()].filter(r=>r.request_id===a[0])
        .map(r=>({id:r.id,message:r.message,createdAt:r.createdAt}))];
    }
    if(sql.includes('SELECT id,status FROM ad_submitted_requests WHERE id=')){
      const x=this.submissions.get(a[0]);return [x?.customer_id===a[1]?[{id:x.id,status:x.status}]:[]];
    }
    if(sql.startsWith('SELECT id,status,created_at AS createdAt')){
      const x=this.submissions.get(a[0]);return [x?.customer_id===a[1]?[{
        id:x.id,status:x.status,createdAt:x.created_at,updatedAt:x.updated_at}]:[]];
    }
    if(sql.includes('FROM ad_submitted_requests s JOIN ad_customers c')){
      return [[...this.submissions.values()].map(x=>({
        id:x.id,userId:x.customer_id,ownerEmail:x.customer_id===buyer.id?buyer.email:owner.email,
        ownerName:'',vehicle:x.vehicle,type:x.type,destination:x.destination,
        budget:x.budget,listing:x.listing,notes:x.notes,status:x.status,quoteEUR:x.quote_eur,
        adminNote:x.admin_note,createdAt:x.created_at,updatedAt:x.updated_at
      }))];
    }
    if(sql.includes('SELECT status,quote_eur FROM ad_submitted_requests')){
      const x=this.submissions.get(a[0]);return [x?[{status:x.status,quote_eur:x.quote_eur}]:[]];
    }
    if(sql.startsWith('UPDATE ad_submitted_requests SET status=')){
      const x=this.submissions.get(a[3]);x.status=a[0];x.quote_eur=a[1];x.admin_note=a[2];return [{affectedRows:1}];
    }
    if(sql.startsWith('INSERT INTO ad_admin_audit')){
      this.audit.push(a);return [{affectedRows:1}];
    }
    throw new Error('Unexpected SQL: '+sql.slice(0,160));
  }
}
test('owner desk is locked without private owner identity and TOTP',()=>{
  const store={mode:'mysql',pool:new FakeSql(),async init(){}};
  const customerAuth={customer:async()=>owner};
  assert.throws(()=>makeOwnerDesk({store,customerAuth,env:{...env,AUTODANINI_ADMIN_ENABLED:'false'}}),
    /ADMIN_MFA_CONFIGURATION_REQUIRED/);
  assert.throws(()=>makeOwnerDesk({store,customerAuth,env:{...env,AUTODANINI_OWNER_EMAIL:'kontakt@daninihub.com'}}),
    /ADMIN_MFA_CONFIGURATION_REQUIRED/);
});
test('owner MFA, buyer consent, tenant isolation, inbox edit and audit',async(t)=>{
  const db=new FakeSql(),store={mode:'mysql',pool:db,async init(){}};
  const customerAuth={customer:async req=>{
    const cookie=req.headers.cookie||'';
    if(cookie.includes('__Host-autodanini_session='+OWNER_SESSION))return owner;
    if(cookie.includes('__Host-autodanini_session='+BUYER_SESSION))return buyer;
    return null;
  }};
  const desk=makeOwnerDesk({store,customerAuth,env,clock:()=>59000});
  const app=express();app.use('/api',desk.router);
  const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
  t.after(()=>new Promise(r=>server.close(r)));
  const url='http://127.0.0.1:'+server.address().port;
  async function call(path,{method='GET',cookie,origin='https://daninihub.com',body}={}){
    const r=await fetch(url+path,{method,
      headers:{Origin:origin,...(cookie?{Cookie:cookie}:{}),
        ...(body!==undefined?{'Content-Type':'application/json'}:{})},
      ...(body!==undefined?{body:JSON.stringify(body)}:{})});
    return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')};
  }
  const ownCookie='__Host-autodanini_session='+OWNER_SESSION;
  const buyerCookie='__Host-autodanini_session='+BUYER_SESSION;
  assert.equal((await call('/api/admin/requests')).status,403);
  assert.equal((await call('/api/admin/requests',{cookie:ownCookie})).status,403);
  assert.equal((await call('/api/admin/elevate',{method:'POST',cookie:buyerCookie,body:{code:'287082'}})).status,403);
  assert.equal((await call('/api/admin/elevate',{method:'POST',cookie:ownCookie,origin:'https://attacker.test',body:{code:'287082'}})).status,403);
  assert.equal((await call('/api/admin/elevate',{method:'POST',cookie:ownCookie,body:{code:'111111'}})).status,401);
  const elevated=await call('/api/admin/elevate',{method:'POST',cookie:ownCookie,body:{code:'287082'}});
  assert.equal(elevated.status,200);
  const adminToken=elevated.cookie.split(';')[0],adminCookie=ownCookie+'; '+adminToken;
  assert.ok(elevated.cookie.includes('SameSite=Strict'));
  assert.equal((await call('/api/admin/elevate',{method:'POST',cookie:ownCookie,body:{code:'287082'}})).status,401,
    'TOTP step cannot be replayed');
  assert.equal((await call('/api/admin/requests',{cookie:adminToken+'; '+buyerCookie})).status,403,
    'MFA admin cookie cannot be paired with a different buyer');
  assert.equal((await call('/api/admin/requests',{cookie:adminCookie})).status,200);
  // Private drafts are not automatically in the owner's inbox.
  assert.equal((await call('/api/admin/requests',{cookie:adminCookie})).data.requests.length,0);
  const sourceId='c'.repeat(32);
  assert.equal((await call('/api/case-submissions',{method:'POST',cookie:ownCookie,
    body:{caseId:sourceId,submitConsent:true}})).status,404,
    'owner is not the buyer who saved this case');
  assert.equal((await call('/api/case-submissions',{method:'POST',cookie:buyerCookie,
    body:{caseId:sourceId,submitConsent:false}})).status,400);
  const submitted=await call('/api/case-submissions',{method:'POST',cookie:buyerCookie,
    body:{caseId:sourceId,submitConsent:true}});
  assert.equal(submitted.status,200);assert.equal(submitted.data.submitted,true);
  assert.equal((await call('/api/case-submissions',{method:'POST',cookie:buyerCookie,
    body:{caseId:sourceId,submitConsent:true}})).data.submissionId,submitted.data.submissionId);
  assert.equal(db.submissions.size,1,'double click must not create duplicate request');
  const inbox=await call('/api/admin/requests',{cookie:adminCookie});
  assert.equal(inbox.status,200);assert.equal(inbox.data.requests.length,1);
  assert.equal(inbox.data.requests[0].ownerEmail,buyer.email);
  assert.equal((await call('/api/admin/requests/'+submitted.data.submissionId,{
    method:'PUT',cookie:buyerCookie,body:{status:'reviewing',expectedStatus:'new',quoteEUR:50,adminNote:'Needs check'}
  })).status,403);
  assert.equal((await call('/api/admin/requests/'+submitted.data.submissionId,{
    method:'PUT',cookie:adminCookie,origin:'https://attacker.test',
    body:{status:'reviewing',expectedStatus:'new',quoteEUR:50,adminNote:'Needs check'}
  })).status,403);
  const edited=await call('/api/admin/requests/'+submitted.data.submissionId,{
    method:'PUT',cookie:adminCookie,
    body:{status:'reviewing',expectedStatus:'new',quoteEUR:50,adminNote:'Needs check'}
  });
  assert.equal(edited.status,200);
  assert.equal(edited.data.paymentCaptured,false);
  assert.equal(db.audit.length,1,'status/price changes must create an audit receipt');
  const replyPath='/api/admin/requests/'+submitted.data.submissionId+'/replies';
  assert.equal((await call(replyPath,{method:'POST',cookie:buyerCookie,
    body:{message:'Buyer cannot answer as owner.',confirmSend:true}})).status,403);
  assert.equal((await call(replyPath,{method:'POST',cookie:adminCookie,
    origin:'https://attacker.test',body:{message:'Wrong origin',confirmSend:true}})).status,403);
  assert.equal((await call(replyPath,{method:'POST',cookie:adminCookie,
    body:{message:'Draft only',confirmSend:false}})).status,400);
  assert.equal((await call(replyPath,{method:'POST',cookie:adminCookie,
    body:{message:' ',confirmSend:true}})).status,400);
  const buyerAnswer='Hvala na upitu. Proverićemo dokumenta vozila i javiti sledeće korake.';
  const reply=await call(replyPath,{method:'POST',cookie:adminCookie,
    body:{message:buyerAnswer,confirmSend:true}});
  assert.equal(reply.status,201);
  assert.equal(reply.data.sentToBuyerAccount,true);
  assert.equal(reply.data.emailSent,false);
  assert.equal(reply.data.paymentCaptured,false);
  assert.equal(db.replies.size,1);
  const history=await call(replyPath,{cookie:adminCookie});
  assert.equal(history.status,200);
  assert.equal(history.data.replies[0].message,buyerAnswer);
  assert.equal((await call(replyPath,{cookie:buyerCookie})).status,403);
  assert.equal((await call('/api/my-submission/'+sourceId,{cookie:ownCookie})).data.submitted,false);
  const buyerView=await call('/api/my-submission/'+sourceId,{cookie:buyerCookie});
  assert.equal(buyerView.status,200);
  assert.equal(buyerView.data.replies[0].message,buyerAnswer);
  assert.equal((await call('/api/admin/requests',{cookie:adminCookie})).data.requests[0].adminNote,'Needs check',
    'private admin note must remain separate from customer-visible reply');
  assert.equal((await call('/api/admin/requests/'+submitted.data.submissionId,{
    method:'PUT',cookie:adminCookie,
    body:{status:'closed',expectedStatus:'new',quoteEUR:30,adminNote:'outdated'}
  })).status,409);
  const state=await call('/api/my-submission/'+sourceId,{cookie:buyerCookie});
  assert.equal(state.data.status,'reviewing');
  const logoff=await call('/api/admin/logout',{method:'POST',cookie:adminCookie,body:{}});
  assert.equal(logoff.status,200);
  assert.equal((await call('/api/admin/requests',{cookie:adminCookie})).status,403);
});
