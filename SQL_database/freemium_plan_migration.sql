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
