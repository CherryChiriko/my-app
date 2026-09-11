-- ============================================================
-- Migration: profiles - freemium plan state and monthly imports
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS plan_id text NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS subscription_status text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS import_usage_month text,
  ADD COLUMN IF NOT EXISTS imported_cards_this_month integer NOT NULL DEFAULT 0;

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_plan_id_check,
  ADD CONSTRAINT profiles_plan_id_check
    CHECK (plan_id IN ('free', 'pro', 'lifetime'));

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_subscription_status_check,
  ADD CONSTRAINT profiles_subscription_status_check
    CHECK (subscription_status IN ('active', 'past_due', 'canceled'));

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_imported_cards_this_month_check,
  ADD CONSTRAINT profiles_imported_cards_this_month_check
    CHECK (imported_cards_this_month >= 0);


-- ============================================================
-- Migration: profiles - subscription period tracking
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS pro_current_period_end timestamptz,
  ADD COLUMN IF NOT EXISTS pro_cancel_at_period_end boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS stripe_customer_id text,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text,
  ADD COLUMN IF NOT EXISTS pro_plan text; -- 'monthly' | 'annual' | null (lifetime has no period)

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_pro_plan_check,
  ADD CONSTRAINT profiles_pro_plan_check
    CHECK (pro_plan IS NULL OR pro_plan IN ('monthly', 'annual'));

-- subscription_status gains 'expired' as a state your app can react to,
-- distinct from 'canceled' (still active until period end) and 'past_due'.
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_subscription_status_check,
  ADD CONSTRAINT profiles_subscription_status_check
    CHECK (subscription_status IN ('active', 'past_due', 'canceled', 'expired'));

CREATE INDEX IF NOT EXISTS idx_profiles_period_end
  ON public.profiles (pro_current_period_end)
  WHERE plan_id != 'free' AND plan_id != 'lifetime';



CREATE OR REPLACE FUNCTION public.protect_billing_columns()
RETURNS trigger AS $$
BEGIN
  IF auth.role() != 'service_role' THEN
    IF NEW.plan_id IS DISTINCT FROM OLD.plan_id
      OR NEW.subscription_status IS DISTINCT FROM OLD.subscription_status
      OR NEW.pro_current_period_end IS DISTINCT FROM OLD.pro_current_period_end
      OR NEW.pro_cancel_at_period_end IS DISTINCT FROM OLD.pro_cancel_at_period_end
      OR NEW.stripe_customer_id IS DISTINCT FROM OLD.stripe_customer_id
      OR NEW.stripe_subscription_id IS DISTINCT FROM OLD.stripe_subscription_id
      OR NEW.pro_plan IS DISTINCT FROM OLD.pro_plan
    THEN
      RAISE EXCEPTION 'Billing fields can only be modified by the billing system';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER protect_billing_columns_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_billing_columns();


  -- ============================================================
-- Migration: processed_stripe_events - webhook idempotency
-- ============================================================

CREATE TABLE IF NOT EXISTS public.processed_stripe_events (
  event_id text PRIMARY KEY,
  event_type text NOT NULL,
  processed_at timestamptz NOT NULL DEFAULT now()
);

-- No RLS needed for typical use — this table is only ever touched by the
-- service_role key from the webhook Edge Function, never from the client.
ALTER TABLE public.processed_stripe_events ENABLE ROW LEVEL SECURITY;
-- Deliberately no policies added: service_role bypasses RLS entirely,
-- and no policy means zero access for anon/authenticated roles.

-- Optional housekeeping: drop event records older than 30 days so this
-- table doesn't grow forever. Safe to run periodically via pg_cron if
-- you have it, or just run manually now and then.
-- DELETE FROM public.processed_stripe_events WHERE processed_at < now() - interval '30 days';