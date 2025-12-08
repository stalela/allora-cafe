# Admin Interface Setup Guide

## Environment Variables

Make sure your `.env` file includes:

```env
NEXT_PUBLIC_SUPABASE_URL=https://eehcatilgidldlbnuijn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_A8jh4RuTKLIxaEZigGDBcQ_tkeV_YYo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlaGNhdGlsZ2lkbGRsYm51aWpuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTA4NzgwNSwiZXhwIjoyMDgwNjYzODA1fQ.hzc3GPGcV7OBpEpBh1Tp9CIclOvl6h05qRIPjby7Hi0

# WhatsApp Business API Configuration
WHATSAPP_VERIFY_TOKEN=your_webhook_verify_token_here
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
WHATSAPP_ADMIN_NUMBERS=27821234567,27829876543
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

## WhatsApp Business API Setup

### 1. Create a Meta Business Account
- Go to [Meta Business](https://business.facebook.com/)
- Create or use an existing business account

### 2. Set up WhatsApp Business API
- Go to [Meta for Developers](https://developers.facebook.com/)
- Create a new app or use existing one
- Add WhatsApp product to your app
- Complete the WhatsApp Business verification process

### 3. Get Your WhatsApp Credentials
- **Phone Number ID**: Found in WhatsApp → API Setup
- **Access Token**: Generate a permanent access token
- **Verify Token**: Create a custom verify token for webhook verification

### 4. Configure Webhook
- **Webhook URL**: `https://yourdomain.com/api/whatsapp-webhook`
- **Verify Token**: Same as `WHATSAPP_VERIFY_TOKEN` env var
- Subscribe to `messages` webhook event

### 5. Set Admin Phone Numbers
- Add admin phone numbers to `WHATSAPP_ADMIN_NUMBERS` (comma-separated, without + prefix)
- Example: `27821234567,27829876543`

### 6. Test the Setup
- Send a WhatsApp message to your business number
- Check `/admin/messages` to see if messages are received
- Try admin commands like `/help` from an admin phone

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

### WhatsApp Admin Commands

The cafe supports WhatsApp-based admin management. Admin commands can be sent to the business WhatsApp number from authorized phone numbers.

**Available Commands:**
- `/help` - Show all available commands
- `/add name=<name> price=<price> [desc=<desc> category=<slug>]` - Add new product
- `/update <slug> <field>=<value>` - Update product fields (name, price, desc, image_url)
- `/stock <slug> active|inactive` - Toggle product availability
- `/list products [active|all]` - List products with prices
- `/orders [status]` - List recent orders
- `/order <number>` - Show order details
- `/order <number> status=<status>` - Update order status (pending, confirmed, preparing, ready, delivered, cancelled)

**Admin Features:**
- **Messages**: `/admin/messages` - View all WhatsApp messages
- **Command Logs**: `/admin/commands` - View command history and audit trail

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

