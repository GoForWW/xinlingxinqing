import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import type { Post } from '@/lib/types'

interface RelatedPostsProps {
  posts: Post[]
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  return `${date.getFullYear()}年${months[date.getMonth()]}${date.getDate()}日`
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null

  return (
    <section className="mt-12 pt-8 border-t border-[#E8E4DD]">
      <h3 className="text-xl font-serif font-bold text-[#4A5568] mb-6">相關文章</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post._id}
            href={`/blog/${post.slug.current}`}
            className="group"
          >
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {post.mainImage && (
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={urlFor(post.mainImage).width(400).height(300).url()}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-4">
                {post.categories?.[0] && (
                  <span className="text-xs text-[#6B7A64]">
                    {post.categories[0].title}
                  </span>
                )}
                <h4 className="font-serif font-semibold text-[#4A5568] mt-1 line-clamp-2 group-hover:text-[#6B7A64] transition-colors">
                  {post.title}
                </h4>
                <p className="text-sm text-[#6B7A64]/70 mt-2">
                  {formatDate(post.publishedAt)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
