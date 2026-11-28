import {test} from 'node:test';
import assert from 'node:assert/strict';
import native from '../../hostinger-native-digital.cjs';
const {createDigitalDatabase,runtimeEnv,allowedRoute,META,CHUNKS,ORDER_READ,SHA,TABLE}=native;
test('Hostinger digital requires explicit sandbox, exact package, matching test recipient; live never allowed',()=>{
 const env={HOSTINGER_DIGITAL_SANDBOX_ENABLED:'true',PAYPAL_ENV:'sandbox',DANINI_DIGITAL_CHECKOUT_ENABLED:'true',DANINI_PREMIUM_ZIP_SHA256:SHA,DANINI_PAYPAL_SANDBOX_EMAIL:'owner@example.test',MAIL_TEST_RECIPIENT:'owner@example.test',DANINI_PACKAGE_D1_READ_TOKEN:'mock',DANINI_DIGITAL_LIVE_APPROVED:'true'};
 const active=runtimeEnv(env);assert.equal(active.PAYPAL_ENV,'sandbox');assert.equal(active.DANINI_DIGITAL_LIVE_APPROVED,'false');assert.match(active.SITE_ORIGIN,/hostingersite\.com$/);
 for(const patch of [{PAYPAL_ENV:'live'},{HOSTINGER_DIGITAL_SANDBOX_ENABLED:'false'},{MAIL_TEST_RECIPIENT:'other@example.test'},{DANINI_PREMIUM_ZIP_SHA256:'wrong'},{DANINI_PACKAGE_D1_READ_TOKEN:''}])assert.equal(runtimeEnv({...env,...patch}),null);
});
test('only exact sandbox routes allowed, never public checkout',()=>{
 const p='/api/danini/digital/';
 assert.equal(allowedRoute(p+'status','GET'),true);assert.equal(allowedRoute(p+'paypal/sandbox/checkout','POST'),true);
 assert.equal(allowedRoute(p+'checkout','POST'),false);assert.equal(allowedRoute(p+'status','POST'),false);assert.equal(allowedRoute(p+'download/DGD-'+'A'.repeat(32),'GET'),true);assert.equal(allowedRoute(p+'download/../status','GET'),false);
});
test('private D1 API only permits pinned read queries; SQL writes isolated in MySQL',async()=>{
 const calls=[];const pool={async execute(sql,args){calls.push({sql,args});return sql.startsWith('SELECT')?[[{status:'PAID'}]]:[{affectedRows:1}];}};
 let reads=0;
 const db=createDigitalDatabase(pool,'read-token',async(url,opts)=>{reads++;assert.match(url,/api\.cloudflare\.com\/client\/v4\/accounts\//);assert.equal(opts.redirect,'error');const q=JSON.parse(opts.body);assert.ok([META,CHUNKS].includes(q.sql));assert.equal(q.params[0],SHA);return Response.json({success:true,result:[{success:true,results:[{ready:1}]}]});});
 assert.deepEqual(await db.prepare(META).bind(SHA).first(),{ready:1});
 assert.equal((await db.prepare(CHUNKS).bind(SHA,0).all()).results.length,1);
 await assert.rejects(db.prepare(META).bind('other').first());
 await assert.rejects(db.prepare('DELETE FROM danini_digital_packages').bind().run());
 await assert.rejects(db.prepare('SELECT * FROM danini_digital_orders').bind().all());
 assert.equal(reads,2);
 assert.equal((await db.prepare(ORDER_READ).bind('ref').first()).status,'PAID');
 const sql="UPDATE danini_digital_orders SET status='PROCESSING',processing_at=datetime('now') WHERE reference=? AND (status='CREATED' OR (status='PROCESSING' AND processing_at < datetime('now','-2 minutes')))";
 assert.equal((await db.prepare(sql).bind('ref').run()).meta.changes,1);
 assert.ok(calls.every(c=>c.sql.includes(TABLE)));assert.match(calls[1].sql,/DATE_SUB\(UTC_TIMESTAMP\(\), INTERVAL 2 MINUTE\)/);
});

import {verifiedCapture} from '../../workers/danini-digital-commerce.mjs';
test('Sandbox merchant pin checks exact ID even if provider omits email; production email verification unchanged',()=>{
 const record={reference:'DGD-'+'A'.repeat(32),paypal_order_id:'TESTORDER123',sku:'guide',amount_cents:4900};
 const unit={custom_id:record.reference,payee:{merchant_id:'ZGVSVL54LVWUY'},payments:{captures:[{id:'CAPTURE123',status:'COMPLETED',amount:{currency_code:'EUR',value:'49.00'}}]}};
 const order={id:record.paypal_order_id,status:'COMPLETED',purchase_units:[unit]};
 assert.equal(verifiedCapture(order,record,'merchant@example.test','ZGVSVL54LVWUY'),true);
 assert.equal(verifiedCapture(order,record,'merchant@example.test','WRONGMERCHANT'),false);
 assert.equal(verifiedCapture(order,record,'merchant@example.test'),false);
 assert.equal(verifiedCapture({...order,purchase_units:[{...unit,payee:{email_address:'merchant@example.test'}}]},record,'merchant@example.test','ZGVSVL54LVWUY'),false);
 assert.equal(verifiedCapture({...order,purchase_units:[{...unit,payee:{email_address:'merchant@example.test'}}]},record,'merchant@example.test'),true);
 assert.equal(verifiedCapture({...order,status:'APPROVED'},record,'merchant@example.test','ZGVSVL54LVWUY'),false);
});

import {digitalProductsPath} from '../../workers/danini-digital-commerce.mjs';
test('purchase return catalog uses localized current routes and safe default',()=>{
 assert.equal(digitalProductsPath('de'),'/de/wissen/produkte/');
 assert.equal(digitalProductsPath('sr'),'/sr/wissen/produkte/');
 assert.equal(digitalProductsPath(undefined),'/sr/wissen/produkte/');
 assert.equal(digitalProductsPath('https://example.invalid'),'/sr/wissen/produkte/');
});
