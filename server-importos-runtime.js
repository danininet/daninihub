'use strict';

const express=require('express');
const {evaluateImport}=require('./core/importos-engine');
const {listModelDna,getModelDna}=require('./core/importos-model-dna');

function mountImportOSRuntime(app){
  app.use('/api/importos',express.json({limit:'80kb'}));

  app.get('/api/importos/models',(req,res)=>{
    return res.json({ok:true,models:listModelDna().map(x=>({key:x.key,label:x.label,sourceQuality:x.sourceQuality}))});
  });

  app.get('/api/importos/model/:key',(req,res)=>{
    const item=getModelDna(req.params.key);
    if(!item) return res.status(404).json({ok:false,error:'MODEL_DNA_NOT_FOUND'});
    return res.json({ok:true,model:item});
  });

  app.post('/api/importos/evaluate',(req,res)=>{
    try{
      const result=evaluateImport(req.body||{});
      return res.json({ok:true,result});
    }catch(error){
      return res.status(400).json({ok:false,error:error.message||'IMPORTOS_EVALUATION_FAILED'});
    }
  });
}

module.exports={mountImportOSRuntime};
