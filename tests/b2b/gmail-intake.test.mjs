import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {env} from "./helpers.mjs";
import {pollGmailIntake,gmailQueue,gmailPoll} from "../../src/api/gmail-intake.ts";
const setup=()=>{
 const e=env();e.DANINI_DB.db.exec(fs.readFileSync("migrations/2026-11-26-gmail-intake.sql","utf8"));
 Object.assign(e,{GMAIL_INTAKE_ENABLED:"true",GMAIL_CLIENT_ID:"test",GMAIL_CLIENT_SECRET:"test",GMAIL_REFRESH_TOKEN:"test",GMAIL_INTAKE_ACCOUNT:"owner@example.test",GMAIL_INTAKE_LABEL_ID:"Label_76",GMAIL_INTAKE_LABEL_NAME:"DANINI/Test"});
 return e;
};
const id="a123456789abcdef", date=String(Date.now()), body="Wir möchten unsere Kundenanfragen und Angebotsentwürfe besser organisieren.";
function mock(options={}){return async (url,init)=>{
 const u=new URL(url);
 if(u.hostname==="oauth2.googleapis.com"){assert.equal(init.method,"POST");return Response.json({access_token:"test-only",scope:options.scope||"https://www.googleapis.com/auth/gmail.readonly"});}
 assert.equal(u.hostname,"gmail.googleapis.com");assert.equal(init.method,"GET");assert.equal(init.headers.authorization,"Bearer test-only");
 if(u.pathname.endsWith("/profile"))return Response.json({emailAddress:options.account||"owner@example.test"});
 if(u.pathname.includes("/labels/"))return Response.json({id:"Label_76",type:"user",name:options.label||"DANINI/Test"});
 if(u.pathname.endsWith("/messages")){assert.equal(u.searchParams.get("labelIds"),"Label_76");return Response.json({messages:[{id}]});}
 assert.ok(u.pathname.endsWith(id));
 if(u.searchParams.get("format")==="metadata")return Response.json({id,internalDate:date,labelIds:options.labels||["Label_76"],sizeEstimate:1000});
 const text=options.body||body;
 return Response.json({id,internalDate:date,labelIds:["Label_76"],payload:{mimeType:"text/plain",headers:options.headers||[],body:{size:Buffer.byteLength(text),data:Buffer.from(text).toString("base64url")}}});
};}
test("disabled Gmail does not call provider; queue/poll reject unsigned requests",async()=>{
 const e=setup(),old=globalThis.fetch;globalThis.fetch=async()=>{throw Error("unexpected provider");};
 try{e.GMAIL_INTAKE_ENABLED="false";await assert.rejects(pollGmailIntake(e),/gmail_intake_not_configured/);
 await assert.rejects(gmailQueue(new Request(e.SITE_ORIGIN+"/portal/gmail-intake"),e),x=>x.status===401);
 await assert.rejects(gmailPoll(new Request(e.SITE_ORIGIN+"/portal/gmail-intake/poll",{method:"POST",headers:{"content-type":"application/json"},body:"{}"}),e),x=>x.status===401);
 }finally{globalThis.fetch=old;}
});
test("label/account/scope checks, minimal data, dedup, zero mail and model calls",async()=>{
 const e=setup(),old=globalThis.fetch;try{
 for(const [options,error] of [[{scope:"https://mail.google.com/"},/gmail_readonly_scope_required/],[{account:"other@example.test"},/gmail_account_mismatch/],[{label:"Personal"},/gmail_label_mismatch/]]){
 globalThis.fetch=mock(options);await assert.rejects(pollGmailIntake(e),error);}
 globalThis.fetch=mock();const r=await pollGmailIntake(e);assert.equal(r.imported,1);assert.equal(r.externalSends,0);
 const d=e.DANINI_DB.db.prepare("SELECT * FROM gmail_intake_queue").get();
 assert.equal(d.language,"de");assert.equal(d.vertical,"DANINI Business");assert.match(d.draft,/Anfrageprozess/);assert.ok(!JSON.stringify(d).includes(body));
 const repeat=await pollGmailIntake(e);assert.equal(repeat.imported,0);assert.equal(repeat.duplicates,1);
 assert.equal(e.DANINI_DB.db.prepare("SELECT count(*) n FROM mail_outbox").get().n,0);
 }finally{globalThis.fetch=old;}
});
test("sensitive, automated and unlabelled mail fail closed",async()=>{
 const old=globalThis.fetch;try{
 for(const options of [{body:"Želim da pošaljem pasoš i IBAN."},{headers:[{name:"Auto-Submitted",value:"auto-generated"}]}]){
 const e=setup();globalThis.fetch=mock(options);await pollGmailIntake(e);
 const d=e.DANINI_DB.db.prepare("SELECT * FROM gmail_intake_queue").get();assert.ok(["sensitive_data","manual_only"].includes(d.risk));assert.ok(!d.draft.includes("IBAN"));}
 const e=setup();globalThis.fetch=mock({labels:["INBOX"]});assert.equal((await pollGmailIntake(e)).imported,0);
 }finally{globalThis.fetch=old;}
});
