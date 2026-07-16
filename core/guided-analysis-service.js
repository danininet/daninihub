'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const controller = require('./controller');
const { getProduct } = require('./product-registry');
const { writeAudit } = require('./audit');
const { sendArtifactEmail } = require('./send-artifact-email');

const STORE_DIR = path.join(process.cwd(), 'runtime', 'guided-sessions');

function ensureStore() {
  fs.mkdirSync(STORE_DIR, { recursive: true });
}

function sessionPath(id) {
  return path.join(STORE_DIR, `${id}.json`);
}

function writeSession(session) {
  ensureStore();
  const target = sessionPath(session.id);
  const temp = `${target}.${process.pid}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(session, null, 2), 'utf8');
  fs.renameSync(temp, target);
  return session;
}

function readSession(id) {
  const target = sessionPath(id);
  if (!fs.existsSync(target)) {
    const error = new Error('SESSION_NOT_FOUND');
    error.code = 'SESSION_NOT_FOUND';
    throw error;
  }
  return JSON.parse(fs.readFileSync(target, 'utf8'));
}

function secret() {
  const value = process.env.DANINI_SESSION_SECRET;
  if (!value || value.length < 32) {
    const error = new Error('DANINI_SESSION_SECRET_NOT_CONFIGURED');
    error.code = 'SESSION_SECRET_NOT_CONFIGURED';
    throw error;
  }
  return value;
}

function signSession(id) {
  const signature = crypto.createHmac('sha256', secret()).update(id).digest('hex');
  return `${id}.${signature}`;
}

function verifyToken(token) {
  const [id, signature] = String(token || '').split('.');
  if (!id || !signature) return null;
  const expected = crypto.createHmac('sha256', secret()).update(id).digest('hex');
  const a = Buffer.from(signature, 'hex');
  const b = Buffer.from(expected, 'hex');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return id;
}

function publicSession(session) {
  return {
    id: session.id,
    productId: session.productId,
    locale: session.locale,
    status: session.status,
    question: session.currentQuestion || null,
    followUpsAsked: session.followUpsAsked,
    maxFollowUps: session.maxFollowUps,
    result: session.result || null,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt
  };
}

function createSession({ productId, email, locale, orderId }) {
  const product = getProduct(productId);
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    const error = new Error('VALID_EMAIL_REQUIRED');
    error.code = 'VALID_EMAIL_REQUIRED';
    throw error;
  }

  const id = `dks_${crypto.randomBytes(16).toString('hex')}`;
  const now = new Date().toISOString();
  const session = {
    id,
    productId: product.id,
    email: normalizedEmail,
    locale: locale || product.locale,
    orderId: String(orderId || '').trim() || null,
    status: 'awaiting_initial_answer',
    maxFollowUps: product.maxFollowUps,
    followUpsAsked: 0,
    currentQuestion: 'Welches konkrete Problem oder welche Entscheidung möchtest du heute klären?',
    answers: [],
    result: null,
    createdAt: now,
    updatedAt: now
  };

  writeSession(session);
  writeAudit({ event: 'guided_session_created', session_id: id, product_id: product.id, order_id: session.orderId });
  return { accessToken: signSession(id), session: publicSession(session) };
}

async function askModel(session, product) {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error('GEMINI_API_KEY_NOT_CONFIGURED');
    error.code = 'MODEL_NOT_CONFIGURED';
    throw error;
  }

  const transcript = session.answers
    .map((entry, index) => `Frage ${index + 1}: ${entry.question}\nAntwort ${index + 1}: ${entry.answer}`)
    .join('\n\n');

  const prompt = `${product.systemPurpose}\n\nBisheriger Dialog:\n${transcript}\n\nGib ausschließlich JSON zurück: {"question":"eine präzise Rückfrage"}`;
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });

  if (!response.ok) throw new Error(`MODEL_HTTP_${response.status}`);
  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('MODEL_JSON_REQUIRED');
  const parsed = JSON.parse(match[0]);
  if (!parsed.question || typeof parsed.question !== 'string') throw new Error('MODEL_QUESTION_REQUIRED');
  return parsed.question.trim();
}

async function finalize(session, product) {
  const transcript = session.answers
    .map((entry, index) => `Frage ${index + 1}: ${entry.question}\nAntwort ${index + 1}: ${entry.answer}`)
    .join('\n\n');

  const task = [
    product.systemPurpose,
    'Erstelle jetzt die endgültige persönliche Analyse auf Deutsch.',
    'Struktur: Ausgangslage, wichtigste Erkenntnisse, mögliche Risiken, konkrete nächste Schritte.',
    'Der Text muss direkt für den Kunden verständlich sein.',
    transcript
  ].join('\n\n');

  const result = await controller.verifyAndExecute(task, session.locale);
  if (!result || result.success === false) {
    throw new Error(result?.error || 'FINAL_ANALYSIS_FAILED');
  }

  let delivery = { sent: false, reason: 'email_not_attempted' };
  if (result.email_html_path) {
    try {
      const sent = await sendArtifactEmail({
        to: session.email,
        recipient: session.email,
        runId: result.artifact?.run_id || session.id,
        emailHtmlPath: result.email_html_path,
        pdfPath: result.pdf_path,
        subject: product.finalSubject
      });
      delivery = { sent: true, messageId: sent?.messageId || null };
    } catch (error) {
      delivery = { sent: false, reason: error.message };
    }
  }

  return {
    summary: result.data?.odgovor || result.artifact?.output?.summary || 'Analyse abgeschlossen.',
    nextStep: result.data?.sledeci_korak || result.artifact?.output?.next_step || null,
    pdfAvailable: Boolean(result.pdf_path),
    delivery
  };
}

async function submitAnswer(token, answer) {
  const id = verifyToken(token);
  if (!id) {
    const error = new Error('INVALID_ACCESS_TOKEN');
    error.code = 'INVALID_ACCESS_TOKEN';
    throw error;
  }

  const session = readSession(id);
  if (session.status === 'completed') return publicSession(session);
  if (session.status === 'processing') {
    const error = new Error('SESSION_PROCESSING');
    error.code = 'SESSION_PROCESSING';
    throw error;
  }

  const normalizedAnswer = String(answer || '').trim();
  if (normalizedAnswer.length < 3) {
    const error = new Error('ANSWER_TOO_SHORT');
    error.code = 'ANSWER_TOO_SHORT';
    throw error;
  }

  session.answers.push({ question: session.currentQuestion, answer: normalizedAnswer, answeredAt: new Date().toISOString() });
  session.updatedAt = new Date().toISOString();
  const product = getProduct(session.productId);

  if (session.followUpsAsked < session.maxFollowUps) {
    session.currentQuestion = await askModel(session, product);
    session.followUpsAsked += 1;
    session.status = 'awaiting_answer';
    writeSession(session);
    writeAudit({ event: 'guided_followup_created', session_id: id, follow_up: session.followUpsAsked });
    return publicSession(session);
  }

  session.status = 'processing';
  session.currentQuestion = null;
  writeSession(session);

  try {
    session.result = await finalize(session, product);
    session.status = 'completed';
    session.updatedAt = new Date().toISOString();
    writeSession(session);
    writeAudit({ event: 'guided_session_completed', session_id: id, delivery_sent: session.result.delivery.sent });
    return publicSession(session);
  } catch (error) {
    session.status = 'failed';
    session.failure = { message: error.message, at: new Date().toISOString() };
    session.updatedAt = new Date().toISOString();
    writeSession(session);
    writeAudit({ event: 'guided_session_failed', session_id: id, error: error.message });
    throw error;
  }
}

function getSession(token) {
  const id = verifyToken(token);
  if (!id) {
    const error = new Error('INVALID_ACCESS_TOKEN');
    error.code = 'INVALID_ACCESS_TOKEN';
    throw error;
  }
  return publicSession(readSession(id));
}

module.exports = { createSession, getSession, submitAnswer, verifyToken };
