-- Apply once using the D1 migration runner before enabling Stripe Sandbox.
ALTER TABLE danini_digital_orders ADD COLUMN stripe_session_id TEXT;
CREATE UNIQUE INDEX idx_danini_digital_stripe_session ON danini_digital_orders(stripe_session_id) WHERE stripe_session_id IS NOT NULL;
