import type { Metadata } from 'next'
import { Outfit, Source_Serif_4 } from 'next/font/google'
import Providers from '@/components/ThemeProvider'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: '心靈心情 | Psychology & Wellbeing',
    template: '%s | 心靈心情',
  },
  description: '探索心理學研究與日常生活的交匯點，了解你的心智如何運作，邁向更充實、更真實的人生。',
  keywords: '心理學, 情感關係, 精神健康, 生產力, 自我成長, 情緒健康, psychology, relationships, mental health, productivity',
  openGraph: {
    siteName: '心靈心情',
    type: 'website',
    locale: 'zh_HK',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" className={`${outfit.variable} ${sourceSerif.variable}`}>
      <body className="bg-cream text-earth-800 font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
