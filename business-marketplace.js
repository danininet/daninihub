'use strict';

// No pretend auction or invented listings. Requests are prepared in the visitor's browser
// and submitted to the owner's real WhatsApp account only when the visitor confirms sending.
const whatsapp='4915730916621';
const data={
 sr:{
  nav:['Tražim automobil','Nudim automobil','Zakup placeva u Nišu'],
  buyer:{
   title:'Objavi kakav automobil tražiš — neka prodavci ponude odgovarajući',
   lead:'Ne pretražuj stotine oglasa naslepo. Pošalji svoj stvarni zahtev sa UKUPNIM budžetom i uslovima. Pomoći ćemo da zahtev bude jasan i proverićemo da li postoji trgovac koji može da ponudi odgovarajuće vozilo. Još ne postoji otvorena automatska aukcija.',
   titleForm:'Moj zahtev za kupovinu',
   fields:[['budget','Ukupan budžet u evrima (auto i svi troškovi)','number',true],['model','Marka i model ili alternative','text',true],['fuel','Gorivo','select',false,['Sve','Benzin','Dizel','Hibrid','Električni']],['transmission','Menjač','select',false,['Sve','Automatik','Manuelni']],['country','Gde želiš da registruješ vozilo','select',true,['Srbija','Nemačka','Drugo']],['requirements','Godište, kilometraža, oprema i dodatni uslovi','textarea',true]],
   button:'Pošalji zahtev preko WhatsApp-a',process:'Ne tvrdimo da već imamo mrežu ponuđača. Ako se odgovarajuća ponuda ne pronađe, to ćemo jasno reći. Nikakav depozit se ne plaća preko ove stranice.'
  },
  seller:{
   title:'Ponudi automobil stvarnom zainteresovanom kupcu',
   lead:'Auto-kuća ili privatni prodavac može poslati konkretnu ponudu vozila. Ponuda nije automatski objavljena, niti predstavljamo automobil kao proveren bez dokaza. Prvo proveravamo podatke i uslove.',
   titleForm:'Podaci o ponudi vozila',
   fields:[['seller','Auto-kuća ili privatni prodavac (naziv/ime)','text',true],['model','Marka, model, godište i motor','text',true],['price','Tražena cena u evrima','number',true],['country','Gde se vozilo nalazi','select',true,['Nemačka','Srbija','Austrija','Švajcarska','Drugo']],['listing','Link ka oglasu ili vozilu','url',true],['terms','Dokumentacija, stanje i šta je uključeno u cenu','textarea',true]],
   button:'Pošalji ponudu preko WhatsApp-a',process:'Slanje ponude ne znači da je vozilo verifikovano niti da postoji garantovan kupac. Ne uplaćujte novac ovoj platformi za objavu oglasa.'
  },
  land:{
   title:'Izdavanje zemljišta u Čalijama, Niš — za auto-placeve i poslovnu namenu',
   lead:'Dve lokacije koje mogu biti interesantne trgovcima automobilima, rent-a-car firmama, flotama i firmama kojima je potreban otvoreni poslovni prostor. Izdavanje direktno sa vlasnikom, pojedinačno ili zajedno, po dogovoru.',
   titleForm:'Zatraži ponudu za zakup',
   fields:[['area','Za koji plac ste zainteresovani','select',true,['Manji plac (oko 345 m²)','Veći plac (oko 648 m²)','Oba placa']],['purpose','Planirana poslovna namena','text',true],['duration','Željeni period zakupa','text',true],['company','Firma i kontakt osoba','text',true],['requirements','Potrebno uređenje, pristup, plan obilaska i pitanja','textarea',false]],
   button:'Pošalji upit vlasniku preko WhatsApp-a',process:'Navedene površine su ranije okvirne procene, ne potvrđene geodetske mere. Tačna površina, priključci, namena, prilaz, stanje zemljišta i uslovi uređenja proveravaju se pre ugovaranja. Zakup i cena po individualnoj ponudi.'
  },
  privacy:'Podaci ostaju u tvom pregledaču dok ne izabereš slanje. WhatsApp otvara pripremljenu poruku koju možeš pregledati i potvrditi. Na ovom sajtu se ovim obrascem ne otvara nalog niti automatski čuva javni oglas.',
  contact:'Direktan kontakt',
  button:'Otvori WhatsApp',alt:'Pošalji email',required:'Obavezna polja su označena zvezdicom.'
 },
 de:{
  nav:['Fahrzeug gesucht','Fahrzeug anbieten','Gewerbeflächen in Niš'],
  buyer:{
   title:'Fahrzeugwunsch veröffentlichen — passende Angebote anfragen',
   lead:'Beschreiben Sie Ihr gesuchtes Fahrzeug mit vollständigem Gesamtbudget. Wir klären die Anfrage und prüfen, ob Händler ein passendes Fahrzeug anbieten können. Eine automatische Auktion oder bestätigte Händlerliste gibt es noch nicht.',
   titleForm:'Meine Fahrzeuganfrage',
   fields:[['budget','Gesamtbudget in Euro einschließlich Nebenkosten','number',true],['model','Marke, Modell oder Alternativen','text',true],['fuel','Antrieb','select',false,['Alle','Benzin','Diesel','Hybrid','Elektro']],['transmission','Getriebe','select',false,['Alle','Automatik','Manuell']],['country','Land der Zulassung','select',true,['Serbien','Deutschland','Andere']],['requirements','Baujahr, Kilometerstand, Ausstattung, Wünsche','textarea',true]],
   button:'Fahrzeugwunsch per WhatsApp senden',process:'Wir versprechen keine Händlerangebote. Falls keine passende Option verfügbar ist, sagen wir dies offen. Keine Anzahlung über diese Seite.'
  },
  seller:{
   title:'Ein Fahrzeug einem interessierten Käufer anbieten',
   lead:'Autohäuser und private Verkäufer können konkrete Angebote einreichen. Ein Angebot wird nicht automatisch veröffentlicht und ein Fahrzeug gilt nicht ohne Prüfung als verifiziert.',
   titleForm:'Fahrzeugangebot',
   fields:[['seller','Autohaus oder privater Anbieter (Name)','text',true],['model','Marke, Modell, Baujahr und Motor','text',true],['price','Preis in Euro','number',true],['country','Standort des Fahrzeugs','select',true,['Deutschland','Serbien','Österreich','Schweiz','Andere']],['listing','Link zum Fahrzeugangebot','url',true],['terms','Unterlagen, Zustand und enthaltene Leistungen','textarea',true]],
   button:'Fahrzeugangebot per WhatsApp senden',process:'Das Einreichen eines Angebots ist keine Fahrzeugverifizierung und keine Vermittlungsgarantie. Keine Gebühren oder Anzahlungen an die Plattform.'
  },
  land:{
   title:'Gewerbeflächen in Čalije, Niš — Autohandel, Fuhrpark und offene Flächen',
   lead:'Zwei Flächen für mögliche gewerbliche Nutzung wie Autohandel, Mietwagenflotten oder Stellplätze. Einzelne oder gemeinsame Anmietung direkt vom Eigentümer nach Vereinbarung.',
   titleForm:'Mietanfrage senden',
   fields:[['area','Gewünschte Fläche','select',true,['Kleinere Fläche (ca. 345 m²)','Größere Fläche (ca. 648 m²)','Beide Flächen']],['purpose','Geplante Nutzung','text',true],['duration','Gewünschte Mietdauer','text',true],['company','Unternehmen und Kontaktperson','text',true],['requirements','Zufahrt, Herrichtung, Besichtigung und Fragen','textarea',false]],
   button:'Mietanfrage per WhatsApp senden',process:'Flächengrößen sind vorläufige Angaben, keine bestätigten Vermessungen. Rechtslage, Zufahrt, Nutzungszulässigkeit, Anschlüsse und Grundstückszustand werden vor Vertragsschluss geprüft. Preis nach individuellem Angebot.'
  },
  privacy:'Die Angaben verbleiben im Browser, bis Sie WhatsApp öffnen und die vorbereitete Nachricht selbst absenden. Über dieses Formular wird weder ein öffentlicher Eintrag gespeichert noch ein Nutzerkonto angelegt.',
  contact:'Direkter Kontakt',
  button:'WhatsApp öffnen',alt:'Per E-Mail schreiben',required:'Pflichtfelder sind mit Stern markiert.'
 }
};
function esc(x){return String(x).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));}
function field([name,label,type,required,choices]){
 const at=(required?' required':'')+(type==='number'?' min="1" max="100000000" step="1"':'')+(type==='text'?' maxlength="250"':'')+(type==='url'?' maxlength="1000"':'');
 const id='dh-'+name;
 let widget=type==='select'?'<select id="'+id+'" name="'+name+'"'+at+'>'+choices.map((v,i)=>'<option value="'+esc(v)+'">'+esc(v)+'</option>').join('')+'</select>'
 :type==='textarea'?'<textarea id="'+id+'" name="'+name+'" maxlength="1200" rows="3"'+at+'></textarea>'
 :'<input id="'+id+'" name="'+name+'" type="'+type+'"'+at+'>';
 return '<label for="'+id+'">'+esc(label)+(required?' *':'')+widget+'</label>';
}
function seoExplainer(lang,section){
 const sr=lang==='sr';
 if(section==='land')return '<section class="section dh-intent"><h2>'+(sr?'Izdavanje placa za auto-plac ili vozni park u Nišu':'Gewerbeflächen für Autohandel und Fuhrpark in Niš')+'</h2><p>'+(sr?'Čalije, Matejevački put, Niš: dve odvojene površine približno 345 i 648 m², pojedinačno ili zajedno, za poslovni zakup. Mogući korisnici su auto-kuće, rent-a-car firme i preduzeća sa voznim parkom. Tačne mere, namena i prilaz potvrđuju se pre ugovora.':'Čalije, Matejevački put, Niš: ca. 345 und 648 m², einzeln oder gemeinsam anfragbar. Maße, Nutzung und Zufahrt vor einem Mietvertrag prüfen.')+'</p><h3>'+(sr?'Šta treba proveriti pre zakupa?':'Was wird vor Mietbeginn geprüft?')+'</h3><p>'+(sr?'Stanje terena, dozvoljenu namenu, mogućnost ograđivanja i nasipanja, pristup vozila, trajanje i cenu zakupa. Fotografski materijal i obilazak dostavljaju se po konkretnom upitu.':'Zustand, zulässige Nutzung, Zaun/Herrichtung, Zufahrt, Dauer und Miete werden vor der Vereinbarung geklärt. Fotos und Besichtigung auf Anfrage.')+'</p><p><a href="https://calije.daninihub.com/sr" rel="noopener noreferrer">'+(sr?'Postojeća prezentacija lokacije':'Vorhandene Standortpräsentation')+'</a></p></section>';
 if(section==='buyer')return '<section class="section dh-intent"><h2>'+(sr?'Kako pronaći automobil do ukupnog budžeta?':'Fahrzeugkauf aus Deutschland nach Serbien')+'</h2><p>'+(sr?'Pošalji ukupni budžet, menjač, gorivo, godište i mesto registracije. Za auto iz Nemačke računaj i put/prevoz, dokumenta, moguće dažbine i registraciju. Ne tvrdimo da unapred posedujemo automobile ili mrežu aktivnih ponuđača.':'Sende Gesamtbudget, Getriebe, Antrieb, Baujahr und Zulassungsland. Import- und Transportkosten sind zusätzliche Faktoren. Aktive Händlerangebote werden nicht erfunden.')+'</p><p>'+(sr?'Slanje zahteva je besplatno. Dodatne usluge samo uz prethodnu pisanu ponudu.':'Anfragen sind kostenlos. Weitere Leistungen nur nach schriftlichem Angebot.')+'</p></section>';
 return '<section class="section dh-intent"><h2>'+(sr?'Kako auto-kuća nudi automobil kupcima u Srbiji?':'Fahrzeugangebot für Käufer aus Serbien')+'</h2><p>'+(sr?'Pošaljite oglas, lokaciju vozila, cenu, dokumentaciju i izvozne uslove. Pristup kupcima zavisi od stvarnih zahteva i saglasnosti; nema lažnih aukcija niti garantovane prodaje.':'Senden Sie Link, Standort, Preis, Dokumente und Exportbedingungen. Kontakte beruhen auf echten Anfragen mit Einwilligung; keine erfundenen Gebote oder garantierte Verkäufe.')+'</p></section>';
}
function page(lang,section){const d=data[lang];if(!d||!d[section])return '';
 const info=d[section],kind=section==='buyer'?'BUYER_REQUEST':section==='seller'?'SELLER_OFFER':'PLOT_LEASE_INQUIRY';
 const nav='<div class="dh-shortcuts">'+['buyer','seller','land'].map((key,i)=>'<a href="/'+lang+'/'+(key==='buyer'?(lang==='sr'?'trazim-auto':'fahrzeug-gesucht'):key==='seller'?(lang==='sr'?'ponudi-auto':'fahrzeug-anbieten'):(lang==='sr'?'placevi-nis':'gewerbeflaechen-nis'))+'">'+esc(d.nav[i])+'</a>').join('')+'</div>';
 const form='<form class="dh-lead-form" data-dh-lead="'+kind+'" data-lang="'+lang+'"><p class="muted">'+esc(d.required)+'</p>'+info.fields.map(field).join('')+'<button class="btn" type="submit">'+esc(info.button)+'</button><p class="muted" role="note">'+esc(d.privacy)+'</p></form>';
 const plot=section==='land'?'<div class="dh-plots"><article class="card"><h2>'+(lang==='sr'?'Manji plac':'Kleinere Fläche')+'</h2><strong>≈ 345 m²</strong><p>'+(lang==='sr'?'Samostalni zakup ili zajedno. Površinu i mogućnost korišćenja potvrditi.':'Einzeln oder gemeinsam anmietbar; Maße und Nutzung vorbehaltlich Prüfung.')+'</p></article><article class="card"><h2>'+(lang==='sr'?'Veći plac':'Größere Fläche')+'</h2><strong>≈ 648 m²</strong><p>'+(lang==='sr'?'Pogodan za razgovor o komercijalnom zakupu; teren se izdaje po dogovoru o potrebnom uređenju.':'Mögliche gewerbliche Anmietung; Herrichtung nach Vereinbarung.')+'</p></article></div>':'';
 const step=section==='buyer'?(lang==='sr'?'Posle prijema: proveravamo uslove, kontaktiramo dostupne trgovce samo uz dogovor, pa ti šaljemo stvarne ponude ako ih ima.':'Danach klären wir den Bedarf und fragen Händler nur nach Absprache an. Es werden ausschließlich tatsächlich erhaltene Angebote weitergegeben.'):(section==='seller'?(lang==='sr'?'Proveravamo podatke i kontaktiramo zainteresovanog kupca samo uz njegov pristanak.':'Wir prüfen Angaben und kontaktieren Käufer nur mit deren Einwilligung.'):(lang==='sr'?'Zakazujemo obilazak i šaljemo individualnu ponudu nakon potvrde uslova.':'Besichtigung und individuelles Angebot nach Klärung der Bedingungen.'));
 return nav+'<section class="section dh-product"><p class="eyebrow">DANINIHUB · '+(section==='land'?'ČALIJE / NIŠ':'AUTO MATCH')+'</p><h1>'+esc(info.title)+'</h1><p class="lead">'+esc(info.lead)+'</p>'+plot+'<div class="dh-layout"><div><h2>'+esc(info.titleForm)+'</h2>'+form+'</div><aside class="card"><h2>'+(lang==='sr'?'Šta se dešava posle upita?':'Wie geht es weiter?')+'</h2><p>'+esc(step)+'</p><p>'+esc(info.process)+'</p><h3>'+esc(d.contact)+'</h3><p><a class="btn secondary" href="https://wa.me/'+whatsapp+'" target="_blank" rel="noopener noreferrer">'+esc(d.button)+'</a></p><p><a href="mailto:info@daninihub.com">'+esc(d.alt)+': info@daninihub.com</a></p></aside></div></section>'+seoExplainer(lang,section)+client;
}
const client=`<script>(function(){'use strict';
document.querySelectorAll('form[data-dh-lead]').forEach(function(form){
 form.addEventListener('submit',function(e){
 e.preventDefault();
 if(!form.reportValidity())return;
 var parts=[form.getAttribute('data-dh-lead')==='BUYER_REQUEST'?'AUTO BUYER / KUPAC':form.getAttribute('data-dh-lead')==='SELLER_OFFER'?'AUTO SELLER / PRODAVAC':'LAND LEASE / ZAKUP PLACEVA'];
 new FormData(form).forEach(function(value,key){if(String(value).trim())parts.push(key+': '+String(value).trim().slice(0,1200))});
 parts.push('Origin: daninihub.com/'+form.getAttribute('data-lang'));
 if(window.dataLayer && Array.isArray(window.dataLayer))window.dataLayer.push({event:'danini_whatsapp_open',lead_type:form.getAttribute('data-dh-lead'),lead_lang:form.getAttribute('data-lang')});
 var link='https://wa.me/4915730916621?text='+encodeURIComponent(parts.join('\\n'));
 window.location.href=link;
 });
});
})()</script>`;
const styles='.dh-shortcuts{display:flex;flex-wrap:wrap;gap:12px;margin:24px 0}.dh-shortcuts a{border:1px solid #bed4cb;padding:9px 14px;background:white;color:#126c6b;border-radius:8px;text-decoration:none;font-weight:700}.dh-product{padding-top:25px}.dh-product h1{font-size:clamp(36px,5vw,58px);line-height:1.1}.dh-layout{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(240px,.75fr);align-items:start;gap:22px;margin-top:35px}.dh-lead-form{display:grid;grid-template-columns:1fr;gap:14px;background:white;border:1px solid #dce5e2;border-radius:14px;padding:23px}.dh-lead-form label{font-weight:700;display:grid;gap:7px}.dh-lead-form input,.dh-lead-form select,.dh-lead-form textarea{min-width:0;max-width:100%;width:100%;background:#fff!important;color:#112b3a!important;border:1px solid #b6c8c6;border-radius:7px;padding:13px;font:inherit}.dh-lead-form button{width:100%;border:0;cursor:pointer;padding:15px}.dh-plots{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px;margin:30px 0}.dh-plots strong{font-size:32px;color:#126c6b}.dh-product aside{position:sticky;top:100px}@media(max-width:750px){.dh-layout{grid-template-columns:1fr}.dh-plots{grid-template-columns:1fr}.dh-product aside{position:static}.dh-lead-form{padding:16px}}';
module.exports={page,styles,data};
