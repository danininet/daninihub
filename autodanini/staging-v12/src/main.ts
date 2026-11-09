import './styles.css';
import './intake';

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
  // Prioritise active visitor journeys; planned services remain accessible below.
  const navItems: [string,string,string][] = [
    ['danini','DANINI · Brend','DANINI · Marke'],
    ['buyers','AutoDanini','AutoDanini'],
    ['business','Za firme','Für Unternehmen'],
    ['guides','Vodiči','Ratgeber'],
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
      ['dealers','Auto B2B','Auto B2B'],
      ['ai-solutions','AI i automatizacija','KI & Automatisierung'],
      ['digital','Digitalni proizvodi','Digitale Produkte'],
      ['cenovnik','Pilot cenovnik','Pilotpreise'],
      ['support','Podrška','Support'],
      ['about','O nama','Über uns']
    ];
    mobile.replaceChildren(...mobileItems.map(([p,sr,de])=>makeAnchor(p,sr,de)));
  }
  const footerCols = document.querySelectorAll<HTMLElement>('footer .foot > div');
  if (footerCols.length > 1) {
    footerCols[1].append(
      makeAnchor('danini','DANINI · Krovni brend','DANINI · Dachmarke'),
      makeAnchor('business','DANINI Business','DANINI Business'),
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
 document.querySelectorAll<HTMLImageElement>('img[data-sr-alt][data-de-alt]').forEach(img=>{img.alt=l==='de'?(img.dataset.deAlt||''):(img.dataset.srAlt||'');});
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
// All RFQ/contact submissions are handled by the Brevo-ready shared intake
// module. Direct WhatsApp remains a separate optional user-initiated link.
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
// Interactive dossier: local output only; a separate AI service may be added after verified activation.
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
// This is a useful local self-service case file, NOT a live AI or seller verification.
// All content comes from the visitor's own entries; no external fetch or persistence.
let lastDossier = '';
function evidenceLabel(key: string, value: string, de: boolean): string {
  const values: Record<string,Record<string,string>> = {
    seller: {
      unknown: de?'Unbekannt / nicht geprüft':'Nepoznato / nije provereno',
      claimed: de?'Vom Verkäufer behauptet; nicht überprüft':'Navod prodavca; nije provereno',
      missing: de?'Eigentumsnachweis fehlt':'Dokaz o vlasništvu nedostaje'
    },
    service: {
      unknown: de?'Unbekannt / nicht geprüft':'Nepoznato / nije provereno',
      claimed: de?'Laut Verkäufer vorhanden; nicht überprüft':'Navod prodavca; nije provereno',
      missing: de?'Servicebelege fehlen':'Servisni dokazi nedostaju'
    },
    inspection: {
      unknown: de?'Nicht vereinbart / unbekannt':'Nije zakazano / nepoznato',
      claimed: de?'Bericht nur behauptet, nicht überprüft':'Izveštaj se pominje, nije proveren',
      planned: de?'Prüfung geplant oder angefragt':'Pregled planiran ili tražen'
    }
  };
  return values[key]?.[value]||values[key]?.unknown||'–';
}
function buildLocalVehicleDossier(mode: string, description: string, listing: string, evidence: Record<string,string>, locale: Lang): string {
 const de = locale==='de';
 const date=new Date().toLocaleDateString(de?'de-DE':'sr-RS');
 const lines=[
  de?'DANINI / FAHRZEUGDOSSIER (lokal, keine KI-Analyse)':'DANINI / DIGITALNI DOSIJE VOZILA (lokalno, nije AI analiza)',
  (de?'Datum: ':'Datum: ')+date,
  de?'QUELLE: AUSSCHLIESSLICH ANGABEN DES NUTZERS':'IZVOR: ISKLJUČIVO PODACI KOJE JE UNEO KORISNIK',
  '',
  (de?'Aufgabe: ':'Zadatak: ')+mode,
  de?'Fahrzeug / Fragen:':'Vozilo / pitanja:',
  description,
  '',
  (de?'Inserat (ungeprüfter Link): ':'Oglas (neproveren link): ')+(listing||'–'),
  '',
  de?'DOKUMENTATION / OFFENE BELEGE':'DOKUMENTACIJA / NEPOZNATI DOKAZI',
  (de?'Eigentum / Verkäufer: ':'Vlasništvo / prodavac: ')+evidenceLabel('seller',evidence.seller,de),
  (de?'Servicehistorie: ':'Servisna istorija: ')+evidenceLabel('service',evidence.service,de),
  (de?'Unabhängige Prüfung: ':'Nezavisan pregled: ')+evidenceLabel('inspection',evidence.inspection,de),
  ''
 ];
 if(evidence.seller==='missing')lines.push(de?'WICHTIG: Eigentumsunterlagen vor Zahlung einfordern.':'VAŽNO: Pre uplate tražiti dokumente o vlasništvu.');
 if(evidence.service==='missing')lines.push(de?'OFFEN: Fehlende Wartungsbelege schriftlich klären.':'OTVORENO: Razjasniti nedostajuću servisnu istoriju.');
 if(evidence.inspection==='unknown')lines.push(de?'OFFEN: Unabhängige Prüfung vor verbindlicher Zusage erwägen.':'OTVORENO: Razmotriti nezavisan pregled pre obavezujućeg dogovora.');
 lines.push('',localVehicleChecklist(mode,description,locale),'',
  de?'Dieses Dossier ist eine persönliche Vorbereitung, keine Fahrzeugprüfung, Preisgarantie, Verifizierung, Kauf- oder Rechtsberatung.':
     'Dosije je lična priprema, ne tehnička provera, garancija, potvrda oglasa, kupoprodajni ili pravni savet.',
  de?'Bei Bedarf unabhängige Prüfung / Unterstützung separat beauftragen.':
     'Po potrebi, nezavisni pregled ili pomoć posebno zatražiti.');
 return lines.join('\n');
}
const caseDownload=document.querySelector<HTMLButtonElement>('#ai-download-case');
caseDownload?.addEventListener('click',()=>{
 if(!lastDossier)return;
 const blob=new Blob([lastDossier],{type:'text/plain;charset=utf-8'});
 const url=URL.createObjectURL(blob);
 const a=document.createElement('a');
 a.href=url;
 a.download='danini-fahrzeugdossier-'+new Date().toISOString().slice(0,10)+'.txt';
 document.body.append(a);a.click();a.remove();
 window.setTimeout(()=>URL.revokeObjectURL(url),2000);
});
aiForm?.addEventListener('input',()=>{
 lastDossier='';
 if(caseDownload)caseDownload.hidden=true;
});

aiForm?.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  if (!aiForm.reportValidity()) return;
  const select = document.querySelector<HTMLSelectElement>('#ai-mode');
  const question = document.querySelector<HTMLTextAreaElement>('#ai-question');
  const output = document.getElementById('ai-output');
  const button = document.querySelector<HTMLButtonElement>('#ai-go');
  if (!select || !question || !output || !button) return;
  if (question.value.trim().length < 30) return;
  const listingInput=document.querySelector<HTMLInputElement>('#ai-listing-url');
  const listing=listingInput?.value.trim()||'';
  if(listing){
   try{
    const u=new URL(listing);
    if(u.protocol!=='https:'&&u.protocol!=='http:')throw new Error('invalid_url');
   }catch{
    output.textContent=lang==='de'?'Bitte nur eine gültige http(s)-Inserat-URL angeben.':'Unesite ispravan http(s) link oglasa.';
    return;
   }
  }
  const evidence={
   seller:document.querySelector<HTMLSelectElement>('#ai-evidence-seller')?.value||'unknown',
   service:document.querySelector<HTMLSelectElement>('#ai-evidence-service')?.value||'unknown',
   inspection:document.querySelector<HTMLSelectElement>('#ai-evidence-inspection')?.value||'unknown'
  };
  lastDossier=buildLocalVehicleDossier(select.value,question.value.trim(),listing,evidence,lang);
  // The structured dossier works regardless of optional AI credentials.
  // This action never performs an API call or sends the visitor's notes.
  output.textContent=lastDossier;
  if(caseDownload)caseDownload.hidden=false;
  return;
});

// Initialize shared navigation after language state exists.
addCommerceNavigation();


/* CNC/B2B prelaunch RFQ: local preview only. Never posts to DANINI.
   No file upload, automated outreach, contracts or backend storage. */
const rfqForm = document.querySelector<HTMLFormElement>('#danini-rfq-form');
if (rfqForm) {
  const preview = rfqForm.querySelector<HTMLElement>('.danini-rfq-preview');
  const result = document.getElementById('danini-rfq-output');
  const status = document.getElementById('danini-rfq-status');
  const copyButton = document.getElementById('danini-rfq-copy') as HTMLButtonElement|null;
  const whatsApp = document.getElementById('danini-rfq-whatsapp') as HTMLAnchorElement|null;
  let draft = '';
  rfqForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!rfqForm.reportValidity()) return;
    const field = (key: string) => String((rfqForm.elements.namedItem(key) as HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement|null)?.value||'').trim();
    const process=field('process'), material=field('material'), quantity=field('quantity');
    if(!/^\d+$/.test(quantity) || Number(quantity)<1 || Number(quantity)>10000000) {
      if(status)status.textContent=lang==='de'?'Ungültige Stückzahl.':'Nevažeća količina.';
      return;
    }
    draft=[
      'DANINI BUSINESS / CNC RFQ-ENTWURF – UNVERBINDLICH',
      'Fertigungsverfahren: '+process,
      'Material: '+material.slice(0,70),
      'Stückzahl: '+quantity,
      'Wunschtermin: '+(field('deadline')||'noch offen'),
      'Lieferland: '+field('destination'),
      'Anforderungen: '+(field('notes').slice(0,600)||'noch zu klären'),
      '',
      'Bitte technische Machbarkeit, Toleranzen, Zertifikate, Preis und Lieferzeit individuell prüfen.',
      'Keine Bestellung, keine Produktionsfreigabe und keine vertraulichen Zeichnungen.',
      'Erstellt als unverbindlicher RFQ-Entwurf im Browser.'
    ].join('\n');
    if(result)result.textContent=draft;
    if(preview)preview.hidden=false;
    if(status)status.textContent=lang==='de'?
      'Entwurf lokal erstellt. Nur durch Ihre Bestätigung wird WhatsApp geöffnet.':
      'Nacrt je pripremljen lokalno. Samo vi odlučujete da li ćete otvoriti WhatsApp.';
    if(whatsApp){
      const url='https://wa.me/4915730916621?text='+encodeURIComponent(draft);
      whatsApp.href=url.length<1900?url:'#';
      whatsApp.hidden=url.length>=1900;
    }
  });
  copyButton?.addEventListener('click',async()=>{
    if(!draft)return;
    try {
      await navigator.clipboard.writeText(draft);
      if(status)status.textContent=lang==='de'?'Text kopiert.':'Tekst je kopiran.';
    } catch (_) {
      if(status)status.textContent=lang==='de'?'Kopieren nicht möglich: Text oben markieren.':'Kopiranje nije moguće: označite tekst iznad.';
    }
  });
  rfqForm.addEventListener('input',()=>{
    if(preview)preview.hidden=true;
    draft='';
    if(whatsApp)whatsApp.removeAttribute('href');
  });
}
