-- 1. Drop existing version to clear signature mismatch
DROP FUNCTION IF EXISTS public.log_character_practice_session(UUID);
DROP FUNCTION IF EXISTS public.log_character_practice_session(UUID, DATE);

-- 2. Create function matching both (p_user_id, p_date) and (p_user_id)
CREATE OR REPLACE FUNCTION public.log_character_practice_session(
  p_user_id UUID DEFAULT auth.uid(),
  p_date DATE DEFAULT CURRENT_DATE
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_date DATE;
BEGIN
  v_user_id := COALESCE(p_user_id, auth.uid());
  v_date := COALESCE(p_date, CURRENT_DATE);
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User ID is required';
  END IF;

  INSERT INTO public.daily_user_stats (
    user_id, 
    date, 
    has_practiced_character, 
    character_sessions_completed
  )
  VALUES (
    v_user_id, 
    v_date, 
    TRUE, 
    1
  )
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    has_practiced_character = TRUE,
    character_sessions_completed = COALESCE(daily_user_stats.character_sessions_completed, 0) + 1;
END;
$$;

-- 3. Grant execution permissions
GRANT EXECUTE ON FUNCTION public.log_character_practice_session TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_character_practice_session TO anon;