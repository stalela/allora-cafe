-- Storage Bucket Policies for product-images
-- Run this in your Supabase SQL Editor after creating the 'product-images' bucket

-- Policy: Allow public to read/view images
CREATE POLICY "Public can view product images"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'product-images' 
  AND storage.extension(name) IN ('jpg', 'jpeg', 'png', 'gif', 'webp', 'svg')
);

-- Policy: Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
  AND storage.extension(name) IN ('jpg', 'jpeg', 'png', 'gif', 'webp', 'svg')
);

-- Policy: Allow authenticated users to update their uploaded images
CREATE POLICY "Authenticated users can update product images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);

-- Policy: Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete product images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);

-- Alternative: More restrictive policy for specific folder structure
-- If you want to organize images in a 'public' folder:
-- Note: This policy checks if the first folder in the path is 'public'
-- For files like 'public/image.jpg', foldername(name)[1] would be 'public'
-- For files like 'products/public/image.jpg', foldername(name)[1] would be 'products'
CREATE POLICY "Public can view images in public folder"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'product-images'
  AND storage.extension(name) = 'jpg'
  AND LOWER((storage.foldername(name))[1]) = 'public'
  AND auth.role() = 'anon'
);

-- If you want to support multiple image formats in the public folder:
CREATE POLICY "Public can view images in public folder (all formats)"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'product-images'
  AND storage.extension(name) IN ('jpg', 'jpeg', 'png', 'gif', 'webp', 'svg')
  AND LOWER((storage.foldername(name))[1]) = 'public'
  AND auth.role() = 'anon'
);
