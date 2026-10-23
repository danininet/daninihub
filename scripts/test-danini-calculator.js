'use strict';

const assert = require('node:assert/strict');
const { daniniEstimate } = require('../public/danini-quickcheck.js');

const equalMoney = (actual, expected) => {
  assert.ok(Math.abs(actual - expected) < 0.000001,
    'Expected ' + actual + ' to equal ' + expected + ' EUR');
};

// Sample: vehicle 10,000 EUR, freight 700 EUR, certificate 280 EUR.
// Shipping is part of the customs base exactly once.
const withProof = daniniEstimate(10000, 700, 0, 280, 0);
const withoutProof = daniniEstimate(10000, 700, 0, 280, 0.125);
equalMoney(withProof.customsBase, 10700);
equalMoney(withProof.duty, 0);
equalMoney(withProof.vat, 2140);
equalMoney(withProof.total, 13120);
equalMoney(withoutProof.duty, 1337.5);
equalMoney(withoutProof.vat, 2407.5);
equalMoney(withoutProof.total, 14725);
equalMoney(withoutProof.total-withProof.total, 1605);

// If driving on export plates, do not assume a second truck transport charge.
const drive = daniniEstimate(10000, 0, 180, 280, 0.125);
equalMoney(drive.customsBase, 10000);
equalMoney(drive.duty, 1250);
equalMoney(drive.vat, 2250);
equalMoney(drive.total, 13960);

// Small fractional values should remain numeric, not rounded mid-formula.
const small = daniniEstimate(5300.50, 150.25, 0, 280, 0.125);
assert.ok(Number.isFinite(small.total));
assert.ok(small.total > 0);
assert.throws(() => daniniEstimate(-1, 0, 0, 0, 0.125));
assert.throws(() => daniniEstimate(Infinity, 0, 0, 0, 0.125));
console.log('DANINI EUR QuickCheck customs/VAT comparison, delta and input validation: OK');
