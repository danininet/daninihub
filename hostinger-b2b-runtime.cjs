'use strict';
const {publicDomainEnabled}=require('./hostinger-assets.cjs');
const {createB2BD1}=require('./hostinger-b2b-d1.cjs');
const {createB2BR2,createB2BWorkflow}=require('./hostinger-b2b-services.cjs');
const ORIGIN='https://daninihub.com';
const UUID='[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
const casePath=new RegExp('^/api/case/'+UUID+'$');
const portalRead=new RegExp('^/portal/case/'+UUID+'$');
const portalWrite=new RegExp('^/portal/(?:approve|revise)/'+UUID+'$');
const required=['HOSTINGER_B2B_D1_READ_TOKEN','HOSTINGER_B2B_D1_WRITE_TOKEN','HOSTINGER_B2B_R2_READ_TOKEN','HOSTINGER_B2B_R2_WRITE_TOKEN','HOSTINGER_B2B_WORKFLOW_READ_TOKEN','HOSTINGER_B2B_WORKFLOW_WRITE_TOKEN','TOKEN_SECRET','RATE_SECRET','DIRECTOR_HMAC_SECRET','ACCESS_TEAM_DOMAIN','ACCESS_AUD','DIRECTOR_EMAIL','DANINI_TURNSTILE_SECRET','DANINI_TURNSTILE_SITEKEY','BREVO_API_KEY','DANINI_BREVO_SENDER','DANINI_NOTIFY_TO'];
function routeMethod(path){
 if(['/api/health','/api/tenant-config','/portal','/portal/','/portal/cases'].includes(path)||casePath.test(path)||portalRead.test(path))return 'GET';
 if(path==='/api/intake'||portalWrite.test(path))return 'POST';
 return null;
}
function createB2BContext(env,hostname,fetcher=globalThis.fetch){
 if(!publicDomainEnabled(env,true,hostname)||env.HOSTINGER_B2B_PUBLIC_ENABLED!=='true')return null;
 if(required.some(k=>typeof env[k]!=='string'||!env[k].trim()))return null;
 const tokens=required.slice(0,6).map(k=>env[k]);
 if(new Set(tokens).size!==6||tokens.includes(env.DANINI_PACKAGE_D1_READ_TOKEN))return null;
 if(['TOKEN_SECRET','RATE_SECRET','DIRECTOR_HMAC_SECRET'].some(k=>env[k].length<32))return null;
 if(!/^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(env.ACCESS_TEAM_DOMAIN))return null;
 const pair=(service)=>({readToken:env['HOSTINGER_B2B_'+service+'_READ_TOKEN'],writeToken:env['HOSTINGER_B2B_'+service+'_WRITE_TOKEN'],fetcher});
 // Only the shared handler's required configuration; no payment or AI credentials.
 return {
  ...Object.fromEntries(required.slice(6).map(k=>[k,env[k]])),
  SITE_ORIGIN:ORIGIN,B2B_ACTIVE:'true',
  RETENTION_DAYS:env.RETENTION_DAYS||'30',
  ...(env.HOSTINGER_B2B_PILOT_RECIPIENT?{MAIL_TEST_RECIPIENT:env.HOSTINGER_B2B_PILOT_RECIPIENT}:{}),
  DANINI_DB:createB2BD1(pair('D1')),
  DOCUMENTS:createB2BR2(pair('R2')),
  INTAKE_WORKFLOW:createB2BWorkflow(pair('WORKFLOW'))
 };
}
function mountHostingerB2B(app,express,env=process.env,loadCore=()=>require('./hostinger-b2b-core.cjs')){
 const parse=express.raw({type:'application/json',limit:80000,inflate:false});
 app.use(async(req,res,next)=>{
  const method=routeMethod(req.path);
  if(!method)return next();
  // Preserve the existing staging routes and disabled production fallback.
  const ctx=createB2BContext(env,req.hostname);
  if(!ctx)return next();
  res.set({'X-Robots-Tag':'noindex, nofollow','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'no-referrer'});
  if(req.method!==method)return res.status(405).json({error:'method_not_allowed'});
  if(method==='POST'&&req.get('origin')&&req.get('origin')!==ORIGIN)return res.status(403).json({error:'invalid_origin'});
  const send=async()=>{
   try{
    const headers=new Headers();
    for(const key of ['origin','content-type','content-length','authorization','idempotency-key','cf-access-jwt-assertion','x-danini-signature','x-danini-timestamp','x-danini-nonce']){
     const value=req.get(key);if(value)headers.set(key,value);
    }
    // Do not trust forwarded IP headers from arbitrary clients. Shared fallback
    // rate limit is conservative until the Hostinger proxy chain is verified.
    const request=new Request(ORIGIN+req.path,{method,headers,...(method==='POST'?{body:req.body}:{})});
    const response=await loadCore().handleRequest(request,ctx);
    res.set(Object.fromEntries(response.headers));
    return res.status(response.status).send(await response.text());
   }catch{return res.status(503).json({error:'b2b_service_unavailable'});}
  };
  if(method==='POST')return parse(req,res,error=>error?res.status(error.status===413?413:400).json({error:'invalid_body'}):send());
  return send();
 });
}
module.exports={createB2BContext,routeMethod,mountHostingerB2B};
