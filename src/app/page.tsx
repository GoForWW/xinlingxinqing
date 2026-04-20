import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getAllPosts, getAllCategories } from '@/lib/api'
import { getReadingTime } from '@/lib/readingTime'
import SearchModal from '@/components/SearchModal'
import Footer from '@/components/Footer'
import { urlFor } from '@/lib/sanity'
import type { Post, Category } from '@/lib/types'

// Format date to Chinese format
function formatDate(dateString: string) {
  const date = new Date(dateString)
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  return `${date.getFullYear()}年${months[date.getMonth()]}${date.getDate()}日`
}

const categoryIcons: Record<string, React.ReactNode> = {
  Psychology: (
    <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="24" cy="20" r="12" />
      <path d="M24 32v12M16 44h16" />
      <path d="M18 18c0-3 2.5-5 6-5s6 2 6 5" strokeLinecap="round" />
    </svg>
  ),
  Relationships: (
    <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="16" cy="20" r="8" />
      <circle cx="32" cy="20" r="8" />
      <path d="M8 40c0-4 4-7 8-7h4M40 40c0-4-4-7-8-7h-4" strokeLinecap="round" />
    </svg>
  ),
  'Mental Health': (
    <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M24 44c10-8 16-15 16-22a16 16 0 10-32 0c0 7 6 14 16 22z" strokeLinejoin="round" />
      <circle cx="18" cy="22" r="2" fill="currentColor" />
      <circle cx="30" cy="22" r="2" fill="currentColor" />
      <path d="M18 30c2 2 4 3 6 3s4-1 6-3" strokeLinecap="round" />
    </svg>
  ),
  Productivity: (
    <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 8v8h8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 12h8v8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M36 8v8h8M40 12h-8v8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="32" r="12" />
      <path d="M24 26v8l4 4" strokeLinecap="round" />
    </svg>
  ),
}

export default async function HomePage() {
  const posts = await getAllPosts()
  const categories_data = await getAllCategories()
  const featuredPost = posts[0]
  const recentPosts = posts.slice(1, 7)

  return (
    <div className="min-h-screen bg-[#F7F4EF]">
      {/* Header */}
      <header className="bg-[#F7F4EF]/80 backdrop-blur-md border-b border-[#E8E4DD]/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-serif text-xl text-[#6B7A64] hover:text-[#5A6A54] transition-colors">
              心靈心情
            </Link>
            <div className="flex items-center gap-8 text-sm">
              <Link href="#about" className="text-[#6B7A64] hover:text-[#5A6A54] transition-colors">
                關於
              </Link>
              <Link href="#categories" className="text-[#6B7A64] hover:text-[#5A6A54] transition-colors">
                分類
              </Link>
              <SearchModal />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Blog Branding */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#6B7A64]/10 rounded-full text-[#6B7A64] text-sm font-medium">
                <span className="w-2 h-2 bg-[#6B7A64] rounded-full animate-pulse" />
                探索人類經驗的深處
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-[#4A5568] leading-[1.1] tracking-tight">
                了解自己的
                <span className="text-[#6B7A64]"> 藝術</span>
              </h1>
              <p className="text-lg text-[#6B7A64] leading-relaxed max-w-lg">
                深入探索心理學、情感關係、精神健康和生產力。為追求更深理解 和有意義成長的人而寫。
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="#featured" className="inline-flex items-center justify-center px-6 py-3 bg-[#6B7A64] text-white rounded-full font-medium hover:bg-[#5A6A54] transition-colors">
                  開始閱讀
                </Link>
                <Link href="#about" className="inline-flex items-center justify-center px-6 py-3 border border-[#6B7A64]/30 text-[#6B7A64] rounded-full font-medium hover:bg-[#6B7A64]/5 transition-colors">
                  關於本站
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-[#4A5568]/10">
                <Image
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
                  alt="Serene mountain landscape at dawn"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#4A5568]/20 to-transparent" />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#D4A574]/30 rounded-full blur-2xl" />
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#6B7A64]/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-[#E8E4DD]/30">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-serif text-[#4A5568]">
            關於心靈心情
          </h2>
          <p className="text-lg text-[#6B7A64] leading-relaxed">
            心靈心情探索心理學研究與日常生活的交匯點。我們相信，了解你的心智如何運作，
            是邁向更充實、更真實人生的第一步。
          </p>
          <p className="text-lg text-[#6B7A64] leading-relaxed">
            我們的文字借鑒了認知心理學、依附理論、神經科學和行為研究——
            轉化為你可以立即應用的實用見解。
          </p>
          <div className="pt-8 flex justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-serif text-[#6B7A64]">{posts.length || '50+'}</div>
              <div className="text-sm text-[#6B7A64]/70 mt-1">文章總數</div>
            </div>
            <div className="w-px bg-[#6B7A64]/20" />
            <div>
              <div className="text-3xl font-serif text-[#6B7A64]">4</div>
              <div className="text-sm text-[#6B7A64]/70 mt-1">核心分類</div>
            </div>
            <div className="w-px bg-[#6B7A64]/20" />
            <div>
              <div className="text-3xl font-serif text-[#6B7A64]">每週</div>
              <div className="text-sm text-[#6B7A64]/70 mt-1">新內容</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post Section */}
      {featuredPost && (
        <section id="featured" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-serif text-[#4A5568]">
                  最新文章
                </h2>
                <p className="text-lg text-[#6B7A64] max-w-xl">
                  深入探索人類心理和行為的細微之處。
                </p>
              </div>
              <Link href="/blog" className="hidden md:flex items-center gap-2 text-[#6B7A64] font-medium hover:text-[#5A6A54] transition-colors">
                查看全部文章
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            {/* Featured Post - Large */}
            <Link href={`/blog/${featuredPost.slug.current}`} className="group">
              <div className="relative rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300 mb-12">
                <div className="grid md:grid-cols-2 gap-0">
                  {featuredPost.mainImage && (
                    <div className="relative h-72 md:h-96">
                      <Image
                        src={urlFor(featuredPost.mainImage).width(800).height(600).url()}
                        alt={featuredPost.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority
                      />
                    </div>
                  )}
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      {featuredPost.categories?.[0] && (
                        <span className="px-3 py-1 bg-[#6B7A64]/10 text-[#6B7A64] text-sm rounded-full">
                          {featuredPost.categories[0].title}
                        </span>
                      )}
                      <span className="text-sm text-[#6B7A64]">
                        {formatDate(featuredPost.publishedAt)}
                      </span>
                      <span className="text-sm text-[#6B7A64]/70">· {getReadingTime(featuredPost.excerpt || '')}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#4A5568] mb-4 group-hover:text-[#6B7A64] transition-colors">
                      {featuredPost.title}
                    </h3>
                    {featuredPost.excerpt && (
                      <p className="text-[#6B7A64] text-lg leading-relaxed">
                        {featuredPost.excerpt}
                      </p>
                    )}
                    {featuredPost.author && (
                      <div className="mt-6 flex items-center gap-3">
                        {featuredPost.author.image && (
                          <div className="relative w-10 h-10 rounded-full overflow-hidden">
                            <Image
                              src={urlFor(featuredPost.author.image).width(80).height(80).url()}
                              alt={featuredPost.author.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <span className="text-sm text-[#6B7A64]">{featuredPost.author.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>

            {/* Recent Posts Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug.current}`}
                  className="group"
                >
                  <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                    {post.mainImage && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={urlFor(post.mainImage).width(600).height(400).url()}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        {post.categories?.[0] && (
                          <span className="px-2 py-0.5 bg-[#6B7A64]/10 text-[#6B7A64] text-xs rounded-full">
                            {post.categories[0].title}
                          </span>
                        )}
                        <span className="text-xs text-[#6B7A64]">
                          {formatDate(post.publishedAt)}
                        </span>
                        <span className="text-xs text-[#6B7A64]/70">· {getReadingTime(post.excerpt || '')}</span>
                      </div>
                      <h4 className="text-lg font-serif font-semibold text-[#4A5568] mb-2 group-hover:text-[#6B7A64] transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      {post.excerpt && (
                        <p className="text-sm text-[#6B7A64] line-clamp-3">{post.excerpt}</p>
                      )}
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
          </div>
        </section>
      )}

      {/* Categories Section with Icons */}
      <section id="categories" className="py-24 px-6 bg-[#6B7A64]/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-serif text-[#4A5568]">
              我們的領域
            </h2>
            <p className="text-lg text-[#6B7A64] max-w-2xl mx-auto">
              四個互聯的核心領域，每一個都提供了不同的視角去理解自己和周圍的世界。
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories_data.slice(0, 4).map((category) => {
              const icon = categoryIcons[category.title] || categoryIcons['Mental Health']
              return (
                <Link
                  key={category._id}
                  href={`/category/${category.slug.current}`}
                  className="group p-8 bg-white rounded-3xl border border-[#E8E4DD] hover:shadow-md transition-all duration-300"
                >
                  <div className="text-[#6B7A64] mb-6 group-hover:text-[#5A6A54] transition-colors">
                    {icon}
                  </div>
                  <h3 className="text-xl font-serif text-[#4A5568] mb-2">
                    {category.title}
                  </h3>
                  <p className="text-[#6B7A64]/70 text-sm leading-relaxed">
                    {category.description || '探索這個領域的文章'}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-[#6B7A64] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    探索
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <Footer categories={categories_data} />
    </div>
  )
}
