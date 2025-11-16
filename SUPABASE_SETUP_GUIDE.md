# Supabase Storage Setup Guide for Payment Screenshots

## Problem
Getting "Storage access denied" error when uploading payment screenshots.

## Solution Steps

### 1. Create Storage Bucket
Go to your Supabase Dashboard → Storage → Create new bucket:
- **Bucket name**: `payment-screenshots`
- **Public bucket**: ✅ Enable this
- **File size limit**: 50MB (optional)
- **Allowed MIME types**: `image/*` (optional)

### 2. Set Bucket Policies (Option A - Simple)
In Supabase Dashboard → Storage → payment-screenshots → Policies:

**Create Policy for INSERT:**
```sql
CREATE POLICY "Allow authenticated users to upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'payment-screenshots' 
  AND auth.role() = 'authenticated'
);
```

**Create Policy for SELECT:**
```sql
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'payment-screenshots');
```

### 3. Alternative - Disable RLS (Option B - Quick Fix)
If policies don't work, temporarily disable RLS:

```sql
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

### 4. Verify Bucket Settings
- Go to Storage → payment-screenshots
- Check if "Public" is enabled
- Test upload manually in Supabase dashboard

### 5. Environment Variables
Make sure these are set in your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Testing
1. Login to your app
2. Go to payment page
3. Try uploading a screenshot
4. Check browser console for detailed error logs

## If Still Not Working
1. Check Supabase logs in Dashboard → Logs
2. Verify user authentication is working
3. Try creating bucket manually in Supabase dashboard
4. Contact Supabase support if needed

## Quick Fix Commands (Run in Supabase SQL Editor)
```sql
-- Create bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-screenshots', 'payment-screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- Simple policy for all authenticated users
CREATE POLICY "Allow all for payment screenshots" ON storage.objects
FOR ALL USING (
  bucket_id = 'payment-screenshots'
  AND auth.role() = 'authenticated'
);
```