'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
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
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen])

  // Close on route change (redundant but safe)
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden relative p-2 rounded-lg transition-colors"
        aria-label={isOpen ? '關閉選單' : '開啟選單'}
        aria-expanded={isOpen}
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#4A5568" strokeWidth="2" strokeLinecap="round">
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

      {/* Portal to document body for overlay + panel */}
      {mounted && isOpen && createPortal(
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
        }}>
          {/* Overlay */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1,
            }}
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '320px',
              height: '100%',
              backgroundColor: '#ffffff',
              zIndex: 2,
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              overflowY: 'auto',
            }}
          >
            <div style={{ padding: '24px' }}>
              {/* Close button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    background: 'transparent',
                    color: '#4A5568',
                  }}
                  aria-label="關閉選單"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M6 6l12 12" />
                    <path d="M18 6L6 18" />
                  </svg>
                </button>
              </div>

              {/* Site title */}
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                style={{
                  display: 'block',
                  marginBottom: '32px',
                  textDecoration: 'none',
                }}
              >
                <span style={{
                  fontSize: '24px',
                  fontFamily: 'var(--font-source-serif), Georgia, serif',
                  fontWeight: 700,
                  color: '#4A5568',
                }}>
                  心靈心情
                </span>
              </Link>

              {/* Navigation links */}
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    textDecoration: 'none',
                    color: pathname === '/' ? '#6B7A64' : '#4A5568',
                    backgroundColor: pathname === '/' ? 'rgba(107,122,100,0.1)' : 'transparent',
                    fontWeight: pathname === '/' ? 600 : 400,
                  }}
                >
                  首頁
                </Link>
                <Link
                  href="/blog"
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    textDecoration: 'none',
                    color: pathname.startsWith('/blog') ? '#6B7A64' : '#4A5568',
                    backgroundColor: pathname.startsWith('/blog') ? 'rgba(107,122,100,0.1)' : 'transparent',
                    fontWeight: pathname.startsWith('/blog') ? 600 : 400,
                  }}
                >
                  全部文章
                </Link>

                {/* Category divider */}
                <div style={{ paddingTop: '16px', paddingBottom: '8px' }}>
                  <p style={{
                    padding: '0 16px',
                    fontSize: '12px',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'rgba(107,122,100,0.5)',
                  }}>
                    分類
                  </p>
                </div>

                {categories.slice(0, 4).map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/category/${cat.slug.current}`}
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: 'block',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      fontSize: '16px',
                      textDecoration: 'none',
                      color: pathname === `/category/${cat.slug.current}` ? '#6B7A64' : '#4A5568',
                      backgroundColor: pathname === `/category/${cat.slug.current}` ? 'rgba(107,122,100,0.1)' : 'transparent',
                      fontWeight: pathname === `/category/${cat.slug.current}` ? 600 : 400,
                    }}
                  >
                    {cat.title}
                  </Link>
                ))}
              </nav>

              {/* Search */}
              <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #E8E4DD' }}>
                <div onClick={() => setIsOpen(false)}>
                  <SearchModal />
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
