'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {createPublicThrottle}=require('../core/autodanini-public-throttle');
function request(ip='198.51.100.10',forgedHeader='203.0.113.91'){
  // req.ip is provided by Express's verified trust-proxy policy; XFF must
  // never be inspected or preferred by the middleware itself.
  return {ip,headers:{'x-forwarded-for':forgedHeader},socket:{remoteAddress:ip}};
}
function call(limit,ip){
  let status=200,body=null,nextCalled=false,headers={};
  const res={
    set(k,v){headers[k]=v;return this},
    status(x){status=x;return this},
    json(x){body=x;return this}
  };
  limit(request(ip),res,()=>{nextCalled=true});
  return {status,body,nextCalled,headers};
}
test('throttle allows the configured budget and rejects overflow',()=>{
  let now=10000;
  const limit=createPublicThrottle({scope:'public_event',max:2,windowMs:60000,clock:()=>now});
  assert.equal(call(limit,'198.51.100.1').nextCalled,true);
  assert.equal(call(limit,'198.51.100.1').nextCalled,true);
  const denied=call(limit,'198.51.100.1');
  assert.equal(denied.status,429);
  assert.equal(denied.body.error,'RATE_LIMITED');
  assert.equal(denied.headers['Retry-After'],'60');
  assert.equal(call(limit,'198.51.100.2').nextCalled,true);
  now+=60001;
  assert.equal(call(limit,'198.51.100.1').nextCalled,true);
});
test('spoofed forwarding header does not change the request key',()=>{
  const limit=createPublicThrottle({scope:'real_client',max:1,windowMs:60000});
  assert.equal(call(limit,'192.0.2.8').nextCalled,true);
  assert.equal(call(limit,'192.0.2.8').status,429);
});
test('throttle configuration is validated',()=>{
  assert.throws(()=>createPublicThrottle({scope:'',max:10,windowMs:60000}),/INVALID_THROTTLE_CONFIG/);
  assert.throws(()=>createPublicThrottle({scope:'forms',max:0,windowMs:60000}),/INVALID_THROTTLE_CONFIG/);
  assert.throws(()=>createPublicThrottle({scope:'forms',max:10,windowMs:10}),/INVALID_THROTTLE_CONFIG/);
});
test('bounded memory does not disrupt normal flows',()=>{
  const limit=createPublicThrottle({scope:'bounded',max:1,windowMs:60000,maxEntries:2});
  assert.equal(call(limit,'192.0.2.1').nextCalled,true);
  assert.equal(call(limit,'192.0.2.2').nextCalled,true);
  assert.equal(call(limit,'192.0.2.3').nextCalled,true);
});
