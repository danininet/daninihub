'use strict';
// Native bindings for the existing private storage and workflow, not a web proxy.
const BASE='https://api.cloudflare.com/client/v4/accounts/c7c8ad399f1e851d1c3a8be34e66f822';
const R2=BASE+'/r2/buckets/danini-b2b-private/objects/';
const WORKFLOW=BASE+'/workflows/danini-intake-production/instances';
const UUID='[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
const ID=new RegExp('^'+UUID+'$');
const KEY=new RegExp('^cases/'+UUID+'/(?:intake|draft|revision-'+UUID+')\\.json$');
const MAX_BYTES=256*1024;
function requireToken(value){if(typeof value!=='string'||!value.trim())throw Error('b2b_binding_not_configured');}
async function call(fetcher,url,token,opts={}){
 return fetcher(url,{...opts,redirect:'error',headers:{Authorization:'Bearer '+token,...opts.headers},signal:AbortSignal.timeout(12000)});
}
async function envelope(response){
 if(!response.ok)throw Error('b2b_binding_unavailable');
 const data=await response.json();
 if(data.success!==true||!data.result||typeof data.result!=='object')throw Error('b2b_binding_invalid_response');
 return data.result;
}
function createB2BR2({readToken,writeToken,fetcher=globalThis.fetch}={}){
 requireToken(readToken);requireToken(writeToken);
 if(readToken===writeToken)throw Error('b2b_r2_token_separation_required');
 function url(key){if(typeof key!=='string'||!KEY.test(key))throw Error('b2b_object_key_not_allowed');return R2+key;}
 return {
  async get(key){
   const response=await call(fetcher,url(key),readToken);
   if(response.status===404)return null;
   if(!response.ok)throw Error('b2b_r2_unavailable');
   const reader=response.body?.getReader();if(!reader)throw Error('b2b_r2_invalid_body');
   const chunks=[];let size=0;
   try{for(;;){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>MAX_BYTES){await reader.cancel();throw Error('b2b_r2_body_too_large');}chunks.push(Buffer.from(value));}}finally{reader.releaseLock();}
   const raw=Buffer.concat(chunks).toString('utf8');
   JSON.parse(raw);
   return {async text(){return raw;},async json(){return JSON.parse(raw);}};
  },
  async put(key,body){
   const target=url(key);
   if(typeof body!=='string'||Buffer.byteLength(body)>MAX_BYTES)throw Error('b2b_r2_invalid_body');
   JSON.parse(body);
   const result=await envelope(await call(fetcher,target,writeToken,{method:'PUT',headers:{'content-type':'application/json'},body}));
   if(result.key!==key)throw Error('b2b_r2_invalid_response');
   return result;
  }
 };
}
function createB2BWorkflow({readToken,writeToken,fetcher=globalThis.fetch}={}){
 requireToken(readToken);requireToken(writeToken);
 if(readToken===writeToken)throw Error('b2b_workflow_token_separation_required');
 function instance(id){
  if(typeof id!=='string'||!ID.test(id))throw Error('b2b_workflow_id_not_allowed');
  return {
   id,
   async status(){
    const result=await envelope(await call(fetcher,WORKFLOW+'/'+id,readToken));
    if(!['queued','running','paused','errored','terminated','complete','waitingForPause','waiting','rollingBack'].includes(result.status))throw Error('b2b_workflow_invalid_status');
    return {status:result.status};
   },
   async sendEvent(event){
    if(event?.type!=='director-decision'||typeof event.payload?.decisionId!=='string'||!ID.test(event.payload.decisionId))throw Error('b2b_workflow_event_not_allowed');
    const result=await envelope(await call(fetcher,WORKFLOW+'/'+id+'/events/director-decision',writeToken,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({decisionId:event.payload.decisionId})}));
    if(result.instanceId!==id)throw Error('b2b_workflow_event_unconfirmed');
   }
  };
 }
 return {
  async get(id){return instance(id);},
  async create({id,params}){
   const binding=instance(id);
   if(params?.caseId!==id)throw Error('b2b_workflow_payload_not_allowed');
   const result=await envelope(await call(fetcher,WORKFLOW,writeToken,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({instance_id:id,params:JSON.stringify({caseId:id})})}));
   if(result.id!==id)throw Error('b2b_workflow_invalid_response');
   return binding;
  }
 };
}
module.exports={createB2BR2,createB2BWorkflow,R2,WORKFLOW};
