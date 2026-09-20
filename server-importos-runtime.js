'use strict';

const crypto=require('crypto');
const express=require('express');
const path=require('path');
const Stripe=require('stripe');
const {evaluateImport,estimateFieldServices}=require('./core/importos-engine');
const {listModelDna,getModelDna}=require('./core/importos-model-dna');
const {createContactLeadStore}=require('./contact-lead-store');

const clean=(v,max=4000)=>String(v||'').trim().slice(0,max);
const html=v=>clean(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const eur=v=>new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format(Number(v||0));

function publicUrl(req){
  const configured=clean(process.env.DANINI_PUBLIC_URL,500).replace(/\/$/,'');
  if(configured) return configured;
  const proto=clean(req.headers['x-forwarded-proto']||req.protocol||'https',20).split(',')[0].trim();
  return proto+'://'+req.get('host');
}

function previewResult(full){
  return {
    product:full.product,
    version:full.version,
    decision:full.decision,
    route:full.route,
    customsBasis:full.customsBasis,
    importability:{status:full.importability.status,historic:full.importability.historic,issues:full.importability.issues.slice(0,2)},
    originProof:full.originProof,
    scenarios:full.scenarios.map(x=>({name:x.name,dutyRate:x.dutyRate,total:x.total,duty:x.duty,vat:x.vat,grossSpread:x.grossSpread,marginPct:x.marginPct})),
    corridor:full.corridor,
    fraud:{score:full.fraud.score,verdict:full.fraud.verdict,flagCount:full.fraud.flags.length},
    modelDna:full.modelDna?{key:full.modelDna.key,label:full.modelDna.label,sourceQuality:full.modelDna.sourceQuality}:null,
    premiumLocked:true,
    priceEur:9.90
  };
}

function orderRef(){
  return 'IMP-'+new Date().toISOString().slice(0,10).replace(/-/g,'')+'-'+crypto.randomBytes(3).toString('hex').toUpperCase();
}

function renderPaidReport(lead){
  const result=lead?.payload?.result;
  if(!result) return '<h1>Import Passport nije pronađen.</h1>';
  const scenarios=(result.scenarios||[]).map(s=>`<article><h3>${html(s.name)}</h3><p><strong>${eur(s.total)}</strong></p><p>Carina: ${eur(s.duty)} · PDV: ${eur(s.vat)}</p></article>`).join('');
  const flags=(result.fraud?.flags||[]).map(f=>`<li><strong>${html(f.code)}</strong> — ${html(f.text)}</li>`).join('')||'<li>Nema aktiviranih osnovnih crvenih zastavica iz unetih podataka.</li>';
  const dna=result.modelDna
    ? `<h2>Model DNA · ${html(result.modelDna.label)}</h2><h3>Prednosti</h3><ul>${result.modelDna.strengths.map(x=>'<li>'+html(x)+'</li>').join('')}</ul><h3>Proveriti</h3><ul>${result.modelDna.watch.map(x=>'<li>'+html(x)+'</li>').join('')}</ul>`
    : '<h2>Model DNA</h2><p>Za ovaj model još nije izabran profil.</p>';
  const diy=(result.checklists?.diy||[]).map(x=>'<li>'+html(x)+'</li>').join('');
  const broker=(result.checklists?.broker||[]).map(x=>'<li>'+html(x)+'</li>').join('');
  const sources=(result.sources||[]).map(s=>`<li><a href="${html(s.url)}" target="_blank" rel="noreferrer">${html(s.title)}</a> · ${html(s.verifiedAt)}</li>`).join('');
  return `<!doctype html><html lang="sr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Import Passport ${html(lead.reference)}</title><style>body{margin:0;background:#f4f0e8;color:#0c141d;font-family:Inter,Arial,sans-serif}.w{max-width:980px;margin:auto;padding:34px 18px}.hero{background:#07111c;color:#fff;border-radius:24px;padding:30px}.hero small{color:#d7aa64;letter-spacing:.13em}.hero h1{font-size:44px;margin:10px 0}.verdict{font-size:30px;color:#e8bc75}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin:14px 0}.card,article{background:#fff;border:1px solid #d7d0c5;border-radius:16px;padding:20px}.card h2{margin-top:0}li{margin:8px 0;line-height:1.5}a{color:#234f7c}.note{font-size:13px;color:#67717b;line-height:1.6}</style></head><body><main class="w"><section class="hero"><small>DANINI IMPORTOS · PAID IMPORT PASSPORT</small><h1>${html(lead.reference)}</h1><div class="verdict">${html(result.decision)}</div><p>${html(result.route)} · troškovni koridor ${eur(result.corridor.best)} – ${eur(result.corridor.worst)}</p></section><div class="grid">${scenarios}</div><section class="card"><h2>Importability Gate</h2><p><strong>${html(result.importability.status)}</strong></p><ul>${result.importability.issues.map(x=>'<li>'+html(x)+'</li>').join('')}</ul></section><section class="card"><h2>Fraud Shield · ${html(result.fraud.score)}/100</h2><ul>${flags}</ul></section><section class="card">${dna}</section><div class="grid"><section class="card"><h2>DIY ruta</h2><ol>${diy}</ol></section><section class="card"><h2>Preko posrednika</h2><ol>${broker}</ol></section></div><section class="card"><h2>Izvori i datum provere</h2><ul>${sources}</ul></section><p class="note">ImportOS je pomoć pri odluci. Konačne carinske, poreske, homologacione, registracione i tehničke odluke donose nadležni organi i stručna lica. Izveštaj ne zamenjuje fizički pregled vozila.</p></main></body></html>`;
}

function mountImportOSRuntime(app){
  const orderStore=createContactLeadStore({storageFile:path.join(__dirname,'runtime','importos-orders.json')});
  app.use('/api/importos',express.json({limit:'120kb'}));

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
      return res.json({ok:true,result:previewResult(result)});
    }catch(error){
      return res.status(400).json({ok:false,error:error.message||'IMPORTOS_EVALUATION_FAILED'});
    }
  });

  app.post('/api/importos/services/estimate',(req,res)=>{
    try{
      return res.json({ok:true,estimate:estimateFieldServices(req.body||{})});
    }catch(error){
      return res.status(400).json({ok:false,error:error.message||'SERVICE_ESTIMATE_FAILED'});
    }
  });

  app.post('/api/importos/checkout',async(req,res)=>{
    const data=req.body||{};
    const email=clean(data.email,191).toLowerCase();
    const language=data.language==='sr'?'sr':'de';
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ok:false,error:'VALID_EMAIL_REQUIRED'});
    if(data.termsAccepted!==true) return res.status(400).json({ok:false,error:'TERMS_ACCEPTANCE_REQUIRED'});
    if(!process.env.STRIPE_SECRET_KEY) return res.status(503).json({ok:false,error:'PAYMENT_NOT_CONFIGURED'});
    if(process.env.DANINI_IMPORTOS_CHECKOUT_ENABLED!=='true') return res.status(503).json({ok:false,error:'CHECKOUT_PENDING_LEGAL_ACTIVATION'});

    try{
      const full=evaluateImport(data.vehicle||{});
      const reference=orderRef();
      const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);
      const origin=publicUrl(req);
      const session=await stripe.checkout.sessions.create({
        mode:'payment',
        customer_email:email,
        billing_address_collection:'auto',
        success_url:origin+'/importos/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url:origin+'/'+language+'/?importos_cancelled=1#passport',
        line_items:[{
          quantity:1,
          price_data:{
            currency:'eur',
            unit_amount:990,
            product_data:{
              name:'Danini Import Passport',
              description:'DE/CH → RS Importentscheidung: Importability, Origin Risk, Fraud Shield, Model DNA, Landed Cost und DIY/Profi-Route.'
            }
          }
        }],
        metadata:{system:'Danini ImportOS',product:'import_passport',order_ref:reference,language}
      });

      await orderStore.create({
        reference,
        source:'importos-order',
        language,
        email,
        company:clean(data.name||email,180),
        status:'CHECKOUT_CREATED',
        recommendation:'paid-import-passport',
        payload:{result:full,vehicle:data.vehicle||{},stripeSessionId:session.id,checkoutUrl:session.url,priceEur:9.90}
      });
      return res.json({ok:true,reference,checkoutUrl:session.url});
    }catch(error){
      console.error('ImportOS checkout failed:',error.message);
      return res.status(500).json({ok:false,error:'IMPORTOS_CHECKOUT_FAILED'});
    }
  });

  app.get('/importos/success',async(req,res)=>{
    const sessionId=clean(req.query.session_id,250);
    if(!sessionId || !process.env.STRIPE_SECRET_KEY) return res.status(400).type('html').send('<h1>Missing payment session.</h1>');
    try{
      const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);
      const session=await stripe.checkout.sessions.retrieve(sessionId);
      if(session.payment_status!=='paid') return res.status(402).type('html').send('<h1>Payment not completed.</h1>');
      const reference=clean(session.metadata?.order_ref,64);
      const lead=await orderStore.get(reference);
      if(!lead || lead.payload?.stripeSessionId!==session.id) return res.status(404).type('html').send('<h1>Import Passport not found.</h1>');
      if(lead.status!=='PAID') await orderStore.update(reference,{status:'PAID',reviewedAt:new Date().toISOString()});
      res.set('Cache-Control','private, no-store');
      return res.type('html').send(renderPaidReport(lead));
    }catch(error){
      console.error('ImportOS paid report failed:',error.message);
      return res.status(500).type('html').send('<h1>Import Passport could not be opened.</h1>');
    }
  });
}

module.exports={mountImportOSRuntime,previewResult,renderPaidReport};
