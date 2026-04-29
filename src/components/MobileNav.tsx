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

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen])

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden relative z-[60] p-2 rounded-lg transition-colors"
        style={{ color: '#4A5568' }}
        aria-label={isOpen ? '關閉選單' : '開啟選單'}
        aria-expanded={isOpen}
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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
          className="fixed inset-0 bg-black/50 z-[70]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-in menu panel - rendered at document root z-index level */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white z-[80] shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ overflowY: 'auto' }}
      >
        <div className="p-6">
          {/* Close button */}
          <div className="flex justify-end mb-8">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg transition-colors"
              style={{ color: '#4A5568' }}
              aria-label="關閉選單"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </svg>
            </button>
          </div>

          {/* Site title */}
          <Link href="/" className="block mb-8" onClick={() => setIsOpen(false)}>
            <span className="text-2xl font-serif font-bold" style={{ color: '#4A5568' }}>
              心靈心情
            </span>
          </Link>

          {/* Navigation links */}
          <nav className="space-y-1">
            <Link
              href="/"
              className={`block px-4 py-3 rounded-xl text-base transition-colors ${
                pathname === '/' ? 'font-semibold' : ''
              }`}
              style={{
                color: pathname === '/' ? '#6B7A64' : '#4A5568',
                backgroundColor: pathname === '/' ? 'rgba(107,122,100,0.1)' : 'transparent'
              }}
              onClick={() => setIsOpen(false)}
            >
              首頁
            </Link>
            <Link
              href="/blog"
              className={`block px-4 py-3 rounded-xl text-base transition-colors ${
                pathname.startsWith('/blog') ? 'font-semibold' : ''
              }`}
              style={{
                color: pathname.startsWith('/blog') ? '#6B7A64' : '#4A5568',
                backgroundColor: pathname.startsWith('/blog') ? 'rgba(107,122,100,0.1)' : 'transparent'
              }}
              onClick={() => setIsOpen(false)}
            >
              全部文章
            </Link>

            {/* Category divider */}
            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(107,122,100,0.5)' }}>
                分類
              </p>
            </div>

            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat._id}
                href={`/category/${cat.slug.current}`}
                className={`block px-4 py-3 rounded-xl text-base transition-colors ${
                  pathname === `/category/${cat.slug.current}` ? 'font-semibold' : ''
                }`}
                style={{
                  color: pathname === `/category/${cat.slug.current}` ? '#6B7A64' : '#4A5568',
                  backgroundColor: pathname === `/category/${cat.slug.current}` ? 'rgba(107,122,100,0.1)' : 'transparent'
                }}
                onClick={() => setIsOpen(false)}
              >
                {cat.title}
              </Link>
            ))}
          </nav>

          {/* Search */}
          <div className="mt-8 pt-6 border-t" style={{ borderColor: '#E8E4DD' }}>
            <div onClick={() => setIsOpen(false)}>
              <SearchModal />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
