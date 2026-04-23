/**
 * Backfill TTS audio for existing blog posts
 * Usage: npx tsx scripts/tts/backfill_audio.ts
 */

import { client, writeClient, uploadAsset } from '../../src/lib/sanity'

const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY
const MINIMAX_API_BASE = 'https://api.minimaxi.com'

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

// Poll MiniMax async task until status is 'Success' or 'failed'
async function waitForAsyncTask(taskId: string): Promise<{ fileId: string }> {
  const MAX_WAIT = 60_000
  const INTERVAL = 3_000
  const start = Date.now()
  while (Date.now() - start < MAX_WAIT) {
    const res = await fetch(
      `${MINIMAX_API_BASE}/v1/query/t2a_async_query_v2?task_id=${taskId}`,
      {
        headers: { Authorization: `Bearer ${MINIMAX_API_KEY}` },
        signal: AbortSignal.timeout(15000),
      }
    )
    if (!res.ok) throw new Error(`Poll HTTP ${res.status}`)
    const json = await res.json()
    if (json.status === 'Success') return { fileId: json.file_id }
    if (json.status === 'failed' || json.status === 'expired') {
      throw new Error(`Task ${json.status}: ${JSON.stringify(json)}`)
    }
    process.stdout.write('.')
    await new Promise(r => setTimeout(r, INTERVAL))
  }
  throw new Error(`Timeout after ${MAX_WAIT}ms for task ${taskId}`)
}

// Download audio from MiniMax (returns tar archive containing the MP3)
async function downloadFromMinimax(fileId: string): Promise<Buffer> {
  const res = await fetch(
    `${MINIMAX_API_BASE}/v1/files/retrieve_content?file_id=${fileId}`,
    {
      headers: { Authorization: `Bearer ${MINIMAX_API_KEY}` },
      signal: AbortSignal.timeout(30000),
    }
  )
  if (!res.ok) throw new Error(`Download HTTP ${res.status}`)
  const chunks: Buffer[] = []
  const reader = res.body!.getReader()
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(Buffer.from(value))
  }
  const tarBuffer = Buffer.concat(chunks)
  // Parse tar — look for first .mp3 entry
  const BLOCK = 512
  let off = 0
  while (off + BLOCK <= tarBuffer.length) {
    const hdr = tarBuffer.slice(off, off + BLOCK)
    if (hdr[0] === 0) break // end of tar
    const name = hdr.slice(0, 100).toString('ascii').replace(/\0.*/, '')
    const sizeOctal = hdr.slice(124, 136).toString('ascii').trim()
    const fileSize = parseInt(sizeOctal, 8)
    if (name.endsWith('.mp3') && fileSize > 0) {
      return tarBuffer.slice(off + BLOCK, off + BLOCK + fileSize)
    }
    off += BLOCK + Math.ceil(fileSize / BLOCK) * BLOCK
  }
  throw new Error('MP3 not found in tar archive')
}

async function generateTTS(text: string): Promise<Buffer> {
  // 1. Create async task
  const createRes = await fetch(`${MINIMAX_API_BASE}/v1/t2a_async_v2`, {
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
        speed: 1.0,
        pitch: 0,
        volume: 1.0,
      },
      audio_setting: {
        format: 'mp3',
        sample_rate: 32000,
        bitrate: 128000,
        channels: 1,
      },
    }),
    signal: AbortSignal.timeout(15000),
  })

  if (!createRes.ok) {
    const err = await createRes.text()
    throw new Error(`Task creation HTTP ${createRes.status}: ${err}`)
  }

  const createJson = await createRes.json()
  if (createJson.base_resp?.status_code !== 0) {
    throw new Error(`Task creation failed: ${createJson.base_resp?.status_msg}`)
  }

  const taskId = String(createJson.task_id)
  process.stdout.write(` [task=${taskId} waiting`)

  // 2. Poll until ready
  const { fileId } = await waitForAsyncTask(taskId)
  process.stdout.write(' done]\n')

  // 3. Download audio
  return downloadFromMinimax(fileId)
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