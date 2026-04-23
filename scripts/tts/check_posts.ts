import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'vvnk3r5p',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

async function main() {
  const posts = await client.fetch<any[]>(`
    *[_type == "post" && !defined(audio.asset)] | order(publishedAt desc) {
      title,
      "slug": slug.current,
      "charCount": length(pt::text(body))
    }
  `)
  console.log(JSON.stringify(posts, null, 2))
}

main().catch(console.error)
