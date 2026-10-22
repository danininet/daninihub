'use strict';
/**
 * Single-domain AutoDanini e-mail policy for the current domain decision:
 * main business site = daninihub.com; Calije mailbox is NOT used by AutoDanini.
 * NO network requests and no secret values logged from this module.
 */
const MAIN_DOMAIN='daninihub.com';
const DEFAULT_CONTACT='kontakt@daninihub.com';
function sameDomainAddress(raw){
  if(typeof raw!=='string')return '';
  const email=raw.trim().toLowerCase();
  if(email.length>191||!/^[a-z0-9][a-z0-9.!#$%&'*+\/?^_`{|}~-]*@daninihub\.com$/.test(email))return '';
  return email;
}
function resolveAutoDaniniEmail(env=process.env){
  // Reuse whichever validated sender variable the existing Brevo integration
  // already uses; never force the owner to buy or configure another mailbox.
  const configuredSender=env.BREVO_SENDER_EMAIL||env.DANINIHUB_SENDER_EMAIL||
    env.MAIL_FROM||env.EMAIL_FROM;
  const sender=sameDomainAddress(configuredSender);
  const contact=sameDomainAddress(env.AUTODANINI_CONTACT_EMAIL||DEFAULT_CONTACT);
  const recipient=sameDomainAddress(env.AUTODANINI_OPERATIONS_EMAIL||contact);
  const hasApiKey=typeof env.BREVO_API_KEY==='string'&&env.BREVO_API_KEY.length>10;
  if(!contact||!recipient)throw new Error('AUTODANINI_EMAIL_DOMAIN_REQUIRED');
  if(!sender||!hasApiKey)throw new Error('AUTODANINI_BREVO_NOT_CONFIGURED');
  return {sender,contact,operations:recipient,replyTo:contact};
}
module.exports={MAIN_DOMAIN,DEFAULT_CONTACT,sameDomainAddress,resolveAutoDaniniEmail};
