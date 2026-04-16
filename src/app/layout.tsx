import type { Metadata } from 'next'
import { Outfit, Source_Serif_4 } from 'next/font/google'
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
  title: '心靈心情 | Psychology & Wellbeing',
  description: 'Exploring psychology, relationships, mental health, and productivity for a more fulfilling life.',
  keywords: 'psychology, relationships, mental health, productivity, self-improvement, emotional wellness',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${sourceSerif.variable}`}>
      <body className="bg-cream text-earth-800 font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
