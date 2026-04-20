import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import type { Post } from '@/lib/types'

interface PrevNextNavProps {
  prev: Post | null
  next: Post | null
}

export default function PrevNextNav({ prev, next }: PrevNextNavProps) {
  if (!prev && !next) return null

  return (
    <nav className="mt-12 pt-8 border-t border-[#E8E4DD]">
      <div className={`grid grid-cols-1 ${prev && next ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-4`}>
        {prev && (
          <Link
            href={`/blog/${prev.slug.current}`}
            className="group flex items-center gap-4 p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
          >
            <div className="text-[#6B7A64]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            {prev.mainImage && (
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={urlFor(prev.mainImage).width(100).height(100).url()}
                  alt={prev.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p className="text-xs text-[#6B7A64]">上一篇</p>
              <p className="font-serif font-medium text-[#4A5568] group-hover:text-[#6B7A64] transition-colors line-clamp-2">
                {prev.title}
              </p>
            </div>
          </Link>
        )}
        {next && (
          <Link
            href={`/blog/${next.slug.current}`}
            className="group flex items-center gap-4 p-4 bg-white rounded-xl hover:shadow-md transition-shadow text-right md:flex-row-reverse"
          >
            <div className="text-[#6B7A64]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            {next.mainImage && (
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={urlFor(next.mainImage).width(100).height(100).url()}
                  alt={next.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <p className="text-xs text-[#6B7A64]">下一篇</p>
              <p className="font-serif font-medium text-[#4A5568] group-hover:text-[#6B7A64] transition-colors line-clamp-2">
                {next.title}
              </p>
            </div>
          </Link>
        )}
      </div>
    </nav>
  )
}
