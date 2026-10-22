'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {
  safeEmail,verifyOrigin,secretHash,makeCookie,clearCookie,
  readCookie,makeChallengeCode,validChallengeCode,hexId
}=require('../core/autodanini-auth-security');
const secret='test-only-not-an-actual-auth-secret-1234567';

test('email validation normalizes only plausible addresses',()=>{
  assert.equal(safeEmail(' User.Name+1@Example.COM '),'user.name+1@example.com');
  for(const item of [null,32,'', 'hello','a@localhost',' a@b.com\r\nBcc:x@y.com','a@b.com '.repeat(35)]){
    assert.equal(safeEmail(item),'');
  }
});
test('origin check enforces the exact origin',()=>{
  const allowed='https://daninihub.com';
  assert.equal(verifyOrigin('https://daninihub.com',allowed),true);
  for(const origin of ['http://daninihub.com','https://attacker.daninihub.com','https://daninihub.com.attacker.test',
    'https://daninihub.com:1234','null','',undefined]){
    assert.equal(verifyOrigin(origin,allowed),false);
  }
});
test('invalid configured origin is not trusted',()=>{
  assert.equal(verifyOrigin('https://daninihub.com','https://user:password@daninihub.com'),false);
  assert.equal(verifyOrigin('https://daninihub.com','https://daninihub.com/path'),false);
  assert.equal(verifyOrigin('https://daninihub.com','http://daninihub.com'),false);
});
test('OTP is six digits and ID is random hex',()=>{
  for(let i=0;i<30;i++)assert.equal(validChallengeCode(makeChallengeCode()),true);
  assert.equal(validChallengeCode('001234'),true);
  for(const value of ['12345','1234567','12a456',' 123456',123456])assert.equal(validChallengeCode(value),false);
  assert.match(hexId(),/^[a-f0-9]{32}$/);
  assert.match(hexId(32),/^[a-f0-9]{64}$/);
});
test('HMAC uses domain separation and requires secret',()=>{
  const code=secretHash(secret,'otp','abc:123456');
  assert.match(code,/^[a-f0-9]{64}$/);
  assert.notEqual(code,secretHash(secret,'session','abc:123456'));
  assert.notEqual(code,secretHash(secret,'otp','abc:999999'));
  assert.throws(()=>secretHash('weak','session','x'),/AUTH_SECRET_CONFIGURATION_REQUIRED/);
});
test('session cookie is secure host-only and HttpOnly',()=>{
  const token=hexId(32),header=makeCookie(token,3600);
  assert.match(header,/^__Host-autodanini_session=/);
  for(const fragment of ['Path=/','Max-Age=3600','HttpOnly','Secure','SameSite=Lax'])assert.ok(header.includes(fragment));
  assert.ok(!header.includes('Domain='));
  assert.equal(readCookie('x=1; __Host-autodanini_session='+token+'; y=2'),token);
  assert.equal(readCookie('__Host-autodanini_session=fake'),'');
  assert.throws(()=>makeCookie('fake',3600),/INVALID_SESSION_COOKIE/);
  assert.match(clearCookie(),/Max-Age=0/);
});
