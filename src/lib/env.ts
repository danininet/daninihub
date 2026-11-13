export interface Env {
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
  DIRECTOR_EMAIL?: string;
  ASSETS: Fetcher;
  DANINI_DB: D1Database;
  PARTNERS: KVNamespace;
  DOCUMENTS: R2Bucket;
  INTAKE_WORKFLOW: Workflow<{ caseId: string }>;
  B2B_ACTIVE?: string;
  SITE_ORIGIN?: string;
  DANINI_TURNSTILE_SITEKEY?: string;
  DANINI_TURNSTILE_SECRET?: string;
  DIRECTOR_HMAC_SECRET?: string;
  TOKEN_SECRET?: string;
  RATE_SECRET?: string;
  RETENTION_DAYS?: string;
  AI_ENABLED?: string;
  AI_ENDPOINT?: string;
  AI_API_KEY?: string;
  AI_MODEL?: string;
  AI_PROCESSING_APPROVED?: string;
  BREVO_API_KEY?: string;
  DANINI_BREVO_SENDER?: string;
  DANINI_NOTIFY_TO?: string;
  DANINI_BREVO_REPLYTO?: string;
}
