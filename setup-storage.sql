-- Supabase Storage Setup for OurCabin
-- Run this in your Supabase SQL Editor

-- =============================================================================
-- 1. CREATE STORAGE BUCKETS
-- =============================================================================

-- Create cabin-images bucket for storing post images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cabin-images',
  'cabin-images',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 2. CREATE STORAGE POLICIES
-- =============================================================================

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'cabin-images' AND
  auth.role() = 'authenticated'
);

-- Allow authenticated users to view images
CREATE POLICY "Authenticated users can view images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'cabin-images' AND
  auth.role() = 'authenticated'
);

-- Allow users to update their own images
CREATE POLICY "Users can update own images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'cabin-images' AND
  auth.role() = 'authenticated'
);

-- Allow users to delete their own images
CREATE POLICY "Users can delete own images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'cabin-images' AND
  auth.role() = 'authenticated'
);

-- =============================================================================
-- 3. VERIFY SETUP
-- =============================================================================

-- Check that the bucket was created
SELECT * FROM storage.buckets WHERE id = 'cabin-images';

-- Check that policies were created
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
