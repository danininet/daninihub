'use strict';
/**
 * Hostinger AutoDanini owner desk, fully opt-in.
 * Buyer first authenticates using one-time Brevo email; owner then presents
 * independent TOTP, verified against a pre-provisioned PRIVATE server secret.
 * Never grants admin access based solely on public contact email or a header.
 */
const express=require('express');
const crypto=require('node:crypto');
const {readCookie,secretHash,verifyOrigin,hexId}=require('./autodanini-auth-security');
const {stepFromCode,ownerConfigured,ownerIdentity,adminCookie,removeAdminCookie,readAdminCookie}=require('./autodanini-admin-security');
const STATUSES=new Set(['new','reviewing','waiting_on_buyer','quote_draft','closed']);
const ID=/^[a-f0-9]{32}$/;
const SUBID=/^[a-f0-9]{40}$/;
function submissionId(secret,userId,caseId){
  return crypto.createHmac('sha256',secret).update('submission:'+userId+':'+caseId).digest('hex').slice(0,40);
}
function makeOwnerDesk({store,customerAuth,env=process.env,clock=()=>Date.now()}){
  if(!ownerConfigured(env))throw new Error('ADMIN_MFA_CONFIGURATION_REQUIRED');
  if(!customerAuth||typeof customerAuth.customer!=='function')throw new Error('CUSTOMER_AUTH_REQUIRED');
  const secret=env.DANINI_AUTH_HMAC_SECRET;
  let prepared;
  async function pool(){
    await store.init();
    if(store.mode!=='mysql'||!store.pool)throw new Error('ADMIN_DATABASE_UNAVAILABLE');
    if(!prepared)prepared=(async()=>{
      const db=store.pool;
      await db.execute(`CREATE TABLE IF NOT EXISTS ad_admin_mfa_state (
        owner_id CHAR(32) PRIMARY KEY,last_step BIGINT NOT NULL DEFAULT -1,
        attempt_count INT NOT NULL DEFAULT 0,window_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
      await db.execute(`CREATE TABLE IF NOT EXISTS ad_admin_elevations (
        token_hash CHAR(64) PRIMARY KEY,customer_id CHAR(32) NOT NULL,
        login_hash CHAR(64) NOT NULL,expires_at DATETIME NOT NULL,
        INDEX idx_ad_admin_customer (customer_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
      await db.execute(`CREATE TABLE IF NOT EXISTS ad_submitted_requests (
        id CHAR(40) PRIMARY KEY,customer_id CHAR(32) NOT NULL,source_case_id CHAR(32) NOT NULL,
        type VARCHAR(40) NOT NULL,vehicle VARCHAR(280) NOT NULL,destination VARCHAR(80) NOT NULL,
        budget DECIMAL(12,2) NULL,listing VARCHAR(900) NOT NULL DEFAULT '',
        notes TEXT NOT NULL,status VARCHAR(32) NOT NULL DEFAULT 'new',
        quote_eur DECIMAL(12,2) NULL,admin_note TEXT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY idx_ad_submission_owner_case (customer_id,source_case_id),
        INDEX idx_ad_inbox_created (created_at,id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
      await db.execute(`CREATE TABLE IF NOT EXISTS ad_admin_audit (
        id CHAR(32) PRIMARY KEY,request_id CHAR(40) NOT NULL,operator_id CHAR(32) NOT NULL,
        status_from VARCHAR(32) NOT NULL,status_to VARCHAR(32) NOT NULL,
        quote_modified BOOLEAN NOT NULL DEFAULT FALSE,
        changed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
    })().catch(e=>{prepared=null;throw e});
    await prepared;
    return store.pool;
  }
  async function getCustomer(req){
    return customerAuth.customer(req);
  }
  function csrf(req,res,next){
    if(!verifyOrigin(req.headers.origin,env.DANINI_PUBLIC_URL))
      return res.status(403).json({error:'ORIGIN_DENIED'});
    next();
  }
  async function buyer(req,res,next){
    try{
      const user=await getCustomer(req);
      if(!user)return res.status(401).json({error:'LOGIN_REQUIRED'});
      req.adBuyer=user;
      next();
    }catch{return res.status(503).json({error:'DATABASE_UNAVAILABLE'})}
  }
  async function owner(req,res,next){
    try{
      const user=await getCustomer(req);
      if(!ownerIdentity(user,env))return res.status(403).json({error:'ADMIN_FORBIDDEN'});
      const token=readAdminCookie(req.headers.cookie),login=readCookie(req.headers.cookie);
      if(!token||!login)return res.status(403).json({error:'ADMIN_MFA_REQUIRED'});
      const db=await pool();
      const [rows]=await db.execute(
        `SELECT token_hash FROM ad_admin_elevations
         WHERE token_hash=? AND customer_id=? AND login_hash=?
           AND expires_at>NOW() LIMIT 1`,
        [secretHash(secret,'admin-session',token),user.id,secretHash(secret,'session',login)]
      );
      if(!rows.length)return res.status(403).json({error:'ADMIN_MFA_REQUIRED'});
      req.adOwner=user;
      next();
    }catch{return res.status(503).json({error:'ADMIN_UNAVAILABLE'})}
  }
  const router=express.Router();
  router.use((_req,res,next)=>{
    res.set({'Cache-Control':'no-store','Pragma':'no-cache','Referrer-Policy':'no-referrer','X-Robots-Tag':'noindex,nofollow'});
    next();
  });
  router.post('/admin/elevate',express.json({limit:'2kb'}),csrf,buyer,async(req,res)=>{
    if(!ownerIdentity(req.adBuyer,env))return res.status(403).json({error:'ADMIN_FORBIDDEN'});
    const code=req.body?.code;
    if(typeof code!=='string'||!/^\d{6}$/.test(code))return res.status(400).json({error:'INVALID_MFA_CODE'});
    let c;
    try{
      const db=await pool();
      c=await db.getConnection();await c.beginTransaction();
      await c.execute('INSERT IGNORE INTO ad_admin_mfa_state (owner_id) VALUES (?)',[req.adBuyer.id]);
      const [entries]=await c.execute('SELECT * FROM ad_admin_mfa_state WHERE owner_id=? FOR UPDATE',[req.adBuyer.id]);
      const state=entries[0];
      if(!state)throw new Error('MFA_STATE_UNAVAILABLE');
      const windowStart=state.window_at instanceof Date ? state.window_at.getTime():Date.parse(state.window_at);
      const recent=Number.isFinite(windowStart) && clock()-windowStart<3600000;
      const attempts=recent?Number(state.attempt_count):0;
      if(attempts>=5){await c.rollback();return res.status(429).json({error:'MFA_LIMIT_REACHED'});}
      const step=stepFromCode(env.AUTODANINI_OWNER_TOTP_SECRET,code,clock());
      if(step<0||step<=Number(state.last_step)){
        await c.execute(`UPDATE ad_admin_mfa_state SET attempt_count=?,window_at=?
          WHERE owner_id=?`,[attempts+1,recent?state.window_at:new Date(clock()),req.adBuyer.id]);
        await c.commit();return res.status(401).json({error:'MFA_DENIED'});
      }
      await c.execute(`UPDATE ad_admin_mfa_state
        SET last_step=?,attempt_count=0,window_at=? WHERE owner_id=?`,
        [step,new Date(clock()),req.adBuyer.id]);
      const sessionToken=readCookie(req.headers.cookie);
      if(!sessionToken)throw new Error('LOGIN_REQUIRED');
      const token=hexId(32);
      await c.execute(
        `INSERT INTO ad_admin_elevations (token_hash,customer_id,login_hash,expires_at)
         VALUES (?,?,?,DATE_ADD(NOW(),INTERVAL 20 MINUTE))`,
        [secretHash(secret,'admin-session',token),req.adBuyer.id,secretHash(secret,'session',sessionToken)]
      );
      await c.commit();
      res.set('Set-Cookie',adminCookie(token));
      return res.json({authorized:true,expiresInSeconds:1200});
    }catch(e){
      if(c)try{await c.rollback()}catch{}
      console.error('AutoDanini owner MFA unavailable:',e.code||e.message);
      return res.status(503).json({error:'ADMIN_UNAVAILABLE'});
    }finally{if(c)c.release()}
  });
  router.get('/admin/session',owner,(_req,res)=>res.json({authorized:true,expiresInSeconds:1200}));
  router.post('/admin/logout',express.json({limit:'2kb'}),csrf,async(req,res)=>{
    try{
      const token=readAdminCookie(req.headers.cookie);
      if(token){
        const db=await pool();
        await db.execute('DELETE FROM ad_admin_elevations WHERE token_hash=?',
          [secretHash(secret,'admin-session',token)]);
      }
      res.set('Set-Cookie',removeAdminCookie());
      return res.json({ok:true});
    }catch{return res.status(503).json({error:'ADMIN_UNAVAILABLE'})}
  });

  // A private draft is NOT visible in the admin inbox. Only buyer's explicit
  // submitConsent creates the immutable request snapshot below.
  router.post('/case-submissions',express.json({limit:'3kb'}),csrf,buyer,async(req,res)=>{
    const id=req.body?.caseId;
    if(!ID.test(id||'')||req.body?.submitConsent!==true)
      return res.status(400).json({error:'EXPLICIT_CONSENT_REQUIRED'});
    const user=req.adBuyer,receipt=submissionId(secret,user.id,id);
    try{
      const db=await pool();
      const [rows]=await db.execute(
        `SELECT id FROM ad_private_cases WHERE id=? AND customer_id=? LIMIT 1`,[id,user.id]);
      if(!rows.length)return res.status(404).json({error:'CASE_NOT_FOUND'});
      await db.execute(
        `INSERT IGNORE INTO ad_submitted_requests
          (id,customer_id,source_case_id,type,vehicle,destination,budget,listing,notes,status,admin_note)
         SELECT ?,customer_id,id,type,vehicle,destination,budget,listing,notes,'new',''
         FROM ad_private_cases WHERE id=? AND customer_id=?`,
        [receipt,id,user.id]
      );
      const [saved]=await db.execute(
        'SELECT id,status FROM ad_submitted_requests WHERE id=? AND customer_id=? AND source_case_id=? LIMIT 1',
        [receipt,user.id,id]);
      if(!saved.length)return res.status(503).json({error:'SUBMISSION_NOT_CONFIRMED'});
      return res.json({submissionId:saved[0].id,submitted:true,status:saved[0].status});
    }catch{return res.status(503).json({error:'SUBMISSION_UNAVAILABLE'})}
  });
  router.get('/my-submission/:caseId',buyer,async(req,res)=>{
    const id=req.params.caseId;
    if(!ID.test(id))return res.status(404).json({error:'CASE_NOT_FOUND'});
    try{
      const db=await pool(),receipt=submissionId(secret,req.adBuyer.id,id);
      const [rows]=await db.execute(
        'SELECT id,status,created_at AS createdAt,updated_at AS updatedAt FROM ad_submitted_requests WHERE id=? AND customer_id=? AND source_case_id=? LIMIT 1',
        [receipt,req.adBuyer.id,id]);
      if(!rows.length)return res.json({submitted:false});
      const entry=rows[0];
      return res.json({submitted:true,submissionId:entry.id,status:entry.status,createdAt:entry.createdAt,updatedAt:entry.updatedAt});
    }catch{return res.status(503).json({error:'SUBMISSION_UNAVAILABLE'})}
  });

  router.get('/admin/requests',owner,async(req,res)=>{
    const page=String(req.query?.nextToken||'0');
    if(!/^(0|[1-9]\d{0,3})$/.test(page)||Number(page)>3000)
      return res.status(400).json({error:'INVALID_PAGE'});
    const offset=Number(page);
    try{
      const db=await pool();
      const [rows]=await db.execute(
        `SELECT s.id,s.customer_id AS userId,
         c.email AS ownerEmail,'' AS ownerName,
         s.vehicle,s.type,s.destination,s.budget,s.listing,s.notes,s.status,
         s.quote_eur AS quoteEUR,s.admin_note AS adminNote,
         s.created_at AS createdAt,s.updated_at AS updatedAt
         FROM ad_submitted_requests s JOIN ad_customers c ON c.id=s.customer_id
         ORDER BY s.created_at DESC,s.id DESC LIMIT 31 OFFSET ?`,
        [offset]
      );
      const requests=rows.slice(0,30).map(row=>({...row,
        budget:row.budget===null?null:Number(row.budget),
        quoteEUR:row.quoteEUR===null?null:Number(row.quoteEUR)}));
      return res.json({requests,nextToken:rows.length>30&&offset+30<=3000?String(offset+30):null});
    }catch{return res.status(503).json({error:'INBOX_UNAVAILABLE'})}
  });
  router.put('/admin/requests/:id',express.json({limit:'7kb'}),csrf,owner,async(req,res)=>{
    const id=req.params.id,input=req.body||{};
    if(!SUBID.test(id)||!STATUSES.has(input.status)||!STATUSES.has(input.expectedStatus)||
       typeof input.adminNote!=='string'||input.adminNote.length>1600||
       (input.quoteEUR!==null&&(!Number.isFinite(input.quoteEUR)||input.quoteEUR<0||input.quoteEUR>1000000)))
      return res.status(400).json({error:'INVALID_ADMIN_EDIT'});
    let c;
    try{
      const db=await pool();c=await db.getConnection();await c.beginTransaction();
      const [rows]=await c.execute('SELECT status,quote_eur FROM ad_submitted_requests WHERE id=? FOR UPDATE',[id]);
      const before=rows[0];
      if(!before){await c.rollback();return res.status(404).json({error:'REQUEST_NOT_FOUND'});}
      if(before.status!==input.expectedStatus){
        await c.rollback();return res.status(409).json({error:'CASE_VERSION_CONFLICT'});
      }
      await c.execute(
        `UPDATE ad_submitted_requests SET status=?,quote_eur=?,admin_note=?,updated_at=NOW() WHERE id=?`,
        [input.status,input.quoteEUR,input.adminNote,id]);
      await c.execute(
        `INSERT INTO ad_admin_audit (id,request_id,operator_id,status_from,status_to,quote_modified)
         VALUES (?,?,?,?,?,?)`,
        [hexId(),id,req.adOwner.id,before.status,input.status,
          Number(before.quote_eur||0)!==Number(input.quoteEUR||0)?1:0]
      );
      await c.commit();
      return res.json({updated:true,status:input.status,quoteIsDraft:true,paymentCaptured:false});
    }catch(e){
      if(c)try{await c.rollback()}catch{}
      console.error('AutoDanini owner edit unavailable:',e.code||e.message);
      return res.status(503).json({error:'ADMIN_SAVE_UNAVAILABLE'});
    }finally{if(c)c.release()}
  });
  return {router,pool};
}
module.exports={makeOwnerDesk,submissionId,STATUSES};
