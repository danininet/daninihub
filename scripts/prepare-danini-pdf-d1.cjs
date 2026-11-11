#!/usr/bin/env node
'use strict';
// Operator-only offline helper. Converts an existing, private DANINI PDF to
// resumable D1 SQL; does not upload, deploy, charge or publish a PDF.
// Usage: node scripts/prepare-danini-pdf-d1.cjs /private/guide.pdf /private/upload.sql
const fs=require('node:fs');
const crypto=require('node:crypto');
const path=require('node:path');
const [input,output]=process.argv.slice(2);
if(!input||!output)throw Error('USAGE: node scripts/prepare-danini-pdf-d1.cjs INPUT.pdf OUTPUT.sql');
const source=path.resolve(input),target=path.resolve(output);
if(source===target)throw Error('OUTPUT_MUST_DIFFER_FROM_PDF');
const buffer=fs.readFileSync(source);
if(buffer.length<100001||buffer.length>10*1024*1024||buffer.subarray(0,5).toString()!=='%PDF-')throw Error('INVALID_PRIVATE_PDF');
const digest=crypto.createHash('sha256').update(buffer).digest('hex');
const chunkSize=32768,count=Math.ceil(buffer.length/chunkSize);
if(count>400)throw Error('TOO_MANY_CHUNKS');
const rows=[
 '-- Private DANINI guide import, never commit this SQL to GitHub.',
 '-- Use ONLY after executing migrations/2026-11-11-danini-digital-d1.sql',
 "INSERT INTO danini_digital_files(sku,byte_length,chunk_count,sha256,ready) VALUES ('guide',"+buffer.length+","+count+",'"+digest+"',0) ON CONFLICT(sku) DO UPDATE SET ready=0;",
 "DELETE FROM danini_digital_pdf_chunks WHERE sku='guide';"
];
for(let index=0;index<count;index++){
 const data=buffer.subarray(index*chunkSize,(index+1)*chunkSize).toString('base64');
 rows.push("INSERT INTO danini_digital_pdf_chunks(sku,chunk_index,data_b64) VALUES ('guide',"+index+",'"+data+"');");
}
rows.push("UPDATE danini_digital_files SET byte_length="+buffer.length+",chunk_count="+count+",sha256='"+digest+"',ready=1,updated_at=datetime('now') WHERE sku='guide';");
fs.writeFileSync(target,rows.join('\n')+'\n',{mode:0o600,flag:'wx'});
console.log('Private import SQL created:',target,'chunks:',count,'bytes:',buffer.length,'SHA256:',digest);
console.log('SECURITY: do not add resulting SQL to Git. On this site run via wrangler d1 execute danini-commerce --remote --file=YOUR_PRIVATE_SQL');
