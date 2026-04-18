import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity'
import type { Post } from '@/lib/types'

// Create a new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug, content, excerpt, categories, tags, mainImage, authorName } = body

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, content' },
        { status: 400 }
      )
    }

    // Convert markdown-like content to Sanity blocks
    // For now, we'll create simple text blocks
    const bodyBlocks = content
      .split('\n\n')
      .filter((paragraph: string) => paragraph.trim())
      .map((paragraph: string) => ({
        _type: 'block',
        _key: Math.random().toString(36).substring(7),
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: Math.random().toString(36).substring(7),
            text: paragraph.trim(),
            marks: [],
          },
        ],
        markDefs: [],
      }))

    const post = {
      _type: 'post',
      title,
      slug: { _type: 'slug', current: slug },
      publishedAt: new Date().toISOString(),
      excerpt: excerpt || '',
      body: bodyBlocks,
      tags: tags || [],
      mainImage: mainImage
        ? {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: mainImage,
            },
          }
        : undefined,
    }

    const result = await writeClient.create(post)

    return NextResponse.json({
      success: true,
      message: 'Post created successfully',
      postId: result._id,
    })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post', details: String(error) },
      { status: 500 }
    )
  }
}

// Get all posts
export async function GET() {
  try {
    const posts = await writeClient.fetch(`
      *[_type == "post"] | order(publishedAt desc) {
        _id,
        title,
        "slug": slug.current,
        publishedAt,
        excerpt,
        "author": author->name
      }
    `)

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}
