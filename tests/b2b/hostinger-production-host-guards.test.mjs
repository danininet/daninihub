import {test} from 'node:test';
import assert from 'node:assert/strict';
import assets from '../../hostinger-assets.cjs';
import business from '../../hostinger-business.cjs';
import academy from '../../hostinger-academy.cjs';
import academyDB from '../../hostinger-academy-db.cjs';

const host='gleaming-orangered-crow-58.hostingersite.com';
const live='daninihub.com';
const config={HOSTINGER_PUBLIC_DOMAIN_ENABLED:'true',HOSTINGER_BUSINESS_PUBLIC_ENABLED:'true',HOSTINGER_BUSINESS_TEST_ENABLED:'true',HOSTINGER_ACADEMY_TEST_ENABLED:'true',HOSTINGER_ACADEMY_PUBLIC_ENABLED:'true',MAIL_TEST_RECIPIENT:'test@example.test',DANINI_NOTIFY_TO:'operator@example.test',DANINI_BREVO_SENDER:'sender@example.test',ACADEMY_AUTH_SECRET:'s'.repeat(48),HOSTINGER_ACADEMY_PUBLIC_SECRET:'p'.repeat(48),HOSTINGER_ACADEMY_PUBLIC_INVITES:'pilot@example.test'};
test('indexing cannot escape exact canonical host and explicit activation',()=>{
 assert.equal(assets.publicDomainEnabled(config,true,live),true);
 for(const h of [host,'www.daninihub.com','daninihub.com.attacker.test','localhost'])assert.equal(assets.publicDomainEnabled(config,true,h),false);
 assert.equal(assets.publicDomainEnabled(config,false,live),false);
 assert.equal(assets.publicDomainEnabled({},true,live),false);
});
test('Business recipients and activation are separate',()=>{
 const stage=business.businessContext(config,host),prod=business.businessContext(config,live);
 assert.equal(stage.env.DANINI_NOTIFY_TO,'test@example.test');
 assert.equal(stage.test.recipient,'test@example.test');
 assert.equal(prod.env.DANINI_NOTIFY_TO,'operator@example.test');
 assert.equal(prod.test,undefined);
 assert.equal(business.businessContext({},live),null);
 assert.equal(business.businessContext({...config,DANINI_NOTIFY_TO:''},live).env.DANINI_CONTACT_ACTIVE,'false');
 assert.equal(business.businessContext({...config,HOSTINGER_BUSINESS_PUBLIC_ENABLED:'false'},live).env.DANINI_CONTACT_ACTIVE,'false');
});
test('Academy remains invite-only with independently configured production credentials',()=>{
 const stage=academy.academyContext(config,host),prod=academy.academyContext(config,live);
 assert.equal(stage.production,false);assert.equal(prod.production,true);
 assert.equal(stage.env.MAIL_TEST_RECIPIENTS,'test@example.test');
 assert.equal(prod.env.MAIL_TEST_RECIPIENTS,'pilot@example.test');
 assert.equal(prod.env.ACADEMY_INVITE_ONLY,'true');
 assert.equal(prod.env.ACADEMY_AUTH_ENABLED,'true');
 assert.notEqual(stage.env.ACADEMY_AUTH_SECRET,prod.env.ACADEMY_AUTH_SECRET);
 assert.equal(academy.academyContext({...config,HOSTINGER_ACADEMY_PUBLIC_SECRET:config.ACADEMY_AUTH_SECRET},live).env.ACADEMY_AUTH_ENABLED,'false');
 assert.equal(academy.academyContext({...config,HOSTINGER_ACADEMY_PUBLIC_INVITES:''},live).env.ACADEMY_AUTH_ENABLED,'false');
 assert.equal(academy.academyContext({},live),null);
 assert.equal(academy.academyContext(config,'attacker.test'),null);
});
test('Academy production schema and transactions use separate physical tables',async()=>{
 const calls=[];
 const connection={execute:async(sql,args)=>{calls.push({sql,args});return [[{id:'mock'}]];},beginTransaction:async()=>{},commit:async()=>{},rollback:async()=>{},release:()=>{}};
 const pool={...connection,getConnection:async()=>connection};
 const db=await academyDB.initializeAcademy(pool,true);
 assert.equal(calls.length,6);
 for(const {sql} of calls){assert.match(sql,/CREATE TABLE IF NOT EXISTS danini_public_academy_/);assert.doesNotMatch(sql,/REFERENCES academy_/);}
 await db.prepare('SELECT id FROM academy_users WHERE email_hash=?').bind('academy_projects').first();
 assert.match(calls.at(-1).sql,/FROM danini_public_academy_users/);
 assert.deepEqual(calls.at(-1).args,['academy_projects']);
 const scoped=academyDB.academyTableScope(pool,true);
 const tx=await scoped.getConnection();
 await tx.execute('SELECT id FROM academy_projects WHERE id=?',['test']);
 assert.match(calls.at(-1).sql,/FROM danini_public_academy_projects/);
 assert.equal(academyDB.academyTableScope(pool,false),pool);
});
