const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { buildActivationPack } = require('./contracts/activation-pack-contract');
const { assertCustomerFacingSafe } = require('./customer-facing-gate');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function findFont() {
  const candidates = [
    '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
    '/usr/share/fonts/truetype/dejavu/DejaVuSansCondensed.ttf',
    '/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf',
    '/usr/share/fonts/truetype/freefont/FreeSans.ttf'
  ];

  return candidates.find(fontPath => fs.existsSync(fontPath)) || null;
}

function cleanText(value) {
  if (value === undefined || value === null) return '';
  if (Array.isArray(value)) return value.map(cleanText).join('\n');
  if (typeof value === 'object') return JSON.stringify(value, null, 2);

  return String(value)
    .normalize('NFC')
    .replace(/\*\*/g, '')
    .replace(/[^\S\r\n]+/g, ' ')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim();
}

function normalizeOutline(value) {
  return cleanText(value)
    .replace(/_{8,}/g, '\n────────────────────────\n')
    .replace(/\n\*/g, '\n•')
    .replace(/([^\n])\n(• )/g, '$1\n$2')
    .replace(/(\n|^)(\d+\.\s+)/g, '\n$2')
    .replace(/(\n|^)([IVX]+\.\s+)/g, '\n$2')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function setupFont(doc) {
  const fontPath = findFont();

  if (fontPath) {
    doc.registerFont('DaniniSans', fontPath);
    doc.font('DaniniSans');
  } else {
    doc.font('Helvetica');
  }
}

function brandHeader(doc, pack) {
  doc.rect(0, 0, doc.page.width, 112).fill('#070707');

  doc.fillColor('#c9aa68')
    .fontSize(10)
    .text('DANINIHUB', 56, 30, { width: 220 });

  doc.fillColor('#c9aa68')
    .fontSize(8)
    .text('SYSTEM VERIFIED', 400, 30, { width: 140, align: 'right' });

  doc.fillColor('#f6efe3')
    .fontSize(23)
    .text(cleanText(pack.meta.title), 56, 54, { width: 470 });

  doc.fillColor('#cfc7b8')
    .fontSize(10)
    .text(cleanText(pack.meta.subtitle), 56, 84, { width: 470 });

  doc.y = 142;
}

function meta(doc, pack) {
  const rows = [
    ['RUN ID', pack.meta.run_id],
    ['DOCUMENT TYPE', pack.meta.document_type || 'Verified decision report'],
    ['TIMESTAMP', pack.meta.timestamp],
  ];

  doc.fillColor('#111111');

  for (const [label, value] of rows) {
    doc.fontSize(8).fillColor('#777777').text(label, { width: 483 });
    doc.moveDown(0.1);
    doc.fontSize(9.5).fillColor('#111111').text(cleanText(value), {
      width: 483,
      lineGap: 2
    });
    doc.moveDown(0.45);
  }

  doc.moveDown(0.4);
  doc.strokeColor('#e2d7c5').lineWidth(0.8).moveTo(56, doc.y).lineTo(539, doc.y).stroke();
  doc.moveDown(0.9);
}

function section(doc, title, body) {
  const text = cleanText(body);
  if (!text) return;

  doc.moveDown(0.75);

  doc.fontSize(15)
    .fillColor('#111111')
    .text(cleanText(title), {
      width: 483,
      lineGap: 2
    });

  doc.moveDown(0.35);

  doc.fontSize(10.4)
    .fillColor('#333333')
    .text(text, {
      width: 483,
      lineGap: 4,
      paragraphGap: 6
    });
}

function outlineSection(doc, title, body) {
  const text = normalizeOutline(body);
  if (!text) return;

  doc.moveDown(1);

  doc.strokeColor('#dfd2ba').lineWidth(0.8).moveTo(56, doc.y).lineTo(539, doc.y).stroke();
  doc.moveDown(0.75);

  doc.fontSize(15)
    .fillColor('#9b772c')
    .text(cleanText(title), {
      width: 483,
      lineGap: 2
    });

  doc.moveDown(0.45);

  doc.fontSize(9.8)
    .fillColor('#333333')
    .text(text, {
      width: 483,
      lineGap: 4.5,
      paragraphGap: 7
    });
}

function finalDisclaimer(doc, pack) {
  doc.moveDown(1.2);
  doc.strokeColor('#e2d7c5').lineWidth(0.8).moveTo(56, doc.y).lineTo(539, doc.y).stroke();
  doc.moveDown(0.7);

  doc.fontSize(8)
    .fillColor('#777777')
    .text('DANINIHUB SYSTEM VERIFIED', { width: 483 });

  doc.moveDown(0.25);

  doc.fontSize(8)
    .fillColor('#777777')
    .text(cleanText(pack.labels.footer), {
      width: 483,
      lineGap: 2
    });
}

function generatePDFFromArtifact(artifact, outputDir = 'outputs/pdf') {
  return new Promise((resolve, reject) => {
    if (!artifact || !artifact.run_id) {
      reject(new Error('Neispravan artifact: nedostaje run_id.'));
      return;
    }

    ensureDir(outputDir);

    const pack = buildActivationPack(artifact);

    assertCustomerFacingSafe({
      meta: pack.meta,
      labels: pack.labels,
      content: pack.content
    }, `pdf-pack:${artifact.run_id}`);

    const outputPath = path.join(outputDir, `${artifact.run_id}.pdf`);
    const stream = fs.createWriteStream(outputPath);

    stream.on('finish', () => resolve(outputPath));
    stream.on('error', reject);

    const doc = new PDFDocument({
      size: 'A4',
      margin: 56,
      info: {
        Title: `${pack.meta.title} ${pack.meta.run_id}`,
        Author: 'DaniniHub',
        Subject: cleanText(pack.meta.subtitle)
      }
    });

    doc.on('error', reject);
    doc.pipe(stream);
    setupFont(doc);

    brandHeader(doc, pack);
    meta(doc, pack);

    section(doc, pack.labels.dialogue, pack.content.dialogue);
    section(doc, pack.labels.analysis, pack.content.analysis);
    section(doc, pack.labels.positives, pack.content.positives);
    section(doc, pack.labels.negatives, pack.content.negatives);
    section(doc, pack.labels.recommendation, pack.content.recommendation);
    section(doc, pack.labels.nextSteps, pack.content.nextSteps);

    outlineSection(doc, pack.labels.premiumOutline, pack.content.premiumOutline);
    outlineSection(doc, pack.labels.bonusOutline, pack.content.bonusOutline);
    outlineSection(doc, pack.labels.quietCalls, pack.content.quietCalls);

    section(doc, pack.labels.disclaimers, pack.content.disclaimers);
    if (pack.content.evidence) section(doc, pack.labels.evidence, pack.content.evidence);
    if (pack.content.controller) section(doc, pack.labels.controller, pack.content.controller);

    finalDisclaimer(doc, pack);

    doc.end();
  });
}

async function generatePDFFromArtifactFile(artifactPath, outputDir = 'outputs/pdf') {
  if (!fs.existsSync(artifactPath)) {
    throw new Error(`Artifact fajl ne postoji: ${artifactPath}`);
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  return await generatePDFFromArtifact(artifact, outputDir);
}

module.exports = {
  generatePDFFromArtifact,
  generatePDFFromArtifactFile
};
