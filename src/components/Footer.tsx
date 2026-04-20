import Link from 'next/link'

interface Category {
  _id: string
  title: string
  slug: { current: string }
}

interface FooterProps {
  categories: Category[]
}

export default function Footer({ categories }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#1a1a1a] text-[#e5e5e5] mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-xl font-bold text-white mb-4">心靈心情</h3>
            <p className="text-sm text-[#e5e5e5]/70 leading-relaxed">
              探索內心，找尋平靜。在這裡，我們陪你一起走過生命的每一個階段。
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-medium text-white mb-4">文章分類</h4>
            <ul className="space-y-2">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat._id}>
                  <Link
                    href={`/category/${cat.slug.current}`}
                    className="text-sm text-[#e5e5e5]/70 hover:text-[#6B7A64] transition-colors"
                  >
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-medium text-white mb-4">關於我們</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-[#e5e5e5]/70 hover:text-[#6B7A64] transition-colors"
                >
                  主頁
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-sm text-[#e5e5e5]/70 hover:text-[#6B7A64] transition-colors"
                >
                  關於
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[#333] text-center">
          <p className="text-sm text-[#e5e5e5]/50">
            © {currentYear} 心靈心情. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
