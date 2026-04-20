import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export const runtime = 'nodejs'

interface SanityWebhookBody {
  _type?: string
  slug?: { current?: string }
}

function verifySignature(body: string, signature: string, secret: string): boolean {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(`sha256=${expected}`)
    )
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET

  if (!secret) {
    console.error('SANITY_WEBHOOK_SECRET not configured')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  const signature = req.headers.get('sanity-webhook-signature') || ''
  const body = await req.text()

  // Verify signature
  if (!verifySignature(body, signature, secret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let payload: SanityWebhookBody
  try {
    payload = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Only handle post documents
  if (payload._type !== 'post') {
    return NextResponse.json({ message: 'Not a post, skipping' }, { status: 200 })
  }

  const slug = payload.slug?.current
  if (!slug) {
    return NextResponse.json({ error: 'No slug in payload' }, { status: 400 })
  }

  // Call TTS generation API
  try {
    const ttsResponse = await fetch(new URL('/api/generate-audio', req.url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug })
    })

    if (!ttsResponse.ok) {
      const error = await ttsResponse.text()
      console.error('TTS generation failed:', error)
      return NextResponse.json({ error: 'TTS generation failed' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Audio generated successfully' }, { status: 200 })
  } catch (err) {
    console.error('Webhook processing error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
