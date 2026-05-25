const fs = require('fs');
const path = require('path');


function polishOutlineText(input, fallback = '') {
  const raw = Array.isArray(input)
    ? input.filter(Boolean).join('\n\n')
    : String(input || '');

  const fallbackText = typeof fallback === 'string' &&
    !/^(de|en|sr|bs|hr)$/i.test(fallback.trim()) &&
    fallback.trim().length > 10
      ? fallback
      : '';

  let text = raw.trim() || fallbackText.trim();

  if (!text) {
    return '';
  }

  return text
    .replace(/\r\n/g, '\n')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/^[-*]\s+/gm, '• ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function readReferenceFile(candidatePaths) {
  try {
    const fs = require('fs');
    const path = require('path');

    const candidates = Array.isArray(candidatePaths)
      ? candidatePaths
      : [candidatePaths];

    for (const candidate of candidates) {
      const safeCandidate = String(candidate || '').trim();

      if (!safeCandidate) {
        continue;
      }

      const fullPath = path.isAbsolute(safeCandidate)
        ? safeCandidate
        : path.join(process.cwd(), safeCandidate);

      if (!fs.existsSync(fullPath)) {
        continue;
      }

      const stat = fs.statSync(fullPath);

      if (!stat.isFile()) {
        continue;
      }

      const content = fs.readFileSync(fullPath, 'utf8').trim();

      if (content) {
        return content;
      }
    }

    return '';
  } catch {
    return '';
  }
}




function asText(value) {
  if (value === undefined || value === null) return '';
  if (Array.isArray(value)) return value.filter(Boolean).join('\n');
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
}

function detectLocaleFromText(text = '') {
  const t = String(text).toLowerCase();

  if (
    /[čćžšđ]/i.test(t) ||
    t.includes('strategija') ||
    t.includes('ustav') ||
    t.includes('slede') ||
    t.includes('korisnik') ||
    t.includes('plać') ||
    t.includes('izveštaj') ||
    t.includes('e-knjig')
  ) {
    return 'sr';
  }

  if (
    t.includes(' und ') ||
    t.includes(' der ') ||
    t.includes(' die ') ||
    t.includes(' das ') ||
    t.includes(' nicht') ||
    t.includes('entscheidung') ||
    t.includes('projekt') ||
    t.includes('klarheit')
  ) {
    return 'de';
  }

  return 'en';
}

function detectLocaleFromArtifact(artifact) {
  const explicit = artifact?.input?.locale;
  const detected = detectLocaleFromText(
    [
      artifact?.input?.raw,
      artifact?.input?.dialogue,
      artifact?.result?.summary,
      artifact?.result?.sections?.D_execution,
      artifact?.result?.sections?.C_plan
    ].filter(Boolean).join('\n')
  );

  return explicit || detected || 'de';
}

function labels(locale) {
  const dict = {
    de: {
      title: 'DaniniHub Activation Artifact',
      subtitle: '7 € Projekt-Snapshot, Klarheitsbewertung und 7-Tage-Entscheidungsplan',
      dialogue: 'Kundenseitige Orientierung',
      analysis: 'Project Snapshot',
      positives: 'Current Clarity Score',
      negatives: 'Gate Status',
      recommendation: 'STOP / REDEFINE / GO',
      nextSteps: '3 nächste Schritte für 7 Tage',
      premiumOutline: '3 zentrale Widersprüche',
      bonusOutline: 'Operativer Fokus',
      quietCalls: 'Optionale Vertiefung',
      disclaimers: 'Verantwortung & Transparenz',
      evidence: 'Evidence / System Trace',
      controller: 'Interne Prüfung',
      footer: 'KI-unterstützter Entscheidungsbericht. Keine Rechts-, Finanz-, Steuer- oder medizinische Beratung.',
      emailSubject: 'Ihr DaniniHub Activation Artifact ist bereit'
    },
    sr: {
      title: 'DaniniHub Aktivacioni artefakt',
      subtitle: '7 € projektni snapshot, ocena jasnoće i 7-dnevni plan odluke',
      dialogue: 'Korisnička orijentacija',
      analysis: 'Project Snapshot',
      positives: 'Current Clarity Score',
      negatives: 'Gate Status',
      recommendation: 'STOP / REDEFINE / GO',
      nextSteps: '3 naredna koraka za 7 dana',
      premiumOutline: '3 ključne kontradikcije',
      bonusOutline: 'Operativni fokus',
      quietCalls: 'Opciona produbljena analiza',
      disclaimers: 'Odgovornost i transparentnost',
      evidence: 'Evidence / sistemski trag',
      controller: 'Interna provera',
      footer: 'AI-podržan izveštaj za odluku. Ovo nije pravni, finansijski, poreski ili medicinski savet.',
      emailSubject: 'Vaš DaniniHub Aktivacioni artefakt je spreman'
    },
    en: {
      title: 'DaniniHub Activation Artifact',
      subtitle: '7 € project snapshot, clarity score and 7-day decision plan',
      dialogue: 'Customer-facing orientation',
      analysis: 'Project Snapshot',
      positives: 'Current Clarity Score',
      negatives: 'Gate Status',
      recommendation: 'STOP / REDEFINE / GO',
      nextSteps: '3 next steps for 7 days',
      premiumOutline: '3 key contradictions',
      bonusOutline: 'Operational Focus',
      quietCalls: 'Optional Deepening',
      disclaimers: 'Responsibility & Transparency',
      evidence: 'Evidence / System Trace',
      controller: 'Interne Prüfung',
      footer: 'AI-supported decision report. This is not legal, financial, tax or medical advice.',
      emailSubject: 'Your DaniniHub Activation Artifact is ready'
    }
  };

  return dict[locale] || dict.de;
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function firstNonEmpty(...values) {
  for (const value of values) {
    const text = asText(value).trim();
    if (text) return text;
  }
  return '';
}

function cleanCustomerFacingText(text) {
  return asText(text)
    .replace(/Core Orchestrator/gi, 'DaniniHub System')
    .replace(/Meta Commander/gi, 'DaniniHub Controller')
    .replace(/V1 SKELET/gi, '')
    .replace(/149\s*€/gi, '')
    .replace(/jetzt kaufen|buy now|kupite/gi, '')
    .replace(/Premium PDF/gi, 'vertiefender Bericht')
    .replace(/Bonus PDF/gi, 'ergänzender Bericht')
    .replace(/Da li želite.*$/gim, '')
    .replace(/Möchten Sie.*$/gim, '')
    .replace(/Do you want.*$/gim, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function inferProjectName(rawInput, locale) {
  const text = asText(rawInput).trim();

  if (!text) {
    return locale === 'sr'
      ? 'Nije eksplicitno imenovano'
      : locale === 'de'
        ? 'Nicht ausdrücklich benannt'
        : 'Not explicitly named';
  }

  const short = text
    .replace(/\s+/g, ' ')
    .slice(0, 90)
    .trim();

  return short || (
    locale === 'sr'
      ? 'Projekt iz korisničkog unosa'
      : locale === 'de'
        ? 'Projekt aus Kundeneingabe'
        : 'Project from customer input'
  );
}

function buildProjectSnapshot({ locale, artifact, rawInput, summary }) {
  const projectName = inferProjectName(rawInput || summary, locale);
  const currentFocus = cleanCustomerFacingText(
    firstNonEmpty(
      artifact?.project?.focus,
      artifact?.result?.sections?.A_problem,
      artifact?.result?.sections?.B_evidence,
      summary,
      rawInput
    )
  );

  if (locale === 'sr') {
    return [
      `Naziv / radni opis projekta: ${projectName}`,
      `Datum artefakta: ${todayIsoDate()}`,
      `Jezik artefakta: sr`,
      `Trenutni fokus: ${currentFocus || 'Razjasniti problem, ciljnu grupu, ponudu i sledeći merljiv korak.'}`,
      'Namena dokumenta: prvi strukturisan trag odluke nakon 7 € aktivacije.'
    ].join('\n');
  }

  if (locale === 'de') {
    return [
      `Projektname / Arbeitsbeschreibung: ${projectName}`,
      `Datum des Artefakts: ${todayIsoDate()}`,
      `Sprache des Artefakts: de`,
      `Aktueller Fokus: ${currentFocus || 'Problem, Zielgruppe, Angebot und nächsten messbaren Schritt klären.'}`,
      'Zweck des Dokuments: erster strukturierter Entscheidungstrace nach der 7 € Aktivierung.'
    ].join('\n');
  }

  return [
    `Project name / working description: ${projectName}`,
    `Artifact date: ${todayIsoDate()}`,
    `Artifact language: en`,
    `Current focus: ${currentFocus || 'Clarify the problem, target group, offer and next measurable step.'}`,
    'Document purpose: first structured decision trace after the 7 € activation.'
  ].join('\n');
}

function buildClarityScore({ locale, rawInput, summary, sections }) {
  const text = [rawInput, summary, asText(sections)].join(' ').toLowerCase();

  let score = 5;
  if (text.length > 500) score += 1;
  if (/(zielgruppe|target group|ciljna grupa|kupac|kunde|customer)/i.test(text)) score += 1;
  if (/(preis|price|cena|zahlung|payment|7|€|eur)/i.test(text)) score += 1;
  if (/(risiko|risk|contradiction|kontradikcija|widerspruch)/i.test(text)) score += 1;
  if (/(nächste|next|slede|korak|step|plan)/i.test(text)) score += 1;

  score = Math.max(3, Math.min(8, score));

  if (locale === 'sr') {
    return [
      `Ocena jasnoće: ${score}/10`,
      score >= 7
        ? 'Projekat ima dovoljno strukture za naredni operativni korak, ali još nije potpuno investiciono ili tržišno zaokružen.'
        : 'Projekat ima početnu strukturu, ali još traži oštrije definisanje ciljne grupe, problema, ponude i kriterijuma uspeha.',
      'Ocena nije “motivaciona”, već pokazuje koliko je trenutno moguće doneti dobru odluku bez dodatnih pretpostavki.'
    ].join('\n');
  }

  if (locale === 'de') {
    return [
      `Klarheitswert: ${score}/10`,
      score >= 7
        ? 'Das Projekt hat genug Struktur für den nächsten operativen Schritt, ist aber noch nicht vollständig markt- oder investitionsreif verdichtet.'
        : 'Das Projekt hat eine erste Struktur, benötigt aber schärfere Definition von Zielgruppe, Problem, Angebot und Erfolgskriterien.',
      'Der Wert ist keine Motivation, sondern zeigt, wie gut aktuell eine belastbare Entscheidung ohne zusätzliche Annahmen möglich ist.'
    ].join('\n');
  }

  return [
    `Clarity score: ${score}/10`,
    score >= 7
      ? 'The project has enough structure for the next operational step, but is not yet fully market- or investment-ready.'
      : 'The project has an initial structure, but still needs sharper definition of target group, problem, offer and success criteria.',
    'The score is not motivational; it shows how reliably a decision can currently be made without extra assumptions.'
  ].join('\n');
}

function buildGateStatus({ locale, rawInput, summary }) {
  const text = [rawInput, summary].join(' ').toLowerCase();

  const hasProblem = /(problem|pain|bedarf|potreba|bol|jasnoća|klarheit)/i.test(text);
  const hasAudience = /(zielgruppe|audience|ciljna|kupac|kunde|customer)/i.test(text);
  const hasOffer = /(angebot|offer|ponuda|produkt|product|pdf|artefakt)/i.test(text);
  const hasPayment = /(preis|price|cena|zahlung|payment|7|€|eur|stripe)/i.test(text);

  let gate = 'Gate 1';
  let status = 'REDEFINE';

  if (hasProblem && hasAudience && hasOffer && hasPayment) {
    gate = 'Gate 4';
    status = 'GO';
  } else if (hasProblem && (hasAudience || hasOffer)) {
    gate = 'Gate 2';
    status = 'REDEFINE';
  } else if (hasProblem) {
    gate = 'Gate 1';
    status = 'REDEFINE';
  } else {
    gate = 'Gate 0';
    status = 'STOP';
  }

  if (locale === 'sr') {
    return [
      `Trenutni gate: ${gate}`,
      `Status: ${status}`,
      status === 'GO'
        ? 'Projekat je spreman za mali operativni test sa jasno ograničenim obimom.'
        : status === 'REDEFINE'
          ? 'Projekat ne treba širiti dok se ne razjasni sledeća ključna pretpostavka.'
          : 'Projekat treba zaustaviti dok osnovni problem i korisnik nisu jasni.'
    ].join('\n');
  }

  if (locale === 'de') {
    return [
      `Aktueller Gate: ${gate}`,
      `Status: ${status}`,
      status === 'GO'
        ? 'Das Projekt ist bereit für einen kleinen operativen Test mit klar begrenztem Umfang.'
        : status === 'REDEFINE'
          ? 'Das Projekt sollte nicht erweitert werden, bevor die nächste zentrale Annahme geklärt ist.'
          : 'Das Projekt sollte gestoppt werden, bis Grundproblem und Nutzer klar sind.'
    ].join('\n');
  }

  return [
    `Current gate: ${gate}`,
    `Status: ${status}`,
    status === 'GO'
      ? 'The project is ready for a small operational test with a clearly limited scope.'
      : status === 'REDEFINE'
        ? 'The project should not be expanded before the next key assumption is clarified.'
        : 'The project should stop until the core problem and user are clear.'
  ].join('\n');
}

function buildContradictions(locale) {
  if (locale === 'sr') {
    return [
      '1. Vrednost mora biti dovoljno konkretna za kupca, ali ne sme otkriti operativnu logiku sistema.',
      '2. Artefakt mora izgledati ozbiljno, ali ne sme obećavati rezultat koji zavisi od tržišta, prava, finansija ili zdravlja.',
      '3. Sledeći korak mora biti jasan, ali ne sme gurati korisnika u nepotrebnu kupovinu bez boljeg razumevanja problema.'
    ].join('\n');
  }

  if (locale === 'de') {
    return [
      '1. Der Bericht muss für den Käufer konkret nützlich sein, darf aber die operative Systemlogik nicht offenlegen.',
      '2. Das Artefakt muss substanziell wirken, darf aber keinen Erfolg versprechen, der von Markt, Recht, Finanzen oder Gesundheit abhängt.',
      '3. Der nächste Schritt muss klar sein, darf den Nutzer aber nicht ohne bessere Problemklarheit in weitere Käufe drängen.'
    ].join('\n');
  }

  return [
    '1. The report must be concretely useful for the buyer without exposing the system’s operational logic.',
    '2. The artifact must feel substantial without promising outcomes dependent on market, legal, financial or health factors.',
    '3. The next step must be clear without pushing the user into further purchase before the problem is better understood.'
  ].join('\n');
}

function buildSevenDayPlan(locale) {
  if (locale === 'sr') {
    return [
      'Dan 1–2: Zapišite jednu ciljnu grupu, jedan konkretan problem i jednu merljivu posledicu tog problema.',
      'Dan 3–4: Definišite minimalnu ponudu: šta korisnik dobija, u kom formatu i gde je granica odgovornosti.',
      'Dan 5–7: Testirajte jednu poruku, jednu cenu ili jedan poziv na akciju; ne menjati više elemenata odjednom.'
    ].join('\n');
  }

  if (locale === 'de') {
    return [
      'Tag 1–2: Eine Zielgruppe, ein konkretes Problem und eine messbare Folge dieses Problems schriftlich festhalten.',
      'Tag 3–4: Das minimale Angebot definieren: Was erhält der Nutzer, in welchem Format und wo liegt die Verantwortungsgrenze?',
      'Tag 5–7: Eine Botschaft, einen Preisanker oder einen Call-to-Action testen; nicht mehrere Elemente gleichzeitig verändern.'
    ].join('\n');
  }

  return [
    'Day 1–2: Write down one target group, one concrete problem and one measurable consequence of that problem.',
    'Day 3–4: Define the minimum offer: what the user receives, in what format and where the responsibility boundary is.',
    'Day 5–7: Test one message, one price anchor or one call to action; do not change several elements at once.'
  ].join('\n');
}

function buildDecisionLogic(locale) {
  if (locale === 'sr') {
    return [
      'Trenutna odluka: REDEFINE.',
      'GO uslov: ciljna grupa, problem, format isporuke i sledeći merljivi test moraju stati u jednu jasnu rečenicu.',
      'STOP uslov: ako se projekat širi bez dokaza, bez korisnika ili bez jasne granice odgovornosti.'
    ].join('\n');
  }

  if (locale === 'de') {
    return [
      'Aktuelle Entscheidung: REDEFINE.',
      'GO-Bedingung: Zielgruppe, Problem, Lieferformat und nächster messbarer Test müssen in einem klaren Satz formulierbar sein.',
      'STOP-Bedingung: Wenn das Projekt ohne Evidenz, ohne Nutzerklarheit oder ohne Verantwortungsgrenze erweitert wird.'
    ].join('\n');
  }

  return [
    'Current decision: REDEFINE.',
    'GO condition: target group, problem, delivery format and next measurable test must fit into one clear sentence.',
    'STOP condition: if the project expands without evidence, user clarity or a responsibility boundary.'
  ].join('\n');
}


function readActivationPreviewBlock() {
  return readReferenceFile([
    'docs/products/activation-preview/PREVIEW_BLOCK.md'
  ]);
}

function buildOptionalDeepening(locale) {
  const preview = readActivationPreviewBlock();

  if (preview) {
    return polishOutlineText(preview);
  }

  if (locale === 'sr') {
    return [
      'Diskretni pregled dodatnih materijala',
      '',
      'Premium e-knjiga produbljuje metod odlučivanja: Project Snapshot, Clarity Score, Gate 0–5, kontradikcije i GO / REDEFINE / STOP logiku.',
      '',
      'Bonus report služi kao kompaktan realitäts-check: šta trenutno blokira jasnoću, koje pretpostavke treba proveriti i šta uraditi u narednih sedam dana.',
      '',
      'Ovaj 7 EUR Activation Artifact ostaje samostalno upotrebljiv i ne zavisi od dodatnih materijala.'
    ].join('\n');
  }

  if (locale === 'de') {
    return [
      'Diskrete Vorschau auf weiterführende Materialien',
      '',
      'Das Premium E-Book vertieft die Entscheidungslogik: Project Snapshot, Clarity Score, Gate 0–5, Widersprüche und GO / REDEFINE / STOP.',
      '',
      'Der Bonus Report ergänzt den Prozess durch einen kompakten Realitätscheck: aktuelle Blockaden, prüfbare Annahmen und nächste Schritte für sieben Tage.',
      '',
      'Dieser 7 EUR Activation Artifact bleibt eigenständig nutzbar und ist nicht von zusätzlichen Materialien abhängig.'
    ].join('\n');
  }

  return [
    'Discreet preview of deeper materials',
    '',
    'The Premium E-Book deepens the decision method: Project Snapshot, Clarity Score, Gate 0–5, contradictions and GO / REDEFINE / STOP.',
    '',
    'The Bonus Report adds a compact reality check: current blockers, testable assumptions and next steps for seven days.',
    '',
    'This 7 EUR Activation Artifact remains independently usable and does not depend on additional materials.'
  ].join('\n');
}

function buildResponsibilityBlock(locale) {
  if (locale === 'sr') {
    return [
      'Human-in-the-loop: konačnu odluku donosi korisnik, ne AI sistem.',
      'AI transparentnost: dokument je generisan uz AI pomoć i strukturisan kroz DaniniHub kontrolni tok.',
      'Bez garancija: artefakt ne garantuje prihod, pravnu sigurnost, medicinski ishod ili tržišni uspeh.',
      'Privatnost: lični podaci treba da se koriste samo za svrhu aktivacije, isporuke i evidencije, u skladu sa važećim pravilima privatnosti.'
    ].join('\n');
  }

  if (locale === 'de') {
    return [
      'Human-in-the-loop: Die endgültige Entscheidung trifft der Nutzer, nicht das KI-System.',
      'KI-Transparenz: Dieses Dokument wurde mit KI-Unterstützung erstellt und durch den DaniniHub-Kontrollfluss strukturiert.',
      'Keine Garantie: Das Artefakt garantiert keinen Umsatz, keine Rechtssicherheit, kein medizinisches Ergebnis und keinen Markterfolg.',
      'Datenschutz: Personenbezogene Daten sollen nur für Aktivierung, Zustellung und Nachweisführung verarbeitet werden, nach geltenden Datenschutzregeln.'
    ].join('\n');
  }

  return [
    'Human-in-the-loop: the final decision is made by the user, not the AI system.',
    'AI transparency: this document was created with AI assistance and structured through the DaniniHub control flow.',
    'No guarantee: the artifact does not guarantee revenue, legal certainty, medical outcomes or market success.',
    'Privacy: personal data should only be processed for activation, delivery and record-keeping under applicable privacy rules.'
  ].join('\n');
}

function buildOperationalFocus(locale, sections) {
  const plan = cleanCustomerFacingText(firstNonEmpty(sections?.C_plan, sections?.E_next));
  if (plan) return plan;

  if (locale === 'sr') {
    return 'Fokus je da se iz ideje ukloni višak, definiše jedna odluka i pripremi sledeći mali test.';
  }

  if (locale === 'de') {
    return 'Der Fokus liegt darauf, Überladung zu reduzieren, eine Entscheidung zu definieren und den nächsten kleinen Test vorzubereiten.';
  }

  return 'The focus is to reduce overload, define one decision and prepare the next small test.';
}

function buildActivationPack(artifact) {
  const locale = detectLocaleFromArtifact(artifact);
  const t = labels(locale);

  const rawInput = artifact?.input?.raw || artifact?.input?.dialogue || '';
  const sections = artifact?.result?.sections || {};
  const summary = cleanCustomerFacingText(artifact?.result?.summary || '');

  return {
    locale,
    labels: t,
    meta: {
      title: t.title,
      subtitle: t.subtitle,
      run_id: artifact?.run_id || '',
      timestamp: artifact?.timestamp || '',
      mode: '',
      lead_agent: '',
      document_type: locale === 'de' ? 'Geprüfter Entscheidungsbericht' : locale === 'sr' ? 'Provereni izveštaj odluke' : 'Verified decision report',
      watermark: 'DANINIHUB SYSTEM VERIFIED'
    },
    content: {
      dialogue: locale === 'de' ? 'Dieser Bericht fasst die kundenseitige Projektorientierung nach der 7 € Aktivierung zusammen.' : locale === 'sr' ? 'Ovaj izveštaj sažima korisničku orijentaciju nakon 7 € aktivacije.' : 'This report summarizes the customer-facing orientation after the 7 € activation.',
      analysis: buildProjectSnapshot({ locale, artifact: {}, rawInput: '', summary: '' }),
      positives: buildClarityScore({ locale, rawInput: '', summary, sections: {} }),
      negatives: buildGateStatus({ locale, rawInput: '', summary: '' }),
      recommendation: buildDecisionLogic(locale),
      nextSteps: buildSevenDayPlan(locale),
      premiumOutline: buildContradictions(locale),
      bonusOutline: buildOperationalFocus(locale, {}),
      quietCalls: buildOptionalDeepening(locale),
      disclaimers: buildResponsibilityBlock(locale),
      evidence: '',
      controller: ''
    }
  };
}

module.exports = {
  buildActivationPack,
  labels,
  detectLocaleFromArtifact
};
