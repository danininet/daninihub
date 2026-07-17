const { BrevoClient } = require('@getbrevo/brevo');

function getBrevoClient() {
  if (!process.env.BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY nije definisan u .env fajlu.');
  }

  return new BrevoClient({ apiKey: process.env.BREVO_API_KEY }).transactionalEmails;
}

async function sendResult(email, content, subject = 'DaniniHub Report') {
  if (!email) {
    throw new Error('Email primaoca nije prosleđen.');
  }

  const apiInstance = getBrevoClient();
  const sendSmtpEmail = {
    subject,
    htmlContent: content,
    sender: {
      name: 'DaniniHub',
      email: 'info@daninihub.com'
    },
    to: [{ email }]
  };

  return await apiInstance.sendTransacEmail(sendSmtpEmail);
}

module.exports = { sendResult };
