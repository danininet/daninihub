const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>DaniniHub — Systemaktivierung</title>
  <style>
    body{margin:0;background:#f6f1e8;color:#151515;font-family:Arial,Helvetica,sans-serif}main{min-height:100vh;display:grid;place-items:center;padding:42px}.panel{max-width:920px;border:1px solid rgba(0,0,0,.18);background:#fffaf2;padding:56px}p{font-size:20px;line-height:1.6;color:#4b4540}h1{font-family:Georgia,serif;font-size:clamp(44px,7vw,84px);line-height:.96;margin:0 0 24px}.eyebrow{font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#8b6f47;font-weight:700}.meta{display:flex;gap:10px;flex-wrap:wrap;margin-top:28px}.meta span{border:1px solid rgba(0,0,0,.18);padding:8px 10px;font-size:13px}</style>
</head>
<body><main><section class="panel"><div class="eyebrow">DaniniHub · DACH-first · Project Mode</div><h1>Systemaktivierung läuft.</h1><p>DaniniHub wird als strukturierte Entscheidungsinfrastruktur aufgebaut. Öffentliche Inhalte, Mitgliedsbereich, Admin-Funktionen, Zahlungen und KI-Prozesse werden erst nach technischer und rechtlicher Validierung freigeschaltet.</p><div class="meta"><span>Keine Simulation</span><span>Keine Erfolgsversprechen</span><span>DSGVO / KI-Transparenz</span><span>Human Override</span></div></section></main></body></html>`);
});

module.exports = router;
