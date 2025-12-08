CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  image_url TEXT,
  image_urls TEXT[],
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  weight DECIMAL(8, 2),
  dimensions JSONB,
  tags TEXT[],
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_display_order ON products(display_order);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Make trigger creation idempotent when re-running schema
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Backward-compatible cleanup of deprecated product fields
ALTER TABLE products DROP COLUMN IF EXISTS compare_at_price;
ALTER TABLE products DROP COLUMN IF EXISTS cost_price;
ALTER TABLE products DROP COLUMN IF EXISTS sku;
ALTER TABLE products DROP COLUMN IF EXISTS barcode;
ALTER TABLE products DROP COLUMN IF EXISTS stock_quantity;
ALTER TABLE products DROP COLUMN IF EXISTS track_inventory;

-- Ensure policies are recreated cleanly when rerunning the script
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Categories can be inserted by authenticated users" ON categories;
CREATE POLICY "Categories can be inserted by authenticated users" ON categories
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Categories can be updated by authenticated users" ON categories;
CREATE POLICY "Categories can be updated by authenticated users" ON categories
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Categories can be deleted by authenticated users" ON categories;
CREATE POLICY "Categories can be deleted by authenticated users" ON categories
  FOR DELETE USING (true);

DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Products can be inserted by authenticated users" ON products;
CREATE POLICY "Products can be inserted by authenticated users" ON products
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Products can be updated by authenticated users" ON products;
CREATE POLICY "Products can be updated by authenticated users" ON products
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Products can be deleted by authenticated users" ON products;
CREATE POLICY "Products can be deleted by authenticated users" ON products
  FOR DELETE USING (true);

-- WhatsApp inbound message log
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wa_message_id TEXT,
  wa_from TEXT,
  wa_to TEXT,
  profile_name TEXT,
  message_type TEXT,
  message_text TEXT,
  raw JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_created_at ON whatsapp_messages(created_at DESC);

ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "WhatsApp messages viewable by authenticated users" ON whatsapp_messages;
CREATE POLICY "WhatsApp messages viewable by authenticated users" ON whatsapp_messages
  FOR SELECT TO authenticated USING (true);
