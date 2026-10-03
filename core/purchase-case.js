'use strict';
const crypto=require('node:crypto');
const STEPS=[['selection','Izbor i budžet','Auswahl und Budget'],['documents','Prodavac i dokumenta','Verkäufer und Unterlagen'],['inspection','Stručni pregled','Fachprüfung'],['purchase','Kupovina i plaćanje','Kauf und Zahlung'],['transport','Izvoz i dovoz','Export und Transport'],['customs','Carina','Zoll'],['registration','Ispitivanje i registracija','Prüfung und Zulassung'],['handover','Primopredaja i servis','Übergabe und Service']];
const text=(v,n=1000)=>String(v??'').trim().slice(0,n);
function initialCase(data={}){return {version:0,published:false,budget:Number(data.budget)>0?Number(data.budget):null,criteria:text(data.criteria,1000),purpose:text(data.purpose,500),nextAction:'',report:'',candidates:[],costs:[],steps:STEPS.map(([id])=>({id,status:'TODO',executor:'',evidence:'',note:'',dueDate:''})),history:[]}}
function tokenHash(token){return crypto.createHash('sha256').update(String(token)).digest('hex')}
function validToken(hash,token){const supplied=tokenHash(token);return typeof hash==='string'&&hash.length===64&&crypto.timingSafeEqual(Buffer.from(hash),Buffer.from(supplied))}
function safeUrl(value){const s=text(value,800);if(!s)return '';try{const u=new URL(s);if(!['http:','https:'].includes(u.protocol)||u.username||u.password)throw Error();return u.href}catch{throw Error('INVALID_SOURCE_URL')}}
function updateCase(current,input){
  const previous=current||initialCase();
  if(!Number.isInteger(input.version)||input.version!==previous.version)throw Error('CASE_VERSION_CONFLICT');
  const budget=Number(input.budget);if(!Number.isFinite(budget)||budget<=0||budget>10000000)throw Error('INVALID_BUDGET');
  const criteria=text(input.criteria,1000);if(!criteria)throw Error('CRITERIA_REQUIRED');
  if(!Array.isArray(input.steps)||input.steps.length!==STEPS.length)throw Error('ALL_STEPS_REQUIRED');
  const steps=STEPS.map(([id])=>{
    const entries=input.steps.filter(s=>s.id===id);if(entries.length!==1)throw Error('INVALID_STEP');const s=entries[0];
    if(!['TODO','IN_PROGRESS','BLOCKED','DONE','NOT_INCLUDED'].includes(s.status))throw Error('INVALID_STEP_STATUS');
    const executor=text(s.executor,200),evidence=text(s.evidence,1200),note=text(s.note,1200),dueDate=text(s.dueDate,10);
    if(s.status==='DONE'&&(!executor||!evidence))throw Error('DONE_REQUIRES_EXECUTOR_AND_EVIDENCE');
    if(['BLOCKED','NOT_INCLUDED'].includes(s.status)&&!note)throw Error('STEP_REASON_REQUIRED');
    if(dueDate&&!/^\d{4}-\d{2}-\d{2}$/.test(dueDate))throw Error('INVALID_DATE');
    return {id,status:s.status,executor,evidence,note,dueDate};
  });
  if(!Array.isArray(input.costs)||input.costs.length>30||!Array.isArray(input.candidates)||input.candidates.length>3)throw Error('INVALID_CASE_ITEMS');
  const costs=input.costs.map(c=>{const label=text(c.label,120),amount=Number(c.amount),status=c.status;if(!label||!Number.isFinite(amount)||amount<0||amount>10000000||!['ESTIMATED','CONFIRMED'].includes(status))throw Error('INVALID_COST');const source=text(c.source,500);if(status==='CONFIRMED'&&!source)throw Error('CONFIRMED_COST_REQUIRES_SOURCE');return {label,amount,status,source}});
  const candidates=input.candidates.map(c=>{const label=text(c.label,200),link=safeUrl(c.link),match=c.match,source=text(c.source,500),observedAt=text(c.observedAt,10);if(!label||!['UNKNOWN','MATCH','MISMATCH'].includes(match))throw Error('INVALID_CANDIDATE');if(match!=='UNKNOWN'&&(!source||!/^\d{4}-\d{2}-\d{2}$/.test(observedAt)))throw Error('CANDIDATE_ASSESSMENT_REQUIRES_SOURCE_AND_DATE');return {label,link,match,source,observedAt,note:text(c.note,1000)}});
  const nextAction=text(input.nextAction,1000),report=text(input.report,12000);
  const published=input.published===true;
  if(published&&!nextAction)throw Error('PUBLIC_CASE_REQUIRES_NEXT_ACTION');
  return {version:previous.version+1,published,budget,criteria,purpose:text(input.purpose,500),nextAction,report,candidates,costs,steps,history:[...(previous.history||[]).slice(-99),{version:previous.version+1,at:new Date().toISOString(),action:published?'PUBLISHED':'DRAFT_SAVED'}]};
}
function publicCase(record){const c=record.payload?.purchaseCase||initialCase();return {reference:record.reference,language:record.language,published:c.published,version:c.version,...(c.published?{budget:c.budget,criteria:c.criteria,purpose:c.purpose,nextAction:c.nextAction,report:c.report,candidates:c.candidates,costs:c.costs,steps:c.steps,totalListedCosts:c.costs.reduce((a,b)=>a+b.amount,0),allListedCostsConfirmed:c.costs.length>0&&c.costs.every(x=>x.status==='CONFIRMED')}:{}),labels:STEPS.map(([id,sr,de])=>({id,sr,de}))}}
module.exports={STEPS,initialCase,updateCase,publicCase,tokenHash,validToken};
