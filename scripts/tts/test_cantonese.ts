import { createClient } from '@sanity/client'
import fetch from 'node-fetch'
import { Buffer } from 'buffer'

const client = createClient({
  projectId: 'vvnk3r5p',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
})

async function testTTS(text: string) {
  const response = await fetch('https://api.minimaxi.com/v1/t2a_v2', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.MINIMAX_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'speech-2.8-hd',
      text,
      voice_setting: { voice_id: 'female-shaonv' },
      audio_setting: { format: 'mp3', sample_rate: 32000 }
    }),
    signal: AbortSignal.timeout(60000)
  })

  const rawBuffer = Buffer.from(await response.arrayBuffer())
  console.log(`Text: "${text}"`)
  console.log('Status:', response.status)
  console.log('Content-Type:', response.headers.get('content-type'))
  console.log('Size:', rawBuffer.length)
  if (rawBuffer.length < 1024) {
    console.log('Raw:', rawBuffer.toString('utf8').slice(0, 300))
  } else {
    console.log('Looks like real audio data')
  }
}

async function main() {
  // Test the 5 posts with no audio
  const posts = await client.fetch<any[]>(`
    *[_type == "post" && !defined(audio.asset)] | order(publishedAt desc) {
      title,
      "slug": slug.current,
      "text": pt::text(body)
    }
  `)

  console.log('Testing TTS for', posts.length, 'posts...\n')

  for (const post of posts) {
    await testTTS(post.text)
    console.log('---')
  }
}

main().catch(console.error)