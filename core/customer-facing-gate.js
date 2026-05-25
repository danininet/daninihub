const fs = require('fs');
const path = require('path');

const CUSTOMER_FACING_FORBIDDEN_PATTERNS = [
  /core\./i,
  /meta\.commander/i,
  /guard\./i,
  /validator/i,
  /orchestrator/i,
  /Controller Status/i,
  /controller artifact/i,
  /Legacy controller/i,
  /prompt only/i,
  /Non-strategic/i,
  /Nicht ausgeben/i,
  /Core-?Orchestrator/i,
  /interne Agentenlogik/i,
  /Čekam odluku korisnika/i,
  /LEAD AGENT/i,
  /SUPPORT_OPS/i,
  /V1 SKELET/i,
  /149\s*€/i,
  /buy now/i,
  /jetzt kaufen/i,
  /kupite/i,
  /token logiku/i,
  /privatnu arhitekturu/i,
  /Node implementaciju/i
];

function normalizeText(value) {
  if (value === null || value === undefined) return '';

  if (typeof value === 'string') return value;

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function findCustomerFacingLeaks(value) {
  const text = normalizeText(value);
  const leaks = [];

  for (const pattern of CUSTOMER_FACING_FORBIDDEN_PATTERNS) {
    if (pattern.test(text)) {
      leaks.push(pattern.toString());
    }
  }

  const markdownHeaderLines = text
    .split('\n')
    .map((line, index) => ({ line, number: index + 1 }))
    .filter(item => /^#{1,6}\s+/.test(item.line));

  if (markdownHeaderLines.length) {
    leaks.push('MARKDOWN_HEADERS:' + markdownHeaderLines.slice(0, 5).map(item => item.number).join(','));
  }

  return leaks;
}

function assertCustomerFacingSafe(value, context = 'customer-facing-output') {
  const leaks = findCustomerFacingLeaks(value);

  if (leaks.length) {
    const error = new Error(
      `CUSTOMER_FACING_GATE_FAILED in ${context}: ${leaks.join(' | ')}`
    );
    error.code = 'CUSTOMER_FACING_GATE_FAILED';
    error.context = context;
    error.leaks = leaks;
    throw error;
  }

  return true;
}

function assertCustomerFacingFileSafe(filePath, context = 'customer-facing-file') {
  if (!filePath) {
    throw new Error(`CUSTOMER_FACING_GATE_FAILED in ${context}: missing file path`);
  }

  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`CUSTOMER_FACING_GATE_FAILED in ${context}: file not found ${absolutePath}`);
  }

  const content = fs.readFileSync(absolutePath, 'utf8');
  return assertCustomerFacingSafe(content, context);
}

module.exports = {
  CUSTOMER_FACING_FORBIDDEN_PATTERNS,
  findCustomerFacingLeaks,
  assertCustomerFacingSafe,
  assertCustomerFacingFileSafe
};
