require('dotenv').config();

const fs = require('fs');

function ok(label) {
  console.log(`OK   ${label}`);
}

function warn(label) {
  console.log(`WARN ${label}`);
}

function fail(label, error) {
  console.log(`FAIL ${label}: ${error.message}`);
  process.exitCode = 1;
}

try {
  fs.accessSync('docs/reference/ustav.txt', fs.constants.R_OK);
  ok('docs/reference/ustav.txt je dostupan');
} catch (error) {
  fail('Ustav nije dostupan', error);
}

try {
  fs.accessSync('docs/reference/AGENT PROTOCOLS (FULL 56).txt', fs.constants.R_OK);
  ok('AGENT PROTOCOLS dokument je dostupan');
} catch (error) {
  fail('Agent protocols dokument nije dostupan', error);
}

for (const key of [
  'OPENAI_API_KEY',
  'GEMINI_API_KEY',
  'BREVO_API_KEY',
  'DB_HOST',
  'DB_USER',
  'DB_NAME'
]) {
  if (process.env[key]) ok(`${key} postoji`);
  else warn(`${key} nije definisan`);
}

try {
  require('../core/memory');
  ok('core/memory se učitava');
} catch (error) {
  fail('core/memory', error);
}

try {
  require('../core/tools');
  ok('core/tools se učitava');
} catch (error) {
  fail('core/tools', error);
}

try {
  require('../core/controller');
  ok('core/controller se učitava');
} catch (error) {
  fail('core/controller', error);
}

try {
  require('../core/orchestrator');
  ok('core/orchestrator se učitava');
} catch (error) {
  fail('core/orchestrator', error);
}

console.log('');
console.log('DaniniHub healthcheck završen.');
