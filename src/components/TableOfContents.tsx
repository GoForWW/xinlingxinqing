'use client'

import { useState, useEffect } from 'react'
import type { TocHeading } from '@/lib/toc'

interface TableOfContentsProps {
  headings: TocHeading[]
  /** 'mobile' for collapsible inline, 'desktop' for sticky sidebar */
  variant?: 'mobile' | 'desktop'
}

function MobileTOC({ headings, activeId, handleClick, isCollapsed, setIsCollapsed }: {
  headings: TocHeading[]
  activeId: string
  handleClick: (id: string) => void
  isCollapsed: boolean
  setIsCollapsed: (v: boolean) => void
}) {
  if (headings.length === 0) return null

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex items-center justify-between w-full px-4 py-3 bg-[#F7F4EF] rounded-xl text-sm font-medium text-[#4A5568] hover:bg-[#E8E4DD] transition-colors"
      >
        <span>📖 目錄</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>
      {!isCollapsed && (
        <ul className="mt-2 space-y-1">
          {headings.map((h) => (
            <li key={h.id}>
              <button
                onClick={() => {
                  handleClick(h.id)
                  setIsCollapsed(true)
                }}
                className={`block w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
                  h.level === 3 ? 'pl-8' : ''
                } ${
                  activeId === h.id
                    ? 'bg-[#6B7A64]/10 text-[#6B7A64] font-medium'
                    : 'text-[#6B7A64]/70 hover:bg-[#F7F4EF]'
                }`}
              >
                {h.text}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function DesktopTOC({ headings, activeId, handleClick }: {
  headings: TocHeading[]
  activeId: string
  handleClick: (id: string) => void
}) {
  if (headings.length === 0) return null

  return (
    <nav aria-label="目錄">
      <div className="pl-6 border-l-2 border-[#E8E4DD]">
        <h4 className="text-sm font-semibold text-[#4A5568] mb-4 uppercase tracking-wider">目錄</h4>
        <ul className="space-y-2">
          {headings.map((h) => (
            <li key={h.id}>
              <button
                onClick={() => handleClick(h.id)}
                className={`block text-left text-sm leading-relaxed transition-colors duration-200 ${
                  h.level === 3 ? 'pl-4' : ''
                } ${
                  activeId === h.id
                    ? 'text-[#6B7A64] font-medium'
                    : 'text-[#6B7A64]/60 hover:text-[#4A5568]'
                }`}
              >
                {h.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default function TableOfContents({ headings, variant = 'mobile' }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [isCollapsed, setIsCollapsed] = useState(true)

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    )

    const els: Element[] = []
    for (const heading of headings) {
      const el = document.getElementById(heading.id)
      if (el) {
        observer.observe(el)
        els.push(el)
      }
    }

    return () => {
      for (const el of els) observer.unobserve(el)
      observer.disconnect()
    }
  }, [headings])

  if (headings.length === 0) return null

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      history.pushState(null, '', `#${id}`)
    }
  }

  if (variant === 'desktop') {
    return <DesktopTOC headings={headings} activeId={activeId} handleClick={handleClick} />
  }

  return (
    <MobileTOC
      headings={headings}
      activeId={activeId}
      handleClick={handleClick}
      isCollapsed={isCollapsed}
      setIsCollapsed={setIsCollapsed}
    />
  )
}
