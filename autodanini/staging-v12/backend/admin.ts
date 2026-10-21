/**
 * AutoDanini admin extension for the existing AppDeploy backend.
 * Integrate via: import { adminRoutes } from './admin'; then ...adminRoutes inside router({...}).
 * SECURITY: Empty allowlist denies all administrator access until owner confirms the exact sign-in email.
 */
import {
  db, json, error, requireAuth, requireAdminEmailAllowlist
} from '@appdeploy/sdk';
import { randomUUID } from 'node:crypto';
import type { RouterRoutes } from '@appdeploy/sdk';

const ADMIN_EMAILS: string[] = []; // SECURITY LOCK: set only to email explicitly confirmed as owner's login.
const inboxTable = 'autodanini_submitted_requests_v1';
const auditTable = 'autodanini_admin_change_audit_v1';
const statuses = ['new', 'reviewing', 'waiting_on_buyer', 'quote_draft', 'closed'] as const;
type Status = typeof statuses[number];
type PrivateCase = {
  type: string; vehicle: string; destination: string; budget: number | null;
  listing: string; notes: string; createdAt: string;
};
type SubmittedCase = PrivateCase & {
  id: string; userId: string; ownerEmail: string; ownerName: string;
  sourceCaseId: string; status: Status; createdAt: string; updatedAt: string;
  quoteEUR: number | null; adminNote: string;
};

function ownTable(userId: string): string {
  const key = userId.replace(/-/g, '');
  if (!/^[a-z0-9]{20,80}$/i.test(key)) throw new Error('Invalid authenticated ID');
  return 'autodanini_cases_' + key;
}
function validId(id: unknown): id is string {
  return typeof id === 'string' && id.length >= 6 && id.length <= 80 && /^[A-Za-z0-9_-]+$/.test(id);
}
function submissionId(userId: string, caseId: string): string {
  const id = 'sub_' + userId.replace(/-/g, '') + '_' + caseId;
  if (id.length > 128) throw new Error('Case ID too long');
  return id;
}
function validateQuote(value: unknown): value is number | null {
  return value === null || (typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1000000);
}
export const adminRoutes: RouterRoutes = {
  'POST /api/case-submissions': [
    requireAuth(),
    async (ctx) => {
      const input = (ctx.body ?? {}) as {caseId?: unknown; submitConsent?: unknown};
      if (!validId(input.caseId) || input.submitConsent !== true) {
        return error('Explicit submission consent and valid saved case required', 400);
      }
      const ownerId = ctx.user!.userId;
      const [saved] = await db.get<PrivateCase>(ownTable(ownerId), [input.caseId], {consistent: true});
      if (!saved) return error('Saved case not found', 404);
      // Use one stable, deterministic receipt ID so repeat button presses cannot create duplicate cases.
      const id = submissionId(ownerId, input.caseId);
      const now = new Date().toISOString();
      const record: SubmittedCase = {
        ...saved, id, sourceCaseId: input.caseId,
        userId: ownerId, ownerEmail: ctx.user!.email || '', ownerName: ctx.user!.name || '',
        status: 'new', createdAt: now, updatedAt: now, quoteEUR: null, adminNote: ''
      };
      try {
        const [created] = await db.tx.add(inboxTable, [record]);
        if (created) return json({submissionId: id, status: 'new', submitted: true}, 201);
        // Replay reconciliation is read-only. Never modify or reset an existing submission.
        const [original] = await db.get<SubmittedCase>(inboxTable, [id], {consistent: true});
        if (original?.userId === ownerId && original.sourceCaseId === input.caseId) {
          return json({submissionId: id, status: original.status, submitted: true});
        }
        return error('Submission state cannot be confirmed', 503);
      } catch (_err) {
        // Unknown database results must be reconciled explicitly; never blindly duplicate submissions.
        try {
          const [original] = await db.get<SubmittedCase>(inboxTable, [id], {consistent: true});
          if (original?.userId === ownerId && original.sourceCaseId === input.caseId) {
            return json({submissionId: id, status: original.status, submitted: true});
          }
        } catch (_readError) { /* preserve fail-closed state */ }
        return error('Submission not confirmed; check status before trying again', 503);
      }
    }
  ],
  'GET /api/my-submission/:caseId': [
    requireAuth(),
    async (ctx) => {
      if (!validId(ctx.params.caseId)) return error('Invalid case ID', 400);
      const id = submissionId(ctx.user!.userId, ctx.params.caseId);
      const [entry] = await db.get<SubmittedCase>(inboxTable, [id], {consistent: true});
      if (!entry || entry.userId !== ctx.user!.userId) return json({submitted: false});
      return json({
        submitted: true, submissionId: entry.id, status: entry.status,
        createdAt: entry.createdAt, updatedAt: entry.updatedAt
      });
    }
  ],
  'GET /api/admin/requests': [
    requireAuth(),
    requireAdminEmailAllowlist(ADMIN_EMAILS),
    async ({query}) => {
      // Page size is fixed. No unrestricted 'all users' scans or unauthenticated access.
      const page = await db.list<SubmittedCase>(inboxTable, {limit: 30, nextToken: query.nextToken || undefined});
      return json({requests: page.items, nextToken: page.nextToken || null, pageCount: page.items.length});
    }
  ],
  'GET /api/admin/requests/:id': [
    requireAuth(),
    requireAdminEmailAllowlist(ADMIN_EMAILS),
    async ({params}) => {
      if (!validId(params.id) && !/^sub_[A-Za-z0-9_-]{15,124}$/.test(params.id)) return error('Invalid request ID', 400);
      const [entry] = await db.get<SubmittedCase>(inboxTable, [params.id], {consistent: true});
      if (!entry) return error('Request not found', 404);
      return json({request: entry});
    }
  ],
  'PUT /api/admin/requests/:id': [
    requireAuth(),
    requireAdminEmailAllowlist(ADMIN_EMAILS),
    async (ctx) => {
      const {params, body} = ctx;
      if (!/^sub_[A-Za-z0-9_-]{15,124}$/.test(params.id)) return error('Invalid request ID', 400);
      const input = (body ?? {}) as Record<string, unknown>;
      if (typeof input.status !== 'string' || !statuses.includes(input.status as Status)) return error('Invalid status', 400);
      if (typeof input.expectedStatus !== 'string' || !statuses.includes(input.expectedStatus as Status)) return error('Missing expected status', 400);
      if (!validateQuote(input.quoteEUR)) return error('Invalid quote EUR', 400);
      if (typeof input.adminNote !== 'string' || input.adminNote.length > 1600) return error('Invalid admin note', 400);
      const [old] = await db.get<SubmittedCase>(inboxTable, [params.id], {consistent: true});
      if (!old) return error('Request not found', 404);
      if (old.status !== input.expectedStatus) return error('Changed by another session — reload', 409);
      const auditId = 'evt_' + randomUUID().replace(/-/g, '');
      const at = new Date().toISOString();
      // Both the modified request and its minimal audit receipt must commit together.
      // Never store the buyer's personal details or internal free-text notes in the audit table.
      const change = db.tx.update(inboxTable, [{
        id: params.id,
        record: {
          status: input.status, quoteEUR: input.quoteEUR, adminNote: input.adminNote,
          updatedAt: at
        },
        if: {status: input.expectedStatus, updatedAt: old.updatedAt}
      }], {patch: true});
      const audit = db.tx.add(auditTable, [{
        id: auditId, requestId: params.id, operatorId: ctx.user!.userId,
        changedAt: at, statusFrom: old.status, statusTo: input.status,
        quoteModified: old.quoteEUR !== input.quoteEUR
      }]);
      try {
        const [updated, logged] = await db.transact([change, audit]);
        if (!updated[0] || !logged[0]) return error('Change not confirmed, reload request', 409);
      } catch (_err) {
        // Transactions may have an unknown outcome; do not blindly retry the write.
        return error('Change not confirmed. Refresh this case before trying again.', 503);
      }
      return json({updated: true, status: input.status, quoteIsDraft: true, paymentCaptured: false});
    }
  ]
};
