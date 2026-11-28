#!/usr/bin/env node
'use strict';
// OFFLINE only. Output contains the paid product; never commit or publish it.
const fs=require('node:fs'),crypto=require('node:crypto'),path=require('node:path');
const [input,output]=process.argv.slice(2);
const approved='fa6f75f0d61a48060e7f6b69583874e79d55be5b9499563b2c2a252a20190424';
if(!input||!output||path.resolve(input)===path.resolve(output))throw Error('USAGE: INPUT.zip PRIVATE_OUTPUT.sql');
const b=fs.readFileSync(input);
const sha=crypto.createHash('sha256').update(b).digest('hex');
if(sha!==approved||b.length<100001||b.length>10485760||b.subarray(0,4).toString('hex')!=='504b0304')throw Error('UNAPPROVED_PACKAGE');
const n=Math.ceil(b.length/32768);
const sql=['-- PRIVATE PAID CONTENT: NEVER COMMIT OR PUBLISH.',"INSERT OR IGNORE INTO danini_digital_packages(sha256,byte_length,chunk_count,ready) VALUES ('"+sha+"',"+b.length+","+n+",0);"];
for(let i=0;i<n;i++)sql.push("INSERT OR IGNORE INTO danini_digital_package_chunks(sha256,chunk_index,data_b64) VALUES ('"+sha+"',"+i+",'"+b.subarray(i*32768,(i+1)*32768).toString('base64')+"');");
sql.push("UPDATE danini_digital_packages SET ready=1 WHERE sha256='"+sha+"' AND byte_length="+b.length+" AND chunk_count="+n+" AND (SELECT count(*) FROM danini_digital_package_chunks WHERE sha256='"+sha+"')="+n+";");
fs.writeFileSync(output,sql.join('\n')+'\n',{mode:0o600,flag:'wx'});
console.log('Private SQL prepared: '+n+' chunks; SHA256 '+sha);
