/**
 * Customer-only email OTP authentication for the DANINI Builder.
 * DORMANT unless ACADEMY_AUTH_ENABLED=true and a distinct signing secret exists.
 * Does not reuse owner Cloudflare Access identity or marketplace checkout tokens.
 * No email addresses, OTP codes or raw sessions are stored in D1.
 */
import {registerAuthenticatedUser} from './workspace.mjs';
const EMAIL=/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const HEX=/^[0-9a-f]{64}$/i;
const CHALLENGE=/^[0-9a-f-]{36}$/i;
export const COOKIE='danini_academy_session';
const encoder=new TextEncoder();
function err(status,code){const e=new Error(code);e.status=status;return e;}
function config(env){
 if(env.ACADEMY_AUTH_ENABLED!=='true')throw err(404,'not_found');
 if(!env.DANINI_DB || typeof env.ACADEMY_AUTH_SECRET!=='string' || env.ACADEMY_AUTH_SECRET.length<48 || !env.SITE_ORIGIN || !env.BREVO_API_KEY || !env.DANINI_BREVO_SENDER || !env.DANINI_TURNSTILE_SECRET || !env.DANINI_TURNSTILE_SITEKEY)throw err(503,'academy_not_configured');
}
async function key(secret){return crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);}
async function mac(secret,value){const bytes=new Uint8Array(await crypto.subtle.sign('HMAC',await key(secret),encoder.encode(value)));return Array.from(bytes,x=>x.toString(16).padStart(2,'0')).join('');}
function equal(a,b){if(!HEX.test(a)||!HEX.test(b))return false;let result=0;for(let i=0;i<64;i++)result|=a.charCodeAt(i)^b.charCodeAt(i);return result===0;}
function nowSeconds(){return Math.floor(Date.now()/1000);}
function sessionCookie(token,age){return `${COOKIE}=${token}; Path=/api/academy/; HttpOnly; Secure; SameSite=Strict; Max-Age=${age}`;}
export function clearCookie(){return sessionCookie('',0);}
export function isConfigured(env){return env.ACADEMY_AUTH_ENABLED==='true' && typeof env.ACADEMY_AUTH_SECRET==='string' && env.ACADEMY_AUTH_SECRET.length>=48 && !!env.DANINI_DB && !!env.SITE_ORIGIN && !!env.DANINI_TURNSTILE_SITEKEY && !!env.DANINI_TURNSTILE_SECRET && !!env.BREVO_API_KEY && !!env.DANINI_BREVO_SENDER;}
function parseCookie(request){const all=request.headers.get('cookie')||'';const pair=all.split(';').map(x=>x.trim()).find(x=>x.startsWith(COOKIE+'='));const token=pair?.slice(COOKIE.length+1)||'';return HEX.test(token)?token.toLowerCase():null;}
async function bumpRate(db,keyHash,limit,windowSeconds,now){
 const result=await db.prepare(`INSERT INTO rate_buckets(key,count,expires_at) VALUES (?,1,?)
 ON CONFLICT(key) DO UPDATE SET
 count=CASE WHEN expires_at<? THEN 1 ELSE count+1 END,
 expires_at=CASE WHEN expires_at<? THEN excluded.expires_at ELSE expires_at END
 RETURNING count`).bind(keyHash,now+windowSeconds,now,now).first();
 if(!result||result.count>limit)throw err(429,'too_many_requests');
}
async function verifyTurnstile(request,env,token){
 if(typeof token!=='string'||token.length<10||token.length>2048)throw err(400,'verification_required');
 const body=new URLSearchParams({secret:env.DANINI_TURNSTILE_SECRET,response:token});
 const ip=request.headers.get('cf-connecting-ip');if(ip)body.set('remoteip',ip);
 let res;try{res=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{
  method:'POST',body,signal:AbortSignal.timeout(8000)});}catch{throw err(503,'human_verification_unavailable');}
 if(!res.ok)throw err(503,'human_verification_unavailable');
 const data=await res.json();
 if(data.success!==true||data.hostname!==new URL(env.SITE_ORIGIN).hostname||data.action!=='academy-login')throw err(403,'human_verification_failed');
}
export async function requestLogin(request,env,input){
 config(env);
 const email=typeof input?.email==='string'?input.email.trim().toLowerCase():'';
 const language=input?.language;
 if(email.length>254||!EMAIL.test(email)||!['sr','de'].includes(language))throw err(400,'invalid_input');
 if(env.MAIL_TEST_RECIPIENT && email!==env.MAIL_TEST_RECIPIENT.toLowerCase())throw err(403,'test_recipient_only');
 const now=nowSeconds();
 const emailHash=await mac(env.ACADEMY_AUTH_SECRET,'email:'+email);
 const ipHash=await mac(env.ACADEMY_AUTH_SECRET,'ip:'+(request.headers.get('cf-connecting-ip')||'unknown'));
 await bumpRate(env.DANINI_DB,'academy-login-ip:'+ipHash,5,600,now);
 await bumpRate(env.DANINI_DB,'academy-login-email:'+emailHash,3,900,now);
 await verifyTurnstile(request,env,input?.turnstileToken);
 const challengeId=crypto.randomUUID();
 // 8 decimal digits, cryptographically random; max 5 verify attempts.
 const random=crypto.getRandomValues(new Uint32Array(1))[0];
 const code=String(random%100000000).padStart(8,'0');
 const codeHash=await mac(env.ACADEMY_AUTH_SECRET,'otp:'+challengeId+':'+code);
 await env.DANINI_DB.prepare('UPDATE academy_login_challenges SET consumed_at=? WHERE email_hash=? AND consumed_at IS NULL').bind(now,emailHash).run();
 await env.DANINI_DB.prepare('INSERT INTO academy_login_challenges(id,email_hash,code_hash,expires_at,created_at) VALUES (?,?,?,?,?)').bind(challengeId,emailHash,codeHash,now+600,now).run();
 const de=language==='de';
 const payload={
  sender:{name:'DANINI Akademie',email:env.DANINI_BREVO_SENDER},to:[{email}],
  subject:de?'DANINI Akademie – Einmalcode zur Anmeldung':'DANINI Akademija – jednokratni kod za prijavu',
  htmlContent:de?`<p>Ihr Anmeldecode lautet: <strong>${code}</strong>.</p><p>Der Code gilt 10 Minuten. Wenn Sie ihn nicht angefordert haben, ignorieren Sie diese E-Mail.</p>`:
  `<p>Vaš kod za prijavu je: <strong>${code}</strong>.</p><p>Kod važi 10 minuta. Ako ga niste tražili, ignorišite ovu poruku.</p>`
 };
 try{
  const res=await fetch('https://api.brevo.com/v3/smtp/email',{method:'POST',headers:{'api-key':env.BREVO_API_KEY,'content-type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(10000)});
  if(!res.ok)throw Error('provider_failed');
 }catch{
  await env.DANINI_DB.prepare('UPDATE academy_login_challenges SET consumed_at=? WHERE id=?').bind(now,challengeId).run();
  throw err(503,'login_delivery_unavailable');
 }
 // No marketing opt-in, no stored plaintext email, no automated sales messages.
 return {accepted:true,challengeId,expiresInSeconds:600};
}
export async function verifyLogin(env,input){
 config(env);
 const id=typeof input?.challengeId==='string'?input.challengeId:'';
 const code=typeof input?.code==='string'?input.code:'';
 if(!CHALLENGE.test(id)||!/^[0-9]{8}$/.test(code))throw err(400,'invalid_code');
 const now=nowSeconds();
 // Atomic max-attempt decrement before comparison prevents concurrent unlimited guesses.
 const row=await env.DANINI_DB.prepare(`UPDATE academy_login_challenges SET attempts=attempts+1
 WHERE id=? AND consumed_at IS NULL AND expires_at>? AND attempts<5
 RETURNING email_hash,code_hash,attempts`).bind(id,now).first();
 if(!row)throw err(401,'invalid_or_expired_code');
 const digest=await mac(env.ACADEMY_AUTH_SECRET,'otp:'+id+':'+code);
 if(!equal(row.code_hash,digest))throw err(401,'invalid_or_expired_code');
 // Only one successful verification may consume the challenge.
 const claimed=await env.DANINI_DB.prepare('UPDATE academy_login_challenges SET consumed_at=? WHERE id=? AND consumed_at IS NULL').bind(now,id).run();
 if(claimed.meta?.changes!==1)throw err(401,'invalid_or_expired_code');
 let user=await env.DANINI_DB.prepare('SELECT id FROM academy_users WHERE email_hash=?').bind(row.email_hash).first();
 if(!user){
  await env.DANINI_DB.prepare('INSERT OR IGNORE INTO academy_users(id,email_hash,created_at) VALUES (?,?,?)').bind(crypto.randomUUID(),row.email_hash,now).run();
  user=await env.DANINI_DB.prepare('SELECT id FROM academy_users WHERE email_hash=?').bind(row.email_hash).first();
 }
 if(!user)throw err(503,'account_unavailable');
 const actor={authenticated:true,userId:user.id};
 await registerAuthenticatedUser(env.DANINI_DB,actor);
 const raw=Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,'0')).join('');
 const hash=await mac(env.ACADEMY_AUTH_SECRET,'session:'+raw);
 const sessionId=crypto.randomUUID();
 const ttl=7*86400;
 await env.DANINI_DB.prepare('INSERT INTO academy_sessions(id,user_id,token_hash,expires_at,created_at) VALUES (?,?,?,?,?)').bind(sessionId,user.id,hash,now+ttl,now).run();
 return {actor,cookie:sessionCookie(raw,ttl),expiresInSeconds:ttl};
}
export async function authenticate(request,env){
 config(env);
 const raw=parseCookie(request);
 if(!raw)throw err(401,'login_required');
 const tokenHash=await mac(env.ACADEMY_AUTH_SECRET,'session:'+raw);
 const session=await env.DANINI_DB.prepare(`SELECT user_id FROM academy_sessions WHERE token_hash=? AND revoked_at IS NULL AND expires_at>?`).bind(tokenHash,nowSeconds()).first();
 if(!session)throw err(401,'login_required');
 return {authenticated:true,userId:session.user_id};
}
export async function logout(request,env){
 config(env);
 const raw=parseCookie(request);
 if(raw){const hash=await mac(env.ACADEMY_AUTH_SECRET,'session:'+raw);
  await env.DANINI_DB.prepare('UPDATE academy_sessions SET revoked_at=? WHERE token_hash=? AND revoked_at IS NULL').bind(nowSeconds(),hash).run();}
 return {loggedOut:true,cookie:clearCookie()};
}
export async function deleteAccount(db,actor){
 const r=await db.prepare('DELETE FROM academy_users WHERE id=?').bind(actor.userId).run();
 return {deleted:r.meta?.changes===1};
}