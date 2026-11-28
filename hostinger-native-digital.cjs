'use strict';
// Hostinger-native Sandbox checkout: existing private D1 package, isolated MySQL orders.
// No Cloudflare Worker proxy, no live orders, no package import.
const {createImportOSStore}=require('./importos-store.js');
const path=require('node:path');
const HOST='gleaming-orangered-crow-58.hostingersite.com';
const ORIGIN='https://'+HOST;
const SHA='fa6f75f0d61a48060e7f6b69583874e79d55be5b9499563b2c2a252a20190424';
const ACCOUNT='c7c8ad399f1e851d1c3a8be34e66f822';
const PACKAGE_DB='9c3fc741-5cb0-432f-82ca-c75e8220c435';
const TABLE='danini_hostinger_sandbox_digital_orders';
const META='SELECT sha256,byte_length,chunk_count,ready FROM danini_digital_packages WHERE sha256=? AND ready=1';
const CHUNKS='SELECT chunk_index,data_b64 FROM danini_digital_package_chunks WHERE sha256=? AND chunk_index>=? ORDER BY chunk_index LIMIT 8';
const ORDER_READ='SELECT * FROM danini_digital_orders WHERE reference=?';
const WRITES=new Set([
 "INSERT INTO danini_digital_orders(reference,sku,email,language,amount_cents,status,email_state,package_sha256) VALUES (?,?,?,?,?,'PENDING','PENDING',?)",
 "UPDATE danini_digital_orders SET status='CREATED',paypal_order_id=? WHERE reference=? AND status='PENDING'",
 "UPDATE danini_digital_orders SET status='PROCESSING',processing_at=datetime('now') WHERE reference=? AND (status='CREATED' OR (status='PROCESSING' AND processing_at < datetime('now','-2 minutes')))",
 "UPDATE danini_digital_orders SET status='PAID',capture_id=?,paid_at=?,processing_at=NULL WHERE reference=? AND status='PROCESSING'",
 "UPDATE danini_digital_orders SET status='CREATED',processing_at=NULL WHERE reference=? AND status='PROCESSING'",
 "UPDATE danini_digital_orders SET email_state='SENDING' WHERE reference=? AND status='PAID' AND email_state='PENDING'",
 "UPDATE danini_digital_orders SET email_state='SENT',email_sent_at=datetime('now') WHERE reference=?",
 "UPDATE danini_digital_orders SET email_state='PENDING' WHERE reference=? AND email_state='SENDING'"
]);
const schema=`CREATE TABLE IF NOT EXISTS ${TABLE} (
 reference VARCHAR(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
 sku VARCHAR(32) NOT NULL, email VARCHAR(191) NOT NULL, language CHAR(2) NOT NULL,
 amount_cents INT NOT NULL, status VARCHAR(16) NOT NULL, email_state VARCHAR(16) NOT NULL,
 package_sha256 CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
 paypal_order_id VARCHAR(80), capture_id VARCHAR(80), created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 processing_at DATETIME, paid_at VARCHAR(32), email_sent_at DATETIME,
 UNIQUE KEY sandbox_paypal_order(paypal_order_id), UNIQUE KEY sandbox_capture(capture_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;
function createDigitalDatabase(pool,token,fetcher=globalThis.fetch){
 async function packageQuery(sql,args){
  if(![META,CHUNKS].includes(sql)||args[0]!==SHA||
   (sql===META?args.length!==1:args.length!==2||!Number.isInteger(args[1])||args[1]<0||args[1]>=400))throw Error('package_query_denied');
  const response=await fetcher('https://api.cloudflare.com/client/v4/accounts/'+ACCOUNT+'/d1/database/'+PACKAGE_DB+'/query',{
   method:'POST',redirect:'error',headers:{Authorization:'Bearer '+token,'content-type':'application/json'},
   body:JSON.stringify({sql,params:args.map(String)}),signal:AbortSignal.timeout(12000)});
  if(!response.ok)throw Error('package_unavailable');
  const data=await response.json();
  const result=data.result?.[0];
  if(data.success!==true||data.result.length!==1||result?.success!==true||!Array.isArray(result.results))throw Error('package_unavailable');
  return result.results;
 }
 return {prepare(sql){return {bind(...args){return {
  async first(){
   if(sql===META)return (await packageQuery(sql,args))[0]||null;
   if(sql!==ORDER_READ)throw Error('order_query_denied');
   const [rows]=await pool.execute(sql.replace('danini_digital_orders',TABLE),args);return rows[0]||null;
  },
  async all(){if(sql!==CHUNKS)throw Error('package_query_denied');return {results:await packageQuery(sql,args)};},
  async run(){
   if(!WRITES.has(sql))throw Error('order_write_denied');
   if(sql.startsWith('INSERT ')&&(args[1]!=='guide'||args[4]!==4900||args[5]!==SHA))throw Error('order_write_denied');
   const query=sql.replace('danini_digital_orders',TABLE).replace("datetime('now','-2 minutes')","DATE_SUB(UTC_TIMESTAMP(), INTERVAL 2 MINUTE)").replace("datetime('now')","UTC_TIMESTAMP()");
   const [result]=await pool.execute(query,args);return {meta:{changes:result.affectedRows}};
  }
 };}};}};
}
function runtimeEnv(env){
 const email=env.DANINI_PAYPAL_SANDBOX_EMAIL?.trim().toLowerCase();
 if(env.HOSTINGER_DIGITAL_SANDBOX_ENABLED!=='true'||env.PAYPAL_ENV!=='sandbox'||
 env.DANINI_DIGITAL_CHECKOUT_ENABLED!=='true'||env.DANINI_PREMIUM_ZIP_SHA256!==SHA||
 !email||email!==env.MAIL_TEST_RECIPIENT?.trim().toLowerCase()||!env.DANINI_PACKAGE_D1_READ_TOKEN)return null;
 return {...env,SITE_ORIGIN:ORIGIN,PAYPAL_ENV:'sandbox',DANINI_DIGITAL_LIVE_APPROVED:'false',DANINI_DIGITAL_CONTENT_APPROVED:'false',DANINI_PAYPAL_SANDBOX_EMAIL:email};
}
const PREFIX='/api/danini/digital/';
const routes=new Map([['status','GET'],['paypal/sandbox/checkout','POST'],['paypal/return','GET'],['paypal/webhook','POST']]);
function allowedRoute(pathname,method){
 const suffix=pathname.slice(PREFIX.length);
 return pathname.startsWith(PREFIX)&&(routes.get(suffix)===method||(/^download\/DGD-[A-F0-9]{32}$/.test(suffix)&&method==='GET'));
}
function mountHostingerDigital(app,express,dist,env=process.env){
 const config=runtimeEnv(env);
 const noStore=(res)=>res.set({'Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','X-Frame-Options':'DENY'});
 let pending;
 async function db(){
  if(!pending)pending=(async()=>{
   const store=createImportOSStore({env});
   if(!store.connectionOptions)throw Error('database_required');
   const pool=require('mysql2/promise').createPool({...store.connectionOptions,connectionLimit:5,queueLimit:20,connectTimeout:5000});
   try{await pool.execute(schema);return createDigitalDatabase(pool,env.DANINI_PACKAGE_D1_READ_TOKEN);}
   catch(e){await pool.end().catch(()=>{});throw e;}
  })().catch(e=>{pending=undefined;throw e;});
  return pending;
 }
 app.get('/operator/sandbox-checkout/',(req,res)=>{
  noStore(res);
  if(!config||req.hostname!==HOST||!dist)return res.sendStatus(404);
  return res.sendFile(path.join(dist,'operator','sandbox-checkout','index.html'));
 });
 const parse=express.raw({type:'application/json',limit:100000,inflate:false});
 app.all(/^\/api\/danini\/digital\//,(req,res,next)=>{
  noStore(res);
  if(req.hostname!==HOST)return res.sendStatus(404);
  if(!allowedRoute(req.path,req.method))return res.status(404).json({error:'NOT_FOUND'});
  if(!config){
   if(req.path===PREFIX+'status')return res.json({ok:true,enabled:false,mode:'disabled',guidePriceEur:49,softwareEnabled:false,packageVersion:null,sandboxReady:false,delivery:'private-d1-zip'});
   return res.status(503).json({error:'CHECKOUT_NOT_READY'});
  }
  if(req.path===PREFIX+'paypal/sandbox/checkout'&&req.get('origin')!==ORIGIN)return res.status(403).json({error:'INVALID_ORIGIN'});
  return parse(req,res,error=>error?res.status(error.status===413?413:400).json({error:'INVALID_BODY'}):next());
 },async(req,res)=>{
  try{
   const {digitalRoute,configured}=await import('./workers/danini-digital-commerce.mjs');
   if(!configured({...config,DANINI_DB:true}))return res.status(503).json({error:'CHECKOUT_NOT_READY'});
   const headers=new Headers();
   for(const name of ['origin','content-type','x-danini-sandbox-access','paypal-auth-algo','paypal-cert-url','paypal-transmission-id','paypal-transmission-sig','paypal-transmission-time']){
    const value=req.get(name);if(value)headers.set(name,value);
   }
   if(req.path===PREFIX+'paypal/sandbox/checkout'){
    if(!Buffer.isBuffer(req.body)||req.body.length>12000)return res.status(400).json({error:'INVALID_BODY'});
    let data;try{data=JSON.parse(req.body.toString('utf8'));}catch{return res.status(400).json({error:'INVALID_JSON'});}
    if(data?.expectedDelivery!=='private-d1-zip')return res.status(409).json({error:'PRODUCT_VERSION_MISMATCH'});
   }
   const request=new Request(ORIGIN+req.originalUrl,{method:req.method,headers,...(req.method==='POST'?{body:req.body}: {})});
   const response=await digitalRoute(request,{...config,DANINI_DB:await db()});
   res.set(Object.fromEntries(response.headers));
   return res.status(response.status).send(Buffer.from(await response.arrayBuffer()));
  }catch{return res.status(503).json({error:'DIGITAL_SERVICE_UNAVAILABLE'});}
 });
}
module.exports={createDigitalDatabase,runtimeEnv,allowedRoute,mountHostingerDigital,META,CHUNKS,ORDER_READ,SHA,TABLE};
