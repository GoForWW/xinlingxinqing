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
