import './BeforeAfterPage.css'

const content={
 de:{
  kicker:'VOR DANINIHUB / NACH DANINIHUB',
  title:'Aus einer unklaren Information wird ein arbeitsfähiger Vorgang.',
  lead:'DaniniHub macht operative Informationen für beide Unternehmen prüfbar: Was ist bestätigt, was fehlt, wer entscheidet und wann wird erneut geprüft?',
  scenarioA:'Szenario 1 · Status und ETA',
  beforeA:'„Stau Budapest. ETA unklar. Kunde wartet.“',
  beforeLabel:'Vor DaniniHub',afterLabel:'Nach DaniniHub',
  afterA:['Bestätigt: Fahrer meldete Stau um 14:52.','Nicht bestätigt: genaue Position und verbleibende Lenkzeit.','Risiko: Entladetermin kann gefährdet sein.','Nächste Prüfung: 15:30.','Frachtführer bestätigt operative Fakten.','Auftraggeber entscheidet über Termin und Kundenfreigabe.'],
  scenarioB:'Szenario 2 · Freier Lkw und wartende Ladung',
  truck:'Freier Planen-Lkw in Dortmund. Verfügbar ab 08:00. Richtung Kroatien / Serbien.',
  freight:'Ladung wartet in Bochum. Ziel Zagreb. 18 Paletten, 12 t.',
  match:['Mögliche Übereinstimmung erkannt.','Entfernung zum Ladeort: ca. 30 km.','Fahrzeugtyp und Richtung passen grundsätzlich.','Noch zu prüfen: Preis, Lenkzeit, Lizenz, Versicherung, Ware und Ladefenster.','Kontaktdaten werden erst nach Zustimmung beider Firmen ausgetauscht.'],
  roleTitle:'Was DaniniHub übernimmt',
  role:['Informationen strukturieren und fehlende Angaben markieren','Mögliche Übereinstimmungen in einer geschlossenen Firmenliste suchen','Zustimmung beider Seiten vor einer Vorstellung einholen','Kommunikation und nächsten Prüfschritt dokumentieren'],
  boundaryTitle:'Was bei den Unternehmen bleibt',
  boundary:['Partnerprüfung und Auswahl','Preisverhandlung und Transportvertrag','Fahreranweisung und operative Freigaben','Lizenz, Versicherung, Haftung und Durchführung'],
  note:'DaniniHub schließt in dieser Phase keine Transportverträge, bestimmt keine Frachtraten und garantiert keine Durchführung.',
  primary:'Transport Network ansehen',secondary:'Operativen Bedarf beschreiben'
 },
 sr:{
  kicker:'PRE DANINIHUBA / POSLE DANINIHUBA',
  title:'Od nejasne informacije do radno sposobnog slučaja.',
  lead:'DaniniHub čini operativnu informaciju proverljivom za obe kompanije: šta je potvrđeno, šta nedostaje, ko odlučuje i kada sledi nova provera?',
  scenarioA:'Scenario 1 · Status i ETA',
  beforeA:'„Stau Budapest. ETA unklar. Kunde wartet.“',
  beforeLabel:'Pre DaniniHuba',afterLabel:'Posle DaniniHuba',
  afterA:['Potvrđeno: vozač je prijavio zastoj u 14:52.','Nije potvrđeno: tačna lokacija i preostalo vreme vožnje.','Rizik: termin istovara može biti ugrožen.','Sledeća provera: 15:30.','Prevoznik potvrđuje operativne činjenice.','Naručilac odlučuje o terminu i odobrenju poruke klijentu.'],
  scenarioB:'Scenario 2 · Slobodan kamion i roba koja čeka',
  truck:'Slobodan ceradni kamion u Dortmundu. Dostupan od 08:00. Pravac Hrvatska / Srbija.',
  freight:'Roba čeka u Bochumu. Istovar Zagreb. 18 paleta, 12 t.',
  match:['Prepoznato moguće podudaranje.','Udaljenost do utovara: oko 30 km.','Tip vozila i pravac načelno odgovaraju.','Za proveru: cena, radno vreme vozača, licence, osiguranje, roba i termin utovara.','Kontakti se razmenjuju tek nakon saglasnosti obe firme.'],
  roleTitle:'Šta DaniniHub radi',
  role:['Strukturira informacije i označava šta nedostaje','Traži moguće podudaranje u zatvorenoj listi kompanija','Traži saglasnost obe strane pre predstavljanja','Dokumentuje komunikaciju i sledeći korak'],
  boundaryTitle:'Šta ostaje kompanijama',
  boundary:['Provera i izbor partnera','Pregovor o ceni i transportni ugovor','Instrukcije vozaču i operativna odobrenja','Licence, osiguranje, odgovornost i izvršenje'],
  note:'DaniniHub u ovoj fazi ne zaključuje transportne ugovore, ne određuje cenu prevoza i ne garantuje izvršenje.',
  primary:'Pogledaj Transport Network',secondary:'Opiši operativni problem'
 }
}

function List({items}){return <ul>{items.map(item=><li key={item}>{item}</li>)}</ul>}

export default function BeforeAfterPage({lang}){
 const t=content[lang],sr=lang==='sr'
 return <main className="ba-page">
  <section className="ba-hero"><p className="ba-kicker">{t.kicker}</p><h1>{t.title}</h1><p>{t.lead}</p></section>
  <section className="ba-scenario"><div className="ba-scenario-head"><span>01</span><div><p className="ba-kicker">{t.scenarioA}</p><h2>{t.beforeLabel} → {t.afterLabel}</h2></div></div><div className="ba-compare"><article className="ba-before"><small>{t.beforeLabel}</small><blockquote>{t.beforeA}</blockquote></article><article className="ba-after"><small>{t.afterLabel}</small><List items={t.afterA}/></article></div></section>
  <section className="ba-scenario"><div className="ba-scenario-head"><span>02</span><div><p className="ba-kicker">{t.scenarioB}</p><h2>{t.beforeLabel} → {t.afterLabel}</h2></div></div><div className="ba-signals"><article><small>TRUCK SIGNAL</small><p>{t.truck}</p></article><article><small>FREIGHT SIGNAL</small><p>{t.freight}</p></article></div><article className="ba-match"><small>{t.afterLabel}</small><List items={t.match}/></article></section>
  <section className="ba-boundaries"><article><h2>{t.roleTitle}</h2><List items={t.role}/></article><article><h2>{t.boundaryTitle}</h2><List items={t.boundary}/></article></section>
  <section className="ba-note"><strong>{sr?'Jasna granica odgovornosti':'Klare Verantwortungsgrenze'}</strong><p>{t.note}</p></section>
  <section className="ba-actions"><a className="btn" href={sr?'/sr/transportna-mreza-demo':'/de/transport-network-demo'}>{t.primary} →</a><a href={sr?'/sr/provera-pilota':'/de/pilot-check'}>{t.secondary} →</a></section>
 </main>
}
