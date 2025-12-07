import { NextRequest, NextResponse } from 'next/server'

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

    // TODO: add business logic for messages/statuses. For now, just log minimal info.
    if (process.env.NODE_ENV !== 'production') {
      console.log('WhatsApp webhook received', JSON.stringify(body, null, 2))
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('Failed to handle WhatsApp webhook', error)
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
  }
}
