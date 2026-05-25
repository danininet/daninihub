const SibApiV3Sdk = require('sib-api-v3-sdk');

function getBrevoClient() {
  if (!process.env.BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY nije definisan u .env fajlu.');
  }

  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  return new SibApiV3Sdk.TransactionalEmailsApi();
}

async function sendResult(email, content, subject = 'DaniniHub Report') {
  if (!email) {
    throw new Error('Email primaoca nije prosleđen.');
  }

  const apiInstance = getBrevoClient();
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = content;
  sendSmtpEmail.sender = {
    name: 'DaniniHub',
    email: 'info@daninihub.com'
  };
  sendSmtpEmail.to = [{ email }];

  return await apiInstance.sendTransacEmail(sendSmtpEmail);
}

module.exports = { sendResult };
