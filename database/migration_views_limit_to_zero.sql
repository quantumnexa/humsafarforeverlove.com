-- Migration script to update existing user_subscriptions records
-- Change views_limit from 5 to 0 for existing records

-- Update existing records where views_limit is 5 (default value) to 0
UPDATE public.user_subscriptions 
SET views_limit = 0, 
    updated_at = now()
WHERE views_limit = 5;

-- Verify the update
SELECT 
    COUNT(*) as total_records,
    COUNT(CASE WHEN views_limit = 0 THEN 1 END) as zero_views_count,
    COUNT(CASE WHEN views_limit > 0 THEN 1 END) as positive_views_count
FROM public.user_subscriptions;

-- Optional: Show records with positive views_limit (these might be purchased packages)
SELECT 
    user_id, 
    subscription_status, 
    profile_status, 
    views_limit, 
    created_at, 
    updated_at
FROM public.user_subscriptions 
WHERE views_limit > 0
ORDER BY views_limit DESC, created_at DESC;