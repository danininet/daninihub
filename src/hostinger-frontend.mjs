// Fixed public origin only. API, authenticated routes and private files stay on Cloudflare.
const HOSTINGER = 'https://gleaming-orangered-crow-58.hostingersite.com';
const STAGING = 'https://danini-b2b-staging.dragangaganet.workers.dev';
const PRODUCTION = 'https://daninihub.com';
const privatePath = /(?:^|\/)(?:api|portal|owner|operator|admin|nalog|private|\.\w+)(?:\/|\.|$)/i;
const publicFile = /\.(?:js|mjs|css|svg|png|jpe?g|webp|avif|ico|woff2?|ttf|gif|txt|xml|csv|md|pdf|html)$/i;
const safeHeaders = ['content-type','content-language','content-security-policy','x-content-type-options','referrer-policy','x-frame-options','permissions-policy','x-robots-tag','last-modified','etag'];
const failure = (status=503) => new Response('Frontend unavailable', {status, headers:{'content-type':'text/plain; charset=utf-8','cache-control':'no-store','x-robots-tag':'noindex'}});

export async function hostingerFrontend(request, env, fetcher = globalThis.fetch) {
  const mode = env.HOSTINGER_FRONTEND_MODE;
  if (!mode) return env.ASSETS.fetch(request);
  const url = new URL(request.url);
  const allowed = mode === 'preview' ? url.origin === STAGING && env.SITE_ORIGIN === STAGING :
    mode === 'production' && url.origin === PRODUCTION && env.SITE_ORIGIN === PRODUCTION;
  if (!allowed) return failure();
  let decoded;
  try { decoded = decodeURIComponent(url.pathname); } catch { return failure(400); }
  if (/[\\%\x00-\x1f]/.test(decoded) || decoded.startsWith('//') || decoded.split('/').some(p=>p==='.'||p==='..')) return failure(400);
  // Never send private paths, unknown file types, or authentication material to the static origin.
  if (privatePath.test(decoded) || decoded.startsWith('/downloads/') && !decoded.startsWith('/downloads/akademija/')) return env.ASSETS.fetch(request);
  if (!['GET','HEAD'].includes(request.method)) return failure(405);
  if (!(decoded==='/' || /^\/(?:de|sr|auto)(?:\/|$)/.test(decoded) || /^\/_astro\//.test(decoded) || publicFile.test(decoded) || decoded==='/_danini/build.json')) return env.ASSETS.fetch(request);
  if (decoded==='/_headers'||decoded==='/_redirects') return failure(404);
  const target = new URL(HOSTINGER);
  target.pathname = url.pathname;
  try {
    const upstream = await fetcher(target.href,{method:request.method,redirect:'manual',credentials:'omit',headers:{accept:request.headers.get('accept')||'*/*'},signal:AbortSignal.timeout(8000)});
    if ([301,302,303,307,308].includes(upstream.status)) {
      const location = upstream.headers.get('location');
      if (!location) return failure();
      const next = new URL(location,target);
      if (next.origin !== HOSTINGER || privatePath.test(decodeURIComponent(next.pathname))) return failure();
      await upstream.body?.cancel();
      return new Response(null,{status:upstream.status,headers:{location:next.pathname+next.search+next.hash,'cache-control':'no-store',...(mode==='preview'?{'x-robots-tag':'noindex, nofollow'}:{})}});
    }
    if (![200,404].includes(upstream.status)) {await upstream.body?.cancel();return failure();}
    const headers = new Headers();
    for (const name of safeHeaders) if (upstream.headers.has(name)) headers.set(name,upstream.headers.get(name));
    headers.set('cache-control','no-store');
    headers.set('x-danini-frontend','hostinger');
    if (mode==='preview') headers.set('x-robots-tag','noindex, nofollow, noarchive');
    if (mode==='production' && (/hostinger-preview/i.test(upstream.headers.get('x-danini-runtime')||'') || /noindex/i.test(upstream.headers.get('x-robots-tag')||'') && /html/i.test(headers.get('content-type')||''))) {await upstream.body?.cancel();return failure();}
    let body = upstream.body;
    if (request.method==='GET' && /text\/html/i.test(headers.get('content-type')||'')) {
      const html=await upstream.text();
      if(mode==='production' && /data-hostinger-preview(?:-csp)?\b/i.test(html))return failure();
      body=html;
    }
    return new Response(body,{status:upstream.status,headers});
  } catch { return failure(); }
}
