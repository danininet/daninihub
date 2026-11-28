'use strict';
// Native Academy AI and site assistant, sharing the existing Academy workspace.
const {academyContext}=require('./hostinger-academy.cjs');
const {publicDomainEnabled}=require('./hostinger-assets.cjs');
const {createImportOSStore}=require('./importos-store.js');
const {initializeAcademy}=require('./hostinger-academy-db.cjs');
const {createWorkersAI,createAIQuota,initializeAIQuota}=require('./hostinger-ai-provider.cjs');
const {createVehicleCounters}=require('./hostinger-vehicle-counters.cjs');
const ORIGIN='https://daninihub.com';
const ROUTES=new Map([
 ['/api/academy/ai/status',['GET','academy']],
 ['/api/academy/ai/review',['POST','academy']],
 ['/api/academy/assistant/status',['GET','assistant']],
 ['/api/academy/assistant/projects',['GET','assistant']],
 ['/api/academy/assistant/ask',['POST','assistant']],
 ['/api/assistant/status',['GET','assistant']],
 ['/api/assistant/projects',['GET','assistant']],
 ['/api/assistant/ask',['POST','assistant']],
 ['/api/vehicle-analysis',['POST','vehicle']]
]);
function aiContext(env,host){
 if(!publicDomainEnabled(env,true,host))return null;
 const academy=academyContext(env,host);
 const enabled=env.HOSTINGER_AI_PUBLIC_ENABLED==='true'&&
  env.HOSTINGER_AI_SPEND_APPROVED==='true'&&
  typeof env.HOSTINGER_WORKERS_AI_TOKEN==='string'&&!!env.HOSTINGER_WORKERS_AI_TOKEN.trim()&&
  !!env.DANINI_TURNSTILE_SITEKEY&&!!env.DANINI_TURNSTILE_SECRET;
 return {...academy.env,ACADEMY_AI_ENABLED:enabled?'true':'false',
  DANINI_ACADEMY_AI_SPEND_APPROVED:enabled?'true':'false',
  DANINI_AI_LIVE_APPROVED:enabled?'true':'false',AI_ENABLED:enabled?'true':'false',
  DANINI_SITE_ASSISTANT_ENABLED:enabled&&env.HOSTINGER_SITE_ASSISTANT_ENABLED==='true'?'true':'false',
  // Conservative shared bucket until the trusted Hostinger proxy chain is verified.
  // Never use a client-supplied address for quotas or Turnstile remoteip.
  HOSTINGER_VEHICLE_ENABLED:env.HOSTINGER_VEHICLE_ANALYSIS_ENABLED==='true'?'true':'false',
  HOSTINGER_SHARED_RATE_KEY:'hostinger-shared-public'};
}
function mountHostingerAI(app,express,env=process.env,deps={}){
 const {connectionOptions}=createImportOSStore({env});
 let pending;
 async function connect(){
  if(!connectionOptions)throw Error('ai_database_required');
  if(!pending)pending=(async()=>{
   const pool=(deps.poolFactory||require('mysql2/promise').createPool)({...connectionOptions,connectTimeout:5000,connectionLimit:5,queueLimit:20});
   try{
    const db=await initializeAcademy(pool,true);
    await initializeAIQuota(pool);
    return {db,vehicleCounters:createVehicleCounters(pool),
     ai:env.HOSTINGER_WORKERS_AI_TOKEN?createWorkersAI({token:env.HOSTINGER_WORKERS_AI_TOKEN,reserve:createAIQuota(pool,'academy',{text:8,vision:0})}):undefined,
     vehicleAI:env.HOSTINGER_WORKERS_AI_TOKEN?createWorkersAI({token:env.HOSTINGER_WORKERS_AI_TOKEN,reserve:createAIQuota(pool,'vehicle',{text:20,vision:6})}):undefined};
   }catch(e){await pool.end().catch(()=>{});throw e;}
  })().catch(e=>{pending=undefined;throw e;});
  return pending;
 }
 const parse=express.raw({type:'application/json',limit:16384,inflate:false});
 const parseVehicle=express.raw({type:'application/json',limit:1500000,inflate:false});
 app.use(async(req,res,next)=>{
  const route=ROUTES.get(req.path);
  if(!route)return next();
  const context=aiContext(env,req.hostname);
  if(!context)return res.sendStatus(404);
  res.set({'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow','Referrer-Policy':'no-referrer'});
  const [method,kind]=route;
  if(req.method!==method)return res.status(405).json({error:'method_not_allowed'});
  if(method==='POST'&&req.get('origin')!==ORIGIN)return res.status(403).json({error:'invalid_origin'});
  const send=async()=>{
   try{
    const enabled=kind==='vehicle'?context.HOSTINGER_VEHICLE_ENABLED==='true':context.AI_ENABLED==='true'&&(kind!=='assistant'||context.DANINI_SITE_ASSISTANT_ENABLED==='true');
    if(!enabled){
     if(req.path.endsWith('/status'))return res.json({enabled:false,siteKey:null});
     return res.status(503).json({error:'ai_disabled'});
    }
    const headers=new Headers();
    for(const key of ['origin','content-type','content-length','cookie']){
     const value=req.get(key);if(value)headers.set(key,value);
    }
    if(kind==='vehicle')headers.set('cf-connecting-ip','hostinger-shared-public');
    const request=new Request(ORIGIN+req.path,{method,headers,...(method==='POST'?{body:req.body}:{})});
    const {db,ai,vehicleAI,vehicleCounters}=await connect();
    const handler=kind==='vehicle'?(await import('./workers/danini-vehicle-analysis.mjs')).handleVehicleAnalysis:kind==='academy'?(await import('./workers/danini-academy-ai.mjs')).academyAiRoute:(await import('./workers/danini-site-assistant.mjs')).siteAssistantRoute;
    const response=await handler(request,{...context,DANINI_DB:db,AI:kind==='vehicle'?vehicleAI:ai,...(kind==='vehicle'?{PARTNERS:vehicleCounters}: {})});
    res.set(Object.fromEntries(response.headers));
    return res.status(response.status).send(await response.text());
   }catch{return res.status(503).json({error:'ai_service_unavailable'});}
  };
  if(method==='POST')return (kind==='vehicle'?parseVehicle:parse)(req,res,e=>e?res.status(e.status===413?413:400).json({error:'invalid_body'}):send());
  return send();
 });
}
module.exports={aiContext,mountHostingerAI,ROUTES};
