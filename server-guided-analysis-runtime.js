'use strict';

const express = require('express');
const { listProducts } = require('./core/product-registry');
const { createSession, getSession, submitAnswer } = require('./core/guided-analysis-service');

function bearerToken(req) {
  const value = String(req.headers.authorization || '');
  return value.startsWith('Bearer ') ? value.slice(7).trim() : '';
}

function errorStatus(error) {
  const code = error?.code || error?.message;
  if (['INVALID_ACCESS_TOKEN'].includes(code)) return 401;
  if (['VALID_EMAIL_REQUIRED', 'ANSWER_TOO_SHORT', 'PRODUCT_NOT_FOUND'].includes(code)) return 400;
  if (['SESSION_NOT_FOUND'].includes(code)) return 404;
  if (['SESSION_PROCESSING'].includes(code)) return 409;
  if (['SESSION_SECRET_NOT_CONFIGURED', 'MODEL_NOT_CONFIGURED'].includes(code)) return 503;
  return 500;
}

function sendError(res, error) {
  return res.status(errorStatus(error)).json({
    ok: false,
    error: error.code || 'GUIDED_ANALYSIS_ERROR',
    message: error.message
  });
}

function requestOrigin(req) {
  const configured = String(process.env.DANINI_PUBLIC_URL || '').replace(/\/$/, '');
  if (configured) return configured;
  const protocol = String(req.headers['x-forwarded-proto'] || req.protocol || 'https').split(',')[0].trim();
  return `${protocol}://${req.get('host')}`;
}

function buildAccessUrl(origin, accessToken) {
  return `${String(origin).replace(/\/$/, '')}/analyse#token=${encodeURIComponent(accessToken)}`;
}

function renderGuidedPage() {
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Die KI fragt nach | Danini OS</title>
<style>
:root{color-scheme:dark}*{box-sizing:border-box}body{margin:0;background:#08111f;color:#f8fafc;font-family:Inter,Arial,sans-serif}.shell{max-width:820px;margin:auto;padding:28px 18px 60px}.brand{font-weight:850;letter-spacing:.05em;color:#f4d26b}.card{margin-top:28px;padding:26px;border:1px solid rgba(255,255,255,.14);border-radius:22px;background:rgba(255,255,255,.055);box-shadow:0 28px 80px rgba(0,0,0,.25)}.eyebrow{color:#f4d26b;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:.08em}h1{font-size:clamp(34px,7vw,58px);line-height:1.02;margin:12px 0 16px}p{color:#cbd5e1;line-height:1.7}.progress{display:flex;gap:8px;margin:22px 0}.dot{height:8px;flex:1;border-radius:999px;background:#243247}.dot.on{background:#d4af37}.question{font-size:24px;line-height:1.35;margin:22px 0}textarea{width:100%;min-height:150px;padding:16px;border-radius:14px;border:1px solid #40506a;background:#0d1728;color:#fff;font:inherit;resize:vertical}button{margin-top:14px;border:0;border-radius:12px;padding:14px 20px;background:#d4af37;color:#111827;font-weight:850;font-size:16px;cursor:pointer}button:disabled{opacity:.55;cursor:wait}.status{min-height:26px;margin-top:14px;color:#f4d26b}.result{white-space:pre-wrap;background:#0d1728;border-radius:14px;padding:18px;margin-top:18px}.hidden{display:none}.small{font-size:13px;color:#94a3b8}
</style>
</head>
<body><main class="shell"><div class="brand">DaniniHub</div><section class="card"><div class="eyebrow">Persönliche KI-Analyse</div><h1>Die KI fragt nach</h1><p>Beantworten Sie die Fragen möglichst konkret. Nach drei gezielten Rückfragen erhalten Sie Ihre persönliche Analyse und den PDF-Bericht per E-Mail.</p><div id="app"><div id="progress" class="progress"></div><div id="question" class="question">Sitzung wird geladen …</div><textarea id="answer" class="hidden" placeholder="Ihre Antwort"></textarea><button id="submit" class="hidden">Antwort senden</button><div id="status" class="status"></div><div id="result" class="result hidden"></div></div><p class="small">Keine Rechts-, Finanz-, Medizin- oder Einkommensgarantie.</p></section></main>
<script>
(() => {
  const tokenFromHash = new URLSearchParams(location.hash.slice(1)).get('token');
  if (tokenFromHash) { sessionStorage.setItem('danini_access_token', tokenFromHash); history.replaceState(null, '', location.pathname); }
  const token = sessionStorage.getItem('danini_access_token') || '';
  const q = document.getElementById('question');
  const a = document.getElementById('answer');
  const b = document.getElementById('submit');
  const s = document.getElementById('status');
  const r = document.getElementById('result');
  const p = document.getElementById('progress');

  function progress(session) {
    p.innerHTML = '';
    const completed = Math.min(4, session.followUpsAsked + (session.status === 'completed' ? 1 : 0));
    for (let i=0;i<4;i++) { const d=document.createElement('div'); d.className='dot'+(i<=completed?' on':''); p.appendChild(d); }
  }

  function render(session) {
    progress(session);
    if (session.status === 'completed') {
      q.textContent = 'Ihre Analyse ist fertig.';
      a.classList.add('hidden'); b.classList.add('hidden');
      r.classList.remove('hidden');
      r.textContent = [session.result?.summary, session.result?.nextStep ? '\n\nNächster Schritt:\n'+session.result.nextStep : '', session.result?.delivery?.sent ? '\n\nDer PDF-Bericht wurde per E-Mail gesendet.' : '\n\nDie Analyse wurde erstellt. Die E-Mail-Zustellung konnte noch nicht bestätigt werden. Bitte versuchen Sie es später erneut oder wenden Sie sich an dragangaganet@gmail.com.'].join('');
      return;
    }
    q.textContent = session.question || 'Bitte fahre fort.';
    a.value=''; a.classList.remove('hidden'); b.classList.remove('hidden'); a.focus();
  }

  async function api(path, options={}) {
    const response = await fetch(path, { ...options, headers: { 'Content-Type':'application/json', Authorization:'Bearer '+token, ...(options.headers||{}) } });
    const data = await response.json().catch(()=>({}));
    if (!response.ok) throw new Error(data.message || data.error || 'Anfrage fehlgeschlagen');
    return data;
  }

  async function load() {
    if (!token) { q.textContent='Kein gültiger Zugangslink gefunden.'; s.textContent='Öffnen Sie den persönlichen Link aus Ihrer Kaufbestätigung.'; return; }
    try { const data=await api('/api/v1/guided-analysis/session'); render(data.session); }
    catch(error){ q.textContent='Sitzung konnte nicht geladen werden.'; s.textContent=error.message; }
  }

  b.addEventListener('click', async () => {
    const answer=a.value.trim(); if(answer.length<3){s.textContent='Bitte geben Sie eine konkrete Antwort ein.';return;}
    b.disabled=true; s.textContent='Ihre Antwort wird analysiert …';
    try { const data=await api('/api/v1/guided-analysis/answer',{method:'POST',body:JSON.stringify({answer})}); s.textContent=''; render(data.session); }
    catch(error){s.textContent=error.message;} finally {b.disabled=false;}
  });
  load();
})();
</script></body></html>`;
}

function mountGuidedAnalysisRuntime(app) {
  app.use('/api/v1/guided-analysis', express.json({ limit: '64kb' }));

  app.get('/analyse', (req, res) => res.type('html').send(renderGuidedPage()));

  app.get('/api/v1/products', (req, res) => {
    res.json({ ok: true, products: listProducts() });
  });

  app.post('/api/v1/guided-analysis/activate', (req, res) => {
    const expected = process.env.DANINI_ACTIVATION_SECRET;
    const supplied = String(req.headers['x-danini-activation-secret'] || '');
    if (!expected || supplied !== expected) {
      return res.status(401).json({ ok: false, error: 'ACTIVATION_NOT_AUTHORIZED' });
    }

    try {
      const result = createSession({
        productId: req.body?.productId || 'die-ki-fragt-nach',
        email: req.body?.email,
        locale: req.body?.locale,
        orderId: req.body?.orderId
      });
      return res.status(201).json({
        ok: true,
        ...result,
        accessUrl: buildAccessUrl(requestOrigin(req), result.accessToken)
      });
    } catch (error) {
      return sendError(res, error);
    }
  });

  app.get('/api/v1/guided-analysis/session', (req, res) => {
    try {
      return res.json({ ok: true, session: getSession(bearerToken(req)) });
    } catch (error) {
      return sendError(res, error);
    }
  });

  app.post('/api/v1/guided-analysis/answer', async (req, res) => {
    try {
      const session = await submitAnswer(bearerToken(req), req.body?.answer);
      return res.json({ ok: true, session });
    } catch (error) {
      return sendError(res, error);
    }
  });
}

module.exports = { buildAccessUrl, mountGuidedAnalysisRuntime, renderGuidedPage };
