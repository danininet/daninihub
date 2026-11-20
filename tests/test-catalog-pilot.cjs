'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const E=require('../core/catalog-proof');
const {createImportOSStore}=require('../importos-store');
const {createCatalogJobs}=require('../core/catalog-job');
const {createPilotApp}=require('../catalog-pilot-server');
const header='sku,title,price,currency,stock\n';
test('browser SHA-256 matches Node including Unicode and long inputs',()=>{const crypto=require('node:crypto');for(const s of ['', 'abc','Čalije — € 😀','a'.repeat(256000)])assert.equal(E.sha256(s),crypto.createHash('sha256').update(s).digest('hex'));});
const input={sourceCSV:header+'A,Source,12.90,EUR,3\nB,Second,5.00,EUR,2',targetCSV:header+'A,Wrong,99.00,EUR,8\nX,Unknown,2.00,EUR,1',sourceAuthorized:true};
test('source reconciliation covers every row without inventing unknown products',()=>{const r=E.analyze(input);assert.equal(r.draft.length,1);assert.equal(r.excludedRows,1);assert.equal(r.changes.length,3);assert.deepEqual(r.reconciliation,{targetRows:2,draftRows:1,excludedRows:1});assert.equal(r.draft[0].price,'12.90');assert.equal(r.usage.apiCostEur,0);});
test('CSV supports BOM, CRLF, quoted delimiters, escaped quotes and multiline titles',()=>{const r=E.parseCSV('\uFEFF'+header+'A,"A, ""quoted""\nname",1.00,EUR,1\r\n');assert.equal(r[0].values.title,'A, "quoted"\nname');});
test('explicit comma decimals are exact and ambiguous thousands are rejected',()=>{assert.equal(E.money('12,90',','),1290);assert.equal(E.money('1,234',','),null);assert.equal(E.money('1e3','.'),null);assert.equal(E.money('-1','.'),null);assert.equal(E.money('0.01','.'),1);});
test('equivalent numeric formatting is recorded when the draft changes it',()=>{const r=E.analyze({...input,targetCSV:header+'A,Source,12.9,EUR,03'});assert.equal(r.changes.length,2);assert.equal(r.issues.filter(x=>x.code==='SOURCE_FORMAT_DIFFERENCE').length,2);});
test('duplicate SKUs exclude every affected target row',()=>{const r=E.analyze({...input,targetCSV:header+'A,Name,1.00,EUR,1\nA,Name,1.00,EUR,1'});assert.equal(r.draft.length,0);assert.equal(r.excludedRows,2);assert.equal(r.issues.filter(x=>x.code==='DUPLICATE_SKU').length,2);});
test('ambiguous/invalid source is never a repair source',()=>{const r=E.analyze({...input,sourceCSV:header+'A,Source,invalid,EUR,3'});assert.equal(r.draft.length,0);assert.equal(r.excludedRows,2);});
test('no source permission, oversized input and malformed rows fail closed',()=>{assert.throws(()=>E.analyze({...input,sourceAuthorized:false}),/PERMISSION/);assert.throws(()=>E.parseCSV('x'.repeat(256001)),/TOO_LARGE/);assert.throws(()=>E.parseCSV(header+'A,B,1,EUR'),/COLUMN_COUNT/);assert.throws(()=>E.parseCSV(header+'A,"broken'),/UNCLOSED/);assert.throws(()=>E.parseCSV('sku,sku,title,price,currency,stock\nA,A,B,1,EUR,1'),/DUPLICATE_HEADER/);});
test('500 row cap is enforced',()=>{assert.throws(()=>E.parseCSV(header+Array.from({length:501},(_,i)=>`${i},N,1.00,EUR,1`).join('\n')),/ROW_LIMIT/);});
test('spreadsheet formulas are neutralized at all CSV export boundaries',()=>{for(const v of ['=CMD()','+cmd','@SUM(1)','-2','\t=CMD()','\r+CMD()'])assert.match(E.toCSV([{v}],['v']),/"'/);});
test('text resembling instructions or scripts remains data',()=>{const r=E.analyze({...input,sourceCSV:header+'A,<script>alert(1)</script>,12.90,EUR,3'});assert.equal(r.draft[0].title,'<script>alert(1)</script>');assert.equal(r.usage.modelCalls,0);});
test('job restart, approval, isolation and idempotent delivery',async()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'catalog-test-')),file=path.join(root,'state.json');
 try{
  let store=createImportOSStore({env:{},storageFile:file}),jobs=createCatalogJobs(store);
  const a=await jobs.create(input),b=await jobs.create(input);
  await assert.rejects(jobs.get(a.id,b.token),/NOT_FOUND/);
  await assert.rejects(jobs.deliver(a.id,a.token),/REVIEW_REQUIRED/);
  await jobs.advance(a.id);
  store=createImportOSStore({env:{},storageFile:file});jobs=createCatalogJobs(store);
  assert.equal((await jobs.get(a.id,a.token)).state,'VALIDATED');
  await jobs.advance(a.id);await jobs.advance(a.id);
  let state=await jobs.get(a.id,a.token);assert.equal(state.state,'REVIEW_REQUIRED');assert.equal(state.version,2);
  assert.equal('tokenHash' in state,false);assert.equal('input' in state,false);
  await assert.rejects(jobs.approve(a.id,{version:2,resultHash:'wrong',note:'reviewed'}),/APPROVAL/);
  await assert.rejects(jobs.approve(a.id,{version:1,resultHash:state.resultHash,note:'reviewed'}),/CONFLICT/);
  await jobs.approve(a.id,{version:2,resultHash:state.resultHash,note:'Synthetic report checked; exclusions retained.'});
  const first=await jobs.deliver(a.id,a.token),second=await jobs.deliver(a.id,a.token);
  assert.deepEqual(first,second);assert.equal(first.payment.status,'NOT_CHARGED');
  state=await jobs.get(a.id,a.token);assert.equal(state.events.filter(e=>e.action==='DOWNLOAD_PREPARED').length,1);
  assert.equal((await jobs.list()).length,2);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('concurrent job steps use compare-and-swap to prevent duplicate completion',async()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'catalog-cas-'));
 try{const store=createImportOSStore({env:{},storageFile:path.join(root,'db.json')}),j=createCatalogJobs(store),a=await j.create(input);const result=await Promise.allSettled([j.advance(a.id),j.advance(a.id)]);assert.equal(result.filter(r=>r.status==='fulfilled').length,1);assert.equal((await j.get(a.id,a.token)).events.length,1);}finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('server rejects missing/short admin secret',()=>{assert.throws(()=>createPilotApp({store:{},adminSecret:'short'}),/ADMIN_SECRET/);});
test('HTTP order to download flow, forbidden actions and payment disabled',async()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'catalog-http-')),secret='test-only-'.repeat(5);
 const store=createImportOSStore({env:{},storageFile:path.join(root,'db.json')});
 const server=createPilotApp({store,adminSecret:secret}).listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
 const base='http://127.0.0.1:'+server.address().port;
 const post=(route,body={},admin=true)=>fetch(base+route,{method:'POST',headers:{'Content-Type':'application/json',...(admin?{'x-danini-admin':secret}:{})},body:JSON.stringify(body)});
 try{
  assert.equal((await post('/api/pilot/jobs',input,false)).status,403);
  const created=await post('/api/pilot/jobs',input);assert.equal(created.status,201);const a=await created.json();
  assert.equal((await fetch(base+'/api/pilot/jobs/'+a.id)).status,404);
  assert.equal((await fetch(base+'/api/pilot/admin/jobs')).status,403);
  assert.equal((await post('/api/pilot/checkout')).status,409);
  for(let i=0;i<2;i++)assert.equal((await post('/api/pilot/jobs/'+a.id+'/advance')).status,200);
  const h={'x-project-token':a.token};let r=await fetch(base+'/api/pilot/jobs/'+a.id,{headers:h}),p=await r.json();
  assert.equal((await fetch(base+'/api/pilot/jobs/'+a.id+'/download',{headers:h})).status,400);
  assert.equal((await post('/api/pilot/jobs/'+a.id+'/approve',{version:p.version,resultHash:p.resultHash,note:'Test release'})).status,200);
  r=await fetch(base+'/api/pilot/jobs/'+a.id+'/download',{headers:h});assert.equal(r.status,200);assert.match(r.headers.get('cache-control'),/no-store/);assert.equal((await r.json()).payment.status,'NOT_CHARGED');
  const ui=await fetch(base+'/');assert.equal(ui.status,200);assert.match(ui.headers.get('content-security-policy'),/script-src 'self'/);
  assert.equal((await fetch(base+'/catalog-proof.js')).status,200);
 }finally{await new Promise(r=>server.close(r));fs.rmSync(root,{recursive:true,force:true});}
});
