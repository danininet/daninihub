import { useMemo, useState } from 'react'
import './TransportRoomDemo.css'

const copy = {
  de: {
    kicker:'DANINIHUB TRANSPORT ROOM · PILOT MVP', title:'Duisburg → Beograd', subtitle:'Ein gemeinsamer operativer Raum für Status, ETA, Kommunikation, Dokumente und Abweichungen.',
    demo:'Fiktive Demonstration. Keine reale Transportsteuerung.', status:'Transportstatus', eta:'Operative ETA', nextCheck:'Nächste Prüfung', risk:'Risiko', owner:'Verantwortlich', partner:'Partner', vehicle:'Fahrzeug', driver:'Fahrer',
    tabs:['Übersicht','Kommunikation','Dokumente','Incident','Abschlussbericht'], facts:'Bestätigte Fakten', open:'Offene Punkte', timeline:'Statusverlauf', addStatus:'Status aktualisieren',
    message:'Standardisierte Nachricht', source:'Quelle', confirmed:'Bestätigt', assumption:'Unbestätigt', translate:'DE–SR/BHS Vorschlag erstellen', approve:'Manuell freigeben', noAuto:'Nichts wird automatisch versendet.',
    docs:'Dokumentenstatus', present:'Vorhanden', missing:'Fehlt', unclear:'Zu prüfen', incident:'Abweichung melden', severity:'Schweregrad', decision:'Erforderliche Entscheidung', escalation:'Eskalation', report:'Abschlussbericht erstellen', complete:'Transport abschließen', back:'Zurück',
    statuses:['AUFTRAG ERFASST','FAHRZEUG UNTERWEGS','VERZÖGERUNGSRISIKO','KUNDE INFORMIERT'], messages:['Fahrer meldet Stau vor Budapest. Standort muss aktualisiert werden.','Verzögerungsrisiko wurde bestätigt. Eine belastbare ETA liegt noch nicht vor.'],
    reportText:'Der Transport wurde mit dokumentierter Verzögerung abgeschlossen. ETA-Änderungen, Kundeninformation, CMR/POD-Status und Eskalation sind nachvollziehbar protokolliert.'
  },
  sr: {
    kicker:'DANINIHUB TRANSPORT ROOM · PILOT MVP', title:'Duisburg → Beograd', subtitle:'Zajednički operativni prostor za statuse, ETA, komunikaciju, dokumente i odstupanja.',
    demo:'Fiktivna demonstracija. Nije stvarno upravljanje transportom.', status:'Status transporta', eta:'Operativni ETA', nextCheck:'Sledeća provera', risk:'Rizik', owner:'Odgovoran', partner:'Partner', vehicle:'Vozilo', driver:'Vozač',
    tabs:['Pregled','Komunikacija','Dokumenti','Incident','Završni izveštaj'], facts:'Potvrđene činjenice', open:'Otvorene tačke', timeline:'Tok statusa', addStatus:'Ažuriraj status',
    message:'Standardizovana poruka', source:'Izvor', confirmed:'Potvrđeno', assumption:'Nepotvrđeno', translate:'Kreiraj DE–SR/BHS predlog', approve:'Ručno odobri', noAuto:'Ništa se ne šalje automatski.',
    docs:'Status dokumenata', present:'Postoji', missing:'Nedostaje', unclear:'Za proveru', incident:'Prijavi odstupanje', severity:'Ozbiljnost', decision:'Potrebna odluka', escalation:'Eskalacija', report:'Kreiraj završni izveštaj', complete:'Završi transport', back:'Nazad',
    statuses:['NALOG UNET','VOZILO NA PUTU','RIZIK KAŠNJENJA','KLIJENT OBAVEŠTEN'], messages:['Vozač javlja gužvu pre Budimpešte. Potrebno je ažurirati lokaciju.','Rizik kašnjenja je potvrđen. Pouzdan ETA još nije dostupan.'],
    reportText:'Transport je završen uz dokumentovano kašnjenje. Promene ETA, obaveštavanje klijenta, status CMR/POD i eskalacija evidentirani su pregledno.'
  }
}

export default function TransportRoomDemo({lang}) {
  const t=copy[lang]
  const [tab,setTab]=useState(0)
  const [statusIndex,setStatusIndex]=useState(2)
  const [approved,setApproved]=useState(false)
  const [incidentOpen,setIncidentOpen]=useState(true)
  const [reportReady,setReportReady]=useState(false)
  const timeline=useMemo(()=>t.statuses.slice(0,statusIndex+1),[t,statusIndex])

  return <main className="tr-shell">
    <header className="tr-head"><div><p className="tr-kicker">{t.kicker}</p><h1>{t.title}</h1><p>{t.subtitle}</p></div><span className="tr-demo">{t.demo}</span></header>
    <section className="tr-summary">
      <article><small>{t.status}</small><strong>{t.statuses[statusIndex]}</strong></article><article><small>{t.eta}</small><strong>18:40</strong></article><article><small>{t.nextCheck}</small><strong>15:30</strong></article><article><small>{t.risk}</small><strong className="high">VISOK / HOCH</strong></article>
    </section>
    <section className="tr-transport-card"><div><small>{t.partner}</small><strong>Danube Logistics d.o.o.</strong></div><div><small>{t.vehicle}</small><strong>BG-TEST-101</strong></div><div><small>{t.driver}</small><strong>TEST DRIVER</strong></div><div><small>{t.owner}</small><strong>Operations Desk</strong></div></section>
    <nav className="tr-tabs">{t.tabs.map((label,i)=><button key={label} className={tab===i?'active':''} onClick={()=>setTab(i)}>{label}</button>)}</nav>

    {tab===0&&<section className="tr-grid">
      <article className="tr-card"><h2>{t.facts}</h2><ul><li>Duisburg loading completed 08:10</li><li>Vehicle passed Nürnberg 12:20</li><li>Driver reported congestion before Budapest</li></ul></article>
      <article className="tr-card"><h2>{t.open}</h2><ul><li>Current GPS position</li><li>Remaining driving time</li><li>Whether unloading slot remains available</li></ul></article>
      <article className="tr-card tr-wide"><h2>{t.timeline}</h2><div className="tr-timeline">{timeline.map((item,i)=><span key={item}><b>{i+1}</b>{item}</span>)}</div>{statusIndex<t.statuses.length-1&&<button onClick={()=>setStatusIndex(v=>v+1)}>{t.addStatus}</button>}</article>
    </section>}

    {tab===1&&<section className="tr-grid">
      <article className="tr-card"><h2>{t.source}</h2><p>WhatsApp · Fahrer / Vozač · 14:52</p><blockquote>“Stau Budapest. ETA unklar. Kunde wartet.”</blockquote><p><b>{t.assumption}:</b> unloading before 18:00</p></article>
      <article className="tr-card"><h2>{t.message}</h2><textarea defaultValue={t.messages[approved?1:0]} rows="8"/><div className="tr-actions"><button>{t.translate}</button><button className="secondary" onClick={()=>setApproved(true)}>{t.approve}</button></div><small>{approved?t.confirmed:t.noAuto}</small></article>
    </section>}

    {tab===2&&<section className="tr-card"><h2>{t.docs}</h2><div className="tr-docs"><div><strong>Transportauftrag</strong><span className="ok">{t.present}</span></div><div><strong>CMR</strong><span>{t.unclear}</span></div><div><strong>POD / Abliefernachweis</strong><span className="bad">{t.missing}</span></div><div><strong>Versicherung / Osiguranje</strong><span className="ok">{t.present}</span></div></div></section>}

    {tab===3&&<section className="tr-grid">
      <article className="tr-card"><h2>{t.incident}</h2><label>{t.severity}<select defaultValue="HIGH"><option>LOW</option><option>MEDIUM</option><option>HIGH</option><option>CRITICAL</option></select></label><label>{t.decision}<textarea defaultValue="Confirm next customer update and decide whether a new unloading slot is required." rows="5"/></label><button onClick={()=>setIncidentOpen(false)}>{t.escalation}</button></article>
      <article className="tr-card"><h2>Incident Log</h2><p><b>14:52</b> Driver reports congestion.</p><p><b>15:02</b> GPS update requested.</p><p><b>15:10</b> Customer informed about delay risk.</p><p><b>Status:</b> {incidentOpen?'OPEN':'ESCALATED'}</p></article>
    </section>}

    {tab===4&&<section className="tr-card tr-report"><h2>{t.tabs[4]}</h2><p>{t.reportText}</p><div className="tr-report-grid"><span><small>Transport</small><b>DH-TR-0001</b></span><span><small>ETA updates</small><b>3</b></span><span><small>Incidents</small><b>1</b></span><span><small>Documents</small><b>3 / 4</b></span></div><button onClick={()=>setReportReady(true)}>{reportReady?t.complete:t.report}</button>{reportReady&&<p className="tr-success">REPORT READY · HUMAN REVIEW REQUIRED</p>}</section>}
  </main>
}
