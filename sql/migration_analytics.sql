-- Phase 1: Learning Analytics foundation

-- Session counter (needed for avg-cards/avg-duration-per-session)
ALTER TABLE public.daily_user_stats
ADD COLUMN IF NOT EXISTS sessions_completed INT DEFAULT 0;

-- Per-card review outcomes (accuracy foundation)
CREATE TABLE IF NOT EXISTS public.card_review_events (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id UUID NOT NULL,
  deck_id UUID NOT NULL,
  study_mode TEXT NOT NULL,       -- 'A' or 'C'
  session_type TEXT NOT NULL,     -- 'learn' or 'review'
  rating INT NOT NULL,
  reviewed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_card_review_events_user_date
  ON public.card_review_events (user_id, reviewed_at);

ALTER TABLE public.card_review_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "insert own review events" ON public.card_review_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "read own review events" ON public.card_review_events
  FOR SELECT USING (auth.uid() = user_id);

-- Per-character practice outcomes
CREATE TABLE IF NOT EXISTS public.character_practice_events (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id UUID NOT NULL,
  character TEXT NOT NULL,
  mistake_count INT NOT NULL DEFAULT 0,
  session_type TEXT NOT NULL,     -- 'learn' or 'review'
  practiced_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_character_practice_events_user_date
  ON public.character_practice_events (user_id, practiced_at);
CREATE INDEX IF NOT EXISTS idx_character_practice_events_char
  ON public.character_practice_events (user_id, character);

ALTER TABLE public.character_practice_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "insert own character events" ON public.character_practice_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "read own character events" ON public.character_practice_events
  FOR SELECT USING (auth.uid() = user_id);

-- Batch inserts (one round trip per session, not one per card)
CREATE OR REPLACE FUNCTION public.log_card_review_events(p_events JSONB)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.card_review_events
    (user_id, card_id, deck_id, study_mode, session_type, rating, reviewed_at)
  SELECT
    (e->>'user_id')::UUID, (e->>'card_id')::UUID, (e->>'deck_id')::UUID,
    e->>'study_mode', e->>'session_type', (e->>'rating')::INT,
    COALESCE((e->>'reviewed_at')::TIMESTAMPTZ, now())
  FROM jsonb_array_elements(p_events) AS e;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_character_practice_events(p_events JSONB)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.character_practice_events
    (user_id, card_id, character, mistake_count, session_type, practiced_at)
  SELECT
    (e->>'user_id')::UUID, (e->>'card_id')::UUID, e->>'character',
    (e->>'mistake_count')::INT, e->>'session_type',
    COALESCE((e->>'practiced_at')::TIMESTAMPTZ, now())
  FROM jsonb_array_elements(p_events) AS e;
END;
$$;

-- Extend existing log_daily_activity to also bump sessions_completed
CREATE OR REPLACE FUNCTION public.log_daily_activity(
  p_user_id UUID, p_date DATE, p_cards_reviewed INT DEFAULT 0,
  p_cards_learned INT DEFAULT 0, p_is_character BOOLEAN DEFAULT FALSE
)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.daily_user_stats (
    user_id, date, cards_reviewed, cards_learned, has_practiced_character, sessions_completed
  )
  VALUES (p_user_id, p_date, p_cards_reviewed, p_cards_learned, p_is_character, 1)
  ON CONFLICT (user_id, date) DO UPDATE SET
    cards_reviewed = daily_user_stats.cards_reviewed + EXCLUDED.cards_reviewed,
    cards_learned = daily_user_stats.cards_learned + EXCLUDED.cards_learned,
    has_practiced_character = daily_user_stats.has_practiced_character OR EXCLUDED.has_practiced_character,
    sessions_completed = daily_user_stats.sessions_completed + 1;
END;
$$;