'use strict';
(function(){
  const form=document.getElementById('purchase-brief');if(!form)return;
  const sr=document.documentElement.lang==='sr',out=document.getElementById('purchase-result');
  form.addEventListener('submit',event=>{
    event.preventDefault();const fd=new FormData(form),budget=Number(fd.get('budget'));
    out.replaceChildren();
    const add=(tag,text)=>{const el=document.createElement(tag);el.textContent=text;out.appendChild(el);return el};
    const criteria=String(fd.get('criteria')||'').trim(),purpose=String(fd.get('purpose')||'').trim(),details=String(fd.get('details')||'').trim();
    if(!Number.isFinite(budget)||budget<=0||!criteria||!purpose||!details){add('p',sr?'Unesi budžet, obavezne uslove, namenu i pitanje.':'Budget, Muss-Kriterien, Nutzung und Frage eingeben.');return}
    const stage=form.elements.stage.options[form.elements.stage.selectedIndex].text;
    const draft=[sr?'DOSIJE KUPOVINE — zahtev za ponudu':'KAUFDOSSIER — Angebotsanfrage',(sr?'Ukupan budžet: ':'Gesamtbudget: ')+budget+' EUR',(sr?'Obavezni uslovi (ne menjati bez dogovora): ':'Muss-Kriterien (Änderung nur nach Absprache): ')+criteria,(sr?'Namena i registracija: ':'Nutzung und Zulassung: ')+purpose,(sr?'Trenutni korak: ':'Aktueller Schritt: ')+stage,details,sr?'Tražim pisani obim, izvršioca, cenu i rok pre angažovanja.':'Bitte Umfang, Verantwortlichen, Preis und Termin vor Auftrag bestätigen.'].join('\n');
    const preview=add('pre',draft);preview.style.whiteSpace='pre-wrap';preview.style.overflowWrap='anywhere';
    const button=add('button',sr?'Nastavi na slanje upita':'Weiter zur Anfrage');button.className='btn';button.type='button';
    button.onclick=()=>{try{sessionStorage.setItem('danini-buyer-plan-draft',draft);sessionStorage.setItem('danini-case-brief',JSON.stringify({budget,criteria,purpose}))}catch{add('p',sr?'Kopiraj prikazani tekst u upit; automatski prenos nije dostupan.':'Text in die Anfrage kopieren; automatische Übernahme nicht verfügbar.');return}location.assign(sr?'/sr/upit?service=AD_REVIEW':'/de/anfrage?service=AD_REVIEW')};
  });
})();
