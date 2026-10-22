'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {sameDomainAddress,resolveAutoDaniniEmail,DEFAULT_CONTACT}=require('../core/autodanini-mail-policy');

test('one verified-brand contact address is the default for AutoDanini',()=>{
  assert.equal(DEFAULT_CONTACT,'kontakt@daninihub.com');
  const mail=resolveAutoDaniniEmail({
    BREVO_API_KEY:'test-brevo-key-placeholder',
    BREVO_SENDER_EMAIL:'Kontakt@DANINIHUB.com'
  });
  assert.equal(mail.sender,'kontakt@daninihub.com');
  assert.equal(mail.contact,'kontakt@daninihub.com');
  assert.equal(mail.replyTo,'kontakt@daninihub.com');
  assert.equal(mail.operations,'kontakt@daninihub.com');
});
test('existing or planned brand aliases can be configured',()=>{
  const mail=resolveAutoDaniniEmail({
    BREVO_API_KEY:'test-brevo-key-placeholder',
    BREVO_SENDER_EMAIL:'info@daninihub.com',
    AUTODANINI_CONTACT_EMAIL:'kontakt@daninihub.com',
    AUTODANINI_OPERATIONS_EMAIL:'auto@daninihub.com'
  });
  assert.equal(mail.sender,'info@daninihub.com');
  assert.equal(mail.operations,'auto@daninihub.com');
});
test('Calije email and other domains are never used as AutoDanini OTP sender',()=>{
  for(const address of [
    'kontakt@calije.daninihub.com','user@example.com','kontakt@daninihub.com.evil.test',
    'support@otherdaninihub.com','Test <kontakt@daninihub.com>','kontakt@daninihub.com\r\nBcc:attacker@example.com'
  ]) {
    assert.equal(sameDomainAddress(address),'');
    assert.throws(()=>resolveAutoDaniniEmail({
      BREVO_API_KEY:'test-brevo-key-placeholder',BREVO_SENDER_EMAIL:address
    }),/AUTODANINI_BREVO_NOT_CONFIGURED/);
  }
});
test('Brevo key must exist, but never returned to frontend',()=>{
  assert.throws(()=>resolveAutoDaniniEmail({BREVO_SENDER_EMAIL:DEFAULT_CONTACT}),/AUTODANINI_BREVO_NOT_CONFIGURED/);
  const mail=resolveAutoDaniniEmail({BREVO_SENDER_EMAIL:DEFAULT_CONTACT,BREVO_API_KEY:'test-brevo-key-placeholder'});
  assert.equal(JSON.stringify(mail).includes('test-brevo-key-placeholder'),false);
});
test('invalid Reply-To target fails closed',()=>{
  assert.throws(()=>resolveAutoDaniniEmail({
    BREVO_API_KEY:'test-brevo-key-placeholder',
    BREVO_SENDER_EMAIL:DEFAULT_CONTACT,
    AUTODANINI_CONTACT_EMAIL:'private@gmail.com'
  }),/AUTODANINI_EMAIL_DOMAIN_REQUIRED/);
});

test('existing working Brevo sender variable names are reused',()=>{
  for(const field of ['DANINIHUB_SENDER_EMAIL','MAIL_FROM','EMAIL_FROM']){
    const env={BREVO_API_KEY:'test-brevo-key-placeholder',[field]:'kontakt@daninihub.com'};
    assert.equal(resolveAutoDaniniEmail(env).sender,'kontakt@daninihub.com');
  }
  // A configured foreign sender must never be silently accepted, even if
  // an older fallback variable points at the correct mailbox.
  assert.throws(()=>resolveAutoDaniniEmail({
    BREVO_API_KEY:'test-brevo-key-placeholder',
    BREVO_SENDER_EMAIL:'kontakt@calije.daninihub.com',
    MAIL_FROM:'kontakt@daninihub.com'
  }),/AUTODANINI_BREVO_NOT_CONFIGURED/);
});
