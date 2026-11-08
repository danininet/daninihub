'use strict';
/**
 * Public Cloudflare deployment smoke test: checks the ACTUAL live domain
 * after Workers Builds rather than just confirming a successful build.
 * Read-only; never changes DNS, site configuration, mail or payments.
 */
const pages = [
  '/', '/sr/', '/de/',
  '/index.html', '/buyers.html', '/dealers.html', '/live.html',
  '/inspection.html', '/import.html', '/exclusive.html', '/tender.html',
  '/auctions.html', '/guides.html', '/digital.html', '/ai-solutions.html', '/business.html', '/cnc.html', '/selbstimport.html', '/uvoz-vodic.html', '/about.html', '/contact.html',
  '/impressum.html', '/privacy.html', '/terms.html', '/cookies.html',
  '/ai-advisor.html', '/disclaimer.html', '/cenovnik.html',
  '/ai-primer.html', '/faq.html', '/nalog.html', '/admin.html', '/support.html'
];
const root = process.env.DANINI_SITE_URL || 'https://daninihub.com';
// Search Console migration: these historic search entrypoints must keep their
// original intent and never silently fall through to a generic homepage.
const seoRedirectCases = [
  ['/de/wissen/deutschland-selbstimport','/selbstimport.html'],
  ['/sr/vodic/uvoz-zoll-eur1-i-dovoz','/uvoz-vodic.html'],
  ['/sr/kalkulator','/import.html'],
  ['/de/impressum','/impressum.html']
];
// A PR tests the existing live site, whereas a main push validates its newly deployed pages.
const isPullRequest = process.env.GITHUB_EVENT_NAME === 'pull_request';
const proposedPages = new Set(['/business.html','/cnc.html','/selbstimport.html','/uvoz-vodic.html']);
const build = process.env.GITHUB_SHA || 'manual';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function check(path) {
  const url = new URL(path, root);
  url.searchParams.set('_danini_qa', build.slice(0, 12));
  const response = await fetch(url, {
    signal: AbortSignal.timeout(15000),
    redirect: 'follow',
    headers: {'accept': 'text/html'}
  });
  const html = await response.text();
  if (!response.ok) throw new Error('HTTP ' + response.status + ' ' + response.url);
  if (!/text\/html/i.test(response.headers.get('content-type') || ''))
    throw new Error('Wrong content-type: ' + response.headers.get('content-type'));
  if (!/<title>[^<]+<\/title>/i.test(html) || !/<html/i.test(html))
    throw new Error('Not a complete HTML page');
  if (/This Page Does Not Exist|Sorry, the page you are looking for could not be found/i.test(html))
    throw new Error('An obsolete hosting 404 page was served');
  if (path === '/de/' && !(isPullRequest ? /Fahrzeugprüfung und Importberatung|Fahrzeugkauf, digitale Produkte und KI-Lösungen/ : /Fahrzeugkauf, digitale Produkte und KI-Lösungen/).test(html))
    throw new Error('Wrong /de/ release (expected localized page)');
  if (path === '/sr/' && !/DANINI/.test(html))
    throw new Error('Wrong /sr/ release');
  return {status: response.status, bytes: Buffer.byteLength(html)};
}
async function withRetries(path) {
  let last;
  for (let i = 0; i < 3; i++) {
    try {return await check(path);}
    catch (error) { last = error; if (i < 2) await sleep(12000); }
  }
  throw last;
}
async function checkSeoRedirect(oldPath,expectedPath){
  const url=new URL(oldPath,root);
  url.searchParams.set('_danini_qa', build.slice(0,12));
  const response=await fetch(url,{
    redirect:'manual',
    headers:{accept:'text/html'},
    signal:AbortSignal.timeout(12000)
  });
  if(response.status!==301)throw Error('Expected HTTP 301, got HTTP '+response.status);
  const location=response.headers.get('location');
  if(!location)throw Error('HTTP 301 lacks Location');
  const resolved=new URL(location,url);
  if(resolved.origin!==url.origin||resolved.pathname!==expectedPath){
    throw Error('Unexpected destination '+resolved.href+' instead of '+expectedPath);
  }
  return {status:response.status,destination:resolved.pathname};
}
async function main(){
  const pathsToCheck = isPullRequest ? pages.filter(path=>!proposedPages.has(path)) : pages;
  const results = await Promise.all(pathsToCheck.map(async path => {
    try {
      const res = await withRetries(path);
      console.log('PASS',path,res.status,res.bytes+'B');
      return {path, pass:true};
    } catch (error) {
      console.error('FAIL',path,error.message);
      return {path, pass:false, error:error.message};
    }
  }));
  // HTTP 200 on a target does not prove Google's former URLs were preserved.
  // Check real Cloudflare 301 + Location after the website was deployed.
  const redirects=await Promise.all(seoRedirectCases.map(async ([oldPath,target])=>{
    try {
      const res=await checkSeoRedirect(oldPath,target);
      console.log('PASS 301',oldPath,'→',res.destination);
      return {path:oldPath,pass:true};
    }catch(error){
      console.error('FAIL 301',oldPath,error.message);
      return {path:oldPath,pass:false,error:error.message};
    }
  }));
  // Only check the new Cloudflare API after main deployment, not against an
  // older production release during pull-request review.
  if(!isPullRequest){
    let apiVerified=false;
    for(let attempt=0;attempt<3&&!apiVerified;attempt++){
      try{
        const url=new URL('/api/lead/status',root);
        const res=await fetch(url,{signal:AbortSignal.timeout(12000),headers:{'accept':'application/json'},cache:'no-store'});
        if(!res.ok)throw Error('HTTP '+res.status);
        const data=await res.json();
        if(typeof data.enabled!=='boolean')throw Error('Missing boolean enabled field');
        if(data.enabled && typeof data.turnstileSiteKey!=='string')throw Error('Active backend without public captcha key');
        console.log('PASS /api/lead/status',res.status,data.enabled?'ready':'awaiting secure Brevo/Turnstile setup');
        apiVerified=true;
      }catch(err){
        if(attempt===2){failed.push({path:'/api/lead/status',pass:false,error:err.message});
          console.error('FAIL /api/lead/status',err.message);}
        else await sleep(12000);
      }
    }
  }
  // This hostname may still point to Hostinger. Report separately; avoid hiding it.
  try {
    const r=await fetch('https://www.daninihub.com/', {signal:AbortSignal.timeout(12000),redirect:'manual'});
    console.log('www.daninihub.com:',r.status, r.headers.get('location') || '');
    if (!r.ok && r.status !== 301 && r.status !== 302)
      console.warn('WARNING: www is not serving the Cloudflare site. Correct DNS/custom-domain separately.');
  } catch(error) {console.warn('WARNING: www check:',error.message);}
  const failed=results.filter(x=>!x.pass);
  const failedRedirects=redirects.filter(x=>!x.pass);
  const summary = 'Cloudflare live pages: '+(results.length-failed.length)+'/'+results.length+' passed';
  const redirectSummary='Cloudflare SEO redirects: '+(redirects.length-failedRedirects.length)+'/'+redirects.length+' passed';
  console.log(summary);
  console.log(redirectSummary);
  if (process.env.GITHUB_STEP_SUMMARY) {
    const fs=require('node:fs');
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,
      '## '+summary+'\n\n'+results.map(r=>'- '+(r.pass?'✅':'❌')+' `'+r.path+'`'+(r.error?' — '+r.error:'')).join('\n')+
      '\n\n## '+redirectSummary+'\n\n'+redirects.map(r=>'- '+(r.pass?'✅':'❌')+' `'+r.path+'`'+(r.error?' — '+r.error:'')).join('\n')+'\n');
  }
  if (failed.length || failedRedirects.length) process.exitCode=1;
}
main().catch(err=>{console.error(err);process.exitCode=1;});
