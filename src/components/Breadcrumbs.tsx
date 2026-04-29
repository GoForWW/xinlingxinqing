import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null

  return (
    <nav aria-label="麵包屑導航" className="mb-6">
      <ol className="flex items-center gap-2 text-sm text-[#6B7A64]/60">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={item.href} className="flex items-center gap-2">
              {index > 0 && (
                <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 4l4 4-4 4" />
                </svg>
              )}
              {isLast ? (
                <span className="text-[#4A5568] font-medium truncate max-w-[200px]">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-[#6B7A64] transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
