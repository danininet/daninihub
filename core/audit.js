const fs = require('fs');
const path = require('path');

const AUDIT_FILE = path.join(process.cwd(), 'logs', 'audit.jsonl');

function writeAudit(event) {
  fs.mkdirSync(path.dirname(AUDIT_FILE), { recursive: true });

  const record = {
    timestamp: new Date().toISOString(),
    system: 'DaniniHub',
    ...event
  };

  fs.appendFileSync(AUDIT_FILE, JSON.stringify(record) + '\n', 'utf8');

  return AUDIT_FILE;
}

function readLastAudit(limit = 10) {
  if (!fs.existsSync(AUDIT_FILE)) return [];

  return fs
    .readFileSync(AUDIT_FILE, 'utf8')
    .split('\n')
    .filter(Boolean)
    .slice(-limit)
    .map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return { parse_error: true, raw: line };
      }
    });
}

module.exports = {
  AUDIT_FILE,
  writeAudit,
  readLastAudit
};
