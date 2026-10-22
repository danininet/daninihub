'use strict';
const crypto=require('node:crypto');
const {safeEmail,secretHash,readCookie,verifyOrigin}=require('./autodanini-auth-security');
const COOKIE='__Host-autodanini_admin';
const COOKIE_SECONDS=20*60;
function totpSecret(secret){
  if(typeof secret!=='string'||!/^[A-Z2-7]{32,128}$/.test(secret))throw new Error('ADMIN_TOTP_SECRET_INVALID');
  let bits=0,count=0,bytes=[];
  for(const c of secret){bits=(bits<<5)|'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'.indexOf(c);count+=5;if(count>=8){count-=8;bytes.push((bits>>count)&255);bits&=(1<<count)-1}}
  return Buffer.from(bytes);
}
function stepFromCode(key,code,now=Date.now()){
  if(typeof code!=='string'||!/^\d{6}$/.test(code)||!Number.isFinite(now))return -1;
  const seed=totpSecret(key),step=Math.floor(now/30000);
  for(let offset=-1;offset<=1;offset++){
    const counter=step+offset;
    if(counter<0)continue;
    const input=Buffer.alloc(8);input.writeBigUInt64BE(BigInt(counter));
    const mac=crypto.createHmac('sha1',seed).update(input).digest();
    const p=mac[mac.length-1]&15;
    const number=((mac[p]&127)<<24)|(mac[p+1]<<16)|(mac[p+2]<<8)|mac[p+3];
    const computed=String(number%1000000).padStart(6,'0');
    if(crypto.timingSafeEqual(Buffer.from(code),Buffer.from(computed)))return counter;
  }
  return -1;
}
function ownerConfigured(env){
  return env.NODE_ENV==='production' &&
    env.AUTODANINI_PREVIEW_ENABLED==='true' &&
    env.AUTODANINI_AUTH_ENABLED==='true' &&
    env.AUTODANINI_ADMIN_ENABLED==='true' &&
    Boolean(safeEmail(env.AUTODANINI_OWNER_EMAIL)) &&
    safeEmail(env.AUTODANINI_OWNER_EMAIL)!=='kontakt@daninihub.com' &&
    safeEmail(env.AUTODANINI_OWNER_EMAIL)!=='info@daninihub.com' &&
    typeof env.DANINI_AUTH_HMAC_SECRET==='string'&&env.DANINI_AUTH_HMAC_SECRET.length>=32 &&
    typeof env.AUTODANINI_OWNER_TOTP_SECRET==='string'&&
    /^[A-Z2-7]{32,128}$/.test(env.AUTODANINI_OWNER_TOTP_SECRET);
}
function adminCookie(token){
  if(!/^[a-f0-9]{64}$/.test(token))throw new Error('INVALID_ADMIN_TOKEN');
  return `${COOKIE}=${token}; Path=/; Max-Age=${COOKIE_SECONDS}; HttpOnly; Secure; SameSite=Strict`;
}
function removeAdminCookie(){return `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`}
function readAdminCookie(header){
  if(typeof header!=='string'||header.length>8192)return '';
  const v=header.split(';').map(x=>x.trim()).find(x=>x.startsWith(COOKIE+'='));
  const token=v?.slice(COOKIE.length+1)||'';
  return /^[a-f0-9]{64}$/.test(token)?token:'';
}
function ownerIdentity(user,env){
  return user&&safeEmail(user.email)===safeEmail(env.AUTODANINI_OWNER_EMAIL) &&
    Boolean(safeEmail(env.AUTODANINI_OWNER_EMAIL));
}
module.exports={stepFromCode,totpSecret,ownerConfigured,ownerIdentity,adminCookie,removeAdminCookie,readAdminCookie,COOKIE,COOKIE_SECONDS};
