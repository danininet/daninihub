'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {stepFromCode,totpSecret,ownerConfigured,ownerIdentity,adminCookie,readAdminCookie,removeAdminCookie}=require('../core/autodanini-admin-security');
const {safeEmail}=require('../core/autodanini-auth-security');
// RFC 6238 secret "12345678901234567890", TOTP 6-digit code at T=59s = 287082.
const knownSecret='GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';
const env={
  NODE_ENV:'production',AUTODANINI_PREVIEW_ENABLED:'true',
  AUTODANINI_AUTH_ENABLED:'true',AUTODANINI_ADMIN_ENABLED:'true',
  DANINI_AUTH_HMAC_SECRET:'this-is-a-demo-server-secret-for-tests-only',
  AUTODANINI_OWNER_EMAIL:'private-owner@example.net',
  AUTODANINI_OWNER_TOTP_SECRET:knownSecret
};
test('TOTP follows RFC known code at 59 seconds and rejects replay outside window',()=>{
  assert.equal(totpSecret(knownSecret).toString('ascii'),'12345678901234567890');
  assert.equal(stepFromCode(knownSecret,'287082',59000),1);
  assert.equal(stepFromCode(knownSecret,'287082',59000+5*60000),-1);
  assert.equal(stepFromCode(knownSecret,'000000',59000),-1);
  assert.equal(stepFromCode(knownSecret,'28708',59000),-1);
  assert.throws(()=>totpSecret('fake'),/ADMIN_TOTP_SECRET_INVALID/);
});
test('owner requires explicit private email and valid second factor',()=>{
  assert.equal(ownerConfigured(env),true);
  assert.equal(ownerIdentity({email:'PRIVATE-OWNER@example.net'},env),true);
  assert.equal(ownerIdentity({email:'kontakt@daninihub.com'},env),false);
  assert.equal(ownerConfigured({...env,AUTODANINI_OWNER_EMAIL:'kontakt@daninihub.com'}),false);
  assert.equal(ownerConfigured({...env,AUTODANINI_OWNER_EMAIL:'info@daninihub.com'}),false);
  assert.equal(ownerConfigured({...env,AUTODANINI_OWNER_TOTP_SECRET:''}),false);
  assert.equal(ownerConfigured({...env,AUTODANINI_ADMIN_ENABLED:'false'}),false);
  assert.equal(ownerConfigured({...env,NODE_ENV:'development'}),false);
});
test('administrator cookie is host-only, secure, short lived and distinct',()=>{
  const token='f'.repeat(64),cookie=adminCookie(token);
  assert.ok(cookie.startsWith('__Host-autodanini_admin='));
  assert.ok(cookie.includes('Max-Age=1200'));
  assert.ok(cookie.includes('HttpOnly'));
  assert.ok(cookie.includes('Secure'));
  assert.ok(cookie.includes('SameSite=Strict'));
  assert.ok(!cookie.includes('Domain='));
  assert.equal(readAdminCookie('a=1; __Host-autodanini_admin='+token),token);
  assert.equal(readAdminCookie('other=fake'),'');
  assert.ok(removeAdminCookie().includes('Max-Age=0'));
  assert.throws(()=>adminCookie('invalid'),/INVALID_ADMIN_TOKEN/);
});
