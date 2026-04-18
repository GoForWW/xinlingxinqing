import Image from 'next/image'
import Link from 'next/link'
import { getAllPosts, getAllCategories } from '@/lib/api'
import { urlFor } from '@/lib/sanity'
import type { Post, Category } from '@/lib/types'

// Format date to Chinese format
function formatDate(dateString: string) {
  const date = new Date(dateString)
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  return `${date.getFullYear()}年${months[date.getMonth()]}${date.getDate()}日`
}

// Generate static params for SSG
export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug.current,
  }))
}

export default async function HomePage() {
  const posts = await getAllPosts()
  const categories = await getAllCategories()
  const featuredPost = posts[0]
  const recentPosts = posts.slice(1, 7)

  return (
    <div className="min-h-screen bg-[#F7F4EF]">
      {/* Header */}
      <header className="bg-[#F7F4EF] border-b border-[#E8E4DD]">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold text-[#4A5568]">心靈心情</h1>
              <p className="text-sm text-[#6B7A64] mt-1">心的歸處，便是晴天</p>
            </div>
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

      {/* Hero Section - Featured Post */}
      {featuredPost && (
        <section className="max-w-6xl mx-auto px-4 py-12">
          <Link href={`/blog/${featuredPost.slug.current}`} className="group">
            <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="grid md:grid-cols-2 gap-0">
                {featuredPost.mainImage && (
                  <div className="relative h-64 md:h-96">
                    <Image
                      src={urlFor(featuredPost.mainImage).width(800).height(600).url()}
                      alt={featuredPost.title}
                      fill
                      className="object-cover"
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
                  </div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#4A5568] mb-4 group-hover:text-[#6B7A64] transition-colors">
                    {featuredPost.title}
                  </h2>
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
        </section>
      )}

      {/* Recent Posts Grid */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-serif font-bold text-[#4A5568]">最新文章</h2>
          <Link
            href="/blog"
            className="text-sm text-[#6B7A64] hover:underline"
          >
            查看全部 →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug.current}`}
              className="group"
            >
              <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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
                  </div>
                  <h3 className="text-lg font-serif font-semibold text-[#4A5568] mb-2 group-hover:text-[#6B7A64] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-[#6B7A64] line-clamp-3">{post.excerpt}</p>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
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
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-serif font-bold text-[#4A5568] mb-8">分類</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/category/${category.slug.current}`}
                className="bg-white rounded-xl p-6 text-center hover:shadow-md transition-shadow"
              >
                <h3 className="font-serif font-semibold text-[#4A5568]">{category.title}</h3>
                {category.description && (
                  <p className="text-sm text-[#6B7A64] mt-1 line-clamp-2">
                    {category.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#6B7A64] text-white mt-12">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-serif font-bold mb-2">心靈心情</h3>
            <p className="text-white/70 text-sm mb-6">心的歸處，便是晴天</p>
            <div className="flex justify-center gap-6 text-sm">
              <Link href="/" className="text-white/70 hover:text-white transition-colors">
                首頁
              </Link>
              <Link href="/blog" className="text-white/70 hover:text-white transition-colors">
                文章
              </Link>
            </div>
            <p className="text-white/50 text-xs mt-8">
              © {new Date().getFullYear()} 心靈心情. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
