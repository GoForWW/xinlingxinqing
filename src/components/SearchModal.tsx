'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'

interface SearchResult {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  mainImage?: any
  categories?: any[]
}

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      inputRef.current?.focus()
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data)
      } catch (e) {
        console.error('Search error:', e)
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full hover:bg-[#6B7A64]/10 transition-colors"
        aria-label="Open search"
      >
        <svg className="w-5 h-5 text-[#4A5568]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[10vh]" onClick={() => setIsOpen(false)}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative bg-white dark:bg-[#252525] rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[#E8E4DD]">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-[#6B7A64]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜尋文章..."
              className="flex-1 text-lg outline-none bg-transparent text-[#4A5568] placeholder-[#6B7A64]/50"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded hover:bg-[#6B7A64]/10 text-[#6B7A64]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="p-8 text-center text-[#6B7A64]">搜尋中...</div>
          )}
          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="p-8 text-center text-[#6B7A64]">沒有找到相關文章</div>
          )}
          {!loading && results.length > 0 && (
            <ul>
              {results.map((post) => (
                <li key={post._id}>
                  <Link
                    href={`/blog/${post.slug.current}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 p-4 hover:bg-[#F7F4EF] dark:hover:bg-[#1a1a1a] transition-colors"
                  >
                    {post.mainImage && (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={urlFor(post.mainImage).width(100).height(100).url()}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-serif font-medium text-[#4A5568]">{post.title}</p>
                      {post.excerpt && (
                        <p className="text-sm text-[#6B7A64]/70 mt-1 line-clamp-1">{post.excerpt}</p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {!loading && query.length < 2 && (
            <div className="p-8 text-center text-[#6B7A64]/70">
              輸入至少 2 個字元開始搜尋
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
