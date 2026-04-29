'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SearchModal from './SearchModal'

interface Category {
  _id: string
  title: string
  slug: { current: string }
}

interface MobileNavProps {
  categories: Category[]
}

export default function MobileNav({ categories }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 rounded-lg hover:bg-[#6B7A64]/10 transition-colors"
        aria-label={isOpen ? '關閉選單' : '開啟選單'}
        aria-expanded={isOpen}
      >
        <svg className="w-6 h-6 text-[#4A5568]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {isOpen ? (
            <>
              <path d="M6 6l12 12" />
              <path d="M18 6L6 18" />
            </>
          ) : (
            <>
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </>
          )}
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-in menu */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Close button */}
          <div className="flex justify-end mb-8">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg hover:bg-[#6B7A64]/10 transition-colors"
              aria-label="關閉選單"
            >
              <svg className="w-6 h-6 text-[#4A5568]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </svg>
            </button>
          </div>

          {/* Site title */}
          <Link href="/" className="block mb-8" onClick={() => setIsOpen(false)}>
            <span className="text-2xl font-serif font-bold text-[#4A5568]">心靈心情</span>
          </Link>

          {/* Navigation links */}
          <nav className="space-y-1">
            <Link
              href="/"
              className={`block px-4 py-3 rounded-xl text-base transition-colors ${
                pathname === '/' ? 'bg-[#6B7A64]/10 text-[#6B7A64] font-semibold' : 'text-[#4A5568] hover:bg-[#F7F4EF]'
              }`}
              onClick={() => setIsOpen(false)}
            >
              首頁
            </Link>
            <Link
              href="/blog"
              className={`block px-4 py-3 rounded-xl text-base transition-colors ${
                pathname.startsWith('/blog') ? 'bg-[#6B7A64]/10 text-[#6B7A64] font-semibold' : 'text-[#4A5568] hover:bg-[#F7F4EF]'
              }`}
              onClick={() => setIsOpen(false)}
            >
              全部文章
            </Link>

            {/* Category divider */}
            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-medium uppercase tracking-wider text-[#6B7A64]/50">分類</p>
            </div>

            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat._id}
                href={`/category/${cat.slug.current}`}
                className={`block px-4 py-3 rounded-xl text-base transition-colors ${
                  pathname === `/category/${cat.slug.current}` ? 'bg-[#6B7A64]/10 text-[#6B7A64] font-semibold' : 'text-[#4A5568] hover:bg-[#F7F4EF]'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {cat.title}
              </Link>
            ))}
          </nav>

          {/* Search */}
          <div className="mt-8 pt-6 border-t border-[#E8E4DD]">
            <div onClick={() => setIsOpen(false)}>
              <SearchModal />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
