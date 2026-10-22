'use strict';
/**
 * Isolated Hostinger Business customer accounts (MYSql + Brevo one-time codes).
 * NOT mounted unless AUTODANINI_PREVIEW_ENABLED and AUTODANINI_AUTH_ENABLED
 * are explicitly set. Legacy admin/payments remain unavailable.
 */
const express=require('express');
const {BrevoClient}=require('@getbrevo/brevo');
const {
  safeEmail,verifyOrigin,hexId,secretHash,makeCookie,clearCookie,
  readCookie,makeChallengeCode,validChallengeCode
}=require('./autodanini-auth-security');
const SESSION_SECONDS=7*86400;

function makeCustomerAuth({store,env=process.env,sendEmail}){
  const secret=String(env.DANINI_AUTH_HMAC_SECRET||'');
  if(secret.length<32)throw new Error('AUTH_SECRET_CONFIGURATION_REQUIRED');
  if(!store||!store.init)throw new Error('AUTH_DATABASE_REQUIRED');
  let prepared;
  async function db(){
    await store.init();
    if(store.mode!=='mysql'||!store.pool)throw new Error('AUTH_DATABASE_UNAVAILABLE');
    if(!prepared)prepared=(async()=>{
      const pool=store.pool;
      await pool.execute(`CREATE TABLE IF NOT EXISTS ad_customers (
        id CHAR(32) PRIMARY KEY, email VARCHAR(191) NOT NULL UNIQUE,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
      await pool.execute(`CREATE TABLE IF NOT EXISTS ad_login_codes (
        id CHAR(32) PRIMARY KEY, email VARCHAR(191) NOT NULL,
        code_hash CHAR(64) NOT NULL, ip_hash CHAR(64) NOT NULL,
        attempts INT NOT NULL DEFAULT 0, used_at DATETIME NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME NOT NULL,
        INDEX idx_login_email_time (email,created_at),
        INDEX idx_login_ip_time (ip_hash,created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
      await pool.execute(`CREATE TABLE IF NOT EXISTS ad_sessions (
        token_hash CHAR(64) PRIMARY KEY, customer_id CHAR(32) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME NOT NULL,
        INDEX idx_ad_session_user (customer_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
      await pool.execute(`CREATE TABLE IF NOT EXISTS ad_private_cases (
        id CHAR(32) PRIMARY KEY, customer_id CHAR(32) NOT NULL,
        type VARCHAR(40) NOT NULL, vehicle VARCHAR(280) NOT NULL,
        destination VARCHAR(80) NOT NULL, budget DECIMAL(12,2) NULL,
        listing VARCHAR(900) NOT NULL DEFAULT '',
        notes TEXT NOT NULL, status VARCHAR(32) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_ad_cases_owner (customer_id,created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
    })().catch(e=>{prepared=null;throw e});
    await prepared;
    return store.pool;
  }
  function requireOrigin(req,res,next){
    if(!verifyOrigin(req.headers.origin,env.DANINI_PUBLIC_URL))
      return res.status(403).json({error:'ORIGIN_DENIED'});
    return next();
  }
  async function sendCode(email,code){
    if(sendEmail)return sendEmail(email,code);
    if(!env.BREVO_API_KEY||!safeEmail(env.BREVO_SENDER_EMAIL))
      throw new Error('AUTH_EMAIL_CONFIGURATION_REQUIRED');
    const api=new BrevoClient({apiKey:env.BREVO_API_KEY}).transactionalEmails;
    await api.sendTransacEmail({
      sender:{name:'AutoDanini',email:env.BREVO_SENDER_EMAIL},
      to:[{email}],
      subject:'AutoDanini — jednokratni kod / Einmalcode',
      textContent:'Vaš jednokratni kod / Ihr Einmalcode: '+code+
        '\nVaži 10 minuta. Ako niste tražili prijavu, zanemarite ovu poruku.'+
        '\n10 Minuten gültig. Wenn Sie keine Anmeldung angefordert haben, ignorieren Sie diese Nachricht.'
    });
  }
  async function customer(req){
    const token=readCookie(req.headers.cookie);
    if(!token)return null;
    const pool=await db();
    const hash=secretHash(secret,'session',token);
    const [rows]=await pool.execute(
      `SELECT c.id,c.email FROM ad_sessions s JOIN ad_customers c
       ON c.id=s.customer_id WHERE s.token_hash=? AND s.expires_at>UTC_TIMESTAMP() LIMIT 1`,
      [hash]
    );
    return rows[0]||null;
  }
  async function requireCustomer(req,res,next){
    try{
      const user=await customer(req);
      if(!user)return res.status(401).json({error:'LOGIN_REQUIRED'});
      req.autodaniniCustomer=user;
      return next();
    }catch{return res.status(503).json({error:'AUTH_UNAVAILABLE'})}
  }
  const router=express.Router();
  router.use((req,res,next)=>{res.set({'Cache-Control':'no-store','Pragma':'no-cache','Referrer-Policy':'no-referrer'});next()});
  router.post('/auth/start',express.json({limit:'8kb'}),requireOrigin,async(req,res)=>{
    const email=safeEmail(req.body?.email);
    if(!email)return res.status(400).json({error:'VALID_EMAIL_REQUIRED'});
    try{
      const pool=await db();
      const ipHash=secretHash(secret,'ip',String(req.ip||'unknown'));
      const [[counts]]=await pool.query(
        `SELECT
          (SELECT COUNT(*) FROM ad_login_codes WHERE email=? AND created_at>DATE_SUB(UTC_TIMESTAMP(),INTERVAL 1 HOUR)) AS email_count,
          (SELECT COUNT(*) FROM ad_login_codes WHERE ip_hash=? AND created_at>DATE_SUB(UTC_TIMESTAMP(),INTERVAL 1 HOUR)) AS ip_count`,
        [email,ipHash]
      );
      if(Number(counts.email_count)>=3||Number(counts.ip_count)>=20)
        return res.status(429).json({error:'PLEASE_TRY_LATER'});
      const id=hexId(),code=makeChallengeCode();
      await pool.execute(
        `INSERT INTO ad_login_codes (id,email,code_hash,ip_hash,expires_at)
         VALUES (?,?,?,?,DATE_ADD(UTC_TIMESTAMP(),INTERVAL 10 MINUTE))`,
        [id,email,secretHash(secret,'otp',id+':'+code),ipHash]
      );
      await sendCode(email,code);
      return res.status(202).json({challengeId:id,expiresInSeconds:600});
    }catch(err){
      console.error('AutoDanini login start unavailable:',err.code||err.message);
      return res.status(503).json({error:'AUTH_UNAVAILABLE'});
    }
  });
  router.post('/auth/verify',express.json({limit:'8kb'}),requireOrigin,async(req,res)=>{
    const id=req.body?.challengeId,code=req.body?.code;
    if(typeof id!=='string'||!/^[a-f0-9]{32}$/.test(id)||!validChallengeCode(code))
      return res.status(400).json({error:'INVALID_CODE'});
    let conn;
    try{
      const pool=await db();
      conn=await pool.getConnection();
      await conn.beginTransaction();
      const [rows]=await conn.execute(
        'SELECT * FROM ad_login_codes WHERE id=? FOR UPDATE',[id]
      );
      const item=rows[0];
      if(!item||item.used_at||item.attempts>=5||new Date(item.expires_at).getTime()<=Date.now()){
        await conn.rollback();return res.status(401).json({error:'INVALID_OR_EXPIRED_CODE'});
      }
      const expected=secretHash(secret,'otp',id+':'+code);
      if(item.code_hash!==expected){
        await conn.execute(
          'UPDATE ad_login_codes SET attempts=attempts+1 WHERE id=?',[id]
        );
        await conn.commit();return res.status(401).json({error:'INVALID_OR_EXPIRED_CODE'});
      }
      await conn.execute('UPDATE ad_login_codes SET used_at=UTC_TIMESTAMP() WHERE id=?',[id]);
      const newId=hexId();
      await conn.execute(
        'INSERT INTO ad_customers (id,email) VALUES (?,?) ON DUPLICATE KEY UPDATE email=VALUES(email)',
        [newId,item.email]
      );
      const [users]=await conn.execute('SELECT id,email FROM ad_customers WHERE email=? LIMIT 1',[item.email]);
      const user=users[0];
      const token=hexId(32);
      await conn.execute(
        `INSERT INTO ad_sessions (token_hash,customer_id,expires_at)
         VALUES (?,?,DATE_ADD(UTC_TIMESTAMP(),INTERVAL 7 DAY))`,
        [secretHash(secret,'session',token),user.id]
      );
      await conn.commit();
      res.set('Set-Cookie',makeCookie(token,SESSION_SECONDS));
      return res.json({user:{userId:user.id,email:user.email}});
    }catch(err){
      if(conn)try{await conn.rollback()}catch{}
      console.error('AutoDanini login verification unavailable:',err.code||err.message);
      return res.status(503).json({error:'AUTH_UNAVAILABLE'});
    }finally{if(conn)conn.release()}
  });
  router.get('/auth/me',async(req,res)=>{
    try{
      const user=await customer(req);
      return res.json({user:user?{userId:user.id,email:user.email}:null});
    }catch{return res.status(503).json({error:'AUTH_UNAVAILABLE'})}
  });
  router.post('/auth/logout',express.json({limit:'2kb'}),requireOrigin,async(req,res)=>{
    try{
      const token=readCookie(req.headers.cookie);
      if(token){
        const pool=await db();
        await pool.execute('DELETE FROM ad_sessions WHERE token_hash=?',[secretHash(secret,'session',token)]);
      }
      res.set('Set-Cookie',clearCookie());
      return res.json({ok:true});
    }catch{return res.status(503).json({error:'AUTH_UNAVAILABLE'})}
  });
  const caseTypes=new Set(['sourcing','inspection','import','dealer','exclusive','auction_interest']);
  const destinations=new Set(['Srbija','Nemačka','BiH','Crna Gora','Hrvatska','Slovenija','Drugo']);
  router.get('/my-cases',requireCustomer,async(req,res)=>{
    try{
      const pool=await db();
      const [rows]=await pool.execute(
        `SELECT id,type,vehicle,destination,budget,listing,notes,status,created_at AS createdAt
         FROM ad_private_cases WHERE customer_id=? ORDER BY created_at DESC LIMIT 21`,
        [req.autodaniniCustomer.id]
      );
      return res.json({cases:rows.map(r=>({...r,budget:r.budget===null?null:Number(r.budget)}))});
    }catch{return res.status(503).json({error:'CASE_STORAGE_UNAVAILABLE'})}
  });
  router.post('/my-cases',express.json({limit:'16kb'}),requireOrigin,requireCustomer,async(req,res)=>{
    const data=req.body||{};
    const type=typeof data.type==='string'?data.type:'';
    const vehicle=typeof data.vehicle==='string'?data.vehicle.trim():'';
    const destination=typeof data.destination==='string'?data.destination:'';
    const notes=typeof data.notes==='string'?data.notes.trim():'';
    const listing=typeof data.listing==='string'?data.listing.trim():'';
    const budget=data.budget===null||data.budget===undefined?null:Number(data.budget);
    if(data.consent!==true||!caseTypes.has(type)||!destinations.has(destination)||
       vehicle.length<3||vehicle.length>280||notes.length>4000||listing.length>900||
       (listing && (!/^https:\/\//.test(listing)||!URL.canParse(listing)))||
       (budget!==null&&(!Number.isFinite(budget)||budget<0||budget>1000000)))
      return res.status(400).json({error:'INVALID_CASE'});
    try{
      const pool=await db(),owner=req.autodaniniCustomer.id;
      // Database-enforced owner id; never accept customer_id from submitted body.
      const [[count]]=await pool.execute(
        'SELECT COUNT(*) AS total FROM ad_private_cases WHERE customer_id=?',[owner]
      );
      if(Number(count.total)>=20)return res.status(429).json({error:'CASE_LIMIT_REACHED'});
      const id=hexId();
      await pool.execute(
        `INSERT INTO ad_private_cases (id,customer_id,type,vehicle,destination,budget,listing,notes,status)
         VALUES (?,?,?,?,?,?,?,?,'saved_not_submitted')`,
        [id,owner,type,vehicle,destination,budget,listing,notes]
      );
      return res.status(201).json({id,status:'saved_not_submitted'});
    }catch{return res.status(503).json({error:'CASE_STORAGE_UNAVAILABLE'})}
  });
  router.delete('/my-cases/:id',requireOrigin,requireCustomer,async(req,res)=>{
    const id=req.params.id;
    if(!/^[a-f0-9]{32}$/.test(id))return res.status(404).json({error:'CASE_NOT_FOUND'});
    try{
      const pool=await db();
      const [result]=await pool.execute(
        'DELETE FROM ad_private_cases WHERE id=? AND customer_id=?',
        [id,req.autodaniniCustomer.id]
      );
      if(!result.affectedRows)return res.status(404).json({error:'CASE_NOT_FOUND'});
      return res.json({ok:true});
    }catch{return res.status(503).json({error:'CASE_STORAGE_UNAVAILABLE'})}
  });
  // No automatic handover to an administrator before authenticated admin inbox exists.
  router.get('/my-submission/:id',requireCustomer,(_req,res)=>res.status(503).json({error:'SUBMISSION_NOT_ACTIVE'}));
  router.post('/case-submissions',express.json({limit:'8kb'}),requireOrigin,requireCustomer,(_req,res)=>
    res.status(503).json({error:'SUBMISSION_NOT_ACTIVE'}));
  return {router,customer,db};
}
module.exports={makeCustomerAuth};
