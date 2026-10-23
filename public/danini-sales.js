'use strict';

// Visible on every public SR/DE page. A simple external WhatsApp link works
// even if the booking form or application API is temporarily unavailable.
(() => {
  const url = 'https://wa.me/4915730916621?text=' +
    encodeURIComponent('Pozdrav Dragane, imam pitanje oko provere i uvoza automobila iz Nemačke.');
  const label = 'Pošalji oglas / WhatsApp';

  function init() {
    if (document.getElementById('danini-whatsapp-float')) return;
    const button = document.createElement('a');
    button.id = 'danini-whatsapp-float';
    button.href = url;
    button.target = '_blank';
    button.rel = 'noopener noreferrer';
    button.setAttribute('aria-label', label);
    button.innerHTML = '<svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-8.8 8.4 8.5 8.5 0 0 1-3.8-1L3 21l2.1-5.2a8.4 8.4 0 1 1 15.9-4.3Z"/><path d="M9 9c.4 2.5 2 4 4.6 5.5l1.3-1.1 2.1 1-1 2c-3.5.7-8.2-3.9-8.5-7.3L9 9Z"/></svg><span>' + label + '</span>';
    const style = document.createElement('style');
    style.textContent = [
      '#danini-whatsapp-float{position:fixed;bottom:16px;right:16px;z-index:95;display:inline-flex;align-items:center;justify-content:center;gap:9px;background:#25d366;color:#072a18!important;border:2px solid #ecfff1;border-radius:999px;padding:13px 17px;text-decoration:none;font-size:15px;line-height:1.2;font-weight:850;font-family:Arial,sans-serif;box-shadow:0 8px 30px #0008;min-height:52px}',
      '#danini-whatsapp-float:hover,#danini-whatsapp-float:focus-visible{background:#6ceba0;outline:3px solid #fff;outline-offset:2px}',
      '@media(max-width:430px){#danini-whatsapp-float{right:10px;bottom:10px;max-width:calc(100vw - 20px);padding:12px 14px;font-size:14px}}'
    ].join('');
    document.head.appendChild(style);
    document.body.appendChild(button);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
