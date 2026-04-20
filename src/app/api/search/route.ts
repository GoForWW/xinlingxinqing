import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/api'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.toLowerCase() || ''

  if (!query || query.length < 2) {
    return NextResponse.json([])
  }

  const posts = await getAllPosts()
  const results = posts.filter((post: any) => {
    const titleMatch = post.title?.toLowerCase().includes(query)
    const excerptMatch = post.excerpt?.toLowerCase().includes(query)
    const categoryMatch = post.categories?.some((c: any) =>
      c.title?.toLowerCase().includes(query)
    )
    return titleMatch || excerptMatch || categoryMatch
  })

  return NextResponse.json(results.slice(0, 10))
}
