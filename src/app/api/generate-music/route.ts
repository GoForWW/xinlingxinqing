import { NextRequest, NextResponse } from 'next/server'
import { client, writeClient, uploadAsset } from '@/lib/sanity'

export const runtime = 'nodejs'

// MiniMax music generation API
const MINIMAX_API_BASE = 'https://api.minimaxi.com'
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY!

// Extract meaningful text from body for music prompt generation
function extractPromptText(body: any[]): string {
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

// Generate music prompt from post content
function generateMusicPrompt(title: string, text: string): string {
  // Detect Chinese content ratio
  const chineseCharCount = (text.match(/[\u4e00-\u9fff]/g) || []).length
  const totalChars = text.replace(/\s/g, '').length
  const chineseRatio = totalChars > 0 ? chineseCharCount / totalChars : 0

  // Extract key themes from title
  const themes = title
    .split(/[,，、。.!！?？]/)
    .filter((w) => w.trim().length > 1)
    .slice(0, 5)

  // Detect mood from content
  let mood = 'calm'
  let genre = 'ambient'

  const lowerText = text.toLowerCase()
  if (lowerText.includes('happy') || lowerText.includes('joy') || lowerText.includes('快樂') || lowerText.includes('幸福')) {
    mood = 'warm'
    genre = 'pop'
  }
  if (lowerText.includes('sad') || lowerText.includes('lonely') || lowerText.includes('孤獨') || lowerText.includes('悲傷')) {
    mood = 'melancholic'
    genre = 'acoustic'
  }
  if (lowerText.includes('nature') || lowerText.includes('peace') || lowerText.includes('自然') || lowerText.includes('平靜')) {
    mood = 'serene'
    genre = 'ambient'
  }
  if (lowerText.includes('work') || lowerText.includes('career') || lowerText.includes('工作') || lowerText.includes('事業')) {
    mood = 'focused'
    genre = 'instrumental'
  }

  const langBoost = chineseRatio > 0.3 ? 'Chinese style, ' : ''
  const themeText = themes.join(', ')
  return `${langBoost}${themeText || title}, ${genre}, ${mood} mood, purely instrumental, no vocals, no singing, background music`
}

// Generate and download music from MiniMax
async function generateMusic(prompt: string): Promise<Buffer> {
  const payload = {
    model: 'music-2.6',
    prompt,
    output_format: 'url',
    is_instrumental: true,
    lyrics: '',
    audio_setting: {
      format: 'mp3',
      sample_rate: 44100,
      bitrate: 256000,
    },
  }

  const createRes = await fetch(`${MINIMAX_API_BASE}/v1/music_generation`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${MINIMAX_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(300_000), // 5 min timeout
  })

  if (!createRes.ok) {
    const err = await createRes.text()
    throw new Error(`Music generation HTTP ${createRes.status}: ${err}`)
  }

  const json = await createRes.json()
  if (json.base_resp?.status_code !== 0) {
    throw new Error(`Music generation failed: ${json.base_resp?.status_msg}`)
  }

  if (json.data?.status !== 2 || !json.data?.audio) {
    throw new Error(`Unexpected response: status=${json.data?.status}, hasAudio=${!!json.data?.audio}`)
  }

  const audioUrl = json.data.audio

  // Download the audio from the returned URL
  const audioRes = await fetch(audioUrl, {
    signal: AbortSignal.timeout(120_000),
  })

  if (!audioRes.ok) {
    throw new Error(`Download audio HTTP ${audioRes.status}`)
  }

  const chunks: Buffer[] = []
  const reader = audioRes.body!.getReader()
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(Buffer.from(value))
  }

  return Buffer.concat(chunks)
}

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json()

    // 1. Fetch post by slug
    const post = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0]{ _id, title, body, music }`,
      { slug }
    )

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // 2. Skip if music already exists
    if (post.music?.asset?._ref) {
      return NextResponse.json({
        success: true,
        message: 'Music already exists',
        musicRef: post.music.asset._ref,
      })
    }

    // 3. Extract text from body for prompt
    const text = extractPromptText(post.body)
    if (!text.trim()) {
      return NextResponse.json({ error: 'No text content in post body' }, { status: 400 })
    }

    // 4. Generate music prompt
    const prompt = generateMusicPrompt(post.title, text)

    // 5. Generate music via MiniMax
    const musicBuffer = await generateMusic(prompt)

    // 6. Upload to Sanity (music field)
    const safeSlug = slug.replace(/[^a-z0-9-]/gi, '_')
    const musicRef = await uploadAsset(
      musicBuffer,
      `${safeSlug}-music.mp3`,
      'audio/mpeg'
    )

    // 7. Update post with music reference
    await writeClient.patch(post._id).set({
      music: {
        _type: 'file',
        asset: musicRef,
      },
    }).commit()

    return NextResponse.json({
      success: true,
      musicRef: musicRef._ref,
      size: musicBuffer.length,
    })
  } catch (err: any) {
    console.error('generate-music error:', err)
    return NextResponse.json({ error: 'Music generation failed', detail: err.message }, { status: 500 })
  }
}
