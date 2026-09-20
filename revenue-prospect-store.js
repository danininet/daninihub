'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { WAVE_01 } = require('./core/revenue-prospect-seed');

const FILE = path.join(process.cwd(),'runtime','revenue-prospects.json');
const STATUSES = new Set(['RESEARCHED','FIT','CONTACT_ALLOWED','APPROVED_TO_CONTACT','CONTACTED','REPLIED','QUALIFIED','NOT_FIT']);

function ensure(){
  fs.mkdirSync(path.dirname(FILE),{recursive:true});
  if(!fs.existsSync(FILE)){
    const seeded={};
    for(const item of WAVE_01){
      const record=sanitize(item);
      seeded[record.id]=record;
    }
    fs.writeFileSync(FILE,JSON.stringify(seeded,null,2)+'\n',{mode:0o600});
  }
}

function readAll(){
  ensure();
  try{return JSON.parse(fs.readFileSync(FILE,'utf8'));}catch{return {}}
}

function writeAll(data){
  ensure();
  const tmp=FILE+'.'+process.pid+'.tmp';
  fs.writeFileSync(tmp,JSON.stringify(data,null,2)+'\n',{mode:0o600});
  fs.renameSync(tmp,FILE);
}

function idFor(input){
  const base=[input.company,input.website,input.city].map(x=>String(x||'').trim().toLowerCase()).join('|');
  return 'P-'+crypto.createHash('sha256').update(base).digest('hex').slice(0,12).toUpperCase();
}

function sanitize(input={}){
  const status=String(input.status||'RESEARCHED').toUpperCase();
  if(!STATUSES.has(status)) throw new Error('INVALID_PROSPECT_STATUS');
  return {
    id: input.id || idFor(input),
    company: String(input.company||'').trim().slice(0,180),
    website: String(input.website||'').trim().slice(0,300),
    city: String(input.city||'').trim().slice(0,120),
    segment: String(input.segment||'').trim().slice(0,120),
    sourceUrl: String(input.sourceUrl||'').trim().slice(0,500),
    publicContact: String(input.publicContact||'').trim().slice(0,240),
    painSignal: String(input.painSignal||'').trim().slice(0,2000),
    fitReason: String(input.fitReason||'').trim().slice(0,2000),
    priority: String(input.priority||'').trim().slice(0,20),
    auditSummary: String(input.auditSummary||'').trim().slice(0,3000),
    pilotProposal: String(input.pilotProposal||'').trim().slice(0,3000),
    proofMetrics: String(input.proofMetrics||'').trim().slice(0,2000),
    draftOpener: String(input.draftOpener||'').trim().slice(0,2000),
    outreachDecision: String(input.outreachDecision||'HOLD').trim().slice(0,40),
    contactBasis: String(input.contactBasis||'').trim().slice(0,120),
    status,
    ownerApproved: Boolean(input.ownerApproved),
    note: String(input.note||'').trim().slice(0,2000),
    createdAt: input.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function list(limit=250){
  const all=Object.values(readAll());
  return all.sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt))).slice(0,Math.max(1,Math.min(Number(limit)||250,1000)));
}

function upsert(input){
  const all=readAll();
  const current=input.id ? all[input.id] : null;
  const next=sanitize({...current,...input,createdAt:current?.createdAt});
  all[next.id]=next;
  writeAll(all);
  return next;
}

function update(id,patch={}){
  const all=readAll();
  if(!all[id]) throw new Error('PROSPECT_NOT_FOUND');
  const next=sanitize({...all[id],...patch,id,createdAt:all[id].createdAt});
  all[id]=next;
  writeAll(all);
  return next;
}

function summarize(prospects){
  const counts={total:prospects.length,researched:0,fit:0,contact_allowed:0,approved_to_contact:0,contacted:0,replied:0,qualified:0,not_fit:0};
  for(const p of prospects){const k=String(p.status||'').toLowerCase();if(Object.prototype.hasOwnProperty.call(counts,k)) counts[k]+=1}
  return counts;
}

module.exports={STATUSES,list,upsert,update,summarize};
