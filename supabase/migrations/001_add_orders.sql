-- Add orders and order_items tables

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_email VARCHAR(255),
  delivery_address TEXT NOT NULL,
  special_instructions TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
  whatsapp_message_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(255) NOT NULL,
  product_price DECIMAL(10, 2) NOT NULL CHECK (product_price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
  product_image_url TEXT,
  product_slug VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for orders
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);

-- Indexes for order items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Policies for orders
DROP POLICY IF EXISTS "Orders viewable by authenticated users" ON orders;
CREATE POLICY "Orders viewable by authenticated users" ON orders
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Orders can be inserted by everyone" ON orders;
CREATE POLICY "Orders can be inserted by everyone" ON orders
  FOR INSERT TO public, anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Orders can be updated by authenticated users" ON orders;
CREATE POLICY "Orders can be updated by authenticated users" ON orders
  FOR UPDATE TO authenticated USING (true);

-- Policies for order items
DROP POLICY IF EXISTS "Order items viewable by authenticated users" ON order_items;
CREATE POLICY "Order items viewable by authenticated users" ON order_items
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Order items can be inserted by everyone" ON order_items;
CREATE POLICY "Order items can be inserted by everyone" ON order_items
  FOR INSERT TO public, anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Order items can be updated by authenticated users" ON order_items;
CREATE POLICY "Order items can be updated by authenticated users" ON order_items
  FOR UPDATE USING (true);

-- Admin command logs
CREATE TABLE IF NOT EXISTS admin_command_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_phone VARCHAR(50) NOT NULL,
  command VARCHAR(100) NOT NULL,
  args JSONB,
  success BOOLEAN NOT NULL,
  response TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_command_logs_admin_phone ON admin_command_logs(admin_phone);
CREATE INDEX IF NOT EXISTS idx_admin_command_logs_created_at ON admin_command_logs(created_at DESC);

ALTER TABLE admin_command_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin command logs viewable by authenticated users" ON admin_command_logs;
CREATE POLICY "Admin command logs viewable by authenticated users" ON admin_command_logs
  FOR SELECT TO authenticated USING (true);