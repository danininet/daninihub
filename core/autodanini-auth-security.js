'use strict';
/* Pure security primitives shared by customer auth; no deployment or secrets. */
const crypto=require('node:crypto');
const COOKIE='__Host-autodanini_session';
function safeEmail(value){
  if(typeof value!=='string')return '';
  const email=value.trim().toLowerCase();
  return email.length<=191&&/^[a-z0-9.!#$%&'*+\/=?^`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/.test(email)?email:'';
}
function verifyOrigin(origin,allowed){
  if(typeof origin!=='string'||!origin||typeof allowed!=='string')return false;
  try{
    const a=new URL(allowed),o=new URL(origin);
    return a.origin===o.origin && (a.protocol==='https:' || (process.env.NODE_ENV!=='production'&&a.hostname==='localhost')) &&
      a.username===''&&a.password===''&&a.pathname==='/'&&a.search===''&&a.hash===''; 
  }catch{return false}
}
function hexId(bytes=16){return crypto.randomBytes(bytes).toString('hex')}
function secretHash(secret,kind,value){
  if(typeof secret!=='string'||secret.length<32)throw new Error('AUTH_SECRET_CONFIGURATION_REQUIRED');
  return crypto.createHmac('sha256',secret).update(kind+'\0'+value).digest('hex');
}
function makeCookie(value,maxAge){
  if(!/^[a-f0-9]{64}$/.test(value)||!Number.isInteger(maxAge)||maxAge<1)throw new Error('INVALID_SESSION_COOKIE');
  return `${COOKIE}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
}
function clearCookie(){return `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`}
function readCookie(header){
  if(typeof header!=='string'||header.length>8192)return '';
  const values=header.split(';').map(x=>x.trim());
  const match=values.find(x=>x.startsWith(COOKIE+'='));
  const token=match?.slice(COOKIE.length+1)||'';
  return /^[a-f0-9]{64}$/.test(token)?token:'';
}
function makeChallengeCode(){return String(crypto.randomInt(0,1000000)).padStart(6,'0')}
function validChallengeCode(v){return typeof v==='string'&&/^\d{6}$/.test(v)}
module.exports={COOKIE,safeEmail,verifyOrigin,hexId,secretHash,makeCookie,clearCookie,readCookie,makeChallengeCode,validChallengeCode};
