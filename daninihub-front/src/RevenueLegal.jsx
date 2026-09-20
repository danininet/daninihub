import './RevenueOSLanding.css'

const updated = '20.09.2026'

function Wrap({lang,title,children}){
  return <div className="ros">
    <header className="ros-header">
      <a className="ros-brand" href={`/${lang}/`}>
        <span className="ros-mark">D</span>
        <span><strong>DaniniHub</strong><small>Danini ImportOS</small></span>
      </a>
    </header>
    <main className="ros-section" style={{maxWidth:'940px'}}>
      <p className="ros-eyebrow">LEGAL & TRUST</p>
      <h1 style={{fontSize:'clamp(42px,6vw,68px)',letterSpacing:'-.04em',lineHeight:1.04}}>{title}</h1>
      <p className="ros-muted">Stand / stanje: {updated}</p>
      {children}
      <p style={{marginTop:'42px'}}><a href={`/${lang}/`}>← DaniniHub</a></p>
    </main>
  </div>
}

function Imprint({lang}){
  const sr=lang==='sr'
  return <Wrap lang={lang} title={sr?'Impresum':'Impressum'}>
    <h2 style={{fontSize:'28px',marginTop:'38px'}}>{sr?'Pružalac digitalne usluge':'Diensteanbieter'}</h2>
    <p>
      Dragan Zdravković<br/>
      DaniniHub<br/>
      Fischerstraße 54<br/>
      47055 Duisburg · Deutschland<br/>
      <a href="mailto:info@daninihub.com">info@daninihub.com</a><br/>
      <a href="tel:+4915730916621">+49 1573 0916621</a>
    </p>
    <p>{sr
      ? 'Javni ImportOS QuickCheck je namenjen informisanju privatnih kupaca i profesionalnih uvoznika. Plaćeni proizvodi i usluge aktiviraju se samo kroz jasno označen checkout ili posebnu ponudu; običan kontakt ili QuickCheck ne zaključuju ugovor.'
      : 'Der öffentliche ImportOS-QuickCheck dient der Information privater Käufer und professioneller Importeure. Bezahlte Produkte und Leistungen werden nur über einen klar gekennzeichneten Checkout oder ein gesondertes Angebot aktiviert; Kontakt und QuickCheck schließen keinen Vertrag.'}</p>
    <h2 style={{fontSize:'28px',marginTop:'38px'}}>{sr?'Napomena o obaveznim podacima':'Hinweis zu weiteren Pflichtangaben'}</h2>
    <p>{sr
      ? 'Ako postoji upis u registar, nadležna komora/nadzorni organ, Umsatzsteuer-ID ili Wirtschafts-ID koja po zakonu mora biti navedena, taj podatak se mora dodati pre relevantne komercijalne ponude. U javnom kodu trenutno ne navodimo broj koji nije potvrđen.'
      : 'Soweit eine Registereintragung, zuständige Kammer/Aufsichtsbehörde, Umsatzsteuer-Identifikationsnummer oder Wirtschafts-Identifikationsnummer gesetzlich anzugeben ist, wird diese vor dem entsprechenden kommerziellen Angebot ergänzt. Es werden keine nicht verifizierten Nummern veröffentlicht.'}</p>
    <p className="ros-muted">{sr?'Pravna osnova za nemački impresum: § 5 DDG.':'Rechtsgrundlage der deutschen Anbieterkennzeichnung: § 5 DDG.'}</p>
  </Wrap>
}

function Privacy({lang}){
  const sr=lang==='sr'
  return <Wrap lang={lang} title={sr?'Privatnost / GDPR':'Datenschutzerklärung'}>
    <h2 style={{fontSize:'28px',marginTop:'38px'}}>{sr?'1. Odgovorno lice':'1. Verantwortlicher'}</h2>
    <p>Dragan Zdravković · DaniniHub · Fischerstraße 54 · 47055 Duisburg · Deutschland · <a href="mailto:info@daninihub.com">info@daninihub.com</a> · <a href="tel:+4915730916621">+49 1573 0916621</a></p>

    <h2 style={{fontSize:'28px',marginTop:'38px'}}>{sr?'2. Koje podatke obrađujemo':'2. Welche Daten wir verarbeiten'}</h2>
    <p>{sr
      ? 'Kod ImportOS upita ili narudžbine obrađujemo ime ili firmu, e-mail, podatke koje korisnik unese o vozilu i troškovima, izabrani jezik, vreme prijema i tehničke serverske zapise. Kod plaćanja provajder plaćanja obrađuje podatke potrebne za transakciju; DaniniHub ne treba podatke platne kartice kroz javni formular.'
      : 'Bei einer ImportOS-Anfrage oder Bestellung verarbeiten wir Name/Firma, E-Mail, die vom Nutzer eingegebenen Fahrzeug- und Kostendaten, Sprache, Eingangszeit sowie technische Serverprotokolle. Zahlungsdaten werden beim Zahlungsanbieter verarbeitet; DaniniHub benötigt keine Kartendaten im öffentlichen Formular.'}</p>

    <h2 style={{fontSize:'28px',marginTop:'38px'}}>{sr?'3. Svrhe i pravni osnov':'3. Zwecke und Rechtsgrundlagen'}</h2>
    <p>{sr
      ? 'Podatke koristimo za odgovor na upit, proveru da li postoji odgovarajući tržišni test, pripremu ponude, tehničku bezbednost i zaštitu od zloupotrebe. Za upite koji služe mogućem ugovoru osnova je čl. 6 st. 1 tač. b GDPR; za bezbednost, dokumentovanje i nužnu poslovnu komunikaciju čl. 6 st. 1 tač. f GDPR.'
      : 'Wir nutzen die Daten zur Beantwortung der Anfrage, zur Prüfung eines passenden Markttests, zur Angebotsvorbereitung, für technische Sicherheit und Missbrauchsabwehr. Soweit die Anfrage auf einen möglichen Vertrag zielt, ist Art. 6 Abs. 1 lit. b DSGVO Rechtsgrundlage; für Sicherheit, Nachweis und notwendige Geschäftskommunikation Art. 6 Abs. 1 lit. f DSGVO.'}</p>
    <p>{sr
      ? 'Checkbox pored formulara potvrđuje da je obaveštenje o privatnosti pročitano; ona nije zasebna saglasnost za marketing.'
      : 'Die Checkbox am Formular bestätigt die Kenntnisnahme dieser Datenschutzhinweise; sie ist keine gesonderte Marketing-Einwilligung.'}</p>

    <h2 style={{fontSize:'28px',marginTop:'38px'}}>{sr?'4. Hosting i primaoci':'4. Hosting und Empfänger'}</h2>
    <p>{sr
      ? 'Javni DaniniHub sistem trenutno koristi Hostinger infrastrukturu. U EU ugovornom okviru Hostinger kao relevantnu grupnu kompaniju navodi HOSTINGER INTERNATIONAL LIMITED, 61 Lordou Vironos str., 6023 Larnaca, Cyprus. Za transakcione e-mail potvrde koristi se Brevo / Sendinblue SAS, 17 rue Salneuve, 75017 Paris, France. Oba provajdera mogu uključiti ugovorne podobrađivače u skladu sa svojim DPA.'
      : 'Das öffentliche DaniniHub-System nutzt derzeit Hostinger-Infrastruktur. Für EU-Kunden nennt Hostinger als relevante Gruppengesellschaft HOSTINGER INTERNATIONAL LIMITED, 61 Lordou Vironos str., 6023 Larnaca, Zypern. Für transaktionale E-Mail-Bestätigungen wird Brevo / Sendinblue SAS, 17 rue Salneuve, 75017 Paris, Frankreich, eingesetzt. Beide Anbieter können vertraglich eingebundene Unterauftragsverarbeiter nach ihren DPA einsetzen.'}</p>
    <p><a href="https://www.hostinger.com/legal/dpa" target="_blank" rel="noopener noreferrer">Hostinger DPA ↗</a> · <a href="https://www.brevo.com/legal/termsofuse/" target="_blank" rel="noopener noreferrer">Brevo legal ↗</a></p>

    <h2 style={{fontSize:'28px',marginTop:'38px'}}>{sr?'5. AI obrada':'5. KI-Verarbeitung'}</h2>
    <p>{sr
      ? 'ImportOS trenutno primarno koristi deterministička pravila, proverene izvore i strukturisane podatke za QuickCheck i Import Passport. Ako se kasnije uključi spoljni AI model za dodatnu analizu oglasa ili dokumenata, ova izjava se ažurira pre produkcione aktivacije i navode se dodatni primaoci podataka.'
      : 'ImportOS nutzt derzeit primär deterministische Regeln, verifizierte Quellen und strukturierte Daten für QuickCheck und Import Passport. Wird später ein externes KI-Modell für zusätzliche Inserat- oder Dokumentanalyse produktiv aktiviert, wird diese Erklärung vorher angepasst und zusätzliche Empfänger werden benannt.'}</p>

    <h2 style={{fontSize:'28px',marginTop:'38px'}}>{sr?'6. Čuvanje':'6. Speicherdauer'}</h2>
    <p>{sr
      ? 'Podaci se čuvaju samo dok su potrebni za obradu upita, pripremu ili izvršenje mogućeg ugovora i za zakonske obaveze ili odbranu pravnih zahteva. Kada svrha prestane i nema zakonskog razloga za dalje čuvanje, podaci se brišu ili anonimizuju. Tehnički logovi podležu rokovima hosting provajdera i bezbednosnoj potrebi.'
      : 'Daten werden nur so lange gespeichert, wie sie für die Bearbeitung der Anfrage, die Vorbereitung oder Durchführung eines möglichen Vertrags sowie gesetzliche Pflichten oder die Rechtsverteidigung erforderlich sind. Entfällt der Zweck und besteht kein gesetzlicher Aufbewahrungsgrund, werden Daten gelöscht oder anonymisiert. Technische Logs richten sich nach den Fristen des Hosting-Anbieters und der Sicherheitsnotwendigkeit.'}</p>

    <h2 style={{fontSize:'28px',marginTop:'38px'}}>{sr?'7. Vaša prava':'7. Ihre Rechte'}</h2>
    <p>{sr
      ? 'U okviru GDPR-a postoje prava na pristup, ispravku, brisanje, ograničenje, prigovor i, gde je primenljivo, prenosivost podataka. Pritužba se može podneti nadležnom organu za zaštitu podataka; za privatnog ponuđača sa sedištem u Duisburgu to je u pravilu Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen (LDI NRW).'
      : 'Im Rahmen der DSGVO bestehen Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch und – soweit anwendbar – Datenübertragbarkeit. Eine Beschwerde kann bei der zuständigen Datenschutzaufsicht eingereicht werden; für einen privaten Anbieter mit Sitz in Duisburg ist dies grundsätzlich die Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen (LDI NRW).'}</p>
    <p><a href="https://www.ldi.nrw.de/kontakt" target="_blank" rel="noopener noreferrer">LDI NRW ↗</a></p>

    <h2 style={{fontSize:'28px',marginTop:'38px'}}>{sr?'8. Švajcarska':'8. Schweiz'}</h2>
    <p>{sr
      ? 'Ako je za korisnika iz Švajcarske primenljiv švajcarski Zakon o zaštiti podataka (DSG/FADP), ova stranica treba da pruži i informacije prema članu 19: ko je odgovoran, svrhe obrade, primaoci i, gde je relevantno, prekogranično otkrivanje podataka. Zahtevi se šalju na isti kontakt.'
      : 'Soweit für Nutzer in der Schweiz das schweizerische Datenschutzgesetz (DSG/FADP) anwendbar ist, soll diese Seite zugleich die Informationen nach Art. 19 bereitstellen: Verantwortlicher, Bearbeitungszwecke, Empfänger und – soweit relevant – Auslandbekanntgaben. Anfragen können an denselben Kontakt gerichtet werden.'}</p>

    <h2 style={{fontSize:'28px',marginTop:'38px'}}>{sr?'9. Automatizovane odluke':'9. Automatisierte Entscheidungen'}</h2>
    <p>{sr
      ? 'Javna forma ne donosi odluke isključivo automatizovanim putem koje proizvode pravno ili slično značajno dejstvo. Komercijalna odluka, cena, ugovor i rizični slučajevi ostaju pod ljudskom kontrolom.'
      : 'Das öffentliche Formular trifft keine ausschließlich automatisierten Entscheidungen mit rechtlicher oder ähnlich erheblicher Wirkung. Kommerzielle Entscheidungen, Preis, Vertrag und riskante Fälle bleiben unter menschlicher Kontrolle.'}</p>
  </Wrap>
}

function Cookies({lang}){
  const sr=lang==='sr'
  return <Wrap lang={lang} title={sr?'Kolačići i lokalna memorija':'Cookies und lokale Speicherung'}>
    <p>{sr
      ? 'Na javnoj ImportOS stranici trenutno ne aktiviramo analitičke, marketinške ili reklamne kolačiće. Zato ne prikazujemo lažni cookie banner samo radi forme.'
      : 'Auf der öffentlichen ImportOS-Seite aktivieren wir derzeit keine Analyse-, Marketing- oder Werbe-Cookies. Deshalb wird kein rein formaler Cookie-Banner eingeblendet.'}</p>
    <h2 style={{fontSize:'28px',marginTop:'38px'}}>{sr?'Tehnički neophodno':'Technisch erforderlich'}</h2>
    <p>{sr
      ? 'Ako je memorija ili pristup na uređaju strogo neophodan za uslugu koju je korisnik izričito zatražio, nema posebne saglasnosti prema § 25 st. 2 TDDDG. Interni, zaštićeni radni prostori mogu koristiti nužan sesijski cookie za kontrolu pristupa; to nije marketinški tracker.'
      : 'Soweit eine Speicherung oder ein Zugriff auf dem Endgerät unbedingt erforderlich ist, um einen ausdrücklich gewünschten digitalen Dienst bereitzustellen, ist nach § 25 Abs. 2 TDDDG keine gesonderte Einwilligung erforderlich. Interne geschützte Arbeitsbereiche können ein notwendiges Session-Cookie zur Zugriffskontrolle verwenden; dies ist kein Marketing-Tracker.'}</p>
    <h2 style={{fontSize:'28px',marginTop:'38px'}}>{sr?'Ako uvedemo tracking':'Falls Tracking aktiviert wird'}</h2>
    <p>{sr
      ? 'Pre nego što se uključe Google Analytics, reklamni pikseli, ugrađeni video koji čita podatke sa uređaja ili sličan neobavezan alat, uvodimo odgovarajući consent-mehanizam i ažuriramo ovu stranicu.'
      : 'Bevor Google Analytics, Werbepixel, eingebettete Inhalte mit Endgerätezugriff oder vergleichbare nicht notwendige Tools aktiviert werden, wird ein geeigneter Consent-Mechanismus eingerichtet und diese Seite aktualisiert.'}</p>
  </Wrap>
}

function AI({lang}){
  const sr=lang==='sr'
  return <Wrap lang={lang} title={sr?'AI transparentnost i granice':'KI-Transparenz und Grenzen'}>
    <h2 style={{fontSize:'28px',marginTop:'38px'}}>{sr?'Kako koristimo AI':'Wie wir KI einsetzen'}</h2>
    <p>{sr
      ? 'U ImportOS-u se automatizacija koristi za strukturisanje podataka, poređenje scenarija, označavanje rizika i pripremu odluke. Sistem ne garantuje stanje vozila, poreklo, carinsku vrednost, homologaciju, tržišnu cenu ili profit bez odgovarajućih dokaza i stručne provere.'
      : 'In ImportOS wird Automatisierung für Datenstrukturierung, Szenariovergleich, Risikosignale und Entscheidungsvorbereitung eingesetzt. Das System garantiert ohne geeignete Nachweise oder Fachprüfung weder Fahrzeugzustand, Ursprung, Zollwert, Homologation, Marktwert noch Gewinn.'}</p>

    <h2 style={{fontSize:'28px',marginTop:'38px'}}>{sr?'Ljudska kontrola':'Menschliche Kontrolle'}</h2>
    <p>{sr
      ? 'Trošenje novca, ugovori, pravno važne obaveze, promena osnovne cene, brisanje podataka i nejasni ili rizični slučajevi zahtevaju ljudsku potvrdu. Sistem ne sme da izmišlja činjenice, odobrenja ili rezultate.'
      : 'Geldausgaben, Verträge, rechtlich relevante Verpflichtungen, Änderungen des Basispreises, Datenlöschung sowie unklare oder riskante Fälle benötigen menschliche Freigabe. Das System darf keine Fakten, Genehmigungen oder Ergebnisse erfinden.'}</p>

    <h2 style={{fontSize:'28px',marginTop:'38px'}}>{sr?'Interakcija sa AI':'Interaktion mit KI'}</h2>
    <p>{sr
      ? 'Ako korisnik direktno razgovara sa AI chatom ili voice-agentom, interfejs treba jasno da naznači da je u pitanju AI sistem, osim kada je to očigledno iz konteksta. Ovo pravilo ugrađujemo kao zadati dizajn za buduće javne agente.'
      : 'Wenn Nutzer direkt mit einem KI-Chat oder Voice-Agenten interagieren, soll die Oberfläche klar darauf hinweisen, dass es sich um ein KI-System handelt, soweit dies nicht bereits aus dem Kontext offensichtlich ist. Dieses Prinzip wird als Standard für künftige öffentliche Agenten vorgesehen.'}</p>

    <h2 style={{fontSize:'28px',marginTop:'38px'}}>{sr?'Tržišne tvrdnje':'Marktaussagen'}</h2>
    <p>{sr
      ? 'Procene, test-cene i pretpostavke ostaju označene kao hipoteze dok ih ne potvrde stvarni kupci, transakcije ili drugi proverljivi podaci.'
      : 'Schätzungen, Testpreise und Annahmen bleiben als Hypothesen gekennzeichnet, bis reale Käufer, Transaktionen oder andere überprüfbare Daten sie bestätigen.'}</p>
  </Wrap>
}

function Terms({lang}){
  const sr=lang==='sr'
  return <Wrap lang={lang} title={sr?'Okvir korišćenja i plaćenih usluga':'Nutzungsrahmen und bezahlte Leistungen'}>
    <p>{sr
      ? 'Ovo je javni okvir za ImportOS digitalne rezultate i dodatne usluge. QuickCheck je informativan. Import Passport po ceni prikazanoj u checkout-u i terenske/vozačke/B2B usluge imaju poseban obim i uslove. Za potrošački checkout dodatne obavezne informacije o ceni, izvršenju i pravu na odustanak moraju biti prikazane pre aktivacije plaćanja.'
      : 'Dies ist der öffentliche Rahmen für digitale ImportOS-Ergebnisse und Zusatzleistungen. Der QuickCheck ist informativ. Import Passport zum im Checkout ausgewiesenen Preis sowie Field-/Fahrer-/B2B-Leistungen haben einen gesonderten Leistungsumfang. Für einen Verbraucher-Checkout müssen die gesetzlich erforderlichen Preis-, Leistungs- und Widerrufsinformationen vor Zahlungsaktivierung angezeigt werden.'}</p>
    <h2 style={{fontSize:'28px',marginTop:'38px'}}>{sr?'Ciljna grupa':'Zielgruppe'}</h2>
    <p>{sr?'Besplatni QuickCheck je namenjen privatnim kupcima i profesionalnim uvoznicima. B2B usluge kao što su Dealer Radar, zakup Import Base površine i poslovni paketi ugovaraju se posebno. Potrošački plaćeni checkout se ne aktivira dok obavezne B2C informacije nisu kompletno prikazane.':'Der kostenlose QuickCheck richtet sich an private Käufer und professionelle Importeure. B2B-Leistungen wie Dealer Radar, Import-Base-Miete und Geschäftspakete werden separat vereinbart. Ein bezahlter Verbraucher-Checkout wird erst aktiviert, wenn die erforderlichen B2C-Informationen vollständig bereitgestellt sind.'}</p>
    <h2 style={{fontSize:'28px',marginTop:'38px'}}>{sr?'Nema automatskog ugovora':'Kein automatischer Vertragsschluss'}</h2>
    <p>{sr?'Kontakt forma, procena ili automatska potvrda prijema nisu prihvatanje naloga. Ugovor nastaje tek nakon jasne ponude i prihvatanja.':'Kontaktformular, Einschätzung oder automatische Eingangsbestätigung sind keine Auftragsannahme. Ein Vertrag entsteht erst durch ein klares Angebot und dessen Annahme.'}</p>
    <h2 style={{fontSize:'28px',marginTop:'38px'}}>{sr?'Obim i rezultat':'Leistungsumfang und Ergebnis'}</h2>
    <p>{sr?'DaniniHub isporučuje samo dogovorene zadatke i merljive artefakte/procese. Ne garantuje prihod, broj kupaca, rangiranje, profit niti pravni ili poreski ishod. Tržišni test može završiti odlukom SCALE, CHANGE ili KILL.':'DaniniHub erbringt nur die vereinbarten Aufgaben und messbaren Artefakte/Prozesse. Es werden keine Umsätze, Kundenzahlen, Rankings, Gewinne oder rechtlichen bzw. steuerlichen Ergebnisse garantiert. Ein Markttest kann mit SCALE, CHANGE oder KILL enden.'}</p>
    <h2 style={{fontSize:'28px',marginTop:'38px'}}>{sr?'Cena i porezi':'Preis und Steuern'}</h2>
    <p>{sr?'Javni rasponi ili test-cene nisu obavezujuća ponuda. Konačna cena i poreski tretman navode se u konkretnoj ponudi.':'Öffentliche Preiskorridore oder Testpreise sind kein verbindliches Angebot. Endpreis und steuerliche Behandlung werden im konkreten Angebot ausgewiesen.'}</p>
    <h2 style={{fontSize:'28px',marginTop:'38px'}}>{sr?'Odgovornost':'Haftung'}</h2>
    <p>{sr?'Ne koristimo paušalno isključenje zakonske odgovornosti. Odgovornost i eventualna ograničenja definišu se prema primenljivom pravu i konkretnom ugovoru; namera, gruba nepažnja i prava koja se zakonom ne mogu isključiti ostaju netaknuti.':'Es wird kein pauschaler Ausschluss gesetzlicher Haftung verwendet. Haftung und mögliche Begrenzungen richten sich nach anwendbarem Recht und dem konkreten Vertrag; Vorsatz, grobe Fahrlässigkeit und gesetzlich nicht abdingbare Rechte bleiben unberührt.'}</p>
    <h2 style={{fontSize:'28px',marginTop:'38px'}}>{sr?'Poverljivost i podaci':'Vertraulichkeit und Daten'}</h2>
    <p>{sr?'Klijent ne treba da šalje posebne kategorije ličnih podataka, poslovne tajne ili pristupne podatke kroz javnu formu. Za rad koji zahteva poverljive podatke definiše se poseban bezbedan kanal i, kada je potrebno, ugovor o obradi podataka.':'Über das öffentliche Formular sollen keine besonderen Kategorien personenbezogener Daten, Geschäftsgeheimnisse oder Zugangsdaten übermittelt werden. Erfordert die Leistung vertrauliche Daten, werden ein gesonderter sicherer Kanal und – soweit erforderlich – ein Auftragsverarbeitungsvertrag festgelegt.'}</p>
  </Wrap>
}

export default function RevenueLegal({lang='de',type='imprint'}){
  if(type==='privacy') return <Privacy lang={lang}/>
  if(type==='cookies') return <Cookies lang={lang}/>
  if(type==='ai') return <AI lang={lang}/>
  if(type==='terms') return <Terms lang={lang}/>
  return <Imprint lang={lang}/>
}
