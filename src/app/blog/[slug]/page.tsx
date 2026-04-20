import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPostSlugs, getAllCategories } from '@/lib/api'
import { urlFor } from '@/lib/sanity'
import type { Post } from '@/lib/types'
import ReadingProgress from '@/components/ReadingProgress'

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  return `${date.getFullYear()}年${months[date.getMonth()]}${date.getDate()}日`
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  const categories = await getAllCategories()

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#F7F4EF]">
      <ReadingProgress />
      {/* Header */}
      <header className="bg-[#F7F4EF] border-b border-[#E8E4DD]">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="text-3xl font-serif font-bold text-[#4A5568]">心靈心情</h1>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-[#4A5568] hover:text-[#6B7A64] transition-colors">
                首頁
              </Link>
              <Link href="/blog" className="text-[#4A5568] hover:text-[#6B7A64] transition-colors">
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

      {/* Article */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[#6B7A64] hover:underline mb-8"
        >
          ← 返回文章列表
        </Link>

        {/* Post header */}
        <article className="bg-white rounded-2xl overflow-hidden shadow-sm">
          {post.mainImage && (
            <div className="relative h-64 md:h-96 mb-8">
              <Image
                src={urlFor(post.mainImage).width(1200).height(800).url()}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="px-8 md:px-12 pb-8">
            {/* Meta */}
            <div className="flex items-center gap-3 mb-4">
              {post.categories?.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/category/${cat.slug.current}`}
                  className="px-3 py-1 bg-[#6B7A64]/10 text-[#6B7A64] text-sm rounded-full hover:bg-[#6B7A64] hover:text-white transition-colors"
                >
                  {cat.title}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-[#6B7A64] mb-6">
              <span>{formatDate(post.publishedAt)}</span>
              {post.author && <span>作者：{post.author.name}</span>}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#4A5568] mb-6">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-lg text-[#6B7A64] leading-relaxed mb-8 border-l-4 border-[#6B7A64]/30 pl-4">
                {post.excerpt}
              </p>
            )}

            {/* Body */}
            {post.body && (
              <div className="prose prose-slate max-w-none">
                {post.body.map((block: any, index: number) => {
                  if (block._type === 'block') {
                    const text = block.children?.map((child: any) => child.text).join('') || ''
                    
                    switch (block.style) {
                      case 'h2':
                        return (
                          <h2 key={index} className="text-2xl font-serif font-bold text-[#4A5568] mt-8 mb-4">
                            {text}
                          </h2>
                        )
                      case 'h3':
                        return (
                          <h3 key={index} className="text-xl font-serif font-semibold text-[#4A5568] mt-6 mb-3">
                            {text}
                          </h3>
                        )
                      case 'blockquote':
                        return (
                          <blockquote key={index} className="border-l-4 border-[#6B7A64] pl-4 my-4 text-[#6B7A64] italic">
                            {text}
                          </blockquote>
                        )
                      default:
                        return text ? (
                          <p key={index} className="text-[#4A5568] leading-relaxed mb-4">
                            {block.children?.map((child: any, ci: number) => {
                              const childText = child.text || ''
                              const marks = child.marks || []
                              
                              let element: React.ReactNode = childText
                              if (marks.includes('strong')) {
                                element = <strong key={ci}>{childText}</strong>
                              }
                              if (marks.includes('em')) {
                                element = marks.includes('strong') ? (
                                  <strong><em>{childText}</em></strong>
                                ) : (
                                  <em>{childText}</em>
                                )
                              }
                              
                              return element
                            })}
                          </p>
                        ) : null
                    }
                  }
                  
                  if (block._type === 'image' && block.asset) {
                    return (
                      <div key={index} className="my-8 relative h-64 md:h-96">
                        <Image
                          src={urlFor(block).width(1200).height(800).url()}
                          alt=""
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    )
                  }
                  
                  return null
                })}
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-[#E8E4DD]">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-sm text-[#6B7A64]/70 bg-[#F7F4EF] px-3 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Back to blog */}
        <div className="text-center mt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#6B7A64] hover:underline"
          >
            ← 返回文章列表
          </Link>
        </div>
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
