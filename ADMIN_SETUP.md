# Admin Interface Setup Guide

## Environment Variables

Make sure your `.env` file includes:

```env
NEXT_PUBLIC_SUPABASE_URL=https://eehcatilgidldlbnuijn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_A8jh4RuTKLIxaEZigGDBcQ_tkeV_YYo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlaGNhdGlsZ2lkbGRsYm51aWpuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTA4NzgwNSwiZXhwIjoyMDgwNjYzODA1fQ.hzc3GPGcV7OBpEpBh1Tp9CIclOvl6h05qRIPjby7Hi0
```

## Setting Up Admin User

1. **Go to Supabase Dashboard**
   - Navigate to: https://app.supabase.com/project/eehcatilgidldlbnuijn
   - Go to **Authentication** → **Users**

2. **Create an Admin User**
   - Click **"Add user"** → **"Create new user"**
   - Enter email and password
   - Or use **"Invite user"** to send an invitation email

3. **Login to Admin Panel**
   - Go to: `http://localhost:3000/admin/login`
   - Use the email and password you created

## Setting Up Storage for Images

See `supabase/storage-setup.md` for detailed instructions on setting up the `product-images` storage bucket.

## Admin Features

### Product Management
- **View Products**: `/admin/products` - See all products in a table
- **Add Product**: `/admin/products/new` - Create new products with full details
- **Edit Product**: `/admin/products/[id]/edit` - Update existing products
- **Delete Product**: Click delete button in products table
- **Toggle Active/Inactive**: Click eye icon to activate/deactivate products

### Product Form Features
- Product name and slug (auto-generated from name)
- Description
- Category selection
- Pricing (price, compare at price, cost price)
- Inventory tracking (SKU, barcode, stock quantity)
- Image upload (via Supabase Storage or URL)
- Product settings (active, featured, display order, weight)
- Tags support

## Security Notes

- The admin interface requires authentication
- Only users with Supabase Auth accounts can access
- RLS policies on the database tables control access
- Service role key should NEVER be exposed in client-side code
- Keep your `.env` file secure and never commit it to git

## Next Steps

1. Create your admin user in Supabase
2. Set up the storage bucket (see `supabase/storage-setup.md`)
3. Login at `/admin/login`
4. Start adding products!

