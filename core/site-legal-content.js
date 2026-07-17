'use strict';

const PROVIDER = Object.freeze({
  name: 'Dragan Zdravkovic',
  street: 'Fischerstraße 54',
  city: '47055 Duisburg',
  countryDe: 'Deutschland',
  countrySr: 'Nemačka',
  countryEn: 'Germany',
  email: 'dragangaganet@gmail.com'
});

const UPDATED = Object.freeze({ de: '17. Juli 2026', sr: '17. jul 2026.', en: '17 July 2026' });

function contact(country) {
  return `<div class="contact-block"><strong>${PROVIDER.name}</strong><span>${PROVIDER.street}</span><span>${PROVIDER.city}</span><span>${country}</span><span><a href="mailto:${PROVIDER.email}">${PROVIDER.email}</a></span></div>`;
}

const documents = {
  de: {
    imprint: {
      title: 'Impressum', intro: 'Anbieterkennzeichnung und verantwortliche Kontaktstelle für DaniniHub.',
      sections: [
        ['Angaben gemäß § 5 DDG', `${contact(PROVIDER.countryDe)}<p>DaniniHub wird als digitales Angebot von Dragan Zdravkovic betrieben.</p>`],
        ['Kontakt', `<p>Für Anfragen zum Angebot, zu Bestellungen oder zum Datenschutz nutzen Sie bitte die oben genannte E-Mail-Adresse. Eine Kommunikation per E-Mail ist in deutscher, serbischer oder englischer Sprache möglich.</p>`],
        ['Redaktionelle Verantwortung', `<p>Verantwortlich für journalistisch-redaktionelle Inhalte im Sinne von § 18 Abs. 2 MStV, soweit auf einzelne Inhalte anwendbar:</p>${contact(PROVIDER.countryDe)}`],
        ['Hinweis zu externen Diensten', '<p>Zahlungen und einzelne technische Leistungen werden durch externe Anbieter erbracht. Für deren Angebote gelten zusätzlich die jeweiligen Anbieterinformationen und Datenschutzbestimmungen.</p>'],
        ['Rechtsgrundlage', '<p class="legal-source">Die allgemeinen Informationspflichten für geschäftsmäßige digitale Dienste ergeben sich aus <a href="https://www.gesetze-im-internet.de/ddg/__5.html" rel="external noopener">§ 5 Digitale-Dienste-Gesetz (DDG)</a>.</p>']
      ]
    },
    privacy: {
      title: 'Datenschutzerklärung', intro: 'Welche Daten DaniniHub verarbeitet, wofür sie benötigt werden und welche Rechte Sie haben.',
      sections: [
        ['1. Verantwortlicher', `${contact(PROVIDER.countryDe)}<p>Ein Datenschutzbeauftragter ist derzeit nicht bestellt.</p>`],
        ['2. Verarbeitete Daten', '<ul><li>technische Zugriffsdaten wie Zeitpunkt, angeforderte Seite, IP-Adresse und Browserinformationen, soweit sie beim Hosting anfallen;</li><li>E-Mail-Adresse, Kauf- oder Bestellreferenz und Status der Zustellung;</li><li>Ihre Antworten aus dem geführten Dialog sowie die daraus erzeugte Analyse;</li><li>Sicherheits-, Fehler- und Auditdaten, die zur Stabilität und Missbrauchsprävention erforderlich sind.</li></ul><div class="legal-note"><strong>Bitte keine sensiblen Daten eingeben</strong>Übermitteln Sie keine Gesundheitsdaten, Ausweisdaten, Bankdaten, Passwörter oder vertrauliche Daten Dritter. Das Produkt benötigt solche Angaben nicht.</div>'],
        ['3. Zwecke und Rechtsgrundlagen', '<ul><li><strong>Vertrag und Lieferung:</strong> Zugang, Dialog, Analyse, PDF und E-Mail-Zustellung auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO.</li><li><strong>Sicherheit und Fehlerbehebung:</strong> Schutz des Dienstes und technische Diagnose auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.</li><li><strong>Rechtliche Pflichten:</strong> Aufbewahrung geschäftlich erforderlicher Nachweise auf Grundlage von Art. 6 Abs. 1 lit. c DSGVO.</li><li><strong>Einwilligung:</strong> nur dort, wo eine gesonderte freiwillige Einwilligung eingeholt wird, Art. 6 Abs. 1 lit. a DSGVO.</li></ul>'],
        ['4. Empfänger und eingesetzte Dienste', '<ul><li><strong>Hostinger:</strong> Hosting und technische Bereitstellung;</li><li><strong>Gumroad:</strong> Checkout, Zahlung und Kaufbestätigung;</li><li><strong>Brevo:</strong> transaktionale E-Mail-Zustellung;</li><li><strong>Google Gemini API:</strong> KI-gestützte Formulierung der Rückfragen und Auswertung der Antworten.</li></ul><p>Es werden nur Daten übermittelt, die für den jeweiligen Zweck erforderlich sind. Bei Anbietern außerhalb des Europäischen Wirtschaftsraums kann eine Drittlandübermittlung stattfinden. Maßgeblich sind die Datenschutzinformationen und die eingesetzten Übermittlungsmechanismen des jeweiligen Anbieters.</p>'],
        ['5. Speicherdauer', '<p>Daten werden nur so lange gespeichert, wie sie für Zugang, Analyse, Zustellung, Sicherheit, Fehlerbehebung oder gesetzliche Nachweise benötigt werden. Gesetzliche Aufbewahrungspflichten bleiben unberührt. Wenn keine Pflicht oder ein laufender Vorgang entgegensteht, können Sie die Löschung Ihrer Dialog- und Kontaktdaten per E-Mail verlangen.</p>'],
        ['6. Ihre Rechte', '<p>Sie haben nach Maßgabe der DSGVO insbesondere Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Eine erteilte Einwilligung kann für die Zukunft widerrufen werden. Außerdem besteht ein Beschwerderecht bei einer Datenschutzaufsichtsbehörde.</p>'],
        ['7. Automatisierung und KI', '<p>DaniniHub erstellt Rückfragen und Analysen automatisiert mit KI-Unterstützung. Das Ergebnis ist eine Orientierungshilfe. Es findet keine ausschließlich automatisierte Entscheidung mit rechtlicher oder ähnlich erheblicher Wirkung im Sinne von Art. 22 DSGVO statt.</p>'],
        ['8. Pflicht zur Bereitstellung', '<p>Für den Kauf und die Zustellung werden eine funktionierende E-Mail-Adresse und eine Kaufreferenz benötigt. Ohne Antworten kann keine persönliche Analyse erstellt werden. Darüber hinaus besteht keine Pflicht, personenbezogene Daten bereitzustellen.</p>'],
        ['9. Rechtsinformation', '<p class="legal-source">Die Informationspflichten bei direkter Datenerhebung ergeben sich insbesondere aus <a href="https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32016R0679" rel="external noopener">Art. 13 DSGVO</a>.</p>']
      ]
    },
    cookies: {
      title: 'Cookies & technische Speicherungen', intro: 'Transparente Übersicht der Speicherungen, die für Zugang und Betrieb benötigt werden.',
      sections: [
        ['Aktueller Einsatz', '<p>DaniniHub setzt auf den eigenen Produktseiten keine Werbe- oder Profiling-Cookies ein. Für den persönlichen Zugangslink kann technisch notwendiger Browser-Speicher verwendet werden, damit die Sitzung nach dem Öffnen des Links fortgesetzt werden kann.</p>'],
        ['Technisch notwendige Speicherung', '<ul><li><strong>sessionStorage:</strong> speichert den persönlichen Sitzungszugang im aktuellen Browser-Tab;</li><li><strong>serverseitige Sitzungsdaten:</strong> verbinden Ihre Antworten mit der gekauften Analyse;</li><li><strong>Sicherheitsinformationen:</strong> dienen Zugriffsschutz und Fehlerdiagnose.</li></ul>'],
        ['Externe Zahlung', '<p>Der Checkout findet bei Gumroad statt. Beim Öffnen des Checkouts können dort eigene Cookies oder vergleichbare Technologien eingesetzt werden. Dafür ist Gumroad nach seinen eigenen Informationen verantwortlich.</p>'],
        ['Ihre Kontrolle', '<p>Sie können Browser-Speicher über die Einstellungen Ihres Browsers löschen. Wird der technisch notwendige Sitzungszugang gelöscht, kann der persönliche Link erneut erforderlich sein.</p>'],
        ['Rechtsrahmen', '<p class="legal-source">Technisch nicht notwendige Zugriffe auf Endeinrichtungen bedürfen grundsätzlich einer Einwilligung nach dem TDDDG. DaniniHub beschreibt hier nur den aktuell implementierten, technisch notwendigen Produktfluss.</p>']
      ]
    },
    terms: {
      title: 'Nutzungsbedingungen', intro: 'Bedingungen für den Kauf und die Nutzung der persönlichen KI-Analyse „Die KI fragt nach“.',
      sections: [
        ['1. Anbieter und Geltungsbereich', `${contact(PROVIDER.countryDe)}<p>Diese Bedingungen gelten für das einmalig bezahlte digitale Produkt „Die KI fragt nach“.</p>`],
        ['2. Leistungsumfang', '<p>Zum Preis von 12 EUR erhalten Sie einen persönlichen Zugang zu einer Ausgangsfrage und genau drei aufeinander aufbauenden Rückfragen. Nach der vierten Antwort wird eine persönliche KI-gestützte Analyse erstellt, als PDF bereitgestellt und an die beim Kauf verwendete E-Mail-Adresse versendet.</p>'],
        ['3. Vertragsschluss und Zahlung', '<p>Bestellung und Zahlung erfolgen über Gumroad. Vor Abschluss der Zahlung werden Preis und die dort verfügbaren Bestellinformationen angezeigt. Zusätzliche Bedingungen von Gumroad können für die Zahlungsabwicklung gelten.</p>'],
        ['4. Pflichten der Nutzer', '<ul><li>eine erreichbare und zutreffende E-Mail-Adresse verwenden;</li><li>den persönlichen Zugangslink nicht weitergeben;</li><li>keine rechtswidrigen Inhalte oder vertraulichen Daten Dritter eingeben;</li><li>keine Gesundheits-, Bank-, Ausweis- oder Zugangsdaten übermitteln;</li><li>Ergebnisse vor Entscheidungen mit erheblicher Tragweite fachlich prüfen lassen.</li></ul>'],
        ['5. Verfügbarkeit und Zustellung', '<p>Die Analyse wird nach vollständiger Beantwortung erzeugt. Bei einer technischen Störung wird eine erneute Zustellung oder Wiederherstellung des Zugangs angestrebt. Eine ununterbrochene Verfügbarkeit kann technisch nicht garantiert werden.</p>'],
        ['6. Inhaltliche Grenzen', '<p>Die Analyse ist eine KI-gestützte Strukturierungs- und Entscheidungshilfe. Sie ist keine Rechts-, Steuer-, Finanz- oder medizinische Beratung und garantiert keinen wirtschaftlichen, beruflichen oder persönlichen Erfolg.</p>'],
        ['7. Mängelrechte und Haftung', '<p>Gesetzliche Verbraucher- und Mängelrechte bleiben unberührt. Für Schäden haftet der Anbieter nach den gesetzlichen Vorschriften. Die Verantwortung für die Prüfung und Umsetzung der Analyse bleibt beim Nutzer, soweit gesetzlich zulässig.</p>'],
        ['8. Anwendbares Recht und Sprache', '<p>Es gilt deutsches Recht unter Wahrung zwingender Verbraucherschutzvorschriften des Staates, in dem der Verbraucher seinen gewöhnlichen Aufenthalt hat. Rechtlich maßgeblich ist die deutsche Fassung.</p>']
      ]
    },
    withdrawal: {
      title: 'Widerrufsbelehrung', intro: 'Informationen zum gesetzlichen Widerrufsrecht bei einem online geschlossenen Verbrauchervertrag.',
      sections: [
        ['Widerrufsrecht', '<p>Verbraucher haben grundsätzlich das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses.</p>'],
        ['Ausübung des Widerrufs', `<p>Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung, zum Beispiel per E-Mail, über Ihren Entschluss informieren:</p>${contact(PROVIDER.countryDe)}<p>Zur Wahrung der Frist genügt es, dass Sie die Mitteilung vor Ablauf der Widerrufsfrist absenden.</p>`],
        ['Folgen des Widerrufs', '<p>Im Fall eines wirksamen Widerrufs werden erhaltene Zahlungen nach den gesetzlichen Vorgaben zurückgezahlt. Für die Rückzahlung kann derselbe Zahlungsweg verwendet werden, der bei der ursprünglichen Transaktion eingesetzt wurde.</p>'],
        ['Vorzeitiger Leistungsbeginn', '<p>Bei digitalen Leistungen kann das Widerrufsrecht unter den gesetzlichen Voraussetzungen vorzeitig erlöschen, wenn der Verbraucher ausdrücklich dem Beginn der Leistung vor Ablauf der Widerrufsfrist zustimmt und seine Kenntnis vom möglichen Verlust des Widerrufsrechts bestätigt. Ob diese Voraussetzungen vorliegen, hängt vom konkret verwendeten Checkout und den dort eingeholten Erklärungen ab.</p><div class="legal-note"><strong>Keine pauschale Verkürzung</strong>DaniniHub behauptet kein vorzeitiges Erlöschen, wenn die gesetzlich erforderlichen Erklärungen im Checkout nicht wirksam eingeholt und bestätigt wurden.</div>'],
        ['Muster-Widerrufsformular', `<p>Wenn Sie den Vertrag widerrufen wollen, senden Sie folgende Angaben per E-Mail an <a href="mailto:${PROVIDER.email}">${PROVIDER.email}</a>:</p><div class="contact-block"><span>Hiermit widerrufe ich den von mir abgeschlossenen Vertrag über „Die KI fragt nach“.</span><span>Name:</span><span>E-Mail beim Kauf:</span><span>Bestellnummer:</span><span>Bestelldatum:</span><span>Datum der Erklärung:</span></div>`],
        ['Rechtsinformation', '<p class="legal-source">Die gesetzlichen Grundlagen finden sich insbesondere in §§ 355 und 356 BGB. Diese Seite bildet den Produktstatus ab und ersetzt keine individuelle Rechtsberatung.</p>']
      ]
    },
    ai: {
      title: 'KI-Transparenz', intro: 'Was die KI im Produkt übernimmt, welche Daten sie verwendet und wo ihre Grenzen liegen.',
      sections: [
        ['Rolle der KI', '<p>Die KI formuliert auf Grundlage Ihrer bisherigen Antworten drei gezielte Rückfragen und strukturiert anschließend die Abschlussanalyse. Sie soll konkrete Zusammenhänge, offene Annahmen, Risiken und nächste Schritte sichtbar machen.</p>'],
        ['Grundlage des Ergebnisses', '<p>Die Analyse beruht auf Ihren vier Antworten. Nicht bestätigte Punkte sollen als Annahmen oder unbekannt gekennzeichnet werden. Es findet keine unabhängige Tatsachenprüfung aller Angaben statt.</p>'],
        ['Technischer Anbieter', '<p>Für die Generierung wird derzeit die Google Gemini API eingesetzt. Zur Erstellung der Rückfragen und Analyse werden die dafür erforderlichen Dialoginhalte an diesen Dienst übermittelt.</p>'],
        ['Grenzen', '<ul><li>KI kann Informationen missverstehen oder fehlerhafte Schlussfolgerungen erzeugen;</li><li>die Analyse kennt nur den bereitgestellten Kontext;</li><li>sie ersetzt keine qualifizierte Fachberatung;</li><li>sie trifft keine verbindliche Entscheidung für den Nutzer.</li></ul>'],
        ['Menschliche Verantwortung', '<p>Die endgültige Entscheidung und die Prüfung der vorgeschlagenen Schritte bleiben beim Nutzer. Bei rechtlichen, finanziellen, steuerlichen, medizinischen oder anderen Entscheidungen mit erheblicher Tragweite ist eine qualifizierte Fachperson einzubeziehen.</p>']
      ]
    },
    affiliate: {
      title: 'Affiliate-Hinweis', intro: 'Klare Kennzeichnung kommerzieller Empfehlungen und Partnerlinks.',
      sections: [
        ['Aktueller Status', '<p>Das Produkt „Die KI fragt nach“ enthält derzeit keine zugesicherten Affiliate-Empfehlungen. Der Preis von 12 EUR bezieht sich ausschließlich auf den beschriebenen Analyse- und PDF-Prozess.</p>'],
        ['Künftige Partnerlinks', '<p>Falls DaniniHub künftig Partnerlinks einsetzt, werden diese unmittelbar am Link oder im betreffenden Abschnitt als Werbung, Anzeige oder Affiliate-Link gekennzeichnet.</p>'],
        ['Unabhängigkeit', '<p>Eine mögliche Vergütung darf nicht als Qualitätsgarantie dargestellt werden. Nutzer sollen Preis, Eignung, Datenschutz und Bedingungen externer Angebote selbst prüfen.</p>']
      ]
    },
    disclaimer: {
      title: 'Haftungsausschluss', intro: 'Klare Abgrenzung zwischen KI-gestützter Orientierung und professioneller Fachberatung.',
      sections: [
        ['Keine Fachberatung', '<p>DaniniHub erbringt keine Rechts-, Steuer-, Finanz-, Anlage- oder medizinische Beratung. Inhalte und Analysen dienen der Strukturierung von Informationen und der Vorbereitung eigener Entscheidungen.</p>'],
        ['Keine Erfolgszusage', '<p>Es gibt keine Garantie für Einkommen, Verkauf, Finanzierung, Beschäftigung, Projektgenehmigung, Gesundheitsergebnis oder sonstigen wirtschaftlichen beziehungsweise persönlichen Erfolg.</p>'],
        ['Prüfung der Ergebnisse', '<p>KI-generierte Ergebnisse können unvollständig oder fehlerhaft sein. Tatsachen, Berechnungen, Fristen und rechtlich relevante Aussagen sind vor der Umsetzung eigenständig oder durch qualifizierte Fachpersonen zu prüfen.</p>'],
        ['Externe Links', '<p>Für Inhalte externer Anbieter ist der jeweilige Betreiber verantwortlich. Eine Verlinkung bedeutet keine Garantie für Verfügbarkeit, Richtigkeit oder Eignung.</p>'],
        ['Gesetzliche Rechte', '<p>Dieser Hinweis schränkt keine zwingenden gesetzlichen Verbraucher-, Gewährleistungs- oder Haftungsrechte ein.</p>']
      ]
    }
  }
};

function translatedDocument(title, intro, sections) {
  return { title, intro, translated: true, sections };
}

const srContact = contact(PROVIDER.countrySr);
const enContact = contact(PROVIDER.countryEn);

documents.sr = {
  imprint: translatedDocument('Impressum', 'Podaci o pružaocu usluge i odgovornoj kontakt osobi za DaniniHub.', [
    ['Podaci prema § 5 DDG', `${srContact}<p>DaniniHub je digitalna usluga koju pruža Dragan Zdravkovic.</p>`],
    ['Kontakt', '<p>Za pitanja o ponudi, porudžbini ili privatnosti koristite navedenu email adresu. Komunikacija je moguća na nemačkom, srpskom i engleskom jeziku.</p>'],
    ['Odgovornost za sadržaj', `<p>Za uredničke sadržaje, kada je § 18 st. 2 MStV primenljiv, odgovoran je:</p>${srContact}`],
    ['Spoljne usluge', '<p>Plaćanje i pojedine tehničke funkcije obavljaju spoljni pružaoci. Na njihove usluge primenjuju se i njihovi uslovi i politike privatnosti.</p>'],
    ['Pravni osnov', '<p class="legal-source">Obavezni podaci o pružaocu poslovne digitalne usluge uređeni su <a href="https://www.gesetze-im-internet.de/ddg/__5.html" rel="external noopener">§ 5 DDG</a>.</p>']
  ]),
  privacy: translatedDocument('Politika privatnosti', 'Pregled podataka koji se obrađuju, svrhe obrade i prava korisnika.', [
    ['1. Odgovorno lice', `${srContact}<p>Službenik za zaštitu podataka trenutno nije imenovan.</p>`],
    ['2. Podaci koji se obrađuju', '<ul><li>tehnički podaci pristupa koje evidentira hosting;</li><li>email, referenca kupovine i status isporuke;</li><li>odgovori iz vođenog dijaloga i generisana analiza;</li><li>bezbednosni, tehnički i revizijski podaci.</li></ul><div class="legal-note"><strong>Ne unosite osetljive podatke</strong>Ne šaljite zdravstvene, identifikacione ili bankarske podatke, lozinke ni poverljive podatke trećih lica.</div>'],
    ['3. Svrhe i pravni osnov', '<p>Podaci se obrađuju radi izvršenja ugovora i isporuke (čl. 6 st. 1 b GDPR), bezbednosti i dijagnostike (f), zakonskih obaveza (c), odnosno na osnovu pristanka kada je posebno zatražen (a).</p>'],
    ['4. Primaoci i servisi', '<ul><li><strong>Hostinger:</strong> hosting;</li><li><strong>Gumroad:</strong> naplata i potvrda kupovine;</li><li><strong>Brevo:</strong> transakcioni email;</li><li><strong>Google Gemini API:</strong> AI pitanja i analiza.</li></ul><p>Prosleđuju se samo podaci potrebni za konkretnu svrhu. Kod pružalaca izvan EEP moguć je međunarodni prenos prema njihovim važećim mehanizmima zaštite.</p>'],
    ['5. Period čuvanja', '<p>Podaci se čuvaju samo koliko je potrebno za pristup, analizu, isporuku, bezbednost, rešavanje grešaka ili zakonske evidencije. Brisanje podataka dijaloga i kontakta možete zatražiti emailom kada nema suprotne obaveze.</p>'],
    ['6. Vaša prava', '<p>U skladu sa GDPR-om možete tražiti pristup, ispravku, brisanje, ograničenje, prenosivost i uložiti prigovor. Pristanak se može povući za ubuduće, a pritužba podneti nadležnom organu.</p>'],
    ['7. Automatizacija i AI', '<p>AI automatski priprema podpitanja i analizu kao pomoć u orijentaciji. Ne donosi isključivo automatizovanu odluku sa pravnim ili slično značajnim dejstvom u smislu čl. 22 GDPR-a.</p>'],
    ['8. Neophodni podaci', '<p>Za kupovinu i isporuku potrebni su funkcionalan email i referenca kupovine. Bez odgovora nije moguće napraviti ličnu analizu.</p>'],
    ['9. Pravne informacije', '<p class="legal-source">Informacije pri neposrednom prikupljanju podataka zasnivaju se naročito na <a href="https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32016R0679" rel="external noopener">članu 13 GDPR-a</a>.</p>']
  ]),
  cookies: translatedDocument('Kolačići i tehničko čuvanje', 'Pregled čuvanja podataka potrebnog za pristup i rad proizvoda.', [
    ['Trenutna upotreba', '<p>DaniniHub na sopstvenim stranicama ne koristi reklamne ni profilne kolačiće. Za lični pristup koristi se tehnički neophodno skladište pregledača.</p>'],
    ['Tehnički neophodno čuvanje', '<ul><li><strong>sessionStorage:</strong> pristup sesiji u otvorenoj kartici;</li><li><strong>serverska sesija:</strong> povezuje odgovore i kupljenu analizu;</li><li><strong>bezbednosni podaci:</strong> zaštita pristupa i dijagnostika.</li></ul>'],
    ['Eksterno plaćanje', '<p>Gumroad obrađuje checkout i može koristiti sopstvene kolačiće prema svojoj politici.</p>'],
    ['Vaša kontrola', '<p>Podatke pregledača možete obrisati u njegovim podešavanjima; tada lični pristupni link može ponovo biti potreban.</p>'],
    ['Pravni okvir', '<p class="legal-source">Pristup uređaju koji nije tehnički neophodan u načelu zahteva pristanak prema TDDDG-u.</p>']
  ]),
  terms: translatedDocument('Uslovi korišćenja', 'Uslovi kupovine i korišćenja lične AI analize „AI pita dalje“.', [
    ['1. Pružalac i oblast primene', `${srContact}<p>Uslovi važe za jednokratno plaćeni digitalni proizvod „AI pita dalje“.</p>`],
    ['2. Obim usluge', '<p>Za 12 EUR korisnik dobija početno pitanje, tačno tri povezana podpitanja, ličnu AI analizu, PDF i isporuku emailom.</p>'],
    ['3. Ugovor i plaćanje', '<p>Porudžbina i plaćanje obavljaju se preko Gumroad-a. Pre plaćanja prikazuju se cena i dostupni podaci porudžbine.</p>'],
    ['4. Obaveze korisnika', '<p>Korisnik daje ispravan email, čuva lični link, ne unosi nezakonit sadržaj ni osetljive podatke i proverava rezultate pre važnih odluka.</p>'],
    ['5. Dostupnost i isporuka', '<p>Analiza nastaje nakon sva četiri odgovora. Kod tehničkog kvara nastoji se obnoviti pristup ili ponoviti isporuka; neprekidan rad se ne može garantovati.</p>'],
    ['6. Granice sadržaja', '<p>Rezultat je pomoć za strukturisanje odluke, a ne pravni, poreski, finansijski ili medicinski savet niti garancija uspeha.</p>'],
    ['7. Prava i odgovornost', '<p>Zakonska potrošačka prava ostaju netaknuta. Odgovornost pružaoca uređena je važećim zakonom.</p>'],
    ['8. Merodavno pravo i jezik', '<p>Važi nemačko pravo uz obaveznu zaštitu potrošača države redovnog boravišta. Pravno merodavna je nemačka verzija.</p>']
  ]),
  withdrawal: translatedDocument('Pravo na odustanak', 'Informacije o zakonskom pravu potrošača na odustanak od online ugovora.', [
    ['Pravo na odustanak', '<p>Potrošač u načelu može odustati od ugovora u roku od 14 dana od zaključenja, bez navođenja razloga.</p>'],
    ['Kako se pravo koristi', `<p>Pošaljite jasnu izjavu o odustanku, na primer emailom:</p>${srContact}<p>Dovoljno je da izjavu pošaljete pre isteka roka.</p>`],
    ['Posledice odustanka', '<p>Kod važećeg odustanka primljene uplate vraćaju se prema zakonskim pravilima, načelno istim načinom plaćanja.</p>'],
    ['Početak izvršenja pre isteka roka', '<p>Kod digitalne usluge pravo može prestati ranije samo ako su ispunjeni zakonski uslovi, uključujući izričit pristanak na rani početak i potvrdu saznanja o mogućem gubitku prava.</p><div class="legal-note"><strong>Nema automatskog gubitka prava</strong>DaniniHub ne tvrdi da je pravo prestalo ako potrebne izjave nisu pravilno pribavljene u checkout-u.</div>'],
    ['Obrazac za odustanak', `<p>Na ${PROVIDER.email} pošaljite izjavu, ime, email kupovine, broj i datum porudžbine i datum izjave.</p>`],
    ['Pravne informacije', '<p class="legal-source">Osnov se nalazi naročito u §§ 355 i 356 BGB. Merodavna je nemačka verzija ovog obaveštenja.</p>']
  ]),
  ai: translatedDocument('AI transparentnost', 'Šta AI radi u proizvodu, koje podatke koristi i koje su njegove granice.', [
    ['Uloga AI', '<p>AI na osnovu prethodnih odgovora formuliše tri podpitanja i strukturira završnu analizu, rizike i sledeće korake.</p>'],
    ['Osnova rezultata', '<p>Rezultat se zasniva na četiri odgovora korisnika. Nepotvrđene tačke treba tretirati kao pretpostavke; ne obavlja se nezavisna provera svih činjenica.</p>'],
    ['Tehnički pružalac', '<p>Trenutno se koristi Google Gemini API, kome se prosleđuje sadržaj dijaloga potreban za generisanje.</p>'],
    ['Granice', '<p>AI može pogrešiti, ne poznaje informacije van datog konteksta i ne zamenjuje kvalifikovan stručni savet.</p>'],
    ['Odgovornost čoveka', '<p>Korisnik donosi konačnu odluku. Za pravno, finansijski, poreski, medicinski ili drugo važno pitanje treba uključiti stručnjaka.</p>']
  ]),
  affiliate: translatedDocument('Affiliate napomena', 'Jasno označavanje komercijalnih preporuka i partnerskih linkova.', [
    ['Trenutni status', '<p>Proizvod trenutno ne obećava affiliate preporuke. Cena od 12 EUR odnosi se samo na opisanu analizu i PDF.</p>'],
    ['Budući partnerski linkovi', '<p>Ako budu uvedeni, biće jasno označeni uz link kao reklama ili affiliate link.</p>'],
    ['Nezavisnost', '<p>Moguća provizija nije garancija kvaliteta; korisnik sam proverava cenu, podobnost, privatnost i uslove spoljne ponude.</p>']
  ]),
  disclaimer: translatedDocument('Odricanje odgovornosti', 'Razgraničenje AI orijentacije od profesionalnog stručnog saveta.', [
    ['Nije stručni savet', '<p>DaniniHub ne pruža pravne, poreske, finansijske, investicione ni medicinske savete.</p>'],
    ['Nema garancije rezultata', '<p>Ne garantuju se prihod, prodaja, finansiranje, zaposlenje, odobrenje projekta, zdravstveni ili drugi rezultat.</p>'],
    ['Provera rezultata', '<p>AI rezultat može biti nepotpun ili pogrešan; činjenice, rokove i važne izjave treba proveriti pre primene.</p>'],
    ['Spoljni linkovi', '<p>Za sadržaj spoljnog sajta odgovara njegov operater; link nije garancija tačnosti ili podobnosti.</p>'],
    ['Zakonska prava', '<p>Ova napomena ne ograničava obavezna potrošačka, garantna ili zakonska prava odgovornosti.</p>']
  ])
};

documents.en = {
  imprint: translatedDocument('Imprint', 'Provider identification and responsible contact point for DaniniHub.', [
    ['Information under § 5 DDG', `${enContact}<p>DaniniHub is a digital service operated by Dragan Zdravkovic.</p>`], ['Contact', '<p>Use the email above for product, order or privacy questions. Communication is available in German, Serbian or English.</p>'], ['Editorial responsibility', `<p>Where § 18(2) MStV applies, the person responsible for editorial content is:</p>${enContact}`], ['External services', '<p>Payment and selected technical functions are provided by third parties and are also subject to their terms and privacy notices.</p>'], ['Legal basis', '<p class="legal-source">Provider information for commercial digital services is governed by <a href="https://www.gesetze-im-internet.de/ddg/__5.html" rel="external noopener">§ 5 DDG</a>.</p>']
  ]),
  privacy: translatedDocument('Privacy policy', 'What data DaniniHub processes, why it is needed and which rights you have.', [
    ['1. Controller', `${enContact}<p>No data protection officer is currently appointed.</p>`], ['2. Data processed', '<ul><li>technical access data recorded by hosting;</li><li>email, purchase reference and delivery status;</li><li>guided-dialogue answers and generated analysis;</li><li>security, error and audit data.</li></ul><div class="legal-note"><strong>Do not enter sensitive data</strong>Do not submit health, identity or banking data, passwords or confidential third-party information.</div>'], ['3. Purposes and legal bases', '<p>Processing supports contract performance and delivery (Art. 6(1)(b) GDPR), security and diagnostics (f), legal obligations (c), or consent where separately requested (a).</p>'], ['4. Recipients and services', '<ul><li><strong>Hostinger:</strong> hosting;</li><li><strong>Gumroad:</strong> checkout and payment;</li><li><strong>Brevo:</strong> transactional email;</li><li><strong>Google Gemini API:</strong> AI follow-ups and analysis.</li></ul><p>Only purpose-relevant data is shared. Providers outside the EEA may involve an international transfer under their applicable safeguards.</p>'], ['5. Retention', '<p>Data is retained only as long as required for access, analysis, delivery, security, troubleshooting or legal records. You may request deletion by email where no overriding duty applies.</p>'], ['6. Your rights', '<p>Subject to the GDPR, you may request access, correction, deletion, restriction and portability, and object to processing. Consent may be withdrawn for the future and a complaint lodged with a supervisory authority.</p>'], ['7. Automation and AI', '<p>AI creates follow-ups and the analysis as guidance. It does not make a solely automated decision with legal or similarly significant effects under Art. 22 GDPR.</p>'], ['8. Required data', '<p>A working email and purchase reference are required for purchase and delivery. A personal analysis cannot be produced without answers.</p>'], ['9. Legal information', '<p class="legal-source">Direct collection disclosures are based in particular on <a href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679" rel="external noopener">Article 13 GDPR</a>.</p>']
  ]),
  cookies: translatedDocument('Cookies and technical storage', 'Overview of storage required for access and operation.', [
    ['Current use', '<p>DaniniHub does not use advertising or profiling cookies on its own product pages. Technically necessary browser storage supports the personal session.</p>'], ['Technically necessary storage', '<ul><li><strong>sessionStorage:</strong> keeps session access in the current tab;</li><li><strong>server-side session:</strong> links answers to the purchased analysis;</li><li><strong>security data:</strong> protects access and supports diagnostics.</li></ul>'], ['External payment', '<p>Gumroad handles checkout and may use its own cookies under its privacy notice.</p>'], ['Your control', '<p>You can clear browser storage in browser settings; the personal access link may then be required again.</p>'], ['Legal framework', '<p class="legal-source">Access to a device that is not technically necessary generally requires consent under the TDDDG.</p>']
  ]),
  terms: translatedDocument('Terms of use', 'Terms for purchasing and using the personal AI analysis “AI asks further”.', [
    ['1. Provider and scope', `${enContact}<p>These terms apply to the one-time paid digital product “AI asks further”.</p>`], ['2. Service scope', '<p>For EUR 12, the user receives an opening question, exactly three sequential follow-ups, a personal AI-assisted analysis, PDF and email delivery.</p>'], ['3. Contract and payment', '<p>Ordering and payment take place through Gumroad. Price and available order information are shown before payment.</p>'], ['4. User obligations', '<p>Users provide a reachable email, keep the access link private, avoid unlawful or sensitive content and review results before consequential decisions.</p>'], ['5. Availability and delivery', '<p>The analysis is created after four answers. If a technical fault occurs, access or delivery will be restored where possible; uninterrupted availability is not guaranteed.</p>'], ['6. Content limits', '<p>The result supports structured decision-making. It is not legal, tax, financial or medical advice and does not guarantee success.</p>'], ['7. Rights and liability', '<p>Statutory consumer and defect rights remain unaffected. Provider liability is governed by applicable law.</p>'], ['8. Applicable law and language', '<p>German law applies while preserving mandatory consumer protection at the consumer’s habitual residence. The German version is legally authoritative.</p>']
  ]),
  withdrawal: translatedDocument('Right of withdrawal', 'Information about the statutory withdrawal right for an online consumer contract.', [
    ['Right of withdrawal', '<p>Consumers generally have 14 days from contract conclusion to withdraw without giving a reason.</p>'], ['How to exercise it', `<p>Send an unambiguous withdrawal statement, for example by email:</p>${enContact}<p>Sending it before the deadline is sufficient.</p>`], ['Effects of withdrawal', '<p>After a valid withdrawal, payments are refunded under statutory rules, generally using the original payment method.</p>'], ['Early performance', '<p>For digital services, the right may expire early only if the statutory conditions are met, including express consent to early performance and acknowledgment of the possible loss of the right.</p><div class="legal-note"><strong>No automatic loss</strong>DaniniHub does not claim expiry where the required declarations were not validly collected during checkout.</div>'], ['Model withdrawal form', `<p>Email ${PROVIDER.email} with the withdrawal statement, name, purchase email, order number and date, and the declaration date.</p>`], ['Legal information', '<p class="legal-source">The main German provisions are §§ 355 and 356 BGB. The German notice is legally authoritative.</p>']
  ]),
  ai: translatedDocument('AI transparency', 'What AI does in the product, which data it uses and where its limits are.', [
    ['Role of AI', '<p>AI uses prior answers to create three follow-ups and structure the final analysis, risks and next steps.</p>'], ['Basis of the result', '<p>The result is based on four user answers. Unconfirmed points should be treated as assumptions; not every statement is independently verified.</p>'], ['Technical provider', '<p>Google Gemini API is currently used and receives the dialogue content required for generation.</p>'], ['Limits', '<p>AI can be wrong, only knows the supplied context and does not replace qualified professional advice.</p>'], ['Human responsibility', '<p>The user makes the final decision. A qualified professional should review legal, financial, tax, medical or other consequential matters.</p>']
  ]),
  affiliate: translatedDocument('Affiliate disclosure', 'Clear labelling of commercial recommendations and partner links.', [
    ['Current status', '<p>The product currently promises no affiliate recommendations. The EUR 12 price covers only the described analysis and PDF.</p>'], ['Future partner links', '<p>If introduced, partner links will be labelled directly as advertising or affiliate links.</p>'], ['Independence', '<p>Possible commission is not a quality guarantee; users should review the price, suitability, privacy and terms of external offers.</p>']
  ]),
  disclaimer: translatedDocument('Disclaimer', 'Clear separation between AI-supported guidance and professional advice.', [
    ['No professional advice', '<p>DaniniHub does not provide legal, tax, financial, investment or medical advice.</p>'], ['No promise of success', '<p>No income, sales, funding, employment, project approval, health or other outcome is guaranteed.</p>'], ['Review of results', '<p>AI output can be incomplete or wrong. Verify facts, deadlines and consequential statements before acting.</p>'], ['External links', '<p>External operators are responsible for their content; a link is not a guarantee of accuracy or suitability.</p>'], ['Statutory rights', '<p>This notice does not restrict mandatory consumer, warranty or statutory liability rights.</p>']
  ])
};

function getLegalDocument(lang, key) {
  return documents[lang]?.[key] || documents.de[key];
}

module.exports = { PROVIDER, UPDATED, getLegalDocument };
