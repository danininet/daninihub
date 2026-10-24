'use strict';
// DANINI SR/DE storefront. Paid PDF is intentionally NOT a public asset:
// PayPal.Me does not confirm payment to this application or unlock a download.
const WA='https://wa.me/4915730916621?text=';
const PAY='https://www.paypal.me/dragangaganet/';
const routeMap={sr:'/sr/auto-biznis-vodic-i-softver',de:'/de/auto-business-guide-software'};
const routeMeta={
  [routeMap.sr]:{lang:'sr',key:'store',title:'Auto-Biznis Master Vodič i softverski paket | DANINI',description:'PDF vodič 49 €, softverski paket 149 € sa GRATIS vodičem, MwSt asistencija i B2B plac u Nišu.'},
  [routeMap.de]:{lang:'de',key:'store',title:'Auto-Business Master-Guide und Softwarepaket | DANINI',description:'PDF-Guide 49 €, Softwarepaket 149 € inklusive kostenlosem Guide, MwSt.-Assistenz und Gewerbeflächen in Niš.'}
};
const srProducts=[
['passport','Import Passport — provera oglasa i poziv prodavcu','9,90 €','9.90EUR','Poziv nemačkom prodavcu, uslovi ugovora i raspoloživa dokumentacija.'],
['oe','OE servisni plan i originalni delovi po VIN-u','19,00 €','19EUR','Plan malog/velikog servisa i provera kompatibilnih OE brojeva.'],
['combo','Combo paket: Sve pre kupovine','29,90 €','29.90EUR','Import Passport + OE plan i kontrolna lista za rutu.'],
['vat','MwSt / ABD / MRN asistencija za izvoz','49,00 €','49EUR','Provera iskazivog PDV-a, izvozne dokumentacije i komunikacija s dilerom.'],
['guide','DANINI Auto-Biznis Master Vodič (PDF)','49,00 €','49EUR','10 strana sa dijagramima, ček-listama i šest operativnih poglavlja.'],
['transport','Koordinacija transporta ili dovoza na točkovima','59,00 €','59EUR','Koordinacija, bez cene samog prevoza, osiguranja i taksi.'],
['field','Field Check — fizički pregled NRW','od 79,00 €',null,'Obim, kilometraža i termin po individualnoj potvrdi.'],
['b2b','B2B Sourcing — do 3 vozila','99,00 €','99EUR','Pretraga do tri kandidata na osnovu specifikacije firme.'],
['software','DANINI Softverski Paket + PDF GRATIS','149,00 €','149EUR','Skener oglasa, kalkulator uvoznih troškova, PDF dosije i besplatan Master Vodič.']
];
const deProducts=[
['passport','Import Passport — Anzeige & Verkäuferanruf','9,90 €','9.90EUR','Verkäuferkontakt und Prüfung vorhandener Vertrags- und Fahrzeugdaten.'],
['oe','OE-Serviceplan & Originalteile nach VIN','19,00 €','19EUR','Wartungsplan und Abgleich relevanter OE-Teilenummern.'],
['combo','Kombi: Alles vor dem Kauf','29,90 €','29.90EUR','Import Passport, OE-Plan und Routen-Checkliste.'],
['vat','MwSt.- / ABD- / MRN-Assistenz','49,00 €','49EUR','MwSt.-Status und Exportnachweis prüfen, Kommunikation mit dem Händler.'],
['guide','DANINI Auto-Business Master-Guide (PDF)','49,00 €','49EUR','10 Seiten mit Diagrammen, Checklisten und sechs Kapiteln.'],
['transport','Transport- oder Fahrerüberführung koordinieren','59,00 €','59EUR','Koordinationsgebühr ohne Fracht, Versicherung und Gebühren.'],
['field','Field Check — Besichtigung in NRW','ab 79,00 €',null,'Umfang, Anfahrt und Termin nach Vereinbarung.'],
['b2b','B2B Sourcing — bis zu 3 Fahrzeuge','99,00 €','99EUR','Bis zu drei passende Kandidaten nach Unternehmensvorgaben.'],
['software','DANINI Softwarepaket + PDF GRATIS','149,00 €','149EUR','Inserat-Scanner, Importkostenrechner, PDF-Dossier und kostenloser Master-Guide.']
];
const chapters={
sr:[
['01','Ekonomika uvoza','Uporedni primer 5.871 € razlike pri različitim pretpostavkama; nije obećana ušteda.'],
['02','19% MwSt, ABD/MRN i EUR.1','Izvozna kaucija, potvrda izlaza i pravilo 6.000 € za izjavu o poreklu.'],
['03','Sedam pitanja prodavcu na nemačkom','Pravni izrazi, ugovor, VIN, istorija i rizici „im Kundenauftrag“.'],
['04','Tri modela dovoza i pomoć na putu','Samostalno na točkovima, vozač po dogovoru ili šleper; osiguranje i ruta.'],
['05','„Gepek strategija“ za OE delove','VIN, delovi i plan servisa pre prve prodaje ili korišćenja vozila.'],
['06','B2B Čalije, Niš','Mogućnosti komercijalnog zakupa 345 m² i 648 m², uz proveru namene.']
],
de:[
['01','Importökonomie','Rechenbeispiel mit 5.871 € Unterschied unter Annahmen – keine garantierte Ersparnis.'],
['02','19% MwSt., ABD/MRN und EUR.1','Exportkaution, Ausgangsnachweis und 6.000-€-Grenze für Ursprungserklärungen.'],
['03','Sieben Verkäuferfragen auf Deutsch','Vertrag, VIN, Fahrzeughistorie und „im Kundenauftrag“-Risiken.'],
['04','Drei Transportarten und Pannenhilfe','Selbstüberführung, Fahrerauftrag oder Autotransporter; Route und Absicherung.'],
['05','OE-Teile im Kofferraum','VIN-Teileabgleich und Wartungsplan vor Nutzung oder Weiterverkauf.'],
['06','B2B-Standort Niš Čalije','Gewerbeflächen von ca. 345 m² und 648 m² mit Nutzungsprüfung.']
]};
function safe(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function whatsapp(lang,sku){return WA+encodeURIComponent((lang==='sr'?'Želim ponudu/narudžbinu DANINI: ':'DANINI Anfrage/Bestellung: ')+sku+'. '+(lang==='sr'?'Molim potvrdu sadržaja, dostupnosti, roka i načina isporuke pre uplate.':'Bitte Umfang, Verfügbarkeit, Liefertermin und Übergabe vor Zahlung bestätigen.'));}
function pay(code){return PAY+code;}
function pricing(lang){
const sr=lang==='sr',rows=sr?srProducts:deProducts;
return '<div class="danini-price-scroll"><table class="danini-prices"><caption>'+ (sr?'Sve 9 opcija — EUR, po potvrđenoj narudžbini':'Alle 9 Leistungen — EUR, nach Auftragsbestätigung')+'</caption><thead><tr><th>#</th><th>'+(sr?'Usluga / proizvod':'Leistung / Produkt')+'</th><th>'+(sr?'Cena':'Preis')+'</th><th>'+(sr?'Naručivanje':'Anfrage')+'</th></tr></thead><tbody>'+
rows.map((r,i)=>'<tr><td>'+(i+1)+'</td><td><strong>'+safe(r[1])+'</strong><small>'+safe(r[4])+'</small></td><td><strong>'+r[2]+'</strong></td><td><a href="'+whatsapp(lang,r[1])+'" target="_blank" rel="noopener noreferrer">'+(sr?'WhatsApp':'Anfragen')+'</a>'+(r[3]?' · '+(['guide','software'].includes(r[0])?'<a href="#danini-checkout-'+r[0]+'">'+(sr?'Bezbedno naruči':'Sicher bestellen')+'</a>':'<a href="'+pay(r[3])+'" target="_blank" rel="noopener noreferrer">PayPal</a>'):'')+'</td></tr>').join('')+'</tbody></table></div>';
}
function products(lang){
  const sr=lang==='sr',catalog=sr?srProducts:deProducts;
  function block(sku){
    const r=catalog.find(x=>x[0]===sku);
    return '<article class="card danini-product" id="danini-checkout-'+sku+'">'+
      '<span class="eyebrow">'+(sku==='software'?'B2B / PRO':'PDF / DIGITAL')+'</span>'+
      '<h3>'+safe(r[1])+'</h3><div class="price">'+r[2]+'</div><p>'+safe(r[4])+'</p>'+
      (sku==='software'?'<p class="danini-bonus">'+(sr?'🎁 Master Vodič od 49,00 € — GRATIS (0 €) uz softver':'🎁 Master-Guide im Wert von 49,00 € — GRATIS (0 €) zum Softwarepaket')+'</p>':'')+
      '<p><a class="btn secondary" href="'+whatsapp(lang,r[1])+'" target="_blank" rel="noopener noreferrer">'+(sr?'Pitanje putem WhatsApp-a':'Frage per WhatsApp')+'</a></p>'+
      '<form class="danini-digital-checkout" data-sku="'+sku+'">'+
      '<label>'+(sr?'E-mail kupca za isporuku':'E-Mail-Adresse für die Lieferung')+
      '<input name="email" type="email" required maxlength="191" autocomplete="email" placeholder="ime@example.com"></label>'+
      '<label class="danini-legal-checkbox"><input type="checkbox" name="termsAccepted" required> '+(sr?'Prihvatam <a href="/sr/uslovi">uslove kupovine</a> i <a href="/sr/privatnost">obradu podataka</a>.':'Ich akzeptiere die <a href="/de/bedingungen">Nutzungsbedingungen</a> und <a href="/de/datenschutz">Datenschutzhinweise</a>.')+'</label>'+
      '<label class="danini-legal-checkbox"><input type="checkbox" name="instantDeliveryConsent" required> '+(sr?'Saglasan/a sam da digitalni vodič bude isporučen odmah nakon uplate i upoznat/a sam sa primenjivim pravilima odustanka.':'Ich stimme der unmittelbaren Bereitstellung des Guides nach Zahlung zu und habe die geltenden Widerrufsregelungen zur Kenntnis genommen.')+'</label>'+
      '<button class="btn danini-digital-buy" type="submit" disabled>'+(sr?'Plati sigurno putem PayPal-a':'Sicher per PayPal zahlen')+' · '+r[2]+'</button>'+
      '<p class="danini-digital-status" role="status" aria-live="polite">'+(sr?'Provera dostupnosti automatske kupovine…':'Prüfe Verfügbarkeit…')+'</p>'+
      '</form></article>';
  }
  return '<div class="danini-product-grid">'+block('guide')+block('software')+'</div>';
}
function storeSections(lang){
const sr=lang==='sr';
return '<section class="section danini-store" id="auto-biznis-paket"><p class="eyebrow">DANINI · BUSINESS TOOLS · 2026</p><h2>'+(sr?'PREUZMI AUTO-BIZNIS MASTER VODIČ & SOFTVERSKI PAKET':'AUTO-BUSINESS MASTER-GUIDE & SOFTWAREPAKET')+'</h2><p class="lead">'+(sr?'Pokreni auto-biznis ili automatizuj postojeći auto-plac — PDF od 10 strana sa dijagramima, ček-listama i praktičnim primerima.':'Auto-Business starten oder bestehenden Autohandel organisieren – 10-seitiger PDF-Guide mit Diagrammen, Checklisten und Praxisbeispielen.')+'</p>'+products(lang)+
'<p class="muted">'+(sr?'PDF se automatski otključava samo nakon potvrđene uplate kroz bezbedan PayPal checkout kada je sistem aktiviran. Kupcima softverskog paketa Master Vodič stiže gratis; aktivacija i obim softvera potvrđuju se posebno pre kupovine.':'Nach bestätigter Zahlung im sicheren PayPal-Checkout wird der PDF-Guide automatisch freigeschaltet, sobald das System aktiv ist. Beim Softwarepaket ist der Guide kostenlos; Software-Zugang, Umfang und Liefertermin werden separat vereinbart.')+'</p></section>'+
'<section class="section danini-store"><h2>'+(sr?'Šest poglavlja Master Vodiča':'Die sechs Kapitel im Master-Guide')+'</h2><div class="grid">'+chapters[lang].map(c=>'<article class="card"><span class="eyebrow">'+c[0]+'</span><h3>'+c[1]+'</h3><p>'+c[2]+'</p></article>').join('')+'</div><p class="muted">'+(sr?'Primer uštede od 5.871 € odnosi se samo na pretpostavke prikazane u vodiču i nije tipičan niti garantovan rezultat. Iznosi dažbina i pravila proveravaju se za svako vozilo.':'Das Beispiel mit 5.871 € Differenz gilt nur für die im Guide gewählten Annahmen. Kein typisches oder garantiertes Ergebnis; Abgaben sind für jedes Fahrzeug gesondert zu prüfen.')+'</p></section>'+
'<section class="section danini-store" id="mwst"><p class="eyebrow">DANINI · 49,00 €</p><h2>'+(sr?'Asistencija za nemački PDV — MwSt. ausweisbar, ABD i MRN':'Ausfuhr-MwSt.-Assistenz — MwSt. ausweisbar, ABD und MRN')+'</h2><p class="lead">'+(sr?'Kupujete od nemačke auto-kuće sa posebno iskazanim PDV-om (ne §25a)? Pre uplate proveravamo ugovor o MwSt.-Kaution, dostupnost elektronske izvozne deklaracije ABD sa MRN brojem, potvrdu izlaza iz EU (ATLAS Ausgangsvermerk) i komunikaciju sa knjigovodstvom dilera radi eventualnog vraćanja ugovorene kaucije.':'Kauf beim Händler mit gesondert ausgewiesener Umsatzsteuer (nicht §25a)? Wir prüfen vorab MwSt.-Kaution, ABD mit MRN, elektronischen Ausgangsvermerk und unterstützen bei der Kommunikation mit der Händlerbuchhaltung wegen einer vertraglich vereinbarten Rückzahlung.')+'</p><p class="muted">'+(sr?'DANINI pruža administrativnu koordinaciju, ne izdaje ABD niti odlučuje o poreskom tretmanu. Izvozne formalnosti obavlja ovlašćeni deklarant. Povrat zavisi od fakture, statusa kupca, dokaza izvoza i prodavca; nije garantovan. Kod bruto cene sa PDV-om od 19%, poreski deo iznosi 19/119 bruto cene, a ne 19% bruto cene.':'DANINI koordiniert administrativ, stellt kein ABD aus und erteilt keine steuerliche Zusage. Die Anmeldung erfolgt durch den zuständigen Anmelder. Eine Erstattung hängt von Rechnung, Erwerberstatus, Ausfuhrnachweis und Händlervereinbarung ab; kein Erfolgsversprechen. Bei 19% MwSt im Bruttopreis beträgt der Steueranteil 19/119 des Bruttopreises.')+'</p><p><a class="btn" href="'+whatsapp(lang,srProducts[3][1])+'" target="_blank" rel="noopener noreferrer">'+(sr?'Zatraži MwSt asistenciju':'MwSt.-Assistenz anfragen')+'</a> <a class="btn secondary" href="'+pay('49EUR')+'" target="_blank" rel="noopener noreferrer">PayPal · 49,00 €</a></p><p class="muted">'+(sr?'Pošto PDF vodič i MwSt asistencija koštaju po 49 €, OBAVEZNO navedite naziv proizvoda u WhatsApp poruci da bismo pravilno povezali uplatu.':'Da Guide und MwSt.-Assistenz jeweils 49 € kosten, bitte die Leistung in der WhatsApp-Nachricht nennen, damit wir die Zahlung richtig zuordnen.')+'</p></section>'+
'<section class="section danini-store"><h2>'+(sr?'Kompletan cenovnik — 9 opcija':'Vollständige Preisliste — 9 Optionen')+'</h2>'+pricing(lang)+'</section>'+
'<section class="section danini-store" id="nis-calije"><p class="eyebrow">DANINI · B2B · NIŠ</p><h2>'+(sr?'Auto-plac / flotni parking / showroom — Čalije, GO Pantelej':'Autohandel / Flottenparkplatz / Showroom — Niš Čalije')+'</h2><p class="lead">'+(sr?'Dve odvojene radne površine za komercijalni zakup: približno 345 m² (orijentaciono do 12 vozila) i 648 m² (orijentaciono do 25 vozila). Ukupno 993 m² i okvirno do 37 vozila, u zavisnosti od rasporeda i pristupa.':'Zwei separate gewerbliche Nutzflächen: ca. 345 m² (rechnerisch bis zu 12 Fahrzeuge) und 648 m² (bis zu 25 Fahrzeuge). Zusammen 993 m² und orientierend bis zu 37 Fahrzeuge, abhängig von Zufahrt und Stellplatzplanung.')+'</p><p class="muted">'+(sr?'Kapacitet je preliminarna procena, ne odobrena urbanistička namena niti garantovan broj parking mesta. Dozvoljena upotreba, stanje zemljišta, pristup i uslovi ugovora proveravaju se pre zakupa.':'Die Kapazität ist eine unverbindliche Schätzung, keine genehmigte Nutzung oder zugesicherte Stellplatzzahl. Zulässigkeit, Flächenzustand, Zufahrt und Vertragsbedingungen vor Anmietung prüfen.')+'</p><p><a class="btn" href="'+whatsapp(lang,sr?'B2B zakup Čalije 345/648 m²':'Gewerbemiete Niš Čalije 345/648 m²')+'" target="_blank" rel="noopener noreferrer">'+(sr?'Kontakt za zakup · WhatsApp':'Mietanfrage · WhatsApp')+'</a></p></section>';
}
function home(lang){return '<section class="section danini-store-teaser"><p class="eyebrow">DANINI · MASTER GUIDE + BUSINESS SOFTWARE</p><h2>'+(lang==='sr'?'Pokreni auto-biznis ili unapredi auto-plac':'Auto-Business starten oder Autohandel verbessern')+'</h2><p class="lead">'+(lang==='sr'?'PDF vodič 49 € · softverski paket 149 € sa GRATIS vodičem · MwSt asistencija 49 €.':'PDF-Guide 49 € · Softwarepaket 149 € inklusive GRATIS-Guide · MwSt.-Assistenz 49 €.')+'</p><p><a class="btn" href="'+routeMap[lang]+'">'+(lang==='sr'?'Pogledaj vodič, softver i svih 9 paketa':'Guide, Software und alle 9 Preise ansehen')+' →</a></p></section>';}
function render(lang){return '<section class="hero"><div><p class="eyebrow">DANINI BUSINESS · SR / DE</p><h1>'+(lang==='sr'?'Auto-Biznis Master Vodič & Softverski Paket':'Auto-Business Master-Guide & Softwarepaket')+'</h1><p class="lead">'+(lang==='sr'?'Proveri oglas, troškove i dokumentaciju. Izaberi digitalni vodič ili poslovni softverski paket uz besplatan vodič.':'Inserate, Kosten und Dokumente prüfen. PDF-Guide einzeln oder im Softwarepaket kostenlos erhalten.')+'</p><a class="btn" href="#auto-biznis-paket">'+(lang==='sr'?'Vidi ponude':'Angebote ansehen')+'</a></div><figure class="hero-visual"><img src="/images/DANINI_Kartica_02_Uvoz_Dokumentacija_EUR1.jpg" alt="DANINI Auto Business" width="1376" height="768" loading="eager"></figure></section>'+storeSections(lang);}
module.exports={routeMeta,routeMap,pricing,home,render,products};
