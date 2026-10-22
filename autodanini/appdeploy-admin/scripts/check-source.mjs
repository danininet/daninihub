#!/usr/bin/env node
// Read-only development checks. No deployment, network calls, secrets, or customer data.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(base,p),'utf8');
const checks=[
 ['backend/admin.ts',s=>s.includes("requireAuth()")&&s.includes("requireAdminEmailAllowlist(ADMIN_EMAILS)")&&s.includes("const ADMIN_EMAILS: string[] = [];"),'Admin remains locked until owner email confirmed'],
 ['backend/admin.ts',s=>s.includes("submitConsent !== true")&&s.includes("sourceCaseId"),'Consent and stable request reference'],
 ['backend/admin.ts',s=>s.includes("createdAt: entry.createdAt, updatedAt: entry.updatedAt")&&!s.includes("updatedAt: entry.updatedAt, quoteEUR: entry.quoteEUR"),'No admin-only draft amount in buyer status API'],
 ['backend/admin.ts',s=>s.includes("if: {status: input.expectedStatus, updatedAt: old.updatedAt}"),'Concurrent edit guard'],
 ['src/admin.ts',s=>s.includes("textContent")&&s.includes("noopener noreferrer"),'Safe text and external links'],
 ['admin.html',s=>/noindex/i.test(s),'Private admin route is noindex'],
 ['scripts/check-public-sites.mjs',s=>s.includes("AbortSignal.timeout")&&!s.includes("api/ai"),'Public monitor avoids AI endpoints']
];
let failures=0;
for(const [file,test,description] of checks){
 try{const ok=test(read(file));console.log((ok?'PASS':'FAIL')+' '+description);if(!ok)failures++;}
 catch(err){failures++;console.error('FAIL '+description+': '+err.message);}
}
console.log('Static checks: '+(checks.length-failures)+'/'+checks.length);
if(failures)process.exitCode=1;
