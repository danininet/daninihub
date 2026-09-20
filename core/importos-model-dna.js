'use strict';

const MODEL_DNA = {
  'mercedes-w204-petrol': {
    key:'mercedes-w204-petrol',
    label:'Mercedes-Benz C-Klasse W204 · Benziner · 2007–2015',
    family:'Mercedes C-Klasse W204',
    sourceQuality:'A/B',
    strengths:[
      'ADAC beschreibt gute Verarbeitung, hohen Federungskomfort, gute Geräuschdämmung, bequeme Sitze und hohes Sicherheitsniveau.',
      'Facelift ab 2011 erhielt technische und qualitative Überarbeitungen; spätere Baujahre schneiden in der ADAC-Pannenstatistik deutlich besser ab als frühe Jahre.'
    ],
    watch:[
      'Frühe Baujahre 2007–2010 zeigen in der ADAC-Pannenstatistik deutlich höhere Pannenkennziffern als 2011–2015.',
      'Bei Kaufentscheidung Baujahr, Motorvariante und Wartungsnachweise getrennt prüfen; Modellname allein reicht nicht.'
    ],
    timeline:[
      {period:'2007–2010',signal:'higher-risk',note:'ADAC-Pannenkennziffer deutlich höher als bei späteren W204-Jahren.'},
      {period:'2011–2013',signal:'improving',note:'Facelift/Überarbeitung; Pannenkennziffer sinkt deutlich.'},
      {period:'2014–2015',signal:'stronger',note:'Späte Baujahre schneiden in der ADAC-Statistik deutlich besser ab.'}
    ],
    evidence:[
      {grade:'A',title:'ADAC Gebrauchtwageninformation W204 Benziner',url:'https://assets.adac.de/Autodatenbank/GWInfo/gw0161-mercedes-benz-c-klasse-2007-2015-benziner-bericht.pdf',verifiedAt:'2026-09-20'}
    ]
  },
  'bmw-f10-petrol': {
    key:'bmw-f10-petrol',
    label:'BMW 5er F10/F11 · Benziner · 2010–2017',
    family:'BMW 5er F10/F11',
    sourceQuality:'A/B',
    strengths:[
      'ADAC bewertet die Zuverlässigkeit der Baureihe überdurchschnittlich und nennt gute Ergebnisse bei Hauptuntersuchungen.',
      'Hochwertige Verarbeitung, viel Platz, hoher Langstreckenkomfort und gute Sitze werden als klare Stärken genannt.'
    ],
    watch:[
      'ADAC nennt ausgeschlagene vordere Achsgelenke als wiederkehrenden Schwachpunkt.',
      'Motorbezeichnung ist nicht immer gleichbedeutend mit identischem Motor; genaue Motorvariante muss vor Kauf identifiziert werden.'
    ],
    timeline:[
      {period:'Baureihe',signal:'solid',note:'Baureihe insgesamt überdurchschnittlich in ADAC-Pannenstatistik.'},
      {period:'mit Alter/Laufleistung',signal:'inspect',note:'Vorderachsgelenke gezielt prüfen; genaue Motorisierung identifizieren.'}
    ],
    evidence:[
      {grade:'A',title:'ADAC Gebrauchtwageninformation BMW 5er 2010–2017 Benziner',url:'https://assets.adac.de/Autodatenbank/GWInfo/gw0127-bmw-5er-reihe-2010-2017-benziner-bericht.pdf',verifiedAt:'2026-09-20'}
    ]
  },
  'audi-a4-b8-petrol': {
    key:'audi-a4-b8-petrol',
    label:'Audi A4 B8 · Benziner · 2007–2015',
    family:'Audi A4 B8',
    sourceQuality:'A/B',
    strengths:[
      'ADAC beschreibt eine sehr geringe Pannenkennziffer und überdurchschnittlich gute Hauptuntersuchungs-Ergebnisse.',
      'Trotz hoher typischer Laufleistungen werden im ADAC-Bericht keine Baugruppen mit gehäuften HU-Mängeln hervorgehoben.'
    ],
    watch:[
      'Rückrufhistorie muss motor- und baujahrbezogen geprüft werden; im ADAC-Bericht sind u. a. Aktionen für 2.0 TFSI, 3.0 TFSI und Airbagsteuergerät dokumentiert.',
      'Ein guter Modellruf ersetzt keine Prüfung des konkreten Fahrzeugs und der erledigten Rückrufe.'
    ],
    timeline:[
      {period:'Baureihe',signal:'strong',note:'ADAC weist auf sehr niedrige Pannenkennziffer und gute HU-Ergebnisse hin.'},
      {period:'vor Kauf',signal:'verify',note:'Rückruf-/Aktionsstatus anhand VIN und Motorvariante prüfen.'}
    ],
    evidence:[
      {grade:'A',title:'ADAC Gebrauchtwageninformation Audi A4 2007–2015 Benziner',url:'https://assets.adac.de/image/upload/w_120/Autodatenbank/GWInfo/gw0156-audi-a4-2007-2015-benziner-bericht.pdf',verifiedAt:'2026-09-20'}
    ]
  },
  'vw-golf-vii': {
    key:'vw-golf-vii',
    label:'Volkswagen Golf VII · 2012–2020',
    family:'Volkswagen Golf VII',
    sourceQuality:'A/B',
    strengths:[
      'ADAC nennt für den Golf VII gute Ergebnisse in der Pannenstatistik und nur wenige generelle Schwächen.',
      'Gutes Platzangebot, solide Verarbeitung, einfaches Bedienkonzept und gute Ersatzteilversorgung durch hohe Verbreitung.'
    ],
    watch:[
      'Motor- und Getriebevarianten müssen separat bewertet werden; die Baureihe allein ist keine ausreichende Kaufentscheidung.',
      'Bei hoher Laufleistung Verschleißteile, Wartung und Plausibilität der Kilometerhistorie priorisieren.'
    ],
    timeline:[
      {period:'Baureihe',signal:'strong',note:'ADAC bewertet den Golf VII allgemein als zuverlässige und praktische Gebrauchtwagenbasis.'},
      {period:'hohe Laufleistung',signal:'inspect',note:'Verschleiß und dokumentierte Wartung werden kaufentscheidend.'}
    ],
    evidence:[
      {grade:'A',title:'ADAC Gebrauchtwagen-/Panneninformationen Golf VII',url:'https://www.adac.de/rund-ums-fahrzeug/auto-kaufen-verkaufen/kauftipps/beste-autos-fahranfaenger/',verifiedAt:'2026-09-20'}
    ]
  }
};

function listModelDna(){ return Object.values(MODEL_DNA); }
function getModelDna(key){ return MODEL_DNA[String(key||'').trim()] || null; }

module.exports={MODEL_DNA,listModelDna,getModelDna};
