require('dotenv').config();

const Stripe = require('stripe');

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function siteUrl(req) {
  return (
    process.env.DANINIHUB_SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.PUBLIC_SITE_URL ||
    `${req.protocol}://${req.get('host')}`
  ).replace(/\/+$/, '');
}


function ownerOpsBlock() {
  if (process.env.DANINIHUB_SHOW_OWNER_LINKS !== 'true') return '';

  return `
      <section id="owner-ops">
        <div class="section-head">
          <div class="badge">Interner Owner-Bereich</div>
          <h2>Operativer Bereich für DaniniHub Owner Tasks.</h2>
          <p>
            Dieser Bereich ist nicht Teil der öffentlichen Kundenführung. Er dient der internen Steuerung,
            Prüfung und Ausführung kontrollierter Agentenaufgaben.
          </p>
        </div>

        <div class="grid two">
          <div class="card">
            <h3>Owner Task Panel</h3>
            <p>Interne Aufgabensteuerung für kontrollierte Agent Runs mit Scope, Audit und Datei-Ergebnis.</p>
            <p style="margin-top:16px"><a class="cta secondary" href="/owner/tasks">Owner Panel öffnen</a></p>
          </div>
          <div class="card">
            <h3>Runtime Health</h3>
            <p>Technische Statusprüfung des lokalen DaniniHub Runtime-Prozesses.</p>
            <p style="margin-top:16px"><a class="cta secondary" href="/health">Health prüfen</a></p>
          </div>
        </div>
      </section>
  `;
}


function renderHome() {
  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>DaniniHub · Strukturierte Projektklarheit für 7 €</title>
  <meta name="description" content="DaniniHub erstellt für 7 € einen strukturierten Activation Artifact: vollständiger Kundendialog, Tiefenanalyse, Clarity Score, Gate Status, GO / REDEFINE / STOP und 7-Tage-Plan.">
  <style>
    :root{
      --bg:#0f1115;
      --deep:#07080b;
      --panel:#171a21;
      --paper:#f4efe6;
      --soft:#d8d0c0;
      --muted:#b9b1a3;
      --gold:#c7a76b;
      --gold2:#e3c783;
      --line:rgba(199,167,107,.24);
      --line2:rgba(244,239,230,.10);
      --danger:#d9a86c;
    }
    *{box-sizing:border-box}
    html{scroll-behavior:smooth}
    body{
      margin:0;
      background:
        radial-gradient(circle at top left,rgba(199,167,107,.12),transparent 34%),
        radial-gradient(circle at top right,rgba(244,239,230,.08),transparent 32%),
        linear-gradient(180deg,#151821 0,#0f1115 48%,#07080b 100%);
      color:var(--paper);
      font-family:Arial,Helvetica,sans-serif;
    }
    a{color:inherit}
    .wrap{max-width:1180px;margin:0 auto;padding:28px}
    header{
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:24px;
      border-bottom:1px solid var(--line);
      padding-bottom:22px;
      position:sticky;
      top:0;
      backdrop-filter:blur(14px);
      background:rgba(15,17,21,.82);
      z-index:10;
    }
    .brand{
      letter-spacing:.32em;
      text-transform:uppercase;
      font-size:12px;
      color:var(--gold);
      white-space:nowrap;
    }
    .nav{display:flex;gap:18px;font-size:13px;color:var(--muted);flex-wrap:wrap;justify-content:flex-end}
    .nav a{text-decoration:none}
    .nav a:hover{color:var(--paper)}
    .hero{
      padding:88px 0 58px;
      display:grid;
      grid-template-columns:1.16fr .84fr;
      gap:38px;
      align-items:center;
    }
    .badge{
      color:var(--gold);
      text-transform:uppercase;
      letter-spacing:.24em;
      font-size:12px;
      margin-bottom:16px;
    }
    h1{
      font-size:68px;
      line-height:.95;
      letter-spacing:-.065em;
      margin:0 0 24px;
      max-width:820px;
    }
    h2{
      font-size:38px;
      line-height:1.08;
      letter-spacing:-.045em;
      margin:0 0 16px;
    }
    h3{margin:0 0 12px;font-size:21px;letter-spacing:-.025em}
    p{margin:0}
    .lead{
      font-size:21px;
      line-height:1.72;
      color:#d8d0c0;
      max-width:800px;
    }
    .hero-actions{display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-top:28px}
    .cta{
      display:inline-flex;
      align-items:center;
      justify-content:center;
      padding:16px 22px;
      border-radius:999px;
      background:var(--gold);
      color:#111318;
      text-decoration:none;
      font-weight:800;
      text-transform:uppercase;
      letter-spacing:.14em;
      font-size:12px;
      border:0;
      cursor:pointer;
      min-height:50px;
    }
    .cta:hover{background:var(--gold2)}
    .secondary{
      background:transparent;
      color:var(--paper);
      border:1px solid var(--line);
    }
    .secondary:hover{background:rgba(244,239,230,.06);color:var(--paper)}
    .panel{
      background:linear-gradient(180deg,rgba(244,239,230,.075),rgba(244,239,230,.035));
      border:1px solid var(--line);
      border-radius:34px;
      padding:30px;
      box-shadow:0 30px 80px rgba(0,0,0,.24);
    }
    .price{font-size:58px;letter-spacing:-.065em;margin:10px 0 8px}
    .small{color:var(--muted);line-height:1.7;font-size:15px}
    .micro{color:var(--muted);line-height:1.65;font-size:13px}
    .facts{display:grid;gap:12px;margin-top:24px}
    .fact{display:flex;gap:12px;border-top:1px solid var(--line2);padding-top:12px;color:#d8d0c0;font-size:14px;line-height:1.55}
    .dot{width:7px;height:7px;border-radius:50%;background:var(--gold);margin-top:7px;flex:0 0 auto}
    section{padding:48px 0;border-top:1px solid var(--line)}
    .section-head{max-width:820px;margin-bottom:28px}
    .section-head p{color:var(--muted);font-size:17px;line-height:1.7}
    .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
    .grid.two{grid-template-columns:repeat(2,1fr)}
    .card{
      background:rgba(244,239,230,.048);
      border:1px solid var(--line);
      border-radius:26px;
      padding:25px;
      min-height:178px;
    }
    .card p,.card li{color:var(--muted);line-height:1.67;font-size:15px}
    ul{padding-left:20px;margin:14px 0 0}
    li{margin:10px 0;color:#d8d0c0;line-height:1.58}
    .wide{
      background:rgba(199,167,107,.08);
      border:1px solid var(--line);
      border-radius:32px;
      padding:30px;
    }
    .steps{counter-reset:step;display:grid;gap:14px;margin-top:24px}
    .step{
      display:grid;
      grid-template-columns:48px 1fr;
      gap:16px;
      padding:18px;
      border:1px solid var(--line2);
      border-radius:22px;
      background:rgba(7,8,11,.22);
    }
    .step:before{
      counter-increment:step;
      content:counter(step);
      width:42px;
      height:42px;
      border-radius:50%;
      display:flex;
      align-items:center;
      justify-content:center;
      color:#111318;
      background:var(--gold);
      font-weight:800;
    }
    .step strong{display:block;margin-bottom:6px}
    .step span{color:var(--muted);line-height:1.65;font-size:15px}
    .quote{
      border-left:3px solid var(--gold);
      padding-left:18px;
      color:#d8d0c0;
      line-height:1.72;
      font-size:17px;
    }
    .final-cta{
      text-align:center;
      padding:42px;
      border-radius:34px;
      border:1px solid var(--line);
      background:
        radial-gradient(circle at top,rgba(199,167,107,.14),transparent 45%),
        rgba(244,239,230,.045);
    }
    footer{
      border-top:1px solid var(--line);
      padding:30px 0;
      color:var(--muted);
      font-size:13px;
      line-height:1.75;
    }
    @media(max-width:900px){
      .hero,.grid,.grid.two{grid-template-columns:1fr}
      h1{font-size:46px}
      .nav{display:none}
      .wrap{padding:22px}
      .hero{padding-top:58px}
    }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <div class="brand">DaniniHub</div>
      <nav class="nav" aria-label="Hauptnavigation">
        <a href="#warum">Warum 7 €</a>
        <a href="#artifact">Artifact</a>
        <a href="#analyse">Tiefenanalyse</a>
        <a href="#ablauf">Ablauf</a>
        <a href="#vertiefung">Vertiefung</a>
        <a href="#vertrauen">Transparenz</a>
      </nav>
    </header>

    <main>
      <section class="hero" aria-label="DaniniHub Einführung">
        <div>
          <div class="badge">DACH-first · strukturierte Projektklarheit · Human-in-the-loop</div>
          <h1>Kein weiterer KI-Chat. Ein prüfbarer Entscheidungsbericht.</h1>
          <p class="lead">
            DaniniHub verwandelt einen unklaren Projektimpuls in einen strukturierten 7 € Activation Artifact:
            vollständiger kundenseitiger Dialog, verdichteter Kontext, Tiefenanalyse des Problems,
            Widerspruchsprüfung, Clarity Score, Gate Status, GO / REDEFINE / STOP und ein konkreter 7-Tage-Plan.
          </p>
          <div class="hero-actions">
            <form method="post" action="/checkout">
              <button class="cta" type="submit">7 € Aktivierung starten</button>
            </form>
            <a class="cta secondary" href="#artifact">Was ist enthalten?</a>
          </div>
          <p class="micro" style="margin-top:18px">
            Die Aktivierung ist kein Erfolgsversprechen und kein Ersatz für fachliche Beratung. Sie ist ein strukturierter Startpunkt,
            um ein Projekt nicht aus Bauchgefühl, sondern anhand einer dokumentierten Entscheidungsspur weiterzuführen.
          </p>
        </div>

        <aside class="panel" aria-label="7 Euro Aktivierung">
          <div class="badge">Activation Artifact</div>
          <div class="price">7 €</div>
          <p class="small">
            Ein einmaliger Einstieg für einen kundenseitigen Projekt-Snapshot mit Analyse, Entscheidungssystematik und nächstem Schritt.
            Bezahlt wird nicht für eine kurze KI-Antwort, sondern für ein strukturiertes Artefakt, das den Dialog dokumentiert und auswertet.
          </p>
          <div class="facts">
            <div class="fact"><span class="dot"></span><span>Vollständige kundenseitige Dialogspur in bereinigter, lesbarer Form.</span></div>
            <div class="fact"><span class="dot"></span><span>Tiefenanalyse mit Widersprüchen, Risiken und offenen Annahmen.</span></div>
            <div class="fact"><span class="dot"></span><span>Clarity Score, Gate Status und 7-Tage-Entscheidungsplan.</span></div>
          </div>
        </aside>
      </section>

      <section id="warum">
        <div class="section-head">
          <div class="badge">Warum 7 €?</div>
          <h2>Der Preis trennt Neugier von echter Projektabsicht.</h2>
          <p>
            Die 7 € Aktivierung ist bewusst klein, aber nicht wertlos. Sie schafft einen ersten verbindlichen Schritt:
            Der Nutzer bringt sein Problem ein, DaniniHub strukturiert den Dialog, reduziert Unklarheit und liefert einen prüfbaren Bericht.
          </p>
        </div>

        <div class="grid">
          <div class="card">
            <h3>Kein kostenloses Rauschen</h3>
            <p>
              Kostenlose KI-Chats erzeugen oft viele Antworten, aber wenig Entscheidung. Der Activation Artifact begrenzt den Prozess
              auf Klarheit, Widersprüche und nächste Schritte.
            </p>
          </div>
          <div class="card">
            <h3>Ein dokumentierter Startpunkt</h3>
            <p>
              Der Nutzer erhält eine nachvollziehbare Grundlage: Was wurde eingebracht, was ist noch unklar, was blockiert die Entscheidung
              und welcher nächste Schritt ist sinnvoll?
            </p>
          </div>
          <div class="card">
            <h3>Schutz vor falscher Umsetzung</h3>
            <p>
              Nicht jedes Projekt braucht sofort mehr Content, mehr Technik oder mehr Werbung. Manchmal ist STOP oder REDEFINE der wertvollere Schritt.
            </p>
          </div>
        </div>
      </section>

      <section id="artifact">
        <div class="section-head">
          <div class="badge">Was im Artifact enthalten ist</div>
          <h2>Ein PDF, das den kompletten Projektimpuls ernst nimmt.</h2>
          <p>
            Der 7 € Activation Artifact ist kein generischer One-Pager. Er enthält den kundenseitigen Dialog und eine strukturierte Auswertung,
            damit aus einem unklaren Anliegen eine belastbare Entscheidungsspur entsteht.
          </p>
        </div>

        <div class="grid two">
          <div class="card">
            <h3>Vollständiger Kundendialog</h3>
            <p>
              Die relevante Konversation zwischen Nutzer und KI-System wird customer-safe dokumentiert: bereinigt, lesbar,
              ohne interne Systemlogik und ohne technische Details, die nicht zum Kundennutzen gehören.
            </p>
          </div>
          <div class="card">
            <h3>Dubinska / tiefgehende Problemanalyse</h3>
            <p>
              Der Bericht analysiert Ausgangslage, Zielgruppe, Angebot, Verantwortungsgrenze, Risiken, Widersprüche und fehlende Informationen.
              Ziel ist nicht Motivation, sondern Entscheidungsfähigkeit.
            </p>
          </div>
        </div>

        <div class="steps">
          <div class="step">
            <div>
              <strong>Projekt-Snapshot</strong>
              <span>Was ist das eigentliche Projekt, was ist nur Nebengeräusch und welche Entscheidung steht im Raum?</span>
            </div>
          </div>
          <div class="step">
            <div>
              <strong>Clarity Score</strong>
              <span>Eine Einschätzung, wie gut das Projekt aktuell entscheidungsfähig ist — nicht als Dekoration, sondern als Orientierung.</span>
            </div>
          </div>
          <div class="step">
            <div>
              <strong>Gate Status</strong>
              <span>Einordnung, ob das Projekt im aktuellen Zustand weitergehen, neu definiert oder gestoppt werden sollte.</span>
            </div>
          </div>
          <div class="step">
            <div>
              <strong>GO / REDEFINE / STOP</strong>
              <span>Eine klare Entscheidungslogik: weiterführen, schärfen oder bewusst nicht ausbauen.</span>
            </div>
          </div>
          <div class="step">
            <div>
              <strong>7-Tage-Plan</strong>
              <span>Ein kleiner, realistischer Plan für den nächsten überprüfbaren Schritt — ohne zehn parallele Baustellen.</span>
            </div>
          </div>
        </div>
      </section>

      <section id="analyse">
        <div class="section-head">
          <div class="badge">Tiefenanalyse statt Oberfläche</div>
          <h2>DaniniHub sucht nicht nach der schnellsten Antwort, sondern nach der tragfähigsten nächsten Entscheidung.</h2>
          <p>
            Viele Projekte scheitern nicht an fehlender Energie, sondern an unklaren Annahmen. DaniniHub macht diese Annahmen sichtbar,
            bevor Zeit, Geld und Aufmerksamkeit in die falsche Richtung fließen.
          </p>
        </div>

        <div class="wide">
          <p class="quote">
            Der Bericht fragt nicht: „Wie klingt das schöner?“ Sondern: „Was ist das Problem, wer ist betroffen,
            welche Annahme ist ungeprüft, wo liegt die Verantwortungsgrenze und welcher nächste Schritt ist messbar?“
          </p>
        </div>

        <div class="grid" style="margin-top:18px">
          <div class="card">
            <h3>Widersprüche</h3>
            <p>Unklare Zielgruppe, zu frühe Technik, falscher Preisanker, zu viel Content ohne Entscheidung oder fehlender STOP-Punkt.</p>
          </div>
          <div class="card">
            <h3>Risiken</h3>
            <p>Überforderung, falsche Erwartung, unklare Zuständigkeit, Compliance-Blindstellen oder Vermischung von Beratung und Automatisierung.</p>
          </div>
          <div class="card">
            <h3>Reduktion</h3>
            <p>Das Ergebnis ist nicht mehr Komplexität, sondern eine kleinere, prüfbare Entscheidung für die nächsten sieben Tage.</p>
          </div>
        </div>
      </section>


      <section id="ablauf">
        <div class="section-head">
          <div class="badge">Operativer Ablauf</div>
          <h2>Vom ersten Klick bis zum PDF-Artefakt ist der Ablauf klar getrennt.</h2>
          <p>
            Die öffentliche Seite verkauft keinen direkten PDF-Download. Der Nutzer startet mit der 7 € Aktivierung,
            durchläuft den Checkout und erhält erst danach den strukturierten Activation Artifact.
          </p>
        </div>

        <div class="steps">
          <div class="step">
            <div>
              <strong>1. Aktivierung starten</strong>
              <span>Der öffentliche CTA führt ausschließlich zu <code>/checkout</code>. Dort wird die bezahlte Stripe Checkout Session gestartet.</span>
            </div>
          </div>
          <div class="step">
            <div>
              <strong>2. Zahlung abschließen</strong>
              <span>Nach erfolgreicher Zahlung leitet Stripe auf <code>/success?session_id=...</code> zurück.</span>
            </div>
          </div>
          <div class="step">
            <div>
              <strong>3. Status prüfen</strong>
              <span>Der Aktivierungsstatus ist intern über <code>/activation/status?session_id=...</code> nachvollziehbar.</span>
            </div>
          </div>
          <div class="step">
            <div>
              <strong>4. PDF erhalten</strong>
              <span>Der PDF-Download läuft erst nach erfolgreicher Aktivierung über <code>/activation/download/pdf?run_id=...</code>.</span>
            </div>
          </div>
          <div class="step">
            <div>
              <strong>5. Email-Zustellung</strong>
              <span>Wenn eine Kundenadresse vorhanden ist, wird der Bericht zusätzlich über den konfigurierten Email-Flow zugestellt.</span>
            </div>
          </div>
        </div>
      </section>

      <section id="vertiefung">
        <div class="section-head">
          <div class="badge">Optionale Vertiefung</div>
          <h2>Der 7 € Artifact bleibt eigenständig nutzbar — und kann später vertieft werden.</h2>
          <p>
            Die Aktivierung ist ein Startpunkt. Wer danach weiterarbeiten will, erkennt bereits im Artifact,
            welche Vertiefung sinnvoll sein könnte — ohne aggressiven Verkauf und ohne künstliche Verknappung.
          </p>
        </div>

        <div class="grid two">
          <div class="card">
            <h3>Premium E-Book Vorschau</h3>
            <p>
              Das Premium E-Book vertieft die Methode hinter DaniniHub: Gegenfragen, Reduktion, Gate 0–5,
              Clarity Score, Entscheidungsdisziplin und Arbeitsblätter für strukturierte Projektklarheit.
            </p>
          </div>
          <div class="card">
            <h3>Bonus Report Vorschau</h3>
            <p>
              Der Bonus Report ergänzt den Artifact durch einen kompakten Realitätscheck:
              Blockaden, Annahmen, Widersprüche, Belastbarkeit und der nächste überprüfbare Schritt.
            </p>
          </div>
        </div>
      </section>

      <section id="stimmen">
        <div class="section-head">
          <div class="badge">Erfahrungsbuch</div>
          <h2>Vertrauen entsteht nicht durch erfundene Rezensionen.</h2>
          <p>
            DaniniHub wird Rückmeldungen erst dann veröffentlichen, wenn echte Nutzerstimmen vorliegen und freigegeben wurden.
            Das Erfahrungsbuch ist als späterer Vertrauensbereich vorgesehen — sachlich, überprüfbar und ohne künstliche Erfolgsgeschichten.
          </p>
        </div>

        <div class="wide">
          <p class="small">
            Bis dahin zählt nicht Social Proof, sondern die Qualität des ersten Artefakts: vollständiger Dialog,
            saubere Analyse, erkennbare Grenzen, nachvollziehbarer Entscheidungsweg und ein realistischer nächster Schritt.
          </p>
        </div>
      </section>

      <section id="zusammenarbeit">
        <div class="section-head">
          <div class="badge">Diskrete Zusammenarbeit</div>
          <h2>Für ausgewählte Projekte ist eine vertiefte Zusammenarbeit möglich.</h2>
          <p>
            Nicht jedes Projekt braucht Begleitung. Wenn der Activation Artifact zeigt, dass ein Projekt Substanz,
            Dringlichkeit und klare Verantwortung hat, kann eine vertiefte Zusammenarbeit geprüft werden.
            Diese Einladung bleibt bewusst leise: kein Druck, kein Funnel-Theater, keine Erfolgsgarantie.
          </p>
        </div>

        <div class="grid two">
          <div class="card">
            <h3>Wann es sinnvoll sein kann</h3>
            <p>
              Wenn Zielgruppe, Problem, Angebot und nächster Test erkennbar sind, aber Struktur, Priorisierung oder Umsetzungstiefe fehlen.
            </p>
          </div>
          <div class="card">
            <h3>Wann es nicht sinnvoll ist</h3>
            <p>
              Wenn Grundproblem, Verantwortung, Datenlage oder rechtliche/finanzielle Rahmenbedingungen nicht geklärt sind.
              Dann ist REDEFINE oder STOP ehrlicher.
            </p>
          </div>
        </div>
      </section>

      <section id="vertrauen">
        <div class="section-head">
          <div class="badge">Transparenz & Verantwortung</div>
          <h2>KI unterstützt den Prozess. Die Entscheidung bleibt beim Menschen.</h2>
          <p>
            DaniniHub ist ein KI-unterstütztes Entscheidungssystem. Es ersetzt keine fachliche Prüfung und keine persönliche Verantwortung.
            Der Nutzer entscheidet, welche Informationen eingebracht werden und welche Schritte daraus folgen.
          </p>
        </div>

        <div class="grid">
          <div class="card">
            <h3>Human-in-the-loop</h3>
            <p>Der Bericht unterstützt die Entscheidung. Er trifft sie nicht stellvertretend für den Nutzer.</p>
          </div>
          <div class="card">
            <h3>Keine Garantien</h3>
            <p>Keine Garantie für Umsatz, Rechtssicherheit, steuerliche Ergebnisse, medizinische Ergebnisse oder Markterfolg.</p>
          </div>
          <div class="card">
            <h3>Datenschutzbewusst</h3>
            <p>Personenbezogene Daten sollen nur für Aktivierung, Zustellung, Nachweisführung und erforderliche Kommunikation verarbeitet werden.</p>
          </div>
        </div>
      </section>

      ${ownerOpsBlock()}

      <section id="start">
        <div class="final-cta">
          <div class="badge">Startpunkt</div>
          <h2>Beginnen Sie mit einem prüfbaren Projekt-Artefakt.</h2>
          <p class="small" style="max-width:760px;margin:0 auto">
            Wenn Ihr Projekt aktuell zu groß, zu unklar oder zu verstreut wirkt, ist der erste Schritt nicht mehr Tempo.
            Der erste Schritt ist Klarheit.
          </p>
          <form method="post" action="/checkout" style="margin-top:24px">
            <button class="cta" type="submit">7 € Aktivierung starten</button>
          </form>
        </div>
      </section>
    </main>

    <footer>
      DaniniHub · DACH-first Projektklarheit · KI-unterstützter Entscheidungsbericht · Keine Rechts-, Finanz-, Steuer- oder medizinische Beratung.
      Datenschutz-, Cookie-, Affiliate- und AI-Transparenzhinweise müssen vor öffentlicher Bewerbung final geprüft und sichtbar bereitgestellt werden.
    </footer>
  </div>
</body>
</html>`;
}

function renderError(title, text) {
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
  <style>body{font-family:Arial;background:#0f1115;color:#f4efe6;padding:48px}main{max-width:760px;margin:auto;border:1px solid rgba(199,167,107,.3);padding:32px;border-radius:24px}a{color:#c7a76b}</style>
  </head><body><main><h1>${escapeHtml(title)}</h1><p>${escapeHtml(text)}</p><p><a href="/">Zurück</a></p></main></body></html>`;
}

function registerPublicSite(app) {
  app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(renderHome());
  });

  app.post('/checkout', async (req, res) => {
    try {
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).send(renderError('Checkout nicht konfiguriert', 'STRIPE_SECRET_KEY fehlt.'));
      }
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const base = siteUrl(req);

      const lineItem = process.env.STRIPE_PRICE_ID
        ? { price: process.env.STRIPE_PRICE_ID, quantity: 1 }
        : {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'DaniniHub 7 € Activation Artifact',
                description: 'Strukturierter Projekt-Snapshot mit Kundendialog, Tiefenanalyse, Clarity Score, Gate Status und 7-Tage-Plan.'
              },
              unit_amount: 700
            },
            quantity: 1
          };

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [lineItem],
        success_url: `${base}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/?cancelled=1`,
        customer_creation: 'if_required',
        metadata: {
          system: 'DaniniHub',
          product: '7_eur_activation',
          source: 'public_landing',
          locale: 'de',
          activation_id: `act_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`
        }
      });

      return res.redirect(303, session.url);
    } catch (error) {
      return res.status(500).send(renderError('Fehler beim Checkout', error.message || 'SERVER_ERROR'));
    }
  });
}

module.exports = {
  registerPublicSite
};
