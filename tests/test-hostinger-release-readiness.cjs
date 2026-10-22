'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {checkProductionConfiguration,checkProductionStorage}=require('../core/hostinger-release-readiness');

const safe={
  NODE_ENV:'production', DB_HOST:'database.internal', DB_USER:'danini_app',
  DB_NAME:'danini_prod', DB_PASSWORD:'not-a-real-secret',
  DANINI_PUBLIC_URL:'https://daninihub.com',
  DANINI_IMPORTOS_CHECKOUT_ENABLED:'false',
  DANINI_IMPORTOS_SERVICE_PAYMENTS_ENABLED:'false'
};

test('development does not need production configuration',()=>{
  assert.doesNotThrow(()=>checkProductionConfiguration({NODE_ENV:'development'}));
});
test('production rejects incomplete MySQL configuration',()=>{
  for(const field of ['DB_HOST','DB_USER','DB_NAME','DB_PASSWORD']){
    assert.throws(()=>checkProductionConfiguration({...safe,[field]:''}),/PRODUCTION_DATABASE_CONFIGURATION_REQUIRED/);
  }
});
test('production only accepts a clean HTTPS origin',()=>{
  for(const value of [
    '', 'http://daninihub.com', 'https://localhost', 'https://someone:pw@daninihub.com',
    'https://daninihub.com/other','https://daninihub.com/?token=123',
    'https://daninihub.com/#fragment'
  ]) assert.throws(()=>checkProductionConfiguration({...safe,DANINI_PUBLIC_URL:value}),/PRODUCTION_PUBLIC_HTTPS_ORIGIN_REQUIRED/);
  assert.doesNotThrow(()=>checkProductionConfiguration(safe));
});
test('production rejects early Stripe/PayPal activation',()=>{
  assert.throws(()=>checkProductionConfiguration({...safe,DANINI_IMPORTOS_CHECKOUT_ENABLED:'true'}),/PRODUCTION_PAYMENTS_REQUIRE_SEPARATE_RELEASE/);
  assert.throws(()=>checkProductionConfiguration({...safe,DANINI_IMPORTOS_SERVICE_PAYMENTS_ENABLED:'true'}),/PRODUCTION_PAYMENTS_REQUIRE_SEPARATE_RELEASE/);
});
test('production refuses local-file fallback',async()=>{
  let initialized=false;
  await assert.rejects(checkProductionStorage({mode:'file',async init(){initialized=true}},safe),/PRODUCTION_DATABASE_UNAVAILABLE/);
  assert.equal(initialized,true);
});
test('production allows a verified MySQL store',async()=>{
  let initialized=false;
  await checkProductionStorage({mode:'mysql',async init(){initialized=true}},safe);
  assert.equal(initialized,true);
});
test('production refuses database initialization errors',async()=>{
  await assert.rejects(checkProductionStorage({mode:'file',async init(){throw new Error('db down')}},safe),/db down/);
});

test('public AutoDanini preview refuses development mode',()=>{
  assert.throws(()=>checkProductionConfiguration({
    NODE_ENV:'development',AUTODANINI_PREVIEW_ENABLED:'true'
  }),/AUTODANINI_PREVIEW_REQUIRES_PRODUCTION_MODE/);
  assert.throws(()=>checkProductionConfiguration({
    AUTODANINI_PREVIEW_ENABLED:'true'
  }),/AUTODANINI_PREVIEW_REQUIRES_PRODUCTION_MODE/);
  assert.doesNotThrow(()=>checkProductionConfiguration({
    ...safe,AUTODANINI_PREVIEW_ENABLED:'true'
  }));
});

test('staging can never replace AutoDanini or Calije production domains by accident',()=>{
  for(const live of ['https://daninihub.com','https://www.daninihub.com','https://calije.daninihub.com']){
    assert.throws(()=>checkProductionConfiguration({
      ...safe,AUTODANINI_PREVIEW_ENABLED:'true',DANINI_PUBLIC_URL:live
    }),/AUTODANINI_PREVIEW_MUST_NOT_USE_LIVE_DOMAIN/);
  }
  assert.doesNotThrow(()=>checkProductionConfiguration({
    ...safe,AUTODANINI_PREVIEW_ENABLED:'true',
    DANINI_PUBLIC_URL:'https://preview-auto.hostingersite.com'
  }));
});
test('admin and request submission cannot be switched on without their prerequisites',()=>{
  assert.throws(()=>checkProductionConfiguration({
    ...safe,AUTODANINI_ADMIN_ENABLED:'true'
  }),/AUTODANINI_ADMIN_REQUIRES_AUTH/);
  assert.throws(()=>checkProductionConfiguration({
    ...safe,AUTODANINI_SUBMISSIONS_ENABLED:'true',
    AUTODANINI_AUTH_ENABLED:'true'
  }),/AUTODANINI_SUBMISSIONS_REQUIRE_SECURE_ADMIN/);
  assert.doesNotThrow(()=>checkProductionConfiguration({
    ...safe,AUTODANINI_AUTH_ENABLED:'true',
    AUTODANINI_ADMIN_ENABLED:'true',
    AUTODANINI_SUBMISSIONS_ENABLED:'true'
  }));
});
