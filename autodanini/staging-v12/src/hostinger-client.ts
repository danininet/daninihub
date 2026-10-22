/**
 * Hostinger-only bridge for the UNCHANGED AppDeploy v12 HTML and CSS.
 *
 * IMPORTANT: no simulated signed-in users, no fake data and no payment calls.
 * Until the Hostinger auth and case APIs have passed end-to-end security tests,
 * these actions fail closed. This adapter does NOT run in AppDeploy builds.
 */
type ApiResponse<T = unknown> = {data: T};
type JsonObject = Record<string, unknown>;

const UNAVAILABLE = 'HOSTINGER_FEATURE_NOT_READY';

function assertPublicPath(path: string): void {
  if (path !== '/api/advice') throw new Error(UNAVAILABLE);
}
async function jsonRequest<T=JsonObject>(method: 'GET'|'POST'|'PUT'|'DELETE', path: string, body?: JsonObject): Promise<ApiResponse<T>> {
  assertPublicPath(path);
  if (method !== 'POST') throw new Error(UNAVAILABLE);
  if (!body || body.consent !== true) throw new Error('CONSENT_REQUIRED');
  const question = typeof body.question === 'string' ? body.question.trim() : '';
  if (question.length < 30 || question.length > 2500) throw new Error('INVALID_QUESTION');
  // Same-origin only: no credentials, external domains or caller-supplied URLs.
  const response = await fetch('/api/advice', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {'Content-Type':'application/json', 'Accept':'application/json'},
    body: JSON.stringify({
      question,
      mode: body.mode === 'dealer' || body.mode === 'import' ? body.mode : 'buyer',
      lang: body.lang === 'de' ? 'de' : 'sr',
      consent: true
    }),
    signal: AbortSignal.timeout(15000)
  });
  if (!response.ok) throw new Error(UNAVAILABLE);
  return {data: await response.json() as T};
}
export const api = {
  get: <T=JsonObject>(path: string): Promise<ApiResponse<T>> => jsonRequest<T>('GET',path),
  post: <T=JsonObject>(path: string, body?: JsonObject): Promise<ApiResponse<T>> => jsonRequest<T>('POST',path,body),
  put: <T=JsonObject>(path: string, body?: JsonObject): Promise<ApiResponse<T>> => jsonRequest<T>('PUT',path,body),
  delete: <T=JsonObject>(path: string): Promise<ApiResponse<T>> => jsonRequest<T>('DELETE',path),
};
export const auth = {
  async getUser(): Promise<null> { return null; },
  async signIn(): Promise<never> { throw new Error(UNAVAILABLE); },
  async signOut(): Promise<void> { /* no Hostinger login session exists */ }
};
