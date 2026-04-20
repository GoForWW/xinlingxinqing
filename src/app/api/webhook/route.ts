import { NextRequest, NextResponse } from 'next/server'
import { assertValidRequest } from '@sanity/webhook'

const SECRET = process.env.SANITY_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  if (!SECRET) {
    console.error('SANITY_WEBHOOK_SECRET not configured')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  const body = await req.text()

  try {
    // This validates the request signature using Sanity's official toolkit
    await assertValidRequest({ headers: req.headers as unknown as Record<string, string | string[] | undefined>, body }, SECRET)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature'
    console.error('Webhook signature verification failed:', message)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let payload
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
