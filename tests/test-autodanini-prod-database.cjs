'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {ImportOSStore}=require('../importos-store');

test('production with no MySQL rejects JSON fallback, before file creation',async(t)=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'danini-prod-db-'));
  t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
  const file=path.join(dir,'client-records.json');
  const store=new ImportOSStore({env:{NODE_ENV:'production'},storageFile:file});
  await assert.rejects(store.init(),/PRODUCTION_LOCAL_STORAGE_FORBIDDEN/);
  assert.equal(fs.existsSync(file),false);
});
test('production with a failed MySQL connection rejects JSON fallback',async(t)=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'danini-prod-db-'));
  t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
  const file=path.join(dir,'client-records.json');
  let ended=false;
  const mysql={createPool(){return {
    async execute(){throw Object.assign(new Error('test mysql unavailable'),{code:'ECONNREFUSED'})},
    async end(){ended=true}
  }}};
  const store=new ImportOSStore({
    env:{NODE_ENV:'production',DB_HOST:'fake',DB_USER:'fake',DB_NAME:'fake',DB_PASSWORD:'fake'},
    mysql,storageFile:file
  });
  await assert.rejects(store.init(),/PRODUCTION_DATABASE_UNAVAILABLE/);
  assert.equal(fs.existsSync(file),false);
  assert.equal(ended,true);
  assert.notEqual(store.mode,'file');
});
test('development retains explicit local JSON fallback',async(t)=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'danini-dev-db-'));
  t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
  const file=path.join(dir,'dev-records.json');
  const store=new ImportOSStore({env:{NODE_ENV:'development'},storageFile:file});
  await store.init();
  assert.equal(store.mode,'file');
  assert.equal(fs.existsSync(file),true);
});
