# AutoDanini P0 — Entwurf für juristische Prüfung (KEINE Veröffentlichung)

**Stand:** 23.11.2026 · **Status:** INTERN / DRAFT · **Geltungsbereich:** `/de/ai-savetnik/`, `/sr/ai-savetnik/` und optionale Anfragen.

**Wichtig:** Dieser Text ist keine Rechtsberatung. `src/lib/legal.ts` und die öffentlichen Rechtsseiten bleiben unverändert. Eine Aufnahme in die Datenschutzhinweise/Verbraucherbedingungen bedarf einer fachlichen Prüfung und einer separaten Freigabe vor dem Release.

## 1. Tatsächliche technische Trennung

- Neuer kostenloser problemorientierter Dialog: rein lokale Regeln; maximal drei aufeinander bezogene Fragen, keine Modellaufrufe und keine Übertragung an DANINI; nur Themenkennung und die Auswahl Ja/Nein/Unbekannt im `sessionStorage`. Freitext wird nicht persistiert.
- Optionale Analyse von Inseratsdaten: bestehender separater Flow über `/api/vehicle-analysis`, der nach eigenständiger Nutzeraktion und Turnstile von den Serverregeln und den jeweils verfügbaren AI-Konfigurationen abhängt. Der neue Dialog schaltet keine zusätzlichen AI-Aufrufe frei.
- Optionale individuelle Anfrage: existierendes AutoDanini-Formular auf `/{locale}/auto-check/#contact` über `/api/lead` und Turnstile; Betreiberkommunikation via Brevo/Gmail nur bei tatsächlicher Akzeptanz. Keine Bestellung, Bezahlung oder Newsletteranmeldung durch den kostenlosen Dialog.
- Keine Kfz-Sachverständigenprüfung, keine amtliche Abfrage, keine Gewähr für Verkäuferidentität, Eigentum, VIN, Laufleistung, Schäden, Importabgaben oder Kaufentscheidung.

## 2. Vorgeschlagene Ergänzung für /de/ai-transparenz/ — fachlich prüfen

> **Kostenlose Orientierung:** Der erste Dialog ordnet Ihr Anliegen ausschließlich mithilfe fester Regeln ein. Er ist keine generative KI-Auswertung und verifiziert keine Angaben über Fahrzeuge oder Anbieter. Ihre Antworten bleiben während dieses Schrittes lokal im Browser; lediglich die Auswahl des Themas und die Antworten Ja/Nein/Unbekannt können in der laufenden Browsersitzung zwischengespeichert werden.
>
> **Optionale KI-gestützte Analyse:** Wenn Sie ausdrücklich eine gesonderte Fahrzeugdatenanalyse anfordern, kann — abhängig von aktueller Verfügbarkeit und Freigabe — ein KI-Modell zur Strukturierung der von Ihnen bereitgestellten Inhalte eingesetzt werden. Ob tatsächlich ein KI-Modell eingesetzt wurde, wird im Ergebnis gesondert gekennzeichnet. Ein regelbasiertes Ergebnis wird niemals als generative KI-Auswertung bezeichnet.
>
> **Grenzen:** Weder die Regeln noch KI-Ausgaben stellen eine unabhängige Prüfung von Fahrzeug, Verkäufer, Dokumenten, Eigentum, FIN/VIN, Laufleistung, Preis, Unfallschäden oder Rechtslage dar. Unbekannte Angaben werden als „Nicht bestätigt“ gekennzeichnet. Lassen Sie Dokumente, Fahrzeug und Rechtsfragen nötigenfalls durch befugte Stellen prüfen.

## 3. Predlog dopune /sr/ai-transparenz/ — za proveru

> **Besplatno usmeravanje:** Prvi razgovor koristi unapred definisana pravila, a ne generativni AI model. Nema nezavisne provere vozila ili prodavca. Odgovori se obrađuju lokalno; izbor oblasti i Da/Ne/Ne znam mogu se sačuvati samo tokom trenutne sesije browsera.
>
> **Opciona AI analiza:** Tek ako zasebno pokrenete analizu podataka oglasa, postojeći server može, kada je dozvoljeno i dostupno, koristiti AI model. U rezultatu mora jasno pisati da li je model zaista korišćen. Rezultat zasnovan samo na pravilima ne sme biti predstavljen kao generativna AI analiza.
>
> **Granice:** Navodi korisnika, dostavljeni dokazi i nezavisno potvrđene informacije nisu isto. „Nije potvrđeno“ važi za neproverene podatke. Nema garancije identiteta, vlasništva, istorije oštećenja, kilometraže, ispravnosti, uvoznih dažbina ni uspeha kupovine.

## 4. Datenschutzhinweise — notwendige Prüfentscheidungen

1. **Zwecke und Rechtsgrundlagen je Verarbeitungsschritt nach Art. 6 DSGVO:** lokale Orientierung ohne Serverdaten; optionale Inseratanalyse; Missbrauchsabwehr mit Turnstile; unverbindliche Kontaktanfrage; spätere vertragliche Abwicklung. Eine Lesebestätigung ersetzt keine gesetzlich erforderliche Einwilligung. Newsletter gesondert und nur mit einschlägiger Rechtsgrundlage.
2. **Informationspflichten bei Datenerhebung nach Art. 13 DSGVO:** Kategorien von Nutzereingaben, Verarbeitungszwecke, Rechtsgrundlagen, Empfänger (Cloudflare inklusive Workers AI, Turnstile, ggf. D1/R2/KV; Brevo/Gmail nur für Kontakt), Übermittlungen in Drittländer, Betroffenenrechte, Aufsichtsbehörde, gesetzliche/vertragliche Erforderlichkeit.
3. **Speicherfristen:** Die vorhandenen Texte nennen `ca. 30/90 Tage` für B2B als Konzept, nicht nachweislich für AutoDanini oder alle Anbieterprotokolle. Tatsächliche D1-/R2-/KV-/Worker-/Brevo-/Gmail-Aufbewahrung und Löschung getrennt auditieren und konkrete, haltbare Fristen benennen.
4. **Auftragsverarbeitung/Drittlandtransfers:** geltende AVV/DPA, Cloudflare Workers AI Datenverwendung, Brevo/Gmail und etwaige Unterauftragsverarbeiter prüfen. Keine pauschale „EU-only“-Behauptung.
5. **Dateien und Nachweise:** kein amtliches Ausweisdokument oder Bank-/Zahlungsdaten in die anfängliche Eingabe; separate Regeln für freiwillig übermittelte Bilder/Unterlagen, sensible Inhalte, Löschung und ggf. Rechte Dritter.
6. **Nutzerrechte:** Auskunft/Löschung/Widerspruch und Kontaktkanal klar zugänglich; keine bloß werbliche KI-Kennzeichnung.

## 5. EU AI Act: Artikel 50 — Prüfmaßstab

Artikel 50 Transparenzpflichten sind seit **2. August 2026** anwendbar. Beim direkten Austausch mit einem KI-System ist die Information über die KI-Interaktion grundsätzlich spätestens bei der ersten Interaktion verständlich bereitzustellen (mit gesetzlichen Ausnahmen). Die besondere Übergangsregel für bestimmte vorher in Verkehr gebrachte Systeme zur Kennzeichnung synthetischer Inhalte nach Artikel 50(2) darf nicht mit einer pauschalen Verschiebung der Chat-Transparenz verwechselt werden. Für den neuen regelbasierten Dialog ist die korrekte Kennzeichnung „regelbasiert“, für den separaten Modellfluss bei tatsächlicher Nutzung „KI-gestützt“ erforderlich.

Offizielle Quellen:
- https://eur-lex.europa.eu/eli/reg/2024/1689
- https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act
- https://ai-act-service-desk.ec.europa.eu/en/ai-act/timeline/timeline-implementation-eu-ai-act
- https://eur-lex.europa.eu/eli/reg/2016/679/oj

## 6. B2C-Verbraucherangebot: rechtlich offen

`src/lib/legal.ts` enthält bislang als **B2B** bezeichnete AGB; diese sind ausdrücklich nicht automatisch die Vertragsbedingungen eines privaten AutoDanini-Käufers. Vor einer kostenpflichtigen Auto-Vorprüfung gesondert klären: Vertragspartner, Leistungsbeschreibung/Abgrenzung zur physischen Prüfung, Gesamtpreise und ggf. USt-Angaben, vorvertragliche Informationen, Widerrufsbelehrung und gegebenenfalls Regelung zu ausdrücklichem Leistungsbeginn, Aufbewahrung der Beauftragung, Haftung/Verbraucherrechte und Rechnung.

## 7. Freigabesperre

Nicht öffentlich ausrollen, keine Rechtsseiten ersetzen und keine neue zahlungsauslösende oder zusätzliche KI-Inferenzfunktion aktivieren, bis fachliche Freigabe und eine belastbare 0-€-Grenze für zusätzliche Kosten vorliegen. Die vorhandene `AI_ENABLED=true`-Konfiguration bestätigt keine harte finanzielle Obergrenze. Die lokale Regelnavigation bleibt kostenfrei ohne Modellaufruf.
