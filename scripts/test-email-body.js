const fs = require('fs');
const path = require('path');
const { saveArtifactEmailHtml } = require('../core/email/createEmailBody');

const artifactsDir = 'artifacts/json';
const artifactFiles = fs
  .readdirSync(artifactsDir)
  .filter(file => file.endsWith('.json'))
  .map(file => path.join(artifactsDir, file))
  .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);

if (!artifactFiles.length) {
  console.error('Nema artifact JSON fajlova u artifacts/json.');
  process.exit(1);
}

const artifactPath = artifactFiles[0];
const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
const pdfPath = path.join('outputs/pdf', `${artifact.run_id}.pdf`);

const emailPath = saveArtifactEmailHtml({
  artifact,
  pdf_path: fs.existsSync(pdfPath) ? pdfPath : ''
});

console.log('ARTIFACT:', artifactPath);
console.log('EMAIL_HTML_SAVED:', emailPath);
