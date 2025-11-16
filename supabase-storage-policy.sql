-- Supabase Storage RLS Policy for payment-screenshots bucket
-- Run these commands in your Supabase SQL Editor

-- 1. First, create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-screenshots', 'payment-screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS on the storage.objects table (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Create policy to allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload payment screenshots" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'payment-screenshots' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'payment-screenshots'
);

-- 4. Create policy to allow users to view their own uploaded files
CREATE POLICY "Allow users to view payment screenshots" ON storage.objects
FOR SELECT USING (
  bucket_id = 'payment-screenshots'
  AND auth.role() = 'authenticated'
);

-- 5. Create policy to allow users to delete their own files (optional)
CREATE POLICY "Allow users to delete their own payment screenshots" ON storage.objects
FOR DELETE USING (
  bucket_id = 'payment-screenshots'
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[2] -- assuming filename format: payment-screenshots/userId_timestamp.ext
);

-- 6. Alternative simpler policy (if the above doesn't work)
-- DROP the above policies and use this instead:
/*
CREATE POLICY "Allow all authenticated users full access to payment screenshots" ON storage.objects
FOR ALL USING (
  bucket_id = 'payment-screenshots'
  AND auth.role() = 'authenticated'
);
*/