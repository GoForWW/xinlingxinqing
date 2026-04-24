/**
 * Backfill background music for existing blog posts
 * Usage: npx tsx scripts/tts/backfill_music.ts
 */

import { client, writeClient, uploadAsset } from '../../src/lib/sanity'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY
const MINIMAX_API_BASE = 'https://api.minimaxi.com'

interface SanityPost {
  _id: string
  _rev: string
  title: string
  slug: { current: string }
  body: any[]
}

// Extract meaningful text from post for music prompt generation
function extractPromptText(body: any[]): string {
  if (!body) return ''
  const text = body
    .filter((block: any) => block._type === 'block')
    .map((block: any) =>
      (block.children || [])
        .map((child: any) => child.text || '')
        .join('')
    )
    .join('\n\n')

  // Return first 2000 chars for prompt - we just need keywords/themes
  return text.slice(0, 2000).trim()
}

// Generate a music prompt from post content
function generateMusicPrompt(title: string, text: string): { prompt: string; genre: string; mood: string } {
  // Detect language and themes
  const chineseCharCount = (text.match(/[\u4e00-\u9fff]/g) || []).length
  const totalChars = text.replace(/\s/g, '').length
  const chineseRatio = totalChars > 0 ? chineseCharCount / totalChars : 0

  // Extract key themes from title and first paragraph
  const firstParagraph = text.split('\n')[0] || ''
  const themes = [
    ...title.split(/[,，、。.!！?？]/).filter(w => w.trim().length > 1),
    ...firstParagraph.split(/[,，、。.!！?？]/).filter(w => w.trim().length > 1),
  ].slice(0, 5)

  // Determine genre based on content
  let genre = 'ambient'
  let mood = 'calm'

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

  // Build prompt
  const langBoost = chineseRatio > 0.3 ? 'Chinese style, ' : ''
  const themeText = themes.join(', ')
  const prompt = `${langBoost}${themeText || title}, ${genre}, ${mood} mood, instrumental, background music`

  return { prompt, genre, mood }
}

// Generate music using MiniMax synchronous API
async function generateMusic(prompt: string, model: string = 'music-2.6'): Promise<Buffer> {
  const payload = {
    model,
    prompt,
    output_format: 'url',
    lyrics: '[intro]', // instrumental workaround
    audio_setting: {
      format: 'mp3',
      sample_rate: 44100,
      bitrate: 256000,
    },
  }

  console.log(`  🎵 Prompt: ${prompt.slice(0, 80)}...`)

  const createRes = await fetch(`${MINIMAX_API_BASE}/v1/music_generation`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${MINIMAX_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(300000), // 5 min timeout
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
    throw new Error(`Unexpected response: status=${json.data?.status}, hasAudio=${!!json.data?.audio}, base_resp=${JSON.stringify(json.base_resp)}`)
  }

  const audioUrl = json.data.audio
  console.log(`  ✅ Generated (${json.extra_info?.music_duration ? Math.round(json.extra_info.music_duration / 1000) + 's' : 'unknown duration'})`)

  // Download the audio from the URL (API returns final URL directly)
  const audioRes = await fetch(audioUrl, {
    signal: AbortSignal.timeout(120000),
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

async function backfill() {
  if (!MINIMAX_API_KEY) {
    console.error('MINIMAX_API_KEY not set')
    process.exit(1)
  }

  console.log('Fetching posts without music...\n')

  const posts = await client.fetch<SanityPost[]>(`
    *[_type == "post" && !defined(music.asset)] {
      _id,
      _rev,
      title,
      slug,
      body
    }
  `)

  console.log(`Found ${posts.length} post(s) without music\n`)

  if (posts.length === 0) {
    console.log('✅ All posts already have music!')
    return
  }

  let generated = 0
  let skipped = 0
  let failed = 0

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i]
    const slug = post.slug?.current || post._id
    console.log(`[${i + 1}/${posts.length}] Processing: ${post.title}`)

    const text = extractPromptText(post.body)
    if (!text || !text.trim()) {
      console.log('  ⏭️  No text content, skipping')
      skipped++
      continue
    }

    const { prompt, genre, mood } = generateMusicPrompt(post.title, text)
    console.log(`  🎼 Genre: ${genre}, Mood: ${mood}`)

    try {
      console.log('  🎶 Generating music...')
      const musicBuffer = await generateMusic(prompt)

      console.log(`  📤 Uploading to Sanity (${Math.round(musicBuffer.length / 1024)}KB)...`)
      const safeSlug = slug.replace(/[^a-z0-9-]/gi, '_')
      const musicRef = await uploadAsset(
        musicBuffer,
        `${safeSlug}-music.mp3`,
        'audio/mpeg'
      )

      console.log('  🔗 Patching post with music reference...')
      await writeClient.patch(post._id).set({
        music: {
          _type: 'file',
          asset: musicRef,
        },
      }).commit()

      console.log('  ✅ Done!')
      generated++
    } catch (err) {
      console.error(`  ❌ Error: ${err instanceof Error ? err.message : err}`)
      failed++
    }

    // Small delay between posts to avoid API rate limiting
    if (i < posts.length - 1) {
      await new Promise(r => setTimeout(r, 2000))
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('📊 Summary:')
  console.log(`   Total posts checked: ${posts.length}`)
  console.log(`   Music generated:     ${generated}`)
  console.log(`   Skipped (no text):   ${skipped}`)
  console.log(`   Failed:              ${failed}`)
  console.log('='.repeat(50))
}

backfill().catch(console.error)
