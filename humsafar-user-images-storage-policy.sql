-- Supabase Storage RLS Policy for humsafar-user-images bucket
-- Run these commands in your Supabase SQL Editor

-- 1. First, create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('humsafar-user-images', 'humsafar-user-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS on the storage.objects table (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Create policy to allow service role (admin) to upload files
CREATE POLICY "Allow service role to upload user images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'humsafar-user-images' 
  AND auth.role() = 'service_role'
);

-- 4. Create policy to allow authenticated users to upload their own files
CREATE POLICY "Allow authenticated users to upload user images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'humsafar-user-images' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 5. Create policy to allow public read access to user images
CREATE POLICY "Allow public read access to user images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'humsafar-user-images'
);

-- 6. Create policy to allow service role to delete files (admin operations)
CREATE POLICY "Allow service role to delete user images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'humsafar-user-images'
  AND auth.role() = 'service_role'
);

-- 7. Create policy to allow users to delete their own files
CREATE POLICY "Allow users to delete their own user images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'humsafar-user-images'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 8. Alternative comprehensive policy (if above doesn't work)
-- DROP the above policies and use this instead:
/*
CREATE POLICY "Allow all operations on user images" ON storage.objects
FOR ALL USING (
  bucket_id = 'humsafar-user-images'
);
*/