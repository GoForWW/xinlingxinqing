import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any

// Lucas's Sanity project
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'vvnk3r5p'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = '2024-01-01'

// Read-only client (for frontend)
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

// Write client (for API routes / admin) - requires token
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

// Image URL builder
const builder = createImageUrlBuilder({ projectId, dataset })

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// GROQ Queries
export const queries = {
  allPosts: `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    "categories": categories[]->{ _id, title, slug },
    "tags": tags,
    "author": author->{ name, image }
  }`,

  postBySlug: `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    body,
    audio,
    music,
    "categories": categories[]->{ _id, title, slug },
    "tags": tags,
    "author": author->{ name, image, bio }
  }`,

  allCategories: `*[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description
  }`,

  postsByCategory: `*[_type == "post" && $categorySlug in categories[]->slug.current] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    "categories": categories[]->{ _id, title, slug },
    "tags": tags
  }`,
}

/**
 * Upload a file buffer to Sanity as a managed asset.
 * Returns the Sanity asset reference like { _ref: "file-xxxx-xxxx-xxxx", _type: "reference" }
 */
export async function uploadAsset(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<{ _ref: string; _type: 'reference' }> {
  try {
    const asset = await writeClient.assets.upload('file', buffer, {
      filename,
      contentType,
    })
    return {
      _ref: asset._id,
      _type: 'reference',
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    throw err
  }
}
