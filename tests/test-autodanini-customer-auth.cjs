'use strict';
/**
 * Integration contract tests with in-memory SQL adapter. NO Brevo calls,
 * no external DB, no production traffic. Verifies routes and owner isolation.
 */
const test=require('node:test');
const assert=require('node:assert/strict');
const express=require('express');
const {makeCustomerAuth}=require('../core/autodanini-customer-auth');

class MemorySql{
  constructor(){this.codes=new Map();this.users=new Map();this.sessions=new Map();this.cases=new Map();}
  async getConnection(){return this}
  async beginTransaction(){}
  async commit(){}
  async rollback(){}
  release(){}
  async query(sql,args){
    if(sql.includes('email_count'))return [[{email_count:0,ip_count:0}]];
    throw new Error('Unexpected query: '+sql);
  }
  async execute(sql,args=[]){
    if(sql.startsWith('CREATE TABLE'))return [{affectedRows:0}];
    if(sql.startsWith('INSERT INTO ad_login_codes')){
      const [id,email,code_hash,ip_hash]=args;
      this.codes.set(id,{id,email,code_hash,ip_hash,attempts:0,used_at:null,expires_at:new Date(Date.now()+600000)});
      return [{affectedRows:1}];
    }
    if(sql.includes('FROM ad_login_codes')){
      const code=this.codes.get(args[0]);
      return [[code&&!code.used_at&&code.expires_at>Date.now()?code:undefined].filter(Boolean)];
    }
    if(sql.startsWith('UPDATE ad_login_codes SET attempts')){
      this.codes.get(args[0]).attempts++;
      return [{affectedRows:1}];
    }
    if(sql.startsWith('UPDATE ad_login_codes SET used_at')){
      this.codes.get(args[0]).used_at=new Date();
      return [{affectedRows:1}];
    }
    if(sql.startsWith('INSERT INTO ad_customers')){
      const [id,email]=args;
      if(!this.users.has(email))this.users.set(email,{id,email});
      return [{affectedRows:1}];
    }
    if(sql.includes('FROM ad_customers WHERE email=')){
      return [[this.users.get(args[0])].filter(Boolean)];
    }
    if(sql.startsWith('INSERT INTO ad_sessions')){
      const [token_hash,customer_id]=args;
      this.sessions.set(token_hash,{customer_id});
      return [{affectedRows:1}];
    }
    if(sql.includes('FROM ad_sessions s JOIN ad_customers')){
      const session=this.sessions.get(args[0]);
      return [[...this.users.values()].find(u=>u.id===session?.customer_id)].filter(Boolean).length
        ? [[...this.users.values()].find(u=>u.id===session?.customer_id)]
        : [[]];
    }
    if(sql.startsWith('DELETE FROM ad_sessions')){
      const hit=this.sessions.delete(args[0]);
      return [{affectedRows:hit?1:0}];
    }
    if(sql.includes('COUNT(*) AS total FROM ad_private_cases')){
      return [[{total:[...this.cases.values()].filter(x=>x.customer_id===args[0]).length}]];
    }
    if(sql.startsWith('INSERT INTO ad_private_cases')){
      const [id,customer_id,type,vehicle,destination,budget,listing,notes]=args;
      this.cases.set(id,{id,customer_id,type,vehicle,destination,budget,listing,notes,status:'saved_not_submitted',createdAt:new Date().toISOString()});
      return [{affectedRows:1}];
    }
    if(sql.includes('FROM ad_private_cases WHERE customer_id=')){
      return [[...this.cases.values()].filter(x=>x.customer_id===args[0])];
    }
    if(sql.startsWith('DELETE FROM ad_private_cases')){
      const row=this.cases.get(args[0]);
      if(row?.customer_id!==args[1])return [{affectedRows:0}];
      this.cases.delete(args[0]);return [{affectedRows:1}];
    }
    throw new Error('Unexpected execute: '+sql.slice(0,110));
  }
}
test('customer OTP/session and private cases enforce real tenant ownership',async(t)=>{
  const pool=new MemorySql(),sent=new Map();
  const store={mode:'mysql',pool,async init(){}};
  const env={DANINI_PUBLIC_URL:'http://localhost',DANINI_AUTH_HMAC_SECRET:'testing-secure-random-auth-secret-00000001'};
  const api=makeCustomerAuth({store,env,sendEmail:async(email,code)=>{sent.set(email,code)}});
  const app=express();
  app.use('/api',api.router);
  const server=app.listen(0,'127.0.0.1');
  await new Promise(r=>server.once('listening',r));
  t.after(()=>new Promise(r=>server.close(r)));
  const root='http://127.0.0.1:'+server.address().port;
  const call=async(path,{method='GET',body,cookie,origin='http://localhost'}={})=>{
    const headers={'Accept':'application/json','Origin':origin};
    if(body!==undefined)headers['Content-Type']='application/json';
    if(cookie)headers.Cookie=cookie;
    const result=await fetch(root+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});
    return {status:result.status,data:await result.json(),cookie:result.headers.get('set-cookie')};
  };
  const login=async(email)=>{
    const start=await call('/api/auth/start',{method:'POST',body:{email}});
    assert.equal(start.status,202);
    assert.ok(sent.has(email));
    const verify=await call('/api/auth/verify',{method:'POST',body:{challengeId:start.data.challengeId,code:sent.get(email)}});
    assert.equal(verify.status,200);
    assert.ok(verify.cookie.includes('HttpOnly'));
    const reused=await call('/api/auth/verify',{method:'POST',body:{challengeId:start.data.challengeId,code:sent.get(email)}});
    assert.equal(reused.status,401);
    return verify.cookie.split(';')[0];
  };
  const noOrigin=await call('/api/auth/start',{method:'POST',body:{email:'first@example.com'},origin:'https://attacker.example'});
  assert.equal(noOrigin.status,403);
  const anon=await call('/api/my-cases');
  assert.equal(anon.status,401);
  const a=await login('first@example.com');
  const b=await login('second@example.com');
  const mine=await call('/api/auth/me',{cookie:a});
  assert.equal(mine.data.user.email,'first@example.com');
  const body={type:'sourcing',vehicle:'Mercedes C',destination:'Srbija',budget:5000,listing:'https://example.com/car',notes:'test case',consent:true};
  const rejected=await call('/api/my-cases',{method:'POST',body,cookie:a,origin:'https://attacker.example'});
  assert.equal(rejected.status,403);
  const created=await call('/api/my-cases',{method:'POST',body,cookie:a});
  assert.equal(created.status,201);
  assert.match(created.data.id,/^[a-f0-9]{32}$/);
  const otherList=await call('/api/my-cases',{cookie:b});
  assert.equal(otherList.status,200);
  assert.equal(otherList.data.cases.length,0,'User B must not read A records');
  const stolen=await call('/api/my-cases/'+created.data.id,{method:'DELETE',cookie:b});
  assert.equal(stolen.status,404,'User B must not delete A records');
  const own=await call('/api/my-cases',{cookie:a});
  assert.equal(own.data.cases.length,1);
  const blocked=await call('/api/case-submissions',{method:'POST',body:{caseId:created.data.id,submitConsent:true},cookie:a});
  assert.equal(blocked.status,503,'Admin handover must stay off');
  const logout=await call('/api/auth/logout',{method:'POST',body:{},cookie:a});
  assert.equal(logout.status,200);
  const after=await call('/api/my-cases',{cookie:a});
  assert.equal(after.status,401,'Logged-out session must be invalid');
});
