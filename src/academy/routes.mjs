/** DORMANT public Academy Builder endpoints behind ACADEMY_AUTH_ENABLED. */
import {STEPS,createProject,deleteProject,getProject,listProjects,saveStep} from './workspace.mjs';
import {requestLogin,verifyLogin,authenticate,logout,deleteAccount,isConfigured,clearCookie} from './auth.mjs';
const PATH='/api/academy/';
const responseHeaders={'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff','referrer-policy':'no-referrer','x-frame-options':'DENY'};
function result(body,status=200,extra={}){return new Response(JSON.stringify(body),{status,headers:{...responseHeaders,...extra}});}
function error(status,code){return result({error:code},status);}
async function jsonBody(request,max=15000){
 if(!/^application\/json(?:;|$)/i.test(request.headers.get('content-type')||''))throw Object.assign(Error('json_required'),{status:415});
 const size=Number(request.headers.get('content-length')||0);
 if(size>max)throw Object.assign(Error('too_large'),{status:413});
 const text=await request.text();if(new TextEncoder().encode(text).length>max)throw Object.assign(Error('too_large'),{status:413});
 try{return JSON.parse(text);}catch{throw Object.assign(Error('invalid_json'),{status:400});}
}
export async function academyRoute(request,env){
 if(!isConfigured(env))return error(404,'not_found');
 const u=new URL(request.url),pathname=u.pathname,method=request.method;
 if(!pathname.startsWith(PATH))return error(404,'not_found');
 if(pathname===PATH+'config' && method==='GET') return result({enabled:true,siteKey:env.DANINI_TURNSTILE_SITEKEY??null});
 if(method!=='GET'){
  if(request.headers.get('origin')!==env.SITE_ORIGIN)return error(403,'invalid_origin');
 }
 try{
  if(pathname===PATH+'auth/start'&&method==='POST')return result(await requestLogin(request,env,await jsonBody(request,4096)),202);
  if(pathname===PATH+'auth/verify'&&method==='POST'){
   const x=await verifyLogin(env,await jsonBody(request,1024));
   return result({authenticated:true,expiresInSeconds:x.expiresInSeconds},200,{'set-cookie':x.cookie});
  }
  if(pathname===PATH+'logout'&&method==='POST'){
   const x=await logout(request,env);return result({loggedOut:true},200,{'set-cookie':x.cookie});
  }
  if(pathname===PATH+'session'&&method==='GET'){
   try{await authenticate(request,env);return result({authenticated:true});}
   catch(e){if(e.status===401)return result({authenticated:false});throw e;}
  }
  const actor=await authenticate(request,env);
  if(pathname===PATH+'projects'){
   if(method==='GET')return result({projects:await listProjects(env.DANINI_DB,actor)});
   if(method==='POST')return result({project:await createProject(env.DANINI_DB,actor,await jsonBody(request,1024))},201);
   return error(405,'method_not_allowed');
  }
  const project=pathname.match(/^\/api\/academy\/projects\/([0-9a-f-]{36})(?:\/(export|steps\/(niche|market|offer|online_presence|operations|validation)))?$/i);
  if(project){const id=project[1];
   if(!project[2]){
    if(method==='GET'){const p=await getProject(env.DANINI_DB,actor,id);return p?result({project:p}):error(404,'not_found');}
    if(method==='DELETE')return (await deleteProject(env.DANINI_DB,actor,id))?result({deleted:true}):error(404,'not_found');
   }
   if(project[2]==='export'&&method==='GET'){
    const p=await getProject(env.DANINI_DB,actor,id);return p?result({schemaVersion:1,project:p}):error(404,'not_found');
   }
   if(project[3]&&method==='PUT')return result(await saveStep(env.DANINI_DB,actor,id,project[3],(await jsonBody(request,14000))?.fields));
   return error(405,'method_not_allowed');
  }
  if(pathname===PATH+'account'&&method==='DELETE'){
   const body=await jsonBody(request,1000);
   if(body?.confirm!=='DELETE')return error(400,'delete_confirmation_required');
   const out=await deleteAccount(env.DANINI_DB,actor);
   return result(out,200,{'set-cookie':clearCookie()});
  }
  return error(404,'not_found');
 }catch(e){
  const known=new Set(['verified_identity_required','invalid_input','invalid_fields','invalid_locale','invalid_step','invalid_field_name','too_many_bytes','invalid_project_id']);
  if(e.message==='project_not_found')return error(404,'not_found');
  if(e.message==='project_limit_reached')return error(409,'project_limit_reached');
  if(known.has(e.message))return error(400,e.message);
  const status=Number(e.status);if(status>=400&&status<=499)return error(status,e.message);
  if(status===503)return error(503,e.message);
  return error(503,'academy_service_unavailable');
 }
}