import { useMemo, useState } from 'react'
import './DispoCheck.css'

const data = {
  de: {
    title: 'Kostenloser Dispo-Check',
    lead: 'Drei simulierte Balkan–DACH-Fälle. Neun Entscheidungen. Eine transparente erste Einschätzung Ihrer operativen Vorgehensweise.',
    start: 'Check starten', next: 'Nächste Frage', finish: 'Ergebnis anzeigen', restart: 'Neu starten', back: 'Zurück zum DispoLab',
    progress: 'Frage', of: 'von', select: 'Bitte wählen Sie eine Antwort.', points: 'Readiness-Punkte',
    disclaimer: 'Edukative Simulation. Keine offizielle Qualifikation und keine operative Weisung.',
    levels: [
      [80,'Sehr hohe Handlungssicherheit','Sie trennen Fakten, Annahmen und offene Punkte sehr klar und handeln strukturiert.'],
      [65,'Sicher in vielen Standardsituationen','Ihre Vorgehensweise ist überwiegend belastbar. Einzelne Kontroll- oder Dokumentationsschritte können präziser werden.'],
      [50,'Operativ einsetzbar mit klaren Verfahren','Die Grundlagen sind vorhanden. Verbindliche Checklisten und Eskalationsregeln würden Ihre Sicherheit erhöhen.'],
      [35,'Mit Unterstützung einsetzbar','Sie erkennen Teile des Problems, benötigen aber mehr Struktur bei Prüfung, Kommunikation und Übergabe.'],
      [0,'Grundlagen erforderlich','Beginnen Sie mit festen Abläufen für Faktenprüfung, Eskalation und dokumentierte Übergabe.']
    ],
    cases: [
      {name:'Stau bei Budapest – ETA unklar', situation:'Ein Fahrzeug befindet sich laut letzter Meldung rund 180 km vor Budapest. Der Fahrer schreibt: „Stau. ETA unklar. Kunde wartet. Entladung bis 10:00.“ Seit 55 Minuten fehlt ein aktualisierter Standort.', feedback:'ETA ist keine Zusage. Gute Disposition trennt bestätigte Fakten, operative Schätzung und offenen Klärungsbedarf.', questions:[
        {q:'Was tun Sie zuerst?', a:[['Standort, Ursache, Stillstandszeit und Restlenkzeit prüfen; parallel Slot- und Kontaktdaten öffnen.',10],['Den Kunden vorsorglich über eine mögliche Verzögerung informieren, bevor alle Fakten geprüft sind.',5],['Die Ankunft bis 10:00 bestätigen oder sofort einen neuen Termin zusagen.',0]]},
        {q:'Welche Kundenmeldung ist professionell?', a:[['Verzögerungsrisiko nennen, bestätigte Fakten trennen und den Zeitpunkt des nächsten Updates zusagen.',10],['Allgemein mitteilen, dass sich das Fahrzeug verspätet.',5],['Eine genaue ETA angeben, obwohl sie noch nicht bestätigt ist.',0]]},
        {q:'Was gehört in die Dokumentation?', a:[['Zeit, Quelle, Fakten, offene Punkte, nächste Prüfung, Verantwortlichen und Eskalationsstatus festhalten.',10],['Nur „Stau Budapest“ und eine neue geschätzte ETA eintragen.',5],['Nichts dokumentieren, weil telefonisch gesprochen wurde.',0]]}
      },
      {name:'Unterschriebener CMR fehlt', situation:'Die Lieferung wurde laut Fahrer beendet. Der Kunde fordert POD/CMR. Im System liegt nur ein unscharfes Foto ohne sichtbare Unterschrift und ohne erkennbare Empfängerangabe.', feedback:'Eine Fahrermeldung ist nicht automatisch ein belastbarer POD. Status und Nachweis müssen getrennt dokumentiert werden.', questions:[
        {q:'Was ist der richtige erste Schritt?', a:[['Das Original beim Fahrer prüfen lassen und ein vollständiges, lesbares Foto mit Unterschrift, Datum und Empfängerangabe anfordern.',10],['Dem Kunden ankündigen, dass der Nachweis später folgt, bevor der Fahrer kontaktiert wurde.',5],['Das unscharfe Foto als gültigen POD weiterleiten.',0]]},
        {q:'Wie kommunizieren Sie mit dem Kunden?', a:[['Zustellung als Fahrermeldung kennzeichnen, den fehlenden belastbaren Nachweis offen nennen und einen Prüfzeitpunkt angeben.',10],['Nur mitteilen, dass das Dokument später folgt.',5],['Zustellung als vollständig dokumentiert bestätigen.',0]]},
        {q:'Wann wird eskaliert?', a:[['Wenn kein vollständiger Nachweis beschafft werden kann oder eine Abrechnungs- bzw. Reklamationsfrist gefährdet ist.',10],['Grundsätzlich erst am Folgetag.',5],['Nie, weil die Ware vermutlich angekommen ist.',0]]}
      },
      {name:'Unvollständige Schichtübergabe', situation:'Die Frühschicht übernimmt fünf laufende Transporte. Bei einem Fall steht nur: „Kunde informiert, Fahrer wartet, später prüfen.“ Zeitpunkt, Ansprechpartner, Entscheidung, Frist und nächster Kontrollpunkt fehlen.', feedback:'Eine Schichtübergabe ist kein Gedächtnisstützer, sondern ein kontrollierter Verantwortungsübergang.', questions:[
        {q:'Was klären Sie zuerst?', a:[['Letzten Status, Kontaktperson, zugesagte Rückmeldung, Entscheidungsbedarf, Frist und verantwortliche Rolle rekonstruieren.',10],['Nur den Fahrer anrufen und nach dem aktuellen Status fragen.',5],['Warten, bis sich Kunde oder Fahrer erneut meldet.',0]]},
        {q:'Wie sieht ein guter Handover-Eintrag aus?', a:[['Fall, Status, Quelle und Zeit, Abweichung, informierte Personen, offene Entscheidung, Frist, nächste Aktion und Verantwortlichen erfassen.',10],['Kurzen Status plus Fahrernamen notieren.',5],['Nur „offen – bitte prüfen“ eintragen.',0]]},
        {q:'Wie behandeln Sie unbestätigte Aussagen?', a:[['Als unbestätigt kennzeichnen, Quelle nennen und eine gezielte Prüfung einplanen.',10],['Ohne Kennzeichnung in die Übergabe übernehmen.',5],['Als gesicherte Tatsache weitergeben.',0]]}
      }
    ]
  },
  sr: {
    title: 'Besplatni Dispo-Check',
    lead: 'Tri simulirana Balkan–DACH slučaja. Devet odluka. Transparentna početna procena vašeg operativnog postupanja.',
    start: 'Pokreni proveru', next: 'Sledeće pitanje', finish: 'Prikaži rezultat', restart: 'Pokreni ponovo', back: 'Nazad na DispoLab',
    progress: 'Pitanje', of: 'od', select: 'Izaberite jedan odgovor.', points: 'Readiness poena',
    disclaimer: 'Edukativna simulacija. Nije zvanična kvalifikacija niti operativni nalog.',
    levels: [
      [80,'Veoma visoka sigurnost u postupanju','Jasno razdvajate činjenice, pretpostavke i otvorena pitanja i postupate strukturisano.'],
      [65,'Sigurno rešavanje mnogih standardnih situacija','Vaš pristup je uglavnom pouzdan. Pojedine provere ili dokumentovanje mogu biti precizniji.'],
      [50,'Operativno upotrebljivo uz jasne procedure','Osnove postoje. Kontrolne liste i pravila eskalacije povećala bi sigurnost.'],
      [35,'Upotrebljivo uz podršku','Prepoznajete deo problema, ali je potrebno više strukture u proveri, komunikaciji i predaji.'],
      [0,'Potrebne su osnove','Počnite od fiksnih postupaka za proveru činjenica, eskalaciju i dokumentovanu predaju.']
    ],
    cases: [
      {name:'Zastoj kod Budimpešte – ETA nejasan', situation:'Vozilo se prema poslednjoj poruci nalazi oko 180 km pre Budimpešte. Vozač piše: „Gužva. ETA nejasan. Klijent čeka. Istovar do 10:00.“ Lokacija nije ažurirana 55 minuta.', feedback:'ETA nije obećanje. Dobar disponent razdvaja potvrđene činjenice, operativnu procenu i ono što još mora da proveri.', questions:[
        {q:'Šta prvo radite?', a:[['Proveravam lokaciju, uzrok, trajanje zastoja i preostalo vreme vožnje; paralelno otvaram podatke o terminu i kontaktima.',10],['Preventivno obaveštavam klijenta o mogućem kašnjenju pre završene provere.',5],['Potvrđujem dolazak do 10:00 ili odmah obećavam novi termin.',0]]},
        {q:'Koja poruka klijentu je profesionalna?', a:[['Navodim rizik kašnjenja, odvajam potvrđene činjenice i obećavam vreme sledećeg ažuriranja.',10],['Samo javljam da vozilo kasni.',5],['Dajem tačan ETA iako još nije potvrđen.',0]]},
        {q:'Šta mora da se dokumentuje?', a:[['Vreme, izvor, činjenice, otvorena pitanja, sledeća provera, odgovorna osoba i status eskalacije.',10],['Samo „gužva Budimpešta“ i nova procena ETA.',5],['Ništa, jer je razgovor vođen telefonom.',0]]}
      },
      {name:'Nedostaje potpisan CMR', situation:'Vozač javlja da je isporuka završena. Klijent traži POD/CMR. U sistemu postoji samo nejasna fotografija bez vidljivog potpisa i podataka primaoca.', feedback:'Poruka vozača nije automatski pouzdan POD. Status isporuke i dokaz isporuke moraju biti odvojeno evidentirani.', questions:[
        {q:'Koji je pravilan prvi korak?', a:[['Tražim proveru originala i jasnu fotografiju sa potpisom, datumom i podatkom o primaocu.',10],['Najavljujem klijentu da će dokaz stići kasnije pre kontakta sa vozačem.',5],['Prosleđujem nejasnu fotografiju kao važeći POD.',0]]},
        {q:'Kako komunicirate sa klijentom?', a:[['Isporuku označavam kao poruku vozača, otvoreno navodim da dokaz još nije pouzdan i dajem vreme sledeće provere.',10],['Samo javljam da će dokument stići kasnije.',5],['Potvrđujem da je isporuka potpuno dokumentovana.',0]]},
        {q:'Kada eskalirate?', a:[['Kada nije moguće pribaviti potpun dokaz ili su ugroženi rokovi za obračun ili reklamaciju.',10],['Uvek tek sledećeg dana.',5],['Nikada, jer je roba verovatno stigla.',0]]}
      },
      {name:'Nepotpuna predaja smene', situation:'Jutarnja smena preuzima pet aktivnih transporta. Za jedan slučaj piše samo: „Klijent obavešten, vozač čeka, proveriti kasnije.“ Nema vremena, kontakta, odluke, roka ni sledeće kontrole.', feedback:'Predaja smene nije podsetnik, već kontrolisan prenos odgovornosti.', questions:[
        {q:'Šta prvo razjašnjavate?', a:[['Poslednji status, kontakt osobu, obećani odgovor, potrebnu odluku, rok i odgovornu ulogu.',10],['Samo zovem vozača i pitam za trenutni status.',5],['Čekam da se klijent ili vozač ponovo javi.',0]]},
        {q:'Kako izgleda dobra beleška za predaju?', a:[['Slučaj, status, izvor i vreme, odstupanje, obaveštene osobe, otvorena odluka, rok, sledeća radnja i odgovorni.',10],['Kratak status i ime vozača.',5],['Samo „otvoreno – proveriti“.',0]]},
        {q:'Kako tretirate nepotvrđene navode?', a:[['Označavam ih kao nepotvrđene, navodim izvor i planiram ciljanu proveru.',10],['Prenosim ih bez posebne oznake.',5],['Prenosim ih kao sigurnu činjenicu.',0]]}
      }
    ]
  }
}

export default function DispoCheck({lang}) {
  const t = data[lang]
  const questions = useMemo(() => t.cases.flatMap((item, caseIndex) => item.questions.map((question, questionIndex) => ({...question, caseIndex, questionIndex}))), [t])
  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [scores, setScores] = useState([])
  const [done, setDone] = useState(false)

  const current = questions[index]
  const currentCase = current ? t.cases[current.caseIndex] : null
  const raw = scores.reduce((sum, value) => sum + value, 0)
  const normalized = Math.round((raw / 90) * 100)
  const level = t.levels.find(([minimum]) => normalized >= minimum) || t.levels[t.levels.length - 1]

  function advance() {
    if (selected === null) return
    const nextScores = [...scores, current.a[selected][1]]
    setScores(nextScores)
    setSelected(null)
    if (index === questions.length - 1) setDone(true)
    else setIndex(value => value + 1)
  }

  function reset() {
    setStarted(false); setIndex(0); setSelected(null); setScores([]); setDone(false)
  }

  if (!started) return <main className="dc-page"><section className="dc-intro"><p className="dc-kicker">DANINIHUB DISPOLAB</p><h1>{t.title}</h1><p>{t.lead}</p><div className="dc-facts"><span>3 {lang==='sr'?'slučaja':'Fälle'}</span><span>9 {lang==='sr'?'odluka':'Entscheidungen'}</span><span>0 €</span></div><button onClick={()=>setStarted(true)}>{t.start}</button><a href={lang==='sr'?'/sr/dispo-lab':'/de/dispolab'}>{t.back}</a><small>{t.disclaimer}</small></section></main>

  if (done) return <main className="dc-page"><section className="dc-result"><p className="dc-kicker">DISPATCH READINESS SCORE</p><div className="dc-result-score"><strong>{normalized}</strong><span>/ 100 {t.points}</span></div><h1>{level[1]}</h1><p>{level[2]}</p><div className="dc-case-feedback">{t.cases.map((item,i)=><article key={item.name}><span>{i+1}</span><div><h2>{item.name}</h2><p>{item.feedback}</p></div></article>)}</div><div className="dc-result-actions"><button onClick={reset}>{t.restart}</button><a href={lang==='sr'?'/sr/dispo-lab':'/de/dispolab'}>{t.back}</a></div><small>{t.disclaimer}</small></section></main>

  return <main className="dc-page"><section className="dc-check"><header><div><p className="dc-kicker">{currentCase.name}</p><h1>{current.q}</h1></div><strong>{t.progress} {index+1} {t.of} {questions.length}</strong></header><div className="dc-progress"><span style={{width:`${((index+1)/questions.length)*100}%`}}/></div>{current.questionIndex===0 && <aside className="dc-situation"><b>{lang==='sr'?'Situacija':'Ausgangslage'}</b><p>{currentCase.situation}</p></aside>}<div className="dc-options">{current.a.map(([answer,points],optionIndex)=><button key={answer} className={selected===optionIndex?'selected':''} onClick={()=>setSelected(optionIndex)}><span>{String.fromCharCode(65+optionIndex)}</span><p>{answer}</p></button>)}</div><footer><small>{selected===null?t.select:''}</small><button disabled={selected===null} onClick={advance}>{index===questions.length-1?t.finish:t.next}</button></footer></section></main>
}
