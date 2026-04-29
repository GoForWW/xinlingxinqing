import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllPosts, getAllCategories } from '@/lib/api'
import { urlFor } from '@/lib/sanity'
import type { Post } from '@/lib/types'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '全部文章',
    description: '瀏覽心靈心情的所有文章 — 心理學、情感關係、精神健康和生產力。',
    openGraph: {
      title: '全部文章 | 心靈心情',
      description: '瀏覽心靈心情的所有文章 — 心理學、情感關係、精神健康和生產力。',
    },
    alternates: {
      canonical: '/blog',
    },
  }
}

export const revalidate = 60 // ISR: revalidate every 60s to pick up new posts

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  return `${date.getFullYear()}年${months[date.getMonth()]}${date.getDate()}日`
}

export default async function BlogPage() {
  // Force dynamic rendering on each request for development
  // In production, 'revalidate = 60' above handles fresh data
  const posts = await getAllPosts()
  const categories = await getAllCategories()

  return (
    <div className="min-h-screen bg-[#F7F4EF]">
      {/* Header */}
      <header className="bg-[#F7F4EF] border-b border-[#E8E4DD]">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/">
                <h1 className="text-3xl font-serif font-bold text-[#4A5568]">心靈心情</h1>
              </Link>
              <p className="text-sm text-[#6B7A64] mt-1">心的歸處，便是晴天</p>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-[#4A5568] hover:text-[#6B7A64] transition-colors">
                首頁
              </Link>
              <Link href="/blog" className="text-[#6B7A64] font-semibold">
                文章
              </Link>
              {categories.slice(0, 4).map((cat) => (
                <Link
                  key={cat._id}
                  href={`/category/${cat.slug.current}`}
                  className="text-[#4A5568] hover:text-[#6B7A64] transition-colors"
                >
                  {cat.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Blog Posts */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-serif font-bold text-[#4A5568] mb-8">全部文章</h2>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href="/blog"
              className="px-4 py-2 bg-[#6B7A64] text-white rounded-full text-sm"
            >
              全部
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/category/${cat.slug.current}`}
                className="px-4 py-2 bg-white text-[#6B7A64] rounded-full text-sm hover:bg-[#6B7A64] hover:text-white transition-colors"
              >
                {cat.title}
              </Link>
            ))}
          </div>
        )}

        <div className="space-y-8">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug.current}`}
              className="group block"
            >
              <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="grid md:grid-cols-4 gap-0">
                  {post.mainImage && (
                    <div className="relative h-40 md:h-auto">
                      <Image
                        src={urlFor(post.mainImage).width(400).height(300).url()}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className={`p-6 md:col-span-${post.mainImage ? '3' : '4'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      {post.categories?.map((cat) => (
                        <span
                          key={cat._id}
                          className="px-2 py-0.5 bg-[#6B7A64]/10 text-[#6B7A64] text-xs rounded-full"
                        >
                          {cat.title}
                        </span>
                      ))}
                      <span className="text-xs text-[#6B7A64]">
                        {formatDate(post.publishedAt)}
                      </span>
                    </div>
                    <h3 className="text-xl font-serif font-semibold text-[#4A5568] mb-2 group-hover:text-[#6B7A64] transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-[#6B7A64] line-clamp-2">{post.excerpt}</p>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {post.tags.slice(0, 5).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs text-[#6B7A64]/70 bg-[#F7F4EF] px-2 py-0.5 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#6B7A64] text-lg">暫時沒有文章</p>
            <p className="text-sm text-[#6B7A64]/70 mt-2">即將推出更多內容，敬請期待</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#6B7A64] text-white mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <p className="text-white/70 text-sm">© {new Date().getFullYear()} 心靈心情. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
