/**
 * DANINI Academy Business Builder — dormant multi-user persistence core.
 * NEVER derive actor.userId from request JSON. Future public route MUST verify
 * authentication before invoking these functions. No route is registered yet.
 * No AI calls, emails, payments, external publications or cross-tenant reads.
 */

export const STEPS=Object.freeze([
  'niche','market','offer','online_presence','operations','validation',
]);
const ID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CONTROL=/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/;
function bad(code){const e=new Error(code);e.code=code;return e;}
function principal(actor){
  // This is only an internal boundary check, NOT a login system.
  if(!actor || actor.authenticated!==true || typeof actor.userId!=='string' || !ID.test(actor.userId))throw bad('verified_identity_required');
  return actor.userId;
}
function text(v,max=500){
  if(typeof v!=='string'||v.trim().length<1||v.length>max||CONTROL.test(v))throw bad('invalid_input');
  return v.trim();
}
function locale(v){if(v!=='de'&&v!=='sr')throw bad('invalid_locale');return v;}
function validateStep(step){if(!STEPS.includes(step))throw bad('invalid_step');return step;}
function validateFields(fields){
  if(!fields||typeof fields!=='object'||Array.isArray(fields))throw bad('invalid_fields');
  const entries=Object.entries(fields);
  if(entries.length<1||entries.length>12)throw bad('invalid_fields');
  const payload={};
  for(const [k,v] of entries){
    if(!/^[a-z][a-z0-9_]{0,44}$/.test(k))throw bad('invalid_field_name');
    payload[k]=text(v,1500);
  }
  const json=JSON.stringify(payload);
  if(new TextEncoder().encode(json).length>12000)throw bad('too_many_bytes');
  return json;
}
function validProjectId(id){if(typeof id!=='string'||!ID.test(id))throw bad('invalid_project_id');return id;}
export async function registerAuthenticatedUser(db,actor){
  // Call ONLY after server-side identity verification.
  const userId=principal(actor);
  await db.prepare('INSERT OR IGNORE INTO academy_users (id,created_at) VALUES (?,?)').bind(userId,Date.now()).run();
  return userId;
}
export async function createProject(db,actor,input){
  const userId=principal(actor);
  if(!input||typeof input!=='object')throw bad('invalid_input');
  const title=text(input.title,120), language=locale(input.language);
  const id=crypto.randomUUID(), now=Date.now();
  // User must have been provisioned after verified sign-in.
  await db.prepare('INSERT INTO academy_projects (id,owner_user_id,title,language,created_at,updated_at) VALUES (?,?,?,?,?,?)')
    .bind(id,userId,title,language,now,now).run();
  return {id,title,language,status:'draft',createdAt:now};
}
export async function listProjects(db,actor){
  const userId=principal(actor);
  const r=await db.prepare('SELECT id,title,language,status,created_at,updated_at FROM academy_projects WHERE owner_user_id=? ORDER BY updated_at DESC LIMIT 100').bind(userId).all();
  return r.results||[];
}
export async function getProject(db,actor,projectId){
  const userId=principal(actor),id=validProjectId(projectId);
  const project=await db.prepare('SELECT id,title,language,status,created_at,updated_at FROM academy_projects WHERE id=? AND owner_user_id=?').bind(id,userId).first();
  if(!project)return null;
  const r=await db.prepare('SELECT step,content_json,updated_at FROM academy_project_steps WHERE project_id=? AND EXISTS(SELECT 1 FROM academy_projects WHERE id=? AND owner_user_id=?) ORDER BY updated_at ASC')
    .bind(id,id,userId).all();
  return {...project,steps:(r.results||[]).map(row=>({step:row.step,fields:JSON.parse(row.content_json),updated_at:row.updated_at}))};
}
export async function saveStep(db,actor,projectId,step,fields){
  const userId=principal(actor),id=validProjectId(projectId),stage=validateStep(step),content=validateFields(fields),now=Date.now();
  // Key property: INSERT ... SELECT from a row scoped by owner_user_id.
  // A forged projectId for another account cannot create or modify step rows.
  const result=await db.prepare(`INSERT INTO academy_project_steps(project_id,step,content_json,updated_at)
    SELECT id,?,?,? FROM academy_projects WHERE id=? AND owner_user_id=?
    ON CONFLICT(project_id,step) DO UPDATE SET content_json=excluded.content_json,updated_at=excluded.updated_at`)
    .bind(stage,content,now,id,userId).run();
  if(result.meta?.changes!==1)throw bad('project_not_found');
  await db.prepare('UPDATE academy_projects SET updated_at=? WHERE id=? AND owner_user_id=?').bind(now,id,userId).run();
  return {saved:true,step:stage};
}
export async function deleteProject(db,actor,projectId){
  const userId=principal(actor),id=validProjectId(projectId);
  const r=await db.prepare('DELETE FROM academy_projects WHERE id=? AND owner_user_id=?').bind(id,userId).run();
  return r.meta?.changes===1;
}