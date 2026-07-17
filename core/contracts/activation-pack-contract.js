'use strict';

function asText(value) {
  if (value === undefined || value === null) return '';
  if (Array.isArray(value)) return value.filter(Boolean).map(String).join('\n');
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value).trim();
}

function clean(value) {
  return asText(value)
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/^[-*]\s+/gm, '• ')
    .replace(/DaniniHub Meta Commander/gi, 'DaniniHub')
    .replace(/core\.[\w.-]+/gi, 'DaniniHub')
    .replace(/Legacy controller/gi, 'System')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function detectLocaleFromArtifact(artifact = {}) {
  const locale = artifact?.input?.locale;
  if (['de', 'sr', 'en'].includes(locale)) return locale;
  const sample = asText(artifact?.input?.raw).toLowerCase();
  if (/[čćžšđ]/i.test(sample)) return 'sr';
  if (/\b(und|die|der|entscheidung|welche|nicht)\b/i.test(sample)) return 'de';
  return 'en';
}

function labels(locale) {
  const copy = {
    de: {
      title: 'Ihre persönliche KI-Analyse',
      subtitle: 'Konkrete Einordnung auf Basis Ihrer Antworten',
      dialogue: 'Ihre Angaben',
      analysis: 'Ausgangslage',
      positives: 'Kernerkenntnisse',
      negatives: 'Offene Annahmen',
      recommendation: 'Entscheidung',
      nextSteps: 'Priorisierte nächste Schritte',
      premiumOutline: 'Risiken und Grenzen',
      bonusOutline: 'Erster Schritt innerhalb von 72 Stunden',
      quietCalls: 'Hinweis',
      disclaimers: 'Transparenz und Verantwortung',
      evidence: 'Grundlage der Analyse',
      controller: 'Qualitätsprüfung',
      footer: 'KI-gestützte Orientierung auf Basis Ihrer Angaben. Keine Rechts-, Finanz-, Steuer- oder medizinische Beratung.',
      emailSubject: 'Ihre persönliche KI-Analyse ist fertig',
      documentType: 'Persönliche Analyse',
      insufficient: 'Dazu liegen in Ihren Antworten noch keine belastbaren Angaben vor.'
    },
    sr: {
      title: 'Vaša lična AI analiza',
      subtitle: 'Konkretna procena zasnovana na vašim odgovorima',
      dialogue: 'Vaši odgovori',
      analysis: 'Polazna situacija',
      positives: 'Ključni uvidi',
      negatives: 'Otvorene pretpostavke',
      recommendation: 'Odluka',
      nextSteps: 'Prioritetni sledeći koraci',
      premiumOutline: 'Rizici i ograničenja',
      bonusOutline: 'Prvi korak u naredna 72 sata',
      quietCalls: 'Napomena',
      disclaimers: 'Transparentnost i odgovornost',
      evidence: 'Osnova analize',
      controller: 'Kontrola kvaliteta',
      footer: 'AI-podržana orijentacija zasnovana na vašim odgovorima. Nije pravni, finansijski, poreski ili medicinski savet.',
      emailSubject: 'Vaša lična AI analiza je spremna',
      documentType: 'Lična analiza',
      insufficient: 'Za ovaj deo u vašim odgovorima još nema dovoljno pouzdanih podataka.'
    },
    en: {
      title: 'Your personal AI analysis',
      subtitle: 'A concrete assessment based on your answers',
      dialogue: 'Your answers',
      analysis: 'Starting point',
      positives: 'Key insights',
      negatives: 'Open assumptions',
      recommendation: 'Decision',
      nextSteps: 'Prioritized next steps',
      premiumOutline: 'Risks and limitations',
      bonusOutline: 'First step within 72 hours',
      quietCalls: 'Note',
      disclaimers: 'Transparency and responsibility',
      evidence: 'Basis of the analysis',
      controller: 'Quality review',
      footer: 'AI-supported guidance based on your answers. Not legal, financial, tax or medical advice.',
      emailSubject: 'Your personal AI analysis is ready',
      documentType: 'Personal analysis',
      insufficient: 'Your answers do not yet contain enough reliable information for this section.'
    }
  };
  return copy[locale] || copy.de;
}

function bulletList(value, fallback) {
  const values = Array.isArray(value)
    ? value.map(clean).filter(Boolean)
    : clean(value).split('\n').map(item => item.replace(/^•\s*/, '').trim()).filter(Boolean);
  return values.length ? values.map(item => `• ${item}`).join('\n') : fallback;
}

function decisionText(artifact, t) {
  const status = ['GO', 'REDEFINE', 'STOP'].includes(artifact?.result?.decision)
    ? artifact.result.decision
    : 'REDEFINE';
  const reason = clean(artifact?.result?.decision_reason);
  return reason ? `${status} — ${reason}` : `${status} — ${t.insufficient}`;
}

function responsibility(locale) {
  if (locale === 'sr') return 'Analiza je generisana uz AI pomoć isključivo iz dostavljenih odgovora. Konačnu odluku donosite vi. Nepotpuni ili netačni ulazni podaci mogu promeniti zaključak.';
  if (locale === 'en') return 'This analysis was generated with AI assistance solely from the answers provided. You make the final decision. Incomplete or inaccurate input may change the conclusion.';
  return 'Diese Analyse wurde mit KI-Unterstützung ausschließlich aus Ihren Angaben erstellt. Die endgültige Entscheidung treffen Sie. Unvollständige oder unzutreffende Angaben können die Schlussfolgerung verändern.';
}

function dialogueIntro(locale) {
  if (locale === 'sr') return 'Analiza u nastavku odnosi se na konkretne informacije koje ste naveli u vođenom razgovoru.';
  if (locale === 'en') return 'The analysis below refers to the specific information you provided in the guided dialogue.';
  return 'Die folgende Analyse bezieht sich auf die konkreten Angaben aus Ihrem geführten Dialog.';
}

function evidenceBasis(locale) {
  if (locale === 'sr') return 'Osnova su početni odgovor i tri odgovora na ciljano postavljena podpitanja. Zaključci bez dovoljne potvrde označeni su kao otvorene pretpostavke.';
  if (locale === 'en') return 'The basis is the opening answer plus three answers to targeted follow-up questions. Conclusions without sufficient support are marked as open assumptions.';
  return 'Grundlage sind die Ausgangsantwort und drei Antworten auf gezielte Rückfragen. Nicht ausreichend belegte Schlussfolgerungen sind als offene Annahmen gekennzeichnet.';
}

function buildActivationPack(artifact = {}) {
  const locale = detectLocaleFromArtifact(artifact);
  const t = labels(locale);
  const sections = artifact?.result?.sections || {};
  const summary = clean(artifact?.result?.summary);

  return {
    locale,
    labels: t,
    meta: {
      title: t.title,
      subtitle: t.subtitle,
      run_id: artifact.run_id || '',
      timestamp: artifact.timestamp || '',
      mode: '',
      lead_agent: '',
      document_type: t.documentType,
      watermark: 'DANINIHUB'
    },
    content: {
      dialogue: dialogueIntro(locale),
      analysis: clean(sections.A_problem) || summary || t.insufficient,
      positives: bulletList(artifact?.result?.insights || sections.B_evidence, t.insufficient),
      negatives: bulletList(artifact?.result?.assumptions, t.insufficient),
      recommendation: decisionText(artifact, t),
      nextSteps: bulletList(sections.C_plan, clean(artifact.next_step) || t.insufficient),
      premiumOutline: bulletList(artifact.risks, t.insufficient),
      bonusOutline: clean(artifact.next_step || sections.E_next) || t.insufficient,
      quietCalls: '',
      disclaimers: responsibility(locale),
      evidence: evidenceBasis(locale),
      controller: ''
    }
  };
}

module.exports = { buildActivationPack, labels, detectLocaleFromArtifact };
