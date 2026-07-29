import { useMemo, useState } from 'react'
import './DispoCheck.css'

const common = {
  de: {
    title: 'Kostenloser Dispo-Check',
    lead: 'Drei simulierte Balkan–DACH-Fälle. Zwölf Entscheidungen. Eine transparente erste Einschätzung Ihrer operativen Vorgehensweise.',
    start: 'Check starten', next: 'Nächste Frage', finish: 'Ergebnis anzeigen', restart: 'Neu starten',
    back: 'Zurück zum DispoLab', progress: 'Frage', of: 'von', select: 'Bitte wählen Sie eine Antwort.',
    points: 'Readiness-Punkte', disclaimer: 'Edukative Simulation. Keine offizielle Qualifikation und keine operative Weisung.',
    formTitle: 'Ergebnis sichern und nächsten Schritt erhalten',
    formLead: 'Senden Sie Ihren Score an DaniniHub. Sie erhalten eine Bestätigung und Informationen zum vollständigen Dispatch Readiness Check.',
    name: 'Name', email: 'E-Mail', role: 'Aktuelle Rolle',
    roles: ['Bitte auswählen', 'Disponent/in', 'Bewerber/in oder Quereinsteiger/in', 'Transport- oder Speditionsunternehmen', 'Andere Rolle'],
    consentBefore: 'Ich habe die', consentLabel: 'Datenschutzerklärung', consentAfter: 'zur Kenntnis genommen.',
    send: 'Ergebnis senden', sending: 'Wird gesendet…', success: 'Ihr Ergebnis wurde übermittelt. Eine Bestätigung folgt per E-Mail.',
    error: 'Das Ergebnis konnte nicht gesendet werden. Schreiben Sie bitte an info@daninihub.com.',
    situation: 'Ausgangslage'
  },
  sr: {
    title: 'Besplatni Dispo-Check',
    lead: 'Tri simulirana Balkan–DACH slučaja. Dvanaest odluka. Transparentna početna procena vašeg operativnog postupanja.',
    start: 'Pokreni proveru', next: 'Sledeće pitanje', finish: 'Prikaži rezultat', restart: 'Pokreni ponovo',
    back: 'Nazad na DispoLab', progress: 'Pitanje', of: 'od', select: 'Izaberite jedan odgovor.',
    points: 'Readiness poena', disclaimer: 'Edukativna simulacija. Nije zvanična kvalifikacija niti operativni nalog.',
    formTitle: 'Sačuvajte rezultat i dobijte sledeći korak',
    formLead: 'Pošaljite svoj rezultat DaniniHub-u. Dobićete potvrdu i informacije o punom Dispatch Readiness Checku.',
    name: 'Ime', email: 'E-mail', role: 'Trenutna uloga',
    roles: ['Izaberite', 'Disponent', 'Kandidat ili osoba koja menja zanimanje', 'Transportna ili špediterska firma', 'Druga uloga'],
    consentBefore: 'Pročitao/la sam', consentLabel: 'obaveštenje o privatnosti', consentAfter: 'i saglasan/na sam sa obradom podataka.',
    send: 'Pošalji rezultat', sending: 'Šaljem…', success: 'Rezultat je prosleđen. Potvrda stiže na vašu e-mail adresu.',
    error: 'Rezultat nije mogao da bude poslat. Pišite na info@daninihub.com.',
    situation: 'Situacija'
  }
}

const levels = {
  de: [
    [80, 'Sehr hohe Handlungssicherheit', 'Sie trennen Fakten, Annahmen und offene Punkte sehr klar und handeln strukturiert.'],
    [65, 'Sicher in vielen Standardsituationen', 'Ihre Vorgehensweise ist überwiegend belastbar. Einzelne Kontroll- oder Dokumentationsschritte können präziser werden.'],
    [50, 'Operativ einsetzbar mit klaren Verfahren', 'Die Grundlagen sind vorhanden. Verbindliche Checklisten und Eskalationsregeln würden Ihre Sicherheit erhöhen.'],
    [35, 'Mit Unterstützung einsetzbar', 'Sie erkennen Teile des Problems, benötigen aber mehr Struktur bei Prüfung, Kommunikation und Übergabe.'],
    [0, 'Grundlagen erforderlich', 'Beginnen Sie mit festen Abläufen für Faktenprüfung, Eskalation und dokumentierte Übergabe.']
  ],
  sr: [
    [80, 'Veoma visoka sigurnost u postupanju', 'Jasno razdvajate činjenice, pretpostavke i otvorena pitanja i postupate strukturisano.'],
    [65, 'Sigurno rešavanje mnogih standardnih situacija', 'Vaš pristup je uglavnom pouzdan. Pojedine provere ili dokumentovanje mogu biti precizniji.'],
    [50, 'Operativno upotrebljivo uz jasne procedure', 'Osnove postoje. Kontrolne liste i pravila eskalacije povećale bi sigurnost.'],
    [35, 'Upotrebljivo uz podršku', 'Prepoznajete deo problema, ali je potrebno više strukture u proveri, komunikaciji i predaji.'],
    [0, 'Potrebne su osnove', 'Počnite od fiksnih postupaka za proveru činjenica, eskalaciju i dokumentovanu predaju.']
  ]
}

const cases = {
  de: [
    {
      name: 'Stau bei Budapest – ETA unklar',
      situation: 'Ein Fahrzeug befindet sich laut letzter Meldung rund 180 km vor Budapest. Der Fahrer schreibt: „Stau. ETA unklar. Kunde wartet. Entladung bis 10:00.“ Seit 55 Minuten fehlt ein aktualisierter Standort.',
      feedback: 'ETA ist keine Zusage. Gute Disposition trennt bestätigte Fakten, operative Schätzung und offenen Klärungsbedarf.',
      questions: [
        ['Was tun Sie zuerst?', ['Standort, Ursache, Stillstandszeit und Restlenkzeit prüfen; parallel Slot- und Kontaktdaten öffnen.', 'Den Kunden vorsorglich informieren, bevor alle Fakten geprüft sind.', 'Die Ankunft bis 10:00 bestätigen oder sofort einen neuen Termin zusagen.']],
        ['Welche Kundenmeldung ist professionell?', ['Verzögerungsrisiko nennen, bestätigte Fakten trennen und den Zeitpunkt des nächsten Updates zusagen.', 'Allgemein mitteilen, dass sich das Fahrzeug verspätet.', 'Eine genaue ETA angeben, obwohl sie noch nicht bestätigt ist.']],
        ['Wann eskalieren Sie?', ['Wenn der Slot gefährdet ist, keine belastbare ETA entsteht oder eine Entscheidung außerhalb der eigenen Befugnis nötig wird.', 'Erst wenn der Kunde sich erneut meldet.', 'Gar nicht, solange das Fahrzeug noch fährt.']],
        ['Was gehört in die Dokumentation?', ['Zeit, Quelle, Fakten, offene Punkte, nächste Prüfung, Verantwortlichen und Eskalationsstatus festhalten.', 'Nur „Stau Budapest“ und eine neue geschätzte ETA eintragen.', 'Nichts dokumentieren, weil telefonisch gesprochen wurde.']]
      ]
    },
    {
      name: 'Unterschriebener CMR fehlt',
      situation: 'Die Lieferung wurde laut Fahrer beendet. Der Kunde fordert POD/CMR. Im System liegt nur ein unscharfes Foto ohne sichtbare Unterschrift und ohne erkennbare Empfängerangabe.',
      feedback: 'Eine Fahrermeldung ist nicht automatisch ein belastbarer POD. Status und Nachweis müssen getrennt dokumentiert werden.',
      questions: [
        ['Was ist der richtige erste Schritt?', ['Das Original beim Fahrer prüfen lassen und ein vollständiges, lesbares Foto mit Unterschrift, Datum und Empfängerangabe anfordern.', 'Dem Kunden ankündigen, dass der Nachweis später folgt, bevor der Fahrer kontaktiert wurde.', 'Das unscharfe Foto als gültigen POD weiterleiten.']],
        ['Wie kommunizieren Sie mit dem Kunden?', ['Zustellung als Fahrermeldung kennzeichnen, den fehlenden belastbaren Nachweis offen nennen und einen Prüfzeitpunkt angeben.', 'Nur mitteilen, dass das Dokument später folgt.', 'Zustellung als vollständig dokumentiert bestätigen.']],
        ['Was wird intern dokumentiert?', ['Zustellstatus, Art und Qualität des vorhandenen Nachweises, fehlende Angaben, Verantwortlichen und nächste Prüfung.', 'Nur „CMR fehlt“.', 'Nichts, bis ein gültiger CMR vorliegt.']],
        ['Wann wird eskaliert?', ['Wenn kein vollständiger Nachweis beschafft werden kann oder eine Abrechnungs- bzw. Reklamationsfrist gefährdet ist.', 'Grundsätzlich erst am Folgetag.', 'Nie, weil die Ware vermutlich angekommen ist.']]
      ]
    },
    {
      name: 'Unvollständige Schichtübergabe',
      situation: 'Die Frühschicht übernimmt fünf laufende Transporte. Bei einem Fall steht nur: „Kunde informiert, Fahrer wartet, später prüfen.“ Zeitpunkt, Ansprechpartner, Entscheidung, Frist und nächster Kontrollpunkt fehlen.',
      feedback: 'Eine Schichtübergabe ist kein Gedächtnisstützer, sondern ein kontrollierter Verantwortungsübergang.',
      questions: [
        ['Was klären Sie zuerst?', ['Letzten Status, Kontaktperson, zugesagte Rückmeldung, Entscheidungsbedarf, Frist und verantwortliche Rolle rekonstruieren.', 'Nur den Fahrer anrufen und nach dem aktuellen Status fragen.', 'Warten, bis sich Kunde oder Fahrer erneut meldet.']],
        ['Wie sieht ein guter Handover-Eintrag aus?', ['Fall, Status, Quelle und Zeit, Abweichung, informierte Personen, offene Entscheidung, Frist, nächste Aktion und Verantwortlichen erfassen.', 'Kurzen Status plus Fahrernamen notieren.', 'Nur „offen – bitte prüfen“ eintragen.']],
        ['Wie behandeln Sie unbestätigte Aussagen?', ['Als unbestätigt kennzeichnen, Quelle nennen und eine gezielte Prüfung einplanen.', 'Ohne Kennzeichnung in die Übergabe übernehmen.', 'Als gesicherte Tatsache weitergeben.']],
        ['Wann ist die Übergabe abgeschlossen?', ['Wenn die übernehmende Person offene Punkte, Fristen, nächste Aktion und Verantwortung nachvollziehbar übernommen hat.', 'Sobald die Notiz gespeichert wurde.', 'Sobald die vorherige Schicht endet.']]
      ]
    }
  ],
  sr: [
    {
      name: 'Zastoj kod Budimpešte – ETA nejasan',
      situation: 'Vozilo se prema poslednjoj poruci nalazi oko 180 km pre Budimpešte. Vozač piše: „Gužva. ETA nejasan. Klijent čeka. Istovar do 10:00.“ Lokacija nije ažurirana 55 minuta.',
      feedback: 'ETA nije obećanje. Dobar disponent razdvaja potvrđene činjenice, operativnu procenu i ono što još mora da proveri.',
      questions: [
        ['Šta prvo radite?', ['Proveravam lokaciju, uzrok, trajanje zastoja i preostalo vreme vožnje; paralelno otvaram podatke o terminu i kontaktima.', 'Preventivno obaveštavam klijenta pre završene provere.', 'Potvrđujem dolazak do 10:00 ili odmah obećavam novi termin.']],
        ['Koja poruka klijentu je profesionalna?', ['Navodim rizik kašnjenja, odvajam potvrđene činjenice i obećavam vreme sledećeg ažuriranja.', 'Samo javljam da vozilo kasni.', 'Dajem tačan ETA iako još nije potvrđen.']],
        ['Kada eskalirate?', ['Kada je termin ugrožen, nema pouzdanog ETA ili je potrebna odluka izvan mojih ovlašćenja.', 'Tek kada se klijent ponovo javi.', 'Ne eskaliram dok se vozilo kreće.']],
        ['Šta mora da se dokumentuje?', ['Vreme, izvor, činjenice, otvorena pitanja, sledeća provera, odgovorna osoba i status eskalacije.', 'Samo „gužva Budimpešta“ i nova procena ETA.', 'Ništa, jer je razgovor vođen telefonom.']]
      ]
    },
    {
      name: 'Nedostaje potpisan CMR',
      situation: 'Vozač javlja da je isporuka završena. Klijent traži POD/CMR. U sistemu postoji samo nejasna fotografija bez vidljivog potpisa i podataka primaoca.',
      feedback: 'Poruka vozača nije automatski pouzdan POD. Status isporuke i dokaz isporuke moraju biti odvojeno evidentirani.',
      questions: [
        ['Koji je pravilan prvi korak?', ['Tražim proveru originala i jasnu fotografiju sa potpisom, datumom i podatkom o primaocu.', 'Najavljujem klijentu da će dokaz stići kasnije pre kontakta sa vozačem.', 'Prosleđujem nejasnu fotografiju kao važeći POD.']],
        ['Kako komunicirate sa klijentom?', ['Isporuku označavam kao poruku vozača, otvoreno navodim da dokaz još nije pouzdan i dajem vreme sledeće provere.', 'Samo javljam da će dokument stići kasnije.', 'Potvrđujem da je isporuka potpuno dokumentovana.']],
        ['Šta se interno dokumentuje?', ['Status isporuke, kvalitet postojećeg dokaza, šta nedostaje, ko proverava i kada je sledeća kontrola.', 'Samo „CMR nedostaje“.', 'Ništa dok se ne dobije ispravan CMR.']],
        ['Kada eskalirate?', ['Kada nije moguće pribaviti potpun dokaz ili su ugroženi rokovi za obračun ili reklamaciju.', 'Uvek tek sledećeg dana.', 'Nikada, jer je roba verovatno stigla.']]
      ]
    },
    {
      name: 'Nepotpuna predaja smene',
      situation: 'Jutarnja smena preuzima pet aktivnih transporta. Za jedan slučaj piše samo: „Klijent obavešten, vozač čeka, proveriti kasnije.“ Nema vremena, kontakta, odluke, roka ni sledeće kontrole.',
      feedback: 'Predaja smene nije podsetnik, već kontrolisan prenos odgovornosti.',
      questions: [
        ['Šta prvo razjašnjavate?', ['Poslednji status, kontakt osobu, obećani odgovor, potrebnu odluku, rok i odgovornu ulogu.', 'Samo zovem vozača i pitam za trenutni status.', 'Čekam da se klijent ili vozač ponovo javi.']],
        ['Kako izgleda dobra beleška za predaju?', ['Slučaj, status, izvor i vreme, odstupanje, obaveštene osobe, otvorena odluka, rok, sledeća radnja i odgovorni.', 'Kratak status i ime vozača.', 'Samo „otvoreno – proveriti“.']],
        ['Kako tretirate nepotvrđene navode?', ['Označavam ih kao nepotvrđene, navodim izvor i planiram ciljanu proveru.', 'Prenosim ih bez posebne oznake.', 'Prenosim ih kao sigurnu činjenicu.']],
        ['Kada je predaja završena?', ['Kada osoba koja preuzima može jasno da ponovi otvorene tačke, rok, sledeću radnju i odgovornost.', 'Kada je beleška sačuvana.', 'Kada prethodna smena završi rad.']]
      ]
    }
  ]
}

const scoreValues = [10, 5, 0]

export default function DispoCheck({ lang }) {
  const t = common[lang]
  const localizedCases = cases[lang]
  const questions = useMemo(
    () => localizedCases.flatMap((caseItem, caseIndex) =>
      caseItem.questions.map(([q, answers], questionIndex) => ({ q, answers, caseIndex, questionIndex }))
    ),
    [localizedCases]
  )

  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [scores, setScores] = useState([])
  const [done, setDone] = useState(false)
  const [formState, setFormState] = useState('idle')

  const current = questions[index]
  const currentCase = current ? localizedCases[current.caseIndex] : null
  const raw = scores.reduce((sum, value) => sum + value, 0)
  const normalized = Math.round((raw / (questions.length * 10)) * 100)
  const level = levels[lang].find(([minimum]) => normalized >= minimum) || levels[lang].at(-1)

  function advance() {
    if (selected === null) return
    const nextScores = [...scores, scoreValues[selected]]
    setScores(nextScores)
    setSelected(null)
    if (index === questions.length - 1) setDone(true)
    else setIndex(value => value + 1)
  }

  function reset() {
    setStarted(false)
    setIndex(0)
    setSelected(null)
    setScores([])
    setDone(false)
    setFormState('idle')
  }

  async function sendResult(event) {
    event.preventDefault()
    const form = event.currentTarget
    const contact = Object.fromEntries(new FormData(form))
    setFormState('sending')
    const payload = {
      source: 'free-dispo-check', language: lang, company: contact.name, email: contact.email,
      phone: '', fleet: '', routes: 'Balkan–DACH',
      tasks: `Dispatch Readiness Score: ${normalized}/100\nLevel: ${level[1]}\nRole: ${contact.role}`,
      availability: '', systems: '', decision: '',
      interest: lang === 'sr' ? 'Rezultat besplatnog Dispo-Checka' : 'Ergebnis des kostenlosen Dispo-Checks',
      message: lang === 'sr'
        ? `Korisnik je završio Dispo-Check sa rezultatom ${normalized}/100. Nivo: ${level[1]}.`
        : `Der Nutzer hat den Dispo-Check mit ${normalized}/100 abgeschlossen. Stufe: ${level[1]}.`,
      consent: contact.consent, website: ''
    }
    try {
      const response = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      })
      if (!response.ok) throw new Error('SEND_FAILED')
      form.reset()
      setFormState('success')
    } catch {
      setFormState('error')
    }
  }

  const backUrl = lang === 'sr' ? '/sr/dispo-lab' : '/de/dispolab'

  if (!started) return (
    <main className="dc-page"><section className="dc-intro">
      <p className="dc-kicker">DANINIHUB DISPOLAB</p><h1>{t.title}</h1><p>{t.lead}</p>
      <div className="dc-facts"><span>3 {lang === 'sr' ? 'slučaja' : 'Fälle'}</span><span>12 {lang === 'sr' ? 'odluka' : 'Entscheidungen'}</span><span>0 €</span></div>
      <button onClick={() => setStarted(true)}>{t.start}</button><a href={backUrl}>{t.back}</a><small>{t.disclaimer}</small>
    </section></main>
  )

  if (done) return (
    <main className="dc-page"><section className="dc-result">
      <p className="dc-kicker">DISPATCH READINESS SCORE</p>
      <div className="dc-result-score"><strong>{normalized}</strong><span>/ 100 {t.points}</span></div>
      <h1>{level[1]}</h1><p>{level[2]}</p>
      <div className="dc-case-feedback">{localizedCases.map((item, i) => <article key={item.name}><span>{i + 1}</span><div><h2>{item.name}</h2><p>{item.feedback}</p></div></article>)}</div>
      <section className="dc-lead"><h2>{t.formTitle}</h2><p>{t.formLead}</p>
        <form onSubmit={sendResult}>
          <label><span>{t.name}</span><input name="name" required maxLength="120" /></label>
          <label><span>{t.email}</span><input name="email" type="email" required maxLength="180" /></label>
          <label><span>{t.role}</span><select name="role" required defaultValue=""><option value="" disabled>{t.roles[0]}</option>{t.roles.slice(1).map(role => <option key={role}>{role}</option>)}</select></label>
          <label className="dc-consent"><input name="consent" type="checkbox" value="yes" required /><span>{t.consentBefore} <a href={lang === 'sr' ? '/sr/privatnost' : '/de/datenschutz'} target="_blank" rel="noopener noreferrer">{t.consentLabel}</a> {t.consentAfter}</span></label>
          <button type="submit" disabled={formState === 'sending' || formState === 'success'}>{formState === 'sending' ? t.sending : t.send}</button>
          {formState === 'success' && <p className="dc-success">{t.success}</p>}{formState === 'error' && <p className="dc-error">{t.error}</p>}
        </form>
      </section>
      <div className="dc-result-actions"><button onClick={reset}>{t.restart}</button><a href={backUrl}>{t.back}</a></div><small>{t.disclaimer}</small>
    </section></main>
  )

  return (
    <main className="dc-page"><section className="dc-check">
      <header className="dc-question-header"><div><p className="dc-kicker">{currentCase.name}</p><h1>{current.q}</h1></div><strong>{t.progress} {index + 1} {t.of} {questions.length}</strong></header>
      <div className="dc-progress"><span style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div>
      {current.questionIndex === 0 && <aside className="dc-situation"><b>{t.situation}</b><p>{currentCase.situation}</p></aside>}
      <div className="dc-options">{current.answers.map((answer, optionIndex) => <button key={answer} className={selected === optionIndex ? 'selected' : ''} onClick={() => setSelected(optionIndex)}><span>{String.fromCharCode(65 + optionIndex)}</span><p>{answer}</p></button>)}</div>
      <footer><small>{selected === null ? t.select : ''}</small><button disabled={selected === null} onClick={advance}>{index === questions.length - 1 ? t.finish : t.next}</button></footer>
    </section></main>
  )
}
