import { useMemo, useState } from 'react'
import './FreeDispoCheck.css'

const scenarios = {
  de: [
    {
      title:'Stau bei Budapest – ETA unklar',
      situation:'07:35 Uhr. Ein LKW fährt von Novi Sad nach Nürnberg. Entladeslot 14:00–14:30 Uhr. Der Fahrer meldet: „Stau Budapest. Noch ungefähr 610 km. ETA weiß ich nicht.“ Der Kunde erwartet bis 08:00 Uhr ein Update.',
      first:'Was prüfen Sie zuerst?',
      firstOptions:[
        'Dem Kunden sofort 14:15 Uhr als ETA bestätigen.',
        'Genaue Position, Verkehrslage, Restlenkzeit/Pause und aktuelle Navigations-ETA prüfen.',
        'Nur den Fahrer auffordern, schneller zu fahren.',
        'Bis zur sicheren Lösung keine Nachricht senden.'
      ],
      message:'Welche Kundenmeldung ist professionell?',
      messageOptions:[
        'Wir kommen sicher pünktlich.',
        'Der Fahrer steckt im Stau. Wir können nichts machen.',
        'Das Fahrzeug steht aktuell im Raum Budapest. Eine belastbare ETA ist noch nicht möglich. Wir prüfen Position, Restlenkzeit und Verkehrslage. Nächstes Update bis 08:20 Uhr.',
        'Der Termin wird auf morgen verschoben.'
      ],
      correct:[1,2],
      learning:'Keine ungesicherte ETA versprechen. Fakten, Unsicherheit und den nächsten Prüfzeitpunkt klar trennen.'
    },
    {
      title:'Unterschriebener CMR fehlt',
      situation:'16:20 Uhr. Die Ware wurde in Dortmund entladen. Der Fahrer sendet ein unscharfes Foto der ersten CMR-Seite. Unterschrift und Stempel sind nicht erkennbar. Der Kunde fordert „POD sofort“.',
      first:'Was ist die richtige Reihenfolge?',
      firstOptions:[
        'POD als vollständig melden und später korrigieren.',
        'Foto bearbeiten, damit die Unterschrift besser aussieht.',
        'Fahrer kontaktieren, Original und Unterschrift prüfen, lesbaren Scan anfordern, offenen Status mit Frist dokumentieren.',
        'Den Fall ohne Rückmeldung schließen.'
      ],
      message:'Welche Kundenmeldung ist korrekt?',
      messageOptions:[
        'POD liegt vollständig vor.',
        'Die Entladung ist laut Fahrermeldung erfolgt. Der vorliegende Scan ist als POD noch nicht ausreichend lesbar. Wir prüfen das Original und senden bis 16:45 Uhr ein Update.',
        'Der Empfänger hat sicher unterschrieben.',
        'Der Fahrer ist schuld; bitte warten.'
      ],
      correct:[2,1],
      learning:'Entladung und belastbaren Abliefernachweis nicht gleichsetzen. Offene Dokumente brauchen Verantwortlichen und Frist.'
    },
    {
      title:'Unvollständige Schichtübergabe',
      situation:'21:40 Uhr. Zu einem von fünf Fahrzeugen steht nur: „Kunde informiert, Fahrer wartet, morgen früh prüfen.“ Ort, Grund, Ansprechpartner, Frist und offene Entscheidung fehlen. Die Nachtschicht beginnt um 22:00 Uhr.',
      first:'Welche Angaben müssen vor der Übernahme ergänzt werden?',
      firstOptions:[
        'Nur der Fahrzeugname.',
        'Fahrzeug/Sendung, Ort, Problem, letzter Status, Ansprechpartner, Frist, nächste Aktion, Verantwortung und Eskalationsgrenze.',
        'Nichts; die Nachtschicht kann morgen nachfragen.',
        'Nur eine Vermutung zum Grund der Wartezeit.'
      ],
      message:'Welche Übergabe ist belastbar?',
      messageOptions:[
        'Fahrer wartet. Morgen prüfen.',
        'Problem offen, Kunde weiß Bescheid.',
        'Fahrzeug 17, Standort Empfänger Köln, wartet seit 20:55 Uhr wegen fehlender Rampe. Kunde informiert; Rückmeldung bis 22:15 Uhr zugesagt. Nachtschicht prüft 22:15 Uhr, Eskalation an Schichtleitung ab 22:30 Uhr ohne Slot.',
        'Alles unter Kontrolle.'
      ],
      correct:[1,2],
      learning:'Eine Übergabe muss arbeitsfähig sein: Fakten, offene Punkte, Zeit, Verantwortung und Eskalationsschwelle.'
    }
  ],
  sr: [
    {
      title:'Zastoj kod Budimpešte – ETA nejasan',
      situation:'07:35. Kamion vozi Novi Sad–Nirnberg. Termin istovara je 14:00–14:30. Vozač javlja: „Gužva kod Budimpešte. Još oko 610 km. Ne znam ETA.“ Klijent očekuje status do 08:00.',
      first:'Šta prvo proveravate?',
      firstOptions:[
        'Odmah potvrditi klijentu ETA 14:15.',
        'Tačnu lokaciju, stanje saobraćaja, preostalo vreme vožnje/pauzu i trenutni navigacioni ETA.',
        'Samo reći vozaču da vozi brže.',
        'Ne slati ništa dok ne postoji konačno rešenje.'
      ],
      message:'Koja poruka klijentu je profesionalna?',
      messageOptions:[
        'Sigurno stižemo na vreme.',
        'Vozač je u gužvi i ništa ne možemo.',
        'Vozilo je trenutno u zoni Budimpešte i stoji u saobraćaju. Pouzdan ETA još nije moguć. Proveravamo lokaciju, vreme vožnje i stanje na putu. Sledeći status do 08:20.',
        'Termin je pomeren za sutra.'
      ],
      correct:[1,2],
      learning:'Ne obećavati neproveren ETA. Jasno odvojiti činjenice, neizvesnost i vreme sledeće provere.'
    },
    {
      title:'Nedostaje potpisan CMR',
      situation:'16:20. Roba je istovarena u Dortmundu. Vozač šalje mutnu fotografiju prve strane CMR-a. Potpis i pečat primaoca se ne vide. Klijent traži „POD odmah“.',
      first:'Koji je pravilan redosled?',
      firstOptions:[
        'Prijaviti da je POD kompletan i kasnije ispraviti.',
        'Obraditi fotografiju da potpis izgleda jasnije.',
        'Kontaktirati vozača, proveriti original i potpis, tražiti čitljiv snimak i dokumentovati otvoren status sa rokom.',
        'Zatvoriti slučaj bez odgovora.'
      ],
      message:'Koja poruka klijentu je korektna?',
      messageOptions:[
        'POD je kompletno dostupan.',
        'Prema izjavi vozača istovar je izvršen. Trenutni snimak još nije dovoljno čitljiv kao POD. Proveravamo original i šaljemo novi status do 16:45.',
        'Primalac je sigurno potpisao.',
        'Vozač je kriv; sačekajte.'
      ],
      correct:[2,1],
      learning:'Istovar i pouzdan dokaz isporuke nisu isto. Otvoreni dokument mora imati odgovornu osobu i rok.'
    },
    {
      title:'Nepotpuna predaja smene',
      situation:'21:40. Za jedno od pet vozila piše samo: „Klijent obavešten, vozač čeka, proveriti sutra ujutru.“ Nedostaju mesto, razlog, kontakt, rok i otvorena odluka. Noćna smena počinje u 22:00.',
      first:'Šta mora biti dopunjeno pre preuzimanja?',
      firstOptions:[
        'Samo oznaka vozila.',
        'Vozilo/pošiljka, mesto, problem, poslednji status, kontakt, rok, sledeća akcija, odgovornost i prag eskalacije.',
        'Ništa; noćna smena može sutra da pita.',
        'Samo pretpostavka o razlogu čekanja.'
      ],
      message:'Koja predaja smene je upotrebljiva?',
      messageOptions:[
        'Vozač čeka. Proveriti sutra.',
        'Problem je otvoren, klijent zna.',
        'Vozilo 17, lokacija primalac Keln, čeka od 20:55 zbog nedostupne rampe. Klijent obavešten; odgovor obećan do 22:15. Noćna smena proverava u 22:15, eskalacija šefu smene u 22:30 ako termin nije potvrđen.',
        'Sve je pod kontrolom.'
      ],
      correct:[1,2],
      learning:'Predaja mora biti radno upotrebljiva: činjenice, otvorene tačke, vreme, odgovornost i prag eskalacije.'
    }
  ]
}

const ui = {
  de:{kicker:'KOSTENLOSER DISPO-CHECK',title:'Drei Fälle. Klare Entscheidungen. Sofortiges Feedback.',lead:'Bearbeiten Sie drei kurze Balkan–DACH-Situationen. Die erste Version bewertet transparent anhand fester Kriterien.',start:'Check starten',next:'Nächster Fall',finish:'Ergebnis anzeigen',question1:'Operativer erster Schritt',question2:'Kommunikation',reflection:'Was würden Sie zusätzlich dokumentieren?',placeholder:'Kurze Notiz – keine echten Personen-, Fahrzeug- oder Kundendaten eingeben',result:'Ihr vorläufiges Ergebnis',again:'Erneut starten',back:'Zurück zu DispoLab',level:['Grundlagen erforderlich','Mit Unterstützung einsetzbar','Operativ einsetzbar','Sicher in Standardsituationen','Sehr hohe Handlungssicherheit'],notice:'Interne DaniniHub-Simulation, keine offizielle Qualifikation und keine operative Weisung.',learn:'Warum das wichtig ist'},
  sr:{kicker:'BESPLATNI DISPO-CHECK',title:'Tri slučaja. Jasne odluke. Odmah povratna informacija.',lead:'Obradite tri kratke Balkan–DACH situacije. Prva verzija transparentno ocenjuje odgovore prema fiksnim kriterijumima.',start:'Pokreni proveru',next:'Sledeći slučaj',finish:'Prikaži rezultat',question1:'Prvi operativni korak',question2:'Komunikacija',reflection:'Šta biste dodatno dokumentovali?',placeholder:'Kratka beleška – ne unosite stvarne podatke o ljudima, vozilima ili klijentima',result:'Vaš preliminarni rezultat',again:'Pokreni ponovo',back:'Nazad na DispoLab',level:['Potrebne su osnove','Upotrebljiv uz podršku','Operativno upotrebljiv','Siguran u standardnim situacijama','Veoma visoka sigurnost u postupanju'],notice:'Interna DaniniHub simulacija, nije zvanična kvalifikacija niti operativni nalog.',learn:'Zašto je ovo važno'}
}

export default function FreeDispoCheck({lang}) {
  const t=ui[lang]
  const data=scenarios[lang]
  const [started,setStarted]=useState(false)
  const [index,setIndex]=useState(0)
  const [answers,setAnswers]=useState([])
  const [first,setFirst]=useState('')
  const [message,setMessage]=useState('')
  const [reflection,setReflection]=useState('')
  const [done,setDone]=useState(false)

  const score=useMemo(()=>{
    const raw=answers.reduce((sum,a)=>sum+(a.firstCorrect?20:0)+(a.messageCorrect?10:0)+(a.reflection?3.333:0),0)
    return Math.round(Math.min(100,raw))
  },[answers])
  const level=score<40?0:score<60?1:score<75?2:score<90?3:4

  const submit=()=>{
    if(first===''||message==='') return
    const item=data[index]
    const nextAnswers=[...answers,{firstCorrect:Number(first)===item.correct[0],messageCorrect:Number(message)===item.correct[1],reflection:reflection.trim(),learning:item.learning,title:item.title}]
    setAnswers(nextAnswers)
    setFirst('');setMessage('');setReflection('')
    if(index===data.length-1) setDone(true)
    else setIndex(index+1)
    scrollTo({top:0,behavior:'smooth'})
  }

  const reset=()=>{setStarted(false);setIndex(0);setAnswers([]);setFirst('');setMessage('');setReflection('');setDone(false);scrollTo({top:0,behavior:'smooth'})}

  if(!started) return <main className="fdc-shell"><section className="fdc-intro"><a href={lang==='sr'?'/sr/dispo-lab':'/de/dispolab'}>← {t.back}</a><p className="fdc-kicker">{t.kicker}</p><h1>{t.title}</h1><p>{t.lead}</p><div className="fdc-facts"><span>3</span><small>{lang==='sr'?'simulacije':'Simulationen'}</small><span>8–12</span><small>{lang==='sr'?'minuta':'Minuten'}</small><span>100</span><small>{lang==='sr'?'poena':'Punkte'}</small></div><button onClick={()=>setStarted(true)}>{t.start} →</button><p className="fdc-notice">{t.notice}</p></section></main>

  if(done) return <main className="fdc-shell"><section className="fdc-result"><p className="fdc-kicker">{t.result}</p><div className="fdc-result-score"><strong>{score}</strong><span>/100</span></div><h1>{t.level[level]}</h1><div className="fdc-bars"><div><span>{lang==='sr'?'Operativni izbor':'Operative Auswahl'}</span><b>{answers.filter(a=>a.firstCorrect).length}/3</b></div><div><span>{lang==='sr'?'Komunikacija':'Kommunikation'}</span><b>{answers.filter(a=>a.messageCorrect).length}/3</b></div><div><span>{lang==='sr'?'Dokumentovanje':'Dokumentation'}</span><b>{answers.filter(a=>a.reflection).length}/3</b></div></div><div className="fdc-learning">{answers.map(a=><article key={a.title}><h3>{a.title}</h3><p><strong>{t.learn}:</strong> {a.learning}</p></article>)}</div><p className="fdc-notice">{t.notice}</p><div className="fdc-actions"><button onClick={reset}>{t.again}</button><a href={lang==='sr'?'/sr/dispo-lab':'/de/dispolab'}>{t.back}</a></div></section></main>

  const item=data[index]
  return <main className="fdc-shell"><section className="fdc-check"><div className="fdc-progress"><span>{index+1}/3</span><div><i style={{width:`${((index+1)/3)*100}%`}}/></div></div><p className="fdc-kicker">{t.kicker}</p><h1>{item.title}</h1><p className="fdc-situation">{item.situation}</p><fieldset><legend>{t.question1}</legend>{item.firstOptions.map((option,i)=><label key={option}><input type="radio" name="first" value={i} checked={first===String(i)} onChange={e=>setFirst(e.target.value)}/><span>{option}</span></label>)}</fieldset><fieldset><legend>{t.question2}</legend>{item.messageOptions.map((option,i)=><label key={option}><input type="radio" name="message" value={i} checked={message===String(i)} onChange={e=>setMessage(e.target.value)}/><span>{option}</span></label>)}</fieldset><label className="fdc-reflection"><span>{t.reflection}</span><textarea value={reflection} onChange={e=>setReflection(e.target.value)} placeholder={t.placeholder} maxLength="500"/></label><button disabled={first===''||message===''} onClick={submit}>{index===2?t.finish:t.next} →</button><p className="fdc-notice">{t.notice}</p></section></main>
}
