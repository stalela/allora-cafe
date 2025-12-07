# Supabase Storage Setup

To enable image uploads for products, you need to set up a storage bucket in Supabase.

## Steps

1. **Go to Supabase Dashboard**
   - Navigate to your project: https://app.supabase.com
   - Go to **Storage** in the left sidebar

2. **Create a New Bucket**
   - Click **"New bucket"**
   - Name: `product-images`
   - Make it **Public** (so images can be accessed via URL)
   - Click **"Create bucket"**

3. **Set Up Bucket Policies** (Recommended)
   
   **Option A: Use SQL Script (Recommended)**
   - Open the SQL Editor in Supabase
   - Copy and paste the contents of `supabase/storage-policies.sql`
   - Run the SQL script to create all policies at once
   
   **Option B: Manual Setup via Dashboard**
   - Go to **Storage** → **Policies**
   - Select the `product-images` bucket
   - Click **"New Policy"** and create policies for:
     - **SELECT**: Allow public to read images
     - **INSERT**: Allow authenticated users to upload
     - **UPDATE**: Allow authenticated users to update
     - **DELETE**: Allow authenticated users to delete
   
   **Example SELECT Policy for Public Access:**
   ```sql
   CREATE POLICY "Public can view product images"
   ON storage.objects
   FOR SELECT
   USING (
     bucket_id = 'product-images' 
     AND storage.extension(name) IN ('jpg', 'jpeg', 'png', 'gif', 'webp', 'svg')
   );
   ```
   
   **Example SELECT Policy for Specific Folder (if using 'public' folder):**
   ```sql
   CREATE POLICY "Public can view images in public folder"
   ON storage.objects
   FOR SELECT
   USING (
     bucket_id = 'product-images'
     AND storage.extension(name) = 'jpg'
     AND LOWER((storage.foldername(name))[1]) = 'public'
     AND auth.role() = 'anon'
   );
   ```

## Alternative: Use Image URLs

If you prefer not to use Supabase Storage, you can:
- Upload images to a different service (Cloudinary, AWS S3, etc.)
- Use direct image URLs in the product form
- The form supports both file upload and URL input

## Testing

After setting up the bucket, test the upload functionality:
1. Go to `/admin/products/new`
2. Try uploading an image
3. Check if it appears in your Supabase Storage dashboard
