import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllPosts, getAllCategories } from '@/lib/api'
import { getReadingTime } from '@/lib/readingTime'
import SearchModal from '@/components/SearchModal'
import MobileNav from '@/components/MobileNav'
import Footer from '@/components/Footer'
import { urlFor } from '@/lib/sanity'
import type { Post, Category } from '@/lib/types'

export async function generateMetadata(): Promise<Metadata> {
  return {
    description: '深入探索心理學、情感關係、精神健康和生產力。為追求更深理解和有意義成長的人而寫。',
    openGraph: {
      title: '心靈心情 | Psychology & Wellbeing',
      description: '深入探索心理學、情感關係、精神健康和生產力。為追求更深理解和有意義成長的人而寫。',
      url: 'https://xinlingxinqing.vercel.app',
    },
    twitter: {
      card: 'summary_large_image',
      title: '心靈心情 | Psychology & Wellbeing',
      description: '深入探索心理學、情感關係、精神健康和生產力。',
    },
    alternates: {
      canonical: 'https://xinlingxinqing.vercel.app',
    },
  }
}

export const revalidate = 60

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  return `${date.getFullYear()}年${months[date.getMonth()]}${date.getDate()}日`
}

// Category color mapping
const categoryColors: Record<string, { bg: string; text: string; badge: string }> = {
  Psychology: { bg: 'bg-connect-light', text: 'text-connect', badge: 'bg-connect-light text-connect' },
  'Mental Health': { bg: 'bg-mind-light', text: 'text-mind', badge: 'bg-mind-light text-mind' },
  Productivity: { bg: 'bg-grow-light', text: 'text-grow', badge: 'bg-grow-light text-grow' },
  Relationships: { bg: 'bg-heart-light', text: 'text-heart', badge: 'bg-heart-light text-heart' },
}

function getCategoryStyle(categoryTitle: string) {
  return categoryColors[categoryTitle] || { bg: 'bg-warm-100', text: 'text-warm-600', badge: 'bg-warm-200 text-warm-600' }
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
    <div className="min-h-screen bg-warm-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-warm-50/80 backdrop-blur-md border-b border-warm-200/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-sans text-lg font-semibold tracking-tight text-warm-800">
            心靈心情
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-warm-600">
            <Link href="#articles" className="hover:text-warm-900 transition-colors">最新文章</Link>
            <Link href="#categories" className="hover:text-warm-900 transition-colors">分類</Link>
            <Link href="#about" className="hover:text-warm-900 transition-colors">關於</Link>
            <SearchModal />
          </div>
          <MobileNav categories={categories_data} />
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-bg min-h-[100dvh] pt-16 flex items-center">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <div className="py-12 lg:py-20">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase text-warm-500 bg-warm-200/60 mb-6">
                心理學 · 關係 · 成長
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal tracking-tighter leading-[1.05] text-warm-900 mb-4" style={{textShadow: '0 2px 4px rgba(0,0,0,0.08)'}}>
                了解自己的<br />
                <span className="gradient-text font-semibold">藝術</span>
              </h1>
              <p className="font-serif text-base md:text-lg text-warm-600 leading-relaxed max-w-[40ch] mb-8">
                深入探索心理學、情感關係與精神健康。<br />
                為追求更深理解和有意義成長的人而寫。
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="#articles"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-warm-800 text-warm-50 text-sm font-medium hover:bg-warm-900 transition-all active:scale-[0.98]"
                >
                  開始閱讀
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8h10" /><path d="M9 4l4 4-4 4" />
                  </svg>
                </Link>
                <Link
                  href="#about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-warm-300 text-warm-700 text-sm font-medium hover:bg-warm-100 transition-all active:scale-[0.98]"
                >
                  關於本站
                </Link>
              </div>
            </div>

            {/* Right: Image */}
            <div className="hidden lg:block relative">
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]">
                <Image
                  src="/hero-sunrise.png"
                  alt=""
                  width={864}
                  height={1152}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-2xl bg-mind-light -z-10" />
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-xl bg-heart-light -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-warm-200/60 bg-warm-50">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-3 gap-8">
            <div className="stat-animate text-center">
              <div className="font-sans text-3xl md:text-4xl font-semibold tracking-tight text-warm-800">{posts.length}</div>
              <div className="font-serif text-sm text-warm-500 mt-1">文章總數</div>
            </div>
            <div className="stat-animate text-center">
              <div className="font-sans text-3xl md:text-4xl font-semibold tracking-tight text-warm-800">4</div>
              <div className="font-serif text-sm text-warm-500 mt-1">核心分類</div>
            </div>
            <div className="stat-animate text-center">
              <div className="font-sans text-3xl md:text-4xl font-semibold tracking-tight text-warm-800">每週</div>
              <div className="font-serif text-sm text-warm-500 mt-1">新內容</div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section id="articles" className="py-24 px-6 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-light tracking-tight text-warm-900 mb-3">最新文章</h2>
              <p className="font-serif text-base text-warm-500">深入探索人類心理和行為的細微之處。</p>
            </div>
            <Link
              href="/blog"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warm-100 text-warm-600 text-sm font-medium hover:bg-warm-200 transition-colors"
            >
              查看全部
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8h10" /><path d="M9 4l4 4-4 4" />
              </svg>
            </Link>
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <Link href={`/blog/${featuredPost.slug.current}`} className="group block mb-10">
              <article className="grid md:grid-cols-2 gap-0 bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                {featuredPost.mainImage && (
                  <div className="relative h-72 md:h-auto min-h-[320px] overflow-hidden">
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
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    {featuredPost.categories?.[0] && (
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${categoryColors[featuredPost.categories[0].title]?.badge || 'bg-warm-200 text-warm-600'}`}>
                        {featuredPost.categories[0].title}
                      </span>
                    )}
                    <span className="text-xs text-warm-400">{formatDate(featuredPost.publishedAt)}</span>
                    <span className="text-xs text-warm-400">· {getReadingTime(featuredPost.excerpt || '', featuredPost.body)}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif font-semibold text-warm-900 mb-4 group-hover:text-warm-700 transition-colors">
                    {featuredPost.title}
                  </h3>
                  {featuredPost.excerpt && (
                    <p className="font-serif text-warm-600 text-base leading-relaxed">{featuredPost.excerpt}</p>
                  )}
                  {featuredPost.author && (
                    <div className="mt-6 flex items-center gap-3">
                      {featuredPost.author.image && (
                        <div className="relative w-9 h-9 rounded-full overflow-hidden">
                          <Image src={urlFor(featuredPost.author.image).width(72).height(72).url()} alt={featuredPost.author.name} fill className="object-cover" />
                        </div>
                      )}
                      <span className="text-sm text-warm-500">{featuredPost.author.name}</span>
                    </div>
                  )}
                </div>
              </article>
            </Link>
          )}

          {/* Recent Posts */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <Link key={post._id} href={`/blog/${post.slug.current}`} className="group">
                <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                  {post.mainImage ? (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={urlFor(post.mainImage).width(600).height(400).url()}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-warm-100 flex items-center justify-center">
                      <span className="text-warm-300 font-serif text-lg">心靈心情</span>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {post.categories?.[0] && (
                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${categoryColors[post.categories[0].title]?.badge || 'bg-warm-200 text-warm-600'}`}>
                          {post.categories[0].title}
                        </span>
                      )}
                      <span className="text-xs text-warm-400">{formatDate(post.publishedAt)}</span>
                      <span className="text-xs text-warm-400">· {getReadingTime(post.excerpt || '', post.body)}</span>
                    </div>
                    <h4 className="text-lg font-serif font-semibold text-warm-900 mb-2 group-hover:text-warm-700 transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    {post.excerpt && (
                      <p className="text-sm font-serif text-warm-500 line-clamp-3">{post.excerpt}</p>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-warm-600 font-serif text-lg">暫時沒有文章</p>
              <p className="text-sm text-warm-400 mt-2">即將推出更多內容，敬請期待</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-24 px-6 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-light tracking-tight text-warm-900 mb-3">
              我們的領域
            </h2>
            <p className="font-serif text-base text-warm-500 max-w-2xl mx-auto">
              四個互聯的核心領域，每一個都提供了不同的視角去理解自己和周圍的世界。
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories_data.slice(0, 4).map((category) => {
              const style = getCategoryStyle(category.title)
              const icon = categoryIcons[category.title] || categoryIcons['Mental Health']
              return (
                <Link
                  key={category._id}
                  href={`/category/${category.slug.current}`}
                  className={`group p-8 rounded-3xl border border-warm-200 hover:shadow-md transition-all duration-300 ${style.bg}`}
                >
                  <div className={`mb-6 ${style.text} group-hover:scale-105 transition-transform duration-300`}>
                    {icon}
                  </div>
                  <h3 className="text-xl font-serif text-warm-900 mb-2">
                    {category.title}
                  </h3>
                  <p className="text-sm text-warm-500 leading-relaxed font-serif">
                    {category.description || '探索這個領域的文章'}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: style.text.match(/-(\w+)/)?.[0]?.slice(1) ? undefined : style.text }}>
                    <span className={style.text}>探索</span>
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 8h10" /><path d="M9 4l4 4-4 4" />
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
