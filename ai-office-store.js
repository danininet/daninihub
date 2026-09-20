'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const FILE = path.join(process.cwd(), 'runtime', 'ai-office-cases.json');
const STATUSES = new Set(['NEW','READY_FOR_CALLBACK','CALLBACK_PLANNED','APPOINTMENT_PLANNED','FOLLOWUP','DONE','NOT_FIT']);

function ensure(){
  fs.mkdirSync(path.dirname(FILE), { recursive:true });
  if(!fs.existsSync(FILE)) fs.writeFileSync(FILE, '{}\n', { mode:0o600 });
}

function readAll(){
  ensure();
  try { return JSON.parse(fs.readFileSync(FILE,'utf8')); } catch { return {}; }
}

function writeAll(data){
  ensure();
  const tmp = FILE + '.' + process.pid + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data,null,2)+'\n', { mode:0o600 });
  fs.renameSync(tmp, FILE);
}

function clean(value,max=2000){ return String(value||'').trim().slice(0,max); }

function idFor(tenant){
  const date = new Date().toISOString().slice(0,10).replace(/-/g,'');
  return 'AO-' + clean(tenant,24).toUpperCase() + '-' + date + '-' + crypto.randomBytes(3).toString('hex').toUpperCase();
}

function create(tenant,input={}){
  const all = readAll();
  const now = new Date().toISOString();
  const id = idFor(tenant);
  const record = {
    id,
    tenant: clean(tenant,80),
    status:'NEW',
    customerName:clean(input.customerName,180),
    email:clean(input.email,180),
    phone:clean(input.phone,120),
    service:clean(input.service,180),
    address:clean(input.address,300),
    objectType:clean(input.objectType,180),
    urgency:clean(input.urgency,80),
    preferredTime:clean(input.preferredTime,180),
    message:clean(input.message,4000),
    source:clean(input.source || 'office-intake',80),
    privacyAcknowledged:Boolean(input.privacyAcknowledged),
    summary:clean(input.summary,4000),
    createdAt:now,
    updatedAt:now,
    history:[{ status:'NEW', at:now, note:'Intake created' }]
  };
  all[id]=record;
  writeAll(all);
  return record;
}

function list(tenant,limit=250){
  return Object.values(readAll())
    .filter(x=>x.tenant===tenant)
    .sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt)))
    .slice(0,Math.max(1,Math.min(Number(limit)||250,1000)));
}

function get(tenant,id){
  const item = readAll()[id];
  return item && item.tenant===tenant ? item : null;
}

function updateStatus(tenant,id,status,note=''){
  const normalized = String(status||'').toUpperCase();
  if(!STATUSES.has(normalized)) throw new Error('INVALID_OFFICE_STATUS');
  const all=readAll();
  const item=all[id];
  if(!item || item.tenant!==tenant) throw new Error('OFFICE_CASE_NOT_FOUND');
  const now=new Date().toISOString();
  item.status=normalized;
  item.updatedAt=now;
  item.history=Array.isArray(item.history)?item.history:[];
  item.history.push({status:normalized,at:now,note:clean(note,1000)});
  all[id]=item;
  writeAll(all);
  return item;
}

function summarize(items){
  const counts={total:items.length,new:0,ready_for_callback:0,callback_planned:0,appointment_planned:0,followup:0,done:0,not_fit:0};
  for(const item of items){
    const key=String(item.status||'').toLowerCase();
    if(Object.prototype.hasOwnProperty.call(counts,key)) counts[key]+=1;
  }
  return counts;
}

module.exports={STATUSES,create,list,get,updateStatus,summarize};
