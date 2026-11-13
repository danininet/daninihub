export type Locale = "de" | "sr";
export const verticals = ["cbam", "subcontractor", "nearshoring"] as const;
export const content = {
  de: {
    eyebrow: "DACH ↔ BALKAN · BUSINESS OPERATIONS",
    title: "Grenzen verbinden.",
    accent: "Geschäfte vorbereiten.",
    intro:
      "Wir bringen Struktur in Ihre grenzüberschreitenden Projekte. Mit klaren Unterlagen, digitaler Vorbereitung und persönlicher Kontrolle.",
    cta: "Projekt prüfen lassen",
    services: "Leistungen",
    process: "So arbeiten wir",
    contact: "Projektanfrage",
    auto: "AutoDanini",
    lead: "Drei Bereiche. Ein klarer nächster Schritt.",
    sub: "Für Unternehmen, die zwischen dem Balkan und dem DACH-Raum zusammenarbeiten.",
    flow: [
      "Projekt beschreiben",
      "Unterlagen strukturieren",
      "Lücken sichtbar machen",
      "Persönlich prüfen",
    ],
    flowText: [
      "Sie nennen Ziel, Zielland und Ausgangslage.",
      "Wir ordnen Ihre Informationen dem passenden Leistungsbereich zu.",
      "Sie erhalten eine Übersicht fehlender Informationen und offener Prüfpunkte.",
      "Ein Mensch prüft den Bericht vor der Freigabe. Umfang und Preis werden vorher vereinbart.",
    ],
    ai: "KI unterstützt. Menschen entscheiden.",
    aiText:
      "KI kann Informationen ordnen und Entwürfe vorbereiten. Jeder finale Bericht braucht eine menschliche Freigabe. Wir stellen keine behördlichen Bescheinigungen aus.",
    boundary:
      "Administrative Vorbereitung für Unternehmen. Keine individuelle Rechts- oder Steuerberatung, keine Zollanmeldung und keine Garantie regulatorischer Konformität.",
    formTitle: "Ihr Projekt beginnt mit Klarheit.",
    formText:
      "Beschreiben Sie Ihr Vorhaben. Wir prüfen zunächst den passenden Leistungsumfang. Durch die Anfrage entsteht kein kostenpflichtiger Auftrag.",
    name: "Name",
    company: "Unternehmen",
    email: "Geschäftliche E-Mail",
    country: "Zielland",
    area: "Leistungsbereich",
    message: "Was möchten Sie vorbereiten?",
    consent:
      "Ich habe die Datenschutzhinweise gelesen und frage im Namen eines Unternehmens an.",
    send: "Projektanfrage senden",
    notice:
      "KI-gestützte Verarbeitung: Ihre Angaben können für einen Entwurf strukturiert werden. Keine automatisierte verbindliche Entscheidung. Bitte keine Ausweise, Gesundheitsdaten oder sensiblen Beschäftigtendaten eingeben.",
    cards: [
      {
        id: "cbam",
        num: "01",
        title: "CBAM Data & Pre-Compliance",
        short: "Daten ordnen. Fehlende Angaben erkennen.",
        text: "Für Importeure und Lieferanten: Produkt-, Mengen- und Emissionsinformationen in eine nachvollziehbare Arbeitsgrundlage überführen.",
        items: [
          "Produkt- und Lieferantendaten erfassen",
          "Datenlücken und Quellen dokumentieren",
          "Unterlagen für die Fachprüfung vorbereiten",
        ],
        details:
          "Eine strukturierte Datenübersicht, eine Liste offener Informationen und eine zweisprachige Arbeitsgrundlage. Die verbindliche Einreihung und regulatorische Bewertung bleibt bei befugten Fachstellen.",
      },
      {
        id: "subcontractor",
        num: "02",
        title: "DACH Subcontractor Readiness",
        short: "Teams vorbereiten. Unterlagen zusammenführen.",
        text: "Für Unternehmen mit grenzüberschreitenden Einsätzen: Dokumentation nach Zielland, Tätigkeit und Projekt geordnet.",
        items: [
          "Projektbezogene Dokumentenliste",
          "DE, AT und CH getrennt betrachten",
          "Fehlende Nachweise sichtbar machen",
        ],
        details:
          "Eine Dokumentenmatrix nach Einsatzland und Tätigkeit. A1, Meldeverfahren und branchenspezifische Anforderungen werden als Prüfpunkte erfasst; Anwendbarkeit und Fristen erfordern eine qualifizierte Einzelfallprüfung.",
      },
      {
        id: "nearshoring",
        num: "03",
        title: "Nearshoring & Product Compliance",
        short: "Lieferketten aufbauen. Dokumentation stärken.",
        text: "Für Produzenten und Einkäufer: Herkunfts-, Material- und Produktinformationen für die Zusammenarbeit zwischen Balkan und DACH.",
        items: [
          "Lieferanteninformationen strukturieren",
          "Herkunfts- und Materialnachweise zuordnen",
          "Technische Unterlagen auf Vollständigkeit prüfen",
        ],
        details:
          "Eine nachvollziehbare Dokumentenstruktur mit offenen Prüfpunkten zu Ursprung, Kennzeichnung und Produktsicherheit. Keine Zertifizierung, Laborprüfung oder automatische Übernahme einer Importeurrolle.",
      },
    ],
  },
  sr: {
    eyebrow: "DACH ↔ BALKAN · POSLOVNA PODRŠKA",
    title: "Povezujemo tržišta.",
    accent: "Pripremamo poslovanje.",
    intro:
      "Unosimo red u vaše prekogranične projekte. Kroz preglednu dokumentaciju, digitalnu pripremu i ličnu kontrolu.",
    cta: "Pošaljite projekat na preliminarnu proveru",
    services: "Usluge",
    process: "Kako radimo",
    contact: "Poslovni upit",
    auto: "AutoDanini",
    lead: "Tri oblasti. Jasan sledeći korak.",
    sub: "Za preduzeća koja posluju između Balkana i DACH regiona.",
    flow: [
      "Opišite projekat",
      "Sređujemo podatke",
      "Izdvajamo nedostatke",
      "Lično proveravamo",
    ],
    flowText: [
      "Navedite cilj, zemlju poslovanja i trenutno stanje.",
      "Razvrstavamo informacije prema odgovarajućoj oblasti.",
      "Dobijate pregled nedostajućih podataka i otvorenih pitanja.",
      "Čovek proverava izveštaj pre odobrenja. Obim i cenu unapred dogovaramo.",
    ],
    ai: "AI pomaže. Čovek odlučuje.",
    aiText:
      "AI može da strukturira podatke i pripremi nacrte. Završni izveštaj zahteva ljudsko odobrenje. Ne izdajemo službene potvrde.",
    boundary:
      "Administrativna priprema za preduzeća. Bez individualnog pravnog i poreskog savetovanja, podnošenja carinskih prijava i garantovanja regulatorne usklađenosti.",
    formTitle: "Vaš projekat počinje jasnim informacijama.",
    formText:
      "Opišite šta pripremate. Najpre utvrđujemo odgovarajući obim usluge. Slanje upita ne stvara obavezu plaćanja.",
    name: "Ime i prezime",
    company: "Preduzeće",
    email: "Poslovni e-mail",
    country: "Ciljna zemlja",
    area: "Oblast usluge",
    message: "Šta želite da pripremite?",
    consent:
      "Pročitao/la sam obaveštenje o privatnosti i upit šaljem u ime preduzeća.",
    send: "Pošalji poslovni upit",
    notice:
      "Obrada uz AI podršku: podaci mogu biti strukturirani za pripremu nacrta. Nema automatizovane obavezujuće odluke. Ne unosite lična dokumenta, zdravstvene niti osetljive podatke zaposlenih.",
    cards: [
      {
        id: "cbam",
        num: "01",
        title: "CBAM podaci i preliminarna priprema",
        short: "Sređeni podaci. Vidljivi nedostaci.",
        text: "Za uvoznike i dobavljače: pregledna radna osnova sa informacijama o proizvodima, količinama i emisijama.",
        items: [
          "Prikupljanje podataka o proizvodima i dobavljačima",
          "Evidencija nedostataka i izvora",
          "Priprema za stručnu proveru",
        ],
        details:
          "Strukturiran pregled podataka, spisak informacija koje nedostaju i dvojezična radna dokumentacija. Obavezujuće razvrstavanje robe i regulatornu procenu rade ovlašćeni stručnjaci.",
      },
      {
        id: "subcontractor",
        num: "02",
        title: "Priprema podizvođača za DACH",
        short: "Spremniji timovi. Pregledna dokumentacija.",
        text: "Za preduzeća koja angažuju timove preko granice: dokumentacija razvrstana prema zemlji, delatnosti i projektu.",
        items: [
          "Kontrolna lista za konkretan projekat",
          "Odvojena obrada DE, AT i CH",
          "Pregled nedostajućih dokaza",
        ],
        details:
          "Matrica dokumentacije prema zemlji i vrsti posla. A1, postupci prijave i sektorski zahtevi evidentiraju se kao tačke provere; primenljivost i rokovi zahtevaju stručnu procenu konkretnog slučaja.",
      },
      {
        id: "nearshoring",
        num: "03",
        title: "Nearshoring i dokumentacija proizvoda",
        short: "Pouzdanija saradnja. Uređeni podaci.",
        text: "Za proizvođače i kupce: poreklo, materijali i dokumentacija proizvoda za saradnju Balkana i DACH regiona.",
        items: [
          "Strukturiranje podataka o dobavljačima",
          "Razvrstavanje dokaza o poreklu i sastavu",
          "Provera potpunosti tehničkih dokumenata",
        ],
        details:
          "Pregledna dokumentacija sa otvorenim tačkama o poreklu, označavanju i bezbednosti proizvoda. Bez sertifikacije, laboratorijskih ispitivanja i automatskog preuzimanja uloge uvoznika.",
      },
    ],
  },
};
