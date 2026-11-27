import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import legacy from "../../workers/danini-intake.mjs";

const component = readFileSync("src/components/BusinessContact.astro","utf8");
const landing = readFileSync("src/components/BusinessLanding.astro","utf8");

test("DANINI Business uses the existing intake workflow with protected legacy fallback",()=>{
  assert.match(landing,/BusinessContact locale=\{locale\}/);
  assert.match(landing,/href="#anfrage"/);
  assert.match(component,/data-business-enquiry/);
  assert.match(component,/\/api\/lead\/status/);
  assert.match(component,/let siteKey = tenant\?\.siteKey;\s*if \(!b2b\) \{\s*const response = await fetch\("\/api\/lead\/status"/);
  assert.match(component,/\/api\/intake/);
  assert.match(component,/idempotency-key/);
  assert.match(component,/turnstileToken:token/);
  assert.match(component,/consent:values\.get\("consent"\)==="on"/);
  assert.match(component,/\/datenschutz\//);
  assert.match(component,/mailto:info@daninihub\.com/);
  assert.doesNotMatch(component,/env\.AI\.run|api\.openai\.com|checkout/);
});

const env={
  DANINI_CONTACT_ACTIVE:"true",
  BREVO_API_KEY:"INTERNAL_TEST_ONLY",
  DANINI_BREVO_SENDER:"info@daninihub.com",
  DANINI_NOTIFY_TO:"owner@example.invalid",
  DANINI_TURNSTILE_SECRET:"INTERNAL_TEST_ONLY",
  DANINI_TURNSTILE_SITEKEY:"INTERNAL_TEST_SITEKEY"
};
const payload = (language="de") => ({
  kind:"business",name:"Internal QA",email:"qa@example.invalid",company:"DANINI",
  topic:"DANINI Business Check",
  message:"Testing one Business Check inquiry without any real email delivery.",
  language,consent:true,details:{service:"check"},
  turnstileToken:"QA_TOKEN_123456_NOT_REAL"
});
const request = (body,origin="https://daninihub.com") => new Request("https://daninihub.com/api/lead",{
  method:"POST",headers:{origin,"content-type":"application/json"},
  body:JSON.stringify(body)
});

for(const lang of ["de","sr"]){
  test("existing legacy intake accepts "+lang+" Business request after captcha and Brevo acceptance",async()=>{
    const calls=[];
    const original=globalThis.fetch;
    globalThis.fetch=async (url,options)=>{
      const u=String(url);
      if(u.includes("turnstile/v0/siteverify"))
        return Response.json({success:true,hostname:"daninihub.com"});
      assert.ok(u.includes("api.brevo.com/v3/smtp/email"),u);
      const body=JSON.parse(String(options.body));
      calls.push(body);
      return Response.json({messageId:"<fake-"+calls.length+"@test.invalid>"},{status:201});
    };
    try{
      const result=await legacy.fetch(request(payload(lang)),env);
      assert.equal(result.status,202);
      const json=await result.json();
      assert.equal(json.accepted,true);
      assert.match(json.reference,/^DN-[0-9]{8}-[A-F0-9]{8}$/);
      assert.equal(json.receiptAccepted,true);
      assert.equal(calls.length,2);
      assert.equal(calls[0].to[0].email,"owner@example.invalid");
      assert.equal(calls[0].replyTo.email,"qa@example.invalid");
      assert.match(calls[0].textContent,/DANINI Business Check/);
      assert.equal(calls[1].templateId,lang==="de"?48:49);
      assert.equal(calls[1].params.REFERENCE,json.reference);
      assert.equal(calls[1].to[0].email,"qa@example.invalid");
    }finally{globalThis.fetch=original;}
  });
}

test("invalid origin and missing consent never reach Brevo",async()=>{
  let calls=0;
  const original=globalThis.fetch;
  globalThis.fetch=async()=>{calls++;throw Error("Network must not be called");};
  try {
    assert.equal((await legacy.fetch(request(payload(), "https://untrusted.example"),env)).status,403);
    assert.equal((await legacy.fetch(request({...payload(),consent:false}),env)).status,400);
    assert.equal(calls,0);
  }finally{globalThis.fetch=original;}
});

test("operator email acceptance does not falsely guarantee customer receipt",async()=>{
  const original=globalThis.fetch;
  let mails=0;
  globalThis.fetch=async url=>{
    if(String(url).includes("turnstile"))return Response.json({success:true,hostname:"daninihub.com"});
    mails++;
    return mails===1?Response.json({messageId:"<operator@test.invalid>"},{status:201}):Response.json({message:"provider denied"},{status:503});
  };
  try{
    const response=await legacy.fetch(request(payload()),env);
    assert.equal(response.status,202);
    const data=await response.json();
    assert.equal(data.accepted,true);
    assert.equal(data.receiptAccepted,false);
    assert.equal(mails,2);
  }finally{globalThis.fetch=original;}
});

test("Hostinger serves Business through the existing form contract and restricts both test mails", async () => {
  const express = (await import("express")).default;
  const { mountHostingerBusiness } = await import("../../hostinger-business.cjs");
  const host = "gleaming-orangered-crow-58.hostingersite.com";
  const app = express();
  mountHostingerBusiness(app, express, {
    ...env, HOSTINGER_BUSINESS_TEST_ENABLED: "true", MAIL_TEST_RECIPIENT: "qa@example.invalid"
  });
  const server = await new Promise(resolve => {
    const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
  });
  const http = await import("node:http");
  const call = (path, { method = "GET", headers = {}, body } = {}) => new Promise((resolve, reject) => {
    const request = http.request({ hostname: "127.0.0.1", port: server.address().port, path, method, headers }, response => {
      const chunks = [];
      response.on("data", chunk => chunks.push(chunk));
      response.on("end", () => resolve(new Response(Buffer.concat(chunks), { status: response.statusCode })));
      response.on("error", reject);
    });
    request.on("error", reject);
    request.end(body);
  });
  const original = globalThis.fetch;
  const mails = [];
  let captchaAction = "unrelated";
  let captchaCalls = 0;
  globalThis.fetch = async (url, options) => {
    if (String(url).includes("/siteverify")) {
      captchaCalls++;
      return Response.json({ success: true, hostname: host, action: captchaAction });
    }
    assert.match(String(url), /^https:\/\/api\.brevo\.com\//);
    mails.push(JSON.parse(options.body));
    return Response.json({ messageId: "<internal@test.invalid>" }, { status: 201 });
  };
  const post = data => call("/api/lead", {
    method: "POST",
    headers: { host, origin: "https://" + host, "content-type": "application/json" },
    body: JSON.stringify(data)
  });
  try {
    assert.equal((await call("/api/lead/status")).status, 404);
    const config = await call("/api/tenant-config", { headers: { host } });
    assert.equal((await config.json()).enabled, false);
    const status = await call("/api/lead/status", { headers: { host } });
    assert.equal((await status.json()).enabled, true);
    assert.equal((await post({ ...payload(), email: "wrong@example.invalid" })).status, 400);
    assert.equal(captchaCalls, 0);
    assert.equal((await post(payload())).status, 400);
    assert.equal(mails.length, 0);
    captchaAction = "business-contact";
    const accepted = await post(payload("sr"));
    assert.equal(accepted.status, 202);
    assert.equal((await accepted.json()).receiptAccepted, true);
    assert.deepEqual(mails.map(mail => mail.to[0].email), ["qa@example.invalid", "qa@example.invalid"]);
    assert.equal(mails[1].templateId, 49);
  } finally {
    globalThis.fetch = original;
    await new Promise(resolve => server.close(resolve));
  }
});
