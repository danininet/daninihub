require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { BrevoClient } = require('@getbrevo/brevo');
const { writeAudit } = require('../core/audit');

const recipient = process.argv[2];

if (!recipient) {
  console.error('GREŠKA: Nedostaje email primaoca.');
  console.error('Primer: npm run email:send:test -- name@example.com');
  process.exit(1);
}

if (!process.env.BREVO_API_KEY) {
  console.error('GREŠKA: BREVO_API_KEY nije definisan u .env.');
  process.exit(1);
}

const emailDir = 'outputs/email';
const pdfDir = 'outputs/pdf';

const emailFiles = fs
  .readdirSync(emailDir)
  .filter(file => file.endsWith('.html'))
  .map(file => path.join(emailDir, file))
  .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);

if (!emailFiles.length) {
  console.error('GREŠKA: Nema HTML email fajlova u outputs/email.');
  process.exit(1);
}

const emailPath = emailFiles[0];
const runId = path.basename(emailPath, '.html');
const htmlContent = fs.readFileSync(emailPath, 'utf8');

const pdfPath = path.join(pdfDir, `${runId}.pdf`);
const hasPdf = fs.existsSync(pdfPath);

const apiInstance = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY
}).transactionalEmails;

async function send() {
  const sendSmtpEmail = {
    subject: `DaniniHub Report ${runId}`,
    htmlContent,
    sender: {
      name: 'DaniniHub',
      email: process.env.BREVO_SENDER_EMAIL || 'info@daninihub.com'
    },
    to: [{ email: recipient }]
  };

  if (hasPdf) {
    const pdfBase64 = fs.readFileSync(pdfPath).toString('base64');
    sendSmtpEmail.attachment = [
      {
        name: `${runId}.pdf`,
        content: pdfBase64
      }
    ];
  }

  const result = await apiInstance.sendTransacEmail(sendSmtpEmail);

  writeAudit({
    event: 'email_test_sent',
    run_id: runId,
    recipient,
    email_html_path: emailPath,
    pdf_path: hasPdf ? pdfPath : null,
    brevo_message_id: result?.messageId || null
  });

  console.log(JSON.stringify({
    success: true,
    event: 'email_test_sent',
    recipient,
    run_id: runId,
    email_html_path: emailPath,
    pdf_path: hasPdf ? pdfPath : null,
    brevo_message_id: result?.messageId || null
  }, null, 2));
}

send().catch(error => {
  writeAudit({
    event: 'email_test_failed',
    recipient,
    error: error.message
  });

  console.error('BREVO_SEND_ERROR:', error.message);
  process.exit(1);
});
