import { NextRequest, NextResponse } from 'next/server'
import { client, writeClient, uploadAsset } from '@/lib/sanity'

export const runtime = 'nodejs'

// MiniMax async TTS API base
const MINIMAX_API_BASE = 'https://api.minimaxi.com'
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY!
const MAX_POLL_WAIT_MS = 60_000
const POLL_INTERVAL_MS = 3_000

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

// Poll MiniMax async task until status is 'Success' or 'failed'
async function waitForAsyncTask(taskId: string): Promise<{ fileId: string }> {
  const start = Date.now()
  while (Date.now() - start < MAX_POLL_WAIT_MS) {
    const res = await fetch(
      `${MINIMAX_API_BASE}/v1/query/t2a_async_query_v2?task_id=${taskId}`,
      {
        headers: { Authorization: `Bearer ${MINIMAX_API_KEY}` },
        signal: AbortSignal.timeout(15000),
      }
    )
    if (!res.ok) {
      throw new Error(`Polling failed: HTTP ${res.status}`)
    }
    const json = await res.json()
    if (json.status === 'Success') {
      return { fileId: json.file_id }
    }
    if (json.status === 'failed' || json.status === 'expired') {
      throw new Error(`Async task ${json.status}: ${JSON.stringify(json)}`)
    }
    // Still processing — wait before next poll
    await new Promise(r => setTimeout(r, POLL_INTERVAL_MS))
  }
  throw new Error(`Timeout waiting for async task ${taskId} after ${MAX_POLL_WAIT_MS}ms`)
}

// Download audio from MiniMax async API (returns tar archive containing the MP3)
async function downloadFromMinimax(fileId: string): Promise<Buffer> {
  const res = await fetch(
    `${MINIMAX_API_BASE}/v1/files/retrieve_content?file_id=${fileId}`,
    {
      headers: { Authorization: `Bearer ${MINIMAX_API_KEY}` },
      signal: AbortSignal.timeout(30000),
    }
  )
  if (!res.ok) {
    throw new Error(`Failed to download audio: HTTP ${res.status}`)
  }
  const chunks: Buffer[] = []
  const reader = res.body?.getReader()
  if (!reader) throw new Error('No response body')
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(Buffer.from(value))
  }
  const tarBuffer = Buffer.concat(chunks)
  // Parse tar archive — MiniMax returns a tar with one MP3 file
  // Tar format: 512-byte header blocks + data blocks, null-terminated at end with 2 empty blocks
  const CHUNK_SIZE = 512
  let offset = 0
  while (offset + CHUNK_SIZE <= tarBuffer.length) {
    const header = tarBuffer.slice(offset, offset + CHUNK_SIZE)
    if (header[0] === 0) break // End of tar (null block)
    // Parse tar header fields (octal)
    const name = header.slice(0, 100).toString('ascii').replace(/\0.*/, '')
    const sizeOctal = header.slice(124, 124 + 12).toString('ascii').trim()
    const fileSize = parseInt(sizeOctal, 8)
    if (name.endsWith('.mp3') && fileSize > 0) {
      const dataOffset = offset + CHUNK_SIZE
      return tarBuffer.slice(dataOffset, dataOffset + fileSize)
    }
    offset += CHUNK_SIZE + Math.ceil(fileSize / CHUNK_SIZE) * CHUNK_SIZE
  }
  throw new Error('Could not find MP3 file in MiniMax tar archive')
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

    // 4. Create async TTS task
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
      const errText = await createRes.text()
      return NextResponse.json(
        { error: `MiniMax async TTS HTTP error: ${createRes.status}`, detail: errText },
        { status: 500 }
      )
    }

    const createJson = await createRes.json()
    if (createJson.base_resp?.status_code !== 0) {
      return NextResponse.json(
        {
          error: 'MiniMax async task creation failed',
          detail: createJson.base_resp?.status_msg || JSON.stringify(createJson),
        },
        { status: 500 }
      )
    }

    const taskId = String(createJson.task_id)

    // 5. Poll until audio is ready
    const { fileId } = await waitForAsyncTask(taskId)

    // 6. Download the audio (wrapped in tar archive)
    const audioBuffer = await downloadFromMinimax(fileId)

    // 7. Upload to Sanity
    const safeSlug = slug.replace(/[^a-z0-9-]/gi, '_')
    const audioRef = await uploadAsset(
      audioBuffer,
      `${safeSlug}-audio.mp3`,
      'audio/mpeg'
    )

    // 8. Update post with audio reference
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
    return NextResponse.json({ error: 'TTS generation failed', detail: err.message }, { status: 500 })
  }
}
