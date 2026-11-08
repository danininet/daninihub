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
  '/auctions.html', '/guides.html', '/digital.html', '/ai-solutions.html', '/about.html', '/contact.html',
  '/impressum.html', '/privacy.html', '/terms.html', '/cookies.html',
  '/ai-advisor.html', '/disclaimer.html', '/cenovnik.html',
  '/ai-primer.html', '/faq.html', '/nalog.html', '/admin.html', '/support.html'
];
const root = process.env.DANINI_SITE_URL || 'https://daninihub.com';
// A PR tests the existing live site, whereas a main push validates its newly deployed pages.
const isPullRequest = process.env.GITHUB_EVENT_NAME === 'pull_request';
const proposedPages = new Set(['/digital.html','/ai-solutions.html']);
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
  // This hostname may still point to Hostinger. Report separately; avoid hiding it.
  try {
    const r=await fetch('https://www.daninihub.com/', {signal:AbortSignal.timeout(12000),redirect:'manual'});
    console.log('www.daninihub.com:',r.status, r.headers.get('location') || '');
    if (!r.ok && r.status !== 301 && r.status !== 302)
      console.warn('WARNING: www is not serving the Cloudflare site. Correct DNS/custom-domain separately.');
  } catch(error) {console.warn('WARNING: www check:',error.message);}
  const failed=results.filter(x=>!x.pass);
  const summary = 'Cloudflare live pages: '+(pages.length-failed.length)+'/'+pages.length+' passed';
  console.log(summary);
  if (process.env.GITHUB_STEP_SUMMARY) {
    const fs=require('node:fs');
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,
      '## '+summary+'\n\n'+results.map(r=>'- '+(r.pass?'✅':'❌')+' `'+r.path+'`'+(r.error?' — '+r.error:'')).join('\n')+'\n');
  }
  if (failed.length) process.exitCode=1;
}
main().catch(err=>{console.error(err);process.exitCode=1;});
