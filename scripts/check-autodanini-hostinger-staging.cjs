'use strict';
/**
 * Read-only remote smoke test for the owner's isolated Hostinger staging URL.
 * No credentials, POSTs, email, AI tokens or payments. Never probes live sites.
 * Usage: node scripts/check-autodanini-hostinger-staging.cjs https://<temporary-hostinger-host>
 */
const forbidden=new Set(['daninihub.com','www.daninihub.com','calije.daninihub.com','www.calije.daninihub.com']);
async function main(){
  const urlArg=process.argv[2];
  if(!urlArg)throw Error('Provide the temporary HTTPS staging origin (not daninihub.com).');
  let base;
  try{base=new URL(urlArg)}catch{throw Error('Invalid preview URL')}
  if(base.protocol!=='https:'||!base.hostname||base.username||base.password||
     base.pathname!=='/'||base.search||base.hash||forbidden.has(base.hostname.toLowerCase())){
    throw Error('Only an isolated HTTPS Hostinger staging origin is allowed.');
  }
  const checks=[];
  async function get(path){
    const res=await fetch(new URL(path,base),{
      method:'GET',redirect:'manual',
      headers:{Accept:path.endsWith('.webp')?'image/webp':'text/html,application/json,*/*'},
      signal:AbortSignal.timeout(9000)
    });
    return {res,body:path.endsWith('.webp')?null:await res.text()};
  }
  async function check(label,path,validate){
    try{
      const response=await get(path);
      if(path==='/' && /You Are All Set to Go!/i.test(response.body||'')){
        throw Error('HOSTINGER_PLACEHOLDER_NOT_DEPLOYED: default Hostinger page is present; verify Web App GitHub deployment and domain assignment');
      }
      if(!validate(response))throw Error('Unexpected response: HTTP '+response.res.status);
      checks.push({check:label,passed:true});
    }catch(e){checks.push({check:label,passed:false,error:e.message})}
  }
  await check('Hostinger HTTPS and original AutoDanini home','/',({res,body})=>
    res.status===200&&/AUTO\s*<span>\s*DANINI/i.test(body)&&body.includes('data-de'));
  await check('Staging noindex robots','/robots.txt',({res,body})=>
    res.status===200&&/Disallow:\s*\//.test(body));
  for(const name of ['danini-auto-uvoz.webp','danini-pregled-auta.webp']){
    await check('Original owned image: '+name,'/'+name,({res})=>
      res.status===200&&/image\/(webp|octet-stream)/.test(res.headers.get('content-type')||''));
  }
  await check('API health uses durable database','/health',({res,body})=>{
    if(res.status!==200)return false;
    const data=JSON.parse(body);
    return data.ok===true&&data.durableStore===true&&data.checkoutEnabled===false;
  });
  await check('Owner UI is present but not indexed','/admin.html',({res,body})=>
    res.status===200&&body.includes('data-page="admin"')&&body.includes('admin-login')&&
    (body.includes('noindex')||(res.headers.get('x-robots-tag')||'').includes('noindex')));
  await check('Owner inbox never exposed to unauthenticated visitor','/api/admin/requests',({res})=>
    [401,403,404,503].includes(res.status));
  await check('Buyer records never exposed anonymously','/api/my-cases',({res})=>
    [401,403,404,503].includes(res.status));
  await check('Old ImportOS public API blocked in isolated AutoDanini preview','/api/importos/readiness',({res,body})=>{
    if(res.status!==503)return false;
    const data=JSON.parse(body);
    return data.error==='LEGACY_API_NOT_ACTIVE_IN_PREVIEW';
  });
  const failures=checks.filter(x=>!x.passed);
  console.log(JSON.stringify({target:base.origin,passed:checks.length-failures.length,
    total:checks.length,checks},null,2));
  if(failures.length)process.exitCode=1;
}
main().catch(error=>{console.error('Staging check refused:',error.message);process.exitCode=1});
