import './styles.css';

/* DANINI navigation is kept consistent across the existing public pages.
   Sections planned for later are explicitly described as not yet selling. */
function addCommerceNavigation(): void {
  function makeAnchor(path: string, sr: string, de: string): HTMLAnchorElement {
    const a = document.createElement('a');
    a.href = '/' + path + '.html';
    a.dataset.sr = sr;
    a.dataset.de = de;
    a.textContent = lang === 'de' ? de : sr;
    return a;
  }
  const navItems: [string,string,string][] = [
    ['buyers','Auto i kupovina','Auto & Kaufberatung'],
    ['auctions','Aukcije (uskoro)','Auktionen (geplant)'],
    ['digital','Digitalni proizvodi','Digitale Produkte'],
    ['ai-solutions','AI i automatizacija','KI & Automatisierung'],
    ['dealers','B2B','B2B'],
    ['contact','Kontakt','Kontakt']
  ];
  const desktop = document.querySelector<HTMLElement>('.desktop');
  if (desktop) {
    desktop.replaceChildren(...navItems.map(([p,sr,de])=>makeAnchor(p,sr,de)));
    desktop.lastElementChild?.classList.add('navcta');
  }
  const mobile = document.querySelector<HTMLElement>('.mobile');
  if (mobile) {
    const mobileItems: [string,string,string][] = [
      ...navItems,
      ['cenovnik','Pilot cenovnik','Pilotpreise'],
      ['guides','Vodiči','Ratgeber'],
      ['support','Podrška','Support'],
      ['about','O nama','Über uns']
    ];
    mobile.replaceChildren(...mobileItems.map(([p,sr,de])=>makeAnchor(p,sr,de)));
  }
  const footerCols = document.querySelectorAll<HTMLElement>('footer .foot > div');
  if (footerCols.length > 1) {
    footerCols[1].append(
      makeAnchor('digital','Digitalni proizvodi','Digitale Produkte'),
      makeAnchor('ai-solutions','AI i automatizacija','KI & Automatisierung'),
      makeAnchor('cenovnik','Pilot cenovnik','Pilotpreise')
    );
  }
  if (footerCols.length > 2) {
    footerCols[2].append(makeAnchor('support','Podrška','Support'));
  }
  // Existing demo links remain deep-linkable without any external data transfer.
  const demo = new URLSearchParams(window.location.search).get('demo');
  const textArea = document.querySelector<HTMLTextAreaElement>('#ai-question');
  const mode = document.querySelector<HTMLSelectElement>('#ai-mode');
  if (demo === 'mercedes' && textArea && mode) {
    textArea.value = lang === 'de' ?
      'Demobeispiel: Mercedes C280 Benzin Automatik, Baujahr 2007, 215000 km, Servicehistorie nicht vollständig. Was vor einer Anzahlung prüfen?' :
      'Demonstracioni primer: Mercedes C280 benzin automatik, 2007, 215000 km. Servisna istorija nije potpuna. Šta proveriti pre kapare?';
    mode.value = 'buyer';
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
 const menuButton=e('toggle');
 if(menuButton)menuButton.setAttribute('aria-label',l==='de'?
   (e('mobile')?.hidden?'Menü öffnen':'Menü schließen'):
   (e('mobile')?.hidden?'Otvori meni':'Zatvori meni'));
 updateImport(); updateLive();
}
e('language')?.addEventListener('click',()=>setLang(lang==='sr'?'de':'sr'));
const menuButton=e('toggle') as HTMLButtonElement|null;
const mobileMenu=e('mobile');
if(menuButton&&mobileMenu){
 menuButton.setAttribute('aria-controls','mobile');
 const setMenu=(open:boolean)=>{
  mobileMenu.hidden=!open;
  menuButton.setAttribute('aria-expanded',String(open));
  menuButton.setAttribute('aria-label',lang==='de'?
   (open?'Menü schließen':'Menü öffnen'):
   (open?'Zatvori meni':'Otvori meni'));
 };
 setMenu(false);
 menuButton.addEventListener('click',()=>setMenu(mobileMenu.hidden));
 mobileMenu.addEventListener('click',event=>{
  if((event.target as HTMLElement).closest('a'))setMenu(false);
 });
 document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&!mobileMenu.hidden){setMenu(false);menuButton.focus();}
 });
}
// Preselect the actual service when visitors follow a service-specific link.
// Whitelist existing <option> values; never insert query-string HTML.
const selectedService=new URLSearchParams(window.location.search).get('service');
document.querySelectorAll<HTMLFormElement>('.rfq[data-dealer]').forEach(form=>{
 const select=form.querySelector<HTMLSelectElement>('select[name="service"]');
 if(!select)return;
 const page=document.body.dataset.page;
 const fallback=page==='exclusive'?'Premium / Oldtimer / Sonderfahrzeug':page==='tender'?'B2B Tender / RFQ':'';
 const wanted=selectedService||fallback;
 if(wanted && Array.from(select.options).some(option=>option.value===wanted))select.value=wanted;
});
document.querySelectorAll<HTMLFormElement>('.rfq[data-dealer]').forEach(form=>{
 form.addEventListener('submit',event=>{
  event.preventDefault(); if(!form.reportValidity())return;
  const d=new FormData(form);const v=(k:string)=>String(d.get(k)||'').trim().slice(0,700);
  const lines=[
    'AutoDanini '+(form.dataset.dealer==='true'?'B2B RFQ':'Privat Anfrage'),
    'Kontakt: '+v('person'),
    ...(form.dataset.dealer==='true'?['Firma: '+v('company'),'Anzahl: '+v('quantity')]:[]),
    'Leistung: '+v('service'),
    'Fahrzeug: '+v('vehicle'),'Kategorie: '+v('category'),
    'Antrieb: '+v('fuel'),'Getriebe: '+v('gearbox'),
    'Budget: '+v('budget')+' EUR','Budget umfasst: '+v('budgetScope'),
    'Zielland: '+v('country'),'Zeitrahmen: '+v('deadline'),
    'Transport: '+v('transport'),'Dokumente/Ursprung: '+v('documents'),
    'Inserate 1–3: '+([v('listing'),v('listing2'),v('listing3')].filter(Boolean).join(' | ')||'-'),
    'Hinweise: '+(v('notes')||'-'),
    'Bitte Umfang, Kosten und Termin schriftlich bestätigen. Keine Reservierung oder Bestellung.'
  ];
  const target='https://wa.me/4915730916621?text='+encodeURIComponent(lines.join('\n'));
  const output=form.querySelector<HTMLElement>('[role=status]');
  if(target.length>4500){
   if(output)output.textContent=lang==='sr'?
    'Upit je predugačak za WhatsApp. Skratite napomene ili linkove.':
    'Die Anfrage ist für WhatsApp zu lang. Bitte Notizen oder Links kürzen.';
   return;
  }
  if(output)output.textContent=lang==='sr'?
   'Otvara se WhatsApp. Poruka nije poslata dok je sami ne potvrdite.':
   'WhatsApp wird geöffnet. Die Nachricht wird erst nach Ihrer Bestätigung gesendet.';
  // Same-tab navigation is not blocked by popup blockers; visitor confirms in WhatsApp.
  window.location.assign(target);
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
 if(output)output.textContent=lang==='de'?'Demotext eingefügt. Lokale Checkliste anzeigen.':'Demonstracioni tekst je unet. Prikažite lokalnu kontrolnu listu.';
}));
import { api } from '@appdeploy/client';
const aiForm = document.querySelector<HTMLFormElement>('#ai-form');
// Current Cloudflare release is deliberately visual-only. The checklist remains
// available without generating API costs or implying a live AI implementation.
const aiRuntimeEnabled = import.meta.env.VITE_AUTODANINI_AI_ENABLED === 'true';
function localVehicleChecklist(mode: string, description: string, lang: Lang): string {
  const q = description.toLocaleLowerCase();
  const de = lang === 'de';
  const lines = de ?
    ['DANINI / LOKALE DEMO-CHECKLISTE (KEINE KI-ANALYSE)',
     'Diese Fragen sind allgemeine Hinweise. Ihr Inserat und das Fahrzeug wurden NICHT überprüft.',
     '1. Verkäuferidentität, Eigentumsnachweis und vollständige Fahrzeugunterlagen prüfen.',
     '2. Servicebelege, HU-Berichte, Unfallhistorie und Widersprüche im Inserat erfragen.',
     '3. Vor einer Anzahlung unabhängige Besichtigung und sichere Vertragsbedingungen klären.'] :
    ['DANINI / LOKALNA KONTROLNA LISTA (NIJE AI ANALIZA)',
     'Ovo su opšta pitanja. Nismo proverili oglas, dokumenta niti stvarno stanje automobila.',
     '1. Proveriti identitet prodavca, vlasništvo i kompletnu dokumentaciju vozila.',
     '2. Tražiti račune servisa, tehničke izveštaje, istoriju nezgoda i razjašnjenje neslaganja u oglasu.',
     '3. Pre kapare dogovoriti nezavisan pregled i bezbedne ugovorne uslove.'];
  if (/km|kilomet|laufleistung|tacho/i.test(q)) lines.push(de ?
    '4. Laufleistung mit Service- und HU-Nachweisen abgleichen.' :
    '4. Uporediti kilometražu sa servisnim i tehničkim zapisima.');
  if (/automatik|automatic|dsg|menjač|getriebe/i.test(q)) lines.push(de ?
    '• Automatikgetriebe: Wartungsnachweise und Testfahrt unter Last prüfen.' :
    '• Automatski menjač: proveriti servisnu istoriju i probnu vožnju pod opterećenjem.');
  if (mode === 'import' || /uvoz|import|carina|zoll|eur.1/i.test(q)) lines.push(de ?
    '• Import: Ursprung, Ausfuhrbelege, Zoll, Einfuhrumsatzsteuer und Zulassung separat klären.' :
    '• Uvoz: posebno proveriti poreklo, izvoznu dokumentaciju, carinu, PDV i registraciju.');
  if (mode === 'dealer') lines.push(de ?
    '• B2B: Unternehmensidentität, Vollmachten, Rechnungsart, Mengen und Lieferfristen belegen lassen.' :
    '• B2B: proveriti identitet firme, ovlašćenja, vrstu računa, količine i rokove.');
  lines.push('',de ?
    'Nächster Schritt: Verkäuferfragen schriftlich bestätigen und unabhängigen Prüfer beauftragen. Keine Kauf- oder Steuerberatung.' :
    'Sledeći korak: potvrditi pitanja prodavcu pismeno i angažovati nezavisnog kontrolora. Nije kupoprodajni, poreski ni tehnički nalaz.');
  return lines.join('\n');
}
aiForm?.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  if (!aiForm.reportValidity()) return;
  const select = document.querySelector<HTMLSelectElement>('#ai-mode');
  const question = document.querySelector<HTMLTextAreaElement>('#ai-question');
  const output = document.getElementById('ai-output');
  const button = document.querySelector<HTMLButtonElement>('#ai-go');
  if (!select || !question || !output || !button) return;
  if (question.value.trim().length < 30) return;
  if (!aiRuntimeEnabled) {
    output.textContent = localVehicleChecklist(select.value,question.value.trim(),lang);
    return;
  }
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
