import { client, queries } from './sanity'
import type { Post, Category } from './types'

export async function getAllPosts(): Promise<Post[]> {
  return client.fetch(queries.allPosts)
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return client.fetch(queries.postBySlug, { slug })
}

export async function getAllCategories(): Promise<Category[]> {
  return client.fetch(queries.allCategories)
}

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  return client.fetch(queries.postsByCategory, { categorySlug })
}

export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await client.fetch<{ slug: { current: string } }[]>(
    `*[_type == "post"]{ slug }`
  )
  return posts.map((post) => post.slug.current)
}

export async function getRelatedPosts(currentSlug: string, categoryIds: string[], limit = 3): Promise<any[]> {
  return client.fetch(
    `*[_type == "post" && slug.current != $currentSlug && count((categories[]._ref)[@ in $categoryIds]) > 0][0...$limit]{
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      mainImage,
      categories
    }`,
    { currentSlug, categoryIds, limit }
  )
}

export async function getAdjacentPosts(slug: string): Promise<{ prev: any | null; next: any | null }> {
  const allSlugs = await client.fetch<{slug: string}[]>(
    `*[_type == "post"] | order(publishedAt desc) { "slug": slug.current }`
  )
  const slugList = allSlugs.map((s) => s.slug)
  const currentIndex = slugList.indexOf(slug)

  const prevSlug = currentIndex < slugList.length - 1 ? slugList[currentIndex + 1] : null
  const nextSlug = currentIndex > 0 ? slugList[currentIndex - 1] : null


  const [prev, next] = await Promise.all([
    prevSlug ? client.fetch(`*[_type == "post" && slug.current == $slug][0]{ _id, title, slug, mainImage }`, { slug: prevSlug }) : null,
    nextSlug ? client.fetch(`*[_type == "post" && slug.current == $slug][0]{ _id, title, slug, mainImage }`, { slug: nextSlug }) : null,
  ])

  return { prev, next }
}
