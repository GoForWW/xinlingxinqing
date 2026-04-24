import { writeClient, uploadAsset } from './src/lib/sanity.ts'
import * as fs from 'fs'

const apiKey = process.env.MINIMAX_API_KEY
if (!apiKey) { console.error('MINIMAX_API_KEY missing'); process.exit(1) }

const res = await fetch('https://api.minimaxi.com/v1/music_generation', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'music-2.6',
    prompt: 'piano ambient calm',
    output_format: 'url',
    lyrics: '[intro]',
    audio_setting: { format: 'mp3' }
  }),
  signal: AbortSignal.timeout(120000)
})

const json = await res.json()
console.log('base_resp.status_code:', json.base_resp?.status_code)
console.log('status:', json.status)
console.log('has audio:', !!json.data?.audio)
console.log('full response:', JSON.stringify(json).slice(0, 200))
