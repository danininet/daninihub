import {useEffect} from 'react'
import './ImportOSKnowledge.css'
import {applySeo,organization} from './seo'

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
  },
  {
    slug:'landed-cost-kalkulation',
    de:{kicker:'LANDED COST',title:'Was kostet der Autoimport wirklich? Die vollständige Rechnung vor dem Kauf',lead:'Der Kaufpreis ist nur die erste Zeile. Eine belastbare Entscheidung berücksichtigt Export, Transport, Ursprung, Abgaben, Prüfung, Zulassung und den ersten Service.',sections:[
      ['Kaufpreis richtig einordnen','Klären Sie, ob der Preis brutto, netto oder differenzbesteuert ist und welche Unterlagen der Verkäufer tatsächlich ausstellt. Ein scheinbar günstiger Nettopreis kann für den privaten Käufer wertlos sein.'],
      ['Export und Transport separat rechnen','Ausfuhrkennzeichen, Versicherung, Anreise, Kraftstoff, Maut oder Transportpartner gehören als eigene Positionen in die Rechnung. Nur so lassen sich eigene Achse, Trailer und Autotransporter fair vergleichen.'],
      ['Ursprung in zwei Szenarien abbilden','Wenn der Präferenzursprung nicht belastbar belegt ist, braucht die Kalkulation mindestens ein günstiges und ein Standard-Zollszenario. Eine versprochene EUR.1 ist noch kein akzeptierter Nachweis.'],
      ['Kosten nach der Grenze nicht vergessen','Spedition/Zollvertretung, technische Verfahren, Übersetzungen, Registrierung, Versicherung und ein realistischer Startservice entscheiden oft, ob das Fahrzeug am Ende noch attraktiv ist.'],
      ['Mit dem Marktwert in Serbien vergleichen','Relevant ist nicht nur der Gesamtaufwand, sondern auch der Abstand zu einem vergleichbaren, bereits zugelassenen Fahrzeug in Serbien. Reserve für Reparaturen und Preisabweichungen einplanen.']
    ],sources:[['Uprava carina Srbije – informacije za građane','https://www.carina.rs/putnici/pitanja-i-odgovori/uvoz-motornih-vozila.html'],['Deutscher Zoll – Ausfuhr von Kraftfahrzeugen','https://www.zoll.de/DE/Privatpersonen/Reisen/Reisen-nach-Deutschland-aus-einem-nicht-eu-Staat/Zoll-und-Steuern/Kauf-von-Kraftfahrzeugen/kauf-von-kraftfahrzeugen.html']]},
    sr:{kicker:'UKUPAN TROŠAK UVOZA',title:'Koliko stvarno košta uvoz automobila? Potpuna računica pre kupovine',lead:'Kupovna cena je samo prvi red. Ozbiljna odluka uključuje izvoz, dovoz, poreklo, dažbine, ispitivanje, registraciju i početni servis.',sections:[
      ['Razjasnite kupovnu cenu','Proverite da li je cena bruto, neto ili se primenjuje oporezivanje marže i kakav račun prodavac zaista izdaje. Privatni kupac ne sme računati na neto cenu bez osnova.'],
      ['Odvojite izvoz i dovoz','Izvozne tablice, osiguranje, put do vozila, gorivo, putarine ili prevoznik moraju biti zasebne stavke. Tek tada se mogu pošteno porediti vožnja, prikolica i autotransporter.'],
      ['Računajte dva scenarija porekla','Ako preferencijalno poreklo nije dokazano, računica mora imati povoljniji i standardni carinski scenario. Obećani EUR.1 nije isto što i prihvaćen dokaz.'],
      ['Dodajte troškove u Srbiji','Carinsko zastupanje, tehnički postupci, prevodi, registracija, osiguranje i realan početni servis često odlučuju da li se kupovina isplati.'],
      ['Uporedite sa tržišnom vrednošću','Ukupan trošak treba porediti sa sličnim već registrovanim vozilom u Srbiji, uz rezervu za kvarove, servis i odstupanje prodajne cene.']
    ],sources:[['Uprava carina Srbije – uvoz motornih vozila','https://www.carina.rs/putnici/pitanja-i-odgovori/uvoz-motornih-vozila.html'],['Nemačka carina – izvoz vozila','https://www.zoll.de/DE/Privatpersonen/Reisen/Reisen-nach-Deutschland-aus-einem-nicht-eu-Staat/Zoll-und-Steuern/Kauf-von-Kraftfahrzeugen/kauf-von-kraftfahrzeugen.html']]}
  },
  {
    slug:'vin-dokumente-checkliste',
    de:{kicker:'VIN + DOKUMENTE',title:'VIN- und Dokumentencheck vor Zahlung: die praktische Käufer-Checkliste',lead:'Betrug und Importprobleme beginnen oft dort, wo Inserat, Verkäufer, Kontoinhaber, VIN und Fahrzeugpapiere nicht sauber zusammenpassen.',sections:[
      ['VIN an mehreren Stellen vergleichen','Die 17-stellige VIN im Inserat, an der Karosserie, im Fahrzeugschein und in weiteren Unterlagen muss identisch und plausibel sein. Abweichungen werden vor jeder Zahlung geklärt.'],
      ['Verkäufer und Eigentumsweg prüfen','Name und Rolle des Verkäufers, Rechnung oder Kaufvertrag, Kontoinhaber und Fahrzeughalter müssen eine nachvollziehbare Kette bilden. Ein Drittkonto ohne belastbare Erklärung ist ein Warnsignal.'],
      ['Dokumente nicht nur als Foto sammeln','Lesbarkeit, Vollständigkeit, Rückseiten, Stempel, Unterschriften und zeitliche Logik sind wichtig. Sensible Daten nur über einen sicheren, vereinbarten Weg austauschen.'],
      ['Historie ist kein Zustandsbericht','Digitale Historienberichte können helfen, ersetzen aber weder Dokumentabgleich noch eine reale technische Prüfung. Fehlende Einträge beweisen keinen unfallfreien Zustand.'],
      ['Zahlungsweg dokumentieren','Preis, Empfänger, Zweck, Fahrzeug/VIN, Bedingungen und Übergabe gehören schriftlich festgehalten. Zeitdruck darf keinen Prüfschritt überspringen.']
    ],sources:[['mobile.de – Sicherheitshinweise','https://www.mobile.de/service/securityAdvice'],['ADAC – Gebrauchtwagenkauf','https://www.adac.de/rund-ums-fahrzeug/auto-kaufen-verkaufen/gebrauchtwagenkauf/']]},
    sr:{kicker:'VIN + DOKUMENTACIJA',title:'Provera VIN-a i dokumenata pre uplate: praktična kontrolna lista',lead:'Prevara i problemi pri uvozu često počinju tamo gde se oglas, prodavac, vlasnik računa, VIN i dokumenti vozila ne poklapaju.',sections:[
      ['Uporedite VIN na više mesta','VIN od 17 znakova u oglasu, na karoseriji, u saobraćajnim dokumentima i drugim papirima mora biti isti i logičan. Svako odstupanje se rešava pre uplate.'],
      ['Proverite prodavca i tok vlasništva','Ime i uloga prodavca, račun ili ugovor, vlasnik računa i vlasnik vozila moraju činiti objašnjiv lanac. Tuđi račun bez pouzdanog razloga je crvena zastavica.'],
      ['Ne skupljajte samo fotografije papira','Važni su čitljivost, sve stranice, poleđine, pečati, potpisi i vremenska logika. Osetljive podatke razmenjujte samo dogovorenim bezbednim putem.'],
      ['Izveštaj istorije nije pregled vozila','Digitalni izveštaji mogu pomoći, ali ne zamenjuju poređenje dokumenata i stvarni tehnički pregled. Odsustvo zapisa nije dokaz da vozilo nije havarisano.'],
      ['Dokumentujte način plaćanja','Cena, primalac, svrha, vozilo/VIN, uslovi i primopredaja treba da budu napisani. Pritisak i žurba nisu razlog da se preskoči provera.']
    ],sources:[['mobile.de – bezbednosna upozorenja','https://www.mobile.de/service/securityAdvice'],['ADAC – kupovina polovnog vozila','https://www.adac.de/rund-ums-fahrzeug/auto-kaufen-verkaufen/gebrauchtwagenkauf/']]}
  }
]

export function articleBySlug(slug){return ARTICLES.find(x=>x.slug===slug)||null}

export default function ImportOSKnowledge({lang='de',slug}){
  const article=articleBySlug(slug)
  if(!article)return <main className="iok"><a href={`/${lang}/`}>← DANINI</a><h1>404</h1></main>
  const x=article[lang]||article.de
  const sr=lang==='sr'
  const path=sr?`/sr/vodic/${slug}`:`/de/wissen/${slug}`
  const dePath=`/de/wissen/${slug}`,srPath=`/sr/vodic/${slug}`
  const related=ARTICLES.filter(a=>a.slug!==slug).slice(0,3)
  const faq=sr?[
    ['Da li je ovaj vodič zamena za zvaničnu odluku carine ili tehničke službe?','Ne. Vodič pomaže da pripremite dokumente i prepoznate rizik, ali konačnu odluku donosi nadležni organ za konkretno vozilo.'],
    ['Kada je pravi trenutak za uplatu vozila?','Tek kada su identitet prodavca, VIN, dokumenti, poreklo, način izvoza i realan ukupni trošak dovoljno provereni.'],
    ['Kako DANINI može da pomogne?','Možete prvo pokrenuti besplatan QuickCheck, a zatim zatražiti pregled vozila, proveru dokumentacije, delove ili dovoz.']
  ]:[
    ['Ersetzt dieser Ratgeber eine verbindliche Zoll- oder Technikentscheidung?','Nein. Er strukturiert die Vorbereitung und macht Risiken sichtbar; verbindlich entscheidet die zuständige Stelle für das konkrete Fahrzeug.'],
    ['Wann sollte das Fahrzeug bezahlt werden?','Erst wenn Verkäufer, VIN, Dokumente, Ursprung, Ausfuhrweg und realistische Gesamtkosten ausreichend geprüft sind.'],
    ['Wie kann DANINI unterstützen?','Starten Sie mit dem kostenlosen QuickCheck und fragen Sie danach Fahrzeugprüfung, Dokumentencheck, Teile oder Überführung an.']
  ]
  useEffect(()=>{
    const description=x.lead.length>158?x.lead.slice(0,155)+'…':x.lead
    applySeo({lang,title:`${x.title} | DANINI`,description,path,dePath,srPath,type:'article',schema:[organization,{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'DANINI',item:'https://daninihub.com/'+lang+'/'},{'@type':'ListItem',position:2,name:sr?'Vodiči':'Ratgeber',item:'https://daninihub.com/'+lang+'/#wissen'},{'@type':'ListItem',position:3,name:x.title,item:'https://daninihub.com'+path}]},{'@type':'Article',headline:x.title,description,mainEntityOfPage:'https://daninihub.com'+path,author:{'@id':'https://daninihub.com/#organization'},publisher:{'@id':'https://daninihub.com/#organization'},dateModified:'2026-09-21',inLanguage:lang},{'@type':'FAQPage',mainEntity:faq.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))}]})
  },[lang,slug])
  return <div className="iok">
    <header className="iok-head"><a href={`/${lang}/`}><img src="/importos-mark.svg" alt="DANINI"/><span><strong>DANINI</strong><small>AUTOMOTIVE IMPORT INTELLIGENCE</small></span></a><nav><a href={`/${lang}/#passport`}>QuickCheck</a><a href={`/${lang}/#inspection`}>{sr?'Pregled':'Prüfung'}</a><a href={`/${lang}/#service-request`}>{sr?'Pošalji upit':'Anfrage'}</a></nav></header>
    <main>
      <div className="iok-crumbs"><a href={`/${lang}/`}>DANINI</a><span>/</span><a href={`/${lang}/#wissen`}>{sr?'Vodiči':'Ratgeber'}</a><span>/</span><b>{x.kicker}</b></div>
      <p className="iok-kicker">{x.kicker}</p>
      <h1>{x.title}</h1>
      <p className="iok-lead">{x.lead}</p>
      <div className="iok-meta"><span>{sr?'Ažurirano':'Aktualisiert'} 21.09.2026</span><span>{Math.max(5,x.sections.length*2)} min</span><span>{sr?'Stručni vodič':'Praxisratgeber'}</span></div>
      <div className="iok-rail"><span>SEARCH</span><span>VERIFY</span><span>DECIDE</span><span>EXECUTE</span></div>
      <div className="iok-layout"><article className="iok-article">
        <div className="iok-summary"><strong>{sr?'Najvažnije pre odluke':'Vor der Entscheidung'}</strong><ul>{x.sections.map(([h])=><li key={h}>{h.replace(/^\d+\.\s*/, '')}</li>)}</ul></div>
        {x.sections.map(([h,p],i)=><section id={`korak-${i+1}`} key={h}><span className="iok-number">{String(i+1).padStart(2,'0')}</span><h2>{h}</h2><p>{p}</p>{i===1&&<a className="iok-inline" href={`/${lang}/#passport`}>{sr?'Proveri svoj slučaj kroz besplatan QuickCheck →':'Eigenen Fall im kostenlosen QuickCheck prüfen →'}</a>}</section>)}
        <div className="iok-faq"><p className="iok-kicker">FAQ</p><h2>{sr?'Česta pitanja':'Häufige Fragen'}</h2>{faq.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
      </article><aside className="iok-side"><div><h3>{sr?'Zvanični izvori':'Offizielle Quellen'}</h3>{x.sources.map(([name,url])=><a key={url} href={url} target="_blank" rel="noreferrer nofollow">{name} ↗</a>)}</div><div className="iok-cta"><span>DANINI QUICKCHECK</span><strong>{sr?'Proveri rizik pre uplate.':'Risiko vor Zahlung prüfen.'}</strong><p>{sr?'Trošak, poreklo, dokumenti i crvene zastavice u jednom toku.':'Kosten, Ursprung, Dokumente und Warnsignale in einem Ablauf.'}</p><a href={`/${lang}/#passport`}>{sr?'Pokreni besplatno':'Kostenlos starten'} →</a></div></aside></div>
      <section className="iok-related"><p className="iok-kicker">{sr?'POVEZANI VODIČI':'WEITERLESEN'}</p><h2>{sr?'Nastavite proveru':'Prüfung fortsetzen'}</h2><div>{related.map(a=>{const y=a[lang]||a.de;return <a key={a.slug} href={sr?`/sr/vodic/${a.slug}`:`/de/wissen/${a.slug}`}><span>{y.kicker}</span><strong>{y.title}</strong><b>{sr?'Otvori vodič':'Ratgeber öffnen'} →</b></a>})}</div></section>
      <p className="iok-note">{sr?'Informativni vodič; nije zvanična carinska, poreska, pravna ili tehnička odluka. Pre uplate proverite aktuelna pravila za konkretno vozilo.':'Informationsratgeber; keine verbindliche Zoll-, Steuer-, Rechts- oder Technikentscheidung. Prüfen Sie vor Zahlung die aktuellen Regeln für das konkrete Fahrzeug.'}</p>
    </main>
  </div>
}
