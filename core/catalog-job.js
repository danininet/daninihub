'use strict';
const crypto=require('node:crypto');
const engine=require('./catalog-proof');
const {tokenHash,validToken}=require('./purchase-case');
const sha=value=>crypto.createHash('sha256').update(typeof value==='string'?value:JSON.stringify(value)).digest('hex');
function createCatalogJobs(store) {
  function audit(p,action,evidence){return {...p,version:p.version+1,events:[...p.events,{at:new Date().toISOString(),action,evidence}]};}
  async function record(id){const r=await store.get(id);if(!r||r.type!=='catalog-job')throw Error('NOT_FOUND');if(Date.parse(r.payload.expiresAt)<=Date.now())throw Error('EXPIRED');return r;}
  async function commit(r,p){return store.updateIfUnchanged(r.reference,r.payload,p);}
  return {
    async create(input) {
      engine.analyze(input); // Strict validation before any persistence.
      const id='CAT-'+crypto.randomBytes(16).toString('hex'),token=crypto.randomBytes(32).toString('base64url');
      const payload={version:0,tokenHash:tokenHash(token),state:'QUEUED',input:{sourceCSV:input.sourceCSV,targetCSV:input.targetCSV,delimiter:input.delimiter||',',decimal:input.decimal||'.',sourceAuthorized:true},
        inputHash:sha([input.sourceCSV,input.targetCSV,input.delimiter||',',input.decimal||'.']),expiresAt:new Date(Date.now()+7*86400000).toISOString(),events:[],result:null,approval:null,usage:{modelCalls:0,inputTokens:0,outputTokens:0,apiCostEur:0},payment:{status:'NOT_CHARGED',provider:null}};
      await store.create({reference:id,type:'catalog-job',language:input.language==='de'?'de':'sr',status:'PILOT',payload});
      return {id,token};
    },
    async get(id,token){const r=await record(id);if(!validToken(r.payload.tokenHash,token))throw Error('NOT_FOUND');const {tokenHash:_,input,...p}=r.payload;return {id,language:r.language,...p};},
    async advance(id) {
      const r=await record(id),p=r.payload;
      if(p.state==='QUEUED')return commit(r,{...audit(p,'INPUT_VALIDATED',p.inputHash),state:'VALIDATED'});
      if(p.state==='VALIDATED') {
        const result=engine.analyze(p.input),resultHash=sha(result);
        return commit(r,{...audit(p,'COMPARISON_COMPLETED',resultHash),state:'REVIEW_REQUIRED',result,resultHash});
      }
      return r; // Resume and repeated runs are idempotent.
    },
    async approve(id,{version,resultHash,note}) {
      const r=await record(id),p=r.payload;
      if(p.version!==version)throw Error('CASE_VERSION_CONFLICT');
      if(p.state!=='REVIEW_REQUIRED'||resultHash!==p.resultHash||!String(note||'').trim())throw Error('APPROVAL_REQUIRED');
      return commit(r,{...audit(p,'REPORT_RELEASE_APPROVED',resultHash),state:'READY',approval:{note:String(note).slice(0,1000),scope:'Report and partial source-backed draft only; unresolved rows remain excluded.',at:new Date().toISOString()}});
    },
    async deliver(id,token) {
      const r=await record(id),p=r.payload;
      if(!validToken(p.tokenHash,token))throw Error('NOT_FOUND');
      if(!['READY','DELIVERED'].includes(p.state))throw Error('REVIEW_REQUIRED');
      if(sha(p.result)!==p.resultHash)throw Error('INTEGRITY_FAILURE');
      if(p.state==='READY')await commit(r,{...audit(p,'DOWNLOAD_PREPARED',p.resultHash),state:'DELIVERED'});
      return {id,result:p.result,resultHash:p.resultHash,payment:p.payment,notice:'Technical pilot. No payment taken. Download prepared does not prove customer receipt.'};
    },
    async list(){return (await store.listByType('catalog-job',100)).map(r=>({id:r.reference,state:r.payload.state,version:r.payload.version,resultHash:r.payload.resultHash,expiresAt:r.payload.expiresAt,issueCount:r.payload.result?.issues.length||0,apiCostEur:r.payload.usage.apiCostEur}));}
  };
}
module.exports={createCatalogJobs,sha};
