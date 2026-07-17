'use strict';

const PRODUCTS = Object.freeze({
  'die-ki-fragt-nach': Object.freeze({
    id: 'die-ki-fragt-nach',
    name: 'Die KI fragt nach',
    price: 12,
    currency: 'EUR',
    locale: 'de',
    maxFollowUps: 3,
    status: 'pilot',
    finalSubject: 'Deine persönliche KI-Analyse',
    initialQuestion: 'Worum geht es konkret, welche Entscheidung steht an und was soll nach dieser Analyse klarer sein?',
    systemPurpose: [
      'Analysiere ausschließlich den konkreten Fall aus dem Kundendialog.',
      'Beziehe jede Rückfrage sichtbar auf eine bereits genannte Information und kläre genau eine offene Annahme.',
      'Wiederhole keine Frage, gib in Rückfragen noch keine Ratschläge und verwende keine austauschbaren Coaching-Floskeln.',
      'Nach genau drei Rückfragen folgt eine persönliche Abschlussanalyse mit belegter Ausgangslage, Kernerkenntnissen, offenen Annahmen, Risiken, Entscheidung und umsetzbaren nächsten Schritten.',
      'Nicht belegte Punkte müssen ausdrücklich als Annahme oder unbekannt markiert werden.',
      'Keine Rechts-, Finanz-, Medizin- oder Einkommensgarantie.'
    ].join(' ')
  })
});

function getProduct(productId) {
  const product = PRODUCTS[String(productId || '').trim()];
  if (!product) {
    const error = new Error('PRODUCT_NOT_FOUND');
    error.code = 'PRODUCT_NOT_FOUND';
    throw error;
  }
  return product;
}

function listProducts() {
  return Object.values(PRODUCTS).map(product => ({ ...product }));
}

module.exports = { getProduct, listProducts };
