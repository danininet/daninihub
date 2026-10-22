'use strict';

// Startup release guard: never accept production requests against the file fallback.
// This does not replace access-control, payment, backup or penetration testing.
function checkProductionConfiguration(env=process.env){
  // A public Hostinger AutoDanini preview must never run with development-only
  // legacy admin protections accidentally enabled.
  if(env.AUTODANINI_PREVIEW_ENABLED==='true'&&env.NODE_ENV!=='production')
    throw new Error('AUTODANINI_PREVIEW_REQUIRES_PRODUCTION_MODE');
  if(env.NODE_ENV!=='production')return;
  for(const name of ['DB_HOST','DB_USER','DB_NAME','DB_PASSWORD']){
    if(!String(env[name]||'').trim())throw new Error('PRODUCTION_DATABASE_CONFIGURATION_REQUIRED');
  }
  let origin;
  try{origin=new URL(String(env.DANINI_PUBLIC_URL||''))}catch{
    throw new Error('PRODUCTION_PUBLIC_HTTPS_ORIGIN_REQUIRED');
  }
  if(origin.protocol!=='https:'||!origin.hostname||origin.username||origin.password||
     origin.pathname!=='/'||origin.search||origin.hash ||
     ['localhost','127.0.0.1'].includes(origin.hostname)){
    throw new Error('PRODUCTION_PUBLIC_HTTPS_ORIGIN_REQUIRED');
  }
  if(env.AUTODANINI_PREVIEW_ENABLED==='true' &&
     ['daninihub.com','www.daninihub.com','calije.daninihub.com'].includes(origin.hostname.toLowerCase())){
    throw new Error('AUTODANINI_PREVIEW_MUST_NOT_USE_LIVE_DOMAIN');
  }
  if(env.AUTODANINI_ADMIN_ENABLED==='true' && env.AUTODANINI_AUTH_ENABLED!=='true'){
    throw new Error('AUTODANINI_ADMIN_REQUIRES_AUTH');
  }
  if(env.AUTODANINI_SUBMISSIONS_ENABLED==='true' &&
    (env.AUTODANINI_AUTH_ENABLED!=='true'||env.AUTODANINI_ADMIN_ENABLED!=='true')){
    throw new Error('AUTODANINI_SUBMISSIONS_REQUIRE_SECURE_ADMIN');
  }
  // Payments are excluded from this first-release profile until separately approved.
  if(env.DANINI_IMPORTOS_CHECKOUT_ENABLED==='true'||
     env.DANINI_IMPORTOS_SERVICE_PAYMENTS_ENABLED==='true'){
    throw new Error('PRODUCTION_PAYMENTS_REQUIRE_SEPARATE_RELEASE');
  }
}

async function checkProductionStorage(store,env=process.env){
  checkProductionConfiguration(env);
  if(env.NODE_ENV!=='production')return;
  if(!store||typeof store.init!=='function')throw new Error('PRODUCTION_DATABASE_NOT_MOUNTED');
  await store.init();
  if(store.mode!=='mysql')throw new Error('PRODUCTION_DATABASE_UNAVAILABLE');
}
module.exports={checkProductionConfiguration,checkProductionStorage};
