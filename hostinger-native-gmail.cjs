'use strict';
// Native Hostinger adapter; reuse the reviewed Gmail core without Cloudflare bindings.
const {createHash,createHmac,timingSafeEqual}=require('node:crypto');
const {createImportOSStore}=require('./importos-store.js');
function adapter(pool){
 return {prepare(sql){return {bind(...args){
  const query=sql.replace(/^INSERT OR IGNORE INTO /,'INSERT IGNORE INTO ');
  return {async first(){const [rows]=await pool.execute(query,args);return rows[0]||null;},
   async all(){const [rows]=await pool.execute(query,args);return {results:rows};},
   async run(){const [result]=await pool.execute(query,args);return {meta:{changes:result.affectedRows}};}};
 }}}};
}
function createNativeGmail({env=process.env,storeFactory=createImportOSStore,loadCore=()=>require('./hostinger-gmail-core.cjs')}={}){
 let pending;
 async function database(){
  if(!pending)pending=(async()=>{
   const store=storeFactory({env});
   if(!store.databaseConfigured)throw Error('database_required');
   await store.init();
   if(store.mode!=='mysql'||!store.pool)throw Error('database_required');
   try{
    await store.pool.execute("CREATE TABLE IF NOT EXISTS gmail_intake_queue (id VARCHAR(64) PRIMARY KEY, received_at BIGINT NOT NULL, expires_at BIGINT NOT NULL, language VARCHAR(16) NOT NULL, vertical VARCHAR(64) NOT NULL, intent VARCHAR(64) NOT NULL, risk VARCHAR(64) NOT NULL, draft TEXT NOT NULL, status VARCHAR(32) NOT NULL DEFAULT 'awaiting_review', INDEX gmail_expiry(expires_at))");
    await store.pool.execute("CREATE TABLE IF NOT EXISTS auth_nonces (nonce VARCHAR(80) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY, expires_at BIGINT NOT NULL, INDEX nonce_expiry(expires_at))");
    return store.pool;
   }catch(e){await store.pool.end().catch(()=>{});throw e;}
  })().catch(e=>{pending=undefined;throw e;});
  return pending;
 }
 return async function handler(req,res){
  res.set({'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'no-referrer'});
  const isPoll=req.method==='POST'&&req.originalUrl==='/portal/gmail-intake/poll';
  const isQueue=req.method==='GET'&&req.originalUrl==='/portal/gmail-intake';
  if(!isPoll&&!isQueue)return res.sendStatus(404);
  // Only the existing signed director protocol; never trust a forwarded identity header.
  if(!env.DIRECTOR_HMAC_SECRET||env.DIRECTOR_HMAC_SECRET.length<32)return res.status(503).json({error:'director_not_configured'});
  if(!req.get('x-danini-signature')||!req.get('x-danini-timestamp')||!req.get('x-danini-nonce'))return res.status(401).json({error:'unauthorized'});
  const time=req.get('x-danini-timestamp'),nonce=req.get('x-danini-nonce'),sig=req.get('x-danini-signature');
  const body=isPoll?JSON.stringify(req.body):'';
  if(typeof body!=='string'||!/^\d{10}$/.test(time)||Math.abs(Date.now()/1000-Number(time))>300||!/^[a-zA-Z0-9_-]{20,80}$/.test(nonce)||!/^[a-f0-9]{64}$/.test(sig))return res.status(401).json({error:'unauthorized'});
  const signed=[req.method,req.originalUrl,time,nonce,createHash('sha256').update(body).digest('hex')].join('\n');
  const expected=createHmac('sha256',env.DIRECTOR_HMAC_SECRET).update(signed).digest();
  if(!timingSafeEqual(expected,Buffer.from(sig,'hex')))return res.status(401).json({error:'unauthorized'});
  try{
   const headers=new Headers();
   for(const k of ['x-danini-signature','x-danini-timestamp','x-danini-nonce','content-type'])if(req.get(k))headers.set(k,req.get(k));
   const request=new Request('https://native.invalid'+req.originalUrl,{method:req.method,headers,...(isPoll?{body:JSON.stringify(req.body)}:{})});
   const pool=await database();
   const core=loadCore();
   const runtime={...env,DANINI_DB:adapter(pool),AI_ENABLED:'false'};
   const response=await (isPoll?core.gmailPoll(request,runtime):core.gmailQueue(request,runtime));
   // Purge expired records only following successful authenticated requests.
   if(response.ok){const now=Math.floor(Date.now()/1000);await pool.execute('DELETE FROM gmail_intake_queue WHERE expires_at<=?',[now]);await pool.execute('DELETE FROM auth_nonces WHERE expires_at<=?',[now]);}
   return res.status(response.status).type('application/json').send(await response.text());
  }catch(e){
   const status=Number.isInteger(e.status)&&e.status>=400&&e.status<600?e.status:503;
   const allowed=new Set(['unauthorized','replayed_request','director_not_configured','gmail_intake_not_configured','invalid_fields','json_required','empty_body','invalid_json','too_large','gmail_provider_unavailable','gmail_invalid_response','gmail_response_too_large','gmail_readonly_scope_required','gmail_account_mismatch','gmail_label_mismatch']);
   return res.status(status).json({error:(allowed.has(e.message)||/^gmail_(oauth|profile|label|list|metadata|message)_(network|http_[1-5][0-9]{2})$/.test(e.message))?e.message:'gmail_runtime_unavailable'});
  }
 };
}
module.exports={adapter,createNativeGmail};
