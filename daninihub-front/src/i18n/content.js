export const content = {
  de: {
    languageNavigation: 'Sprache wählen', eyebrow: 'Die KI fragt nach · persönliche Analyse',
    title: 'Eine bessere Antwort beginnt mit den richtigen Rückfragen.',
    lead: 'Beschreiben Sie Ihre konkrete Situation. Die KI stellt genau drei aufeinander aufbauende Rückfragen und erstellt anschließend eine persönliche Analyse mit Entscheidung, Risiken und priorisierten nächsten Schritten.',
    cta: 'Analyse für 12 EUR starten', ctaShort: 'Für 12 EUR starten', howItWorks: 'So funktioniert es',
    facts: ['Einmalzahlung', 'Genau drei Rückfragen', 'Persönlicher PDF-Bericht', 'Zustellung per E-Mail'],
    processLabel: 'Ablauf', processTitle: 'Vier Antworten statt endlosem Chat.',
    steps: [
      { title: 'Ausgangslage beschreiben', text: 'Nennen Sie das konkrete Problem, die anstehende Entscheidung und das gewünschte Ergebnis.' },
      { title: 'Drei Rückfragen beantworten', text: 'Jede Frage greift Ihre Angaben auf und klärt genau eine offene Annahme.' },
      { title: 'Analyse erhalten', text: 'Sie erhalten eine klare Einordnung als GO, REDEFINE oder STOP sowie umsetzbare nächste Schritte.' }
    ],
    resultLabel: 'Ihr Ergebnis', resultTitle: 'Persönlich, konkret und nachvollziehbar.',
    resultItems: ['Ausgangslage auf Basis Ihrer Angaben', 'Kernerkenntnisse und offene Annahmen', 'Konkrete Risiken und Entscheidungsbegründung', 'Prioritäten für die nächsten 72 Stunden und sieben Tage'],
    priceLabel: 'Preis', priceTitle: '12 EUR einmalig. Ohne Abo.', priceText: 'Im Preis enthalten: geführter Dialog, persönliche Abschlussanalyse, PDF-Dokument und E-Mail-Zustellung.', oneTime: 'einmalig',
    transparencyLabel: 'Transparenz', transparencyTitle: 'KI-Unterstützung mit klaren Grenzen.', transparencyText: 'Die Analyse basiert ausschließlich auf Ihren Antworten und kann Fehler enthalten. Sie ersetzt keine Rechts-, Finanz-, Steuer- oder medizinische Beratung. Die endgültige Entscheidung treffen Sie.',
    footer: 'Persönliche KI-Analyse · Zahlung über Gumroad'
  },
  sr: {
    languageNavigation: 'Izaberite jezik', eyebrow: 'AI pita dalje · lična analiza',
    title: 'Bolji odgovor počinje pravim podpitanjima.',
    lead: 'Opišite konkretnu situaciju. AI postavlja tačno tri povezana podpitanja, a zatim priprema ličnu analizu sa odlukom, rizicima i prioritetnim sledećim koracima.',
    cta: 'Pokreni analizu za 12 EUR', ctaShort: 'Pokreni za 12 EUR', howItWorks: 'Kako funkcioniše',
    facts: ['Jednokratno plaćanje', 'Tačno tri podpitanja', 'Lični PDF izveštaj', 'Isporuka emailom'],
    processLabel: 'Proces', processTitle: 'Četiri odgovora umesto beskonačnog chata.',
    steps: [
      { title: 'Opišite polaznu situaciju', text: 'Navedite konkretan problem, odluku koja je pred vama i željeni rezultat.' },
      { title: 'Odgovorite na tri podpitanja', text: 'Svako pitanje koristi vaše prethodne odgovore i razjašnjava jednu otvorenu pretpostavku.' },
      { title: 'Preuzmite analizu', text: 'Dobijate jasnu procenu GO, REDEFINE ili STOP i konkretne sledeće korake.' }
    ],
    resultLabel: 'Vaš rezultat', resultTitle: 'Lično, konkretno i proverljivo.',
    resultItems: ['Polazna situacija zasnovana na vašim odgovorima', 'Ključni uvidi i otvorene pretpostavke', 'Konkretni rizici i razlog odluke', 'Prioriteti za naredna 72 sata i sedam dana'],
    priceLabel: 'Cena', priceTitle: '12 EUR jednokratno. Bez pretplate.', priceText: 'U cenu ulaze vođeni razgovor, lična završna analiza, PDF dokument i isporuka emailom.', oneTime: 'jednokratno',
    transparencyLabel: 'Transparentnost', transparencyTitle: 'AI pomoć sa jasnim granicama.', transparencyText: 'Analiza se zasniva isključivo na vašim odgovorima i može sadržati greške. Ne zamenjuje pravni, finansijski, poreski ili medicinski savet. Konačnu odluku donosite vi.',
    footer: 'Lična AI analiza · plaćanje preko Gumroad-a'
  },
  en: {
    languageNavigation: 'Choose language', eyebrow: 'AI asks further · personal analysis',
    title: 'A better answer starts with the right follow-up questions.',
    lead: 'Describe your specific situation. AI asks exactly three connected follow-up questions, then creates a personal analysis with a decision, risks and prioritized next steps.',
    cta: 'Start analysis for 12 EUR', ctaShort: 'Start for 12 EUR', howItWorks: 'How it works',
    facts: ['One-time payment', 'Exactly three follow-ups', 'Personal PDF report', 'Email delivery'],
    processLabel: 'Process', processTitle: 'Four answers instead of an endless chat.',
    steps: [
      { title: 'Describe your starting point', text: 'State the specific problem, the decision ahead and the outcome you need.' },
      { title: 'Answer three follow-ups', text: 'Each question uses your previous answers and resolves one open assumption.' },
      { title: 'Receive your analysis', text: 'Get a clear GO, REDEFINE or STOP assessment and concrete next actions.' }
    ],
    resultLabel: 'Your result', resultTitle: 'Personal, specific and traceable.',
    resultItems: ['Starting point based on your answers', 'Key insights and open assumptions', 'Specific risks and decision rationale', 'Priorities for the next 72 hours and seven days'],
    priceLabel: 'Price', priceTitle: '12 EUR one-time. No subscription.', priceText: 'Includes the guided dialogue, personal final analysis, PDF document and email delivery.', oneTime: 'one-time',
    transparencyLabel: 'Transparency', transparencyTitle: 'AI assistance with clear limits.', transparencyText: 'The analysis is based solely on your answers and may contain errors. It is not legal, financial, tax or medical advice. You make the final decision.',
    footer: 'Personal AI analysis · payment through Gumroad'
  }
}

export function detectInitialLanguage() {
  const nav = navigator.language?.toLowerCase() || ''
  if (nav.startsWith('de')) return 'de'
  if (['sr', 'hr', 'bs', 'me'].some(code => nav.startsWith(code))) return 'sr'
  return 'en'
}
