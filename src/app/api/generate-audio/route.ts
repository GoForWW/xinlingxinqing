import { NextRequest, NextResponse } from 'next/server'
import { client, writeClient, uploadAsset } from '@/lib/sanity'

export const runtime = 'nodejs'

// Extract plain text from Sanity body blocks
function extractText(body: any[]): string {
  if (!body) return ''
  return body
    .filter((block: any) => block._type === 'block')
    .map((block: any) =>
      (block.children || [])
        .map((child: any) => child.text || '')
        .join('')
    )
    .join('\n\n')
}

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json()

    // 1. Fetch post by slug
    const post = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0]{ _id, title, body, audio }`,
      { slug }
    )

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // 2. Skip if audio already exists
    if (post.audio?.asset?._ref) {
      return NextResponse.json({
        success: true,
        message: 'Audio already exists',
        audioRef: post.audio.asset._ref,
      })
    }

    // 3. Extract text from body
    const text = extractText(post.body)
    if (!text.trim()) {
      return NextResponse.json({ error: 'No text content in post body' }, { status: 400 })
    }

    // 3b. Validate text length (MiniMax TTS limit ~5000 chars)
    if (text.length > 5000) {
      return NextResponse.json(
        { error: 'Text too long for TTS generation (max 5000 characters)' },
        { status: 400 }
      )
    }

    // 4. Call MiniMax TTS API
    const ttsRes = await fetch('https://api.minimaxi.com/v1/t2a_v2', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.MINIMAX_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'speech-2.8-hd',
        text,
        voice_setting: {
          voice_id: 'female-shaonv',
        },
        audio_setting: {
          format: 'mp3',
          sample_rate: 32000,
        },
      }),
      signal: AbortSignal.timeout(60000),
    })

    if (!ttsRes.ok) {
      const errText = await ttsRes.text()
      return NextResponse.json(
        { error: `MiniMax TTS HTTP error: ${ttsRes.status}`, detail: errText },
        { status: 500 }
      )
    }

    // 5. Parse JSON response — MiniMax returns {"data": {"audio": "<base64>"}}
    let audioBuffer: Buffer
    try {
      const json = await ttsRes.json()
      if (!json.data?.audio) {
        throw new Error(`No audio data in response: ${JSON.stringify(json).slice(0, 200)}`)
      }
      audioBuffer = Buffer.from(json.data.audio, 'base64')
    } catch (err: any) {
      // Fallback: try raw buffer if response wasn't JSON
      const rawBuffer = Buffer.from(await ttsRes.arrayBuffer())
      if (rawBuffer.length < 1024) {
        return NextResponse.json(
          { error: 'TTS response too small or unparseable', detail: err?.message },
          { status: 500 }
        )
      }
      audioBuffer = rawBuffer
    }

    // 6. Upload to Sanity
    const safeSlug = slug.replace(/[^a-z0-9-]/gi, '_')
    const audioRef = await uploadAsset(
      audioBuffer,
      `${safeSlug}-audio.mp3`,
      'audio/mpeg'
    )

    // 7. Update post with audio reference
    await writeClient.patch(post._id).set({
      audio: {
        _type: 'file',
        asset: audioRef,
      },
    }).commit()

    return NextResponse.json({
      success: true,
      audioRef: audioRef._ref,
      size: audioBuffer.length,
    })
  } catch (err: any) {
    console.error('generate-audio error:', err)
    return NextResponse.json({ error: 'TTS generation failed' }, { status: 500 })
  }
}
