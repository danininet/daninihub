import {test} from 'node:test';
import assert from 'node:assert/strict';
import {approvedPartners,partners} from '../../src/lib/affiliate-register.ts';
test('only Make is active on the two business guides',()=>{
 for(const guide of ['email-formular-crm','ki-buero']) assert.deepEqual(approvedPartners(guide).map(p=>[p.name,p.trackingUrl]),[['Make','https://www.make.com/en/register?pc=danini']]);
 for(const guide of ['gebrauchtwagen-anzahlung','fahrzeugpapiere','auto-deutschland-serbien','kundenanfragen','unknown']) assert.deepEqual(approvedPartners(guide),[]);
 for(const p of partners.filter(p=>p.name!=='Make')) {assert.equal(p.approved,false);assert.equal(p.trackingUrl,null);}
});
