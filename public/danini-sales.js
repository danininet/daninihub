'use strict';

// Public, email-first contact CTA. Personal WhatsApp is not a marketing channel.
(() => {
  const path = window.location.pathname;
  if (!(/^\/sr(?:\/|$)/.test(path) || /^\/de(?:\/|$)/.test(path))) return;
  const de = document.documentElement.lang === 'de';
  function init() {
    if (document.getElementById('danini-inquiry-float')) return;
    const link = document.createElement('a');
    link.id = 'danini-inquiry-float';
    link.href = de ? '/de/anfrage' : '/sr/upit';
    link.textContent = de ? 'Anfrage per E-Mail' : 'Pošalji e-mail upit';
    link.setAttribute('aria-label', de ? 'AutoDanini: Anfrageformular öffnen' : 'AutoDanini: otvori zaštićeni obrazac za upit');
    const style = document.createElement('style');
    style.textContent = [
      '#danini-inquiry-float{position:fixed;bottom:16px;right:16px;z-index:95;display:inline-flex;align-items:center;justify-content:center;background:#d5a866;color:#16212b!important;border:2px solid #f6e9d1;border-radius:999px;padding:13px 17px;text-decoration:none;font-size:15px;line-height:1.2;font-weight:800;font-family:Arial,sans-serif;box-shadow:0 8px 25px #0007;min-height:52px}',
      '#danini-inquiry-float:hover,#danini-inquiry-float:focus-visible{background:#f0c786;outline:3px solid #fff;outline-offset:2px}',
      '@media(max-width:430px){#danini-inquiry-float{right:10px;bottom:10px;max-width:calc(100vw - 20px);padding:12px 14px;font-size:14px}}'
    ].join('');
    document.head.appendChild(style);
    document.body.appendChild(link);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
