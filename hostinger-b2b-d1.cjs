'use strict';
// Fixed existing production database. No request-controlled destinations or arbitrary SQL.
// This adapter is not mounted until the production B2B service is independently verified.
const D1_URL='https://api.cloudflare.com/client/v4/accounts/c7c8ad399f1e851d1c3a8be34e66f822/d1/database/9c3fc741-5cb0-432f-82ca-c75e8220c435/query';
const ALLOWED=new Set([
  "INSERT INTO audit_logs VALUES (?,?,?,?,?)",
  "INSERT OR IGNORE INTO workflow_events VALUES (?,?,?,?,?)",
  "INSERT INTO rate_buckets VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count",
  "SELECT id,reference,payload_hash,workflow_started,status FROM cases WHERE request_key=?",
  "INSERT OR IGNORE INTO cases(id,tenant_id,reference,request_key,payload_hash,status,vertical,language,country,created_at,expires_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
  "INSERT INTO case_files VALUES (?,?,?,?,?,?)",
  "UPDATE cases SET status='received' WHERE id=? AND status='storing'",
  "UPDATE cases SET status='storage_failed' WHERE id=?",
  "UPDATE cases SET workflow_started=1 WHERE id=?",
  "SELECT reference,status,created_at,expires_at,draft_hash FROM cases WHERE id=? AND expires_at>?",
  "SELECT count(*) AS n FROM audit_logs WHERE case_id=? AND action='draft_revised'",
  "UPDATE cases SET status=?,approved_hash=?,decision_id=?,decision_at=? WHERE id=? AND status='awaiting_approval' AND draft_hash=? AND expires_at>? AND review_deadline>? AND decision_id IS NULL",
  "SELECT id,reference,status,vertical,language,country,created_at,review_deadline,delivery_status,draft_hash,expires_at FROM cases WHERE id=? AND expires_at>?",
  "SELECT action,actor,created_at FROM audit_logs WHERE case_id=? ORDER BY created_at DESC LIMIT 100",
  "SELECT id,state,created_at FROM mail_outbox WHERE case_id=? ORDER BY created_at DESC LIMIT 20",
  "SELECT id,reference,status,vertical,language,created_at,review_deadline,delivery_status FROM cases WHERE tenant_id='danini' AND expires_at>? ORDER BY created_at DESC LIMIT 50",
  "UPDATE cases SET status='revising' WHERE id=? AND status='revision_requested' AND draft_hash=? AND expires_at>? AND review_deadline>?",
  "UPDATE cases SET status='awaiting_approval',draft_hash=?,approved_hash=NULL,decision_id=NULL,decision_at=NULL WHERE id=? AND status='revising'",
  "UPDATE cases SET status='revision_failed' WHERE id=? AND status='revising'",
  "INSERT OR IGNORE INTO auth_nonces(nonce,expires_at) VALUES (?,?)"
]);
function createB2BD1({readToken,writeToken,fetcher=globalThis.fetch}={}){
 if(!readToken||!writeToken||readToken===writeToken)throw Error('b2b_d1_not_configured');
 const statements=new WeakMap();
 async function execute(items,batch=false){
  if(!items.length||items.length>20||items.some(x=>!x))throw Error('invalid_d1_batch');
  const write=items.some(x=>!x.sql.startsWith('SELECT '));
  const response=await fetcher(D1_URL,{method:'POST',redirect:'error',headers:{Authorization:'Bearer '+(write?writeToken:readToken),'content-type':'application/json'},body:JSON.stringify(batch?{batch:items}:items[0]),signal:AbortSignal.timeout(12000)});
  if(!response.ok)throw Error('b2b_d1_unavailable');
  const result=await response.json();
  if(result.success!==true||!Array.isArray(result.result)||result.result.length!==items.length||result.result.some(x=>x.success!==true||!Array.isArray(x.results)||typeof x.meta?.changes!=='number'))throw Error('b2b_d1_invalid_response');
  return result.result.map(x=>({success:true,results:x.results,meta:{changes:x.meta.changes}}));
 }
 function prepare(sql){
  const query=String(sql).replace(/\s+/g,' ').trim();
  if(!ALLOWED.has(query))throw Error('b2b_sql_not_allowed');
  return {bind(...params){
   if(params.length!==(query.match(/\?/g)||[]).length||params.some(v=>v!==null&&typeof v!=='string'&&!(typeof v==='number'&&Number.isFinite(v))))throw Error('invalid_d1_parameters');
   const item={sql:query,params};
   const bound={async first(){return (await execute([item]))[0].results[0]??null;},async all(){return (await execute([item]))[0];},async run(){return (await execute([item]))[0];}};
   statements.set(bound,item);
   return bound;
  }};
 }
 return {prepare,async batch(bound){if(!Array.isArray(bound))throw Error('invalid_d1_batch');return execute(bound.map(x=>statements.get(x)),true);}};
}
module.exports={createB2BD1,D1_URL};
