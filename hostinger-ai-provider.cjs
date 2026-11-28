'use strict';
// One constrained Workers AI REST adapter. No arbitrary model, provider or URL.
const BASE='https://api.cloudflare.com/client/v4/accounts/c7c8ad399f1e851d1c3a8be34e66f822/ai/run/';
const TEXT='@cf/meta/llama-3.1-8b-instruct-fast';
const VISION='@cf/qwen/qwen3.8-27b';
function createWorkersAI({token,fetcher=globalThis.fetch,reserve}={}){
 if(typeof token!=='string'||!token.trim()||typeof reserve!=='function')throw Error('ai_not_configured');
 return {async run(model,input){
  if(model!==TEXT&&model!==VISION)throw Error('ai_model_not_allowed');
  if(!input||typeof input!=='object'||!Array.isArray(input.messages)||input.messages.length<2||input.messages.length>6)throw Error('ai_invalid_input');
  const limit=model===VISION?600:520;
  const max=model===VISION?input.max_completion_tokens:input.max_tokens;
  if(!Number.isInteger(max)||max<1||max>limit||input.stream)throw Error('ai_output_limit');
  const body=JSON.stringify(input);
  if(Buffer.byteLength(body)>(model===VISION?1300000:20000))throw Error('ai_input_limit');
  if(!await reserve(model))throw Error('ai_budget_unavailable_or_exhausted');
  const response=await fetcher(BASE+model,{method:'POST',headers:{Authorization:'Bearer '+token,'content-type':'application/json'},body,redirect:'error',signal:AbortSignal.timeout(12000)});
  if(!response.ok)throw Error('ai_provider_unavailable');
  const reader=response.body?.getReader();if(!reader)throw Error('ai_invalid_response');
  const chunks=[];let size=0;
  try{for(;;){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>65536){await reader.cancel();throw Error('ai_response_limit');}chunks.push(Buffer.from(value));}}finally{reader.releaseLock();}
  const data=JSON.parse(Buffer.concat(chunks).toString('utf8'));
  if(data.success!==true||!data.result||typeof data.result!=='object'||Array.isArray(data.result))throw Error('ai_invalid_response');
  return data.result;
 }};
}
// MySQL reservation uses a single transaction and row lock. Requests are never refunded
// on provider errors because the inference may already have consumed provider capacity.
function createAIQuota(pool,scope,limits={text:8,vision:6}){
 if(!['academy','vehicle'].includes(scope))throw Error('ai_scope_invalid');
 return async model=>{
  const kind=model===TEXT?'text':model===VISION?'vision':null;
  const limit=kind&&limits[kind];
  if(!Number.isInteger(limit)||limit<1||limit>(kind==='vision'?6:scope==='academy'?8:20))return false;
  const key=scope+':'+kind+':'+new Date().toISOString().slice(0,10);
  const conn=await pool.getConnection();
  try{
   await conn.beginTransaction();
   await conn.execute('INSERT IGNORE INTO danini_ai_daily_quota (bucket,used,expires_at) VALUES (?,0,?)',[key,Math.floor(Date.now()/1000)+172800]);
   const [r]=await conn.execute('UPDATE danini_ai_daily_quota SET used=used+1 WHERE bucket=? AND used<?',[key,limit]);
   await conn.commit();
   return r.affectedRows===1;
  }catch(error){await conn.rollback();throw error;}finally{conn.release();}
 };
}
async function initializeAIQuota(pool){
 await pool.execute('CREATE TABLE IF NOT EXISTS danini_ai_daily_quota (bucket VARCHAR(96) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY, used INT UNSIGNED NOT NULL, expires_at BIGINT NOT NULL, INDEX ai_quota_expiry(expires_at)) ENGINE=InnoDB');
}
module.exports={createWorkersAI,createAIQuota,initializeAIQuota,TEXT,VISION,BASE};
