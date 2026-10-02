'use strict';

function body(lang){
  const sr=lang==='sr';
  const field=(i,name,label,type='number',extra='')=>`<label>${label}<input name="${name}${i}" type="${type}" ${type==='number'?'min="0" step="any"':type==='url'?'maxlength="500"':'maxlength="120"'} ${extra}></label>`;
  const candidates=[0,1,2].map(i=>`<details class="card" ${i===0?'open':''}><summary>${sr?'Oglas':'Inserat'} ${i+1}</summary><div class="form" style="margin-top:16px">
    ${field(i,'label',sr?'Marka i model':'Marke und Modell','text',i===0?'required':'')}
    ${field(i,'link',sr?'Link oglasa (opciono)':'Inseratlink (optional)','url')}
    ${field(i,'price',sr?'Cena auta (€)':'Kaufpreis (€)','number',i===0?'required':'')}
    ${field(i,'transport',sr?'Dovoz do Srbije (€)':'Transport nach Serbien (€)')}
    ${field(i,'export',sr?'Izvoz i tablice (€)':'Export und Kennzeichen (€)')}
    ${field(i,'local',sr?'Špedicija, kontrolisanje i registracija (€)':'Abwicklung, Prüfung und Zulassung (€)')}
    ${field(i,'year',sr?'Godište':'Baujahr','number')}
    ${field(i,'euro',sr?'Euro norma (0 ako ne znaš)':'Euro-Norm (0 falls unbekannt)','number')}
    <label>${sr?'Dokaz o poreklu':'Ursprungsnachweis'}<select name="origin${i}"><option value="unknown">${sr?'Nije potvrđen':'Nicht bestätigt'}</option><option value="verified">${sr?'Potvrđen':'Bestätigt'}</option><option value="missing">${sr?'Nedostaje':'Fehlt'}</option></select></label>
    <label>${sr?'Prodavac':'Verkäufer'}<select name="sellerType${i}"><option value="dealer">${sr?'Auto-kuća / Händler':'Händler'}</option><option value="private">${sr?'Privatno lice':'Privat'}</option><option value="unknown">${sr?'Nisam siguran':'Unklar'}</option></select></label>
    <label>${sr?'Kapara koju traži (€)':'Geforderte Anzahlung (€)'}<input name="deposit${i}" type="number" min="0" step="any" value="0"></label>
    <label>${sr?'Servisna istorija':'Servicehistorie'}<select name="serviceHistory${i}"><option value="unknown">${sr?'Nepoznata':'Unbekannt'}</option><option value="partial">${sr?'Delimična':'Teilweise'}</option><option value="complete">${sr?'Potpuna i proverljiva':'Vollständig und prüfbar'}</option></select></label>
    <label class="check"><input type="checkbox" name="vin${i}">${sr?'VIN dostavljen':'VIN vorhanden'}</label>
    <label class="check"><input type="checkbox" name="registration${i}">${sr?'Saobraćajna dostupna':'Zulassungsunterlagen vorhanden'}</label>
    <label class="check"><input type="checkbox" name="ownership${i}">${sr?'Dokaz vlasništva dostupan':'Eigentumsnachweis vorhanden'}</label>
    <label class="check"><input type="checkbox" name="sellerIdentity${i}">${sr?'Identitet prodavca potvrđen':'Verkäuferidentität bestätigt'}</label>
    <label class="check"><input type="checkbox" name="bankOwnerMatch${i}">${sr?'Račun za uplatu glasi na prodavca/vlasnika':'Zahlungskonto passt zu Verkäufer/Eigentümer'}</label>
    <label class="check"><input type="checkbox" name="accidentDisclosure${i}">${sr?'Pisano potvrđena poznata oštećenja/nezgode':'Bekannte Schäden schriftlich bestätigt'}</label>
  </div></details>`).join('');
  return `<section class="section"><p class="eyebrow">${sr?'PRE KAPARE · PRE PUTA':'VOR ANZAHLUNG · VOR ANREISE'}</p><h1>DANINI Buyer Shield</h1><p class="lead">${sr?'Nalepi do tri oglasa. Sistem pokušava da pronađe razlog da NE pošalješ kaparu dok nema dovoljno dokaza: prodavac, VIN, dokumenta, poreklo, servisna istorija i realan trošak do Srbije.':'Füge bis zu drei Inserate hinzu. Das System sucht aktiv nach Gründen, KEINE Anzahlung zu senden, bis Verkäufer, VIN, Dokumente, Ursprung, Servicehistorie und reale Importkosten ausreichend belegt sind.'}</p>
  <form id="buyer-plan"><div class="form">${field('','budget',sr?'Ukupan budžet do registracije (€)':'Gesamtbudget bis Zulassung (€)','number','required')}${field('','reserve',sr?'Rezerva za servis i nepredviđeno (€)':'Reserve für Service und Unvorhergesehenes (€)','number','required')}<p class="muted wide">${sr?'Buyer Shield ne nagrađuje optimizam. Sve što nije dokazano ostaje otvoren rizik.':'Buyer Shield belohnt keinen Optimismus. Alles Unbelegte bleibt ein offenes Risiko.'}</p></div><div style="display:grid;gap:16px;margin:20px 0">${candidates}</div><button class="btn" type="submit">${sr?'Pokreni Buyer Shield':'Buyer Shield starten'}</button></form>
  <div id="buyer-result" aria-live="polite"></div>
  <p class="muted">${sr?'Buyer Shield nije garancija stanja vozila niti zamena za fizički pregled. Njegova svrha je da pre kapare otkrije nedokazane tvrdnje, nedostajuća dokumenta i finansijske rizike koje treba zatvoriti pre puta ili uplate.':'Buyer Shield garantiert keinen Fahrzeugzustand und ersetzt keine Besichtigung. Er soll vor Anzahlung unbelegte Angaben, fehlende Dokumente und finanzielle Risiken sichtbar machen.'}</p></section>
  <section class="section"><h2>${sr?'Ako auto prođe digitalni štit':'Wenn das Auto den digitalen Shield besteht'}</h2><p class="lead">${sr?'Tek tada ima smisla platiti dublju proveru: kontakt sa prodavcem, proveru dokaza, pregled na licu mesta ili organizaciju dovoza.':'Erst dann lohnt sich der nächste Schritt: Verkäuferkontakt, Belegprüfung, Vor-Ort-Check oder Transport.'}</p><a class="btn secondary" href="/${lang}/${sr?'upit':'anfrage'}?service=AD_REVIEW">${sr?'Pošalji ovaj auto na dublju proveru':'Dieses Auto tiefer prüfen lassen'}</a></section>`;
}
module.exports={body};
