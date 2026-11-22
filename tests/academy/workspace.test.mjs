import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {registerAuthenticatedUser,createProject,listProjects,getProject,saveStep,deleteProject,STEPS} from '../../src/academy/workspace.mjs';
const sql=readFileSync(new URL('../../migrations/2026-11-22-academy-business-builder.sql',import.meta.url),'utf8');
function fresh(){
  const db=new DatabaseSync(':memory:');db.exec(sql);
  return {raw:db,api:{prepare(query){return {bind(...args){return {
    async run(){const x=db.prepare(query).run(...args);return {meta:{changes:x.changes}}},
    async first(){return db.prepare(query).get(...args)||null},
    async all(){return {results:db.prepare(query).all(...args)}}
  }}}}}};
}
const a={authenticated:true,userId:'11111111-1111-4111-8111-111111111111'};
const b={authenticated:true,userId:'22222222-2222-4222-8222-222222222222'};
test('account A and B cannot access each other, across list, get, step write and delete',async()=>{
  const {raw,api}=fresh();await registerAuthenticatedUser(api,a);await registerAuthenticatedUser(api,b);
  const p=await createProject(api,a,{title:'Moj online posao',language:'sr'});
  await saveStep(api,a,p.id,'niche',{problem:'Provera prve poslovne ideje',customer:'Male firme u Nemačkoj'});
  assert.equal((await getProject(api,a,p.id)).steps.length,1);
  assert.deepEqual(await listProjects(api,b),[]);
  assert.equal(await getProject(api,b,p.id),null);
  await assert.rejects(()=>saveStep(api,b,p.id,'offer',{offer:'Zlonamerni sadržaj'}),/project_not_found/);
  assert.equal(await deleteProject(api,b,p.id),false);
  assert.equal((await getProject(api,a,p.id)).steps[0].fields.problem,'Provera prve poslovne ideje');
  assert.equal(await deleteProject(api,a,p.id),true);
  assert.equal(await getProject(api,a,p.id),null);
  assert.equal(raw.prepare('SELECT COUNT(*) AS n FROM academy_project_steps').get().n,0);
  raw.close();
});
test('6 business stages, update, locale and no unknown stage',async()=>{
  const {raw,api}=fresh();await registerAuthenticatedUser(api,a);
  const p=await createProject(api,a,{title:'Business in DACH',language:'de'});
  for(const stage of STEPS)await saveStep(api,a,p.id,stage,{note:'Arbeitsschritt: '+stage});
  await saveStep(api,a,p.id,'offer',{offer:'Ein klarer Kunden-Nutzen'});
  const q=await getProject(api,a,p.id);assert.equal(q.steps.length,6);assert.equal(q.steps.find(s=>s.step==='offer').fields.offer,'Ein klarer Kunden-Nutzen');
  assert.equal(q.language,'de');
  await assert.rejects(()=>saveStep(api,a,p.id,'random',{bad:'content'}),/invalid_step/);
  raw.close();
});
test('principal must be verified and server-supplied; input is bounded',async()=>{
  const {raw,api}=fresh();await registerAuthenticatedUser(api,a);
  const p=await createProject(api,a,{title:'Sopstveni posao',language:'sr'});
  for(const forged of [{userId:a.userId},{authenticated:true,userId:'bogus'},{authenticated:false,userId:a.userId}]){
    await assert.rejects(()=>getProject(api,forged,p.id),/verified_identity_required/);
  }
  await assert.rejects(()=>saveStep(api,a,p.id,'niche',{message:'x'.repeat(1501)}),/invalid_input/);
  await assert.rejects(()=>createProject(api,a,{title:'x',language:'en'}),/invalid_locale/);
  await assert.rejects(()=>saveStep(api,a,p.id,'niche',{'__proto__':'bad',what:'valid', 'with-hyphen':'not allowed'}),/invalid_field_name/);
  assert.deepEqual((await listProjects(api,a)).map(p=>p.id),[p.id]);raw.close();
});