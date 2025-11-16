-- RLS policies and trigger fix for profile_views
-- Run these in Supabase SQL editor

-- Ensure table exists (skip if already created)
-- CREATE TABLE public.profile_views (
--   id uuid primary key default gen_random_uuid(),
--   viewer_user_id uuid not null,
--   viewed_profile_user_id uuid not null,
--   viewed_at timestamptz null default now(),
--   created_at timestamptz null default now(),
--   constraint profile_views_viewer_viewed_unique unique (viewer_user_id, viewed_profile_user_id),
--   constraint profile_views_viewer_fkey foreign key (viewer_user_id) references user_profiles (user_id) on delete cascade,
--   constraint profile_views_viewed_fkey foreign key (viewed_profile_user_id) references user_profiles (user_id) on delete cascade,
--   constraint profile_views_self_check check (viewer_user_id <> viewed_profile_user_id)
-- );

-- Enable RLS
ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own records
CREATE POLICY "Users can select their own profile views" ON public.profile_views
  FOR SELECT USING (auth.uid() = viewer_user_id);

-- Allow users to insert their own views (not viewing self)
CREATE POLICY "Users can insert their own profile views" ON public.profile_views
  FOR INSERT WITH CHECK (auth.uid() = viewer_user_id AND viewer_user_id <> viewed_profile_user_id);

-- Optional: allow users to delete their own records
CREATE POLICY "Users can delete their own profile views" ON public.profile_views
  FOR DELETE USING (auth.uid() = viewer_user_id);

-- If a trigger exists but function is missing, drop the trigger and rely on unique constraint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'trigger_prevent_duplicate_profile_views'
  ) THEN
    EXECUTE 'DROP TRIGGER IF EXISTS trigger_prevent_duplicate_profile_views ON public.profile_views';
  END IF;
END $$;

-- Alternatively, provide a simple duplicate-prevent function if you want to keep the trigger
-- CREATE OR REPLACE FUNCTION public.prevent_duplicate_profile_views()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   IF EXISTS (
--     SELECT 1 FROM public.profile_views
--     WHERE viewer_user_id = NEW.viewer_user_id
--       AND viewed_profile_user_id = NEW.viewed_profile_user_id
--   ) THEN
--     -- Skip insert; unique constraint would block anyway
--     RETURN NULL; -- cancels insert
--   END IF;
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SECURITY INVOKER;
-- CREATE TRIGGER trigger_prevent_duplicate_profile_views BEFORE INSERT ON public.profile_views
-- FOR EACH ROW EXECUTE FUNCTION public.prevent_duplicate_profile_views();