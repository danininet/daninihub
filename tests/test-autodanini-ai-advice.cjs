'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const express=require('express');
const {
  makeAIAdvice,sanitizeQuestion,quotaBuckets,aiEnabled,DAILY_CAP,MONTHLY_CAP,MAX_OUTPUT_TOKENS
}=require('../core/autodanini-ai-advice');

class QuotaPool{
  constructor(){this.counts=new Map();this.lock=Promise.resolve();this.isStarted=false}
  async execute(sql){
    assert.match(sql,/CREATE TABLE IF NOT EXISTS ad_ai_global_quotas/);
    return [{affectedRows:0}];
  }
  async getConnection(){
    const pool=this;
    let unlock=()=>{},transaction=null;
    return {
      async beginTransaction(){
        const previous=pool.lock;
        pool.lock=new Promise(r=>{unlock=r});
        await previous;
        transaction=new Map(pool.counts);
      },
      async execute(sql,args=[]){
        if(sql.startsWith('INSERT IGNORE')){
          if(!transaction.has(args[0]))transaction.set(args[0],0);
          return [{affectedRows:1}];
        }
        if(sql.startsWith('SELECT bucket,used_count')){
          return [[...transaction.entries()].filter(([k])=>args.includes(k)).sort(([a],[b])=>a.localeCompare(b))
            .map(([bucket,used_count])=>({bucket,used_count}))];
        }
        if(sql.startsWith('UPDATE ad_ai_global_quotas')){
          transaction.set(args[0],transaction.get(args[0])+1);
          return [{affectedRows:1}];
        }
        throw new Error('Unexpected quota SQL: '+sql);
      },
      async commit(){pool.counts=transaction;unlock();transaction=null},
      async rollback(){if(transaction){transaction=null;unlock()}},
      release(){}
    };
  }
}
const prod={
  NODE_ENV:'production',AUTODANINI_PREVIEW_ENABLED:'true',
  AUTODANINI_AI_ENABLED:'true',OPENAI_API_KEY:'fake-automated-test-key-00000'
};
const store=(db)=>({mode:'mysql',pool:db,async init(){}});
const valid={
  consent:true,mode:'buyer',lang:'de',
  question:'Mercedes-Benz C200 2014 with a partial service history. Which documents should I request before paying a deposit?'
};

test('AI opt-in requires preview, production and private API key',()=>{
  assert.equal(aiEnabled(prod),true);
  for(const key of ['AUTODANINI_PREVIEW_ENABLED','AUTODANINI_AI_ENABLED','OPENAI_API_KEY']){
    assert.equal(aiEnabled({...prod,[key]:''}),false);
  }
  assert.equal(aiEnabled({...prod,NODE_ENV:'development'}),false);
  assert.throws(()=>makeAIAdvice({store:store(new QuotaPool()),env:{...prod,AUTODANINI_AI_MODEL:'gpt-4.1'}}),/AI_MODEL_NOT_APPROVED/);
});
test('AI input requires consent and refuses common personal identifiers',()=>{
  assert.equal(sanitizeQuestion(valid)?.mode,'buyer');
  assert.equal(sanitizeQuestion({...valid,consent:false}),null);
  assert.equal(sanitizeQuestion({...valid,mode:'hacker'}),null);
  assert.equal(sanitizeQuestion({...valid,question:'a'.repeat(1001)}),null);
  for(const input of [
    'Please send your advice to user@example.com, I need car inspection before I pay.',
    'My private VIN is WDBUF56X77B123456, please check the Mercedes before the deposit.',
    'Here is my phone +49 1573 0916621. Please send the car details and contact me.'
  ]) assert.equal(sanitizeQuestion({...valid,question:input}),null);
});
test('quota date boundaries use UTC day and month',()=>{
  assert.deepEqual(quotaBuckets(new Date('2026-10-22T23:59:59Z')),{day:'d20261022',month:'m202610'});
  assert.deepEqual(quotaBuckets(new Date('2026-11-01T00:00:00Z')),{day:'d20261101',month:'m202611'});
});
test('daily quota is atomic under parallel callers',async()=>{
  const db=new QuotaPool(),engine=makeAIAdvice({store:store(db),env:prod});
  const values=await Promise.all(Array.from({length:DAILY_CAP+15},()=>engine.reserve()));
  assert.equal(values.filter(Boolean).length,DAILY_CAP);
  assert.equal(values.filter(x=>!x).length,15);
  assert.equal(db.counts.get('d'+new Date().toISOString().slice(0,10).replace(/-/g,'')),DAILY_CAP);
});
test('global monthly quota limits after 20 full days even when each day has room',async()=>{
  const db=new QuotaPool();let date=new Date('2026-10-01T12:00:00Z');
  const engine=makeAIAdvice({store:store(db),env:prod,clock:()=>date});
  for(let day=1;day<=20;day++){
    date=new Date('2026-10-'+String(day).padStart(2,'0')+'T12:00:00Z');
    const reservations=await Promise.all(Array.from({length:DAILY_CAP},()=>engine.reserve()));
    assert.equal(reservations.every(Boolean),true);
  }
  assert.equal(db.counts.get('m202610'),MONTHLY_CAP);
  date=new Date('2026-10-21T12:00:00Z');
  assert.equal(await engine.reserve(),false);
});
test('AI request passes fixed output cap and disables provider-side storage',async()=>{
  const calls=[];
  const engine=makeAIAdvice({
    store:store(new QuotaPool()),env:prod,
    clientFactory:()=>({responses:{async create(data){
      calls.push(data);return {output_text:'Please verify documents and book an independent inspection.'};
    }}})
  });
  const answer=await engine.generate(sanitizeQuestion(valid));
  assert.match(answer,/independent inspection/);
  assert.equal(calls[0].store,false);
  assert.equal(calls[0].max_output_tokens,MAX_OUTPUT_TOKENS);
  assert.equal(calls[0].model,'gpt-4.1-mini');
  assert.equal(calls[0].input,valid.question);
});
test('AI HTTP endpoint stays disabled when no activation is approved',async(t)=>{
  const app=express();
  const engine=makeAIAdvice({store:store(new QuotaPool()),env:{...prod,AUTODANINI_AI_ENABLED:'false'}});
  app.use('/api',engine.router);
  const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
  t.after(()=>new Promise(r=>server.close(r)));
  const response=await fetch('http://127.0.0.1:'+server.address().port+'/api/advice',{
    method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(valid)
  });
  assert.equal(response.status,503);
  assert.equal((await response.json()).error,'AI_NOT_ENABLED');
});

test('HTTP AI endpoint rejects foreign origins and enforces DB quota before billing',async(t)=>{
  const db=new QuotaPool();let billed=0;
  const env={...prod,DANINI_PUBLIC_URL:'https://daninihub.com'};
  const engine=makeAIAdvice({
    store:store(db),env,
    clock:()=>new Date('2026-10-22T10:00:00Z'),
    clientFactory:()=>({responses:{async create(){billed++;return {output_text:'Verify documentation and arrange independent inspection.'}}}})
  });
  const app=express();app.use('/api',engine.router);
  const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
  t.after(()=>new Promise(r=>server.close(r)));
  const url='http://127.0.0.1:'+server.address().port+'/api/advice';
  async function post(origin,input=valid){
    const r=await fetch(url,{method:'POST',
      headers:{'Origin':origin,'Content-Type':'application/json'},
      body:JSON.stringify(input)});
    return {status:r.status,data:await r.json()};
  }
  assert.equal((await post('https://attacker.example')).status,403);
  assert.equal(billed,0);
  assert.equal((await post('https://daninihub.com',{...valid,consent:false})).status,400);
  assert.equal(billed,0);
  const first=await post('https://daninihub.com');
  assert.equal(first.status,200);
  assert.match(first.data.answer,/independent inspection/);
  const rest=await Promise.all(Array.from({length:DAILY_CAP+9},()=>post('https://daninihub.com')));
  assert.equal(rest.filter(r=>r.status===200).length,DAILY_CAP-1);
  assert.equal(rest.filter(r=>r.status===429).length,10);
  assert.equal(billed,DAILY_CAP);
});
