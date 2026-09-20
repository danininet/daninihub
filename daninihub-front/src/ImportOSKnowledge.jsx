import './ImportOSKnowledge.css'

export const ARTICLES=[
  {
    slug:'deutschland-selbstimport',
    de:{kicker:'DIY IMPORT · DE → RS',title:'Auto selbst aus Deutschland nach Serbien importieren: die Reihenfolge, die Geld spart',lead:'Der kritische Punkt ist nicht das Kennzeichen, sondern die Reihenfolge: Eigentum, VIN, Ausfuhr, Ursprung, Transportweg und erst dann Zahlung.',sections:[
      ['1. Vor der Zahlung','VIN, Verkäuferidentität, Kaufvertrag/Rechnung, Fahrzeugpapiere und steuerliche Verkaufsart müssen zusammenpassen. Kein großer Betrag nur aufgrund eines Inserats.'],
      ['2. Ausfuhr aus Deutschland','Bei der Ausfuhr eines Fahrzeugs in einen Nicht-EU-Staat ist grundsätzlich eine Ausfuhranmeldung erforderlich. Bei Ausfuhr auf eigener Achse kann die Grenzzollstelle unter bestimmten Bedingungen die Abfertigung übernehmen.'],
      ['3. Präferenz ist kein Automatismus','Ein in Deutschland verkauftes Auto ist nicht automatisch präferenzberechtigt. Für Zollvorteile im Bestimmungsland muss der Ursprung nach den einschlägigen Regeln nachgewiesen werden.'],
      ['4. Erst danach Landed Cost','Kaufpreis, Export, Transport, Zoll/PDV-Szenario, technische Prüfung, Registrierung und Startservice gehören in eine Rechnung.']
    ],sources:[['Deutscher Zoll – Ausfuhr von Kraftfahrzeugen','https://www.zoll.de/DE/Privatpersonen/Reisen/Reisen-nach-Deutschland-aus-einem-nicht-eu-Staat/Zoll-und-Steuern/Kauf-von-Kraftfahrzeugen/kauf-von-kraftfahrzeugen.html']]},
    sr:{kicker:'SAMOSTALNI UVOZ · DE → RS',title:'Kako samostalno uvesti auto iz Nemačke u Srbiju bez skupih grešaka',lead:'Ključ nije samo izvozna tablica nego redosled: vlasništvo, VIN, izvoz, poreklo, način prevoza i tek onda konačna uplata.',sections:[
      ['1. Pre uplate','VIN, identitet prodavca, ugovor/račun, saobraćajni dokumenti i način prodaje moraju biti međusobno logični.'],
      ['2. Izvoz iz Nemačke','Za izvoz vozila iz EU u zemlju van EU u pravilu postoji izvozni carinski postupak. Nemačka carina navodi i posebne mogućnosti za vozila koja izlaze na sopstvenim točkovima.'],
      ['3. Poreklo nije isto što i zemlja prodaje','Auto kupljen u Nemačkoj nije automatski vozilo preferencijalnog porekla. Dokument o poreklu mora biti validan za konkretnu robu i režim.'],
      ['4. Tek onda ukupna cena','Kupovna cena + izvoz + transport + carina/PDV scenario + tehnički postupak + registracija + početni servis = realna odluka.']
    ],sources:[['Nemačka carina – izvoz vozila','https://www.zoll.de/DE/Privatpersonen/Reisen/Reisen-nach-Deutschland-aus-einem-nicht-eu-Staat/Zoll-und-Steuern/Kauf-von-Kraftfahrzeugen/kauf-von-kraftfahrzeugen.html']]}
  },
  {
    slug:'schweiz-import',
    de:{kicker:'CH → RS',title:'Fahrzeug aus der Schweiz: fünf Punkte, die vor dem Kauf geklärt werden müssen',lead:'Die Schweiz ist kein EU-Mitglied. Exportdeklaration, Fahrzeugausweis, Ursprung und Transportweg müssen als eigener Workflow behandelt werden.',sections:[
      ['Exportdeklaration','Für den permanenten Export verlangt die Schweizer Zollbehörde eine Ausfuhranmeldung und die notwendigen Unterlagen.'],
      ['Ursprungsnachweis vor Export','Wer im Bestimmungsland eine Präferenz beantragen will, sollte den Ursprungsnachweis vor der Ausfuhr klären; die Schweizer Behörde weist ausdrücklich darauf hin.'],
      ['Kennzeichen oder Transport','Exportkontrollschilder sind eine Möglichkeit; alternativ kann das Fahrzeug verladen werden.'],
      ['Kosten nicht mit DE gleichsetzen','CHF/EUR-Kurs, Exportformalitäten und Herkunftsszenario gehören separat in den Import Passport.']
    ],sources:[['BAZG – Vehicle Export from Switzerland','https://www.bazg.admin.ch/en/export-vehicles-switzerland']]},
    sr:{kicker:'ŠVAJCARSKA → SRBIJA',title:'Uvoz iz Švajcarske: pet stvari koje moraju biti rešene pre kupovine',lead:'Švajcarska nije EU. Izvozna deklaracija, Fahrzeugausweis, poreklo i način transporta moraju biti poseban tok.',sections:[
      ['Izvozna deklaracija','Švajcarska carina za trajni izvoz traži prijavu izvoza i odgovarajuću dokumentaciju.'],
      ['Dokaz porekla pre izvoza','Ako se u zemlji odredišta traži preferencijalni tretman, švajcarska carina navodi da dokaz porekla treba rešiti pre izvoza.'],
      ['Tablice ili transport','Moguće su izvozne tablice ili utovar na drugo transportno sredstvo.'],
      ['Ne kopirati nemačku kalkulaciju','CHF/EUR kurs, izvoz i poreklo moraju imati poseban scenario.']
    ],sources:[['Švajcarska carina BAZG – izvoz vozila','https://www.bazg.admin.ch/en/export-vehicles-switzerland']]}
  },
  {
    slug:'eur1-herkunft',
    de:{kicker:'ORIGIN RISK',title:'EUR.1: Warum ein versprochenes Dokument nicht dasselbe ist wie ein akzeptierter Ursprung',lead:'ImportOS trennt „Dokument versprochen“ von „Ursprung belastbar nachgewiesen“. Genau hier kann die Gesamtrechnung kippen.',sections:[
      ['Verkaufsland ≠ Ursprung','Der Ort des Kaufs beweist den präferenziellen Ursprung nicht.'],
      ['Dokument vor Geld','Wenn der Zollvorteil für die Kalkulation entscheidend ist, muss der Nachweis vor Kauf oder spätestens vor der relevanten Zollentscheidung geklärt werden.'],
      ['Zwei Szenarien statt Wunschdenken','Bei unklarem Ursprung zeigt ImportOS einen günstigen und einen Standard-Zollszenario-Korridor.'],
      ['Nachträgliche Beschaffung ist Risiko','Schweizer Zollinformationen weisen darauf hin, dass Ursprungsnachweise für den Präferenzimport vor Export ausgestellt werden sollen.']
    ],sources:[['BAZG – Vehicle Export from Switzerland','https://www.bazg.admin.ch/en/export-vehicles-switzerland']]},
    sr:{kicker:'RIZIK POREKLA',title:'EUR.1: zašto „dobićeš papir“ nije isto što i dokazano poreklo',lead:'ImportOS odvaja obećani dokument od stvarno proverljivog porekla. Upravo tu kalkulacija može da se promeni za ozbiljan iznos.',sections:[
      ['Zemlja prodaje nije poreklo','Kupovina u Nemačkoj ili Švajcarskoj sama po sebi ne dokazuje preferencijalno poreklo.'],
      ['Dokaz pre odluke','Ako carinska povlastica odlučuje da li se kupovina isplati, dokaz mora biti razjašnjen pre nego što računamo najpovoljniji scenario kao realan.'],
      ['Dva scenarija','Kad poreklo nije potvrđeno, sistem prikazuje preferencijalni i standardni scenario umesto jedne optimistične cifre.'],
      ['Naknadni papir je rizik','Švajcarska carina preporučuje da izvoznik izda dokaz porekla pre izvoza kada se cilja preferencijalni uvoz u zemlji odredišta.']
    ],sources:[['BAZG – Vehicle Export from Switzerland','https://www.bazg.admin.ch/en/export-vehicles-switzerland']]}
  },
  {
    slug:'safebuy-vor-kaution',
    de:{kicker:'SAFEBUY',title:'Vor Anzahlung: 10-Minuten-Stopcheck gegen die teuersten Fehler',lead:'Kein Algorithmus kann einen unbekannten Verkäufer „garantieren“. Ein guter Prozess kann aber verhindern, dass Warnsignale ignoriert werden.',sections:[
      ['VIN zuerst','Keine ernsthafte Kaufentscheidung ohne VIN und Dokumentabgleich.'],
      ['Empfänger der Zahlung','Kontoinhaber, Verkäufer und Dokumente müssen erklärbar zusammenpassen.'],
      ['Vorkasse ist ein Risikosignal','Besonders bei unbekannten Verkäufern darf Zeitdruck kein Ersatz für Verifizierung sein.'],
      ['Zu billig ist eine Frage, kein Bonus','Starke Preisabweichungen müssen erklärt werden: Unfall, Export, Steuer, Laufleistung, Defekt oder Betrugsversuch.']
    ],sources:[['mobile.de – Sicherheitshinweise','https://www.mobile.de/service/securityAdvice']]},
    sr:{kicker:'SAFEBUY',title:'Pre kapare: desetominutna provera koja može sačuvati hiljade evra',lead:'Nijedan algoritam ne može da garantuje nepoznatog prodavca. Dobar proces može da spreči da se crvene zastavice ignorišu.',sections:[
      ['VIN pre novca','Bez VIN-a i poređenja sa dokumentima nema ozbiljne odluke.'],
      ['Kome ide uplata','Vlasnik računa, prodavac i dokumenti moraju imati logično objašnjenje.'],
      ['Avans je signal za dodatnu proveru','Pritisak da se odmah uplati nije dokaz da je ponuda dobra.'],
      ['Preniska cena traži razlog','Veliko odstupanje od tržišta mora imati proverljivo objašnjenje.']
    ],sources:[['mobile.de – bezbednosna upozorenja','https://www.mobile.de/service/securityAdvice']]}
  },
  {
    slug:'oldtimer-30-plus',
    de:{kicker:'HISTORIC / OLDTIMER',title:'30 Jahre alt reicht nicht: Was beim historischen Fahrzeug wirklich geprüft wird',lead:'Alter ist nur der Einstieg. Fahrbereitschaft, Originalität bzw. annähernde Originalität und die technische Dokumentation spielen eine zentrale Rolle.',sections:[
      ['30+ Jahre','Die serbische Verkehrssicherheitsagentur definiert historische Fahrzeuge grundsätzlich als vor 30 oder mehr Jahren hergestellte oder erstmals zugelassene Fahrzeuge, sofern weitere Bedingungen erfüllt sind.'],
      ['Originalität','Der Zustand muss original oder annähernd original sein; Änderungen können relevant sein.'],
      ['Fahrbereit','Die Funktionsprüfung gehört zum Verfahren.'],
      ['Dokumentation spart Zeit','Technische Unterlagen, Fotos und belastbare Quellen zu Originalzustand und Spezifikation können das Verfahren erleichtern.']
    ],sources:[['ABS Serbia – Vozila od istorijskog značaja','https://www.abs.gov.rs/rsl/vozila_od_istorijskog_znacaja']]},
    sr:{kicker:'OLDTAJMER 30+',title:'Trideset godina nije dovoljno: šta se stvarno proverava kod oldtajmera',lead:'Starost je samo početak. Vozno stanje, originalnost ili približna originalnost i tehnička dokumentacija su deo postupka.',sections:[
      ['30+ godina','ABS navodi da vozilo od istorijskog značaja mora biti proizvedeno ili registrovano pre 30 i više godina, uz dodatne uslove.'],
      ['Originalnost','Pregled obuhvata originalnost i očuvanost u originalnom ili približno originalnom stanju.'],
      ['Vozno stanje','Proverava se funkcionalnost sa ciljem da se potvrdi da je vozilo u voznom stanju.'],
      ['Dokumentacija pomaže','Tehnička dokumenta, fotografije i relevantni izvori mogu pomoći postupku i potvrdi stvarnih karakteristika.']
    ],sources:[['Agencija za bezbednost saobraćaja – oldtajmeri','https://www.abs.gov.rs/rsl/vozila_od_istorijskog_znacaja']]}
  },
  {
    slug:'transport-entscheidung',
    de:{kicker:'OWN WHEELS / TRAILER / TRUCK',title:'Fahren, Trailer oder Autotransporter: nicht der billigste Weg ist automatisch der richtige',lead:'Die Transportart ist Teil des Risikomanagements. Fahrbereitschaft, Zulassung, Versicherung, Entfernung, Fahrzeugwert und Anzahl der Fahrzeuge ändern die Entscheidung.',sections:[
      ['Auf eigener Achse','Sinnvoll nur wenn Fahrzeug technisch fahrbereit ist und Kennzeichen, Versicherung und Vollmacht die gesamte Route abdecken.'],
      ['Trailer','Interessant für nicht zugelassene, nicht fahrbereite oder besonders schützenswerte Einzelfahrzeuge.'],
      ['Lkw / Autotransporter','Bei mehreren Fahrzeugen oder langen Relationen kann gebündelter Transport wirtschaftlicher und operativ sauberer sein.'],
      ['ImportOS trennt Kosten','Fahrerhonorar, Kraftstoff, Maut, Kennzeichen, Versicherung, Anreise/Rückreise und Transportpartner werden nicht in einer Fantasiepauschale versteckt.']
    ],sources:[['Deutscher Zoll – Ausfuhr von Kraftfahrzeugen','https://www.zoll.de/DE/Privatpersonen/Reisen/Reisen-nach-Deutschland-aus-einem-nicht-eu-Staat/Zoll-und-Steuern/Kauf-von-Kraftfahrzeugen/kauf-von-kraftfahrzeugen.html'],['BAZG – Vehicle Export from Switzerland','https://www.bazg.admin.ch/en/export-vehicles-switzerland']]},
    sr:{kicker:'TOČKOVI / PRIKOLICA / KAMION',title:'Vožnja, prikolica ili autotransporter: najjeftinije nije uvek najpametnije',lead:'Način dovoza je deo upravljanja rizikom. Ispravnost, tablice, osiguranje, udaljenost, vrednost vozila i broj automobila menjaju odluku.',sections:[
      ['Na točkovima','Ima smisla samo kad je vozilo tehnički sposobno i kada tablice, osiguranje i ovlašćenje pokrivaju rutu.'],
      ['Prikolica','Dobra opcija za neregistrovana, neispravna ili vrednija pojedinačna vozila.'],
      ['Kamion / autotransporter','Za više vozila ili duže relacije grupni prevoz može biti racionalniji.'],
      ['Troškovi moraju biti razdvojeni','Vozač, gorivo, putarine, tablice, osiguranje, dolazak/povrat i transport partner nisu jedna izmišljena paušala.']
    ],sources:[['Nemačka carina – izvoz vozila','https://www.zoll.de/DE/Privatpersonen/Reisen/Reisen-nach-Deutschland-aus-einem-nicht-eu-Staat/Zoll-und-Steuern/Kauf-von-Kraftfahrzeugen/kauf-von-kraftfahrzeugen.html'],['Švajcarska carina – izvoz vozila','https://www.bazg.admin.ch/en/export-vehicles-switzerland']]}
  }
]

export function articleBySlug(slug){return ARTICLES.find(x=>x.slug===slug)||null}

export default function ImportOSKnowledge({lang='de',slug}){
  const article=articleBySlug(slug)
  if(!article)return <main className="iok"><a href={`/${lang}/`}>← DANINI</a><h1>404</h1></main>
  const x=article[lang]||article.de
  return <div className="iok">
    <header className="iok-head"><a href={`/${lang}/`}><img src="/importos-mark.svg" alt=""/><span><strong>DANINI</strong><small>AUTOMOTIVE IMPORT INTELLIGENCE</small></span></a></header>
    <main>
      <a className="iok-back" href={`/${lang}/#wissen`}>← {lang==='sr'?'Vodiči':'Ratgeber'}</a>
      <p className="iok-kicker">{x.kicker}</p>
      <h1>{x.title}</h1>
      <p className="iok-lead">{x.lead}</p>
      <div className="iok-rail"><span>SEARCH</span><span>VERIFY</span><span>DECIDE</span><span>EXECUTE</span></div>
      {x.sections.map(([h,p])=><section key={h}><h2>{h}</h2><p>{p}</p></section>)}
      <aside><h3>{lang==='sr'?'Izvori':'Quellen'}</h3>{x.sources.map(([name,url])=><a key={url} href={url} target="_blank" rel="noreferrer">{name} ↗</a>)}</aside>
      <p className="iok-note">{lang==='sr'?'Ovo je informativni vodič, ne zvanična carinska, poreska ili tehnička odluka.':'Dieser Ratgeber ist informativ und keine verbindliche Zoll-, Steuer- oder technische Entscheidung.'}</p>
    </main>
  </div>
}
