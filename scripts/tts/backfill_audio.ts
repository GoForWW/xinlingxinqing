/**
 * Backfill TTS audio for existing blog posts
 * Usage: npx tsx scripts/tts/backfill_audio.ts
 */

import { client, writeClient, uploadAsset } from '../src/lib/sanity'

const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY
const MINIMAX_API_BASE = 'https://api.minimaxi.com/v1'

interface SanityPost {
  _id: string
  _rev: string
  title: string
  slug: { current: string }
  body: any[]
}

// Extract plain text from Sanity body blocks (same logic as /api/generate-audio)
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

async function generateTTS(text: string): Promise<Buffer> {
  const response = await fetch(`${MINIMAX_API_BASE}/t2a_v2`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${MINIMAX_API_KEY}`,
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

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`MiniMax TTS API error: ${response.status} - ${error}`)
  }

  const buffer = await response.arrayBuffer()
  return Buffer.from(buffer)
}

async function backfill() {
  if (!MINIMAX_API_KEY) {
    console.error('MINIMAX_API_KEY not set')
    process.exit(1)
  }

  console.log('Fetching posts without audio...\n')

  const posts = await client.fetch<SanityPost[]>(`
    *[_type == "post" && !defined(audio.asset)] {
      _id,
      _rev,
      title,
      slug,
      body
    }
  `)

  console.log(`Found ${posts.length} post(s) without audio\n`)

  if (posts.length === 0) {
    console.log('✅ All posts already have audio!')
    return
  }

  let generated = 0
  let skipped = 0
  let failed = 0

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i]
    const slug = post.slug?.current || post._id
    console.log(`[${i + 1}/${posts.length}] Processing: ${post.title}`)

    const text = extractText(post.body)
    if (!text || !text.trim()) {
      console.log('  ⏭️  No text content, skipping')
      skipped++
      continue
    }

    // MiniMax TTS limit is ~5000 chars (same as generate-audio route)
    const truncatedText = text.length > 5000 ? text.slice(0, 5000) : text
    if (text.length > 5000) {
      console.log(`  📄 Text truncated from ${text.length} to 5000 chars`)
    }

    try {
      console.log('  🎙️  Generating TTS...')
      const audioBuffer = await generateTTS(truncatedText)

      console.log('  📤 Uploading to Sanity...')
      const safeSlug = slug.replace(/[^a-z0-9-]/gi, '_')
      const audioRef = await uploadAsset(
        audioBuffer,
        `${safeSlug}-audio.mp3`,
        'audio/mpeg'
      )

      console.log('  🔗 Patching post with audio reference...')
      await writeClient.patch(post._id).set({
        audio: {
          _type: 'file',
          asset: audioRef,
        },
      }).commit()

      console.log('  ✅ Done!')
      generated++
    } catch (err) {
      console.error(`  ❌ Error: ${err instanceof Error ? err.message : err}`)
      failed++
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('📊 Summary:')
  console.log(`   Total posts checked: ${posts.length}`)
  console.log(`   Audio generated:     ${generated}`)
  console.log(`   Skipped (no text):   ${skipped}`)
  console.log(`   Failed:              ${failed}`)
  console.log('='.repeat(50))
}

backfill().catch(console.error)