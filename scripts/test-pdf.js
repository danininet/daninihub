const fs = require('fs');
const path = require('path');
const { generatePDFFromArtifactFile } = require('../core/pdf_generator');

async function run() {
  const dir = 'artifacts/json';
  const files = fs
    .readdirSync(dir)
    .filter(file => file.endsWith('.json'))
    .map(file => path.join(dir, file))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);

  if (!files.length) {
    console.error('Nema artifact JSON fajlova u artifacts/json.');
    process.exit(1);
  }

  const latest = files[0];
  const pdfPath = await generatePDFFromArtifactFile(latest);

  console.log('ARTIFACT:', latest);
  console.log('PDF_SAVED:', pdfPath);

  if (!fs.existsSync(pdfPath)) {
    console.error('PDF nije pronađen posle generisanja:', pdfPath);
    process.exit(1);
  }
}

run().catch(error => {
  console.error('PDF_TEST_ERROR:', error.message);
  process.exit(1);
});
