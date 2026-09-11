-- 1. Ensure the column exists on daily_user_stats
ALTER TABLE daily_user_stats 
ADD COLUMN IF NOT EXISTS character_sessions_completed INT DEFAULT 0;

-- 2. Create an atomic increment RPC function
CREATE OR REPLACE FUNCTION log_character_practice_session(
  p_user_id UUID,
  p_date DATE
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO daily_user_stats (user_id, date, character_sessions_completed)
  VALUES (p_user_id, p_date, 1)
  ON CONFLICT (user_id, date)
  DO UPDATE SET character_sessions_completed = daily_user_stats.character_sessions_completed + 1;
END;
$$ LANGUAGE plpgsql;


-- Example Supabase RPC function update
CREATE OR REPLACE FUNCTION log_daily_activity(
  p_user_id UUID,
  p_date DATE,
  p_cards_reviewed INT,
  p_cards_learned INT,
  p_is_character BOOLEAN DEFAULT FALSE
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO daily_user_stats (user_id, date, cards_reviewed, cards_learned, character_sessions_completed)
  VALUES (p_user_id, p_date, p_cards_reviewed, p_cards_learned, CASE WHEN p_is_character THEN 1 ELSE 0 END)
  ON CONFLICT (user_id, date) DO UPDATE SET
    cards_reviewed = daily_user_stats.cards_reviewed + EXCLUDED.cards_reviewed,
    cards_learned = daily_user_stats.cards_learned + EXCLUDED.cards_learned,
    character_sessions_completed = daily_user_stats.character_sessions_completed + (CASE WHEN p_is_character THEN 1 ELSE 0 END);
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION log_daily_activity(
  p_user_id UUID,
  p_date DATE,
  p_cards_reviewed INT,
  p_cards_learned INT,
  p_is_character BOOLEAN DEFAULT FALSE
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO daily_user_stats (
    user_id, 
    date, 
    cards_reviewed, 
    cards_learned, 
    character_sessions_completed
  )
  VALUES (
    p_user_id, 
    p_date, 
    p_cards_reviewed, 
    p_cards_learned, 
    CASE WHEN p_is_character THEN 1 ELSE 0 END
  )
  ON CONFLICT (user_id, date) DO UPDATE SET
    cards_reviewed = daily_user_stats.cards_reviewed + EXCLUDED.cards_reviewed,
    cards_learned = daily_user_stats.cards_learned + EXCLUDED.cards_learned,
    character_sessions_completed = daily_user_stats.character_sessions_completed + (CASE WHEN p_is_character THEN 1 ELSE 0 END);
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION public.log_daily_activity(
  p_user_id UUID,
  p_date DATE,
  p_cards_reviewed INT DEFAULT 0,
  p_cards_learned INT DEFAULT 0,
  p_is_character BOOLEAN DEFAULT FALSE
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_daily_activity (
    user_id,
    activity_date,
    cards_reviewed,
    cards_learned,
    has_practiced_character
  )
  VALUES (
    p_user_id,
    p_date,
    p_cards_reviewed,
    p_cards_learned,
    p_is_character
  )
  ON CONFLICT (user_id, activity_date)
  DO UPDATE SET
    cards_reviewed = user_daily_activity.cards_reviewed + EXCLUDED.cards_reviewed,
    cards_learned = user_daily_activity.cards_learned + EXCLUDED.cards_learned,
    -- Flips to TRUE if practiced today, stays TRUE once set
    has_practiced_character = user_daily_activity.has_practiced_character OR EXCLUDED.has_practiced_character;
END;
$$;


-- 1. Ensure columns exist on daily_user_stats table
ALTER TABLE public.daily_user_stats 
ADD COLUMN IF NOT EXISTS has_practiced_character BOOLEAN DEFAULT FALSE;

-- 2. Create/Replace RPC log_daily_activity targeting daily_user_stats
CREATE OR REPLACE FUNCTION public.log_daily_activity(
  p_user_id UUID,
  p_date DATE,
  p_cards_reviewed INT DEFAULT 0,
  p_cards_learned INT DEFAULT 0,
  p_is_character BOOLEAN DEFAULT FALSE
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.daily_user_stats (
    user_id,
    date,
    cards_reviewed,
    cards_learned,
    has_practiced_character
  )
  VALUES (
    p_user_id,
    p_date,
    p_cards_reviewed,
    p_cards_learned,
    p_is_character
  )
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    cards_reviewed = daily_user_stats.cards_reviewed + EXCLUDED.cards_reviewed,
    cards_learned = daily_user_stats.cards_learned + EXCLUDED.cards_learned,
    has_practiced_character = daily_user_stats.has_practiced_character OR EXCLUDED.has_practiced_character;
END;
$$;