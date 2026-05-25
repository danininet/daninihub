const { readLastAudit, AUDIT_FILE } = require('../core/audit');

const limit = Number(process.argv[2] || 10);
const rows = readLastAudit(limit);

console.log(`AUDIT_FILE: ${AUDIT_FILE}`);
console.log(JSON.stringify(rows, null, 2));
