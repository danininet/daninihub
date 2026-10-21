#!/usr/bin/env node
/**
 * Applies reviewed AutoDanini admin extension to an EXPORTED AppDeploy project directory.
 * Usage: node scripts/apply-to-appdeploy.mjs /path/to/autodanini-export
 *
 * This tool does NOT deploy, purchase hosting, change domain/DNS or enable auctions/payments.
 * The admin allowlist intentionally remains EMPTY (all admin endpoints deny access).
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const extensionDir=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const target=process.argv[2];
if(!target) throw new Error('Pass existing exported AppDeploy project path');
const dest=path.resolve(target);
const source=(file)=>fs.readFileSync(path.join(dest,file),'utf8');
const expected=['backend/index.ts','src/account.ts','vite.config.ts','privacy.html','tests/tests.json'];
for(const file of expected)if(!fs.existsSync(path.join(dest,file)))throw new Error('Missing existing AppDeploy file: '+file);
const updates=new Map();
function modify(file,marker,substitute){
 const old=updates.get(file)??source(file);
 if(!old.includes(marker))throw new Error('Expected marker not found in '+file+': '+marker.slice(0,80));
 updates.set(file,old.replace(marker,substitute));
}
const backend=source('backend/index.ts');
if(!backend.includes("export const handler = router({"))throw new Error('Unsupported router shape');
if(!backend.includes("import { router"))throw new Error('Unsupported AppDeploy SDK imports');
modify('backend/index.ts',"export const handler = router({",
 "import { adminRoutes } from './admin';\nexport const handler = router({\n  ...adminRoutes,");
modify('src/account.ts',"import { api, auth } from '@appdeploy/client';",
 "import { api, auth } from '@appdeploy/client';\nimport { attachCaseSubmission } from './account-submission';");
modify('src/account.ts',"actions.append(whatsapp,remove);",
 "actions.append(whatsapp,remove);\n  attachCaseSubmission(item.id, actions, german, message);");
modify('vite.config.ts','"ai-primer","faq","nalog"];','"ai-primer","faq","nalog","admin"];');
const privacySection=`<section class="section"><div class="wrap legaltext"><h2>Predaja zahteva AutoDanini timu / Einreichung an das AutoDanini-Team</h2>
<p>Sačuvani zahtev ostaje privatan dok izričito ne izaberete slanje u obradu. Potvrdom slanja AutoDanini timu postaju dostupni opis vozila, budžet, link, napomene, identifikator naloga i, kada postoje, ime i e-pošta. Administrator može beležiti status, internu napomenu i neobavezujući nacrt ponude. Ne postoji automatska kupovina, aukcijska ponuda ili naplata.</p>
<p>Eine gespeicherte Anfrage bleibt privat, bis Sie die Einreichung ausdrücklich bestätigen. Erst danach erhält das AutoDanini-Team Zugriff auf Fahrzeugangaben, Budget, Link, Notizen, Konto-ID und gegebenenfalls Name/E-Mail. Bearbeitungsstatus und unverbindliche Angebotsentwürfe sind möglich. Kein automatischer Fahrzeugkauf, Gebot oder Zahlungsvorgang.</p>
<p class="notice">Radni pravni dodatak / Rechtlicher Entwurf: pravni osnov, rukovalac, rokovi čuvanja, brisanje i pristup moraju se potvrditi pre komercijalnog rada.</p></div></section>`;
modify('privacy.html','<section class="cta">',privacySection+'<section class="cta">');
const cssAddition=`
.account-submit-review{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:15px 0}
.account-submit-review .btn{padding:10px 14px;min-height:38px;font-size:11px}
.account-submit-state{font-size:12px;color:#65737a;max-width:290px;overflow-wrap:anywhere}
`;
modify('src/styles.css','@tailwind utilities;','@tailwind utilities;\n'+cssAddition);
const tests=JSON.parse(source('tests/tests.json'));
if(!Array.isArray(tests)||tests.length<3||tests.length>5)throw new Error('Unexpected QA schema');
tests.splice(3);
tests.push({
 name:'Customer submits saved case to admin with explicit consent',viewport:'desktop',
 covers:['authenticated private case save','POST /api/case-submissions','GET /api/my-submission/:caseId','no automatic payment'],
 description:'A private case is not an operator request until explicitly submitted.',
 steps:['Sign in and create a saved vehicle case','Verify status is saved only','Click Pošalji u obradu and decline confirmation','Verify it remains private','Click again and confirm submission, then refresh'],
 expected:'Only confirmed submission creates a durable inbox record. A repeated submit uses the same receipt. No payment or auction bid is created.'
});
tests.push({
 name:'Admin authorization denies unauthorized accounts',viewport:'desktop',
 covers:['requireAuth middleware','requireAdminEmailAllowlist','private admin inbox','no PII disclosure'],
 description:'A normal registered user can never list or update another user’s requests.',
 steps:['Visit Admin Desk without login','Sign in as an ordinary buyer without admin authorization','Attempt to access the inbox'],
 expected:'No buyer personal data is displayed and server returns forbidden. Admin remains locked until owner email is explicitly configured.'
});
updates.set('tests/tests.json',JSON.stringify(tests,null,2));
for(const [file,content] of updates){
 if(!content)throw new Error('Empty content '+file);
}
for(const file of ['backend/admin.ts','src/admin.ts','src/account-submission.ts','admin.html']){
 const from=path.join(extensionDir,file),to=path.join(dest,file);
 if(fs.existsSync(to))throw new Error('Refusing overwrite of existing extension file: '+to);
 if(!fs.existsSync(from))throw new Error('Missing extension: '+from);
}
for(const [file,content] of updates){
 fs.writeFileSync(path.join(dest,file),content,'utf8');
}
for(const file of ['backend/admin.ts','src/admin.ts','src/account-submission.ts','admin.html']){
 const destination=path.join(dest,file);fs.mkdirSync(path.dirname(destination),{recursive:true});
 fs.copyFileSync(path.join(extensionDir,file),destination);
}
console.log('Applied AutoDanini Admin extension to '+dest);
console.log('SECURITY: Admin allowlist is empty. Configure after owner explicitly confirms email.');
console.log('AppDeploy publishing is a separate step; do NOT enable payments or auctions.');
