# Supabase Database Setup

This directory contains the database schema for the Allora Cafe ecommerce backend.

## Setup Instructions

1. **Create a Supabase Project**
   - Go to [https://app.supabase.com](https://app.supabase.com)
   - Create a new project
   - Wait for the project to be fully provisioned

2. **Run the Schema SQL**
   - In your Supabase project, go to the SQL Editor
   - Open the `schema.sql` file from this directory
   - Copy and paste the entire contents into the SQL Editor
   - Click "Run" to execute the schema

3. **Get Your API Keys**
   - Go to Project Settings → API
   - Copy the following values:
     - Project URL (for `NEXT_PUBLIC_SUPABASE_URL`)
     - `anon` `public` key (for `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
     - `service_role` `secret` key (for `SUPABASE_SERVICE_ROLE_KEY` - optional, only if you need admin operations)

4. **Configure Environment Variables**
   - Copy `env.example` to `.env.local` in the project root
   - Fill in your Supabase credentials

## Database Schema

### Categories Table
- Stores product categories
- Fields: id, name, slug, description, image_url, is_active, display_order, timestamps

### Products Table
- Stores product information
- Fields: id, name, slug, description, price, compare_at_price, cost_price, sku, barcode, category_id (FK), image_url, image_urls (array), stock_quantity, track_inventory, is_active, is_featured, display_order, weight, dimensions (JSON), tags (array), metadata (JSON), timestamps

## API Endpoints

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/[id]` - Get a single category
- `POST /api/categories` - Create a category
- `PATCH /api/categories/[id]` - Update a category
- `DELETE /api/categories/[id]` - Delete a category

### Products
- `GET /api/products` - Get all products (supports query params: categoryId, featured, includeInactive, limit, offset)
- `GET /api/products/[id]` - Get a single product
- `POST /api/products` - Create a product
- `PATCH /api/products/[id]` - Update a product
- `DELETE /api/products/[id]` - Delete a product

## Row Level Security (RLS)

The schema includes RLS policies that:
- Allow public read access to active categories and products
- Require authentication for write operations (you may need to adjust these based on your auth setup)

To customize RLS policies, modify the policies in `schema.sql` or through the Supabase dashboard.

