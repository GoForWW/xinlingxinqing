import fetch from 'node-fetch'

const text = '拖延係人都會，但你可以唔洗'

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
console.log('Status:', response.status)
console.log('Content-Type:', response.headers.get('content-type'))
console.log('Size:', rawBuffer.length)
console.log('Raw:', rawBuffer.toString('utf8'))
