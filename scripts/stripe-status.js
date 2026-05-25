const fs = require('fs');
const path = require('path');
const { readLastAudit } = require('../core/audit');

const processedDir = path.join(process.cwd(), 'logs', 'stripe_processed');

function readProcessed() {
  if (!fs.existsSync(processedDir)) return [];

  return fs
    .readdirSync(processedDir)
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const fullPath = path.join(processedDir, file);
      try {
        return {
          file,
          path: fullPath,
          mtime: fs.statSync(fullPath).mtime.toISOString(),
          data: JSON.parse(fs.readFileSync(fullPath, 'utf8'))
        };
      } catch (error) {
        return {
          file,
          path: fullPath,
          parse_error: error.message
        };
      }
    })
    .sort((a, b) => String(b.mtime).localeCompare(String(a.mtime)));
}

const audit = readLastAudit(20).filter(row =>
  String(row.event || '').includes('stripe')
);

console.log(JSON.stringify({
  processed_events_count: readProcessed().length,
  latest_processed_events: readProcessed().slice(0, 10),
  latest_stripe_audit_events: audit
}, null, 2));
