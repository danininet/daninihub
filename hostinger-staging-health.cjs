'use strict';
// Only a public, read-only health check. Never relay user headers, cookies or data.
const STAGING_HEALTH_URL = 'https://danini-b2b-staging.dragangaganet.workers.dev/api/health';
async function probeStaging(fetcher = globalThis.fetch) {
  try {
    const response = await fetcher(STAGING_HEALTH_URL, {
      method: 'GET', redirect: 'error', credentials: 'omit',
      headers: { accept: 'application/json' }, signal: AbortSignal.timeout(5000)
    });
    if (response.status !== 200 || !/^application\/json(?:\s*;|$)/i.test(response.headers.get('content-type') || '')) {
      await response.body?.cancel();
      return false;
    }
    if (!response.body) return false;
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let size = 0, body = '';
    try {
      for (;;) {
        const {done,value} = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 1024) { await reader.cancel(); return false; }
        body += decoder.decode(value,{stream:true});
      }
      body += decoder.decode();
      const data = JSON.parse(body);
      return data !== null && typeof data === 'object' && data.status === 'ok';
    } finally { reader.releaseLock(); }
  } catch { return false; }
}
function createStagingHealth({enabled = false, fetcher = globalThis.fetch, now = Date.now} = {}) {
  let last = null, expires = 0, pending = null;
  return async function check() {
    if (!enabled) return {ok:false, mode:'visual-preview', staging:'disabled'};
    if (last !== null && now() < expires) return last;
    if (!pending) pending = probeStaging(fetcher).then(ok => {
      last = {ok, mode:'visual-preview', staging:ok?'reachable':'unavailable'};
      expires = now() + 30000;
      return last;
    }).finally(() => { pending = null; });
    return pending;
  };
}
module.exports = {STAGING_HEALTH_URL, probeStaging, createStagingHealth};
