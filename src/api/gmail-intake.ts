import type { Env } from "../lib/env";
import { classifyIntake } from "../ai/intake-classification";
import { analyze } from "../ai/analyze";
import { HttpError, json, readJson } from "../security/http";
import { authorizeDirector } from "../security/director";

const LABELS = ["DANINI/Test", "DANINI/Status/Novo"];
const RETENTION = 30 * 86400;
const ID = /^[a-f0-9]{8,64}$/i;
function configured(env: Env) {
  return env.GMAIL_INTAKE_ENABLED === "true" && !!env.DANINI_DB &&
    !!env.GMAIL_CLIENT_ID && !!env.GMAIL_CLIENT_SECRET && !!env.GMAIL_REFRESH_TOKEN &&
    !!env.GMAIL_INTAKE_ACCOUNT && /^Label_\d+$/.test(env.GMAIL_INTAKE_LABEL_ID || "") &&
    LABELS.includes(env.GMAIL_INTAKE_LABEL_NAME || "");
}
async function providerJson(url: string, init: RequestInit) {
  const u = new URL(url);
  const stage = u.hostname === "oauth2.googleapis.com" ? "oauth" :
    u.pathname.endsWith("/profile") ? "profile" :
    u.pathname.includes("/labels/") ? "label" :
    u.pathname.endsWith("/messages") ? "list" :
    u.searchParams.get("format") === "metadata" ? "metadata" : "message";
  let res: Response;
  try {
    res = await fetch(url, { ...init, redirect: "error", signal: AbortSignal.timeout(10000) });
  } catch {
    throw new HttpError(502, "gmail_" + stage + "_network");
  }
  if (!res.ok) {
    // Report only fixed stage and numeric status; never relay Google error bodies or tokens.
    const status = res.status;
    await res.body?.cancel().catch(()=>{});
    throw new HttpError(502, "gmail_" + stage + "_http_" + status);
  }
  const reader = res.body?.getReader();
  if (!reader) throw new HttpError(502, "gmail_invalid_response");
  const decoder = new TextDecoder("utf-8", {fatal:true});
  let text = "", size = 0;
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > 131072) throw new HttpError(502, "gmail_response_too_large");
      text += decoder.decode(part.value,{stream:true});
    }
    text += decoder.decode();
    return JSON.parse(text);
  } finally { await reader.cancel().catch(()=>{}); }
}
export async function verifyGmailSession(env: Env) {
  const token = await providerJson("https://oauth2.googleapis.com/token", {
    method:"POST", headers:{"content-type":"application/x-www-form-urlencoded"},
    body:new URLSearchParams({client_id:env.GMAIL_CLIENT_ID!,client_secret:env.GMAIL_CLIENT_SECRET!,
      refresh_token:env.GMAIL_REFRESH_TOKEN!,grant_type:"refresh_token"}),
  });
  // Reject a token with extra granted permissions or no evidence of the intended scope.
  const scopes = String(token.scope || "").split(/\s+/).filter(Boolean);
  if (typeof token.access_token !== "string" || scopes.length !== 1 ||
      scopes[0] !== "https://www.googleapis.com/auth/gmail.readonly")
    throw new HttpError(503,"gmail_readonly_scope_required");
  const get = (path: string) => providerJson("https://gmail.googleapis.com/gmail/v1/users/me/" + path,
    {method:"GET",headers:{authorization:"Bearer "+token.access_token}});
  const profile = await get("profile?fields=emailAddress");
  if (typeof profile.emailAddress !== "string" ||
      profile.emailAddress.toLowerCase() !== env.GMAIL_INTAKE_ACCOUNT!.toLowerCase())
    throw new HttpError(503,"gmail_account_mismatch");
  const label = await get("labels/"+encodeURIComponent(env.GMAIL_INTAKE_LABEL_ID!));
  if (label.type !== "user" || label.name !== env.GMAIL_INTAKE_LABEL_NAME ||
      label.id !== env.GMAIL_INTAKE_LABEL_ID)
    throw new HttpError(503,"gmail_label_mismatch");
  return get;
}
function header(payload: any, name: string) {
  return String((payload?.headers || []).find((h:any)=>String(h.name).toLowerCase()===name)?.value || "");
}
function plain(payload: any): string | null {
  if (!payload || payload.filename) return null;
  const part = payload.mimeType === "text/plain" ? payload :
    payload.mimeType === "multipart/alternative" && Array.isArray(payload.parts)
    ? payload.parts.find((p:any)=>p.mimeType==="text/plain" && !p.filename) : null;
  if (!part || part.body?.attachmentId || !Number.isInteger(part.body?.size) ||
      part.body.size < 1 || part.body.size > 16000 ||
      typeof part.body.data !== "string" || part.body.data.length > 24000 ||
      !/^[A-Za-z0-9_-]+={0,2}$/.test(part.body.data)) return null;
  try {
    const bytes=Uint8Array.from(atob(part.body.data.replace(/-/g,"+").replace(/_/g,"/")), c=>c.charCodeAt(0));
    if (bytes.length > 16000 || bytes.length !== part.body.size) return null;
    const value=new TextDecoder("utf-8",{fatal:true}).decode(bytes);
    // Never infer from truncated messages or content with binary control characters.
    if (value.length > 4000 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) return null;
    return value;
  } catch { return null; }
}
async function makeDraft(body: string|null, payload: any) {
  if (!body || (header(payload,"auto-submitted") && header(payload,"auto-submitted").toLowerCase()!=="no") ||
      header(payload,"list-id") || /bulk|list|junk/i.test(header(payload,"precedence"))) {
    return {language:"unknown",vertical:"unresolved",intent:"clarify",risk:"manual_only",
      draft:"Ručni pregled originalne poruke u Gmail-u. Nema automatskog odgovora."};
  }
  const c = classifyIntake(body);
  const de = c.language==="de";
  if (c.risk!=="none_detected" || c.language==="unknown" || c.vertical==="unresolved") {
    return {...c,draft:c.language==="unknown"
      ? "Sprache und Anliegen bitte manuell prüfen. / Jezik i zahtev proveriti ručno."
      : de ? "Bitte prüfen Sie den Vorgang manuell, bevor eine Antwort erstellt wird."
      : "Predmet proveriti ručno pre pripreme odgovora."};
  }
  if (c.vertical==="DANINI Business") {
    const d = await analyze({AI_ENABLED:"false"} as Env,{language:c.language,vertical:"business",message:body});
    return {...c,draft:d.questions.join("\n")};
  }
  return {...c,draft:de
    ? "Bitte senden Sie den Inseratlink und teilen Sie mit, welche Fahrzeugunterlagen vorliegen. Keine unabhängige Fahrzeugprüfung."
    : "Pošaljite link oglasa i navedite dostupnu dokumentaciju. Ovo nije nezavisna provera vozila."};
}
export async function pollGmailIntake(env: Env) {
  if (!configured(env)) throw new HttpError(503,"gmail_intake_not_configured");
  const get = await verifyGmailSession(env);
  const now=Math.floor(Date.now()/1000);
  let pageToken="", imported=0, duplicates=0, skipped=0, inspected=0, morePending=false;
  // Bound each manual poll; traverse existing labels without marking or modifying mail.
  for(let page=0;page<5;page++){
    const query=new URLSearchParams({labelIds:env.GMAIL_INTAKE_LABEL_ID!,q:"newer_than:30d -in:spam -in:trash -in:sent -in:drafts",maxResults:"20",fields:"messages(id),nextPageToken"});
    if(pageToken)query.set("pageToken",pageToken);
    const list=await get("messages?"+query);
    const items=Array.isArray(list.messages)?list.messages:[];
    for(const item of items.slice(0,20)){
      if(imported>=10){morePending=true;break;}
      if(typeof item.id!=="string"||!ID.test(item.id)){skipped++;continue;}
      const existing=await env.DANINI_DB.prepare("SELECT id FROM gmail_intake_queue WHERE id=?").bind(item.id).first();
      if(existing){duplicates++;continue;}
      inspected++;
      // Fetch metadata first, so a large/complex MIME body is never requested.
      const meta=await get("messages/"+item.id+"?format=metadata&fields=id,internalDate,labelIds,sizeEstimate");
      const received=Math.floor(Number(meta.internalDate)/1000);
      if(meta.id!==item.id||!Array.isArray(meta.labelIds)||!meta.labelIds.includes(env.GMAIL_INTAKE_LABEL_ID)||
        meta.labelIds.some((l:string)=>["SPAM","TRASH","SENT","DRAFT"].includes(l))||
        !Number.isSafeInteger(received)||received<now-RETENTION||received>now+300){skipped++;continue;}
      let result;
      if(typeof meta.sizeEstimate!=="number"||meta.sizeEstimate>24000){
        result=await makeDraft(null,{});
      }else{
        const message=await get("messages/"+item.id+"?format=full&fields=id,labelIds,internalDate,payload(mimeType,filename,headers,body,parts(mimeType,filename,body))");
        if(message.id!==item.id||!message.labelIds?.includes(env.GMAIL_INTAKE_LABEL_ID)||
          message.labelIds.some((l:string)=>["SPAM","TRASH","SENT","DRAFT"].includes(l))||
          message.internalDate!==meta.internalDate){skipped++;continue;}
        result=await makeDraft(plain(message.payload),message.payload);
      }
      // Only a bounded, generated draft and classification are persisted; no sender,
      // subject, raw email text, attachment or OAuth token is stored.
      const written=await env.DANINI_DB.prepare("INSERT OR IGNORE INTO gmail_intake_queue(id,received_at,expires_at,language,vertical,intent,risk,draft,status) VALUES (?,?,?,?,?,?,?,?,'awaiting_review')")
        .bind(item.id,received,received+RETENTION,result.language,result.vertical,result.intent,result.risk,result.draft).run();
      if(written.meta.changes===1)imported++;else duplicates++;
    }
    pageToken=typeof list.nextPageToken==="string"?list.nextPageToken:"";
    if(imported>=10||!pageToken){morePending=morePending||!!pageToken;break;}
    if(page===4)morePending=true;
  }
  return {imported,duplicates,skipped,inspected,morePending,externalSends:0};
}
export async function gmailQueue(request: Request,env:Env){
  await authorizeDirector(request,env,"");
  if(!configured(env))return json({enabled:false,items:[]});
  const rows=await env.DANINI_DB.prepare("SELECT id,received_at,language,vertical,intent,risk,draft,status FROM gmail_intake_queue WHERE expires_at>? ORDER BY received_at DESC LIMIT 50")
    .bind(Math.floor(Date.now()/1000)).all();
  return json({enabled:true,items:rows.results});
}
export async function gmailPoll(request:Request,env:Env){
  const body=await readJson(request,1000);
  await authorizeDirector(request,env,JSON.stringify(body));
  if(!body||typeof body!=="object"||Array.isArray(body)||Object.keys(body).length)throw new HttpError(400,"invalid_fields");
  return json(await pollGmailIntake(env));
}
