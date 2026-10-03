'use strict';
const crypto=require('node:crypto');
const {STEPS,initialCase,updateCase,publicCase,validToken,tokenHash}=require('./core/purchase-case');
function mountPurchaseCases(app,{store,adminAllowed}){
  app.get('/api/importos/cases/:reference',async(req,res)=>{
    res.set({'Cache-Control':'no-store','Referrer-Policy':'no-referrer'});
    const record=await store.get(String(req.params.reference).slice(0,80));
    if(!record||record.type!=='service-request'||!validToken(record.payload?.caseTokenHash,req.headers['x-case-token']||''))return res.status(404).json({ok:false,error:'CASE_NOT_FOUND'});
    return res.json({ok:true,case:publicCase(record)});
  });
  app.get('/api/importos/admin/cases/:reference',async(req,res)=>{
    res.set('Cache-Control','no-store');if(!adminAllowed(req))return res.status(403).json({ok:false,error:'FORBIDDEN'});
    const record=await store.get(String(req.params.reference).slice(0,80));if(!record||record.type!=='service-request')return res.status(404).json({ok:false,error:'CASE_NOT_FOUND'});
    return res.json({ok:true,case:record.payload?.purchaseCase||initialCase(),labels:STEPS.map(([id,sr,de])=>({id,sr,de})),request:{reference:record.reference,vehicle:record.payload?.vehicle,message:record.payload?.message}});
  });
  app.put('/api/importos/admin/cases/:reference',async(req,res)=>{
    res.set('Cache-Control','no-store');if(!adminAllowed(req))return res.status(403).json({ok:false,error:'FORBIDDEN'});
    const record=await store.get(String(req.params.reference).slice(0,80));if(!record||record.type!=='service-request')return res.status(404).json({ok:false,error:'CASE_NOT_FOUND'});
    try{const purchaseCase=updateCase(record.payload?.purchaseCase,req.body||{});await store.updateIfUnchanged(record.reference,record.payload,{...record.payload,purchaseCase});return res.json({ok:true,case:purchaseCase})}catch(error){return res.status(error.message==='CASE_VERSION_CONFLICT'?409:400).json({ok:false,error:error.message})}
  });
  app.post('/api/importos/admin/cases/:reference/link',async(req,res)=>{
    res.set('Cache-Control','no-store');if(!adminAllowed(req))return res.status(403).json({ok:false,error:'FORBIDDEN'});
    const record=await store.get(String(req.params.reference).slice(0,80));if(!record||record.type!=='service-request')return res.status(404).json({ok:false,error:'CASE_NOT_FOUND'});
    const token=crypto.randomBytes(32).toString('base64url'),c=record.payload?.purchaseCase||initialCase();
    const purchaseCase={...c,version:c.version+1,history:[...(c.history||[]).slice(-99),{version:c.version+1,at:new Date().toISOString(),action:'LINK_ROTATED'}]};
    try{await store.updateIfUnchanged(record.reference,record.payload,{...record.payload,purchaseCase,caseTokenHash:tokenHash(token)});
      const route='/'+record.language+'/'+(record.language==='sr'?'moj-dosije':'mein-dossier');
      return res.json({ok:true,trackingPath:route+'#'+new URLSearchParams({reference:record.reference,token}).toString(),case:purchaseCase});
    }catch(error){return res.status(409).json({ok:false,error:'CASE_VERSION_CONFLICT'})}
  });
}
module.exports={mountPurchaseCases};
