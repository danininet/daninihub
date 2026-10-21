import './styles.css';

/* Shared navigation for pilot pricing, educational article, FAQ.
   These links are inserted without modifying every individual HTML entry point. */
function addCommerceNavigation(): void {
  function makeAnchor(path: string, sr: string, de: string): HTMLAnchorElement {
    const a = document.createElement('a');
    a.href = path + '.html';
    a.dataset.sr = sr;
    a.dataset.de = de;
    a.textContent = lang === 'de' ? de : sr;
    return a;
  }
  const desktopContact = document.querySelector('.desktop .navcta');
  const mobileMenu = document.querySelector('.mobile');
  if (mobileMenu) mobileMenu.append(makeAnchor('nalog','Moj nalog','Mein Konto'));
  const footerInfo = document.querySelectorAll('footer .foot > div');
  if (footerInfo.length > 2) footerInfo[2].append(makeAnchor('nalog','Moj nalog','Mein Konto'));
  if (desktopContact) {desktopContact.before(makeAnchor('cenovnik', 'Cenovnik', 'Preise')); desktopContact.before(makeAnchor('nalog','Moj nalog','Mein Konto'));}
  const mobile = document.querySelector('.mobile');
  if (mobile) {
    mobile.append(makeAnchor('cenovnik', 'Cenovnik', 'Preise'));
    mobile.append(makeAnchor('ai-primer', 'AI primer', 'KI-Beispiel'));
    mobile.append(makeAnchor('faq', 'Česta pitanja', 'FAQ'));
  }
  const footerColumns = document.querySelectorAll('footer .foot > div');
  if (footerColumns.length > 1) {
    footerColumns[1].append(makeAnchor('cenovnik', 'Cenovnik', 'Preise'));
    footerColumns[1].append(makeAnchor('ai-primer', 'AI primer', 'KI-Beispiel'));
    footerColumns[1].append(makeAnchor('faq', 'Česta pitanja', 'FAQ'));
  }
  const demo = new URLSearchParams(window.location.search).get('demo');
  const cases: Record<string, { mode: string; sr: string; de: string }> = {
    mercedes: {
      mode: 'buyer',
      sr: 'Demonstracioni primer: Mercedes C280 benzin automatik, godište 2007, 215000 km. Servisna istorija nije potpuna. Koji su konkretni rizici i pitanja prodavcu pre kapare?',
      de: 'Demobeispiel: Mercedes C280 Benzin Automatik, Baujahr 2007, 215000 km. Die Servicehistorie ist unvollständig. Welche Risiken, Nachweise und Verkäuferfragen gibt es vor der Anzahlung?'
    }
  };
  const textArea = document.querySelector<HTMLTextAreaElement>('#ai-question');
  const mode = document.querySelector<HTMLSelectElement>('#ai-mode');
  if (demo && cases[demo] && textArea && mode) {
    textArea.value = cases[demo][lang];
    mode.value = cases[demo].mode;
  }
  setLang(lang);
}
// Navigation is initialized after locale and DOM handlers are ready.

type Lang = 'sr' | 'de';
let lang: Lang = localStorage.getItem('autodanini-language') === 'de' ? 'de' : 'sr';
const e = (id: string) => document.getElementById(id);
function currency(v: number): string {return new Intl.NumberFormat(lang === 'de' ? 'de-DE' : 'sr-RS',{style:'currency',currency:'EUR',maximumFractionDigits:2}).format(v);}
function setLang(l: Lang): void {
 lang=l; document.documentElement.lang=l; localStorage.setItem('autodanini-language',l);
 document.querySelectorAll<HTMLElement>('[data-sr][data-de]').forEach(el=>{el.textContent=el.dataset[l]||'';});
 if(e('language')) e('language')!.textContent=l==='sr'?'DE':'SR';
 updateImport(); updateLive();
}
e('language')?.addEventListener('click',()=>setLang(lang==='sr'?'de':'sr'));
e('toggle')?.addEventListener('click',()=>{const m=e('mobile');if(m)m.hidden=!m.hidden;});
document.querySelectorAll<HTMLFormElement>('.rfq[data-dealer]').forEach(form=>{
 form.addEventListener('submit',event=>{
  event.preventDefault(); if(!form.reportValidity())return;
  const d=new FormData(form);const v=(k:string)=>String(d.get(k)||'').trim().slice(0,700);
  const lines=['AutoDanini '+(form.dataset.dealer==='true'?'B2B':'Privat'),'Name: '+v('person'),'Fahrzeug: '+v('vehicle'),'Budget: '+v('budget')+' EUR','Zielland: '+v('country'),...(form.dataset.dealer==='true'?['Firma: '+v('company'),'Anzahl: '+v('quantity')]:[]),'Link: '+(v('listing')||'-'),'Notizen: '+(v('notes')||'-'),'Bitte Umfang und Preis schriftlich bestätigen.'];
  window.open('https://wa.me/4915730916621?text='+encodeURIComponent(lines.join('\n')),'_blank','noopener,noreferrer');
  const output=form.querySelector<HTMLElement>('[role=status]');if(output)output.textContent=lang==='sr'?'Otvoren je WhatsApp. Potvrdite slanje poruke tamo.':'WhatsApp wurde geöffnet. Bitte Nachricht dort senden.';
 });
});
function updateLive():void {
 const km=e('km') as HTMLInputElement|null,out=e('liveout'),wa=e('livewa') as HTMLAnchorElement|null;
 if(!km||!out||!wa)return;
 const n=Number(km.value),ok=km.value.trim()!==''&&km.validity.valid&&Number.isFinite(n);
 out.textContent=!ok?'—':n>200?(lang==='sr'?'Na upit':'Auf Anfrage'):currency(119+1.2*Math.max(0,n-25));
 wa.href='https://wa.me/4915730916621?text='+encodeURIComponent('AutoDanini: Live-Video-Besichtigung. Entfernung von Duisburg: '+(ok?n+' km':'unbekannt')+'. Bitte um Termin, Verkäuferzustimmung und Preisbestätigung.');
}
e('km')?.addEventListener('input',updateLive);
document.querySelectorAll<HTMLButtonElement>('[data-km]').forEach(b=>b.addEventListener('click',()=>{const x=e('km') as HTMLInputElement;if(x)x.value=b.dataset.km||'';updateLive();}));
function updateImport():void {
 const p=e('price') as HTMLInputElement|null,x=e('extra') as HTMLInputElement|null,r=e('rate') as HTMLSelectElement|null;
 const t=e('total'),d=e('duty'),v=e('vat');
 if(!p||!x||!r||!t||!d||!v)return;
 const valid=!!p.value.trim()&&!!x.value.trim()&&p.validity.valid&&x.validity.valid&&Number(p.value)>0&&Number(x.value)>=0;
 if(!valid){t.textContent='—';d.textContent='—';v.textContent='—';return;}
 const base=Number(p.value)+Number(x.value),duty=base*Number(r.value),vat=(base+duty)*.2;
 t.textContent=currency(base+duty+vat);d.textContent=currency(duty);v.textContent=currency(vat);
}
['price','extra','rate'].forEach(id=>e(id)?.addEventListener('input',updateImport));
e('recalc')?.addEventListener('click',updateImport);
e('clear')?.addEventListener('click',()=>{localStorage.removeItem('autodanini-language');if(e('clearresult'))e('clearresult')!.textContent=lang==='sr'?'Izbor jezika obrisan.':'Sprachwahl gelöscht.';});
setLang(lang);

const demoCases: Record<string,{mode:string;sr:string;de:string}> = {
 mercedes: {mode:'buyer',sr:'Demonstracioni primer: Mercedes C280 benzin automatik, 2007, 215000 km. Servisna istorija nije potpuna. Koje rizike i dokumente da proverim pre kapare i koja pitanja da postavim prodavcu?',de:'Demobeispiel: Mercedes C280 Benzin Automatik, Baujahr 2007, 215000 km. Servicehistorie nicht vollständig. Welche Risiken, Nachweise und Fragen sind vor einer Anzahlung wichtig?'},
 import: {mode:'import',sr:'Demonstracioni primer: polovni automobil iz Nemačke treba uvesti u Srbiju, cena 8500 EUR, prevoz 650 EUR, poreklo vozila nije dokumentovano. Koji troškovi i dokumenti se moraju proveriti?',de:'Demobeispiel: Gebrauchtwagen aus Deutschland nach Serbien, Preis 8500 EUR, Transport 650 EUR, Ursprung nicht belegt. Welche Kosten und Unterlagen müssen geprüft werden?'},
 dealer: {mode:'dealer',sr:'Demonstracioni primer: auto-kuća u Srbiji traži tri automobila iz Nemačke, 2018–2021, benzin ili hibrid, ukupan budžet 40000 EUR. Kako formulisati B2B zahtev i proveriti dobavljača?',de:'Demobeispiel: Autohaus in Serbien sucht drei Fahrzeuge aus Deutschland, Baujahr 2018 bis 2021, Benzin oder Hybrid, Gesamtbudget 40000 EUR. Wie formuliere ich eine B2B-Anfrage und prüfe Anbieter?'}
};
document.querySelectorAll<HTMLButtonElement>('[data-ai-example]').forEach(btn=>btn.addEventListener('click',()=>{
 const example=demoCases[btn.dataset.aiExample||''];
 const mode=document.querySelector<HTMLSelectElement>('#ai-mode');
 const question=document.querySelector<HTMLTextAreaElement>('#ai-question');
 if(!example||!mode||!question)return;
 mode.value=example.mode;question.value=example[lang];question.focus();
 const output=document.getElementById('ai-output');
 if(output)output.textContent=lang==='de'?'Demotext eingefügt. Bitte Einwilligung bestätigen und echte Analyse starten.':'Demonstracioni tekst je unet. Potvrdite saglasnost i pokrenite stvarnu analizu.';
}));
import { api } from '@appdeploy/client';
const aiForm = document.querySelector<HTMLFormElement>('#ai-form');
aiForm?.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  if (!aiForm.reportValidity()) return;
  const select = document.querySelector<HTMLSelectElement>('#ai-mode');
  const question = document.querySelector<HTMLTextAreaElement>('#ai-question');
  const output = document.getElementById('ai-output');
  const button = document.querySelector<HTMLButtonElement>('#ai-go');
  if (!select || !question || !output || !button) return;
  if (question.value.trim().length < 30) return;
  button.disabled = true;
  output.textContent = lang === 'de' ? 'Die KI erstellt eine erste Einschätzung...' : 'AI priprema preliminarnu analizu...';
  try {
    const response = await api.post('/api/advice', { mode: select.value, question: question.value.trim(), lang, consent: true });
    const answer = response.data?.answer;
    if (typeof answer !== 'string' || !answer.trim()) throw new Error('No answer');
    output.textContent = answer;
  } catch (_error) {
    output.textContent = lang === 'de' ? 'KI gerade nicht verfügbar oder Tageslimit erreicht. Bitte WhatsApp nutzen oder später erneut versuchen.' : 'AI je trenutno nedostupan ili je dostignut dnevni limit. Koristite WhatsApp ili pokušajte ponovo kasnije.';
  } finally {
    button.disabled = false;
  }
});

// Initialize shared navigation after language state exists.
addCommerceNavigation();
