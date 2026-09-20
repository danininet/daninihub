import './ImportOSLegal.css'

const updated='21.09.2026'

function Shell({lang,title,children}){
  return <div className="iol">
    <header className="iol-head"><a href={`/${lang}/`} className="iol-brand"><img src="/importos-mark.svg" alt=""/><span><strong>DANINI</strong><b>IMPORTOS</b></span></a></header>
    <main className="iol-main"><p className="iol-kicker">LEGAL · IMPORTOS</p><h1>{title}</h1><p className="iol-muted">Stand / stanje: {updated}</p>{children}<p className="iol-back"><a href={`/${lang}/`}>← ImportOS</a></p></main>
  </div>
}

function Imprint({lang}){
  const sr=lang==='sr'
  return <Shell lang={lang} title={sr?'Impresum':'Impressum'}>
    <h2>{sr?'Pružalac':'Anbieter'}</h2>
    <p>Dragan Zdravković<br/>DaniniHub / Danini ImportOS<br/>Fischerstraße 54<br/>47055 Duisburg · Deutschland<br/><a href="mailto:info@daninihub.com">info@daninihub.com</a><br/><a href="tel:+4915730916621">+49 1573 0916621</a></p>
    <p>{sr?'Ne objavljujemo registarske, poreske ili druge identifikacione brojeve dok nisu potvrđeni kao važeći i obavezni za objavu.':'Register-, Steuer- oder sonstige Identifikationsnummern werden erst veröffentlicht, wenn sie als gültig und veröffentlichungspflichtig bestätigt sind.'}</p>
  </Shell>
}

function Privacy({lang}){
  const sr=lang==='sr'
  return <Shell lang={lang} title={sr?'Privatnost':'Datenschutz'}>
    <h2>{sr?'Koje podatke obrađujemo':'Welche Daten wir verarbeiten'}</h2>
    <p>{sr?'Kod QuickCheck-a obrađujemo podatke koje unesete o vozilu i troškovima. Kod Import Passport narudžbine i servisnog upita obrađujemo ime, email, opciono telefon, VIN/vozilo, lokacije, broj dela i poruku. Podaci platne kartice ostaju kod provajdera plaćanja i ne unose se u DaniniHub formular.':'Beim QuickCheck verarbeiten wir die von Ihnen eingegebenen Fahrzeug- und Kostendaten. Bei Import-Passport-Bestellungen und Serviceanfragen verarbeiten wir Name, E-Mail, optional Telefon, VIN/Fahrzeug, Orte, Teilenummer und Nachricht. Kartendaten verbleiben beim Zahlungsanbieter und werden nicht in DaniniHub-Formulare eingegeben.'}</p>
    <h2>Hosting & E-Mail</h2>
    <p>{sr?'Sistem koristi Hostinger infrastrukturu; za transakcione poruke može koristiti Brevo. Plaćanje, kada je aktivirano, ide preko Stripe-a.':'Das System nutzt Hostinger-Infrastruktur; Transaktionsmails können über Brevo versendet werden. Zahlungen laufen, sobald aktiviert, über Stripe.'}</p>
    <h2>{sr?'Svrha':'Zweck'}</h2>
    <p>{sr?'Podaci služe izradi tražene analize, pripremi ponude, obradi servisnog upita, tehničkoj bezbednosti i izvršenju mogućeg ugovora.':'Die Daten dienen der angeforderten Analyse, Angebotsvorbereitung, Bearbeitung von Serviceanfragen, technischen Sicherheit und der Durchführung eines möglichen Vertrags.'}</p>
    <h2>{sr?'Vaša prava':'Ihre Rechte'}</h2>
    <p>{sr?'Prava na pristup, ispravku, brisanje, ograničenje, prigovor i druga prava po GDPR-u mogu se ostvariti preko info@daninihub.com.':'Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch und weitere DSGVO-Rechte können über info@daninihub.com geltend gemacht werden.'}</p>
  </Shell>
}

function Cookies({lang}){
  const sr=lang==='sr'
  return <Shell lang={lang} title={sr?'Kolačići':'Cookies'}>
    <p>{sr?'ImportOS trenutno ne aktivira reklamne ili marketinške kolačiće. Tehnički neophodna memorija/sesija može se koristiti samo kada je potrebna za traženu funkciju.':'ImportOS aktiviert derzeit keine Werbe- oder Marketing-Cookies. Technisch notwendige Speicherung/Sitzungen können nur genutzt werden, wenn sie für die angeforderte Funktion erforderlich sind.'}</p>
  </Shell>
}

function Terms({lang}){
  const sr=lang==='sr'
  return <Shell lang={lang} title={sr?'Okvir korišćenja i usluga':'Nutzungs- und Leistungsrahmen'}>
    <h2>Import Passport</h2>
    <p>{sr?'QuickCheck i Import Passport su pomoć pri odluci. Ne predstavljaju zvaničnu carinsku, poresku, homologacionu, registracionu ili tehničku odluku. Launch cena Import Passport-a je 9,90 € kada je checkout javno aktiviran.':'QuickCheck und Import Passport sind Entscheidungshilfen. Sie sind keine verbindliche Zoll-, Steuer-, Homologations-, Zulassungs- oder technische Entscheidung. Der Launchpreis des Import Passport beträgt 9,90 €, sobald der öffentliche Checkout aktiviert ist.'}</p>
    <h2>FieldCheck Live</h2>
    <p>{sr?'FieldCheck Live je vizuelna i dokumentaciona provera na licu mesta. Ne predstavlja Kfz-Gutachten niti garanciju mehaničkog stanja.':'FieldCheck Live ist eine visuelle und dokumentarische Prüfung vor Ort. Sie ist kein Kfz-Gutachten und keine Garantie des mechanischen Zustands.'}</p>
    <h2>Pro Mechanic Check</h2>
    <p>{sr?'Profesionalni pregled može obaviti nezavisni mehaničar sa višegodišnjim radnim iskustvom u BRABUS-u, ako je termin dostupan. To nije usluga BRABUS-a, ne predstavlja partnerstvo ili odobrenje BRABUS-a i tačan obim se dogovara pre termina.':'Eine professionelle Prüfung kann – bei Verfügbarkeit – durch einen unabhängigen Mechaniker mit mehrjähriger Berufserfahrung bei BRABUS erfolgen. Dies ist keine BRABUS-Leistung, keine Partnerschaft und keine Freigabe durch BRABUS; der genaue Umfang wird vor dem Termin vereinbart.'}</p>
    <h2>{sr?'Delovi':'Teilebeschaffung'}</h2>
    <p>{sr?'Originalni/Genuine/OEM delovi nabavljaju se po VIN-u ili tačnom broju dela i prema dostupnosti dobavljača. Ponuda navodi deo, cenu, poreklo/kanal nabavke kada je dostupan i trošak slanja.':'Original-/Genuine-/OEM-Teile werden anhand VIN oder exakter Teilenummer und nach Lieferbarkeit beschafft. Das Angebot weist Teil, Preis, Beschaffungskanal soweit verfügbar und Versandkosten aus.'}</p>
    <h2>{sr?'Dovoz i transport':'Überführung und Transport'}</h2>
    <p>{sr?'Kod vožnje na točkovima Danini pruža samo ugovorenu uslugu vozača. Vozilo mora imati legalne tablice/registraciju za rutu, važeće osiguranje i pisano ovlašćenje. Prevoz prikolicom ili kamionom organizuje se preko odgovarajućeg transportnog partnera po posebnoj ponudi.':'Bei Überführung auf eigener Achse erbringt Danini nur die vereinbarte Fahrerleistung. Das Fahrzeug benötigt für die Route legale Kennzeichen/Zulassung, gültigen Versicherungsschutz und schriftliche Vollmacht. Trailer- oder Lkw-Transport wird über einen geeigneten Transportpartner separat angeboten.'}</p>
    <h2>Import Base Čalije</h2>
    <p>{sr?'Zakup ili korišćenje površina u Čalijama nudi se samo nakon potvrde vlasničkog obima, pristupa, stvarnog kapaciteta, dozvoljene namene i posebnog ugovora.':'Miete oder Nutzung von Flächen in Čalije wird erst nach Bestätigung von Eigentumsumfang, Zufahrt, tatsächlicher Kapazität, zulässiger Nutzung und separatem Vertrag angeboten.'}</p>
  </Shell>
}

export default function ImportOSLegal({lang='de',type='imprint'}){
  if(type==='privacy')return <Privacy lang={lang}/>
  if(type==='cookies')return <Cookies lang={lang}/>
  if(type==='terms')return <Terms lang={lang}/>
  return <Imprint lang={lang}/>
}
