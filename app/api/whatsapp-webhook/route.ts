import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// Admin phone numbers (without + prefix)
const ADMIN_PHONE_NUMBERS = process.env.WHATSAPP_ADMIN_NUMBERS?.split(',')?.map(s => s.trim()) || []
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID

/**
 * WhatsApp Cloud API webhook
 *
 * Verification (GET):
 * Meta will call with:
 *  - hub.mode
 *  - hub.verify_token
 *  - hub.challenge
 * We compare hub.verify_token with WHATSAPP_VERIFY_TOKEN and echo hub.challenge when valid.
 *
 * Inbound events (POST):
 * We currently just acknowledge (200) and no-op. Extend here to process messages/statuses.
 */

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN

// Admin command parsing and handling
interface ParsedCommand {
  command: string
  args: Record<string, string>
  rawArgs: string[]
}

function parseAdminCommand(messageText: string): ParsedCommand | null {
  if (!messageText.startsWith('/')) return null

  const parts = messageText.slice(1).split(' ')
  const command = parts[0].toLowerCase()
  const rawArgs = parts.slice(1)

  const args: Record<string, string> = {}

  // Parse key=value pairs
  rawArgs.forEach(arg => {
    const [key, ...valueParts] = arg.split('=')
    if (key && valueParts.length > 0) {
      args[key] = valueParts.join('=')
    }
  })

  return { command, args, rawArgs }
}

async function sendWhatsAppMessage(to: string, message: string): Promise<boolean> {
  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    console.error('[WhatsApp] Missing WhatsApp API credentials')
    return false
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: { body: message }
        })
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.error('[WhatsApp] Failed to send message:', error)
      return false
    }

    console.log('[WhatsApp] Message sent successfully to:', to)
    return true
  } catch (error) {
    console.error('[WhatsApp] Error sending message:', error)
    return false
  }
}

function isAdminPhone(phone: string): boolean {
  // Remove + prefix if present
  const cleanPhone = phone.replace(/^\+/, '')
  return ADMIN_PHONE_NUMBERS.includes(cleanPhone)
}

async function handleAdminCommand(messageText: string, fromPhone: string, supabase: any) {
  const parsed = parseAdminCommand(messageText)
  if (!parsed) return

  console.log('[WhatsApp] Admin command:', parsed.command, parsed.args)

  let response = ''
  let success = true
  let errorMessage = null

  try {
    switch (parsed.command) {
      case 'help':
        response = `🤖 Admin Commands:\n\n📦 Products:\n/add name=<> price=<> [desc=<> category=<>]\n/update <slug> <field>=<value>\n/stock <slug> active|inactive\n/list products [active|all]\n\n📋 Orders:\n/orders [status]\n/order <number>\n/order <number> status=<...>`
        break

      case 'list':
        if (parsed.args.type === 'products') {
          response = await handleListProducts(parsed.args.filter || 'active', supabase)
        } else {
          response = '❌ Use: /list products [active|all]'
          success = false
        }
        break

      case 'add':
        response = await handleAddProduct(parsed.args, supabase)
        break

      case 'update':
        response = await handleUpdateProduct(parsed.rawArgs[0], parsed.args, supabase)
        break

      case 'stock':
        response = await handleStockProduct(parsed.rawArgs[0], parsed.rawArgs[1], supabase)
        break

      case 'orders':
        response = await handleListOrders(parsed.args.status, supabase)
        break

      case 'order':
        const orderNumber = parsed.rawArgs[0]
        if (parsed.args.status) {
          response = await handleUpdateOrderStatus(orderNumber, parsed.args.status, supabase)
        } else {
          response = await handleGetOrder(orderNumber, supabase)
        }
        break

      default:
        response = '❌ Unknown command. Type /help for available commands.'
        success = false
    }
  } catch (error) {
    console.error('[WhatsApp] Error handling command:', error)
    response = '❌ An error occurred while processing your command.'
    success = false
    errorMessage = error instanceof Error ? error.message : 'Unknown error'
  }

  // Log the command attempt
  try {
    await supabase.from('admin_command_logs').insert({
      admin_phone: fromPhone.replace(/^\+/, ''),
      command: parsed.command,
      args: parsed.args,
      success,
      response: response || null,
      error_message: errorMessage
    })
  } catch (logError) {
    console.error('[WhatsApp] Failed to log admin command:', logError)
  }

  if (response) {
    await sendWhatsAppMessage(fromPhone, response)
  }
}

// Product management handlers
async function handleListProducts(filter: string, supabase: any): Promise<string> {
  try {
    let query = supabase.from('products').select('name, slug, price, is_active')

    if (filter === 'active') {
      query = query.eq('is_active', true)
    }

    const { data: products, error } = await query.order('name')

    if (error) throw error

    if (!products || products.length === 0) {
      return `📦 No ${filter} products found.`
    }

    const productList = products.map((p: any, i: number) =>
      `${i + 1}. ${p.name} (${p.slug}) - R${p.price} ${p.is_active ? '✅' : '❌'}`
    ).join('\n')

    return `📦 ${filter.toUpperCase()} PRODUCTS (${products.length}):\n\n${productList}`
  } catch (error) {
    console.error('Error listing products:', error)
    return '❌ Failed to list products.'
  }
}

async function handleAddProduct(args: Record<string, string>, supabase: any): Promise<string> {
  try {
    const { name, price, desc, category } = args

    if (!name || !price) {
      return '❌ Missing required fields. Use: /add name=<name> price=<price> [desc=<desc> category=<slug>]'
    }

    const priceNum = parseFloat(price)
    if (isNaN(priceNum) || priceNum < 0) {
      return '❌ Invalid price. Must be a positive number.'
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

    const { data: product, error } = await supabase
      .from('products')
      .insert({
        name,
        slug,
        description: desc || null,
        price: priceNum,
        category_id: category ? null : null, // TODO: lookup category by slug
        is_active: true,
        display_order: 0
      })
      .select('id, name, slug, price')
      .single()

    if (error) throw error

    return `✅ Product added successfully!\n📦 ${product.name} (${product.slug})\n💰 R${product.price}\n🆔 ${product.id}`
  } catch (error) {
    console.error('Error adding product:', error)
    return '❌ Failed to add product. Check if slug already exists.'
  }
}

async function handleUpdateProduct(slug: string, args: Record<string, string>, supabase: any): Promise<string> {
  try {
    if (!slug) {
      return '❌ Missing product slug. Use: /update <slug> <field>=<value>'
    }

    const updates: Record<string, any> = {}

    for (const [key, value] of Object.entries(args)) {
      switch (key) {
        case 'price':
          const priceNum = parseFloat(value)
          if (isNaN(priceNum) || priceNum < 0) {
            return '❌ Invalid price. Must be a positive number.'
          }
          updates.price = priceNum
          break
        case 'desc':
        case 'description':
          updates.description = value
          break
        case 'name':
          updates.name = value
          break
        case 'image_url':
          updates.image_url = value
          break
        default:
          return `❌ Unknown field: ${key}. Available: name, price, desc, image_url`
      }
    }

    if (Object.keys(updates).length === 0) {
      return '❌ No valid fields to update.'
    }

    const { data: product, error } = await supabase
      .from('products')
      .update(updates)
      .eq('slug', slug)
      .select('id, name, slug, price, description')
      .single()

    if (error) throw error
    if (!product) return '❌ Product not found.'

    return `✅ Product updated!\n📦 ${product.name} (${product.slug})\n💰 R${product.price}\n📝 ${product.description || 'No description'}`
  } catch (error) {
    console.error('Error updating product:', error)
    return '❌ Failed to update product.'
  }
}

async function handleStockProduct(slug: string, status: string, supabase: any): Promise<string> {
  try {
    if (!slug || !status) {
      return '❌ Use: /stock <slug> active|inactive'
    }

    const isActive = status.toLowerCase() === 'active'

    const { data: product, error } = await supabase
      .from('products')
      .update({ is_active: isActive })
      .eq('slug', slug)
      .select('id, name, slug, is_active')
      .single()

    if (error) throw error
    if (!product) return '❌ Product not found.'

    return `✅ Product stock updated!\n📦 ${product.name} (${product.slug})\n${product.is_active ? '✅ ACTIVE' : '❌ INACTIVE'}`
  } catch (error) {
    console.error('Error updating product stock:', error)
    return '❌ Failed to update product stock.'
  }
}

// Order management handlers
async function handleListOrders(status: string, supabase: any): Promise<string> {
  try {
    let query = supabase
      .from('orders')
      .select('order_number, customer_name, total_amount, status, created_at')
      .order('created_at', { ascending: false })
      .limit(10)

    if (status) {
      query = query.eq('status', status)
    }

    const { data: orders, error } = await query

    if (error) throw error

    if (!orders || orders.length === 0) {
      return `📋 No ${status || 'recent'} orders found.`
    }

    const orderList = orders.map((o: any, i: number) => {
      const date = new Date(o.created_at).toLocaleDateString()
      return `${i + 1}. ${o.order_number} - ${o.customer_name} - R${o.total_amount} (${o.status}) - ${date}`
    }).join('\n')

    return `📋 RECENT ORDERS (${orders.length}):\n\n${orderList}\n\nUse /order <number> for details.`
  } catch (error) {
    console.error('Error listing orders:', error)
    return '❌ Failed to list orders.'
  }
}

async function handleGetOrder(orderNumber: string, supabase: any): Promise<string> {
  try {
    if (!orderNumber) {
      return '❌ Missing order number. Use: /order <number>'
    }

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          product_name,
          product_price,
          quantity,
          total_price
        )
      `)
      .eq('order_number', orderNumber)
      .single()

    if (error) throw error
    if (!order) return '❌ Order not found.'

    const date = new Date(order.created_at).toLocaleString()
    const items = order.order_items.map((item: any, i: number) =>
      `${i + 1}. ${item.product_name} - ${item.quantity}x R${item.product_price} = R${item.total_price}`
    ).join('\n')

    return `📋 ORDER ${order.order_number}\n\n👤 ${order.customer_name}\n📞 ${order.customer_phone}\n📧 ${order.customer_email || 'N/A'}\n📍 ${order.delivery_address}\n📝 ${order.special_instructions || 'N/A'}\n\n🛒 ITEMS:\n${items}\n\n💰 TOTAL: R${order.total_amount}\n📊 STATUS: ${order.status.toUpperCase()}\n📅 ${date}`
  } catch (error) {
    console.error('Error getting order:', error)
    return '❌ Failed to get order details.'
  }
}

async function handleUpdateOrderStatus(orderNumber: string, newStatus: string, supabase: any): Promise<string> {
  try {
    if (!orderNumber || !newStatus) {
      return '❌ Use: /order <number> status=<pending|confirmed|preparing|ready|delivered|cancelled>'
    }

    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']
    if (!validStatuses.includes(newStatus.toLowerCase())) {
      return `❌ Invalid status. Use: ${validStatuses.join('|')}`
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update({ status: newStatus.toLowerCase() })
      .eq('order_number', orderNumber)
      .select('order_number, customer_name, status')
      .single()

    if (error) throw error
    if (!order) return '❌ Order not found.'

    return `✅ Order status updated!\n📋 ${order.order_number} - ${order.customer_name}\n📊 Status: ${order.status.toUpperCase()}`
  } catch (error) {
    console.error('Error updating order status:', error)
    return '❌ Failed to update order status.'
  }
}

// GET: webhook verification
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (!VERIFY_TOKEN) {
    console.error('WHATSAPP_VERIFY_TOKEN is not set')
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  }

  if (mode === 'subscribe' && token === VERIFY_TOKEN && challenge) {
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

// POST: inbound webhook events
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('[WhatsApp] Incoming webhook body:', JSON.stringify(body, null, 2))

    const entry = body?.entry?.[0]
    if (!entry) {
      console.warn('[WhatsApp] No entry found in webhook')
    }
    const change = entry?.changes?.[0]
    if (!change) {
      console.warn('[WhatsApp] No change found in entry')
    }
    const value = change?.value
    if (!value) {
      console.warn('[WhatsApp] No value found in change')
    }
    const message = value?.messages?.[0]
    if (!message) {
      console.warn('[WhatsApp] No message found in value')
    }
    const contact = value?.contacts?.[0]
    if (!contact) {
      console.warn('[WhatsApp] No contact found in value')
    }

    if (message) {
      console.log('[WhatsApp] Processing message ID:', message.id)
      const wa_to =
        value?.metadata?.display_phone_number ??
        value?.metadata?.phone_number_id ??
        null
      const profile_name = contact?.profile?.name ?? null
      const message_type = message.type ?? null
      const message_text = message.text?.body ?? null
      const from_phone = message.from

      console.log('[WhatsApp] Message Details:', {
        id: message.id,
        from: from_phone,
        to: wa_to,
        profile_name,
        message_type,
        message_text,
      })

      const supabase = createServerClient()
      const { error: insertError } = await supabase
        .from('whatsapp_messages')
        .insert({
          wa_message_id: message.id ?? null,
          wa_from: from_phone ?? null,
          wa_to,
          profile_name,
          message_type,
          message_text,
          raw: body,
        })

      if (insertError) {
        console.error('[WhatsApp] Failed to store WhatsApp message', insertError)
      } else {
        console.log('[WhatsApp] WhatsApp message stored successfully')
      }

      // Handle admin commands
      if (message_text && from_phone && isAdminPhone(from_phone)) {
        console.log('[WhatsApp] Processing admin command from:', from_phone)
        await handleAdminCommand(message_text, from_phone, supabase)
      } else if (message_text && from_phone && message_text.startsWith('/')) {
        // Non-admin trying to use commands
        await sendWhatsAppMessage(from_phone, '❌ Sorry, you are not authorized to use admin commands.')
      }
    }

    // Log in non-prod for visibility
    if (process.env.NODE_ENV !== 'production') {
      console.log('[WhatsApp] WhatsApp webhook received (non-prod)')
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('[WhatsApp] Failed to handle WhatsApp webhook', error)
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
  }
}
