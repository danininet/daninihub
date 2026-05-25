const fs = require('fs');
const path = require('path');
const { buildActivationPack } = require('../contracts/activation-pack-contract');

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function shortText(value, limit = 900) {
  const text = String(value || '').trim();
  if (text.length <= limit) return text;
  return text.slice(0, limit).trim() + '…';
}

function emailIntro(locale) {
  if (locale === 'sr') {
    return {
      headline: 'Vaš DaniniHub Aktivacioni paket je spreman.',
      intro: 'U prilogu se nalazi PDF sa strukturisanim AI dijalogom, analizom, pozitivnim i negativnim stranama, ekspertskim predlogom, outline-om za premium e-knjigu, bonus PDF outline-om i transparentnim napomenama.',
      download: 'Ako se PDF ne vidi u prilogu, otvorite success/status stranicu i preuzmite dokument direktno.',
      cta: 'Sledeći korak možete nastaviti kroz DaniniHub sistem kada budete spremni.',
      footer: 'Ovo nije finansijski, pravni, poreski ili medicinski savet. Rezultate po potrebi proverite sa stručnim licem.',
      pdfButton: 'Preuzmi PDF report',
      statusLink: 'Otvori success/status stranicu'
    };
  }

  if (locale === 'de') {
    return {
      headline: 'Ihr DaniniHub Activation Pack ist bereit.',
      intro: 'Im Anhang finden Sie den PDF-Report mit strukturiertem KI-Dialog, Analyse, positiven und negativen Aspekten, Empfehlung, Premium E-Book Outline, Bonus PDF Outline und transparenten Hinweisen.',
      download: 'Falls der PDF-Anhang nicht sichtbar ist, öffnen Sie bitte die Success-/Status-Seite und laden Sie den Report dort direkt herunter.',
      cta: 'Den nächsten strukturierten Schritt können Sie im DaniniHub-System fortsetzen.',
      footer: 'Keine Finanz-, Rechts-, Steuer- oder medizinische Beratung. Ergebnisse sollten bei Bedarf fachlich geprüft werden.',
      pdfButton: 'PDF Report herunterladen',
      statusLink: 'Success-/Status-Seite öffnen'
    };
  }

  return {
    headline: 'Your DaniniHub Activation Pack is ready.',
    intro: 'Attached is your DaniniHub PDF report with project snapshot, clarity score, gate status, key contradictions, a 7-day decision plan and transparency notes.',
    download: 'If the PDF attachment is not visible, open the success/status page and download the report directly.',
    cta: 'You can continue the next structured step in the DaniniHub system when ready.',
    footer: 'This is not financial, legal, tax or medical advice. Results should be reviewed by a qualified expert when needed.',
    pdfButton: 'Download PDF report',
    statusLink: 'Open success/status page'
  };
}

function createEmailHtmlFromArtifact(artifact, options = {}) {
  const pack = buildActivationPack(artifact);
  const msg = emailIntro(pack.locale);

  const successUrl = options.successUrl || null;
  const downloadUrl = options.downloadUrl || null;

  return `<!doctype html>
<html lang="${escapeHtml(pack.locale)}">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(pack.labels.emailSubject)}</title>
</head>
<body style="margin:0;background:#f4f1ea;color:#111;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f1ea;padding:28px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="680" cellspacing="0" cellpadding="0" style="background:#ffffff;border:1px solid #e3ddcf;">
          <tr>
            <td style="background:#070707;color:#f6efe3;padding:30px 34px;">
              <div style="color:#c9aa68;font-size:11px;letter-spacing:4px;text-transform:uppercase;margin-bottom:14px;">DANINIHUB · SYSTEM VERIFIED</div>
              <h1 style="font-size:28px;line-height:1.2;font-weight:400;margin:0;">${escapeHtml(msg.headline)}</h1>
              <p style="color:#cfc7b8;font-size:14px;line-height:1.7;margin:14px 0 0;">${escapeHtml(pack.meta.subtitle)}</p>
            </td>
          </tr>

          <tr>
            <td style="padding:30px 34px;">
              <p style="font-size:15px;line-height:1.8;margin:0 0 18px;">${escapeHtml(msg.intro)}</p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:22px 0;border-collapse:collapse;">
                <tr>
                  <td style="border:1px solid #eee;background:#fafafa;padding:12px;font-size:13px;color:#777;">Run ID</td>
                  <td style="border:1px solid #eee;padding:12px;font-size:13px;">${escapeHtml(pack.meta.run_id)}</td>
                </tr>
                <tr>
                  <td style="border:1px solid #eee;background:#fafafa;padding:12px;font-size:13px;color:#777;">Mode</td>
                  <td style="border:1px solid #eee;padding:12px;font-size:13px;">${escapeHtml(pack.meta.mode)}</td>
                </tr>
                <tr>
                  <td style="border:1px solid #eee;background:#fafafa;padding:12px;font-size:13px;color:#777;">Timestamp</td>
                  <td style="border:1px solid #eee;padding:12px;font-size:13px;">${escapeHtml(pack.meta.timestamp)}</td>
                </tr>
              </table>

              <h2 style="font-size:18px;font-weight:400;margin:26px 0 10px;">${escapeHtml(pack.labels.analysis)}</h2>
              <p style="font-size:14px;line-height:1.8;color:#333;margin:0 0 16px;">${escapeHtml(shortText(pack.content.analysis, 1100))}</p>

              <h2 style="font-size:18px;font-weight:400;margin:26px 0 10px;">${escapeHtml(pack.labels.nextSteps)}</h2>
              <p style="font-size:14px;line-height:1.8;color:#333;margin:0 0 16px;">${escapeHtml(shortText(pack.content.nextSteps, 700))}</p>

              ${downloadUrl ? `<p style="margin:26px 0 8px;"><a href="${escapeHtml(downloadUrl)}" style="background:#070707;color:#f6efe3;text-decoration:none;padding:14px 18px;display:inline-block;">${escapeHtml(msg.pdfButton)}</a></p>` : ''}
              ${successUrl ? `<p style="margin:10px 0 22px;"><a href="${escapeHtml(successUrl)}" style="color:#8a6420;text-decoration:underline;">${escapeHtml(msg.statusLink)}</a></p>` : ''}

              <p style="font-size:14px;line-height:1.8;color:#555;margin:22px 0;">${escapeHtml(msg.download)}</p>

              <div style="background:#fbf8ef;border:1px solid #dfd2ba;padding:18px;margin:24px 0;">
                <strong style="color:#9b772c;">${escapeHtml(pack.labels.quietCalls)}</strong>
                <p style="font-size:14px;line-height:1.8;color:#333;margin:10px 0 0;">${escapeHtml(pack.content.quietCalls)}</p>
              </div>

              <p style="font-size:14px;line-height:1.8;color:#555;">${escapeHtml(msg.cta)}</p>
            </td>
          </tr>

          <tr>
            <td style="background:#f8f6f1;color:#777;font-size:12px;line-height:1.7;padding:22px 34px;border-top:1px solid #eee;">
              <strong>DaniniHub · AI Transparency · DACH/GDPR-aware workflow</strong><br>
              ${escapeHtml(msg.footer)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}


function saveEmailHtmlFromArtifact(artifact, outputDirOrPath = 'outputs/email', options = {}) {
  if (!artifact || !artifact.run_id) {
    throw new Error('saveEmailHtmlFromArtifact: artifact.run_id nedostaje.');
  }

  const fs = require('fs');
  const path = require('path');

  const html = createEmailHtmlFromArtifact(artifact, options);

  let outputPath;

  if (String(outputDirOrPath).endsWith('.html')) {
    outputPath = outputDirOrPath;
  } else {
    outputPath = path.join(outputDirOrPath || 'outputs/email', artifact.run_id + '.html');
  }

  if (outputPath.includes('undefined.html')) {
    throw new Error('saveEmailHtmlFromArtifact: blokiran outputPath undefined.html');
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, html, 'utf8');

  return outputPath;
}

function saveArtifactEmailHtml(artifact, outputDirOrPath = 'outputs/email', options = {}) {
  return saveEmailHtmlFromArtifact(artifact, outputDirOrPath, options);
}

module.exports = {
  createEmailHtmlFromArtifact,
  saveEmailHtmlFromArtifact,
  saveArtifactEmailHtml
};
