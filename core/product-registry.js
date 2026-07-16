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
    systemPurpose: [
      'Führe eine strukturierte DACH-orientierte Problemanalyse durch.',
      'Stelle genau eine konkrete Rückfrage pro Schritt.',
      'Nutze maximal drei Rückfragen.',
      'Erstelle danach eine sachliche Abschlussanalyse mit Ausgangslage, Erkenntnissen, Risiken und nächsten Schritten.',
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
