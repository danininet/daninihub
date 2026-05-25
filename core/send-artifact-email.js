require('dotenv').config();

const fs = require('fs');
const path = require('path');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const { assertCustomerFacingSafe } = require('./customer-facing-gate');

function createBrevoClient() {
  if (!process.env.BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY nije definisan u .env.');
  }

  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  return new SibApiV3Sdk.TransactionalEmailsApi();
}

function resolveSender() {
  const email =
    process.env.BREVO_SENDER_EMAIL ||
    process.env.DANINIHUB_SENDER_EMAIL ||
    process.env.MAIL_FROM ||
    process.env.EMAIL_FROM;

  const name =
    process.env.BREVO_SENDER_NAME ||
    process.env.DANINIHUB_SENDER_NAME ||
    'DaniniHub';

  if (!email) {
    throw new Error('Sender email nije definisan. Dodaj BREVO_SENDER_EMAIL u .env.');
  }

  return { email, name };
}

async function sendArtifactEmail({
  to,
  recipient,
  runId,
  artifactPath,
  pdfPath,
  emailHtmlPath,
  subject
}) {
  const recipientEmail = String(to || recipient || '').trim();

  if (!recipientEmail) {
    throw new Error('Nedostaje recipient email.');
  }

  if (!emailHtmlPath) {
    throw new Error('Nedostaje emailHtmlPath.');
  }

  const absoluteHtmlPath = path.isAbsolute(emailHtmlPath)
    ? emailHtmlPath
    : path.join(process.cwd(), emailHtmlPath);

  if (!fs.existsSync(absoluteHtmlPath)) {
    throw new Error(`Email HTML ne postoji: ${absoluteHtmlPath}`);
  }

  const htmlContent = fs.readFileSync(absoluteHtmlPath, 'utf8');

  assertCustomerFacingSafe(htmlContent, `email-html:${runId || 'unknown'}`);

  const message = new SibApiV3Sdk.SendSmtpEmail();
  message.sender = resolveSender();
  message.to = [{ email: recipientEmail }];
  message.subject = subject || 'DaniniHub Activation Report';
  message.htmlContent = htmlContent;

  if (pdfPath) {
    const absolutePdfPath = path.isAbsolute(pdfPath)
      ? pdfPath
      : path.join(process.cwd(), pdfPath);

    if (fs.existsSync(absolutePdfPath)) {
      message.attachment = [
        {
          name: `${runId || 'daninihub-activation-report'}.pdf`,
          content: fs.readFileSync(absolutePdfPath).toString('base64')
        }
      ];
    }
  }

  const apiInstance = createBrevoClient();
  const response = await apiInstance.sendTransacEmail(message);

  return {
    ok: true,
    messageId:
      response?.messageId ||
      response?.body?.messageId ||
      response?.message_id ||
      null
  };
}

module.exports = { sendArtifactEmail };
