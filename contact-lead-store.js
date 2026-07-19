'use strict';

const fs = require('fs');
const path = require('path');

const DB_FIELDS = new Set([
  'status',
  'recommendation',
  'confirmationSent',
  'adminSent',
  'followupKind',
  'followupSentAt',
  'reviewedAt',
  'reviewNote',
  'lastError'
]);

function databaseConfigured(env) {
  return Boolean(env.DB_HOST && env.DB_USER && env.DB_NAME);
}

function nowIso() {
  return new Date().toISOString();
}

function parseLead(row) {
  if (!row) return null;
  return {
    reference: row.reference,
    source: row.source,
    language: row.language,
    email: row.email,
    company: row.company,
    status: row.status,
    recommendation: row.recommendation,
    payload: typeof row.payload_json === 'string' ? JSON.parse(row.payload_json) : row.payload_json,
    confirmationSent: Boolean(row.confirmation_sent),
    adminSent: Boolean(row.admin_sent),
    followupKind: row.followup_kind || null,
    followupSentAt: row.followup_sent_at ? new Date(row.followup_sent_at).toISOString() : null,
    reviewedAt: row.reviewed_at ? new Date(row.reviewed_at).toISOString() : null,
    reviewNote: row.review_note || '',
    lastError: row.last_error || '',
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString()
  };
}

function toDatabaseName(name) {
  return name.replace(/[A-Z]/g, character => `_${character.toLowerCase()}`);
}

function toDatabaseValue(name, value) {
  if (name === 'confirmationSent' || name === 'adminSent') return value ? 1 : 0;
  if ((name === 'followupSentAt' || name === 'reviewedAt') && value) return new Date(value);
  return value ?? null;
}

class ContactLeadStore {
  constructor(options = {}) {
    this.env = options.env || process.env;
    this.storageFile = options.storageFile || path.join(__dirname, 'runtime', 'contact-leads.json');
    this.mysql = options.mysql || null;
    this.pool = null;
    this.mode = databaseConfigured(this.env) ? 'mysql' : 'file';
    this.initialized = false;
    this.fileQueue = Promise.resolve();
  }

  initializeFileStore() {
    fs.mkdirSync(path.dirname(this.storageFile), { recursive: true });
    if (!fs.existsSync(this.storageFile)) fs.writeFileSync(this.storageFile, '{}\n', { mode: 0o600 });
  }

  async init() {
    if (this.initialized) return;
    if (this.mode === 'mysql') {
      const mysql = this.mysql || require('mysql2/promise');
      try {
        this.pool = mysql.createPool({
          host: this.env.DB_HOST,
          port: this.env.DB_PORT ? Number(this.env.DB_PORT) : undefined,
          user: this.env.DB_USER,
          password: this.env.DB_PASSWORD,
          database: this.env.DB_NAME,
          waitForConnections: true,
          connectionLimit: 5,
          queueLimit: 0
        });
        await this.pool.execute(`
          CREATE TABLE IF NOT EXISTS danini_contact_leads (
            reference VARCHAR(64) PRIMARY KEY,
            source VARCHAR(40) NOT NULL,
            language VARCHAR(5) NOT NULL,
            email VARCHAR(191) NOT NULL,
            company VARCHAR(180) NOT NULL,
            status VARCHAR(40) NOT NULL,
            recommendation VARCHAR(80) NOT NULL,
            payload_json LONGTEXT NOT NULL,
            confirmation_sent TINYINT(1) NOT NULL DEFAULT 0,
            admin_sent TINYINT(1) NOT NULL DEFAULT 0,
            followup_kind VARCHAR(40) NULL,
            followup_sent_at DATETIME NULL,
            reviewed_at DATETIME NULL,
            review_note TEXT NULL,
            last_error TEXT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL,
            INDEX idx_danini_leads_status_created (status, created_at)
          ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
        `);
      } catch (error) {
        console.error(`Contact lead database unavailable; using protected local fallback: ${error.message}`);
        if (this.pool && typeof this.pool.end === 'function') {
          try { await this.pool.end(); } catch {}
        }
        this.pool = null;
        this.mode = 'file';
        this.initializeFileStore();
      }
    } else {
      this.initializeFileStore();
    }
    this.initialized = true;
  }

  async create(lead) {
    await this.init();
    const createdAt = lead.createdAt || nowIso();
    const record = {
      ...lead,
      status: lead.status || 'received',
      recommendation: lead.recommendation || 'manual-review',
      confirmationSent: Boolean(lead.confirmationSent),
      adminSent: Boolean(lead.adminSent),
      followupKind: null,
      followupSentAt: null,
      reviewedAt: null,
      reviewNote: '',
      lastError: '',
      createdAt,
      updatedAt: createdAt
    };
    if (this.mode === 'mysql') {
      await this.pool.execute(
        `INSERT INTO danini_contact_leads
          (reference, source, language, email, company, status, recommendation, payload_json,
           confirmation_sent, admin_sent, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [record.reference, record.source, record.language, record.email, record.company, record.status,
          record.recommendation, JSON.stringify(record.payload), record.confirmationSent ? 1 : 0,
          record.adminSent ? 1 : 0, new Date(createdAt), new Date(createdAt)]
      );
      return record;
    }
    return this.withFile(records => {
      if (records[record.reference]) throw new Error('LEAD_ALREADY_EXISTS');
      records[record.reference] = record;
      return record;
    });
  }

  async get(reference) {
    await this.init();
    if (this.mode === 'mysql') {
      const [rows] = await this.pool.execute('SELECT * FROM danini_contact_leads WHERE reference = ? LIMIT 1', [reference]);
      return parseLead(rows[0]);
    }
    const records = JSON.parse(fs.readFileSync(this.storageFile, 'utf8'));
    return records[reference] || null;
  }

  async update(reference, changes) {
    await this.init();
    const permitted = Object.fromEntries(Object.entries(changes).filter(([name]) => DB_FIELDS.has(name)));
    permitted.updatedAt = nowIso();
    if (this.mode === 'mysql') {
      const names = Object.keys(permitted).filter(name => name !== 'updatedAt');
      if (!names.length) return this.get(reference);
      const assignments = names.map(name => `${toDatabaseName(name)} = ?`);
      assignments.push('updated_at = ?');
      const values = names.map(name => toDatabaseValue(name, permitted[name]));
      values.push(new Date(permitted.updatedAt), reference);
      const [result] = await this.pool.execute(
        `UPDATE danini_contact_leads SET ${assignments.join(', ')} WHERE reference = ?`,
        values
      );
      if (!result.affectedRows) throw new Error('LEAD_NOT_FOUND');
      return this.get(reference);
    }
    return this.withFile(records => {
      if (!records[reference]) throw new Error('LEAD_NOT_FOUND');
      records[reference] = { ...records[reference], ...permitted };
      return records[reference];
    });
  }

  async beginReview(reference, reviewedAt, reviewNote = '') {
    await this.init();
    const timestamp = reviewedAt || nowIso();
    if (this.mode === 'mysql') {
      const [result] = await this.pool.execute(
        `UPDATE danini_contact_leads
         SET status = 'followup-sending', reviewed_at = ?, review_note = ?, updated_at = ?
         WHERE reference = ? AND status IN ('received', 'delivery-partial')`,
        [new Date(timestamp), reviewNote, new Date(timestamp), reference]
      );
      if (!result.affectedRows) throw new Error('LEAD_ALREADY_REVIEWED');
      return this.get(reference);
    }
    return this.withFile(records => {
      const lead = records[reference];
      if (!lead) throw new Error('LEAD_NOT_FOUND');
      if (!['received', 'delivery-partial'].includes(lead.status)) throw new Error('LEAD_ALREADY_REVIEWED');
      records[reference] = {
        ...lead,
        status: 'followup-sending',
        reviewedAt: timestamp,
        reviewNote,
        updatedAt: timestamp
      };
      return records[reference];
    });
  }

  withFile(operation) {
    const task = this.fileQueue.then(() => {
      const records = JSON.parse(fs.readFileSync(this.storageFile, 'utf8'));
      const result = operation(records);
      const temporary = `${this.storageFile}.${process.pid}.tmp`;
      fs.writeFileSync(temporary, `${JSON.stringify(records, null, 2)}\n`, { mode: 0o600 });
      fs.renameSync(temporary, this.storageFile);
      return result;
    });
    this.fileQueue = task.catch(() => {});
    return task;
  }
}

function createContactLeadStore(options) {
  return new ContactLeadStore(options);
}

module.exports = { ContactLeadStore, createContactLeadStore, databaseConfigured };
