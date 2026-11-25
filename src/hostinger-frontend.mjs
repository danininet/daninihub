// Fixed public origin only. API, authenticated routes and private files stay on Cloudflare.
const HOSTINGER = 'https://gleaming-orangered-crow-58.hostingersite.com';
const STAGING = 'https://danini-b2b-staging.dragangaganet.workers.dev';
const PRODUCTION = 'https://daninihub.com';
const PRODUCTION_WWW = 'https://www.daninihub.com';
const ORIGIN_NOINDEX = 'noindex, nofollow, noarchive';
const privatePath = /(?:^|\/)(?:api|portal|owner|operator|admin|nalog|private|\.\w+)(?:\/|\.|$)/i;
const publicFile = /\.(?:js|mjs|css|svg|png|jpe?g|webp|avif|ico|woff2?|ttf|gif|txt|xml|csv|md|pdf|html)$/i;
const safeHeaders = ['content-type','content-language','content-security-policy','x-content-type-options','referrer-policy','x-frame-options','permissions-policy','x-robots-tag','last-modified','etag'];
const failure = (status=503) => new Response('Frontend unavailable', {status, headers:{'content-type':'text/plain; charset=utf-8','cache-control':'no-store','x-robots-tag':'noindex'}});

export async function hostingerFrontend(request, env, fetcher = globalThis.fetch) {
  const mode = env.HOSTINGER_FRONTEND_MODE;
  if (!mode) return env.ASSETS.fetch(request);
  const url = new URL(request.url);
  const functional = mode === 'production' || mode === 'staging';
  const staging = mode === 'preview' || mode === 'staging';
  if (mode === 'production' && env.SITE_ORIGIN === PRODUCTION &&
      url.origin === PRODUCTION_WWW && ['GET', 'HEAD'].includes(request.method)) {
    return new Response(null, {
      status: 308,
      headers: {location: PRODUCTION + url.pathname + url.search, 'cache-control': 'no-store'},
    });
  }
  const allowed = staging ? url.origin === STAGING && env.SITE_ORIGIN === STAGING :
    mode === 'production' && url.origin === PRODUCTION && env.SITE_ORIGIN === PRODUCTION;
  if (!allowed) return failure();
  let decoded;
  try { decoded = decodeURIComponent(url.pathname); } catch { return failure(400); }
  if (/[\\%\x00-\x1f]/.test(decoded) || decoded.startsWith('//') || decoded.split('/').some(p=>p==='.'||p==='..')) return failure(400);
  // Never send private paths, unknown file types, or authentication material to the static origin.
  if (privatePath.test(decoded) || decoded.startsWith('/downloads/') && !decoded.startsWith('/downloads/akademija/')) return failure(404);
  if (!['GET','HEAD'].includes(request.method)) return failure(405);
  if (decoded === '/robots.txt') {
    if (mode === 'production') return env.ASSETS.fetch(request);
    return new Response(request.method === 'HEAD' ? null : 'User-agent: *\nDisallow: /\n', {
      headers: {'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': ORIGIN_NOINDEX, 'cache-control': 'no-store'},
    });
  }
  if (!(decoded==='/' || /^\/(?:de|sr|auto)(?:\/|$)/.test(decoded) || /^\/_astro\//.test(decoded) || publicFile.test(decoded) || decoded==='/_danini/build.json' || decoded==='/inspection' || decoded==='/import')) return env.ASSETS.fetch(request);
  if (decoded==='/_headers'||decoded==='/_redirects') return failure(404);
  const target = new URL(HOSTINGER);
  target.pathname = url.pathname;
  try {
    const upstream = await fetcher(target.href,{method:request.method,redirect:'manual',credentials:'omit',headers:{accept:request.headers.get('accept')||'*/*'},signal:AbortSignal.timeout(8000)});
    const functionalOrigin = upstream.headers.get('x-danini-runtime') === 'hostinger-frontend';
    if (functional && !functionalOrigin) {
      await upstream.body?.cancel();
      return failure();
    }
    if ([301,302,303,307,308].includes(upstream.status)) {
      const location = upstream.headers.get('location');
      if (!location) return failure();
      const next = new URL(location,target);
      if (next.origin !== HOSTINGER || next.pathname.startsWith('//') || /[\\%]/.test(decodeURIComponent(next.pathname)) || privatePath.test(decodeURIComponent(next.pathname))) return failure();
      await upstream.body?.cancel();
      return new Response(null,{status:upstream.status,headers:{location:next.pathname,'cache-control':'no-store',...(staging?{'x-robots-tag':'noindex, nofollow'}:{})}});
    }
    if (![200,404].includes(upstream.status)) {await upstream.body?.cancel();return failure();}
    const headers = new Headers();
    for (const name of safeHeaders) if (upstream.headers.has(name)) headers.set(name,upstream.headers.get(name));
    headers.set('cache-control','no-store');
    headers.set('x-danini-frontend','hostinger');
    if (staging) headers.set('x-robots-tag',ORIGIN_NOINDEX);
    if (mode==='production' && upstream.status===200 && headers.get('x-robots-tag')===ORIGIN_NOINDEX) {
      headers.delete('x-robots-tag');
    }
    let body = upstream.body;
    if (request.method==='GET' && /text\/html/i.test(headers.get('content-type')||'')) {
      const html=await upstream.text();
      if(functional && /data-hostinger-preview(?:-csp)?\b/i.test(html))return failure();
      body=html;
    }
    return new Response(body,{status:upstream.status,headers});
  } catch { return failure(); }
}
