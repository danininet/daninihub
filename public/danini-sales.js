'use strict';
(() => {
  const phone = '4915730916621';
  const paypal = 'https://www.paypal.me/dragangaganet/9.90EUR';
  const de = document.documentElement.lang === 'de';
  const t = (sr, german) => de ? german : sr;
  const urlFor = message => 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message);
  function start() {
    if (document.getElementById('danini-sales')) return;
    const opener = document.createElement('button');
    opener.type = 'button';
    opener.id = 'danini-sales-open';
    opener.textContent = t('Pošalji oglas', 'Inserat senden');
    opener.setAttribute('aria-expanded', 'false');
    const panel = document.createElement('section');
    panel.id = 'danini-sales';
    panel.hidden = true;
    panel.setAttribute('aria-label', t('Pošalji upit DANINI', 'DANINI Anfrage'));
    panel.innerHTML = [
      '<button type="button" id="danini-sales-close" aria-label="Close">×</button>',
      '<h2>' + t('Proveri auto pre kapare', 'Auto vor Anzahlung prüfen') + '</h2>',
      '<label>' + t('Link oglasa', 'Inserat-Link') + '<input id="danini-ad" type="url" placeholder="https://www.mobile.de/..." maxlength="2000"></label>',
      '<label>' + t('Usluga', 'Service') + '<select id="danini-package">',
      '<option value="passport">Import Passport — 9,90 €</option>',
      '<option value="field">Field Check — ' + t('od', 'ab') + ' 79 €</option>',
      '<option value="free">' + t('Besplatan upit / dovoz', 'Kostenlose Anfrage / Transport') + '</option>',
      '</select></label>',
      '<a id="danini-wa" class="danini-action" target="_blank" rel="noopener noreferrer">' + t('Pošalji na WhatsApp', 'Per WhatsApp senden') + '</a>',
      '<a id="danini-pay" class="danini-action secondary" href="' + paypal + '" target="_blank" rel="noopener noreferrer">' + t('Plati 9,90 € preko PayPal-a', '9,90 € per PayPal zahlen') + '</a>',
      '<p class="danini-small">' + t('Pošalji oglas i posle uplate. Uplata nije automatska potvrda narudžbine.', 'Inserat auch nach der Zahlung senden. Zahlung ist keine automatische Auftragsbestätigung.') + '</p>'
    ].join('');
    const css = document.createElement('style');
    css.textContent = '#danini-sales-open{position:fixed;right:16px;bottom:16px;z-index:79;background:#ff792f;color:#0b0e11;border:0;border-radius:28px;padding:15px 20px;font-size:16px;font-weight:800;cursor:pointer;min-height:48px}#danini-sales{position:fixed;z-index:80;right:12px;bottom:12px;width:min(390px,calc(100vw - 24px));max-height:calc(100dvh - 24px);overflow:auto;background:#111a21;color:#fff;border:1px solid #60707a;border-radius:14px;padding:18px;box-shadow:0 12px 40px #0009}#danini-sales[hidden],#danini-sales-open[hidden],#danini-pay[hidden]{display:none!important}#danini-sales h2{margin:8px 30px 16px 0;font-size:22px}#danini-sales label{display:block;font-size:15px;margin:10px 0}#danini-sales input,#danini-sales select{display:block;width:100%;margin-top:6px;padding:12px;border-radius:8px;background:#fff;color:#111;border:1px solid #aaa;font-size:16px}#danini-sales-close{float:right;background:transparent;border:0;color:white;font-size:26px;cursor:pointer;min-width:44px;min-height:44px}.danini-action{display:block;background:#ff792f;color:#111!important;text-align:center;border-radius:8px;padding:14px 10px;margin-top:10px;font-weight:800;text-decoration:none;min-height:48px}.danini-action.secondary{background:#e9f1ff}.danini-small{font-size:12px;line-height:1.5;color:#b7c2cb}@media(max-width:420px){#danini-sales{max-height:calc(100dvh - 8px);bottom:4px;right:4px;width:calc(100vw - 8px)}}';
    document.head.appendChild(css);
    document.body.append(opener, panel);
    const close = () => {panel.hidden = true;opener.hidden = false;opener.setAttribute('aria-expanded','false');};
    opener.addEventListener('click', () => {panel.hidden = false;opener.hidden = true;opener.setAttribute('aria-expanded','true');panel.querySelector('input').focus();});
    panel.querySelector('#danini-sales-close').addEventListener('click', close);
    document.addEventListener('keydown', e => {if(e.key === 'Escape' && !panel.hidden) close();});
    const input=panel.querySelector('#danini-ad'),select=panel.querySelector('#danini-package'),wa=panel.querySelector('#danini-wa'),pay=panel.querySelector('#danini-pay');
    const names={passport:'Import Passport — 9,90 €',field:'Field Check — od 79 €',free:'Besplatan upit / dovoz'};
    const update=() => {
      const link=input.value.trim();
      const msg=['DANINI — upit','Usluga: '+names[select.value],'Oglas: '+(link||'Nije unet'),'Molim potvrdu mogućnosti, obima i narednih koraka.'].join('\n');
      wa.href=urlFor(msg);
      pay.hidden=select.value!=='passport';
    };
    input.addEventListener('input',()=>{input.setCustomValidity('');update();});
    select.addEventListener('change',update);
    wa.addEventListener('click',e=>{
      const value=input.value.trim();
      if(value){try{const u=new URL(value);if(!['https:','http:'].includes(u.protocol))throw Error('protocol');}
        catch {e.preventDefault();input.setCustomValidity(t('Unesi ispravan URL.', 'Bitte gültige URL eingeben.'));input.reportValidity();return;}}
      update();
    });
    update();
    window.DaniniSales = {urlFor,paypal};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);
  else start();
})();