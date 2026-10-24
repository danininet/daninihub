'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const express=require('express');
const {privateFile,tokenFor,validToken,verified,mountDigitalCommerce,enabled,SKU}=require('../digital-commerce');
async function main(){
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'danini-private-pdf-'));
  const pdf=path.join(root,'DANINI_MASTER_PRIVATE.pdf');
  const binary=Buffer.alloc(125000,65);
  binary.write('%PDF-1.7\n',0);
  binary.write('%%EOF',binary.length-5);
  fs.writeFileSync(pdf,binary);
  const keys=['DANINI_GUIDE_PDF_PATH','DANINI_DIGITAL_CHECKOUT_ENABLED','PAYPAL_CLIENT_ID','PAYPAL_CLIENT_SECRET','PAYPAL_ENV','DANINI_PAYPAL_RECEIVER_EMAIL','DANINI_DIGITAL_SIGNING_SECRET','DANINI_PUBLIC_URL'];
  const previous=Object.fromEntries(keys.map(k=>[k,process.env[k]]));
  let server;
  try{
    Object.assign(process.env,{
      DANINI_GUIDE_PDF_PATH:pdf,
      DANINI_DIGITAL_CHECKOUT_ENABLED:'true',
      PAYPAL_CLIENT_ID:'TEST-ONLY-CLIENT',
      PAYPAL_CLIENT_SECRET:'TEST-ONLY-SECRET',
      PAYPAL_ENV:'sandbox',
      DANINI_PAYPAL_RECEIVER_EMAIL:'merchant-sandbox@example.test',
      DANINI_DIGITAL_SIGNING_SECRET:'0123456789-abcdefghijklmnopqrstuvwxyz-0123456789',
      DANINI_PUBLIC_URL:'https://daninihub.com'
    });
    assert.equal(privateFile(),fs.realpathSync(pdf));
    const record={
      reference:'DGD-'+ 'A'.repeat(36),type:'digital-order',status:'PAID',
      email:'client@example.invalid',language:'sr',
      payload:{sku:'guide',paypalOrderId:'9TESTORDER',paymentVerifiedAt:new Date(Date.now()-60000).toISOString()}
    };
    const token=tokenFor(record);
    assert.equal(validToken(record,token),true);
    assert.equal(validToken(record,token.slice(0,-1)+'x'),false);
    assert.equal(validToken(record,{malicious:true}),false);
    assert.equal(validToken({...record,status:'CHECKOUT_CREATED'},token),false);
    assert.equal(validToken(record,token,Date.now()+73*3600e3),false);
    assert.throws(()=>tokenFor(record,Date.now()+100*3600e3),/EXPIRY/);
    assert.deepEqual(Object.keys(SKU).sort(),['guide','software']);
    const paid={
      id:'9TESTORDER',status:'COMPLETED',
      purchase_units:[{custom_id:record.reference,payee:{email_address:'merchant-sandbox@example.test'},
        payments:{captures:[{status:'COMPLETED',amount:{currency_code:'EUR',value:'49.00'},id:'CAPTURE1'}]}}]
    };
    assert.equal(verified(paid,record),true);
    assert.equal(verified({...paid,status:'APPROVED'},record),false);
    assert.equal(verified({...paid,purchase_units:[{...paid.purchase_units[0],custom_id:'FORGED'}]},record),false);
    assert.equal(verified({...paid,purchase_units:[{...paid.purchase_units[0],payee:{email_address:'wrong@example.com'}}]},record),false);
    assert.equal(verified({...paid,purchase_units:[{...paid.purchase_units[0],payments:{captures:[{...paid.purchase_units[0].payments.captures[0],amount:{currency_code:'EUR',value:'9.90'}}]}}]},record),false);
    const software={...record,payload:{...record.payload,sku:'software'}};
    assert.equal(verified({...paid,purchase_units:[{...paid.purchase_units[0],payments:{captures:[{...paid.purchase_units[0].payments.captures[0],amount:{currency_code:'EUR',value:'149.00'}}]}}]},software),true);
    const app=express();
    app.locals.importOSStore={mode:'mysql',init:async()=>{},get:async ref=>ref===record.reference?record:null};
    mountDigitalCommerce(app);
    assert.ok(enabled(app));
    server=app.listen(0);
    await new Promise(resolve=>server.once('listening',resolve));
    const base='http://127.0.0.1:'+server.address().port;
    const status=await (await fetch(base+'/api/danini/digital/status')).json();
    assert.equal(status.enabled,true);
    const good=await fetch(base+'/digital/download/'+record.reference+'?token='+encodeURIComponent(token));
    assert.equal(good.status,200);
    assert.match(good.headers.get('content-type'),/application\/pdf/);
    assert.match(good.headers.get('cache-control'),/no-store/);
    assert.equal((await good.arrayBuffer()).byteLength,binary.length);
    assert.equal((await fetch(base+'/digital/download/'+record.reference+'?token=bad')).status,404);
    assert.equal((await fetch(base+'/digital/download/DGD-UNKNOWN?token='+encodeURIComponent(token))).status,404);
    const badOrder=await fetch(base+'/api/danini/digital/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sku:'invalid',email:'client@example.com',termsAccepted:true,instantDeliveryConsent:true})});
    assert.equal(badOrder.status,400);
    const missingConsent=await fetch(base+'/api/danini/digital/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sku:'guide',email:'client@example.com',termsAccepted:true,instantDeliveryConsent:false})});
    assert.equal(missingConsent.status,400);
    process.env.DANINI_GUIDE_PDF_PATH=path.join(__dirname,'../public/favicon.svg');
    assert.equal(privateFile(),null);
    assert.equal(enabled(app),false);
    const disabled=await fetch(base+'/api/danini/digital/status');
    assert.equal((await disabled.json()).enabled,false);
    console.log('DANINI digital PDF: verified PayPal capture, signed expiring link, no static leakage, 49/149 €: OK');
  }finally{
    if(server)await new Promise(resolve=>server.close(resolve));
    for(const k of keys){if(previous[k]===undefined)delete process.env[k];else process.env[k]=previous[k]}
    fs.rmSync(root,{recursive:true,force:true});
  }
}
main().catch(err=>{console.error(err);process.exitCode=1});
